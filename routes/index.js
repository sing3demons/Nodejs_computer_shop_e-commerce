const express = require("express");
const config = require("../config/index");
const Product = require("../models/shop");
const Category = require("../models/category");
const shop = require("../models/shop");
const router = express.Router();
const paging = require('../controllers')

/* GET home page. */
router.get("/", paging.Pagination);

router.post("/search", async (req, res, next) => {
  const { search } = req.body;
  const shop = await Shop.find({ name: { $regex: search, $options: "i" } });
  const category = await Category.find();
  res.render("search", { categories: category, products: shop });
});

module.exports = router;
