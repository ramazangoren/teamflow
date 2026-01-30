using System.Text;
using Backend.Data;
using Backend.Options;
using Backend.Repositories.Implementations;
using Backend.Repositories.Interfaces;
using Backend.Services.Implementations;
using Backend.Services.Interfaces;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// --------------------------------------------------
// Controllers & Swagger
// --------------------------------------------------
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// --------------------------------------------------
// Database (Dapper)
// --------------------------------------------------
builder.Services.AddSingleton<DapperContext>();

// --------------------------------------------------
// Repositories
// --------------------------------------------------
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITeamRepository, TeamRepository>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();

// --------------------------------------------------
// Services
// --------------------------------------------------
builder.Services.AddScoped<ITeamService, TeamService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<ITaskService, TaskService>();

builder.Services.AddSingleton<IPasswordService, PasswordService>();
builder.Services.AddSingleton<IJwtService, JwtService>();

// --------------------------------------------------
// JWT
// --------------------------------------------------
builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));

builder
    .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        var jwt = builder.Configuration.GetSection("Jwt");

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwt["Issuer"],
            ValidAudience = jwt["Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!)),

            ClockSkew = TimeSpan.Zero,
        };
    });

builder.Services.AddAuthorization();

// --------------------------------------------------
// CORS (cookies enabled)
// --------------------------------------------------
builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "AllowFrontend",
        policy =>
            policy
                .WithOrigins("http://localhost:5173")
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowCredentials()
    );
});

var app = builder.Build();

// --------------------------------------------------
// Middleware
// --------------------------------------------------
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();


// using System.Text;
// using Backend.Data;
// using Backend.Options;
// using Backend.Repositories.Implementations;
// using Backend.Repositories.Interfaces;
// using Backend.Services.Implementations;
// using Backend.Services.Interfaces;
// using Microsoft.AspNetCore.Authentication.JwtBearer;
// using Microsoft.IdentityModel.Tokens;

// var builder = WebApplication.CreateBuilder(args);

// // --------------------------------------------------
// // Controllers & Swagger
// // --------------------------------------------------
// builder.Services.AddControllers();
// builder.Services.AddEndpointsApiExplorer();
// builder.Services.AddSwaggerGen();

// // --------------------------------------------------
// // Database (Dapper)
// // --------------------------------------------------
// builder.Services.AddSingleton<DapperContext>();

// // --------------------------------------------------
// // Repositories
// // --------------------------------------------------
// builder.Services.AddScoped<IUserRepository, UserRepository>();
// builder.Services.AddScoped<ITeamRepository, TeamRepository>();
// builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
// builder.Services.AddScoped<ITaskRepository, TaskRepository>();

// // --------------------------------------------------
// // Services
// // --------------------------------------------------
// builder.Services.AddScoped<ITeamService, TeamService>();
// builder.Services.AddScoped<IProjectService, ProjectService>();
// builder.Services.AddScoped<ITaskService, TaskService>();

// builder.Services.AddSingleton<IPasswordService, PasswordService>();
// builder.Services.AddSingleton<IJwtService, JwtService>();

// // --------------------------------------------------
// // JWT Authentication
// // --------------------------------------------------
// builder.Services.Configure<JwtOptions>(builder.Configuration.GetSection("Jwt"));

// builder.Services.AddCors(options =>
// {
//     options.AddPolicy(
//         "AllowFrontend",
//         policy =>
//             policy
//                 .WithOrigins("http://localhost:5173")
//                 .AllowAnyHeader()
//                 .AllowAnyMethod()
//                 .AllowCredentials()
//     );
// });

// builder
//     .Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
//     .AddJwtBearer(options =>
//     {
//         var jwt = builder.Configuration.GetSection("Jwt");

//         options.TokenValidationParameters = new TokenValidationParameters
//         {
//             ValidateIssuer = true,
//             ValidateAudience = true,
//             ValidateLifetime = true,
//             ValidateIssuerSigningKey = true,

//             ValidIssuer = jwt["Issuer"],
//             ValidAudience = jwt["Audience"],
//             IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwt["Key"]!)),

//             ClockSkew = TimeSpan.Zero,
//         };
//     });

// builder.Services.AddAuthorization();

// // --------------------------------------------------
// // CORS
// // --------------------------------------------------
// builder.Services.AddCors(options =>
// {
//     options.AddPolicy(
//         "AllowFrontend",
//         policy => policy.WithOrigins("http://localhost:5173").AllowAnyHeader().AllowAnyMethod()
//     );
// });

// var app = builder.Build();

// // --------------------------------------------------
// // Middleware
// // --------------------------------------------------
// if (app.Environment.IsDevelopment())
// {
//     app.UseSwagger();
//     app.UseSwaggerUI();
// }

// app.UseCors("AllowFrontend");

// app.UseAuthentication();
// app.UseAuthorization();

// app.MapControllers();

// app.Run();
