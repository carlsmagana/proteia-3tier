var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins(
            "http://localhost:3000", 
            "http://localhost:5173",
            "https://proteia-frontend.azurestaticapps.net"
        )
        .AllowAnyHeader()
        .AllowAnyMethod()
        .AllowCredentials();
    });
});

var app = builder.Build();

// Configure middleware
app.UseCors("AllowFrontend");
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Proteia API");
    c.RoutePrefix = string.Empty;
});

// ============================================================================
// SYSTEM ENDPOINTS
// ============================================================================

app.MapGet("/", () => "Proteia Intelligence API v1.0 - " + DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss"))
   .WithName("GetRoot")
   .WithSummary("API Status")
   .WithDescription("Returns the current status and timestamp of the Proteia API")
   .WithTags("System")
   .WithOpenApi();

app.MapGet("/health", () => new { 
    status = "healthy", 
    timestamp = DateTime.Now,
    version = "1.0.0",
    environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Production"
})
   .WithName("GetHealth")
   .WithSummary("Health Check")
   .WithDescription("Returns the health status of the API")
   .WithTags("System")
   .WithOpenApi();

// ============================================================================
// AUTHENTICATION ENDPOINTS
// ============================================================================

app.MapPost("/api/auth/login", (LoginRequest request) => {
    // Mock authentication - in real app, validate against database
    if (request.Email == "admin@proteia.com" && request.Password == "admin123")
    {
        return Results.Ok(new {
            token = "mock-jwt-token-" + Guid.NewGuid().ToString()[..8],
            refreshToken = "mock-refresh-token-" + Guid.NewGuid().ToString()[..8],
            user = new {
                id = 1,
                email = request.Email,
                name = "Administrador Proteia",
                role = "admin"
            },
            expiresIn = 3600
        });
    }
    return Results.Unauthorized();
})
   .WithName("Login")
   .WithSummary("User Login")
   .WithDescription("Authenticate user and return JWT token")
   .WithTags("Authentication")
   .WithOpenApi();

app.MapPost("/api/auth/logout", () => Results.Ok(new { message = "Logged out successfully" }))
   .WithName("Logout")
   .WithSummary("User Logout")
   .WithDescription("Logout user and invalidate token")
   .WithTags("Authentication")
   .WithOpenApi();

app.MapGet("/api/auth/validate", () => Results.Ok(new { valid = true, user = "admin@proteia.com" }))
   .WithName("ValidateToken")
   .WithSummary("Validate Token")
   .WithDescription("Validate JWT token")
   .WithTags("Authentication")
   .WithOpenApi();

// ============================================================================
// PRODUCTS ENDPOINTS
// ============================================================================

var sampleProducts = new[] {
    new { 
        id = 1, 
        asin = "B001TKA8LG",
        name = "Optimum Nutrition Gold Standard 100% Whey Protein Powder", 
        brand = "OPTIMUM NUTRITION", 
        price = 1299.99, 
        protein = "24g",
        category = "Proteína Whey",
        description = "Proteína de suero de alta calidad con aminoácidos esenciales",
        rating = 4.5,
        reviews = 15420,
        nutritionalInfo = new {
            protein = "24g",
            carbs = "3g", 
            fat = "1g",
            calories = 120,
            servingSize = "30.4g"
        }
    },
    new { 
        id = 2, 
        asin = "B00QQA0GSI",
        name = "Creatina Monohidrato Micronizada", 
        brand = "ENC EVOLUTION", 
        price = 599.99, 
        protein = "0g",
        category = "Creatina",
        description = "Creatina pura micronizada para máximo rendimiento",
        rating = 4.3,
        reviews = 8750,
        nutritionalInfo = new {
            protein = "0g",
            carbs = "0g", 
            fat = "0g",
            calories = 0,
            servingSize = "5g"
        }
    },
    new { 
        id = 3, 
        asin = "B07FQMZQX4",
        name = "BCAA Energy Aminoácidos Ramificados", 
        brand = "SASCHA FITNESS", 
        price = 899.99, 
        protein = "5g",
        category = "BCAA",
        description = "Aminoácidos ramificados con energía natural",
        rating = 4.7,
        reviews = 12300,
        nutritionalInfo = new {
            protein = "5g",
            carbs = "0g", 
            fat = "0g",
            calories = 20,
            servingSize = "10g"
        }
    }
};

app.MapGet("/api/products", () => sampleProducts)
   .WithName("GetAllProducts")
   .WithSummary("Get All Products")
   .WithDescription("Returns a list of all protein products from the Mexican market")
   .WithTags("Products")
   .WithOpenApi();

app.MapGet("/api/products/{id}", (int id) => {
    var product = sampleProducts.FirstOrDefault(p => p.id == id);
    return product != null ? Results.Ok(product) : Results.NotFound(new { message = "Product not found" });
})
   .WithName("GetProductById")
   .WithSummary("Get Product by ID")
   .WithDescription("Returns details of a specific product by its ID")
   .WithTags("Products")
   .WithOpenApi();

app.MapGet("/api/products/asin/{asin}", (string asin) => {
    var product = sampleProducts.FirstOrDefault(p => p.asin == asin);
    return product != null ? Results.Ok(product) : Results.NotFound(new { message = "Product not found" });
})
   .WithName("GetProductByAsin")
   .WithSummary("Get Product by ASIN")
   .WithDescription("Returns details of a specific product by its Amazon ASIN")
   .WithTags("Products")
   .WithOpenApi();

app.MapGet("/api/products/search", (string searchTerm) => {
    var results = sampleProducts.Where(p => 
        p.name.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) ||
        p.brand.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)
    ).ToArray();
    return Results.Ok(results);
})
   .WithName("SearchProducts")
   .WithSummary("Search Products")
   .WithDescription("Search products by name or brand")
   .WithTags("Products")
   .WithOpenApi();

