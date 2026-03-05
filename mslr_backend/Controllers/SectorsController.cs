using Microsoft.AspNetCore.Mvc;
using MslrBackend.Data;
using MslrBackend.Models;
using Oracle.ManagedDataAccess.Client;

namespace MslrBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SectorsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetSectors()
        {
            var db = new CONNECTION();
            var sectors = new List<Sector>();
            
            try 
            {
                db.openConnection();

                using (var cmd = new OracleCommand("SELECT SECTOR_ID, SECTOR_NAME, SUB_SECTOR_NAME FROM SECTOR", db.GetCon()))
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
