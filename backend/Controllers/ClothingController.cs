namespace Backend.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Backend.Models.Entities;
using Backend.Repositories;
using System.Security.Claims; // ✅ Add this using

[ApiController]
[Route("api/clothing")]
[Authorize]
public class ClothingController : ControllerBase
{
    private readonly IClothingRepository _repo;

    public ClothingController(IClothingRepository repo)
    {
        _repo = repo;
    }

    // Helper property to get current user ID
    private long CurrentUserId
    {
        get
        {
            // ✅ Use ClaimTypes.NameIdentifier instead of "sub"
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier);
            if (userIdClaim == null)
            {
                throw new UnauthorizedAccessException("User ID claim not found");
            }
            return long.Parse(userIdClaim.Value);
        }
    }

    [HttpPost]
    public async Task<IActionResult> Create(ClothingItemCreateDto dto)
    {
        var item = new ClothingItem
        {
            UserId = CurrentUserId,
            Name = dto.Name,
            Category = dto.Category,
            Color = dto.Color,
            Pattern = dto.Pattern,
            Season = dto.Season,
            ImageUrl = dto.ImageUrl,
            Style = dto.Style
        };

        item.Id = await _repo.CreateAsync(item);
        return Ok(item);
    }

    [HttpPut("{id:long}")]
    public async Task<IActionResult> Update(long id, ClothingItemUpdateDto dto)
    {
        var item = new ClothingItem
        {
            Id = id,
            UserId = CurrentUserId,
            Name = dto.Name,
            Category = dto.Category,
            Color = dto.Color,
            Pattern = dto.Pattern,
            Season = dto.Season,
            ImageUrl = dto.ImageUrl,
            Style = dto.Style
        };

        var success = await _repo.UpdateAsync(item);
        return success ? Ok(item) : NotFound();
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var userId = CurrentUserId;
        var items = await _repo.GetByUserAsync(userId);
        return Ok(items);
    }

    [HttpDelete("{id:long}")]
    public async Task<IActionResult> Delete(long id)
    {
        var userId = CurrentUserId;
        return await _repo.DeleteAsync(id, userId)
            ? NoContent()
            : NotFound();
    }
}