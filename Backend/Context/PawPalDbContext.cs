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
    public DbSet<Booking> Bookings { get; set; }
    public DbSet<BookingRequest> BookingRequests { get; set; }

    public DbSet<Message> Messages { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Booking>()
            .HasOne(b => b.Owner)
            .WithMany()
            .HasForeignKey(b => b.OwnerId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Booking>()
            .HasOne(b => b.User)
            .WithMany()
            .HasForeignKey(b => b.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<BookingRequest>()
            .HasKey(br => new { br.BookingId, br.SitterId });

    }
}





