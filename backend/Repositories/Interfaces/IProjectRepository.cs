using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface IProjectRepository
{
    Task CreateAsync(Project project);
    Task<IEnumerable<Project>> GetByTeamIdAsync(string teamId);
}
