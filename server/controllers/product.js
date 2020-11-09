import formidable from 'formidable';
import _ from 'lodash';
import fs from 'fs';
import Product from '../models/product';
import errorHandler from '../helpers/dbErrorHandler';

export const productById = (req, res, next, id) => {
  Product.findById(id).exec((err, product) => {
    if (err || !product) {
      return res.status(404).json({
        error: 'Product not found',
      });
    }

    req.product = product;
    next();
  });
};

export const createProduct = (req, res) => {
  let form = new formidable.IncomingForm();

  form.keepExtensions = true;

  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image could not be uploaded',
      });
    }

    const { name, description, price, category, quantity, shipping } = fields;

    if (!name || !description || !price || !category || !quantity || !shipping) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    let product = new Product(fields);

    if (files.photo.size) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({ error: 'Image should be less than 1mb in size' });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, data) => {
      if (err) {
        return res.status(400).json({ error: errorHandler(err) });
      }

      res.status(200).json({
        product: data,
      });
    });
  });
};

/**
 * by sell = products?sortBy=sold&order=desc&limit=4
 * by arrival = products?sortBy=createdAt&order=desc&limit=4
 * if no query params, then all products are returned
 */

export const getProducts = (req, res) => {
  let order = req.query.order ? req.query.order : 'asc';
  let sortBy = req.query.sortBy ? req.query.sortBy : '_id';
  let limit = req.query.limit ? parseInt(req.query.limit) : 5;

  Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(404).json({ error: 'Product not found' });
      }

      res.status(200).json({
        products: data,
      });
    });
};

/**
 * finds the product based on req product category
 * other products in the same category will be returned
 */
export const getRelatedProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 5;

  Product.find({ _id: { $ne: req.product }, category: req.product.category })
    .limit(limit)
    .populate('category', '_id name')
    .exec((err, data) => {
      if (err) {
        return res.status(404).json({ error: 'Products not found' });
      }

      res.status(200).json({
        products: data,
      });
    });
};

/**
 * Gets all categories attached to products
 */
export const getCategories = (req, res) => {
  Product.distinct('category', {}, (err, data) => {
    if (err) {
      return res.status(404).json({ error: 'Categories not found' });
    }

    res.status(200).json({
      categories: data,
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
        error: 'Image could not be uploaded',
      });
    }

    const { name, description, price, category, quantity, shipping } = fields;

    if (!name || !description || !price || !category || !quantity || !shipping) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    let product = req.product;

    product = _.extend(product, fields);

    if (files.photo.size) {
      if (files.photo.size > 1000000) {
        return res.status(400).json({ error: 'Image should be less than 1mb in size' });
      }
      product.photo.data = fs.readFileSync(files.photo.path);
      product.photo.contentType = files.photo.type;
    }

    product.save((err, result) => {
      if (err) {
        return res.status(400).json({ error: errorHandler(err) });
      }

      res.json(result);
    });
  });
};

export const deleteProduct = (req, res) => {
  let product = req.product;

  product.remove((err) => {
    if (err) {
      return res.status(400).json({ error: errorHandler(err) });
    }

    res.json({
      message: 'Product deleted successfully',
    });
  });
};

/**
 * list products by search
 * - show categories in checkbox and price range in radio buttons
 * - as the user clicks on those checkbox and radio buttons
 * - make api request and show the products to users based on what he wants
 */

export const getProductsBySearch = (req, res) => {
  let order = req.body.order ? req.body.order : 'desc';
  let sortBy = req.body.sortBy ? req.body.sortBy : '_id';
  let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  let skip = parseInt(req.body.skip);
  let findArgs = {};

  // console.log(order, sortBy, limit, skip, req.body.filters);
  // console.log("findArgs", findArgs);

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === 'price') {
        // gte -  greater than price [0-10]
        // lte - less than
        findArgs[key] = {
          $gte: req.body.filters[key][0],
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  Product.find(findArgs)
    .select('-photo')
    .populate('category')
    .sort([[sortBy, order]])
    .skip(skip)
    .limit(limit)
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: 'Products not found',
        });
      }
      res.json({
        size: data.length,
        data,
      });
    });
};

export const getProductPhoto = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }

  next();
};
