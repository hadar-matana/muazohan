import express from 'express';
import multer from 'multer';
import axios from 'axios';

const router: express.Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

const s3ServerUrl = process.env.S3_SERVER_URL || 'http://localhost:3002';

router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = (req as any).file;
    if (!file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    formData.append('folder', req.body.folder || 'songs');

    const response = await axios.post(`${s3ServerUrl}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    res.json(response.data);
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

export default router;
