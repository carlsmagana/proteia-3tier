var builder = WebApplication.CreateBuilder(args);

var app = builder.Build();

app.MapGet("/", () => "Proteia API is running! " + DateTime.Now);
app.MapGet("/health", () => new { status = "ok", time = DateTime.Now });

app.Run();
