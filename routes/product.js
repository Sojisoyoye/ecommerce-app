import express from 'express';

import { create, productById, getProduct, updateProduct, deleteProduct } from '../controllers/product';
import { requireSignin } from '../controllers/auth';
import { isAuth, isAdmin } from '../middlewares/authMiddlewares';
import { userById } from '../controllers/user';

const router = express.Router();

router.get('/product/:productId', getProduct);
router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, create);
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, updateProduct);
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, deleteProduct);


router.param('userId', userById);
router.param('productId', productById);

export default router;
