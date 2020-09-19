require('dotenv').config();

module.exports = {
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI,
    DOMAIN: process.env.DOMAIN,
    DOMAIN_GOOGLE_STORAGE: process.env.DOMAIN_GOOGLE_STORAGE,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV,
    PAY_STRIPE: process.env.PAY_STRIPE,
    SECRET_KEY: process.env.SECRET_KEY,
    GMAIL: process.env.GMAIL,
    GMAILPW: process.env.GMAILPW
}