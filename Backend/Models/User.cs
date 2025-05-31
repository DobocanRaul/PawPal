namespace Backend___PawPal.Models;

public class User
{

    public User()
    {
        Id = Guid.NewGuid();
    }
    public Guid Id { get; set; }
    public String Name { get; set; }
    public float Rating { get; set; }
    public byte[] Image { get; set; }
}
