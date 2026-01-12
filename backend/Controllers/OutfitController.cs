using Dapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using System.Data;
using Backend.Models.Entities;
using System.Security.Claims;

namespace Backend.Controllers;

[ApiController]
[Route("api/outfits")]
[Authorize]
public class OutfitController : ControllerBase
{
    private readonly DbConnectionFactory _db;

    public OutfitController(DbConnectionFactory db)
    {
        _db = db;
    }

    private long CurrentUserId
    {
        get
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (claim == null)
                throw new UnauthorizedAccessException("User ID claim not found");

            return long.Parse(claim.Value);
        }
    }

    [HttpPost]
    public async Task<IActionResult> SaveOutfit([FromBody] SaveOutfitDto dto)
    {
        var userId = CurrentUserId;

        using IDbConnection conn = _db.CreateConnection();
        conn.Open();
        using var tx = conn.BeginTransaction();

        try
        {
            var itemIds = BuildItemIdList(dto);

            if (!await ValidateItemsOwnership(conn, tx, itemIds, userId))
            {
                tx.Rollback();
                return BadRequest("One or more clothing items do not belong to you.");
            }

            var outfitId = await InsertOutfit(conn, tx, userId, dto);
            await InsertOutfitItems(conn, tx, outfitId, itemIds);

            tx.Commit();

            return Ok(new
            {
                Id = outfitId,
                UserId = userId,
                dto.TopId,
                dto.BottomId,
                dto.ShoesId,
                dto.AccessoryId,
                dto.OutwearId,
                dto.HatsId,
                dto.Occasion,
                dto.Weather,
                CreatedAt = DateTime.UtcNow
            });
        }
        catch (Exception ex)
        {
            tx.Rollback();
            return StatusCode(500, $"Error saving outfit: {ex.Message}");
        }
    }

    [HttpGet]
    public async Task<IActionResult> GetAllOutfits()
    {
        var userId = CurrentUserId;

        const string sql = """
            SELECT
                o.id          AS Id,
                o.user_id     AS UserId,
                o.occasion    AS Occasion,
                o.weather     AS Weather,
                o.created_at  AS CreatedAt,
                c.id          AS Id,
                c.name        AS Name,
                c.category    AS Category,
                c.image_url   AS ImageUrl
            FROM outfits o
            JOIN outfit_items oi ON oi.outfit_id = o.id
            JOIN clothing_items c ON c.id = oi.clothing_item_id
            WHERE o.user_id = @UserId
            ORDER BY o.created_at DESC;
        """;

        using IDbConnection conn = _db.CreateConnection();
        var outfitDict = new Dictionary<long, OutfitDetailsDto>();

        await conn.QueryAsync<OutfitDetailsDto, OutfitItemDto, OutfitDetailsDto>(
            sql,
            (outfit, item) =>
            {
                if (!outfitDict.TryGetValue(outfit.Id, out var existing))
                {
                    existing = outfit;
                    outfitDict[outfit.Id] = existing;
                }

                MapItemToOutfit(existing, item);
                return existing;
            },
            new { UserId = userId },
            splitOn: "Id"
        );

        return Ok(outfitDict.Values);
    }

    [HttpGet("{id:long}")]
    public async Task<IActionResult> GetOutfit(long id)
    {
        var userId = CurrentUserId;

        const string sql = """
            SELECT
                o.id          AS Id,
                o.user_id     AS UserId,
                o.occasion    AS Occasion,
                o.weather     AS Weather,
                o.created_at  AS CreatedAt,
                c.id          AS Id,
                c.name        AS Name,
                c.category    AS Category,
                c.image_url   AS ImageUrl
            FROM outfits o
            JOIN outfit_items oi ON oi.outfit_id = o.id
            JOIN clothing_items c ON c.id = oi.clothing_item_id
            WHERE o.id = @Id AND o.user_id = @UserId;
        """;

        using IDbConnection conn = _db.CreateConnection();
        OutfitDetailsDto? outfit = null;

        await conn.QueryAsync<OutfitDetailsDto, OutfitItemDto, OutfitDetailsDto>(
            sql,
            (o, item) =>
            {
                outfit ??= o;
                MapItemToOutfit(outfit, item);
                return o;
            },
            new { Id = id, UserId = userId },
            splitOn: "Id"
        );

        return outfit == null
            ? NotFound("Outfit not found.")
            : Ok(outfit);
    }

    [HttpPut("{id:long}")]
    public async Task<IActionResult> UpdateOutfit(long id, [FromBody] UpdateOutfitDto dto)
    {
        var userId = CurrentUserId;

        using IDbConnection conn = _db.CreateConnection();

        const string sql = """
            UPDATE outfits
            SET occasion = COALESCE(@Occasion, occasion),
                weather  = COALESCE(@Weather, weather)
            WHERE id = @Id AND user_id = @UserId;
        """;

        var rows = await conn.ExecuteAsync(
            sql,
            new { Id = id, UserId = userId, dto.Occasion, dto.Weather }
        );

        return rows == 0
            ? NotFound("Outfit not found.")
            : Ok(new { Message = "Outfit updated successfully." });
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> DeleteOutfit(long id)
    {
        var userId = CurrentUserId;

        using IDbConnection conn = _db.CreateConnection();
        conn.Open();
        using var tx = conn.BeginTransaction();

        try
        {
            await conn.ExecuteAsync(
                "DELETE FROM outfit_items WHERE outfit_id = @Id;",
                new { Id = id },
                tx
            );

            var rows = await conn.ExecuteAsync(
                "DELETE FROM outfits WHERE id = @Id AND user_id = @UserId;",
                new { Id = id, UserId = userId },
                tx
            );

            if (rows == 0)
            {
                tx.Rollback();
                return NotFound("Outfit not found.");
            }

            tx.Commit();
            return Ok(new { Message = "Outfit deleted successfully." });
        }
        catch (Exception ex)
        {
            tx.Rollback();
            return StatusCode(500, $"Error deleting outfit: {ex.Message}");
        }
    }

    // Private helper methods
    private static List<long> BuildItemIdList(SaveOutfitDto dto)
    {
        var itemIds = new List<long>
        {
            dto.TopId,
            dto.BottomId,
            dto.ShoesId
        };

        if (dto.AccessoryId.HasValue)
            itemIds.Add(dto.AccessoryId.Value);

        if (dto.OutwearId.HasValue)
            itemIds.Add(dto.OutwearId.Value);

        if (dto.HatsId.HasValue)
            itemIds.Add(dto.HatsId.Value);

        return itemIds;
    }

    private static async Task<bool> ValidateItemsOwnership(
        IDbConnection conn,
        IDbTransaction tx,
        List<long> itemIds,
        long userId)
    {
        const string sql = """
            SELECT COUNT(*)
            FROM clothing_items
            WHERE id IN @ItemIds AND user_id = @UserId;
        """;

        var validItemsCount = await conn.ExecuteScalarAsync<int>(
            sql,
            new { ItemIds = itemIds, UserId = userId },
            tx
        );

        return validItemsCount == itemIds.Count;
    }

    private static async Task<long> InsertOutfit(
        IDbConnection conn,
        IDbTransaction tx,
        long userId,
        SaveOutfitDto dto)
    {
        const string sql = """
            INSERT INTO outfits (user_id, occasion, weather, created_at)
            VALUES (@UserId, @Occasion, @Weather, @CreatedAt);
            SELECT LAST_INSERT_ID();
        """;

        return await conn.ExecuteScalarAsync<long>(
            sql,
            new
            {
                UserId = userId,
                dto.Occasion,
                dto.Weather,
                CreatedAt = DateTime.UtcNow
            },
            tx
        );
    }

    private static async Task InsertOutfitItems(
        IDbConnection conn,
        IDbTransaction tx,
        long outfitId,
        List<long> itemIds)
    {
        const string sql = """
            INSERT INTO outfit_items (outfit_id, clothing_item_id)
            VALUES (@OutfitId, @ClothingItemId);
        """;

        foreach (var itemId in itemIds)
        {
            await conn.ExecuteAsync(
                sql,
                new { OutfitId = outfitId, ClothingItemId = itemId },
                tx
            );
        }
    }

    private static void MapItemToOutfit(OutfitDetailsDto outfit, OutfitItemDto item)
    {
        switch (item.Category.ToLowerInvariant())
        {
            case "tops":
                outfit.Top = item;
                break;
            case "bottoms":
                outfit.Bottom = item;
                break;
            case "shoes":
                outfit.Shoes = item;
                break;
            case "accessories":
                outfit.Accessory = item;
                break;
            case "outerwear":
                outfit.Outwear = item;
                break;
            case "hats":
                outfit.Hats = item;
                break;
        }
    }
}


