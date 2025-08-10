# Zod Validation Implementation

This document outlines the comprehensive Zod validation implementation across the entire Mua-ZOHAN music player project.

## Overview

Zod validation has been implemented across all services to ensure data integrity, type safety, and consistent error handling. The implementation covers:

- **Postgres Server**: Request body, query parameters, and URL parameters validation
- **Server (tRPC)**: Input validation for all tRPC procedures
- **S3 Server**: File upload validation and request parameter validation
- **Web Application**: Client-side form validation utilities

## Postgres Server Validation

### Location: `apps/postgres-server/src/middleware/validation.ts`

#### Request Body Validation Schemas

```typescript
// Song validation
const songCreateSchema = z.object({
  title: z.string().min(1).max(255),
  duration: z.number().positive().optional(),
  mp3Url: z.string().url().optional(),
  artistId: z.string().min(1),
  albumId: z.string().min(1),
});

const songUpdateSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  duration: z.number().positive().optional(),
  mp3Url: z.string().url().optional(),
  artistId: z.string().min(1).optional(),
  albumId: z.string().min(1).optional(),
});

// Artist validation
const artistCreateSchema = z.object({
  name: z.string().min(1).max(255),
  imageUrl: z.string().url().optional(),
});

const artistUpdateSchema = z.object({
  name: z.string().min(1).max(255).optional(),
  imageUrl: z.string().url().optional(),
});

// Album validation
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
```

#### Query Parameter Validation

```typescript
const paginationSchema = z.object({
  page: z.string().optional().transform(val => {
    const parsed = parseInt(val || '1');
    return isNaN(parsed) || parsed < 1 ? 1 : parsed;
  }),
  limit: z.string().optional().transform(val => {
    const parsed = parseInt(val || '20');
    return isNaN(parsed) || parsed < 1 ? 20 : Math.min(parsed, 100);
  }),
});

const idParamSchema = z.object({
  id: z.string().min(1, 'ID is required'),
});

const searchQuerySchema = z.object({
  query: z.string().min(1, 'Search query is required').max(100, 'Search query too long'),
});
```

#### Usage in Routes

All routes now use validation middleware:

```typescript
// Example: Songs route
router.post('/', validateSongCreate, async (req, res) => {
  // Request body is already validated
  const songData = req.body; // Type-safe and validated
});

router.get('/', validatePagination, async (req, res) => {
  // Query parameters are validated and transformed
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);
});

router.get('/:id', validateIdParam, async (req, res) => {
  // URL parameters are validated
  const id = req.params.id; // Guaranteed to be a non-empty string
});
```

## Server (tRPC) Validation

### Location: `apps/server/src/router.ts`

All tRPC procedures now use Zod for input validation:

```typescript
import { z } from 'zod';

export const appRouter = t.router({
  getArtistById: t.procedure
    .input(z.object({
      id: z.string().min(1, 'Artist ID is required')
    }))
    .query(async ({ input }) => {
      // input.id is guaranteed to be a non-empty string
      return await microserviceClient.getArtistById(input.id);
    }),

  getAlbumById: t.procedure
    .input(z.object({
      id: z.string().min(1, 'Album ID is required')
    }))
    .query(async ({ input }) => {
      return await microserviceClient.getAlbumById(input.id);
    }),

  searchSongs: t.procedure
    .input(z.object({
      query: z.string().min(1, 'Search query is required')
    }))
    .query(async ({ input }) => {
      return await microserviceClient.searchSongs(input.query);
    }),
});
```

## S3 Server Validation

### Location: `apps/s3-server/src/middleware/validation.ts`

#### File Upload Validation

```typescript
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  const file = (req as any).file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // Validate file size (max 50MB)
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    return res.status(400).json({ 
      error: 'File too large',
      details: `File size must be less than ${maxSize / (1024 * 1024)}MB`
    });
  }

  // Validate file type
  const allowedMimeTypes = [
    'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac',
    'image/jpeg', 'image/png', 'image/gif', 'image/webp'
  ];

  if (!allowedMimeTypes.includes(file.mimetype)) {
    return res.status(400).json({ 
      error: 'Invalid file type',
      details: `Allowed types: ${allowedMimeTypes.join(', ')}`
    });
  }

  next();
};
```

