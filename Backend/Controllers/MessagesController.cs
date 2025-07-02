using Backend___PawPal.Context;
using Backend___PawPal.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AuthorizeAttribute = Microsoft.AspNetCore.Authorization.AuthorizeAttribute;

namespace Backend___PawPal.Controllers;

[Route("[controller]")]
[ApiController]
[Authorize(AuthenticationSchemes = "Bearer")]
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
        List<Message> messages = await _context.Messages.Where(m => m.SenderId == userId || m.ReceiverId == userId).OrderBy(m => m.DateTimeSent).ToListAsync();
        return Ok(messages);
    }

    [HttpGet("AllLastMessages/{userId}")]
    public async Task<IActionResult> GetAllLastMessages([FromRoute] Guid userId)
    {
        List<Message?> latestMessages = await _context.Messages
            .Select(m => new
            {
                Message = m,
                // Normalize the user pair by ordering the IDs
                User1 = m.SenderId.CompareTo(m.ReceiverId) < 0 ? m.SenderId : m.ReceiverId,
                User2 = m.SenderId.CompareTo(m.ReceiverId) < 0 ? m.ReceiverId : m.SenderId
            })
            .GroupBy(x => new { x.User1, x.User2 })
            .Select(g => g
                .OrderByDescending(x => x.Message.DateTimeSent)
                .Select(x => x.Message)
                .FirstOrDefault())
            .ToListAsync();
        return Ok(latestMessages);

    }
}