app.MapGet("/api/products/brand/{brand}", (string brand) => {
    var results = sampleProducts.Where(p => 
        p.brand.Equals(brand, StringComparison.OrdinalIgnoreCase)
    ).ToArray();
    return Results.Ok(results);
})
   .WithName("GetProductsByBrand")
   .WithSummary("Get Products by Brand")
   .WithDescription("Returns all products from a specific brand")
   .WithTags("Products")
   .WithOpenApi();

app.MapGet("/api/products/category/{category}", (string category) => {
    var results = sampleProducts.Where(p => 
        p.category.Equals(category, StringComparison.OrdinalIgnoreCase)
    ).ToArray();
    return Results.Ok(results);
})
   .WithName("GetProductsByCategory")
   .WithSummary("Get Products by Category")
   .WithDescription("Returns all products from a specific category")
   .WithTags("Products")
   .WithOpenApi();

app.MapGet("/api/products/similar", (int productId, int topN = 5) => {
    // Mock similar products logic
    var similarProducts = sampleProducts.Where(p => p.id != productId).Take(topN);
    return Results.Ok(similarProducts);
})
   .WithName("GetSimilarProducts")
   .WithSummary("Get Similar Products")
   .WithDescription("Returns similar products based on category and brand")
   .WithTags("Products")
   .WithOpenApi();

app.MapGet("/api/products/proteo50", () => {
    return Results.Ok(new {
        id = 50,
        name = "Proteo50 - Análisis Personalizado",
        description = "Producto personalizado basado en análisis de mercado",
        recommendation = "Proteína Whey con perfil nutricional optimizado",
        targetPrice = 950.00,
        features = new[] { "24g proteína", "Bajo en carbohidratos", "Sabor natural", "Sin aditivos artificiales" }
    });
})
   .WithName("GetProteo50")
   .WithSummary("Get Proteo50 Analysis")
   .WithDescription("Returns personalized product analysis and recommendations")
   .WithTags("Products")
   .WithOpenApi();

// ============================================================================
// DASHBOARD ENDPOINTS
// ============================================================================

app.MapGet("/api/dashboard/market-overview", () => new {
    totalProducts = 330,
    totalBrands = 25,
    averagePrice = 899.50,
    marketValue = 2500000.00,
    topCategories = new[] {
        new { name = "Proteína Whey", count = 145, percentage = 43.9 },
        new { name = "Creatina", count = 67, percentage = 20.3 },
        new { name = "BCAA", count = 54, percentage = 16.4 },
        new { name = "Pre-workout", count = 64, percentage = 19.4 }
    },
    priceRanges = new[] {
        new { range = "$0-500", count = 89, percentage = 27.0 },
        new { range = "$500-1000", count = 132, percentage = 40.0 },
        new { range = "$1000-1500", count = 76, percentage = 23.0 },
        new { range = "$1500+", count = 33, percentage = 10.0 }
    },
    lastUpdated = DateTime.Now
})
   .WithName("GetMarketOverview")
   .WithSummary("Market Overview")
   .WithDescription("Returns comprehensive market overview with key metrics")
   .WithTags("Dashboard")
   .WithOpenApi();

