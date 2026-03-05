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

        [HttpGet]
        public IActionResult GetJobs()
        {
            var db = new CONNECTION();
            var jobs = new List<Job>();
            
            try 
            {
                db.openConnection();

                string sql = @"
                    SELECT j.JOB_ID, j.JOB_TITLE, c.FULL_NAME as COMPANY_NAME, j.JOB_DESCRIPTION, j.POSTED_DATE, j.APPLICATION_DEADLINE, j.SALARY_RANGE,
                           s.SECTOR_ID, s.SECTOR_NAME, s.SUB_SECTOR_NAME,
                           l.LOCATION_ID, l.LOCATION_NAME
                    FROM JOBS j
                    LEFT JOIN CLIENT_USER c ON j.CLIENT_USER_ID = c.CLIENT_USER_ID
                    LEFT JOIN SECTOR s ON j.SECTOR_ID = s.SECTOR_ID
                    LEFT JOIN LOCATION l ON j.LOCATION_ID = l.LOCATION_ID
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
                db.openConnection();

                string sql = @"
                    SELECT j.JOB_ID, j.JOB_TITLE, c.FULL_NAME as COMPANY_NAME, j.JOB_DESCRIPTION, j.POSTED_DATE, j.APPLICATION_DEADLINE, j.SALARY_RANGE,
                           s.SECTOR_ID, s.SECTOR_NAME, s.SUB_SECTOR_NAME,
                           l.LOCATION_ID, l.LOCATION_NAME
                    FROM JOBS j
                    LEFT JOIN CLIENT_USER c ON j.CLIENT_USER_ID = c.CLIENT_USER_ID
                    LEFT JOIN SECTOR s ON j.SECTOR_ID = s.SECTOR_ID
                    LEFT JOIN LOCATION l ON j.LOCATION_ID = l.LOCATION_ID
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
                JobId = reader.GetDecimal(0),
                JobTitle = reader.GetString(1),
                CompanyName = reader.IsDBNull(2) ? null : reader.GetString(2),
                JobDescription = reader.IsDBNull(3) ? null : reader.GetString(3),
                PostedDate = reader.GetDateTime(4),
                ApplicationDeadline = reader.IsDBNull(5) ? null : reader.GetDateTime(5),
                SalaryRange = reader.IsDBNull(6) ? null : reader.GetString(6),
                SectorId = reader.IsDBNull(7) ? 0 : reader.GetDecimal(7),
                Sector = reader.IsDBNull(7) ? null : new Sector { 
                    SectorId = reader.GetDecimal(7), 
                    SectorName = reader.GetString(8),
                    SubSectorName = reader.IsDBNull(9) ? null : reader.GetString(9)
                },
                LocationId = reader.IsDBNull(10) ? 0 : reader.GetDecimal(10),
                Location = reader.IsDBNull(10) ? null : new Location { 
                    LocationId = reader.GetDecimal(10), 
                    LocationName = reader.GetString(11) 
                }
            };
        }
    }
}
