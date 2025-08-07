import express from 'express';
import cors from 'cors';
import songsRouter from './routes/songs';
import artistsRouter from './routes/artists';
import albumsRouter from './routes/albums';
import { config, validateConfig } from './config';

validateConfig();

const app = express();

app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

app.use(express.json());

// Routes
app.use('/songs', songsRouter);
app.use('/artists', artistsRouter);
app.use('/albums', albumsRouter);

app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'postgres-server'
  });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(config.port, () => {
  console.log(`✅ PostgreSQL Server running at http://localhost:${config.port}`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
  console.log(`🔗 CORS Origin: ${config.corsOrigin}`);
  console.log(`🗄️ Database: PostgreSQL`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});
