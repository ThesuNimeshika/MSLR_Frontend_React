using Microsoft.AspNetCore.Mvc;
using MslrBackend.Data;
using MslrBackend.Models;
using Oracle.ManagedDataAccess.Client;
using System.Data;

namespace MslrBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobsController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public JobsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult GetJobs()
        {
            var db = new CONNECTION();
            var jobs = new List<Job>();
            
            try 
            {
                var config = _configuration.GetSection("DbConfig");
                db.OpenConnection(config["UserId"], config["Password"], config["Server"]);

                string sql = @"
                    SELECT j.JOB_ID, j.JOB_TITLE, j.COMPANY_NAME, j.JOB_DESCRIPTION, j.POSTED_DATE, j.EXPIRY_DATE,
                           s.SECTOR_ID, s.SECTOR_NAME, s.SUB_SECTOR_NAME,
                           l.LOCATION_ID, l.LOCATION_NAME
                    FROM JOBS j
                    LEFT JOIN SECTORS s ON j.SECTOR_ID = s.SECTOR_ID
                    LEFT JOIN LOCATIONS l ON j.LOCATION_ID = l.LOCATION_ID
                    ORDER BY j.POSTED_DATE DESC";

                using (var cmd = new OracleCommand(sql, db.GetCon()))
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            jobs.Add(MapJob(reader));
                        }
                    }
                }
                return Ok(jobs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Database Connection Error", details = ex.Message });
            }
            finally
            {
                db.Close();
            }
        }

        [HttpGet("search")]
        public IActionResult SearchJobs(string? title, string? location, string? category)
        {
            var db = new CONNECTION();
            var jobs = new List<Job>();
            
            try 
            {
                var config = _configuration.GetSection("DbConfig");
                db.OpenConnection(config["UserId"], config["Password"], config["Server"]);

                string sql = @"
                    SELECT j.JOB_ID, j.JOB_TITLE, j.COMPANY_NAME, j.JOB_DESCRIPTION, j.POSTED_DATE, j.EXPIRY_DATE,
                           s.SECTOR_ID, s.SECTOR_NAME, s.SUB_SECTOR_NAME,
                           l.LOCATION_ID, l.LOCATION_NAME
                    FROM JOBS j
                    LEFT JOIN SECTORS s ON j.SECTOR_ID = s.SECTOR_ID
                    LEFT JOIN LOCATIONS l ON j.LOCATION_ID = l.LOCATION_ID
                    WHERE 1=1";

                if (!string.IsNullOrEmpty(title)) sql += " AND j.JOB_TITLE LIKE :title";
                if (!string.IsNullOrEmpty(location)) sql += " AND l.LOCATION_NAME = :location";
                if (!string.IsNullOrEmpty(category)) sql += " AND s.SECTOR_NAME = :category";

                using (var cmd = new OracleCommand(sql, db.GetCon()))
                {
                    if (!string.IsNullOrEmpty(title)) cmd.Parameters.Add("title", OracleDbType.Varchar2).Value = $"%{title}%";
                    if (!string.IsNullOrEmpty(location)) cmd.Parameters.Add("location", OracleDbType.Varchar2).Value = location;
                    if (!string.IsNullOrEmpty(category)) cmd.Parameters.Add("category", OracleDbType.Varchar2).Value = category;

                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            jobs.Add(MapJob(reader));
                        }
                    }
                }
                return Ok(jobs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { error = "Search Error", details = ex.Message });
            }
            finally
            {
                db.Close();
            }
        }

        private Job MapJob(OracleDataReader reader)
        {
            return new Job
            {
                JobId = reader.GetInt32(0),
                JobTitle = reader.GetString(1),
                CompanyName = reader.GetString(2),
                JobDescription = reader.IsDBNull(3) ? null : reader.GetString(3),
                PostedDate = reader.GetDateTime(4),
                ExpiryDate = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                SectorId = reader.IsDBNull(6) ? null : (int?)reader.GetInt32(6),
                Sector = reader.IsDBNull(6) ? null : new Sector { 
                    SectorId = reader.GetInt32(6), 
                    SectorName = reader.GetString(7),
                    SubSectorName = reader.IsDBNull(8) ? null : reader.GetString(8)
                },
                LocationId = reader.IsDBNull(9) ? null : (int?)reader.GetInt32(9),
                Location = reader.IsDBNull(9) ? null : new Location { 
                    LocationId = reader.GetInt32(9), 
                    LocationName = reader.GetString(10) 
                }
            };
        }
    }
}
