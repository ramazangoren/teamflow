using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations;

public class ProjectService : IProjectService
{
    private readonly IProjectRepository _projects;

    public ProjectService(IProjectRepository projects)
    {
        _projects = projects;
    }

    public Task CreateAsync(Project project)
        => _projects.CreateAsync(project);

    public Task<IEnumerable<Project>> GetByTeamAsync(string teamId)
        => _projects.GetByTeamIdAsync(teamId);
}
