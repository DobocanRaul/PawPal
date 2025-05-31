using Backend___PawPal.DTOs;

namespace Backend___PawPal.Validators;

public class ProfileValidator: IValidator<UserDtoForm>
{
    public bool Validate(UserDtoForm entity)
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
        return true;
    }
}
