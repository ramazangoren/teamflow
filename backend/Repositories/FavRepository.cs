using Backend.Data;
using Backend.Models.Entities;
using Dapper;
using System.Data;
using Backend.Repositories;

public class FavRepository : IFavRepository
{
    private readonly DbConnectionFactory _db;

    public FavRepository(DbConnectionFactory db)
    {
        _db = db;
    }

    public async Task<long> CreateAsync(long userId, long clothingItemId)
    {
        const string sql = """
            INSERT INTO favorites (user_id, clothing_item_id)
            VALUES (@UserId, @ClothingItemId);
            SELECT LAST_INSERT_ID();
        """;

        using IDbConnection conn = _db.CreateConnection();
        return await conn.ExecuteScalarAsync<long>(sql, new { UserId = userId, ClothingItemId = clothingItemId });
    }

    public async Task<IEnumerable<ClothingItem>> GetByUserAsync(long userId)
    {
        const string sql = """
            SELECT
                c.id AS Id,
                c.user_id AS UserId,
                c.name AS Name,
                c.category AS Category,
                c.color AS Color,
                c.pattern AS Pattern,
                c.season AS Season,
                c.image_url AS ImageUrl,
                c.style AS Style,
                c.created_at AS CreatedAt
            FROM clothing_items c
            INNER JOIN favorites f ON c.id = f.clothing_item_id
            WHERE f.user_id = @UserId
            ORDER BY f.created_at DESC;
        """;

        using IDbConnection conn = _db.CreateConnection();
        return await conn.QueryAsync<ClothingItem>(sql, new { UserId = userId });
    }

    public async Task<bool> DeleteAsync(long clothingItemId, long userId)
    {
        const string sql = """
            DELETE FROM favorites
            WHERE clothing_item_id = @ClothingItemId AND user_id = @UserId;
        """;

        using IDbConnection conn = _db.CreateConnection();
        return await conn.ExecuteAsync(sql, new { ClothingItemId = clothingItemId, UserId = userId }) > 0;
    }

    public async Task<bool> ExistsAsync(long userId, long clothingItemId)
    {
        const string sql = """
            SELECT COUNT(1)
            FROM favorites
            WHERE user_id = @UserId AND clothing_item_id = @ClothingItemId;
        """;

        using IDbConnection conn = _db.CreateConnection();
        return await conn.ExecuteScalarAsync<int>(sql, new { UserId = userId, ClothingItemId = clothingItemId }) > 0;
    }
}