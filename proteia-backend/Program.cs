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

// ============================================================================
// SYSTEM ENDPOINTS
// ============================================================================

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

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

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

app.MapPost("/api/auth/logout", () => Results.Ok(new { message = "Logged out successfully" }));
app.MapGet("/api/auth/validate", () => Results.Ok(new { valid = true, user = "admin@proteia.com" }));

// ============================================================================
// PRODUCTS ENDPOINTS
// ============================================================================

app.MapGet("/api/products", async (ProteiaDbContext dbContext) => {
    try
    {
        var products = await dbContext.Products
            .Include(p => p.NutritionalInfo)
            .Include(p => p.ProductAnalysis)
            .Select(p => new {
                id = p.Id,
                asin = p.ASIN,
                productName = p.ProductName,
                brand = p.Brand,
                category = p.Category,
                price = p.Price,
                rating = p.Rating ?? 0,
                reviewCount = p.ReviewCount ?? 0,
                estSales = p.EstSales ?? 0,
                estRevenue = p.EstRevenue ?? 0,
                nutritionalInfo = p.NutritionalInfo != null ? new {
                    energy = p.NutritionalInfo.Energy,
                    protein = p.NutritionalInfo.Protein,
                    totalFat = p.NutritionalInfo.TotalFat,
                    carbohydrates = p.NutritionalInfo.Carbohydrates,
                    dietaryFiber = p.NutritionalInfo.DietaryFiber,
                    sodium = p.NutritionalInfo.Sodium
                } : null,
                productAnalysis = p.ProductAnalysis != null ? new {
                    valueProposition = p.ProductAnalysis.ValueProposition,
                    keyLabels = p.ProductAnalysis.KeyLabels,
                    intendedSegment = p.ProductAnalysis.IntendedSegment,
                    similarityScore = p.ProductAnalysis.SimilarityScore
                } : null
            })
            .ToListAsync();
            
        return Results.Ok(products);
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = "Database error", details = ex.Message });
    }
});

app.MapGet("/api/products/{id}", async (int id, ProteiaDbContext dbContext) => {
    try
    {
        var product = await dbContext.Products
            .Include(p => p.NutritionalInfo)
            .Include(p => p.ProductAnalysis)
            .Where(p => p.Id == id)
            .Select(p => new {
                id = p.Id,
                asin = p.ASIN,
                productName = p.ProductName,
                brand = p.Brand,
                category = p.Category,
                price = p.Price,
                rating = p.Rating ?? 0,
                reviewCount = p.ReviewCount ?? 0,
                estSales = p.EstSales ?? 0,
                estRevenue = p.EstRevenue ?? 0,
                nutritionalInfo = p.NutritionalInfo != null ? new {
                    energy = p.NutritionalInfo.Energy,
                    protein = p.NutritionalInfo.Protein,
                    totalFat = p.NutritionalInfo.TotalFat,
                    carbohydrates = p.NutritionalInfo.Carbohydrates,
                    dietaryFiber = p.NutritionalInfo.DietaryFiber,
                    sodium = p.NutritionalInfo.Sodium
                } : null,
                productAnalysis = p.ProductAnalysis != null ? new {
                    valueProposition = p.ProductAnalysis.ValueProposition,
                    keyLabels = p.ProductAnalysis.KeyLabels,
                    intendedSegment = p.ProductAnalysis.IntendedSegment,
                    similarityScore = p.ProductAnalysis.SimilarityScore
                } : null
            })
            .FirstOrDefaultAsync();
            
        return product != null ? Results.Ok(product) : Results.NotFound(new { message = "Product not found" });
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = "Database error", details = ex.Message });
    }
});

// ============================================================================
// DASHBOARD ENDPOINTS
// ============================================================================

app.MapGet("/api/dashboard/market-overview", () => new {
    totalProducts = 330,
    averagePrice = 899.50,
    averageRating = 4.4,
    totalRevenue = 2500000.00,
    categoryStats = new[] {
        new { name = "Proteína Whey", productCount = 145, averagePrice = 1250.00, totalRevenue = 1812500.00 },
        new { name = "Creatina", productCount = 67, averagePrice = 650.00, totalRevenue = 435500.00 },
        new { name = "BCAA", productCount = 54, averagePrice = 890.00, totalRevenue = 480600.00 },
        new { name = "Pre-workout", productCount = 64, averagePrice = 980.00, totalRevenue = 627200.00 }
    },
    brandStats = new[] {
        new { name = "OPTIMUM NUTRITION", productCount = 45, averagePrice = 1350.00, averageRating = 4.4, totalRevenue = 607500.00, averageProtein = 24.2 },
        new { name = "ENC EVOLUTION", productCount = 38, averagePrice = 890.00, averageRating = 4.2, totalRevenue = 338200.00, averageProtein = 22.8 },
        new { name = "SASCHA FITNESS", productCount = 32, averagePrice = 950.00, averageRating = 4.5, totalRevenue = 304000.00, averageProtein = 23.5 }
    }
});

app.MapGet("/api/dashboard/brand-analysis", () => new[] {
    new { name = "OPTIMUM NUTRITION", productCount = 45, averagePrice = 1350.00, averageRating = 4.4, totalRevenue = 607500.00, averageProtein = 24.2 },
    new { name = "ENC EVOLUTION", productCount = 38, averagePrice = 890.00, averageRating = 4.2, totalRevenue = 338200.00, averageProtein = 22.8 },
    new { name = "SASCHA FITNESS", productCount = 32, averagePrice = 950.00, averageRating = 4.5, totalRevenue = 304000.00, averageProtein = 23.5 },
    new { name = "BIRDMAN", productCount = 28, averagePrice = 780.00, averageRating = 4.1, totalRevenue = 218400.00, averageProtein = 21.5 },
    new { name = "KING Protein", productCount = 25, averagePrice = 720.00, averageRating = 4.0, totalRevenue = 180000.00, averageProtein = 20.8 }
});

app.Run();

public record LoginRequest(string Email, string Password);
