import express from 'express';

import { userById } from '../controllers/user';

const router = express.Router();

router.param('userId', userById);

export default router;
