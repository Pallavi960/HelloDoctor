const multer = require("multer");
const path   = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === "image") {
            cb(null, "uploads/images/");
        } else if (file.fieldname === "cv") {
            cb(null, "uploads/cvs/");
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    }
});

const upload = multer({ storage });
module.exports = upload;