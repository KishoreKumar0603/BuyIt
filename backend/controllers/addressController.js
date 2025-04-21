// controllers/address.controller.js
import Address from "../models/address.js";

// Get all addresses for logged-in user
export const getAddressesByUser = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.user._id });
    res.status(200).json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add new address
export const addAddress = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    const newAddress = new Address({
      userId: req.user._id,
      name,
      phone,
      address,
    });

    await newAddress.save();
    res.status(201).json(newAddress);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update existing address
export const updateAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Address.findOneAndUpdate(
      { _id: id, userId: req.user._id },
      req.body,
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "Address not found" });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete address
export const deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Address.findOneAndDelete({
      _id: id,
      userId: req.user._id,
    });

    if (!deleted) return res.status(404).json({ message: "Address not found" });

    res.json({ message: "Address deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
