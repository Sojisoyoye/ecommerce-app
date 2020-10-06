const express = require('express');
const router = express.Router();

const { create, categoryById, getCategories, getCategory, updateCategory, deleteCategory } = require('../controllers/category');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require('../controllers/user');


router.get('/categories', getCategories);
router.get('/category/:categoryId', getCategory);
router.post('/category/create/:userId', requireSignin, isAuth, isAdmin,  create);
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, updateCategory);
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, deleteCategory);

router.param('userId', userById);
router.param('categoryId', categoryById);

module.exports = router;
