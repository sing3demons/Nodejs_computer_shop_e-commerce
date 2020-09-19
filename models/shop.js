const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    photo: { type: String },
    category: { type: Schema.Types.String, ref: 'Category',localField: '_id',foreignField: 'name'  }
    
}, {
    toJSON: { virtuals: true },
    timestamps: true,
    collection: 'shops'
});

// schema.virtual('categories', {
//     ref: 'Category', //ลิงก์ไปที่โมเดล menu
//     localField: '_id', //_id ฟิลด์ของโมเดล Shop (ไฟล์นี้)
//     foreignField: 'shop' //shop ฟิลด์ของโมเดล Menu (foreignkey)
// });

const shop = mongoose.model('Shop', schema);
module.exports = shop;