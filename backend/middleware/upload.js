import multer from "multer";

const storage = multer.memoryStorage(); // Store in memory for Cloudinary upload

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

export { upload };
