# Validation Structure

This document describes the centralized validation structure for the music streaming application.

## Overview

All Zod validations have been moved to centralized files in each application to improve maintainability and reduce duplication.

## Structure

### Postgres Server (`apps/postgres-server/src/validations/`)

- **`schemas.ts`** - Contains all Zod schemas for:
  - Song create/update operations
  - Artist create/update operations  
  - Album create/update operations
  - Pagination
  - ID parameters
  - Search queries

- **`middleware.ts`** - Contains validation middleware functions:
  - `validateRequest()` - Generic request body validation
  - `validateQuery()` - Query parameter validation
  - `validateParams()` - URL parameter validation
  - Specific validators for each operation type

- **`index.ts`** - Exports all schemas and middleware functions

### S3 Server (`apps/s3-server/src/validations/`)

- **`schemas.ts`** - Contains schemas for:
  - File upload operations
  - File deletion
  - Signed URL generation
  - File listing
  - File validation (size, type)

- **`middleware.ts`** - Contains validation middleware:
  - `validateRequest()` - Generic validation
  - `validateFileUpload()` - File-specific validation
  - Specific validators for S3 operations

- **`index.ts`** - Exports all schemas and middleware functions

### Main Server (`apps/server/src/validations/`)

- **`schemas.ts`** - Contains tRPC input schemas for:
  - Artist ID validation
  - Album ID validation
  - Search query validation
  - Upload song validation

- **`index.ts`** - Exports all schemas

### Web App (`apps/web/src/validations/`)

- **`schemas.ts`** - Contains frontend validation schemas for:
  - Song forms
  - Artist forms
  - Album forms
  - Search forms
  - File upload forms

- **`helpers.ts`** - Contains validation utility functions:
  - `validateForm()` - Form validation helper
  - `validateField()` - Field-level validation helper

- **`index.ts`** - Exports all schemas and helper functions

## Usage

### In Route Files

```typescript
// Old way
import { validateSongCreate } from '../middleware/validation';

// New way
import { validateSongCreate } from '../validations';
```

### In tRPC Procedures

```typescript
// Old way
.input(z.object({
  id: z.string().min(1, 'Artist ID is required')
}))

// New way
import { artistIdSchema } from '../validations';
.input(artistIdSchema)
```

### In Frontend Components

```typescript
// Old way
import { songSchema, validateForm } from '../utils/validation';

// New way
import { songSchema, validateForm } from '../validations';
```

## Benefits

1. **Centralized Management** - All validation logic is in one place per application
2. **Type Safety** - Exported types ensure consistency across the application
3. **Reusability** - Schemas can be shared between different parts of the application
4. **Maintainability** - Changes to validation rules only need to be made in one place
5. **Consistency** - Ensures validation rules are consistent across the application

## Migration Notes

- Old validation files have been removed
- All imports have been updated to use the new centralized structure
- The old `apps/web/src/utils/validation.ts` now re-exports from the new structure for backward compatibility
