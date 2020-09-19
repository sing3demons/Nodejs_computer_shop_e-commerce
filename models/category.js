/* many to 1  */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = Schema({
    name: { type: String, required: true, trim: true },
    shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    toJSON: { virtuals: true },
    timestamps: true,
    collection: 'categories'
});

schema.virtual('shops', {
    ref: 'Shop', //ลิงก์ไปที่โมเดล menu
    localField: 'category', //_id ฟิลด์ของโมเดล Shop (ไฟล์นี้)
    foreignField: 'category' //shop ฟิลด์ของโมเดล Menu (foreignkey)
});

const category = mongoose.model('Category', schema);
module.exports = category;