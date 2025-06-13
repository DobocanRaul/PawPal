using AutoMapper;
using Backend___PawPal.Context;
using Backend___PawPal.DTOs;
using Backend___PawPal.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IConfiguration _config;
    private readonly PawPalDbContext _context;
    private readonly IMapper _mapper;

    public AuthController(UserManager<IdentityUser> userManager, IConfiguration config, PawPalDbContext context, IMapper mapper)
    {
        _userManager = userManager;
        _config = config;
        _context = context;
        _mapper = mapper;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto model)
    {
        var user = await _userManager.FindByNameAsync(model.Email);
        if (user != null && await _userManager.CheckPasswordAsync(user, model.Password))
        {
            var authClaims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.UserName),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var authSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_config["jwtConfig:secret"]));

            var token = new JwtSecurityToken(
                issuer: _config["jwtConfig:validIssuer"],
                audience: _config["jwtConfig:validAudience"],
                expires: DateTime.UtcNow.AddHours(1),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
            );

            User userProfile = await _context.Users.FirstOrDefaultAsync(user => user.Email == model.Email);

            if (userProfile == null) { 
                return NotFound();
            }
            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(token),
                expiration = token.ValidTo,
                userId = userProfile.Id,
            });
        }

        return Unauthorized();
    }

    [HttpPost("register")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> Register([FromForm] RegisterDto model)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var userExists = await _userManager.FindByEmailAsync(model.Email);
        if (userExists != null)
            return Conflict(new { message = "User already exists!" });

        var user = new IdentityUser
        {
            UserName = model.Email,
            Email = model.Email,

        };

        var result = await _userManager.CreateAsync(user, model.Password);

        if (!result.Succeeded)
            return BadRequest(result.Errors);

        var appUser = _mapper.Map<RegisterDto, User>(model);
        if (appUser == null)
            return BadRequest(new{
                                      StatusCode = HttpStatusCode.BadRequest,
                                      Message = "Invalid register data"
                                  });



        await _context.Users.AddAsync(appUser);
        await _context.SaveChangesAsync();

        return Ok(new { message = "User registered successfully!" });
    }

}
