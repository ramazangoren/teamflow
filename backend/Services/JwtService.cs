using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using Backend.Models;

namespace Backend.Services;

public class JwtService : IJwtService
{
    private readonly IConfiguration _config;

    public JwtService(IConfiguration config)
    {
        _config = config;
    }

    public string GenerateToken(User user)
    {
        var key = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_config["Jwt:Key"]!)
        );

        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
        new Claim("sub", user.Id.ToString()),      // Subject = User ID
        new Claim("email", user.Email),
        new Claim("name", user.FullName ?? user.Email)
    };

        var token = new JwtSecurityToken(
            issuer: _config["Jwt:Issuer"],
            audience: _config["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

}


// using System.IdentityModel.Tokens.Jwt;
// using System.Security.Claims;
// using System.Text;
// using Microsoft.IdentityModel.Tokens;
// using Backend.Models;

// namespace Backend.Services;
// public class JwtService : IJwtService
// {
//     private readonly IConfiguration _config;

//     public JwtService(IConfiguration config)
//     {
//         _config = config;
//     }

//     public string GenerateToken(User user)
//     {
//         var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
//             _config["Jwt:Key"] ?? "kjdhfghjekp0348£$@%fed^&ghgfg()_^&*%^iuhcnmxzvbcxjkh23oiu!@#%&*()_+"));
//         var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//         var claims = new[]
//         {
//             new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
//             new Claim(ClaimTypes.Email, user.Email),
//             new Claim(ClaimTypes.Name, user.FullName ?? user.Email)
//         };

//         var token = new JwtSecurityToken(
//             issuer: _config["Jwt:Issuer"] ?? "fitCheck",
//             audience: _config["Jwt:Audience"] ?? "fitCheck",
//             claims: claims,
//             expires: DateTime.UtcNow.AddDays(7),
//             signingCredentials: creds
//         );

//         return new JwtSecurityTokenHandler().WriteToken(token);
//     }
// }


