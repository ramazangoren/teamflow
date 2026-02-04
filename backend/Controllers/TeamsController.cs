using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Backend.Services.Interfaces;
using Backend.DTOs.Teams;
using System.Security.Claims;

namespace Backend.Controllers;

[Authorize]
[ApiController]
[Route("api/teams")]
public class TeamsController : ControllerBase
{
    private readonly ITeamService _teamService;

    public TeamsController(ITeamService teamService)
    {
        _teamService = teamService;
    }

    private Guid GetUserId()
    {
        var value = User.FindFirstValue(ClaimTypes.NameIdentifier);
        if (!Guid.TryParse(value, out var userId))
            throw new UnauthorizedAccessException("Invalid user id");

        return userId;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateTeamDto dto)
    {
        var team = await _teamService.CreateAsync(dto, GetUserId());
        return CreatedAtAction(nameof(GetById), new { teamId = team.Id }, team);
    }

    [HttpGet]
    public async Task<IActionResult> GetMine()
    {
        return Ok(await _teamService.GetForUserAsync(GetUserId()));
    }

    [HttpGet("{teamId:guid}")]
    public async Task<IActionResult> GetById(Guid teamId)
    {
        return Ok(await _teamService.GetByIdAsync(teamId, GetUserId()));
    }

    [HttpPut("{teamId:guid}")]
    public async Task<IActionResult> Update(Guid teamId, UpdateTeamDto dto)
    {
        return Ok(await _teamService.UpdateAsync(teamId, dto, GetUserId()));
    }

    [HttpDelete("{teamId:guid}")]
    public async Task<IActionResult> Delete(Guid teamId)
    {
        await _teamService.DeleteAsync(teamId, GetUserId());
        return NoContent();
    }

    [HttpPost("{teamId:guid}/members")]
    public async Task<IActionResult> AddMember(Guid teamId, AddMemberDto dto)
    {
        await _teamService.AddMemberAsync(teamId, dto, GetUserId());
        return Ok();
    }

    [HttpDelete("{teamId:guid}/members/{memberId:guid}")]
    public async Task<IActionResult> RemoveMember(Guid teamId, Guid memberId)
    {
        await _teamService.RemoveMemberAsync(teamId, memberId, GetUserId());
        return NoContent();
    }

    [HttpPut("{teamId:guid}/members/{memberId:guid}/role")]
    public async Task<IActionResult> UpdateMemberRole(
        Guid teamId,
        Guid memberId,
        UpdateMemberRoleDto dto)
    {
        await _teamService.UpdateMemberRoleAsync(teamId, memberId, dto.Role, GetUserId());
        return Ok();
    }
}



// using Microsoft.AspNetCore.Mvc;
// using Microsoft.AspNetCore.Authorization;
// using Backend.Services.Interfaces;
// using Backend.DTOs.Teams;
// using System.Security.Claims;

// namespace Backend.Controllers;

// [Authorize]
// [ApiController]
// [Route("api/teams")]
// public class TeamsController : ControllerBase
// {
//     private readonly ITeamService _teamService;

//     public TeamsController(ITeamService teamService)
//     {
//         _teamService = teamService;
//     }

//     [HttpPost]
//     public async Task<IActionResult> Create(CreateTeamDto dto)
//     {
//         var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

//         if (string.IsNullOrEmpty(userId))
//             return Unauthorized(new { message = "User not authenticated" });

//         var team = await _teamService.CreateAsync(dto, userId);
//         return CreatedAtAction(nameof(GetById), new { teamId = team.Id }, team);
//     }

//     [HttpGet]
//     public async Task<IActionResult> GetMine()
//     {
//         var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

//         if (string.IsNullOrEmpty(userId))
//             return Unauthorized(new { message = "User not authenticated" });

//         var teams = await _teamService.GetForUserAsync(userId);
//         return Ok(teams);
//     }

//     [HttpGet("{teamId}")]
//     public async Task<IActionResult> GetById(string teamId)
//     {
//         var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

//         if (string.IsNullOrEmpty(userId))
//             return Unauthorized(new { message = "User not authenticated" });

//         if (!Guid.TryParse(teamId, out var teamGuid))
//             return BadRequest(new { message = "Invalid team ID" });

//         var team = await _teamService.GetByIdAsync(teamGuid.ToString(), userId);

