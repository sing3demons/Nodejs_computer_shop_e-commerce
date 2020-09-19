const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String,
    name: {type: String, unique: true},
    role: {type: String, enum: ['member', 'admin'], default: "member"},
    fullName: { type: String },
    numberPhone: { type: String },
    addressInput: {type: String},
    subdistrict: { type: String },
    district: { type: String },
    province: { type: String },
    postal_code: { type: Number },
    resetPasswordToken: String,
    resetPasswordExpires: Date
}, { timestamps: true });

userSchema.statics.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
};

userSchema.methods.isMember = function() {
    return (this.role === "member");
};
userSchema.methods.isAuthor = function() {
    return (this.role === "admin");
};

module.exports = mongoose.model('User', userSchema);