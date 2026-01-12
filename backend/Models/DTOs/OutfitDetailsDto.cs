public class OutfitDetailsDto
{
    public long Id { get; set; }
    public long UserId { get; set; }
    public string Occasion { get; set; } = string.Empty;
    public string Weather { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public OutfitItemDto? Top { get; set; }
    public OutfitItemDto? Bottom { get; set; }
    public OutfitItemDto? Shoes { get; set; }
    public OutfitItemDto? Accessory { get; set; }
    public OutfitItemDto? Outwear { get; set; }
    public OutfitItemDto? Hats { get; set; }
}