import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const songCreateSchema = z.object({
  title: z.string().min(1).max(255),
  duration: z.number().positive().optional(),
  mp3Url: z.string().url().optional(),
  artistId: z.string().min(1).optional(),
  albumId: z.string().min(1).optional(),
});

const songUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  duration: z.number().positive().optional(),
  mp3Url: z.string().url().optional(),
  artistId: z.string().min(1).optional(),
  albumId: z.string().min(1).optional(),
});

const artistCreateSchema = z.object({
  name: z.string().min(1).max(255),
  imageUrl: z.string().url().optional(),
});

const artistUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  imageUrl: z.string().url().optional(),
});

const albumCreateSchema = z.object({
  name: z.string().min(1).max(255),
  year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  artistId: z.string().min(1),
  imageUrl: z.string().url().optional(),
});

const albumUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  artistId: z.string().min(1).optional(),
  imageUrl: z.string().url().optional(),
});

const paginationSchema = z.object({
  page: z.string().optional().transform(val => {
    const parsed = parseInt(val || '1');
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }),
  limit: z.string().optional().transform(val => {
    const parsed = parseInt(val || '20');
    return isNaN(parsed) || parsed < 1 ? 20 : Math.min(parsed, 100); // Max 100 items per page
  }),
});

const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

const searchQuerySchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
});

// Validation middleware factory
export const validateRequest = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
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

// Query parameter validation middleware
export const validateQuery = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.query);
      req.query = validatedData as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid query parameters',
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

// Parameter validation middleware
export const validateParams = (schema: z.ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.params);
      req.params = validatedData as any;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          error: 'Invalid parameters',
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

// Export specific validators
export const validateSongCreate = validateRequest(songCreateSchema);
export const validateSongUpdate = validateRequest(songUpdateSchema);
export const validateArtistCreate = validateRequest(artistCreateSchema);
export const validateArtistUpdate = validateRequest(artistUpdateSchema);
export const validateAlbumCreate = validateRequest(albumCreateSchema);
export const validateAlbumUpdate = validateRequest(albumUpdateSchema);

// Export query and parameter validators
export const validatePagination = validateQuery(paginationSchema);
export const validateIdParam = validateParams(idParamSchema);
export const validateSearchQuery = validateParams(searchQuerySchema);
