using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using CrimsonEnergy.Api.Models;
using Microsoft.IdentityModel.Tokens;

namespace CrimsonEnergy.Api.Services;

public sealed class TokenService
{
    private readonly JwtSettings _settings;
    private readonly SigningCredentials _credentials;

    public TokenService(JwtSettings settings)
    {
        _settings = settings;
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_settings.Secret));
        _credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
    }

    public string GenerateToken(int userId, string email)
    {
        var handler = new JwtSecurityTokenHandler();

        var claims = new List<Claim>
        {
            new("userId", userId.ToString()),
            new(JwtRegisteredClaimNames.Sub, userId.ToString()),
            new(JwtRegisteredClaimNames.Email, email),
            new(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
        };

        var expires = DateTime.UtcNow.AddDays(_settings.ExpirationDays);

        var token = new JwtSecurityToken(
            issuer: _settings.Issuer,
            audience: _settings.Audience,
            claims: claims,
            expires: expires,
            signingCredentials: _credentials);

        return handler.WriteToken(token);
    }
}

