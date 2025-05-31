using Backend___PawPal.Context;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
    .AddEnvironmentVariables()
    .AddUserSecrets<Program>();

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAllOrigins",
               builder =>
               {
            builder.AllowAnyOrigin()
                   .AllowAnyMethod()
                   .AllowAnyHeader();
        });
});


string connectionString= builder.Configuration.GetConnectionString("DbConnectionString");
builder.Services.AddDbContext<PawPalDbContext>(options =>
{
     options.UseSqlServer(connectionString);
});

builder.Services.AddScoped<PawPalDbContext>();

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
