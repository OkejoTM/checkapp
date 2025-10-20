using CheckApi.Infrastructure.Configs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace CheckApi.Infrastructure;

public static class InfraDI
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services)
    {
        var sp = services.BuildServiceProvider();
        
        services.AddDbContext<AppDbContext>(options => 
            options.UseNpgsql(sp.GetRequiredService<IOptions<DatabaseConfig>>().Value.ConnectionString));
        
        return services;
    }
}