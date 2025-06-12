using Backend___PawPal.Models;

namespace Backend___PawPal.DTOs;

public class BookingDto
{
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }
    public Guid PetId { get; set; }
    public Pet? Pet { get; set; }
    public Guid? UserId { get; set; }
    public User? User { get; set; }
    public String StartDate { get; set; }
    public String EndDate { get; set; }
    public String Address { get; set; }
}

public class CreateBookingDto
{ 
    public Guid PetId { get; set; }
    public String StartDate { get; set; }
    public String EndDate { get; set; }
}

public class CreateBookingRequest
{ 
    public Guid BookingId { get; set; }
    public Guid SitterId { get; set; }
}

public class SitterBookingDto
{
    public Guid BookingId { get; set; }
    public Guid SitterId { get; set; }
}
