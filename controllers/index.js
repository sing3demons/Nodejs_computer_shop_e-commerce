const Shop = require("../models/shop");
const Category = require("../models/category");

module.exports.Pagination = async (req, res, next) => {
    const categories = await Category.find();
 
    const calSkip = (page, size) => {
      return (page - 1) * size;
    };
  
    const calPage = (count, size) => {
      return Math.ceil(count / size);
    }
  
    const page = req.query.page || 1;
    const size = req.query.size || 12;
  
    const [_results, _count] = await Promise.all([
      Shop.find()
      .skip(calSkip(page, size))
      .limit(size)
      .exec(),
      Shop.countDocuments().exec()
    ]);
  
    const pages = calPage(_count, size)
  
    return res.render("index", {
      categories: categories,
      products: _results,
      pages: pages,
      current: page,
      totalCount: _count,
    })
}