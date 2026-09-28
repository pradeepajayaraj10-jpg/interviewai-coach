import { Router } from 'express';
import { InterviewController } from '../controllers/interviewController.ts';

const router = Router();

router.get('/', InterviewController.listInterviews);
router.post('/start', InterviewController.startInterview);
router.get('/:id', InterviewController.getInterview);
router.post('/:id/answer', InterviewController.submitAnswer);
router.post('/:id/next', InterviewController.nextQuestion);
router.post('/:id/hint', InterviewController.requestHint);
router.post('/:id/finish', InterviewController.finishInterview);
router.delete('/:id', InterviewController.deleteInterview);

export default router;
