const express = require('express');
const config = require('../config/index');
const Shop = require('../models/shop');
const Category = require('../models/category');
const shop = require('../models/shop');
const router = express.Router()


/* GET home page. */
router.get('/', async (req, res, next) => {
    const product = await Shop.find();
    const category = await Category.find();
    res.render('index', { categories: category, products: product })
});

router.post('/search', async (req, res, next) => {
    const { search } = req.body;
    const shop = await Shop.find({ "name": { $regex: search, '$options': 'i' } })
    const category = await Category.find();
    res.render('search', { categories: category, products: shop })
});


module.exports = router;