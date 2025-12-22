import express from 'express';
import { createTeam, getTeams, inviteMember } from '../controllers/teamController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .get(protect, getTeams)
    .post(protect, createTeam);

router.post('/:teamId/invite', protect, inviteMember);

export default router;