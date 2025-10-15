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
if (app.Environment.IsDevelopment() || app.Environment.IsProduction())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Proteia API v1");
        options.RoutePrefix = string.Empty;
    });
}

// Configure middleware
app.UseCors("AllowAll");

// ============================================================================
// SYSTEM ENDPOINTS
// ============================================================================

// Root endpoint redirects to Swagger
app.MapGet("/api", () => "Proteia Intelligence API v1.0 - " + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"));
app.MapGet("/health", () => new { status = "healthy", timestamp = DateTime.Now })
   .WithName("HealthCheck")
   .WithSummary("Health Check")
   .WithDescription("Returns the health status of the API");

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

app.MapPost("/api/auth/login", async (LoginRequest request, ProteiaDbContext dbContext) => {
    try
    {
        if (request == null || string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
        {
            return Results.BadRequest(new { error = "Email and password are required" });
        }

        var email = request.Email.ToLower().Trim();
        
        // Query the database for the user
        var user = await dbContext.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .FirstOrDefaultAsync(u => u.Email!.ToLower() == email && u.Password == request.Password);
        
        if (user != null)
        {
            // Get user role (default to 'user' if no role assigned)
            var userRole = user.UserRoles.FirstOrDefault()?.Role?.RoleName ?? "user";
            
            return Results.Ok(new {
                token = "jwt-token-" + Guid.NewGuid().ToString()[..8],
                refreshToken = "refresh-token-" + Guid.NewGuid().ToString()[..8],
                user = new {
                    id = user.IdUser,
                    email = user.Email,
                    name = user.NameUser,
                    role = userRole
                },
                expiresIn = 3600
            });
        }
        
        return Results.Unauthorized();
    }
    catch (Exception ex)
    {
        return Results.BadRequest(new { error = "Database error", details = ex.Message });
    }
})
.WithName("Login")
.WithSummary("User Login")
.WithDescription("Authenticate user with email and password. Valid users: admin@proteia.com/admin123, carlos@proteia.com/carlos123, demo@proteia.com/demo123");

app.MapPost("/api/auth/logout", () => Results.Ok(new { message = "Logged out successfully" }));
app.MapGet("/api/auth/validate", () => Results.Ok(new { valid = true, user = "admin@proteia.com" }));

// ============================================================================
// PRODUCTS ENDPOINTS - MATCHING FRONTEND EXPECTATIONS
// ============================================================================

var sampleProducts = new[] {
    new {
        id = 1,
        asin = "B001TKA8LG",
        productName = "Optimum Nutrition Gold Standard 100% Whey Protein Powder",
        brand = "OPTIMUM NUTRITION",
        category = "Proteína Whey",
        price = 1299.99,
        rating = 4.5,
        reviewCount = 15420,
        estSales = 2500,
        estRevenue = 3249975.0,
        nutritionalInfo = new {
            energy = 120,
            protein = 24,
            totalFat = 1,
            carbohydrates = 3,
            dietaryFiber = 0,
            sodium = 130
        },
        productAnalysis = new {
            valueProposition = "Proteína de suero de alta calidad con aminoácidos esenciales",
            keyLabels = "Whey Protein, BCAA, Glutamine",
            intendedSegment = "Atletas y fitness enthusiasts",
            similarityScore = 0.95
        }
    },
    new {
        id = 2,
        asin = "B00QQA0GSI",
        productName = "Creatina Monohidrato Micronizada",
        brand = "ENC EVOLUTION",
        category = "Creatina",
        price = 599.99,
        rating = 4.3,
        reviewCount = 8750,
        estSales = 1800,
        estRevenue = 1079982.0,
        nutritionalInfo = new {
            energy = 0,
            protein = 0,
            totalFat = 0,
            carbohydrates = 0,
            dietaryFiber = 0,
            sodium = 0
        },
        productAnalysis = new {
            valueProposition = "Creatina pura micronizada para máximo rendimiento",
            keyLabels = "Creatine Monohydrate, Performance, Strength",
            intendedSegment = "Atletas de fuerza y potencia",
            similarityScore = 0.88
        }
    },
    new {
        id = 3,
        asin = "B07FQMZQX4",
        productName = "BCAA Energy Aminoácidos Ramificados",
        brand = "SASCHA FITNESS",
        category = "BCAA",
        price = 899.99,
        rating = 4.7,
        reviewCount = 12300,
        estSales = 2100,
        estRevenue = 1889979.0,
        nutritionalInfo = new {
            energy = 20,
            protein = 5,
            totalFat = 0,
            carbohydrates = 0,
            dietaryFiber = 0,
            sodium = 10
        },
        productAnalysis = new {
            valueProposition = "Aminoácidos ramificados con energía natural",
            keyLabels = "BCAA, Energy, Recovery",
            intendedSegment = "Atletas de resistencia",
            similarityScore = 0.92
        }
    }
};

// Products endpoints matching frontend service calls
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
})
   .WithName("GetAllProducts")
   .WithSummary("Get All Products")
   .WithDescription("Returns all products from database with complete nutritional information and analysis");

