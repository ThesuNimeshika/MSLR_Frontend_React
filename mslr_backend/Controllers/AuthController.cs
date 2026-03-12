using Microsoft.AspNetCore.Mvc;

namespace MslrBackend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        // Registration is handled as a Minimal API in Program.cs to ensure direct database mapping
        
        [HttpGet("Test")]
        public IActionResult Test() => Ok(new { message = "Auth controller is active" });
    }
}
