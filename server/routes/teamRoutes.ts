import express from 'express';
import { createTeam, getTeams, inviteMember, getTeamById, getTeamChats, addTeamChat } from '../controllers/teamController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .get(protect, getTeams)
    .post(protect, createTeam);

router.post('/:teamId/invite', protect, inviteMember);
router.route('/:teamId/chat')
    .get(protect, getTeamChats)
    .post(protect, addTeamChat);

router.get('/:id', protect, getTeamById);

export default router;