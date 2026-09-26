import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config({ path: "backend/config/config.env" });
dotenv.config({ path: "config/config.env" });
dotenv.config({ path: "../backend/config/config.env" });

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "xrwvqc6e",
    api_key: process.env.CLOUDINARY_API_KEY || "246439113953275",
    api_secret: process.env.CLOUDINARY_API_SECRET || "wGgqMHWSgvjwjSKQmDAvf-JNJmk"
});

export default cloudinary;
