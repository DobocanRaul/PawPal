using AutoMapper;
using Backend___PawPal.Context;
using Backend___PawPal.DTOs;
using Backend___PawPal.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;

namespace Backend___PawPal.Controllers;


[ApiController]
[Route("[controller]")]
[Authorize(AuthenticationSchemes = "Bearer")]
public class BookingRequestController : ControllerBase
{
    private readonly PawPalDbContext _context;
    private readonly IMapper _mapper;
    public BookingRequestController(PawPalDbContext context,IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet("GetActiveRequests/{ownerId}")]
    public async Task<IActionResult> getActiveRequests([FromRoute] Guid ownerId)
    { 
        List<BookingRequest> bookingRequests = await _context.BookingRequests
            .Include(br => br.Sitter)
            .Include(br => br.Booking)
            .Include(br => br.Booking.Pet)
            .Where(br => br.Booking.OwnerId == ownerId && br.status == "Pending" )
            .ToListAsync();

        return Ok(bookingRequests);
    }

    [HttpPost("AddRequest")]
    public async Task<IActionResult> AddBookingRequest([FromBody] CreateBookingRequestDto bookingRequest)
    {
        BookingRequest existingRequest = await _context.BookingRequests
            .FirstOrDefaultAsync(br => br.BookingId == bookingRequest.BookingId && br.SitterId == bookingRequest.SitterId);
        if (existingRequest != null)
        {
            return BadRequest("Booking request already exists for this booking and sitter.");
        }

        if (bookingRequest == null || bookingRequest.BookingId == null || bookingRequest.SitterId == null)
        {
            return BadRequest("Invalid booking request data.");
        }

        BookingRequest newBookingRequest = _mapper.Map<BookingRequest>(bookingRequest);
        newBookingRequest.status = "Pending"; // Set default status to Pending
        newBookingRequest.RequestDate = DateTime.UtcNow; // Set the request date to the current time

        _context.BookingRequests.Add(newBookingRequest);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(getActiveRequests), new { ownerId = bookingRequest.BookingId}, bookingRequest);
    }

    [HttpPut("ResolveRequest")]
    public async Task<IActionResult> ResolveBookingRequest([FromBody] ResolveBookingRequestDto resolveRequest)
    {
        BookingRequest bookingRequest = await _context.BookingRequests
            .FirstOrDefaultAsync(br => br.BookingId == resolveRequest.BookingId && br.SitterId == resolveRequest.SitterId);

        if (bookingRequest == null)
        {
            return NotFound("Booking request not found.");
        }

        bookingRequest.status = resolveRequest.Status;
        if(resolveRequest.Status =="Accepted")
        {
            Booking booking = await _context.Bookings
                .FirstOrDefaultAsync(b => b.Id == resolveRequest.BookingId);
            if (booking == null)
            {
                return NotFound("Booking not found for the accepted request.");
            }
            booking.UserId = resolveRequest.SitterId; // Assign the sitter to the booking
            List<BookingRequest> bookingRequests = await _context.BookingRequests
                .Where(br => br.BookingId == resolveRequest.BookingId && br.SitterId != resolveRequest.SitterId)
                .ToListAsync();
            foreach (var request in bookingRequests)
            {
                request.status = "Rejected"; // Reject all other requests for the same booking
                _context.BookingRequests.Update(request);
            }

            _context.Bookings.Update(booking);
        }
        await _context.SaveChangesAsync();
        return Ok(bookingRequest);
    }

}
