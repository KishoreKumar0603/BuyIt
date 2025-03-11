import Category from "../models/categoryModel.js";

export const addCategory = async (req, res) => {
    try {
        const { name, aliases } = req.body;

        const category = new Category({ name: name.toLowerCase(), aliases: aliases.map(a => a.toLowerCase()) });
        await category.save();

        res.status(201).json({ message: "Category added successfully", category });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
