using Backend___PawPal.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend___PawPal.Context;

public class PawPalDbContext : DbContext
{
    public PawPalDbContext(DbContextOptions<PawPalDbContext> options) : base(options)
    { 
        

    }
    public DbSet<User> Users { get; set; }
    public DbSet<Pet> Pets { get; set; }
}





