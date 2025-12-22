import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import User from '../models/User';

export const getAllUsers = async (req: any, res: any) => {
    try {
        const users = await User.find({}, 'name email _id');
        res.status(200).json(users);
    } catch (e) {
        res.status(500).json({ message: "Failed to fetch users" });
    }
};

export const updateUserProfile = async (req: any, res: any) => {
    try {
        const userId = req.user._id;
        const { name, email } = req.body;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (name) user.name = name;
        if (email) user.email = email;

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
        });
    } catch (e) {
        res.status(500).json({ message: "Failed to update profile" });
    }
};