// using Dapper;
// using Microsoft.AspNetCore.Authorization;
// using Microsoft.AspNetCore.Mvc;
// using Backend.Data;
// using System.Data;
// using Backend.Models.Entities;
// using System.Security.Claims;

// namespace Backend.Controllers;

// [ApiController]
// [Route("api/outfits")]
// [Authorize]
// public class OutfitController : ControllerBase
// {
//     private readonly DbConnectionFactory _db;

//     public OutfitController(DbConnectionFactory db)
//     {
//         _db = db;
//     }

//     private long CurrentUserId
//     {
//         get
//         {
//             var claim = User.FindFirst(ClaimTypes.NameIdentifier);
//             if (claim == null)
//                 throw new UnauthorizedAccessException("User ID claim not found");

//             return long.Parse(claim.Value);
//         }
//     }


//     [HttpPost]
//     public async Task<IActionResult> SaveOutfit([FromBody] SaveOutfitDto dto)
//     {
//         // With ApiController + validation attributes,
//         // dto is guaranteed to be valid here
//         var userId = CurrentUserId;

//         using IDbConnection conn = _db.CreateConnection();
//         conn.Open();
//         using var tx = conn.BeginTransaction();

//         try
//         {
//             var itemIds = new List<long>
//             {
//                 dto.TopId,
//                 dto.BottomId,
//                 dto.ShoesId
//             };

