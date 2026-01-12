using Backend.Data;
using Backend.Models.Entities;
using Dapper;
using System.Data;
using Backend.Repositories;

public class ClothingRepository : IClothingRepository
{
    private readonly DbConnectionFactory _db;

    public ClothingRepository(DbConnectionFactory db)
    {
        _db = db;
    }

    public async Task<long> CreateAsync(ClothingItem item)
    {
        const string sql = """
            INSERT INTO clothing_items
            (user_id, name, category, color, pattern, season, image_url, style)
            VALUES
            (@UserId, @Name, @Category, @Color, @Pattern, @Season, @ImageUrl, @Style);
            SELECT LAST_INSERT_ID();
        """;

        using IDbConnection conn = _db.CreateConnection();

        return await conn.ExecuteScalarAsync<long>(sql, item);
    }
    public async Task<bool> UpdateAsync(ClothingItem item)
    {
        const string sql = """
        UPDATE clothing_items
        SET
            name = @Name,
            category = @Category,
            color = @Color,
            pattern = @Pattern,
            season = @Season,
            image_url = @ImageUrl,
            style = @Style
        WHERE id = @Id AND user_id = @UserId;
    """;

        using IDbConnection conn = _db.CreateConnection();
        return await conn.ExecuteAsync(sql, item) > 0;
    }

    public async Task<IEnumerable<ClothingItem>> GetByUserAsync(long userId)
    {
        const string sql = """
        SELECT
            id AS Id,
            user_id AS UserId,
            name AS Name,
            category AS Category,
            color AS Color,
            pattern AS Pattern,
            season AS Season,
            image_url AS ImageUrl,
            style as Style,
            created_at AS CreatedAt
        FROM clothing_items
        WHERE user_id = @UserId
        ORDER BY created_at DESC;
    """;

        using IDbConnection conn = _db.CreateConnection();
        return await conn.QueryAsync<ClothingItem>(sql, new { UserId = userId });
    }

    public async Task<bool> DeleteAsync(long id, long userId)
    {
        const string sql = """
            DELETE FROM clothing_items
            WHERE id = @Id AND user_id = @UserId;
        """;

        using IDbConnection conn = _db.CreateConnection();
        return await conn.ExecuteAsync(sql, new { Id = id, UserId = userId }) > 0;
    }
}
