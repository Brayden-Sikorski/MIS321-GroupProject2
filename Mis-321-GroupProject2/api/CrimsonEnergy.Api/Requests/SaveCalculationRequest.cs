using System.Text.Json;
using System.Text.Json.Serialization;

namespace CrimsonEnergy.Api.Requests;

public sealed class SaveCalculationRequest
{
    [JsonPropertyName("carbonEmissions")]
    public double? CarbonEmissions { get; set; }

    [JsonPropertyName("breakevenYears")]
    public double? BreakevenYears { get; set; }

    [JsonPropertyName("carbonDetails")]
    public JsonElement? CarbonDetails { get; set; }

    [JsonPropertyName("breakevenDetails")]
    public JsonElement? BreakevenDetails { get; set; }
}

