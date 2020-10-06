import express from 'express';

import { 
    productById,
    createProduct,
    getProduct,
    updateProduct,
    deleteProduct,
    getProducts,
    getRelatedProducts,
    getCategories,
    getProductsBySearch,
    getProductPhoto
} from '../controllers/product';
import { userById } from '../controllers/user';
import { requireSignin } from '../controllers/auth';
import { isAuth, isAdmin } from '../middlewares/authMiddlewares';

const router = express.Router();

router.post('/product/create/:userId', requireSignin, isAuth, isAdmin, createProduct);
router.get('/product/:productId', getProduct);
router.put('/product/:productId/:userId', requireSignin, isAuth, isAdmin, updateProduct);
router.delete('/product/:productId/:userId', requireSignin, isAuth, isAdmin, deleteProduct);

router.get('/products', getProducts);
router.get('/products/related/:productId', getRelatedProducts);
router.get('/products/categories', getCategories);
router.post('/products/by/search', getProductsBySearch);
router.get('/product/photo/:productId', getProductPhoto);

router.param('userId', userById);
router.param('productId', productById);

export default router;
