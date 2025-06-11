using Backend___PawPal.DTOs;
using System.Net.Mail;

namespace Backend___PawPal.Validators;

public class ProfileValidator: IValidator<UserDto>
{
    public bool Validate(UserDto entity)
    {
        if (entity == null)
        {
            return false;
        }
        if (string.IsNullOrEmpty(entity.Name))
        {
            return false;
        }
        if (entity.Image == null || entity.Image.Length == 0)
        {
            return false;
        }
        if (entity.BestWithTags == null || entity.BestWithTags.Length == 0)
        {
            return false;
        }
        if (string.IsNullOrEmpty(entity.Address))
        {
            return false;
        }
        if (entity.AvailabilityTags == null || entity.AvailabilityTags.Length == 0)
        {
            return false;
        }
        if (entity.DescriptionTags == null || entity.DescriptionTags.Length == 0)
        {
            return false;
        }
        try
        {
            MailAddress email = new MailAddress(entity.Email);

        }
        catch (FormatException)
        {
            return false; // Invalid email format
        }
        return true;
    }
}
