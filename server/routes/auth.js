import express from 'express';

import { signup, signin, signout } from '../controllers/auth';
import { userSignUpValidator } from '../validator';

const router = express.Router();

router.post('/signup', userSignUpValidator,  signup);
router.post('/signin',  signin);
router.get('/signout',  signout);

export default router;
