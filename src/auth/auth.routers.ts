import { Router } from 'express';
import { currentUser } from '@devshopapp/common';

import { getCurrentUserController, signinController, signupController } from './auth.controllers.js';
import { config } from '../shared/app.config.js';

const router = Router();

router.post('/api/signup', signupController);
router.post('/api/signin', signinController);
router.get('/api/current-user', currentUser(config.JWT_KEY!), getCurrentUserController);

export { router as authRouter }