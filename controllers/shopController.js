const { validationResult } = require("express-validator");
const Config = require("../config/index");
const Shop = require("../models/shop");
const Category = require("../models/category");
const User = require('../models/user');
const Order = require('../models/order')
const Payment = require('../models/payment');
const nodemailer = require("nodemailer");
const ejs = require('ejs');


//@router GET Shop
exports.index = async (req, res, next) => {
  const categories = await Category.find();
  const shops = await Shop.find()
    .select(" name, description, price, photo ")
    .sort({ _id: -1 });
  const shopWithPhotoDomain = await shops.map((shop, index) => {
    return {
      id: shop._id,
      name: shop.name,
      photo: "http://localhost:3000/images/" + shop.photo,
      description: shop.description,
      price: shop.price,
    };
  });

  // res.status(200).json({
  //     data: shopWithPhotoDomain
  // })
  res.redirect("/");
};

/*@POST*/
exports.addProduct = async (req, res, next) => {
  const categories = await Category.find();
  const shops = await Shop.find()
    .select(" name, description, price, photo ")
    .sort({ _id: -1 });
  const shopWithPhotoDomain = await shops.map((shop, index) => {
    return {
      id: shop._id,
      name: shop.name,
      photo: "http://localhost:3000/images/" + shop.photo,
      description: shop.description,
      price: shop.price,
    };
  });

  res.render("addProduct", {
    products: shopWithPhotoDomain,
    categories: categories,
  });
};
//GET MENU
exports.menu = async (req, res, next) => {
  try {
    const showCategory = req.query.category;
    const categories = await Category.find();
    const shops = await Shop.find().where("category").eq(showCategory);

    res.render("showProducts", {
      categories: categories,
      products: shops,
    });
  } catch (error) {
    console.log(error);
  }
};

/*GET shop by id with menu*/
exports.getShopWithMenu = async (req, res, next) => {
  const { id } = req.params;
  const shopWithMenu = await Shop.findById(id).populate("category");

  res.status(200).json({
    data: shopWithMenu,
  });
};

//@POST Route insert shop
/* @router POST  "shop/add" */
exports.insert = async (req, res, next) => {
  try {
    const { name, description, price, photo } = req.body;
    if (req.file) {
      var projectimage = req.file.filename;
    } else {
      var projectimage = "No Image";
    }
    const shop = new Shop({
      name: name,
      description: description,
      price: price,
      photo: projectimage,
      category: req.body.category,
    });
    await shop.save();
    res.location("/");
    res.redirect("/");
  } catch (error) {
    console.log(error);
  }
};

/*@router GET */
exports.showProducts = async (req, res, next) => {
  const product = await Shop.find();
  const categories = await Category.find();
  res.render("showProducts", { categories: categories, products: product });
};

/*@router GET */
exports.showDetail = async (req, res, next) => {
  const { id } = req.params;
  const products = await Shop.findById(id);
  const categories = await Category.find();
  res.render("show", {
    product: products,
    categories: categories,
  });
};

/*GET  Cart*/
exports.getCart = (req, res, next) => {
  const cart = req.session.cart;
  const displayCart = { item: [], total: 0 };
  var total = 0;
  for (item in cart) {
    displayCart.item.push(cart[item]);
    total += cart[item].qty * cart[item].price;
  }
  displayCart.total = total;
  res.render("cart", { cart: displayCart });
};

/* POST Cart */
exports.cart = async (req, res, next) => {
  try {
    const productId = req.body.product_id;
    req.session.cart = req.session.cart || {};
    const cart = req.session.cart;
    let displayCartQty = {};
    const shops = await Shop.findById({ _id: productId }, (err, product) => {
      //มากกว่าหนึ่งชิ้น
      if (cart[productId]) {
        cart[productId].qty++;
      } else {
        //ซื้อครั้งแรก
        for (let shop in product) {
          cart[productId] = {
            item: product._id,
            title: product.name,
            price: product.price,
            qty: 1,
          };
        }  
      }
    });
     res.redirect("/shop/cart");
  } catch (error) {
    console.log(error);
  }
};

