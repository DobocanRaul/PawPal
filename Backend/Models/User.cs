namespace Backend___PawPal.Models;

public class User
{

    public User()
    {
        Id = Guid.NewGuid();
    }
    public Guid Id { get; set; }
    public string Email { get; set; } 
    public String Name { get; set; }
    public float Rating { get; set; }
    public byte[] Image { get; set; }
    public int NumberOfRatings { get; set; } // Number of ratings received
    public String[] BestWithTags { get; set; } // e.g. "Dogs", "Cats", "Birds"
    public String Address { get; set; } // e.g. "123 Main St, Springfield, USA"
    public String[] AvailabilityTags { get; set; } // e.g. "Weekends", "Evenings", "Holidays"
    public String[] DescriptionTags { get; set; } // e.g. "Experienced", "Loves Animals", "Patient"
}
