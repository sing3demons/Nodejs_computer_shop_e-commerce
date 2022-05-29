const Category = require("../models/category.js");
const Shop = require("../models/shop.js");
const categories = require("./category.js");
const products = require("./product.js");

const seedCategory = async() => {
    const category = await Category.find();
    if (category.length === 0) {
        console.log(`categories: ${categories.length} creating...`);

        categories.forEach(async({ name }) => {
            let category = new Category({
                name: name,
            });
            await category.save();
        });
        console.log(`categories success...`);
        return;
    }
};

const seedProduct = async() => {
    const shop = await Shop.find();

    if (shop.length === 0) {
        console.log(`products: ${products.length} creating...`);
        products.forEach(async({ name, description, price, photo, category }) => {
            const shop = Shop({
                name,
                description,
                price,
                photo,
                category,
            });

            await shop.save();
        });

        console.log(`products success...`);
        return;
    }
};

const seed = async() => {
    seedCategory();
    seedProduct();
};

module.exports = seed;