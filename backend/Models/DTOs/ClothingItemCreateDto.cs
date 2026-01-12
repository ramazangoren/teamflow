public class ClothingItemCreateDto
{
    public string? Name { get; set; }
    public string Category { get; set; } = null!;
    public string? Color { get; set; }
    public string? Pattern { get; set; }
    public string? Style { get; set; }
    public string Season { get; set; } = "all";
    public string ImageUrl { get; set; } = null!;
}
