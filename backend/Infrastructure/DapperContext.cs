using MySqlConnector;
using System.Data;

namespace Backend.Data;

public class DapperContext
{
    private readonly IConfiguration _config;

    public DapperContext(IConfiguration config)
    {
        _config = config;
    }

    public IDbConnection CreateConnection()
    {
        return new MySqlConnection(
            _config.GetConnectionString("Default")
        );
    }
}
