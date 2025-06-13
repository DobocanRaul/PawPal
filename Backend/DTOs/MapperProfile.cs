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
        CreateMap<UserDto, User>()
            .ForMember(dest => dest.Rating, opt => opt.Ignore());
        CreateMap<IFormFile, byte[]>().ConvertUsing((src, dest, context) =>
        {
            if (src == null) return null;

            using var ms = new MemoryStream();
            src.CopyTo(ms);
            return ms.ToArray();
        });
        CreateMap<Booking, BookingDto>();
        CreateMap<BookingDto, Booking>();
        CreateMap<String,DateOnly>().ConvertUsing(src => DateOnly.Parse(src));
        CreateMap<DateOnly, String>().ConvertUsing(src => src.ToString("yyyy-MM-dd"));
        CreateMap<CreateBookingDto, Booking>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.OwnerId, opt => opt.Ignore())
            .ForMember(dest => dest.Pet, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.Address, opt => opt.Ignore());
        CreateMap<CreateBookingRequestDto, BookingRequest>()
            .ForMember(dest => dest.Booking, opt => opt.Ignore())
            .ForMember(dest => dest.Sitter, opt => opt.Ignore())
            .ForMember(dest => dest.status, opt => opt.Ignore())
            .ForMember(dest => dest.RequestDate, opt => opt.Ignore());
        CreateMap<RegisterDto, User>();
    }

}
