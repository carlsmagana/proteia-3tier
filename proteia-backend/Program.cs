var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure Swagger
app.UseSwagger();
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "Proteia API v1");
    c.RoutePrefix = string.Empty; // Swagger UI at root
});

// API Endpoints
app.MapGet("/", () => "Proteia API is running! " + DateTime.Now)
   .WithName("GetRoot")
   .WithSummary("API Status")
   .WithDescription("Returns the current status and timestamp of the Proteia API")
   .WithOpenApi();

app.MapGet("/health", () => new { status = "ok", time = DateTime.Now })
   .WithName("GetHealth")
   .WithSummary("Health Check")
   .WithDescription("Returns the health status of the API")
   .WithOpenApi();

app.MapGet("/api/test", () => new { 
    message = "Test endpoint working", 
    data = new[] { "Product1", "Product2", "Product3" },
    backend_url = "https://proteia-api-dvcegdeaf3execfd.westus2-01.azurewebsites.net"
})
   .WithName("GetTest")
   .WithSummary("Test Endpoint")
   .WithDescription("Returns test data to verify API connectivity")
   .WithOpenApi();

// Proteia Business Endpoints
app.MapGet("/api/products", () => new {
    products = new[] {
        new { id = 1, name = "Proteína Whey Gold", brand = "OPTIMUM NUTRITION", price = 1299.99, protein = "24g" },
        new { id = 2, name = "Creatina Monohidrato", brand = "ENC EVOLUTION", price = 599.99, protein = "0g" },
        new { id = 3, name = "BCAA Energy", brand = "SASCHA FITNESS", price = 899.99, protein = "5g" }
    },
    total = 3,
    message = "Sample product data from Mexican protein market"
})
   .WithName("GetProducts")
   .WithSummary("Get Products")
   .WithDescription("Returns a list of protein products from the Mexican market")
   .WithTags("Products")
   .WithOpenApi();

app.MapGet("/api/products/{id}", (int id) => {
    var products = new[] {
        new { id = 1, name = "Proteína Whey Gold", brand = "OPTIMUM NUTRITION", price = 1299.99, protein = "24g", description = "Proteína de suero de alta calidad" },
        new { id = 2, name = "Creatina Monohidrato", brand = "ENC EVOLUTION", price = 599.99, protein = "0g", description = "Creatina pura para rendimiento" },
        new { id = 3, name = "BCAA Energy", brand = "SASCHA FITNESS", price = 899.99, protein = "5g", description = "Aminoácidos ramificados con energía" }
    };
    
    var product = products.FirstOrDefault(p => p.id == id);
    return product != null ? Results.Ok(product) : Results.NotFound(new { message = "Product not found" });
})
   .WithName("GetProductById")
   .WithSummary("Get Product by ID")
   .WithDescription("Returns details of a specific product by its ID")
   .WithTags("Products")
   .WithOpenApi();

app.MapGet("/api/dashboard/overview", () => new {
    totalProducts = 330,
    totalBrands = 25,
    averagePrice = 899.50,
    topCategories = new[] { "Proteína Whey", "Creatina", "BCAA", "Pre-workout" },
    marketValue = 2500000.00,
    lastUpdated = DateTime.Now
})
   .WithName("GetDashboardOverview")
   .WithSummary("Dashboard Overview")
   .WithDescription("Returns key metrics and overview data for the dashboard")
   .WithTags("Dashboard")
   .WithOpenApi();

app.MapGet("/api/analytics/brands", () => new {
    brands = new[] {
        new { name = "OPTIMUM NUTRITION", products = 45, marketShare = 18.5 },
        new { name = "ENC EVOLUTION", products = 38, marketShare = 15.2 },
        new { name = "SASCHA FITNESS", products = 32, marketShare = 12.8 },
        new { name = "BIRDMAN", products = 28, marketShare = 11.3 },
        new { name = "KING Protein", products = 25, marketShare = 10.1 }
    },
    totalBrands = 25,
    analysisDate = DateTime.Now
})
   .WithName("GetBrandAnalytics")
   .WithSummary("Brand Analytics")
   .WithDescription("Returns analytics data for protein brands in the Mexican market")
   .WithTags("Analytics")
   .WithOpenApi();

app.Run();
