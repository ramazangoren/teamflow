namespace Backend.Models;

public class Project
{
    public Guid Id { get; set; }
    public string TeamId { get; set; } = string.Empty;

    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }

    public DateTime CreatedAt { get; set; }
}
