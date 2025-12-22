
import express from 'express';
import { registerUser, loginUser, verifyEmail, updatePassword } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify-email', verifyEmail);
router.put('/password', protect, updatePassword);

export default router;