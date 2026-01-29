using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

using Backend.Services.Interfaces;
using Backend.DTOs.Teams;

namespace Backend.Controllers;

[ApiController]
[Route("api/teams")]
public class TeamsController : ControllerBase
{
    private readonly ITeamService _teamService;

    public TeamsController(ITeamService teamService)
    {
        _teamService = teamService;
    }

    [HttpPost]
    public async Task<IActionResult> Create(CreateTeamDto dto)
    {
        var userId = "mock-user-id"; // TODO: get from JWT
        var team = await _teamService.CreateAsync(dto, userId);
        return Ok(team);
    }

    [HttpGet]
    public async Task<IActionResult> GetMine()
    {
        var userId = "mock-user-id";
        var teams = await _teamService.GetForUserAsync(userId);
        return Ok(teams);
    }

    [Authorize(Roles = "Owner")]
    [HttpDelete("{teamId}")]
    public IActionResult DeleteTeam(string teamId)
    {
        return Ok("Only owners can delete teams");
    }
}
