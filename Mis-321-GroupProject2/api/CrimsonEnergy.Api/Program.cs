using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using CrimsonEnergy.Api.Data;
using CrimsonEnergy.Api.Models;
using CrimsonEnergy.Api.Requests;
using CrimsonEnergy.Api.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

LoadEnvFile(Path.Combine(builder.Environment.ContentRootPath, "..", ".env"));
LoadEnvFile(Path.Combine(builder.Environment.ContentRootPath, ".env"));

builder.Configuration.AddEnvironmentVariables();
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod());
});

var configuredUrls = builder.Configuration["ASPNETCORE_URLS"] ?? builder.Configuration["urls"];
if (string.IsNullOrWhiteSpace(configuredUrls))
{
    builder.WebHost.UseUrls("http://0.0.0.0:3000");
}

var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>() ?? new JwtSettings();
if (string.IsNullOrWhiteSpace(jwtSettings.Secret))
{
    jwtSettings.Secret = builder.Configuration["JWT_SECRET"] ?? jwtSettings.Secret;
}
if (string.IsNullOrWhiteSpace(jwtSettings.Secret))
{
    throw new InvalidOperationException("JWT secret not configured. Set JwtSettings:Secret or JWT_SECRET.");
}

var openAiOptions = builder.Configuration.GetSection("OpenAI").Get<OpenAiOptions>() ?? new OpenAiOptions();
if (string.IsNullOrWhiteSpace(openAiOptions.ApiKey))
{
    openAiOptions.ApiKey = builder.Configuration["OPENAI_API_KEY"] ?? string.Empty;
}

builder.Services.AddSingleton(jwtSettings);
builder.Services.AddSingleton(openAiOptions);
builder.Services.AddSingleton<TokenService>();
builder.Services.AddSingleton<SqliteConnectionFactory>();
builder.Services.AddSingleton<DatabaseInitializer>();
builder.Services.AddScoped<UserRepository>();
builder.Services.AddScoped<CalculationRepository>();
builder.Services.AddHttpClient<ChatService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtSettings.Issuer,
            ValidAudience = jwtSettings.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.Secret)),
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });

builder.Services.AddAuthorization();

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var initializer = scope.ServiceProvider.GetRequiredService<DatabaseInitializer>();
    await initializer.InitializeAsync();
}

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/api/health", () => Results.Json(new { status = "ok", message = "Crimson Energy API is running" }));

var authGroup = app.MapGroup("/api/auth");

authGroup.MapPost("/register", async (
    RegisterRequest request,
    UserRepository userRepository,
    TokenService tokenService,
    CancellationToken cancellationToken) =>
{
    if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest(new { error = "Email and password are required" });
    }

    if (request.Password.Length < 6)
    {
        return Results.BadRequest(new { error = "Password must be at least 6 characters" });
    }

    var existingUser = await userRepository.GetByEmailAsync(request.Email, cancellationToken);
    if (existingUser is not null)
    {
        return Results.BadRequest(new { error = "User already exists" });
    }

    var hashedPassword = BCrypt.Net.BCrypt.HashPassword(request.Password);
    var userId = await userRepository.CreateAsync(request.Email, hashedPassword, cancellationToken);
    var token = tokenService.GenerateToken(userId, request.Email);

    return Results.Json(new
    {
        message = "User created successfully",
        token,
        user = new { id = userId, email = request.Email }
    }, statusCode: StatusCodes.Status201Created);
});

authGroup.MapPost("/login", async (
    LoginRequest request,
    UserRepository userRepository,
    TokenService tokenService,
    CancellationToken cancellationToken) =>
{
    if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
    {
        return Results.BadRequest(new { error = "Email and password are required" });
    }

    var user = await userRepository.GetByEmailAsync(request.Email, cancellationToken);
    if (user is null)
    {
        return Results.Json(new { error = "Invalid email or password" }, statusCode: StatusCodes.Status401Unauthorized);
    }

    var validPassword = BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash);
    if (!validPassword)
    {
        return Results.Json(new { error = "Invalid email or password" }, statusCode: StatusCodes.Status401Unauthorized);
    }

    var token = tokenService.GenerateToken(user.Id, user.Email);

    return Results.Json(new
    {
        message = "Login successful",
        token,
        user = new { id = user.Id, email = user.Email }
    });
});

authGroup.MapGet("/verify", (ClaimsPrincipal principal) =>
{
    var userId = GetUserId(principal);
    if (userId is null)
    {
        return Results.Json(new { error = "Invalid token" }, statusCode: StatusCodes.Status401Unauthorized);
    }

    var email = principal.FindFirstValue(ClaimTypes.Email) ?? principal.FindFirstValue(JwtRegisteredClaimNames.Email);
    var exp = principal.FindFirstValue(JwtRegisteredClaimNames.Exp);
    var iat = principal.FindFirstValue(JwtRegisteredClaimNames.Iat);

    return Results.Json(new
    {
        valid = true,
        user = new
        {
            userId = userId.Value,
            email,
            exp,
            iat
        }
    });
}).RequireAuthorization();

