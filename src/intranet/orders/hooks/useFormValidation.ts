import { useState } from "react";
import { z } from "zod";

interface ValidationErrors {
  [key: string]: string;
}

export function useFormValidation<T>(schema: z.ZodSchema) {
  const [errors, setErrors] = useState<ValidationErrors>({});

  const validate = (data: unknown): boolean => {
    const result = schema.safeParse(data);

    if (result.success) {
      setErrors({});
      return true;
    }

    // Procesar errores de Zod de forma segura
    const newErrors: ValidationErrors = {};
    if (
      result.error &&
      result.error.errors &&
      Array.isArray(result.error.errors)
    ) {
      result.error.errors.forEach((err) => {
        if (err && err.path && err.message) {
          const path = Array.isArray(err.path)
            ? err.path.join(".")
            : String(err.path);
          newErrors[path] = String(err.message);
        }
      });
    }

    setErrors(newErrors);
    return false;
  };

  const getFieldError = (fieldName: string): string | undefined => {
    return errors[fieldName];
  };

  const clearErrors = () => {
    setErrors({});
  };

  return {
    errors,
    validate,
    getFieldError,
    clearErrors,
    hasErrors: Object.keys(errors).length > 0,
  };
}
