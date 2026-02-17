export interface ValidationRule {
  required?: boolean;
  message?: string;
  validate?: (value: unknown, formData?: object) => string | undefined;
}

export type ValidationSchema<T extends object> = {
  [K in keyof T]?: ValidationRule;
};

export type ValidationErrors<T extends object> = Partial<Record<keyof T, string>>;

export function createValidator<T extends object>(
  schema: ValidationSchema<T>
) {
  return (formData: T): ValidationErrors<T> => {
    const errors: ValidationErrors<T> = {};

    for (const [field, rules] of Object.entries(schema) as [keyof T, ValidationRule][]) {
      const value = formData[field as keyof T];
      
      if (!rules) continue;

      if (rules.required && (!value || (typeof value === 'string' && !value.trim()))) {
        errors[field as keyof T] = rules.message || 'Поле обязательно для заполнения';
        continue;
      }

      if (rules.validate && value) {
        const error = rules.validate(value, formData);
        if (error) {
          errors[field as keyof T] = error;
        }
      }
    }

    return errors;
  };
}