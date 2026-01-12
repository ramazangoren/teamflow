using Backend.Data;
using Backend.Services;
using Backend.Repositories;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// Services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Database
builder.Services.AddSingleton<DbConnectionFactory>();

// Authentication Services
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IClothingRepository, ClothingRepository>(); // Add this line
builder.Services.AddScoped<IFavRepository, FavRepository>(); // Add this line
builder.Services.AddSingleton<IPasswordService, PasswordService>();
builder.Services.AddSingleton<IJwtService, JwtService>();

// JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"] ?? ""))
        };

        options.Events = new JwtBearerEvents
        {
            OnAuthenticationFailed = context =>
            {
                Console.WriteLine($"❌ Authentication failed:");
                Console.WriteLine($"   Message: {context.Exception?.Message}");
                if (context.Exception?.InnerException != null)
                {
                    Console.WriteLine($"   Inner: {context.Exception.InnerException.Message}");
                }
                return Task.CompletedTask;
            },
            OnTokenValidated = context =>
            {
                Console.WriteLine("✅ Token validated successfully");
                if (context.Principal != null)
                {
                    var userId = context.Principal.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
                    Console.WriteLine($"   User ID: {userId}");
                }
                return Task.CompletedTask;
            }
        };

        // debugging events
        // options.Events = new JwtBearerEvents
        // {
        //     OnMessageReceived = context =>
        //     {
        //         var token = context.Request.Headers["Authorization"].ToString();
        //         Console.WriteLine($"Token received: {(string.IsNullOrEmpty(token) ? "NO TOKEN" : "Token present")}");
        //         return Task.CompletedTask;
        //     },
        //     OnAuthenticationFailed = context =>
        //     {
        //         Console.WriteLine($"Authentication failed: {context.Exception.Message}");
        //         Console.WriteLine($"   Exception type: {context.Exception.GetType().Name}");
        //         return Task.CompletedTask;
        //     },
        //     OnTokenValidated = context =>
        //     {
        //         Console.WriteLine("Token validated successfully");
        //         var claims = context.Principal?.Claims.Select(c => $"{c.Type}={c.Value}");
        //         Console.WriteLine($"   Claims: {string.Join(", ", claims ?? Array.Empty<string>())}");
        //         return Task.CompletedTask;
        //     },
        //     OnChallenge = context =>
        //     {
        //         Console.WriteLine($" OnChallenge - Error: {context.Error}, Description: {context.ErrorDescription}");
        //         return Task.CompletedTask;
        //     }
        // };
    });


builder.Services.AddAuthorization();

// CORS: allow frontend dev server
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy
            .WithOrigins("http://localhost:5173")
            .AllowAnyHeader()
            .AllowAnyMethod()
    );
});

var app = builder.Build();

// Middleware
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Enable CORS (must be before Authentication/Authorization)
app.UseCors("AllowFrontend");

// Authentication & Authorization (order matters!)
app.UseAuthentication();
app.UseAuthorization();

// app.UseHttpsRedirection();

app.MapControllers();

app.Run();