using Backend___PawPal.Context;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<PawPalDbContext>(options =>
{
     options.UseSqlServer(builder.Configuration.GetConnectionString("DbConnectionString"));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<PawPalDbContext>();

    if (!context.Database.CanConnect()) { 
        throw new Exception("Cannot connect to the database");
    }
}

app.UseHttpsRedirection();


app.UseAuthorization();

app.MapControllers();

app.Run();
