import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

// Validation schemas
const uploadSchema = z.object({
  folder: z.string().optional().default('songs'),
});

const deleteFileSchema = z.object({
  key: z.string().min(1, 'File key is required'),
});

const getSignedUrlSchema = z.object({
  key: z.string().min(1, 'File key is required'),
  expires: z.string().optional().transform(val => {
    const parsed = parseInt(val || '3600');
    return isNaN(parsed) ? 3600 : parsed;
  }),
});

const listFilesSchema = z.object({
  prefix: z.string().optional().default(''),
});

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

  // Validate file size (max 50MB)
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return res.status(400).json({ 
      error: 'File too large',
      details: `File size must be less than ${maxSize / (1024 * 1024)}MB`
    });
  }

  // Validate file type
  const allowedMimeTypes = [
    'audio/mpeg',
    'audio/mp3',
    'audio/wav',
    'audio/ogg',
    'audio/m4a',
    'audio/aac',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp'
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return res.status(400).json({ 
      error: 'Invalid file type',
      details: `Allowed types: ${allowedMimeTypes.join(', ')}`
    });
  }

  next();
};

// Export specific validators
export const validateUpload = validateRequest(uploadSchema);
export const validateDeleteFile = validateRequest(deleteFileSchema);
export const validateGetSignedUrl = validateRequest(getSignedUrlSchema);
export const validateListFiles = validateRequest(listFilesSchema);
