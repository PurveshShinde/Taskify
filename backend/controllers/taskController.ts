import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import Task from '../models/Task';
import Team from '../models/Team';

interface AuthRequest extends ExpressRequest {
  user?: any;
}

export const getTasks = async (req: any, res: any) => {
  const authReq = req;
  if (!authReq.user) return res.status(401).json({ message: 'Not authorized' });
  
  try {
    const { teamId, type } = req.query;
    let query: any = {};

    if (type === 'team' && teamId) {
       // Verify user is in team
       const team = await Team.findOne({ _id: teamId, members: authReq.user._id });
       if (!team) return res.status(403).json({ message: 'Not a member of this team' });
       query = { teamId };
    } else {
       // Personal tasks
       query = { userId: authReq.user._id, teamId: null };
    }

    const tasks = await Task.find(query).sort({ deadline: 1, createdAt: -1 });
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
};

export const createTask = async (req: any, res: any) => {
  const authReq = req;
  if (!authReq.user) return res.status(401).json({ message: 'Not authorized' });

  const { title, description, deadline, status, teamId } = req.body;

  if (!title) {
    return res.status(400).json({ message: 'Please add a task title' });
  }

  if (teamId) {
      const team = await Team.findOne({ _id: teamId, members: authReq.user._id });
      if (!team) return res.status(403).json({ message: 'Cannot create task for team you are not in' });
  }

  try {
    const task = await Task.create({
      title,
      description,
      deadline,
      status: status || 'pending',
      userId: authReq.user._id,
      teamId: teamId || null
    });
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create task' });
  }
};

export const updateTask = async (req: any, res: any) => {
  const authReq = req;
  if (!authReq.user) return res.status(401).json({ message: 'Not authorized' });

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Check permissions (Personal or Team Member)
    if (task.teamId) {
        const team = await Team.findOne({ _id: task.teamId, members: authReq.user._id });
        if (!team) return res.status(403).json({ message: 'Not authorized for this team task' });
    } else {
        if (task.userId.toString() !== authReq.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: 'Update failed' });
  }
};

export const deleteTask = async (req: any, res: any) => {
  const authReq = req;
  if (!authReq.user) return res.status(401).json({ message: 'Not authorized' });

  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (task.teamId) {
        // Only owner or team creator can delete? For now, any member.
        const team = await Team.findOne({ _id: task.teamId, members: authReq.user._id });
        if (!team) return res.status(403).json({ message: 'Not authorized' });
    } else {
        if (task.userId.toString() !== authReq.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }
    }

    await task.deleteOne();
    res.status(200).json({ id: req.params.id });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed' });
  }
};