using Backend.Models;
using Backend.Repositories.Interfaces;
using Backend.Services.Interfaces;

namespace Backend.Services.Implementations;

public class TaskService : ITaskService
{
    private readonly ITaskRepository _tasks;

    public TaskService(ITaskRepository tasks)
    {
        _tasks = tasks;
    }

    public Task CreateAsync(TaskItem task)
        => _tasks.CreateAsync(task);

    public Task<IEnumerable<TaskItem>> GetByProjectAsync(string projectId)
        => _tasks.GetByProjectIdAsync(projectId);
}
