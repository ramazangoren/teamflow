using MySqlConnector;
using System.Data;

namespace Backend.Data;

public class DbConnectionFactory
{
    private readonly IConfiguration _configuration;

    public DbConnectionFactory(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public IDbConnection CreateConnection()
    {
        return new MySqlConnection(
            _configuration.GetConnectionString("DefaultConnection")
        );
    }
}
