import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },  // Collection name (e.g., "tv")
    aliases: [{ type: String }]  // Alternative names (e.g., ["Television", "Smart TV"])
});

export default mongoose.model("Category", categorySchema);
