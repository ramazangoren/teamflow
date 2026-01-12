using System.ComponentModel.DataAnnotations;

public class SaveOutfitDto
{
    [Required]
    [Range(1, long.MaxValue)]
    public long TopId { get; set; }

    [Required]
    [Range(1, long.MaxValue)]
    public long BottomId { get; set; }

    [Required]
    [Range(1, long.MaxValue)]
    public long ShoesId { get; set; }

    public long? AccessoryId { get; set; }
    public long? OutwearId { get; set; }
    public long? HatsId { get; set; }

    [MaxLength(100)]
    public string? Occasion { get; set; }

    [MaxLength(100)]
    public string? Weather { get; set; }
}
