using System.ComponentModel.DataAnnotations;

namespace Backend___PawPal.Models;

public class Booking
{
    [Key]
    public Guid Id { get; set; }
    public Guid OwnerId { get; set; }
    public User Owner { get; set; }
    public Guid PetId { get; set; }
    public Pet Pet { get; set; }
    public Guid? UserId { get; set; }
    public User? User { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public String Address { get; set; }
}
