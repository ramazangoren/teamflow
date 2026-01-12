using System.ComponentModel.DataAnnotations;

public class AddFavDto
{
    [Required]
    public long ClothingItemId { get; set; }
}