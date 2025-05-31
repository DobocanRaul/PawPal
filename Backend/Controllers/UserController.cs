using Backend___PawPal.Context;
using Backend___PawPal.DTOs;
using Backend___PawPal.Models;
using Backend___PawPal.Validators;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Backend___PawPal.Controllers;


[Route("api/[controller]")]
[ApiController]
public class UserController : Controller
{

    private readonly PawPalDbContext _context;
    private readonly ProfileValidator _validator = new ProfileValidator();
    public UserController(PawPalDbContext context)
    {
        _context = context ?? throw new ArgumentNullException(nameof(context));

    }

    [HttpGet("GetUserPhoto/{userId}")]
    public async Task<IActionResult> GetUserPhoto([FromRoute] Guid userId)
    {
        User user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user != null)
        {
            return File(user.Image, "image/jpg");
        }
        else { 
            return NotFound(new
            {
                StatusCode = HttpStatusCode.NotFound,
                Message = "User not found"
            });
        }
    }

    [HttpGet("GetUser/{userId}")]
    public async Task<IActionResult> GetUser([FromRoute]Guid userId)
    {
        User user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);

        UserDto userDto;
        if (user != null)
        {
            userDto = new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Rating = user.Rating,
                Image = user.Image
            };
            return Ok(userDto);
        }

        return NotFound(new
        {
            StatusCode = HttpStatusCode.NotFound,
            Message = "User not found"
        });
    }

    [HttpPost("CreateUser")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateUser([FromForm] UserDtoForm userDto) {
        User newUser = new User();

        if (!_validator.Validate(userDto))
        { 
            return BadRequest(
                new
                {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Invalid user data"
                }
                           );
        }
        newUser.Id = Guid.NewGuid();
        newUser.Name = userDto.Name;
        newUser.Rating = 0;
        using var memoryStream = new MemoryStream();
        await userDto.Image.CopyToAsync(memoryStream);
        newUser.Image = memoryStream.ToArray();
        _context.Users.Add(newUser);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetUser), new { userId = newUser.Id }, new User
        {
            Id = newUser.Id,
            Name = newUser.Name,
            Rating = newUser.Rating,
            Image = newUser.Image
        });
    }
}
