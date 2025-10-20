using System.Reflection;
using CheckApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CheckApi.Infrastructure;

public class AppDbContext : DbContext
{
    public DbSet<TodoTask> Tasks { get; set; }

    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

}