var userGroup = app.MapGroup("/api/user")
    .RequireAuthorization();

userGroup.MapPost("/save-calculation", async (
    ClaimsPrincipal principal,
    SaveCalculationRequest request,
    CalculationRepository calculationRepository,
    CancellationToken cancellationToken) =>
{
    var userId = GetUserId(principal);
    if (userId is null)
    {
        return Results.Json(new { error = "Invalid token" }, statusCode: StatusCodes.Status401Unauthorized);
    }

    var carbonDetailsJson = request.CarbonDetails.HasValue ? request.CarbonDetails.Value.GetRawText() : null;
    var breakevenDetailsJson = request.BreakevenDetails.HasValue ? request.BreakevenDetails.Value.GetRawText() : null;

    var id = await calculationRepository.InsertCalculationAsync(
        userId.Value,
        request.CarbonEmissions,
        request.BreakevenYears,
        carbonDetailsJson,
        breakevenDetailsJson,
        cancellationToken);

    return Results.Json(new { message = "Calculation saved successfully", id });
});

userGroup.MapGet("/profile", async (
    ClaimsPrincipal principal,
    UserRepository userRepository,
    CalculationRepository calculationRepository,
    CancellationToken cancellationToken) =>
{
    var userId = GetUserId(principal);
    if (userId is null)
    {
        return Results.Json(new { error = "Invalid token" }, statusCode: StatusCodes.Status401Unauthorized);
    }

    var user = await userRepository.GetByIdAsync(userId.Value, cancellationToken);
    if (user is null)
    {
        return Results.NotFound(new { error = "User not found" });
    }

    var latestCarbon = await calculationRepository.GetLatestCarbonAsync(userId.Value, cancellationToken);
    var latestBreakeven = await calculationRepository.GetLatestBreakevenAsync(userId.Value, cancellationToken);

    var carbonDetails = ParseJsonElement(latestCarbon?.CarbonDetailsJson);
    var breakevenDetails = ParseJsonElement(latestBreakeven?.BreakevenDetailsJson);

    return Results.Json(new
    {
        user = new
        {
            id = user.Id,
            email = user.Email,
            createdAt = user.CreatedAt
        },
        latestCarbon = latestCarbon is null
            ? null
            : new
            {
                id = latestCarbon.Id,
                carbonEmissions = latestCarbon.CarbonEmissions,
                carbonDetails,
                createdAt = latestCarbon.CreatedAt
            },
        latestBreakeven = latestBreakeven is null
            ? null
            : new
            {
                id = latestBreakeven.Id,
                breakevenYears = latestBreakeven.BreakevenYears,
                breakevenDetails,
                createdAt = latestBreakeven.CreatedAt
            }
    });
});

var chatGroup = app.MapGroup("/api/chat");

chatGroup.MapPost("/message", async (
    ChatMessageRequest request,
    ChatService chatService,
    CancellationToken cancellationToken) =>
{
    if (string.IsNullOrWhiteSpace(request.Message))
    {
        return Results.BadRequest(new { error = "Message is required" });
    }

    try
    {
        var response = await chatService.SendMessageAsync(request.Message, cancellationToken);
        return Results.Json(new { response });
    }
    catch (InvalidOperationException ex) when (ex.Message.Contains("API key", StringComparison.OrdinalIgnoreCase))
    {
        return Results.Json(new { error = ex.Message }, statusCode: StatusCodes.Status500InternalServerError);
    }
    catch (Exception ex)
    {
        return Results.Json(new { error = ex.Message }, statusCode: StatusCodes.Status500InternalServerError);
    }
});

app.Run();

static int? GetUserId(ClaimsPrincipal principal)
{
    var userIdClaim = principal.FindFirst("userId")
                      ?? principal.FindFirst(ClaimTypes.NameIdentifier)
                      ?? principal.FindFirst(JwtRegisteredClaimNames.Sub);

    return int.TryParse(userIdClaim?.Value, out var id) ? id : null;
}

static object? ParseJsonElement(string? json)
{
    if (string.IsNullOrWhiteSpace(json))
    {
        return null;
    }

    return JsonSerializer.Deserialize<object>(json);
}

static void LoadEnvFile(string filePath)
{
    if (!File.Exists(filePath))
    {
        return;
    }

    foreach (var line in File.ReadAllLines(filePath))
    {
        if (string.IsNullOrWhiteSpace(line) || line.TrimStart().StartsWith('#'))
        {
            continue;
        }

        var separatorIndex = line.IndexOf('=', StringComparison.Ordinal);
        if (separatorIndex <= 0)
        {
            continue;
        }

        var key = line[..separatorIndex].Trim();
        var value = line[(separatorIndex + 1)..].Trim().Trim('"');

        Environment.SetEnvironmentVariable(key, value);
    }
}
