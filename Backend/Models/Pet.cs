namespace Backend___PawPal.Models;

public class Pet
{
    public Guid Id { get; set; }
    public String Name { get; set; }
    public Boolean IsFemale { get; set; }
    public String Address { get; set; }
    public int Age { get; set; }
    public float Weight { get; set; }
    public string Description { get; set; }
    public byte[] Image { get; set; }
    public String[] Tags { get; set; }
    public User Owner { get; set; }
}
