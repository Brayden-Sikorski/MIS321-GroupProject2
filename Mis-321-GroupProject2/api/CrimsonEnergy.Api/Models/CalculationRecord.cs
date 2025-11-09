namespace CrimsonEnergy.Api.Models;

public sealed class CalculationRecord
{
    public int Id { get; init; }
    public int UserId { get; init; }
    public double? CarbonEmissions { get; init; }
    public double? BreakevenYears { get; init; }
    public string? CarbonDetailsJson { get; init; }
    public string? BreakevenDetailsJson { get; init; }
    public string CreatedAt { get; init; } = string.Empty;
}

