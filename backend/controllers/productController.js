import mongoose from 'mongoose';

export const getAllProducts = async (req, res) => {
    try {
        const { category } = req.query;

        if (!category) {
            return res.status(400).json({ message: "Category is required" });
        }

        // Normalize collection name (convert to lowercase and replace spaces with underscores)
        const collectionName = category.toLowerCase().replace(" ", "_");

        // Check if the collection exists
        const collections = await mongoose.connection.db.listCollections().toArray();
        const collectionExists = collections.some(col => col.name === collectionName);

        if (!collectionExists) {
            return res.status(404).json({ message: "Category not found" });
        }

        // Dynamically select the collection
        const ProductModel = mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }), collectionName);

        // Fetch all products from the selected category collection
        const products = await ProductModel.find();
        res.json(products);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
