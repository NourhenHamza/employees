// middleware/multer.js
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

// Convert import.meta.url to a file path and get the directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define the absolute path to the frontend/public/resumees directory
const resumePath = path.resolve(__dirname, "../../frontend/public/resumees");

// Ensure the directory exists or create it
if (!fs.existsSync(resumePath)) {
  fs.mkdirSync(resumePath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, resumePath); // Use the absolute path
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

export default upload;
