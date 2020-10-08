const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const Category = require('../controllers/categoryController')
const { check } = require('express-validator');
const passport = require('../middleware/passport')
const checkAdmin = require('../middleware/checkAdmin');
const upload = require('../middleware/upload');
const receipt = require('../middleware/receipt');



/* @router GET >>> http://localhost:3000/shop */
router.get('/', shopController.index);
router.get('/add', checkAdmin.isAdmin, shopController.addProduct);

/* @router POST  "/shop/add" */
router.post('/add', upload.single("photo"),
    [
        check('name', "กรุณาป้อนข้อมูล").notEmpty(),
        check('description', "กรุณาป้อนรายละเอียด").notEmpty(),
        check('price', "กรุณาใส่ราคา").notEmpty()
    ], shopController.insert);

/* @router GET >>> http://localhost:3000/shop */
router.get('/menu', shopController.menu);


/* @GET shop/show/:id */
router.get('/showDetail/:id', shopController.showDetail)

//@router GET show category
router.get('/showProducts/', shopController.showProducts)

router.get('/adminProduct/', checkAdmin.isAdmin, shopController.adminManagement)

/*@GET /shop/cart */
router.get('/cart/', shopController.getCart);

// /*@POST /shop/cart */
router.post('/cart/', shopController.cart);
/*POST /shop/payment*/
router.post('/payment/', shopController.payment);

router.get('/destroy/:id', shopController.destroy);

router.get('/allDestroy', shopController.allDestroy);

/* @POST http://localhost:3000/shop/adminProduct/delete*/
router.post('/adminProduct/delete/:id', shopController.adminDelete);

router.get('/adminProduct/edit/:id', shopController.getAdminEdit);

router.post('/admin/update', upload.single("photo"),
    [
        check('name', "กรุณาป้อนข้อมูล").notEmpty(),
        check('description', "กรุณาป้อนรายละเอียด").notEmpty(),
        check('price', "กรุณาใส่ราคา").notEmpty()
    ], shopController.adminEdit);

router.post('/checkout', shopController.checkOut);

/*@GET /shop/showOrder */
router.get('/showOrder', shopController.showOrder);

//@GET  /shop/confirmPayment
router.get('/confirmPayment', shopController.getConfirmPayment);

/*@GET  /shop/confirmPayment/:id*/
router.get('/confirmPayment/:id', shopController.confirmPayment);

/* @GET /shop/historyOrder */
router.get('/historyOrder', shopController.historyOrder);

/* @GET /shop/ */
router.post('/confirm_payment', receipt.single('image'),
    [
        check('id', 'กรุณาป้อนรหัสสินค้า').notEmpty(),
        check('price_total', 'กรุณาป้อนราคา').notEmpty(),
        check('date_payment', 'กรุณาป้อนวันที่').notEmpty(),
        check('time_payment', 'กรุณาป้อนเวลาที่โอน').notEmpty()
    ], shopController.confirm_payment);

/* @GET /shop/invoice:id */
router.get('/invoice/:id', shopController.invoice);

router.get('/admin/receipt', shopController.checkReceipt);

router.get('/admin/updateStatusOrder/:id', shopController.updateStatusOrder)

module.exports = router;