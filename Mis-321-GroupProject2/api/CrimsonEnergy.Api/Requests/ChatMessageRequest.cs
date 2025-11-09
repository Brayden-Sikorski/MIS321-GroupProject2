using System.Text.Json.Serialization;

namespace CrimsonEnergy.Api.Requests;

public sealed class ChatMessageRequest
{
    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;
}