#### Request Parameter Validation

```typescript
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
```

#### Usage in Routes

```typescript
router.post('/', upload.single('file'), validateUpload, validateFileUpload, async (req, res) => {
  // File and request parameters are validated
  const file = (req as any).file;
  const folder = req.body.folder || 'songs';
});

router.delete('/:key', validateDeleteFile, async (req, res) => {
  // URL parameter is validated
  const { key } = req.params;
});
```

## Web Application Validation

### Location: `apps/web/src/utils/validation.ts`

#### Client-Side Validation Schemas

```typescript
export const songSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255, 'Title must be less than 255 characters'),
  duration: z.number().positive().optional(),
  mp3Url: z.string().url('Must be a valid URL').optional(),
  artistId: z.string().min(1, 'Artist is required'),
  albumId: z.string().min(1, 'Album is required'),
});

export const artistSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  imageUrl: z.string().url('Must be a valid URL').optional(),
});

export const albumSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be less than 255 characters'),
  year: z.number().int().min(1900).max(new Date().getFullYear()).optional(),
  artistId: z.string().min(1, 'Artist is required'),
  imageUrl: z.string().url('Must be a valid URL').optional(),
});

export const fileUploadSchema = z.object({
  file: z.instanceof(File).refine(
    (file) => file.size <= 50 * 1024 * 1024, // 50MB
    'File size must be less than 50MB'
  ).refine(
    (file) => {
      const allowedTypes = [
        'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac',
        'image/jpeg', 'image/png', 'image/gif', 'image/webp'
      ];
      return allowedTypes.includes(file.type);
    },
    'Invalid file type. Allowed: audio files and images'
  ),
  folder: z.string().optional().default('songs'),
});
```

#### Validation Helpers

```typescript
// Form validation helper
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): 
  { success: true; data: T } | { success: false; errors: string[] } => {
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

// Real-time validation helper
export const validateField = <T>(schema: z.ZodSchema<T>, fieldName: string, value: unknown): string | null => {
  try {
    const fieldSchema = z.object({ [fieldName]: schema.shape[fieldName as keyof T] });
    fieldSchema.parse({ [fieldName]: value });
    return null;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const fieldError = error.errors.find(err => err.path[0] === fieldName);
      return fieldError ? fieldError.message : null;
    }
    return 'Invalid field';
  }
};
```

## Error Handling

All validation errors follow a consistent format:

```typescript
{
  error: 'Validation failed',
  details: [
    {
      field: 'title',
      message: 'Title is required'
    },
    {
      field: 'year',
      message: 'Year must be between 1900 and 2024'
    }
  ]
}
```

## Benefits

1. **Type Safety**: All validated data is properly typed
2. **Consistent Error Messages**: Standardized error format across all services
3. **Data Integrity**: Prevents invalid data from reaching the database
4. **Security**: Validates file uploads and prevents malicious files
5. **Developer Experience**: Clear error messages and TypeScript support
6. **Performance**: Early validation prevents unnecessary processing

## Usage Examples

### Server-Side Validation

```typescript
// The validation happens automatically in middleware
router.post('/songs', validateSongCreate, async (req, res) => {
  // req.body is guaranteed to be valid
  const song = await dbService.createSong(req.body);
  res.json({ success: true, data: song });
});
```

### Client-Side Validation

```typescript
import { validateForm, songSchema } from '../utils/validation';

const handleSubmit = (formData: unknown) => {
  const result = validateForm(songSchema, formData);
  
  if (result.success) {
    // Form data is valid, proceed with submission
    submitSong(result.data);
  } else {
    // Display validation errors
    setErrors(result.errors);
  }
};
```

### Real-Time Field Validation

```typescript
import { validateField, songSchema } from '../utils/validation';

const handleFieldChange = (fieldName: string, value: string) => {
  const error = validateField(songSchema, fieldName, value);
  setFieldError(fieldName, error);
};
```

This comprehensive validation system ensures that all data flowing through the application is properly validated, providing a robust and secure foundation for the Mua-ZOHAN music player.
