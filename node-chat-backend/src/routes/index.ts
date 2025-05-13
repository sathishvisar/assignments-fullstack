import { Router } from 'express';
import { auth } from '../middleware/auth';
import { register, login } from '../controllers/auth.controller';
import { jobs } from '../controllers/jobs.controller';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);

router.get('/jobs', auth(['admin', 'user']), jobs);

export default router;