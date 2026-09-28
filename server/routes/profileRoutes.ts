import { Router } from 'express';
import { ProfileController } from '../controllers/profileController.ts';

const router = Router();

router.get('/', ProfileController.getProfile);
router.put('/', ProfileController.updateProfile);

export default router;
