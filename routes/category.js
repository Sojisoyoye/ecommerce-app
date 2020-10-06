import express from 'express';

import { create, categoryById, getCategories, getCategory, updateCategory, deleteCategory } from '../controllers/category';
import { requireSignin } from '../controllers/auth';
import { isAuth, isAdmin } from '../middlewares/authMiddlewares';
import { userById } from '../controllers/user';

const router = express.Router();


router.get('/categories', getCategories);
router.get('/category/:categoryId', getCategory);
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin,  create);
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, updateCategory);
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, deleteCategory);

router.param('userId', userById);
router.param('categoryId', categoryById);

export default router;
