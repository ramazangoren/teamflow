namespace Backend.Models.Entities;

public class Favorite
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public long ClothingItemId { get; set; }
    public DateTime CreatedAt { get; set; }
}