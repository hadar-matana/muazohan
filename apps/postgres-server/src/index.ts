import express from 'express';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import songsRouter from './routes/songs';
import artistsRouter from './routes/artists';
import albumsRouter from './routes/albums';

import { config, validateConfig } from './config';

validateConfig();

const app = express();

// Security middleware
app.use(helmet());

// Compression middleware
app.use(compression() as any);

// CORS configuration
app.use(cors({
  origin: config.corsOrigin,
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));


// Request logging middleware
// app.use((req, res, next) => {
//   const start = Date.now();
//   res.on('finish', () => {
//     const duration = Date.now() - start;
//     console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
//   });
//   next();
// });

// Routes
app.use('/songs', songsRouter);
app.use('/artists', artistsRouter);
app.use('/albums', albumsRouter);

// Health check endpoint
// app.get('/health', (req, res) => {
//   res.json({ 
//     status: 'ok', 
//     timestamp: new Date().toISOString(),
//     service: 'postgres-server',
//     version: '1.0.0'
//   });
// });

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Global error handler
// app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
//   console.error('Unhandled error:', err);
  
//   // Don't leak error details in production
//   const errorMessage = config.nodeEnv === 'production' 
//     ? 'Internal server error' 
//     : err.message;
    
//   res.status(500).json({ error: errorMessage });
// });

// Graceful shutdown
// process.on('SIGTERM', () => {
//   console.log('SIGTERM received, shutting down gracefully');
//   process.exit(0);
// });

// process.on('SIGINT', () => {
//   console.log('SIGINT received, shutting down gracefully');
//   process.exit(0);
// });

app.listen(config.port, () => {
  console.log(`✅ PostgreSQL Server running at http://localhost:${config.port}`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
  console.log(`🔗 CORS Origin: ${config.corsOrigin}`);
  console.log(`🗄️ Database: PostgreSQL`);
  console.log(`🛡️ Security: Helmet enabled`);
  console.log(`🗜️ Compression: Enabled`);

});


