using Backend___PawPal.Models;

namespace Backend___PawPal.Validators;

public class PetValidator : IValidator<Pet>
{
    public bool Validate(Pet entity)
    {
        if (entity == null)
            return false;
        if(entity.Image == null || entity.Image.Length == 0)
            return false;
        if(entity.Address.Length == 0)
            return false;
        if(entity.Weight == 0)
            return false;
        if (entity.OwnerId == null)
            return false;
        return true;

    }
}
