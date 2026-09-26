import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDir = path.resolve("upload");

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        const safeName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
        cb(null, Date.now() + "-" + safeName);
    },
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 100 * 1024 * 1024 // 100MB limit
    }
});

export default upload;
