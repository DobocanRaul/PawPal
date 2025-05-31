
using Microsoft.Identity.Client;

namespace Backend___PawPal.DTOs;

public class UserDto
{
    public UserDto()
    {
    }
    public Guid Id { get; set; }
    public String Name { get; set; }
    public float Rating { get; set; }
    public Byte[] Image { get; set; }

}

public class UserDtoForm()
{
        public String Name { get; set; }
        public IFormFile Image { get; set; }
}
