using AutoMapper;
using Backend___PawPal.Context;
using Backend___PawPal.DTOs;
using Backend___PawPal.Models;
using Backend___PawPal.Validators;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net;

namespace Backend___PawPal.Controllers;

[Route("[Controller]")]
[ApiController]
public class PetController : ControllerBase

{
    private readonly PawPalDbContext _context;
    private readonly IMapper _mapper;
    private readonly PetValidator _validator = new PetValidator();

    public PetController(PawPalDbContext context, IMapper mapper) {
        _context = context;
        _mapper = mapper;
    }

    [HttpGet("Pet/{petId}")]
    public async Task<IActionResult> GetPet([FromRoute] Guid petId)
    {
        Pet petInfo = await _context.Pets.FirstOrDefaultAsync(pet => pet.Id == petId);
        if (petInfo != null)
        {
            return Ok(petInfo);
        }
        else return NotFound();
    }

    [HttpGet("Pets/{userId}")]
    public async Task<IActionResult> GetAllUserPets([FromRoute] Guid userId)
    { 
        List<Pet> pets= await _context.Pets.Where(pet => pet.OwnerId == userId).ToListAsync();
        return Ok(pets);

    }

    [HttpGet("PetPhoto/{petId}")]
    public async Task<IActionResult> GetPetPhoto([FromRoute] Guid petId)
    {
        Pet pet = await _context.Pets.FirstOrDefaultAsync(p => p.Id == petId);
        if (pet != null)
        {
            return File(pet.Image, "image/jpg");
        }
        else
        {
            return NotFound(new
            {
                StatusCode = HttpStatusCode.NotFound,
                Message = "Pet not found"
            });
        }
    }



    [HttpPost("CreatePet")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> AddPet([FromForm] PetDto petDto)
    {
        Pet newPet = _mapper.Map<Pet>(petDto);
        newPet.Owner = await _context.Users.FirstOrDefaultAsync(user => user.Id == petDto.OwnerId);
        if (!_validator.Validate(newPet))
            return BadRequest(
               new
               {
                   StatusCode = HttpStatusCode.BadRequest,
                   Message = "Invalid pet data"
               });
        newPet.Id = Guid.NewGuid();
        await _context.Pets.AddAsync(newPet);
        await _context.SaveChangesAsync();
        return Created();

    }

    [HttpPut("UpdatePet/{petId}")]
    [Consumes("multipart/form-data")]
    public async Task<IActionResult> UpdatePet([FromForm] PetDto petDto, [FromRoute] Guid petId)
    {

        Pet dbPet = await _context.Pets
            .FirstOrDefaultAsync(p => p.Id   == petId);
        if (dbPet == null) {
            return NotFound();
        }

        _mapper.Map(petDto,dbPet);
        if (!_validator.Validate(dbPet))
        {
               return BadRequest(
                                  new
                                  {
                    StatusCode = HttpStatusCode.BadRequest,
                    Message = "Invalid pet data"
                });
        }
        await _context.SaveChangesAsync();

        return Ok(dbPet);

    }

    [HttpDelete("DeletePet/{petId}")]
    public async Task<IActionResult> DeletePet([FromRoute]Guid petId)
    {
        Pet dbPet= await _context.FindAsync<Pet>(petId);
        if (dbPet == null)
        {
            return NotFound();
        }

        _context.Pets.Remove(dbPet);
        await _context.SaveChangesAsync();
        return Ok(dbPet);
    }



}
