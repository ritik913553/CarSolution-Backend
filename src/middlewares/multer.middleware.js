import multer from "multer";
import path from "path";
import crypto from "crypto";
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    filename: function (req, file, cb) {
        crypto.randomBytes(12, function (err, bytes) {
            const fn = bytes.toString("hex") + path.extname(file.originalname);
            console.log("multer page")
            console.log("Multer middleware Error",err);
            cb(null, fn);
        });
    },
});

export const upload = multer({
    storage: storage,
});