//             if (dto.AccessoryId.HasValue)
//                 itemIds.Add(dto.AccessoryId.Value);

//             const string verifyItemsSql = """
//                 SELECT COUNT(*)
//                 FROM clothing_items
//                 WHERE id IN @ItemIds AND user_id = @UserId;
//             """;

//             var validItemsCount = await conn.ExecuteScalarAsync<int>(
//                 verifyItemsSql,
//                 new { ItemIds = itemIds, UserId = userId },
//                 tx
//             );

//             if (validItemsCount != itemIds.Count)
//             {
//                 tx.Rollback();
//                 return BadRequest("One or more clothing items do not belong to you.");
//             }

//             const string insertOutfitSql = """
//                 INSERT INTO outfits (user_id, occasion, weather, created_at)
//                 VALUES (@UserId, @Occasion, @Weather, @CreatedAt);
//                 SELECT LAST_INSERT_ID();
//             """;

//             var outfitId = await conn.ExecuteScalarAsync<long>(
//                 insertOutfitSql,
//                 new
//                 {
//                     UserId = userId,
//                     dto.Occasion,
//                     dto.Weather,
//                     CreatedAt = DateTime.UtcNow
//                 },
//                 tx
//             );

//             const string insertOutfitItemSql = """
//                 INSERT INTO outfit_items (outfit_id, clothing_item_id)
//                 VALUES (@OutfitId, @ClothingItemId);
//             """;

//             foreach (var itemId in itemIds)
//             {
//                 await conn.ExecuteAsync(
//                     insertOutfitItemSql,
//                     new { OutfitId = outfitId, ClothingItemId = itemId },
//                     tx
//                 );
//             }

//             tx.Commit();

//             return Ok(new
//             {
//                 Id = outfitId,
//                 UserId = userId,
//                 dto.TopId,
//                 dto.BottomId,
//                 dto.ShoesId,
//                 dto.AccessoryId,
//                 dto.Occasion,
//                 dto.Weather,
//                 CreatedAt = DateTime.UtcNow
//             });
//         }
//         catch (Exception ex)
//         {
//             tx.Rollback();
//             return StatusCode(500, $"Error saving outfit: {ex.Message}");
//         }
//     }


//     [HttpGet]
//     public async Task<IActionResult> GetAllOutfits()
//     {
//         var userId = CurrentUserId;

//         const string sql = """
//             SELECT
//                 o.id          AS Id,
//                 o.user_id     AS UserId,
//                 o.occasion    AS Occasion,
//                 o.weather     AS Weather,
//                 o.created_at  AS CreatedAt,
//                 c.id          AS Id,
//                 c.name        AS Name,
//                 c.category    AS Category,
//                 c.image_url   AS ImageUrl
//             FROM outfits o
//             JOIN outfit_items oi ON oi.outfit_id = o.id
//             JOIN clothing_items c ON c.id = oi.clothing_item_id
//             WHERE o.user_id = @UserId
//             ORDER BY o.created_at DESC;
//         """;

//         using IDbConnection conn = _db.CreateConnection();
//         var outfitDict = new Dictionary<long, OutfitDetailsDto>();

//         await conn.QueryAsync<OutfitDetailsDto, OutfitItemDto, OutfitDetailsDto>(
//             sql,
//             (outfit, item) =>
//             {
//                 if (!outfitDict.TryGetValue(outfit.Id, out var existing))
//                 {
//                     existing = outfit;
//                     outfitDict[outfit.Id] = existing;
//                 }

