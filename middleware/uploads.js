//Upload
const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './public/images/receipt')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + ".jpg");
    }
})
const uploadReceipt = multer({ storage: storage });

module.exports = uploadReceipt;