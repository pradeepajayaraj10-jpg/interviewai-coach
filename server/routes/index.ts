import { Router } from 'express';
import profileRoutes from './profileRoutes.ts';
import interviewRoutes from './interviewRoutes.ts';
import statsRoutes from './statsRoutes.ts';
import { GeminiService } from '../services/gemini.ts';
import { isMongoActive } from '../db/connection.ts';

const router = Router();

router.get('/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    aiConfigured: GeminiService.isAIConfigured(),
    database: isMongoActive() ? 'mongodb' : 'memory/persisted',
    version: '1.0.0',
  });
});

router.use('/profile', profileRoutes);
router.use('/interviews', interviewRoutes);
router.use('/stats', statsRoutes);

export default router;
