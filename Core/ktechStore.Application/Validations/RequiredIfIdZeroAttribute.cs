using System.ComponentModel.DataAnnotations;


namespace ktechStore.Application.Validations
{
    public class RequiredIfIdZeroAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext context)
        {
            var imageUrlProperty = context.ObjectType.GetProperty("ImageUrl");
            var imageUrlValue = imageUrlProperty?.GetValue(context.ObjectInstance) as string;


            if (value == null && string.IsNullOrEmpty(imageUrlValue))
            {
                return new ValidationResult(ErrorMessage ?? "Product image is required.");
            }

            return ValidationResult.Success;
        }
    }
}
