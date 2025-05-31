namespace Backend___PawPal.Validators
{
    public interface IValidator<T>
    {
        bool Validate(T entity);
    }
}
