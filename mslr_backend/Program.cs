using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Oracle Database
var connectionString = builder.Configuration.GetConnectionString("OracleDb");
builder.Services.AddDbContext<MslrBackend.Data.ApplicationDbContext>(options =>
    options.UseOracle(connectionString));

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.AllowAnyOrigin() // Relaxed for debugging
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

// Root endpoint for simple verification
app.MapGet("/", () => Results.Ok(new { message = "MSLR Backend is Running!", time = DateTime.Now }));

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection(); // Disabled for local dev debugging
app.UseCors("AllowFrontend");
app.UseAuthorization();

// Diagnostics moved to /api/health and /api/Sectors/test-connection

// Add a quick health check endpoint to verify DB connection
app.MapGet("/api/health", async (MslrBackend.Data.ApplicationDbContext db) => {
    try {
        var canConnect = await db.Database.CanConnectAsync();
        return Results.Ok(new { 
            Database = canConnect ? "Connected" : "Failed",
            ConnectionString = "Check appsettings.json"
        });
    } catch (Exception ex) {
        return Results.Problem(
            detail: ex.ToString(),
            title: "Database Connection Error"
        );
    }
});

app.MapControllers();

app.Run();
