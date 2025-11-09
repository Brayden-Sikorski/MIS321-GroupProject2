using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using CrimsonEnergy.Api.Models;

namespace CrimsonEnergy.Api.Services;

public sealed class ChatService
{
    private const string OpenAiChatEndpoint = "https://api.openai.com/v1/chat/completions";

    private readonly HttpClient _httpClient;
    private readonly OpenAiOptions _options;
    private readonly ILogger<ChatService> _logger;

    public ChatService(HttpClient httpClient, OpenAiOptions options, ILogger<ChatService> logger)
    {
        _httpClient = httpClient;
        _options = options;
        _logger = logger;
    }

    public async Task<string> SendMessageAsync(string message, CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(_options.ApiKey))
        {
            throw new InvalidOperationException("OpenAI API key not configured. Set OPENAI_API_KEY or OpenAI:ApiKey.");
        }

        var payload = new
        {
            model = _options.Model,
            messages = new[]
            {
                new { role = "system", content = "You are a helpful solar energy and clean energy expert assistant for Crimson Energy Initiative. Help users with questions about solar panels, renewable energy options, local pricing, installation advice, and environmental benefits. Be informative, friendly, and encourage sustainable practices." },
                new { role = "user", content = message }
            },
            max_tokens = _options.MaxTokens,
            temperature = _options.Temperature
        };

        using var request = new HttpRequestMessage(HttpMethod.Post, OpenAiChatEndpoint);
        request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", _options.ApiKey);
        request.Content = new StringContent(JsonSerializer.Serialize(payload), Encoding.UTF8, "application/json");

        using var response = await _httpClient.SendAsync(request, cancellationToken);
        var responseBody = await response.Content.ReadAsStringAsync(cancellationToken);

        if (!response.IsSuccessStatusCode)
        {
            _logger.LogError("OpenAI API error: {Status} {Body}", response.StatusCode, responseBody);
            throw new InvalidOperationException($"Failed to get response from AI: {responseBody}");
        }

        try
        {
            using var document = JsonDocument.Parse(responseBody);
            var choices = document.RootElement.GetProperty("choices");
            if (choices.GetArrayLength() == 0)
            {
                throw new InvalidOperationException("OpenAI response did not contain any choices.");
            }

            var content = choices[0].GetProperty("message").GetProperty("content").GetString();
            return content ?? string.Empty;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to parse OpenAI response: {Body}", responseBody);
            throw new InvalidOperationException("Failed to parse response from AI.");
        }
    }
}

