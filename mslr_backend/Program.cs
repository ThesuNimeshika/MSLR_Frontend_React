using Microsoft.AspNetCore.Http;
using Microsoft.OpenApi.Models;
using MslrBackend.Data;
using Oracle.ManagedDataAccess.Client;
using System.IO;
using System;
using System.Threading.Tasks;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

// Professional Request Logging
app.Use(async (context, next) => {
    Console.WriteLine($"[SERVER INFO] Request >> {context.Request.Method}: {context.Request.Path}");
    await next();
    if (context.Response.StatusCode >= 400) {
        Console.WriteLine($"[SERVER ERROR] Status {context.Response.StatusCode} for {context.Request.Path}");
    }
});

app.UseCors("AllowFrontend");

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseRouting();
app.UseAuthorization();

// Root & Health
app.MapGet("/", () => Results.Ok(new { message = "MSLR Backend is Running!", time = DateTime.Now }));
app.MapGet("/api/health", () => Results.Ok(new { status = "Healthy" }));

// Diagnostic GET
app.MapGet("/api/Auth/Debug", () => {
    Console.WriteLine("[SERVER INFO] Diagnostic Check >> /api/Auth/Debug reached.");
    return Results.Ok(new { message = "Auth Debug Route is Working" });
});

// Robust Registration Handler
async Task<IResult> HandleRegistration(HttpContext context, string tableName) {
    Console.WriteLine($"[SERVER INFO] Registration >> Starting for {tableName}...");
    var db = new CONNECTION();
    try {
        var form = await context.Request.ReadFormAsync();
        
        string firstName = form["firstName"].ToString();
        string lastName = form["lastName"].ToString();
        string email = form["email"].ToString();
        string password = form["password"].ToString();
        string confirmPassword = form["confirmPassword"].ToString();
        string gender = form["gender"].ToString();
        string seekField = form["seekField"].ToString(); 
        bool receiveEmails = form["receiveEmails"].ToString().ToLower() == "true";
        var cvFile = form.Files.GetFile("cvFile");

        // Backend Validation
        if (password != confirmPassword) {
            Console.WriteLine($"[SERVER ERROR] Registration Failed >> Passwords mismatch for {email}");
            return Results.BadRequest(new { error = "Passwords do not match. Please check and try again." });
        }

        string? cvFileName = null;
        string? cvFilePath = null;

        if (cvFile != null && cvFile.Length > 0) {
            var uploadsFolder = Path.Combine(app.Environment.ContentRootPath, "wwwroot", "uploads", "cvs");
            if (!Directory.Exists(uploadsFolder)) Directory.CreateDirectory(uploadsFolder);
            
            cvFileName = cvFile.FileName;
            var uniqueFileName = $"{Guid.NewGuid()}_{cvFileName}";
            var filePath = Path.Combine(uploadsFolder, uniqueFileName);
            
            using (var fileStream = new FileStream(filePath, FileMode.Create)) {
                await cvFile.CopyToAsync(fileStream);
            }
            cvFilePath = Path.Combine("uploads", "cvs", uniqueFileName);
        }

        db.openConnection();
        
        // Ensure table name is safe and PASSWORD_SALT is used
        string sql = $@"INSERT INTO {tableName} (FIRST_NAME, LAST_NAME, EMAIL, PASSWORD_HASH, PASSWORD_SALT, GENDER, RECEIVE_EMAILS, CV_FILE_NAME, CV_FILE_PATH, IS_VERIFIED, IS_ACTIVE, CREATED_AT, SECTOR_ID) 
                       VALUES (:firstName, :lastName, :email, :password, :passwordSalt, :gender, :receiveEmails, :cvFileName, :cvFilePath, :isVerified, :isActive, CURRENT_TIMESTAMP, :sectorId)";

        using (var cmd = new OracleCommand(sql, db.GetCon())) {
            cmd.BindByName = true;
            cmd.Parameters.Add("firstName", OracleDbType.Varchar2).Value = firstName;
            cmd.Parameters.Add("lastName", OracleDbType.Varchar2).Value = lastName;
            cmd.Parameters.Add("email", OracleDbType.Varchar2).Value = email;
            cmd.Parameters.Add("password", OracleDbType.Varchar2).Value = password;
            cmd.Parameters.Add("passwordSalt", OracleDbType.Varchar2).Value = confirmPassword;
            cmd.Parameters.Add("gender", OracleDbType.Varchar2).Value = (object?)gender ?? DBNull.Value;
            cmd.Parameters.Add("receiveEmails", OracleDbType.Int32).Value = receiveEmails ? 1 : 0;
            cmd.Parameters.Add("cvFileName", OracleDbType.Varchar2).Value = (object?)cvFileName ?? DBNull.Value;
            cmd.Parameters.Add("cvFilePath", OracleDbType.Varchar2).Value = (object?)cvFilePath ?? DBNull.Value;
            cmd.Parameters.Add("isVerified", OracleDbType.Int32).Value = 0;
            cmd.Parameters.Add("isActive", OracleDbType.Int32).Value = 1;
            cmd.Parameters.Add("sectorId", OracleDbType.Varchar2).Value = (object?)seekField ?? DBNull.Value;
            
            int rowsAffected = await cmd.ExecuteNonQueryAsync();
            Console.WriteLine($"[SERVER SUCCESS] Database Update >> {tableName} table updated. Rows affected: {rowsAffected}");
        }

        Console.WriteLine($"[SERVER SUCCESS] Registration Complete >> {email}");
        return Results.Ok(new { 
            message = "Successfully saved", 
            status = "success",
            data = new {
                firstName,
                lastName,
                email,
                gender,
                seekField
            }
        });
    } catch (Exception ex) {
        Console.WriteLine($"[SERVER ERROR] Registration Failed >> {ex.Message}");
        return Results.Problem(detail: ex.Message, title: "Database Insertion Failed", statusCode: 500);
    } finally {
        db.Close();
    }
}