app.MapGet("/api/dashboard/product-comparison", () => new {
    topProducts = new[] {
        new { name = "Gold Standard Whey", brand = "OPTIMUM NUTRITION", price = 1299.99, rating = 4.5, marketShare = 8.2 },
        new { name = "Nitro-Tech Whey", brand = "MUSCLETECH", price = 1199.99, rating = 4.3, marketShare = 6.8 },
        new { name = "Iso100 Hydrolyzed", brand = "DYMATIZE", price = 1599.99, rating = 4.6, marketShare = 5.4 }
    },
    comparison = new {
        avgProteinContent = 23.5,
        avgPrice = 1299.99,
        avgRating = 4.4,
        totalReviews = 45670
    }
})
   .WithName("GetProductComparison")
   .WithSummary("Product Comparison")
   .WithDescription("Returns comparative analysis of top products")
   .WithTags("Dashboard")
   .WithOpenApi();

app.MapGet("/api/dashboard/prospect-ranking", () => new {
    prospects = new[] {
        new { rank = 1, name = "Proteína Vegana Premium", opportunity = 85.2, marketGap = "Alto", estimatedRevenue = 450000 },
        new { rank = 2, name = "Creatina + HMB", opportunity = 78.9, marketGap = "Medio-Alto", estimatedRevenue = 320000 },
        new { rank = 3, name = "BCAA Sabor Natural", opportunity = 72.1, marketGap = "Medio", estimatedRevenue = 280000 },
        new { rank = 4, name = "Pre-workout Sin Cafeína", opportunity = 68.4, marketGap = "Medio", estimatedRevenue = 250000 },
        new { rank = 5, name = "Proteína Hidrolizada", opportunity = 65.7, marketGap = "Bajo-Medio", estimatedRevenue = 220000 }
    },
    totalOpportunityValue = 1520000,
    analysisDate = DateTime.Now
})
   .WithName("GetProspectRanking")
   .WithSummary("Prospect Ranking")
   .WithDescription("Returns ranking of market opportunities and prospects")
   .WithTags("Dashboard")
   .WithOpenApi();

app.MapGet("/api/dashboard/brand-analysis", () => new[] {
    new { name = "OPTIMUM NUTRITION", products = 45, marketShare = 18.5, avgPrice = 1350.00, avgRating = 4.4 },
    new { name = "ENC EVOLUTION", products = 38, marketShare = 15.2, avgPrice = 890.00, avgRating = 4.2 },
    new { name = "SASCHA FITNESS", products = 32, marketShare = 12.8, avgPrice = 950.00, avgRating = 4.5 },
    new { name = "BIRDMAN", products = 28, marketShare = 11.3, avgPrice = 780.00, avgRating = 4.1 },
    new { name = "KING Protein", products = 25, marketShare = 10.1, avgPrice = 720.00, avgRating = 4.0 }
})
   .WithName("GetBrandAnalysis")
   .WithSummary("Brand Analysis")
   .WithDescription("Returns detailed analysis of protein brands in the Mexican market")
   .WithTags("Dashboard")
   .WithOpenApi();

app.MapGet("/api/dashboard/category-analysis", () => new[] {
    new { name = "Proteína Whey", products = 145, avgPrice = 1250.00, growth = 12.5, trend = "Creciente" },
    new { name = "Creatina", products = 67, avgPrice = 650.00, growth = 8.2, trend = "Estable" },
    new { name = "BCAA", products = 54, avgPrice = 890.00, growth = 15.3, trend = "Creciente" },
    new { name = "Pre-workout", products = 64, avgPrice = 980.00, growth = 22.1, trend = "Muy Creciente" }
})
   .WithName("GetCategoryAnalysis")
   .WithSummary("Category Analysis")
   .WithDescription("Returns analysis of product categories and trends")
   .WithTags("Dashboard")
   .WithOpenApi();

app.Run();

// ============================================================================
// DTOs
// ============================================================================

public record LoginRequest(string Email, string Password);
