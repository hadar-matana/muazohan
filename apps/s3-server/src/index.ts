import express from 'express';
import cors from 'cors';
import uploadRouter from './routes/upload';
import { config, validateConfig } from './config';

validateConfig();

const app = express();

app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

app.use('/upload', uploadRouter);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 's3-server'
  });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`✅ S3 Server running at http://localhost:${config.port}`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
  console.log(`🔗 CORS Origin: ${config.corsOrigin}`);
  console.log(`🪣 S3 Bucket: ${config.awsBucketName}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