// Endpoints using explicit return types for reliability
app.MapPost("/api/Auth/Register", async (HttpContext context) => {
    return await HandleRegistration(context, "SEEKER");
});

app.MapPost("/api/Auth/RegisterOverseas", async (HttpContext context) => {
    return await HandleRegistration(context, "OVERSEAS_SEEKER");
});

// Seeker Login Endpoint
app.MapPost("/api/Auth/Login", async (HttpContext context) => {
    Console.WriteLine("[SERVER INFO] Seeker Login >> Attempting login...");
    var db = new CONNECTION();
    try {
        var form = await context.Request.ReadFormAsync();
        string email = form["email"].ToString();
        string password = form["password"].ToString();

        if (string.IsNullOrEmpty(email) || string.IsNullOrEmpty(password)) {
            return Results.BadRequest(new { error = "Email and password are required." });
        }

        db.openConnection();
        string sql = "SELECT SEEKER_ID, FIRST_NAME, LAST_NAME, EMAIL, GENDER, SECTOR_ID FROM SEEKER WHERE EMAIL = :email AND PASSWORD_HASH = :password";

        using (var cmd = new OracleCommand(sql, db.GetCon())) {
            cmd.BindByName = true;
            cmd.Parameters.Add("email", OracleDbType.Varchar2).Value = email;
            cmd.Parameters.Add("password", OracleDbType.Varchar2).Value = password;

            using (var reader = await cmd.ExecuteReaderAsync()) {
                if (await reader.ReadAsync()) {
                    var seeker = new {
                        seekerId = reader.GetDecimal(0),
                        firstName = reader.GetString(1),
                        lastName = reader.GetString(2),
                        email = reader.GetString(3),
                        gender = reader.IsDBNull(4) ? null : reader.GetString(4),
                        sectorId = reader.IsDBNull(5) ? null : reader.GetString(5)
                    };
                    Console.WriteLine($"[SERVER SUCCESS] Seeker Login >> Success for {email}");
                    return Results.Ok(seeker);
                } else {
                    Console.WriteLine($"[SERVER ERROR] Seeker Login >> Invalid credentials for {email}");
                    return Results.Unauthorized();
                }
            }
        }
    } catch (Exception ex) {
        Console.WriteLine($"[SERVER ERROR] Seeker Login Failed >> {ex.Message}");
        return Results.Problem(detail: ex.Message, title: "Login Failed", statusCode: 500);
    } finally {
        db.Close();
    }
});

app.MapControllers();

// Professional Startup Banner
Console.WriteLine("==================================================");
Console.WriteLine("   MSLR RECRUITMENT PORTAL - BACKEND IS RUNNING   ");
Console.WriteLine("   URL: http://localhost:5194                     ");
Console.WriteLine("   Time: " + DateTime.Now.ToString("F"));
Console.WriteLine("==================================================");

app.Run();
