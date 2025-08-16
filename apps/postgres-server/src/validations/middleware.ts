import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import {
  songCreateSchema,
  songUpdateSchema,
  artistCreateSchema,
  artistUpdateSchema,
  albumCreateSchema,
  albumUpdateSchema,
  paginationSchema,
  idParamSchema,
  searchQuerySchema,
} from './schemas';

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
