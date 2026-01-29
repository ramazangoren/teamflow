using Backend.Models;

namespace Backend.Services.Interfaces;

public interface ITaskService
{
    Task CreateAsync(TaskItem task);
    Task<IEnumerable<TaskItem>> GetByProjectAsync(string projectId);
}
