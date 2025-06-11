
using Backend___PawPal.Models;
using System.ComponentModel.DataAnnotations;

namespace Backend___PawPal.DTOs;

public class PetDto 
{
    [Required]
    public String Name { get; set; }
    [Required]
    public Boolean IsFemale { get; set; }
    [Required]
    public String Address { get; set; }
    [Required]
    public int Age { get; set; }
    [Required]
    public float Weight { get; set; }
    public string? Description { get; set; }
    [Required]
    public IFormFile Image { get; set; }
    public String[]? Tags { get; set; }
    [Required]
    public Guid OwnerId { get; set; }


}
