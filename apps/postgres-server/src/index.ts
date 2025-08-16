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


// Routes
app.use('/songs', songsRouter);
app.use('/artists', artistsRouter);
app.use('/albums', albumsRouter);



// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});


app.listen(config.port, () => {
  console.log(`✅ PostgreSQL Server running at http://localhost:${config.port}`);
  console.log(`📡 Environment: ${config.nodeEnv}`);
  console.log(`🔗 CORS Origin: ${config.corsOrigin}`);
  console.log(`🗄️ Database: PostgreSQL`);
  console.log(`🛡️ Security: Helmet enabled`);
  console.log(`🗜️ Compression: Enabled`);

});


