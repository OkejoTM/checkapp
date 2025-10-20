namespace CheckApi.Infrastructure.Configs;

public class DatabaseConfig
{
    public const string Section = "DatabaseConfig";

    public string ConnectionString { get; set; } = String.Empty;
}
