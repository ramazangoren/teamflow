using System.ComponentModel.DataAnnotations;

public class ClothingItemUpdateDto
{
    [Required]
    [StringLength(100)]
    public string Name { get; set; } = string.Empty;

    [Required]
    public string Category { get; set; } = string.Empty;

    [Required]
    public string Color { get; set; } = string.Empty;

    public string? Pattern { get; set; }

    [Required]
    public string Season { get; set; } = string.Empty;

    public string? ImageUrl { get; set; }

    public string? Style { get; set; }
}