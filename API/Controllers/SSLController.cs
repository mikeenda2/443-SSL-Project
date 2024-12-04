using API.Services;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class SSLController : ControllerBase
    {
        private readonly ISSLCertificateService _sslCertificateService;

        public SSLController(ISSLCertificateService sslCertificateService)
        {
            _sslCertificateService = sslCertificateService;
        }

        [HttpGet("{url}")]
        public async Task<IActionResult> GetCertificateDetails(string url)
        {
            try
            {
                // Decode the URL before passing it along for processing
                string decodedUrl = System.Uri.UnescapeDataString(url);
                var certificateDetails = await _sslCertificateService.GetSSLCertificateDetailsAsync(decodedUrl);
                return Ok(certificateDetails);
            }
            catch (System.UriFormatException)
            {
                // If the URL is invalid, return a bad request response
                return BadRequest("Invalid URL format.");
            }
            catch (Exception ex)
            {
                // Handle any unexpected errors
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}
