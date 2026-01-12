using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using System.Data;
using Backend.Models.Entities;  // ← ADD THIS LINE


[ApiController]
[Route("api/outfits/{outfitId:long}/feedback")]
[Authorize]
public class OutfitFeedbackController : ControllerBase
{
    private readonly DbConnectionFactory _db;

    public OutfitFeedbackController(DbConnectionFactory db)
    {
        _db = db;
    }

    [HttpPost]
    public async Task<IActionResult> Create(long outfitId, [FromBody] OutfitFeedbackDto dto)
    {
        var userId = long.Parse(User.FindFirst("id")!.Value);

        const string sql = """
            INSERT INTO outfit_feedback
            (outfit_id, user_id, rating, liked)
            VALUES
            (@OutfitId, @UserId, @Rating, @Liked);
        """;

        using IDbConnection conn = _db.CreateConnection();

        await conn.ExecuteAsync(sql, new
        {
            OutfitId = outfitId,
            UserId = userId,
            dto.Rating,
            dto.Liked
        });

        return Ok();
    }
}
