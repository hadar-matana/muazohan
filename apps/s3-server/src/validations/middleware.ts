import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  uploadSchema,
  deleteFileSchema,
  getSignedUrlSchema,
  listFilesSchema,
  fileValidationSchema,
} from './schemas';

// Validation middleware factory
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse({
        ...req.body,
        ...req.params,
        ...req.query,
      });
      
      // Merge validated data back into request
      req.body = { ...req.body, ...validatedData };
      req.params = { ...req.params, ...validatedData };
      req.query = { ...req.query, ...validatedData };
      
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Validation failed',
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        });
      }
      next(error);
    }
  };
};

// File validation middleware
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  const file = (req as any).file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    fileValidationSchema.parse({
      size: file.size,
      mimetype: file.mimetype,
    });
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({
        error: 'File validation failed',
        details: error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
      });
    }
    next(error);
  }
};

// Export specific validators
export const validateUpload = validateRequest(uploadSchema);
export const validateDeleteFile = validateRequest(deleteFileSchema);
export const validateGetSignedUrl = validateRequest(getSignedUrlSchema);
export const validateListFiles = validateRequest(listFilesSchema);
