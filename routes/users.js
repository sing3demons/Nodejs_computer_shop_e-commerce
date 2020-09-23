//Router
const express = require('express');
const { check } = require('express-validator');
const router = express.Router();
const User = require('../models/user');
const passport = require('../middleware/passport');
const checkAdmin = require('../middleware/checkAdmin');
const userController = require('../controllers/userControler');

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});

/* POST */
router.get('/register', userController.index);

router.get('/login', (req, res, next) => {
  res.render('login');
});
router.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/users/login');
});

/*@POST /users/login */
router.post('/login', [passport.isLogin], userController.login);

/*@GET /users/forgot */
router.get('/forgot', userController.getForgotPassword)

/*@POST /users/forgot */
router.post('/forgot', userController.forgotPassword)

/*@GET /users/reset */
router.get('/reset/:token', userController.getResetPassword)

/*@POST /users/reset */
router.post('/reset/:token', userController.resetPassword)

router.post('/register', [
  check('email', 'กรุณาป้อนอีเมล').isEmail(),
  check('name', 'กรุณาป้อนชื่อของท่าน').not().isEmpty(),
  check('password', 'กรุณาป้อนรหัสผ่าน').not().isEmpty()
], userController.register);

/*GET users/edit*/
router.get('/edituser', userController.getUpdateUser);

//
/*@POST /users/updateUser*/
//
router.post('/updateUser', userController.updateUser)

/*GET users/admin */
router.get('/admin', checkAdmin.isAdmin, userController.admin);

/*GET users/admin */
router.get('/admin/admin-user', checkAdmin.isAdmin, userController.getAdminManagementUser);

/*POST users/admin */
router.post('/admin/admin-user', checkAdmin.isAdmin, userController.adminManagementUserAndDelete);

router.get('/admin/shop-order', checkAdmin.isAdmin, userController.getShopOrder);

router.post('/admin/update-status-order/:id', checkAdmin.isAdmin, userController.shopOrder);

module.exports = router;