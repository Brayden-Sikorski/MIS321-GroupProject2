using System.Text.Json.Serialization;

namespace CrimsonEnergy.Api.Requests;

public sealed class RegisterRequest
{
    [JsonPropertyName("email")]
    public string Email { get; set; } = string.Empty;

    [JsonPropertyName("password")]
    public string Password { get; set; } = string.Empty;
}

