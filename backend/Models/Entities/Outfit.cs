public class Outfit
{
    public long Id { get; set; }
    public long UserId { get; set; }

    public string? Occasion { get; set; }
    public string? Weather { get; set; }

    public DateTime CreatedAt { get; set; }
}
