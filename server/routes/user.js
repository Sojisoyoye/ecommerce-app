import express from 'express';

import { userById, getUser, updateUser } from '../controllers/user';
import { requireSignin } from '../controllers/auth';
import { isAuth } from '../middlewares/authMiddlewares';

const router = express.Router();

router.get('/user/:userId', requireSignin, isAuth, getUser);
router.put('/user/:userId', requireSignin, isAuth, updateUser);

router.param('userId', userById);

export default router;
