namespace CrimsonEnergy.Api.Models;

public sealed class UserRecord
{
    public int Id { get; init; }
    public string Email { get; init; } = string.Empty;
    public string PasswordHash { get; init; } = string.Empty;
    public string CreatedAt { get; init; } = string.Empty;
}

