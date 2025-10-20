using CheckApi.Domain.Entities;
using CheckApi.Domain.Requests;
using CheckApi.Infrastructure;
using CheckApi.Infrastructure.Configs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.Configure<DatabaseConfig>(builder.Configuration.GetSection(DatabaseConfig.Section));

builder.Services.AddInfrastructure();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.EnsureCreated();
}

app.UseCors("AllowAll");

app.MapGet("/api/tasks", async (AppDbContext db) =>
{
    var tasks = await db.Tasks.ToListAsync();
    return Results.Ok(tasks);
});

app.MapGet("/api/tasks/{id}", async (Guid id, AppDbContext db) =>
{
    var task = await db.Tasks.FindAsync(id);
    return task is not null ? Results.Ok(task) : Results.NotFound();
});

app.MapPost("/api/tasks", async ([FromBody] CreateTaskRequest request, AppDbContext db) =>
{
    var task = new TodoTask
    {
        Title = request.Title,
        Description = request.Description,
        IsCompleted = false,
        CreatedAt = DateTime.UtcNow
    };
    
    db.Tasks.Add(task);
    await db.SaveChangesAsync();
    
    return Results.Created($"/api/tasks/{task.Id}", task);
});

app.MapPut("/api/tasks/{id}", async (Guid id, [FromBody] UpdateTaskRequest request, AppDbContext db) =>
{
    var task = await db.Tasks.FindAsync(id);
    if (task is null) return Results.NotFound();
    
    if (request.Title is not null)
        task.Title = request.Title;
    
    if (request.Description is not null)
        task.Description = request.Description;
    
    if (request.IsCompleted.HasValue)
        task.IsCompleted = request.IsCompleted.Value;
    
    task.UpdatedAt = DateTime.UtcNow;
    
    await db.SaveChangesAsync();
    return Results.Ok(task);
});

app.MapDelete("/api/tasks/{id}", async (Guid id, AppDbContext db) =>
{
    var task = await db.Tasks.FindAsync(id);
    if (task is null) return Results.NotFound();

    task.IsDeleted = true;
    task.UpdatedAt = DateTime.UtcNow;

    await db.SaveChangesAsync();
    
    return Results.NoContent();
});

app.Run();