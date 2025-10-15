var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

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

// Configure middleware
app.UseCors("AllowAll");
app.UseSwagger();
app.UseSwaggerUI();

// Simple endpoints
app.MapGet("/", () => "Proteia API v1.0 - " + DateTime.Now);
app.MapGet("/health", () => new { status = "ok", time = DateTime.Now });

// Auth endpoints
app.MapPost("/api/auth/login", (LoginDto login) => {
    if (login.Email == "admin@proteia.com" && login.Password == "admin123")
    {
        return Results.Ok(new {
            token = "mock-token-" + Guid.NewGuid().ToString()[..8],
            user = new { email = login.Email, name = "Admin" }
        });
    }
    return Results.Unauthorized();
});

// Products endpoints
app.MapGet("/api/products", () => new[] {
    new { id = 1, name = "Proteína Whey Gold", brand = "OPTIMUM NUTRITION", price = 1299.99 },
    new { id = 2, name = "Creatina Monohidrato", brand = "ENC EVOLUTION", price = 599.99 },
    new { id = 3, name = "BCAA Energy", brand = "SASCHA FITNESS", price = 899.99 }
});

app.MapGet("/api/products/{id}", (int id) => {
    var products = new[] {
        new { id = 1, name = "Proteína Whey Gold", brand = "OPTIMUM NUTRITION", price = 1299.99 },
        new { id = 2, name = "Creatina Monohidrato", brand = "ENC EVOLUTION", price = 599.99 },
        new { id = 3, name = "BCAA Energy", brand = "SASCHA FITNESS", price = 899.99 }
    };
    var product = products.FirstOrDefault(p => p.id == id);
    return product != null ? Results.Ok(product) : Results.NotFound();
});

// Dashboard endpoints
app.MapGet("/api/dashboard/market-overview", () => new {
    totalProducts = 330,
    totalBrands = 25,
    averagePrice = 899.50,
    lastUpdated = DateTime.Now
});

app.MapGet("/api/dashboard/brand-analysis", () => new[] {
    new { name = "OPTIMUM NUTRITION", products = 45, marketShare = 18.5 },
    new { name = "ENC EVOLUTION", products = 38, marketShare = 15.2 },
    new { name = "SASCHA FITNESS", products = 32, marketShare = 12.8 }
});

app.Run();

public record LoginDto(string Email, string Password);
