const express = require('express');
const config = require('../config/index');
const Shop = require('../models/shop');
const Category = require('../models/category');
const router = express.Router()


const enSureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    } else {
        //   res.redirect('/users/login');
        next();
    }
}

/* GET home page. */
router.get('/', enSureAuthenticated, async (req, res, next) => {
    const product = await Shop.find();
    const category = await Category.find();
    res.render('index', { categories: category, products: product})
});


module.exports = router;