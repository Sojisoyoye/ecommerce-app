import Category from '../models/category';
import { errorHandler } from '../helpers/dbErrorHandler';;

export const categoryById = (req, res, next, id) => {
    Category.findById(id).exec((err, category) => {
        if (err || !category) {
            return res.status(404).json({
                error: 'Category not found'
            });
        }

        req.category = category;
        next();
    });
};

export const createCategory = (req, res) => {
    const category = new Category(req.body);

    category.save((err, data) => {
        if (err) {
                return res.status(400).json({
                    error: errorHandler(err)
                })
            }

            res.json({data});
    })
};

export const getCategory = (req, res) => {
    return res.json(req.category);
};

export const getCategories = (req, res) => {
    Category.find().exec((err, categories) => {
        if (err) {
            return res.status(400).json(
                { error: errorHandler(err) }
            );
        };

        res.status(200).json({
            categories
        });
    })
};

export const updateCategory = (req, res) => {
    const category = req.category;
    category.name = req.body.name;
    category.save((err, data) => {
        if (err) {
            return res.status(400).json(
                { error: errorHandler(err) }
            );
        };

        res.status(200).json({
            data
        });
    })
}

export const deleteCategory = (req, res) => {
    let category = req.category;

    category.remove((err) => {
        if (err) {
            return res.status(400).json(
                { error: errorHandler(err) }
            );
        };

        res.status(200).json({
            'message': 'Category deleted successfully'
        });
    });
};
