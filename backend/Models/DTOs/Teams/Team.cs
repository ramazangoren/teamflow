namespace Backend.Models;

public class Team
{
    public Guid Id { get; set; } = default!;
    public string Name { get; set; } = default!;
    public string? Description { get; set; }
    public string? AvatarUrl { get; set; }
    public string? Settings { get; set; } // JSON string
    public DateTime CreatedAt { get; set; }
    public DateTime? DeletedAt { get; set; }
}