import express from 'express';
import {
  getAddressesByUser,
  addAddress,
  updateAddress,
  deleteAddress
} from '../controllers/addressController.js';
import { isAuth } from '../middleware/isAuth.js'; // ✅ your custom auth

const router = express.Router();

router.get('/', isAuth, getAddressesByUser);
router.post('/', isAuth, addAddress);
router.put('/:id', isAuth, updateAddress);
router.delete('/:id', isAuth, deleteAddress);

export default router;
