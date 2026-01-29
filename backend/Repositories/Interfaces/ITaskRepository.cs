using Backend.Models;

namespace Backend.Repositories.Interfaces;

public interface ITaskRepository
{
    Task CreateAsync(TaskItem task);
    Task<IEnumerable<TaskItem>> GetByProjectIdAsync(string projectId);
    Task<TaskItem?> GetByIdAsync(string taskId);
}
