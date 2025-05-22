using Microsoft.EntityFrameworkCore;

namespace Backend___PawPal.Context;

public class PawPalDbContext: DbContext
{
    public PawPalDbContext(DbContextOptions<PawPalDbContext> options) : base(options)
    {
    }


}
