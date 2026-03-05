using Microsoft.OpenApi.Models;
using MslrBackend.Data;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

// Root endpoint
app.MapGet("/", () => Results.Ok(new { message = "MSLR Backend is Running!", time = DateTime.Now }));

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");
app.UseAuthorization();

// Health check endpoint — tests DB connection
app.MapGet("/api/health", () => {
    var db = new CONNECTION();
    try {
        db.openConnection();
        return Results.Ok(new { 
            Database = "Connected",
            Status = "Backend is alive",
            Server = "192.168.250.22:1521/orcl"
        });
    } catch (Exception ex) {
        return Results.Problem(
            detail: ex.Message,
            title: "Database Connection Error"
        );
    } finally {
        db.Close();
    }
});

app.MapControllers();

app.Run();
