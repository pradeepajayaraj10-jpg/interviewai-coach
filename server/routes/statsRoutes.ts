import { Router } from 'express';
import { StatsController } from '../controllers/statsController.ts';

const router = Router();

router.get('/', StatsController.getDashboardStats);

export default router;
