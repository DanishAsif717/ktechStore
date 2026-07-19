using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace ktechStore.Web.Controllers.Api
{
    [Route("api/[controller]")]
    [ApiController]
    public class PingController : ControllerBase
    {
        [HttpGet]
        public IActionResult Get()
        {
            return Ok(new { message = "pong" });
        }
    }
}
