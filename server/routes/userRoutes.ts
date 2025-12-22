import express from 'express';
import { getAllUsers, updateUserProfile } from '../controllers/userController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', protect, getAllUsers);
router.put('/profile', protect, updateUserProfile);

export default router;
