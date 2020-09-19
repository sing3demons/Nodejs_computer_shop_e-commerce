const mongoose = require('mongoose');

// User Schema
const order = new mongoose.Schema({
    email: { type: String, lowercase: true, trim: true },
    name: { type: String },
    fullName: { type: String },
    numberPhone: { type: String },
    addressInput: { type: String },
    subdistrict: { type: String },
    district: { type: String },
    province: { type: String },
    postal_code: { type: Number },
    displayCart: { type: Object },
    status: { type: String, enum: ['ยังไม่ได้ชำระเงิน', 'ชำระเงินแล้ว', 'รอส่งสินค้า', 'ส่งสินค้าแล้ว', 'ยกเลิก'], default: 'ยังไม่ได้ชำระเงิน'}
}, {
    timestamps: true
});

module.exports = mongoose.model('Order', order);