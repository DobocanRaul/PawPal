using Backend___PawPal.Context;
using Backend___PawPal.DTOs;
using Backend___PawPal.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly IConfiguration _config;
    private readonly PawPalDbContext _context;

    public AuthController(UserManager<IdentityUser> userManager, IConfiguration config, PawPalDbContext context)
    {
        _userManager = userManager;
        _config = config;
        _context = context;
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
}
