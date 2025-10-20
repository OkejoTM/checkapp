using CheckApi.Domain.Entities.Base;

namespace CheckApi.Domain.Entities;

public class TodoTask : Entity
{
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public bool IsCompleted { get; set; }
}