using AutoMapper;
using Backend___PawPal.Context;
using Backend___PawPal.DTOs;
using Backend___PawPal.Models;
using Backend___PawPal.Validators;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Backend___PawPal.Controllers;


[Route("[controller]")]
[ApiController]
[Authorize(AuthenticationSchemes = "Bearer")]
public class UserController : ControllerBase
{

    private readonly PawPalDbContext _context;
    private readonly ProfileValidator _validator = new ProfileValidator();
    private readonly IMapper _mapper ;
    public UserController(PawPalDbContext context,IMapper mapper )
    {
        _context = context ;
        _mapper = mapper ;
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

        if (user != null)
        {
            return Ok(user);
        }

        return NotFound(new
        {
            StatusCode = HttpStatusCode.NotFound,
            Message = "User not found"
        });
    }

    [HttpPost("CreateUser")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> CreateUser([FromForm] UserDto userDto) {
        User newUser = await _context.Users.FirstOrDefaultAsync(u => u.Email == userDto.Email);

        if(newUser != null)
        {
            return BadRequest(new
            {
                StatusCode = HttpStatusCode.BadRequest,
                Message = "User with this email already exists"
            });
        }
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
        newUser = new User();
        _mapper.Map(userDto, newUser);
        newUser.Id = Guid.NewGuid();
        newUser.Rating = 0;
        newUser.NumberOfRatings = 0;
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

    [HttpPut("UpdateUser/{userId}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdateUser([FromForm] UserDto user)
    {
        User foundUser = await _context.Users.FirstOrDefaultAsync(dbUser => user.Id == dbUser.Id);
        if (foundUser == null) {
            return NotFound();
        }

        _mapper.Map(user, foundUser);

        await _context.SaveChangesAsync();
        return Ok(foundUser);

        
    }

}
