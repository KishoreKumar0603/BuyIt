import { cloudinary } from "../config/cloudinaryConfig.js"; // Ensure named import

export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" }); // ✅ This means multer didn't process the file
    }

    // Upload to Cloudinary
    cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (error, result) => {
        if (error) return res.status(500).json({ error: error.message });
        res.json({ url: result.secure_url });
      }
    ).end(req.file.buffer);

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
