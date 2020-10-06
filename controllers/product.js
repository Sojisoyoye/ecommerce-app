import formidable from 'formidable';
import _ from 'lodash';
import fs from 'fs';
import Product from '../models/product';
import errorHandler from '../helpers/dbErrorHandler';

export const productById = (req, res, next, id) => {
    Product.findById(id).exec((err, product) => {
        if (err || !product) {
            return res.status(404).json({
                error: 'Product not found'
            });
        }

        req.product = product;
        next();
    });
};

export const create = (req, res) => {
    let form = new formidable.IncomingForm();

    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
                return res.status(400).json({
                    error: 'Image could not be uploaded'
                }) 
            };

            const { name, description, price, category, quantity, shipping } = fields;

            if (!name || !description || !price || !category || !quantity || !shipping) {
                return res.status(400).json(
                    { error: 'All fields are required' }
                )
            }

            let product = new Product(fields);

            if (files.photo.size) {
                if (files.photo.size > 1000000) {
                    return res.status(400).json(
                        { error: 'Image should be less than 1mb in size' }
                    );
                }
                product.photo.data = fs.readFileSync(files.photo.path);
                product.photo.contentType =files.photo.type;
            };

            product.save((err, result) => {
                if (err) {
                    return res.status(400).json(
                            { error: errorHandler(err) }
                        )
                };

                res.json(result);
            });
    });
};

export const getProduct = (req, res) => {
    req.product.photo = undefined;

    return res.json(req.product);
};

export const updateProduct = (req, res) => {
    let form = new formidable.IncomingForm();

    form.keepExtensions = true;

    form.parse(req, (err, fields, files) => {
        if (err) {
                return res.status(400).json({
                    error: 'Image could not be uploaded'
                }) 
            };

            const { name, description, price, category, quantity, shipping } = fields;

            if (!name || !description || !price || !category || !quantity || !shipping) {
                return res.status(400).json(
                    { error: 'All fields are required' }
                )
            }

            let product = req.product;

            product = _.extend(product, fields);

            if (files.photo.size) {
                if (files.photo.size > 1000000) {
                    return res.status(400).json(
                        { error: 'Image should be less than 1mb in size' }
                    );
                }
                product.photo.data = fs.readFileSync(files.photo.path);
                product.photo.contentType =files.photo.type;
            };

            product.save((err, result) => {
                if (err) {
                    return res.status(400).json(
                            { error: errorHandler(err) }
                        )
                };

                res.json(result);
            });
    });
}

export const deleteProduct = (req, res) => {
    let product = req.product;

    product.remove((err) => {

        if (err) {
            return res.status(400).json(
                { error: errorHandler(err) }
            );
        };

        res.json({
            'message': 'Product deleted successfully'
        });
    });
};
