import express from 'express';
import multer from 'multer';
import { S3Service } from '../services/S3Service';
import { validateUpload, validateFileUpload, validateDeleteFile } from '../middleware/validation';

const router: express.Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const s3Service = new S3Service();

router.post('/', upload.single('file'), validateUpload, validateFileUpload, async (req, res) => {
  try {
    const file = (req as any).file;
    const folder = req.body.folder || 'songs';
    const url = await s3Service.uploadFile(file, folder);
    
    res.json({ 
      success: true,
      url,
      key: url.split('/').pop(),
      originalName: file.originalname,
      size: file.size,
      mimetype: file.mimetype
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Upload multiple files
router.post('/multiple', upload.array('files', 10), validateUpload, async (req, res) => {
  try {
    const files = (req as any).files;
    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    // Validate each file
    for (const file of files) {
      const maxSize = 50 * 1024 * 1024; // 50MB
      if (file.size > maxSize) {
        return res.status(400).json({ 
          error: 'File too large',
          details: `File ${file.originalname} is too large. Maximum size is ${maxSize / (1024 * 1024)}MB`
        });
      }

      const allowedMimeTypes = [
        'audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/m4a', 'audio/aac',
        'image/jpeg', 'image/png', 'image/gif', 'image/webp'
      ];

      if (!allowedMimeTypes.includes(file.mimetype)) {
        return res.status(400).json({ 
          error: 'Invalid file type',
          details: `File ${file.originalname} has invalid type. Allowed types: ${allowedMimeTypes.join(', ')}`
        });
      }
    }

    const folder = req.body.folder || 'songs';
    const uploadPromises = files.map((file: Express.Multer.File) => 
      s3Service.uploadFile(file, folder)
    );

    const urls = await Promise.all(uploadPromises);
    
    res.json({ 
      success: true,
      urls,
      count: files.length
    });
  } catch (error) {
    console.error('Multiple upload error:', error);
    res.status(500).json({ error: 'Failed to upload files' });
  }
});

// Delete a file
router.delete('/:key', validateDeleteFile, async (req, res) => {
  try {
    const { key } = req.params;
    await s3Service.deleteFile(key);
    
    res.json({ 
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

// Get signed URL for a file
// router.get('/url/:key', async (req, res) => {
//   try {
//     const { key } = req.params;
//     const expiresIn = parseInt(req.query.expires as string) || 3600;
//     const url = await s3Service.getFileUrl(key, expiresIn);
    
//     res.json({ 
//       success: true,
//       url,
//       expiresIn
//     });
//   } catch (error) {
//     console.error('Get URL error:', error);
//     res.status(500).json({ error: 'Failed to generate signed URL' });
//   }
// });

// List files in a folder
// router.get('/list', async (req, res) => {
//   try {
//     const prefix = req.query.prefix as string || '';
//     const files = await s3Service.listFiles(prefix);
    
//     res.json({ 
//       success: true,
//       files: files.map(file => ({
//         key: file.Key,
//         size: file.Size,
//         lastModified: file.LastModified
//       }))
//     });
//   } catch (error) {
//     console.error('List files error:', error);
//     res.status(500).json({ error: 'Failed to list files' });
//   }
// });

export default router;
