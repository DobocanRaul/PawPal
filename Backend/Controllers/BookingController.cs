using AutoMapper;
using Backend___PawPal.Context;
using Backend___PawPal.DTOs;
using Backend___PawPal.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Backend___PawPal.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BookingController : ControllerBase
{

    private readonly PawPalDbContext _context;
    private readonly IMapper _mapper;
    public BookingController(PawPalDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet("getBooking/{bookingId}")]
    public async Task<IActionResult> GetBooking([FromRoute] Guid bookingId)
    {
        Booking booking = await _context.Bookings.Include(b => b.Pet).FirstOrDefaultAsync(b => b.Id == bookingId);
        if (booking == null)
        {
            return NotFound(new { Message = "Booking not found." });
        }

        BookingDto bookingDto = _mapper.Map<BookingDto>(booking);
        Console.WriteLine(JsonSerializer.Serialize(bookingDto));
        return Ok(bookingDto);
    }

    [HttpGet("getUserBookings/{userId}")]
    public async Task<IActionResult> GetUserBookings([FromRoute] Guid userId)
    {
        List<Booking> bookings = await _context.Bookings
            .Include(b => b.Pet)
            .Where(b => b.OwnerId == userId)
            .ToListAsync();
        if (bookings == null || !bookings.Any())
        {
            return NotFound(new { Message = "No bookings found for the specified user." });
        }
        return Ok(bookings);


    }

    [HttpGet("getSitterBookings/{sitterId}")]
    public async Task<IActionResult> GetSitterBookings([FromRoute] Guid sitterId)
    {
        List<Booking> bookings = await _context.Bookings
            .Include(b => b.Pet)
            .Where(b => b.UserId == sitterId && b.StartDate >= DateOnly.FromDateTime(DateTime.Today))
            .ToListAsync();
        if (bookings == null || !bookings.Any())
        {
            return NotFound(new { Message = "No bookings found for the specified sitter." });
        }
        List<BookingDto> bookingDtos = _mapper.Map<List<BookingDto>>(bookings);
        return Ok(bookingDtos);
    }


    [HttpGet("getAvailableBookingsByLocation/{cityName}")]
    public async Task<IActionResult> GetAvailableBookingsByLocation([FromRoute] string cityName)
    {
        List<Booking> bookings = await _context.Bookings
            .Include(b => b.Pet)
            .Where(b => b.Address.Contains(", " + cityName) && b.UserId == null && b.StartDate >= DateOnly.FromDateTime(DateTime.Today))
            .ToListAsync();
        return Ok(bookings);
    }

    [HttpGet("getSittingHistory /{sitterId}")]
    public async Task<IActionResult> GetSittingHistory([FromRoute] Guid sitterId)
    { 
        List<Booking> bookings = await _context.Bookings
            .Include(b => b.Pet)
            .Where(b => b.UserId == sitterId && b.EndDate < DateOnly.FromDateTime(DateTime.Today))
            .ToListAsync();

        return Ok(bookings);
    }

    [HttpPut("setSitter")]
    public async Task<IActionResult> SetSitter([FromBody] SitterBookingDto sitterBookingDto)
    {
        Booking booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == sitterBookingDto.BookingId);
        if(booking == null)
        {
            return NotFound(new { Message = "Booking not found." });
        }
        User sitter = await _context.Users.FirstOrDefaultAsync(u => u.Id == sitterBookingDto.SitterId);
        if (sitter == null)
        {
            return NotFound(new { Message = "Sitter not found." });
        }
        booking.UserId = sitterBookingDto.SitterId;

        await _context.SaveChangesAsync();
        return Ok(new { Message = "Sitter assigned successfully." });
    }

    [HttpPost("createBooking")]
    public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto booking)
    {
        if (booking == null)
        {
            return BadRequest(new { Message = "Invalid booking data." });
        }

        Booking newBooking = _mapper.Map<Booking>(booking);
        newBooking.Id = Guid.NewGuid();
        Pet pet = await _context.Pets.FirstOrDefaultAsync(p => p.Id == booking.PetId);
        if (pet ==null)
        {
            return BadRequest(new { Message = "No valid pet found for the booking." });
        }
        newBooking.Pet = pet;
        newBooking.OwnerId =newBooking.Pet.OwnerId;
        newBooking.Address = newBooking.Pet.Address;
        _context.Bookings.Add(newBooking);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBooking), new { bookingId = newBooking.Id }, newBooking);
    }



    [HttpDelete("deleteBooking/{bookingId}")]
    public async Task<IActionResult> DeleteBooking([FromRoute] Guid bookingId)
    {
        Booking booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId);
        if (booking == null)
        {
            return NotFound(new { Message = "Booking not found." });
        }

        _context.Bookings.Remove(booking);
        await _context.SaveChangesAsync();
        return NoContent();
    }
    
}
