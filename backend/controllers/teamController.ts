import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import Team from '../models/Team';
import User from '../models/User';

interface AuthRequest extends ExpressRequest {
  user?: any;
}

export const createTeam = async (req: any, res: any) => {
  const authReq = req;
  const { name } = req.body;
  if(!name) return res.status(400).json({message: "Name required"});

  try {
      const team = await Team.create({
          name,
          ownerId: authReq.user._id,
          members: [authReq.user._id]
      });
      res.status(201).json(team);
  } catch(e) {
      res.status(500).json({message: "Failed to create team"});
  }
};

export const getTeams = async (req: any, res: any) => {
    const authReq = req;
    try {
        const teams = await Team.find({ members: authReq.user._id }).populate('members', 'name email');
        res.status(200).json(teams);
    } catch(e) {
        res.status(500).json({message: "Failed to fetch teams"});
    }
};

export const inviteMember = async (req: any, res: any) => {
    const authReq = req;
    const { email } = req.body;
    const { teamId } = req.params;

    try {
        const team = await Team.findById(teamId);
        if(!team) return res.status(404).json({message: "Team not found"});
        if(team.ownerId.toString() !== authReq.user.id) return res.status(403).json({message: "Only owner can invite"});

        const userToInvite = await User.findOne({ email });
        if(!userToInvite) return res.status(404).json({message: "User not found"});

        if(team.members.includes(userToInvite._id)) {
            return res.status(400).json({message: "User already in team"});
        }

        team.members.push(userToInvite._id);
        await team.save();
        
        // Populate the updated members list
        await team.populate('members', 'name email');

        res.status(200).json(team);
    } catch(e) {
        res.status(500).json({message: "Invite failed"});
    }
};