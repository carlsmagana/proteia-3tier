using Microsoft.EntityFrameworkCore;
using Proteia.API.Data;
using Proteia.API.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services for Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Entity Framework
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<ProteiaDbContext>(options =>
    options.UseSqlServer(connectionString));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure Swagger
app.UseSwagger();
app.UseSwaggerUI();

// Configure middleware
app.UseCors("AllowAll");

// Simple endpoints that work with Swagger
app.MapGet("/", () => "Proteia API is running! " + DateTime.Now);
app.MapGet("/health", () => new { status = "healthy", timestamp = DateTime.Now });

app.MapGet("/test-db", async (ProteiaDbContext dbContext) => {
    try
    {
        var canConnect = await dbContext.Database.CanConnectAsync();
        var userCount = canConnect ? await dbContext.Users.CountAsync() : 0;
        
        return new {
            canConnect = canConnect,
            userCount = userCount,
            timestamp = DateTime.Now
        };
    }
    catch (Exception ex)
    {
        return new {
            error = "Database connection failed",
            details = ex.Message
        };
    }
});

app.MapPost("/api/auth/login", async (LoginRequest request, ProteiaDbContext dbContext) => {
    try
    {
        if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
        {
            return Results.BadRequest("Email and password are required");
        }

        var user = await dbContext.Users
            .FirstOrDefaultAsync(u => u.Email!.ToLower() == request.Email.ToLower() && u.Password == request.Password);
        
        if (user != null)
        {
            return Results.Ok(new {
                token = "jwt-token-" + Guid.NewGuid().ToString()[..8],
                user = new {
                    id = user.IdUser,
                    email = user.Email,
                    name = user.NameUser,
                    role = "user"
                }
            });
        }
        
        return Results.Unauthorized();
    }
    catch (Exception ex)
    {
        return Results.BadRequest($"Database error: {ex.Message}");
    }
});

app.MapGet("/api/products", async (ProteiaDbContext dbContext) => {
    try
    {
        var products = await dbContext.Products
            .Select(p => new {
                id = p.Id,
                asin = p.ASIN,
                productName = p.ProductName,
                brand = p.Brand,
                category = p.Category,
                price = p.Price
            })
            .Take(10)
            .ToListAsync();
            
        return Results.Ok(products);
    }
    catch (Exception ex)
    {
        return Results.BadRequest($"Database error: {ex.Message}");
    }
});

app.Run();

public record LoginRequest(string Email, string Password);
