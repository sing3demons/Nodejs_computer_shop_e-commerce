const Category = require('../models/category')
const config = require('../config/index');
const { validationResult } = require('express-validator');

/* Admin @GET >>> http://localhost:3000/category/add */
exports.index = async (req, res, next) => {
        const category = await Category.find()
        res.render('addCategory', {
            categories: category
        });
}

/* Admin @POST >>> http://localhost:3000/category/add */
exports.insert = async (req, res, next) => {
    const result = validationResult(req);
    const errors = result.errors;
    //Validation Data
    if (!result.isEmpty()) {
        //Return error to views
        res.render('addCategory', {
            errors: errors
        })
    } else {
        const { name } = req.body;
        let category = new Category({
            name: name
        });
        await category.save();
        res.render('addCategory', {
            categories: category
        });
    }
}