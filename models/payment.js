const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    pay_id: { type: String, required: true },
    bank_name: { type: String, required: true },
    price_total: { type: Number, required: true },
    image: { type: String },
    date_payment: { type: String, required: true },
    time_payment: { type: String, required: true },
    description: { type: String },
    order: { type: Schema.Types.ObjectId, ref: 'Order', localField: '_id', foreignField: 'name' }
});

module.exports = mongoose.model('Payment', schema);