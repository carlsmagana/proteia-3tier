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
   .WithOpenApi();

app.MapGet("/health", () => new { status = "ok", time = DateTime.Now })
   .WithName("GetHealth")
   .WithOpenApi();

app.MapGet("/api/test", () => new { 
    message = "Test endpoint working", 
    data = new[] { "Product1", "Product2", "Product3" },
    backend_url = "https://proteia-api-dvcegdeaf3execfd.westus2-01.azurewebsites.net"
})
   .WithName("GetTest")
   .WithOpenApi();

app.Run();
