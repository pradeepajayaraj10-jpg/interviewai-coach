import express, { Express } from 'express';
import dotenv from 'dotenv';
import apiRoutes from './routes/index.ts';
import { errorHandler } from './middleware/errorHandler.ts';
import { connectDB } from './db/connection.ts';

dotenv.config();

// Initialize DB in background
connectDB().catch((err) => {
  console.warn('[Database] Async connection init error:', err);
});

export function createApp(): Express {
  const app = express();

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // CORS headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(200);
      return;
    }
    next();
  });

  // Mount API endpoints
  app.use('/api', apiRoutes);

  // Global Error Handler
  app.use(errorHandler);

  return app;
}

export const app = createApp();
