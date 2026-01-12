namespace Backend.Models.Entities;
public class ClothingItem
{
    public long Id { get; set; }
    public long UserId { get; set; }

    public string? Name { get; set; }
    public string Category { get; set; } = null!;
    public string? Color { get; set; }
    public string? Pattern { get; set; }
    public string? Style { get; set; }
    public string Season { get; set; } = "all";
    public string ImageUrl { get; set; } = null!;

    public DateTime CreatedAt { get; set; }
}
