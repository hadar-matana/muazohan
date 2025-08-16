import { z } from 'zod';

// Form validation helper
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } => {
  try {
    const validatedData = schema.parse(data);
    return { success: true, data: validatedData };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        errors: error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      };
    }
    return {
      success: false,
      errors: ['Unknown validation error']
    };
  }
};

// Field validation helper
export const validateField = <T>(schema: z.ZodSchema<T>, fieldName: string, value: unknown): string | null => {
  try {
    const testObject = { [fieldName]: value } as Partial<T>;
    
    schema.parse(testObject);
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldError = error.errors.find(err => err.path[0] === fieldName);
      return fieldError ? fieldError.message : null;
    }
    return 'Invalid field';
  }
};
