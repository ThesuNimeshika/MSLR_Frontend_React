using Microsoft.AspNetCore.Mvc;
using MslrBackend.Data;
using MslrBackend.Models;
using Oracle.ManagedDataAccess.Client;
using System.Data;

namespace MslrBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SectorsController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public SectorsController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpGet]
        public IActionResult GetSectors()
        {
            var db = new CONNECTION();
            var sectors = new List<Sector>();
            
            try 
            {
                var config = _configuration.GetSection("DbConfig");
                db.OpenConnection(
                    config["UserId"], 
                    config["Password"], 
                    config["Server"]
                );

                using (var cmd = new OracleCommand("SELECT SECTOR_ID, SECTOR_NAME, SUB_SECTOR_NAME FROM SECTORS", db.GetCon()))
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            sectors.Add(new Sector
                            {
                                SectorId = reader.GetInt32(0),
                                SectorName = reader.GetString(1),
                                SubSectorName = reader.IsDBNull(2) ? null : reader.GetString(2)
                            });
                        }
                    }
                }
                return Ok(sectors);
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
    }
}