/* GET /shop/destroy*/
exports.destroy = async (req, res, next) => {
  const { id } = req.params;
  req.session.cart = req.session.cart || {};
  const cart = req.session.cart;
  // console.log(id);
  delete req.session.cart[id];
  res.redirect("/shop/cart");
};

exports.allDestroy = async (req, res, next) => {
  const { id } = req.params;
  req.session.cart = req.session.cart || {};
  const cart = req.session.cart;
  req.session.destroy(cart);
  res.redirect("/");
};

exports.adminManagement = async (req, res, next) => {
  const categories = await Category.find();
  const shops = await Shop.find().sort({ _id: -1 });

  res.render("adminProduct", {
    categories: categories,
    products: shops,
  });
};

exports.adminDelete = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categories = await Category.find();
    const products = await Shop.findOneAndDelete({ _id: id });
    if (products.deletedCount === 0) {
      throw new Error("ไม่สามารถลบข้อมูลได้");
    } else {
      res.location("/");
      res.redirect("/");
      res.render("index", {
        product: products,
        categories: categories,
      });
    }
  } catch (error) {
    res.status(400).json({
      error: {
        message: "เกิดผิดพลาด " + error.message,
      },
    });
  }
};

exports.getAdminDelete = (req, res, next) => {
  res.redirect("adminProduct");
};

/* GET Edit */
exports.getAdminEdit = async (req, res, next) => {
  try {
    const { id } = req.params;
    const categories = await Category.find();
    const products = await Shop.find({ _id: id });
    res.render("updateProduct", {
      products: products,
      categories: categories,
    });
  } catch (error) {
    res.status(400).json({
      error: {
        message: "เกิดผิดพลาด " + error.message,
      },
    });
  }
};
/* POST Edit */
exports.adminEdit = async (req, res, next) => {
  try {
    const categories = await Category.find();
    const { id } = req.body;
    const { name, description, price, photo, category } = req.body;
    if (req.file) {
      let productImage = req.file.filename;
      const shop = await Shop.findByIdAndUpdate(id, {
        name: name,
        description: description,
        photo: productImage,
        price: price,
        category: category,
      });
      console.log(shop);
      res.location("/shop/adminProduct");
      res.redirect("/shop/adminProduct");
      res.render("adminProduct", {
        categories: categories,
        products: shop,
      });
    } else {
      const shop = await Shop.findById(id);
      shop.name = name;
      shop.description = description;
      shop.price = price;
      shop.category = category;
      await shop.save();
      // console.log(shop);
      res.location("/shop/adminProduct");
      res.redirect("/shop/adminProduct");
      res.render("adminProduct", {
        products: shop,
        categories: categories,
      });
    }
  } catch (error) {
    console.error(error);
  }
};

/*POST /shop/payment*/
exports.payment = async (req, res, next) => {
  if (req.user) {
  const user = await User.findById();
  // const productId = req.body.product_id;

  req.session.cart = req.session.cart || {};
  const cart = req.session.cart;
  const displayCart = { item: [], total: 0 };
  var total = 0;
  for (item in cart) {
    displayCart.item.push(cart[item]);
    total += cart[item].qty * cart[item].price;
  }
  displayCart.total = total;
  res.render('checkout', { cart: displayCart });
} else {
  res.redirect('/users/login');
}
};

