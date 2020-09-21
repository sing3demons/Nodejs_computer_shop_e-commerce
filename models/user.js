const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Schema = mongoose.Schema;

// User Schema
const userSchema = new Schema({
    email: { type: String, unique: true, lowercase: true },
    password: String,
    name: { type: String, required: true },
    role: { type: String, enum: ['member', 'admin'], default: "member" },
    fullName: { type: String },
    numberPhone: { type: String },
    addressInput: { type: String },
    subdistrict: { type: String },
    district: { type: String },
    province: { type: String },
    postal_code: { type: Number },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, { timestamps: true });

/*สร้าง method mongoose */
// hash a password
userSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(8);
    const hashPassword = await bcrypt.hash(password, salt);
    return hashPassword;
}
// userSchema.statics.generateHash = function (password) {
//     return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
// };

//check a password
// - this.password คือ password ที่ hash แล้ว
userSchema.methods.checkPassword = async function (password) {
    const isValid = await bcrypt.compare(password, this.password);
    return isValid;
}

// userSchema.methods.validPassword = async function (password) {
//     return bcrypt.compareSync(password, this.password);
// };

userSchema.methods.isMember = function () {
    return (this.role === "member");
};
userSchema.methods.isAuthor = function () {
    return (this.role === "admin");
};

module.exports = mongoose.model('User', userSchema);