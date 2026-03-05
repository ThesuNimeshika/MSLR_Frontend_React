using Microsoft.AspNetCore.Mvc;
using MslrBackend.Data;
using MslrBackend.Models;
using Oracle.ManagedDataAccess.Client;

namespace MslrBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LocationsController : ControllerBase
    {
        [HttpGet]
        public IActionResult GetLocations()
        {
            var db = new CONNECTION();
            var locations = new List<Location>();
            
            try 
            {
                db.openConnection();

                using (var cmd = new OracleCommand("SELECT LOCATION_ID, LOCATION_NAME FROM LOCATION", db.GetCon()))
                {
                    using (var reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            locations.Add(new Location
                            {
                                LocationId = reader.GetInt32(0),
                                LocationName = reader.GetString(1)
                            });
                        }
                    }
                }
                return Ok(locations);
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
