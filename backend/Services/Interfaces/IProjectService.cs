using Backend.Models;

namespace Backend.Services.Interfaces;

public interface IProjectService
{
    Task CreateAsync(Project project);
    Task<IEnumerable<Project>> GetByTeamAsync(string teamId);
}
