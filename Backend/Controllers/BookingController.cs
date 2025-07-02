using AutoMapper;
using Backend___PawPal.Context;
using Backend___PawPal.DTOs;
using Backend___PawPal.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace Backend___PawPal.Controllers;

[Route("[controller]")]
[ApiController]
[Authorize(AuthenticationSchemes = "Bearer")]
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
        Booking booking = await _context.Bookings.Include(b => b.Pet).Include(b =>b.User).FirstOrDefaultAsync(b => b.Id == bookingId);
        if (booking == null)
        {
            return NotFound(new { Message = "Booking not found." });
        }

        BookingDto bookingDto = _mapper.Map<BookingDto>(booking);
        Console.WriteLine(JsonSerializer.Serialize(bookingDto));
        return Ok(bookingDto);
    }

    [HttpGet("GetUsersForBookings/{userId}")]
    public async Task<IActionResult> GetUsersForBookings([FromRoute] Guid userId)
    { 
        List<User> sittersOfbookings= await _context.Bookings
            .Include(b=>b.User)
            .Where(b=> b.OwnerId==userId && b.UserId!=null && b.UserId!=userId)
            .Select(b=>b.User)
            .ToListAsync();

        List<User> ownersOfBookings = await _context.Bookings
            .Include(b => b.Owner)
            .Where(b => b.UserId == userId && b.OwnerId!=userId)
            .Select(b => b.Owner)
            .ToListAsync();

        List<User> bookingRequestsOwners = await _context.BookingRequests
            .Include(b => b.Sitter)
            .Include(b => b.Booking)
            .Where(b => b.Booking.OwnerId == userId)
            .Select(b=>b.Sitter)
            .ToListAsync();

       List <User> bookingRequestsSitters = await _context.BookingRequests
            .Include(b => b.Sitter)
            .Include(b => b.Booking)
            .Include (b=>b.Booking.Owner)
            .Where(b => b.SitterId == userId)
            .Select(b => b.Booking.Owner)
            .ToListAsync();

        sittersOfbookings.AddRange(ownersOfBookings);
        sittersOfbookings.AddRange(bookingRequestsOwners);
        sittersOfbookings.AddRange(bookingRequestsSitters);

        List<User> response = sittersOfbookings.Distinct().ToList();


        return Ok(response);

    }
    [HttpGet("getUserBookings/{userId}")]
    public async Task<IActionResult> GetUserBookings([FromRoute] Guid userId)
    {
        List<Booking> bookings = await _context.Bookings
            .Include(b => b.Pet)
            .Include(b => b.User)
            .Where(b => b.OwnerId == userId && b.StartDate> DateOnly.FromDateTime(DateTime.Now))
            .OrderBy(b => b.StartDate)
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
            .Include(b => b.User)
            .Where(b => b.UserId == sitterId && b.StartDate >= DateOnly.FromDateTime(DateTime.Today))
            .ToListAsync();
        if (bookings == null || !bookings.Any())
        {
            return NotFound(new { Message = "No bookings found for the specified sitter." });
        }
        List<BookingDto> bookingDtos = _mapper.Map<List<BookingDto>>(bookings);
        return Ok(bookingDtos);
    }


    [HttpGet("getAvailableBookingsByLocation/{cityName}/{userId}")]
    public async Task<IActionResult> GetAvailableBookingsByLocation([FromRoute] string cityName, [FromRoute]Guid userId)
    {
        List<Booking> bookings = await _context.Bookings
            .Include(b => b.Pet)
            .Where(b => b.Address.Contains(", " + cityName)&& b.OwnerId != userId && b.UserId == null && b.StartDate > DateOnly.FromDateTime(DateTime.Today))
            .ToListAsync();
        return Ok(bookings);
    }

    [HttpGet("getSitterSittingHistory/{sitterId}")]
    public async Task<IActionResult> GetSitterSittingHistory([FromRoute] Guid sitterId)
    { 
        List<Booking> bookings = await _context.Bookings
            .Include(b => b.Pet)
            .Include(b => b.User)
            .Where(b => b.UserId == sitterId && b.StartDate < DateOnly.FromDateTime(DateTime.Today))
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

    [HttpGet("getOwnerSittingHistory/{ownerId}")]
    public async Task<IActionResult> GetOwnerSittingHistory([FromRoute]Guid ownerId)
    {
        List<Booking> bookings = await _context.Bookings
            .Include(b => b.Pet)
            .Include(b => b.User)
            .Where(b => b.StartDate <= DateOnly.FromDateTime(DateTime.Today) && b.OwnerId==ownerId)
            .ToListAsync();

        List<BookingDto> bookingDtos = _mapper.Map<List<BookingDto>>(bookings);
        return Ok(bookingDtos);
    }

    [HttpPost("createBooking")]
    public async Task<IActionResult> CreateBooking([FromBody] CreateBookingDto booking)
    {
        if (booking == null)
        {
            return BadRequest(new { Message = "Invalid booking data." });
        }
        Pet pet = await _context.Pets.FirstOrDefaultAsync(p => p.Id == booking.PetId);
        if (pet ==null)
        {
            return BadRequest(new { Message = "No valid pet found for the booking." });
        }

        try
        {
            DateOnly startDate = DateOnly.Parse(booking.StartDate);
            DateOnly endDate = DateOnly.Parse(booking.EndDate);
            if (startDate > endDate)
            { 
                return BadRequest(new { Message="StartDate bigger than End date"});
            }
            Booking existingBooking = await _context.Bookings.FirstOrDefaultAsync(p => p.PetId == booking.PetId && startDate == p.StartDate && p.EndDate == endDate || p.StartDate>= startDate && p.EndDate <= endDate);
            if (existingBooking != null) {
                return BadRequest(new { Message = "Request for the same date already exists" });
            }
            
        }
        catch (Exception ex)
        {
            return BadRequest(new { Message = "Date format invalid" });
        }
            
        Booking newBooking = _mapper.Map<Booking>(booking);
        newBooking.Id = Guid.NewGuid();
        newBooking.Pet = pet;
        newBooking.OwnerId =newBooking.Pet.OwnerId;
        newBooking.Address = newBooking.Pet.Address;
        _context.Bookings.Add(newBooking);
        await _context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetBooking), new { bookingId = newBooking.Id }, newBooking);
    }



    [HttpDelete("DeleteBooking/{bookingId}")]
    public async Task<IActionResult> DeleteBooking(Guid bookingId)
    {
        try
        {
            var booking = await _context.Bookings.FirstOrDefaultAsync(b => b.Id == bookingId);
            if (booking == null)
            {
                return NotFound(new { Message = "Booking not found." });
            }

            if (booking.UserId != null)
            {
                return BadRequest(new { Message = "Sitting is booked!" });
            }

            var requests = _context.BookingRequests
            .Where(r => r.BookingId == bookingId);
            _context.BookingRequests.RemoveRange(requests);

            _context.Bookings.Remove(booking);
            var affected = await _context.SaveChangesAsync();

            if (affected == 0)
            {
                return StatusCode(500, new { Message = "SaveChanges did not apply any changes." });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { Message = "Server error", Details = ex.Message });
        }
    }


}
