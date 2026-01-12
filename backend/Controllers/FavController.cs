namespace Backend.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Backend.Models.Entities;
using Backend.Repositories;
using System.Security.Claims;

[ApiController]
[Route("api/favorites")]
[Authorize]
public class FavController : ControllerBase
{
    private readonly IFavRepository _favRepo;

    public FavController(IFavRepository favRepo)
    {
        _favRepo = favRepo;
    }

    private long CurrentUserId
    {
        get
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                throw new UnauthorizedAccessException("User ID claim not found");
            }
            return long.Parse(userIdClaim.Value);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create(AddFavDto dto)
    {
        var userId = CurrentUserId;

        // Check if already favorited
        if (await _favRepo.ExistsAsync(userId, dto.ClothingItemId))
        {
            return Conflict(new { message = "Item is already in favorites" });
        }

        var favId = await _favRepo.CreateAsync(userId, dto.ClothingItemId);
        return Ok(new { id = favId, userId = userId, clothingItemId = dto.ClothingItemId });
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = CurrentUserId;
        var items = await _favRepo.GetByUserAsync(userId);
        return Ok(items);
    }

    [HttpDelete("{clothingItemId:long}")]
    public async Task<IActionResult> Delete(long clothingItemId)
    {
        var userId = CurrentUserId;
        return await _favRepo.DeleteAsync(clothingItemId, userId)
            ? NoContent()
            : NotFound();
    }
}