//                 if (string.Equals(item.Category, "Tops", StringComparison.OrdinalIgnoreCase))
//                     existing.Top = item;
//                 else if (string.Equals(item.Category, "Bottoms", StringComparison.OrdinalIgnoreCase))
//                     existing.Bottom = item;
//                 else if (string.Equals(item.Category, "Shoes", StringComparison.OrdinalIgnoreCase))
//                     existing.Shoes = item;
//                 else if (string.Equals(item.Category, "Accessories", StringComparison.OrdinalIgnoreCase))
//                     existing.Accessory = item;

//                 return existing;
//             },
//             new { UserId = userId },
//             splitOn: "Id"
//         );

//         return Ok(outfitDict.Values);
//     }


//     [HttpGet("{id:long}")]
//     public async Task<IActionResult> GetOutfit(long id)
//     {
//         var userId = CurrentUserId;

//         const string sql = """
//             SELECT
//                 o.id          AS Id,
//                 o.user_id     AS UserId,
//                 o.occasion    AS Occasion,
//                 o.weather     AS Weather,
//                 o.created_at  AS CreatedAt,
//                 c.id          AS Id,
//                 c.name        AS Name,
//                 c.category    AS Category,
//                 c.image_url   AS ImageUrl
//             FROM outfits o
//             JOIN outfit_items oi ON oi.outfit_id = o.id
//             JOIN clothing_items c ON c.id = oi.clothing_item_id
//             WHERE o.id = @Id AND o.user_id = @UserId;
//         """;

//         using IDbConnection conn = _db.CreateConnection();
//         OutfitDetailsDto? outfit = null;

//         await conn.QueryAsync<OutfitDetailsDto, OutfitItemDto, OutfitDetailsDto>(
//             sql,
//             (o, item) =>
//             {
//                 outfit ??= o;

//                 if (string.Equals(item.Category, "Tops", StringComparison.OrdinalIgnoreCase))
//                     outfit.Top = item;
//                 else if (string.Equals(item.Category, "Bottoms", StringComparison.OrdinalIgnoreCase))
//                     outfit.Bottom = item;
//                 else if (string.Equals(item.Category, "Shoes", StringComparison.OrdinalIgnoreCase))
//                     outfit.Shoes = item;
//                 else if (string.Equals(item.Category, "Accessories", StringComparison.OrdinalIgnoreCase))
//                     outfit.Accessory = item;

//                 return o;
//             },
//             new { Id = id, UserId = userId },
//             splitOn: "Id"
//         );

//         return outfit == null
//             ? NotFound("Outfit not found.")
//             : Ok(outfit);
//     }


//     [HttpPut("{id:long}")]
//     public async Task<IActionResult> UpdateOutfit(long id, [FromBody] UpdateOutfitDto dto)
//     {
//         var userId = CurrentUserId;

//         using IDbConnection conn = _db.CreateConnection();

//         const string sql = """
//             UPDATE outfits
//             SET occasion = COALESCE(@Occasion, occasion),
//                 weather  = COALESCE(@Weather, weather)
//             WHERE id = @Id AND user_id = @UserId;
//         """;

//         var rows = await conn.ExecuteAsync(
//             sql,
//             new { Id = id, UserId = userId, dto.Occasion, dto.Weather }
//         );

//         return rows == 0
//             ? NotFound("Outfit not found.")
//             : Ok(new { Message = "Outfit updated successfully." });
//     }


//     [HttpDelete("{id:long}")]
//     public async Task<IActionResult> DeleteOutfit(long id)
//     {
//         var userId = CurrentUserId;

//         using IDbConnection conn = _db.CreateConnection();
//         conn.Open();
//         using var tx = conn.BeginTransaction();

//         try
//         {
//             await conn.ExecuteAsync(
//                 "DELETE FROM outfit_items WHERE outfit_id = @Id;",
//                 new { Id = id },
//                 tx
//             );

//             var rows = await conn.ExecuteAsync(
//                 "DELETE FROM outfits WHERE id = @Id AND user_id = @UserId;",
//                 new { Id = id, UserId = userId },
//                 tx
//             );

//             if (rows == 0)
//             {
//                 tx.Rollback();
//                 return NotFound("Outfit not found.");
//             }

//             tx.Commit();
//             return Ok(new { Message = "Outfit deleted successfully." });
//         }
//         catch (Exception ex)
//         {
//             tx.Rollback();
//             return StatusCode(500, $"Error deleting outfit: {ex.Message}");
//         }
//     }
// }
