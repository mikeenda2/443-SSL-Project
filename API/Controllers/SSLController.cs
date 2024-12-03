using Microsoft.AspNetCore.Mvc;

namespace Controller;

[ApiController]
[Route("api/[controller]")]
public class HelloWorldController : ControllerBase
{
  // GET api/helloworld
  [HttpGet]
  public IActionResult Get()
  {
    return Ok("Hello, World!");
  }
}
