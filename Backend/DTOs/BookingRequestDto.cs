using Microsoft.AspNetCore.Mvc;

namespace Backend___PawPal.DTOs;

public class CreateBookingRequestDto {
    
    public Guid BookingId { get; set; }
    public Guid SitterId { get; set; }
}

public class  ResolveBookingRequestDto
{
    public Guid BookingId { get; set; }
    public Guid SitterId { get; set; }
    public String Status { get; set; } // e.g. "Accepted", "Rejected"
}
