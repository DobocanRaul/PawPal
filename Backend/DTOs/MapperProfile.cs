using AutoMapper;
using Backend___PawPal.Models;

namespace Backend___PawPal.DTOs;

public class MapperProfile :Profile
{
    public MapperProfile() {
        CreateMap<Pet, PetDto>();
        CreateMap<PetDto, Pet>()
            .ForMember(dest => dest.Id,opt => opt.Ignore())
            .ForMember(dest => dest.Owner, opt => opt.Ignore());
        CreateMap<User, UserDto>();
        CreateMap<UserDto, User>();
        CreateMap<IFormFile, byte[]>().ConvertUsing((src, dest, context) =>
        {
            if (src == null) return null;

            using var ms = new MemoryStream();
            src.CopyTo(ms);
            return ms.ToArray();
        });
    }
}
