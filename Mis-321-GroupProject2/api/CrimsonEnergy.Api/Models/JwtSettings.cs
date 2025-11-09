namespace CrimsonEnergy.Api.Models;

public sealed class JwtSettings
{
    public string Secret { get; set; } = "crimson-energy-secret-key-change-in-production";
    public string Issuer { get; set; } = "CrimsonEnergy";
    public string Audience { get; set; } = "CrimsonEnergyClient";
    public int ExpirationDays { get; set; } = 7;
}