app.MapGet("/api/products/{id}", (int id) => {
    var product = sampleProducts.FirstOrDefault(p => p.id == id);
    return product != null ? Results.Ok(product) : Results.NotFound(new { message = "Product not found" });
})
.WithName("GetProductById")
.WithSummary("Get Product by ID")
.WithDescription("Returns detailed information for a specific product by its ID");

app.MapGet("/api/products/asin/{asin}", (string asin) => {
    var product = sampleProducts.FirstOrDefault(p => p.asin == asin);
    return product != null ? Results.Ok(product) : Results.NotFound(new { message = "Product not found" });
});

app.MapGet("/api/products/search", (string searchTerm) => {
    var results = sampleProducts.Where(p => 
        p.productName.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
        p.brand.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)
    ).Select(p => new {
        id = p.id,
        asin = p.asin,
        productName = p.productName,
        brand = p.brand,
        price = p.price,
        rating = p.rating
    }).ToArray();
    return Results.Ok(results);
});

app.MapGet("/api/products/brand/{brand}", (string brand) => {
    var results = sampleProducts.Where(p => 
        p.brand.Equals(brand, StringComparison.OrdinalIgnoreCase)
    ).Select(p => new {
        id = p.id,
        asin = p.asin,
        productName = p.productName,
        brand = p.brand,
        price = p.price,
        rating = p.rating
    }).ToArray();
    return Results.Ok(results);
});

app.MapGet("/api/products/category/{category}", (string category) => {
    var results = sampleProducts.Where(p => 
        p.category.Equals(category, StringComparison.OrdinalIgnoreCase)
    ).Select(p => new {
        id = p.id,
        asin = p.asin,
        productName = p.productName,
        brand = p.brand,
        price = p.price,
        rating = p.rating
    }).ToArray();
    return Results.Ok(results);
});

app.MapGet("/api/products/similar", (int productId, int topN = 5) => {
    var similarProducts = sampleProducts.Where(p => p.id != productId).Take(topN)
        .Select(p => new {
            id = p.id,
            asin = p.asin,
            productName = p.productName,
            brand = p.brand,
            price = p.price,
            rating = p.rating
        });
    return Results.Ok(similarProducts);
});

app.MapGet("/api/products/proteo50", () => {
    return Results.Ok(new {
        id = 50,
        asin = "PROTEO50",
        productName = "Proteo50 - Análisis Personalizado",
        brand = "PROTEIA",
        category = "Análisis",
        price = 950.00,
        rating = 5.0,
        reviewCount = 1,
        estSales = 0,
        estRevenue = 0.0,
        nutritionalInfo = new {
            energy = 120,
            protein = 24,
            totalFat = 1,
            carbohydrates = 2,
            dietaryFiber = 1,
            sodium = 100
        },
        productAnalysis = new {
            valueProposition = "Producto personalizado basado en análisis de mercado",
            keyLabels = "Custom, Optimized, Market-Based",
            intendedSegment = "Usuarios personalizados",
            similarityScore = 1.0
        }
    });
});

