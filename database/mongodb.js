const mongoose = require('mongoose');
const { MONGODB_URI } = require('../config/index.js');
const connectMongo = async() => await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
});

module.exports = { connectMongo, mongoose }