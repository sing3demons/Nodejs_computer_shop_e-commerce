const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { check } = require('express-validator');
const checkAdmin = require('../middleware/checkAdmin');

/* Admin @GET >>> http://localhost:3000/category/add */
router.get('/add', checkAdmin.isAdmin, categoryController.index);

/* Admin @POST >>> http://localhost:3000/category/add */
router.post('/add', [
    check('name', 'กรุณาป้อนหมวดหมู่สินค้า').notEmpty()
], categoryController.insert);


module.exports = router;