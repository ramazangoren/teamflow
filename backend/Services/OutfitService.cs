using Backend.Models.Entities;

public class OutfitService
{
    private static readonly string[] NeutralColors =
        { "black", "white", "gray", "beige", "navy" };

    public int Score(ClothingItem item, string? season)
    {
        int score = 0;

        if (NeutralColors.Contains(item.Color?.ToLower()))
            score += 2;

        if (season != null && item.Season == season)
            score += 1;

        return score;
    }

    public ClothingItem PickBest(IEnumerable<ClothingItem> items, string category, string? season)
    {
        return items
            .Where(x => x.Category == category)
            .OrderByDescending(x => Score(x, season))
            .First();
    }
}
