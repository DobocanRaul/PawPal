using Backend___PawPal.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Backend___PawPal.Context;

public class PawPalDbContext : IdentityDbContext
{
    public PawPalDbContext(DbContextOptions<PawPalDbContext> options) : base(options)
    { 
        

    }
    public DbSet<User> Users { get; set; }
    public DbSet<Pet> Pets { get; set; }

}