// ============================================================================
// DASHBOARD ENDPOINTS - MATCHING FRONTEND EXPECTATIONS
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

app.MapGet("/api/dashboard/product-comparison", () => new {
    topProducts = new[] {
        new { name = "Gold Standard Whey", brand = "OPTIMUM NUTRITION", price = 1299.99, rating = 4.5, marketShare = 8.2, protein = 24 },
        new { name = "Nitro-Tech Whey", brand = "MUSCLETECH", price = 1199.99, rating = 4.3, marketShare = 6.8, protein = 25 },
        new { name = "Iso100 Hydrolyzed", brand = "DYMATIZE", price = 1599.99, rating = 4.6, marketShare = 5.4, protein = 25 }
    },
    averageMetrics = new {
        avgProteinContent = 23.5,
        avgPrice = 1299.99,
        avgRating = 4.4,
        totalReviews = 45670
    }
});

app.MapGet("/api/dashboard/prospect-ranking", () => new {
    prospects = new[] {
        new { rank = 1, name = "Proteína Vegana Premium", opportunity = 85.2, marketGap = "Alto", estimatedRevenue = 450000, category = "Proteína Vegana" },
        new { rank = 2, name = "Creatina + HMB", opportunity = 78.9, marketGap = "Medio-Alto", estimatedRevenue = 320000, category = "Creatina" },
        new { rank = 3, name = "BCAA Sabor Natural", opportunity = 72.1, marketGap = "Medio", estimatedRevenue = 280000, category = "BCAA" },
        new { rank = 4, name = "Pre-workout Sin Cafeína", opportunity = 68.4, marketGap = "Medio", estimatedRevenue = 250000, category = "Pre-workout" },
        new { rank = 5, name = "Proteína Hidrolizada", opportunity = 65.7, marketGap = "Bajo-Medio", estimatedRevenue = 220000, category = "Proteína Whey" }
    },
    totalOpportunityValue = 1520000,
    analysisDate = DateTime.Now
});

app.MapGet("/api/dashboard/brand-analysis", () => new[] {
    new { name = "OPTIMUM NUTRITION", productCount = 45, averagePrice = 1350.00, averageRating = 4.4, totalRevenue = 607500.00, averageProtein = 24.2 },
    new { name = "ENC EVOLUTION", productCount = 38, averagePrice = 890.00, averageRating = 4.2, totalRevenue = 338200.00, averageProtein = 22.8 },
    new { name = "SASCHA FITNESS", productCount = 32, averagePrice = 950.00, averageRating = 4.5, totalRevenue = 304000.00, averageProtein = 23.5 },
    new { name = "BIRDMAN", productCount = 28, averagePrice = 780.00, averageRating = 4.1, totalRevenue = 218400.00, averageProtein = 21.5 },
    new { name = "KING Protein", productCount = 25, averagePrice = 720.00, averageRating = 4.0, totalRevenue = 180000.00, averageProtein = 20.8 }
});

app.MapGet("/api/dashboard/category-analysis", () => new[] {
    new { name = "Proteína Whey", productCount = 145, averagePrice = 1250.00, totalRevenue = 1812500.00 },
    new { name = "Creatina", productCount = 67, averagePrice = 650.00, totalRevenue = 435500.00 },
    new { name = "BCAA", productCount = 54, averagePrice = 890.00, totalRevenue = 480600.00 },
    new { name = "Pre-workout", productCount = 64, averagePrice = 980.00, totalRevenue = 627200.00 }
});

app.Run();

// ============================================================================
// DTOs
// ============================================================================

public record LoginRequest(string Email, string Password);

