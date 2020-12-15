const express = require("express");
const config = require("../config/index");
const Product = require("../models/shop");
const Category = require("../models/category");
const shop = require("../models/shop");
const router = express.Router();

/* GET home page. */
router.get("/", async (req, res, next) => {
  const category = await Category.find();

  const calSkip = (page, size) => {
    return (page - 1) * size;
  };

  const calPage = (count, size) => {
    return Math.ceil(count / size);
  };

  const page = req.query.page || 1;
  const size = req.query.size || 2;

  const [_results, _count] = await Promise.all([
    Product.find().skip(calSkip(page, size)).limit(size).exec(),
    Product.countDocuments().exec(),
  ]);

const pages = calPage(_count, size)



 return res.render("index", {
    pages: pages,
    current: page,
    categories: category,
    products: _results,
  });
});

router.post("/search", async (req, res, next) => {
  const { search } = req.body;
  const shop = await Shop.find({ name: { $regex: search, $options: "i" } });
  const category = await Category.find();
  res.render("search", { categories: category, products: shop });
});

module.exports = router;
