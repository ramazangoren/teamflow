using Backend.Models;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers;

[ApiController]
[Route("api/teams/{teamId}/projects")]
public class ProjectsController : ControllerBase
{
    private readonly IProjectService _projectService;

    public ProjectsController(IProjectService projectService)
    {
        _projectService = projectService;
    }

    /// <summary>
    /// Get all projects for a team
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetByTeam(string teamId)
    {
        if (string.IsNullOrWhiteSpace(teamId))
            return BadRequest("TeamId is required.");

        var projects = await _projectService.GetByTeamAsync(teamId);
        return Ok(projects);
    }

    /// <summary>
    /// Create a new project in a team
    /// </summary>
    [HttpPost]
    public async Task<IActionResult> Create(
        string teamId,
        [FromBody] CreateProjectRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.Name))
            return BadRequest("Project name is required.");

        var project = new Project
        {
            TeamId = teamId,
            Name = request.Name,
            Description = request.Description
        };

        await _projectService.CreateAsync(project);

        return CreatedAtAction(
            nameof(GetByTeam),
            new { teamId },
            project);
    }
}
