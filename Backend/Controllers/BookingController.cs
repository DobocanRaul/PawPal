using Microsoft.AspNetCore.Mvc;

namespace Backend___PawPal.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BookingController : ControllerBase
{

    public BookingController()
    {
    }


    [HttpGet("GetRequests/{userId}")]
    public async Task<IActionResult> GetRequests(int userId)
    {
        // Simulate fetching requests from a database
        var requests = new List<string>
        {
            "Request 1",
            "Request 2",
            "Request 3"
        };

        return Ok(requests);
    }
}
