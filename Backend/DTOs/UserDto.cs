
using Microsoft.Identity.Client;

namespace Backend___PawPal.DTOs;

public class UserDto
{
    public Guid? Id { get; set; }
    public string Email { get; set; }
    public String Name { get; set; }
    public float Rating { get; set; }
    public IFormFile Image { get; set; }
    public String[] BestWithTags { get; set; } // e.g. "Dogs", "Cats", "Birds"
    public String Address { get; set; } // e.g. "123 Main St, Springfield, USA"
    public String[] AvailabilityTags { get; set; } // e.g. "Weekends", "Evenings", "Holidays"
    public String[] DescriptionTags { get; set; } // e.g. "Experienced", "Loves Animals", "Patient"

}

public class UserDtoForm()
{
        public String Name { get; set; }
        public IFormFile Image { get; set; }
}
