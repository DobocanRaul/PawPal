namespace Backend___PawPal.Models;

public class BookingRequest
{
    public Guid BookingId { get; set; }
    public Booking Booking { get; set; }
    public Guid SitterId { get; set; }
    public User Sitter { get; set; }
    public String status { get; set; } // e.g. "Pending", "Accepted", "Rejected"
    public DateTime RequestDate { get; set; } // Date when the request was made

}
