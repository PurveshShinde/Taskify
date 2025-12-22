import express from 'express';
import { loginUser, updatePassword, firebaseLogin, deleteAccount, getUserProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/login', loginUser);
router.post('/firebase', firebaseLogin);
router.put('/password', protect, updatePassword);
router.delete('/me', protect, deleteAccount);
router.get('/me', protect, getUserProfile);

export default router;
