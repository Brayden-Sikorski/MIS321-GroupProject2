namespace CrimsonEnergy.Api.Models;

public sealed class OpenAiOptions
{
    public string ApiKey { get; set; } = string.Empty;
    public string Model { get; set; } = "gpt-3.5-turbo";
    public int MaxTokens { get; set; } = 500;
    public double Temperature { get; set; } = 0.7;
}

