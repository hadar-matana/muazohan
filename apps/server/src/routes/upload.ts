import express from 'express';
import multer from 'multer';
import AWS from 'aws-sdk';
import { v4 as uuidv4 } from 'uuid';

const router: express.Router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  region: 'eu-north-1',
});

const s3 = new AWS.S3();

router.post('/', upload.single('file'), async (req, res) => {
  const file = (req as any).file;
  if (!file) return res.status(400).send('No file uploaded.');

  const params = {
    Bucket: process.env.AWS_BUCKET_NAME!,
    Key: `songs/${uuidv4()}_${file.originalname}`,
    Body: file.buffer,
    ContentType: 'audio/mpeg',
    CacheControl: 'max-age=31536000', 
  };

  try {
    const data = await s3.upload(params).promise();
    res.json({ url: data.Location });
  } catch (err) {
    console.error('S3 upload error:', err);
    res.status(500).json({ error: err });
  }
});

export default router;
