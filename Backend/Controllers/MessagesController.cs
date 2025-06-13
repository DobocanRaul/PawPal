using Backend___PawPal.Context;
using Backend___PawPal.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend___PawPal.Controllers;

[Route("[controller]")]
[ApiController]
public class MessagesController : ControllerBase
{
    private readonly PawPalDbContext _context;
    public MessagesController(PawPalDbContext context)
    {
        _context= context;
    }
    [HttpGet("AllMessages/{userId}")]
    public async Task<IActionResult> GetAllMessages([FromRoute]Guid userId)
    {
        List<Message> messages = await _context.Messages.Where(m => m.SenderId == userId || m.ReceiverId == userId).OrderByDescending(m => m.DateTimeSent).ToListAsync();
        return Ok(messages);
    }
}