//         if (team == null)
//             return NotFound(new { message = "Team not found" });

//         return Ok(team);
//     }

//     [HttpPut("{teamId}")]
//     public async Task<IActionResult> Update(string teamId, [FromBody] UpdateTeamDto dto)
//     {
//         var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

//         if (string.IsNullOrEmpty(userId))
//             return Unauthorized(new { message = "User not authenticated" });

//         if (!Guid.TryParse(teamId, out var teamGuid))
//             return BadRequest(new { message = "Invalid team ID" });

//         try
//         {
//             var team = await _teamService.UpdateAsync(teamGuid.ToString(), dto, userId);
//             return Ok(team);
//         }
//         catch (UnauthorizedAccessException)
//         {
//             return Forbid(); // User doesn't have permission to update this team
//         }
//         catch (KeyNotFoundException)
//         {
//             return NotFound(new { message = "Team not found" });
//         }
//     }

//     [HttpDelete("{teamId}")]
//     public async Task<IActionResult> Delete(string teamId)
//     {
//         var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

//         if (string.IsNullOrEmpty(userId))
//             return Unauthorized(new { message = "User not authenticated" });

//         if (!Guid.TryParse(teamId, out var teamGuid))
//             return BadRequest(new { message = "Invalid team ID" });

//         try
//         {
//             await _teamService.DeleteAsync(teamGuid.ToString(), userId);
//             return NoContent(); // 204 No Content - successful deletion
//         }
//         catch (UnauthorizedAccessException)
//         {
//             return Forbid(); // User doesn't have permission (not owner)
//         }
//         catch (KeyNotFoundException)
//         {
//             return NotFound(new { message = "Team not found" });
//         }
//     }

//     [HttpPost("{teamId}/members")]
//     public async Task<IActionResult> AddMember(string teamId, [FromBody] AddMemberDto dto)
//     {
//         var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

//         if (string.IsNullOrEmpty(userId))
//             return Unauthorized(new { message = "User not authenticated" });

//         if (!Guid.TryParse(teamId, out var teamGuid))
//             return BadRequest(new { message = "Invalid team ID" });

//         try
//         {
//             await _teamService.AddMemberAsync(teamGuid.ToString(), dto, userId);
//             return Ok(new { message = "Member added successfully" });
//         }
//         catch (UnauthorizedAccessException)
//         {
//             return Forbid();
//         }
//         catch (KeyNotFoundException ex)
//         {
//             return NotFound(new { message = ex.Message });
//         }
//     }

//     [HttpDelete("{teamId}/members/{memberId}")]
//     public async Task<IActionResult> RemoveMember(string teamId, string memberId)
//     {
//         var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

//         if (string.IsNullOrEmpty(userId))
//             return Unauthorized(new { message = "User not authenticated" });

//         if (!Guid.TryParse(teamId, out var teamGuid) || !Guid.TryParse(memberId, out var memberGuid))
//             return BadRequest(new { message = "Invalid team or member ID" });

//         try
//         {
//             await _teamService.RemoveMemberAsync(teamGuid.ToString(), memberGuid.ToString(), userId);
//             return NoContent();
//         }
//         catch (UnauthorizedAccessException)
//         {
//             return Forbid();
//         }
//         catch (KeyNotFoundException ex)
//         {
//             return NotFound(new { message = ex.Message });
//         }
//     }


//     [HttpPut("{teamId}/members/{memberId}/role")]
//     public async Task<IActionResult> UpdateMemberRole(string teamId, string memberId, [FromBody] UpdateMemberRoleDto dto)
//     {
//         var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

//         if (string.IsNullOrEmpty(userId))
//             return Unauthorized(new { message = "User not authenticated" });

//         if (!Guid.TryParse(teamId, out _) || !Guid.TryParse(memberId, out _))
//             return BadRequest(new { message = "Invalid team or member ID" });

//         try
//         {
//             await _teamService.UpdateMemberRoleAsync(teamId, memberId, dto.Role, userId);
//             return Ok(new { message = "Member role updated successfully" });
//         }
//         catch (UnauthorizedAccessException ex)
//         {
//             return Forbid();
//         }
//         catch (KeyNotFoundException ex)
//         {
//             return NotFound(new { message = ex.Message });
//         }
//         catch (ArgumentException ex)
//         {
//             return BadRequest(new { message = ex.Message });
//         }
//     }
// }