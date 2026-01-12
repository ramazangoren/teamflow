public class OutfitFeedback
{
    public long Id { get; set; }
    public long OutfitId { get; set; }
    public long UserId { get; set; }

    public int Rating { get; set; }
    public bool Liked { get; set; }

    public DateTime CreatedAt { get; set; }
}