exports.checkOut = async (req, res, next) => {
  const { email, name, fullName, numberPhone, addressInput, subdistrict, district, province, postal_code } = req.body;
  // const dataOrder = req.body;
  const { express } = req.body;
  const cart = req.session.cart;
  const displayCart = { item: [], total: 0 };
  var total = 0;

  if (express === 'basic') {
    for (item in cart) {
      displayCart.item.push(cart[item]);
      total += cart[item].qty * cart[item].price;
    }
    displayCart.total = total + 50;
  } else if (express === 'ems') {
    for (item in cart) {
      displayCart.item.push(cart[item]);
      total += cart[item].qty * cart[item].price;
    }
    displayCart.total = total + 100;
  }

  const order = new Order({
    email: email, name: name, fullName: fullName, numberPhone: numberPhone, addressInput: addressInput,
    subdistrict: subdistrict, district: district, province: province, postal_code: postal_code,
    displayCart: displayCart
  });
  await order.save();

  delete req.session.cart[item];

  //
  /*send mail*/
  //
  const data = await ejs.renderFile(__dirname + '/view/invoice.ejs', { order: order });
  const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: Config.GMAIL,
      pass: Config.GMAILPW
    }
  });
  const mailOptions = {
    to: order.email,
    from: Config.GMAIL,
    subject: 'ยืนยันคำสั่งซื้อหมายเลข',
    html: data
  };
  smtpTransport.sendMail(mailOptions, (err) => {
    console.log('mail sent');
    if (err)
      console.log(err)
    else
      console.log(info);

  });

  // res.status(200).json({
  //   data: { order }
  // })
  res.redirect('/')
}

/*@GET /shop/showOrder */
exports.showOrder = async (req, res, next) => {
  const order = await Order.find().sort({ _id: -1 });
  res.render('order', { orders: order })
}

/* @GET  /shop/confirmPayment */
exports.getConfirmPayment = async (req, res, next) => {
  const category = await Category.find();
  // res.status(200).json({
  //   data: {message: "success"}
  // });
  res.render('confirm-payment', { categories: category })
}

/*@GET/shop/confirmPayment/:id*/
exports.confirmPayment = async (req, res, next) => {
  const { id } = req.params;
  const category = await Category.find();
  const order = await Order.findById(id);
  // res.status(200).json({ order });
  res.render('confirm-payment-id', {
    categories: category,
    order: order
  })
}

/* @GET  /shop/historyOrder */
exports.historyOrder = async (req, res, next) => {
  if (req.user) {
    const { email } = req.user;
    const order = await Order.find().where('email').eq(email)
    res.render('history-order', {
      orders: order
    });
  } else {
    res.redirect('/users/login');
  }
}

exports.confirm_payment = async (req, res, next) => {
  try {
    const { id, bank_name, price_total, date_payment, time_payment, description } = req.body;
    // const user = await User.findOne({id: req.body.userId});

    if (req.file) {
      var image_pay = req.file.filename;
    } else {
      var image_pay = "No Image";
    }

    const payment = new Payment({
      pay_id: id,
      bank_name: bank_name,
      image: image_pay,
      price_total: price_total,
      date_payment: date_payment,
      time_payment: time_payment,
      description: description
    });
    await payment.save();

    const order = await Order.findById(payment.pay_id);
    //
    /*send mail*/
    //
    const smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: Config.GMAIL,
        pass: Config.GMAILPW
      }
    });
    const mailOptions = {
      to: Config.GMAIL,
      from: req.body.userEmail,
      subject: 'ยืนยันคำสั่งซื้อหมายเลข' + payment.pay_id,
      text: 'รายละเอียด\n' + 'ธนาคาร = ' + payment.bank_name + '\nจำนวน = ' + payment.price_total + '\nเวลา = ' + payment.time_payment + '\nวันที่ = ' + payment.date_payment
    };
    smtpTransport.sendMail(mailOptions, function (err) {
      console.log('mail sent');
      if (err)
        console.log(err)
      else
        console.log(info);
    });
    order.status = 'กำลังตรวจสอบข้อมูล';
    await order.save();
    console.log(order.status);
    res.redirect('/shop/historyOrder');
  } catch (error) {
    console.log(error);
    res.send('ไม่สามารถทำรายการได้');
  }
}

/* @GET /shop/invoice/:id */
exports.invoice = async (req, res, next) => {
  if (req.user) {
    const { id } = req.params;
    const order = await Order.findById(id);
    const payment = await Payment.find({ pay_id: id });
    console.log(req.user);
    res.render('invoice', {
      order: order
    });
  } else {
    res.redirect('/users/login')
  }
}