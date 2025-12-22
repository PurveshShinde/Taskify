
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User';
import { sendEmail } from '../services/emailService';

const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '30d',
  });
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req: any, res: any) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please add all fields' });
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    verificationToken,
    isVerified: false
  });

  if (user) {
    // Send verification email
    // IMPORTANT: Point to the Frontend URL (localhost:5173), not the Backend URL (localhost:5000)
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verifyUrl = `${frontendUrl}/#/verify-email?token=${verificationToken}`;
    
    await sendEmail(
        user.email,
        'Verify your Taskify Account',
        `Please click the link to verify your account: ${verifyUrl}\n\nThis link expires in 24 hours.`
    );

    res.status(201).json({
      message: "Registration successful. Please check your email to verify your account."
    });
  } else {
    res.status(400).json({ message: 'Invalid user data' });
  }
};

// @desc    Verify email
// @route   POST /api/auth/verify-email
// @access  Public
export const verifyEmail = async (req: any, res: any) => {
    const { token } = req.body;
    
    const user = await User.findOne({ verificationToken: token });

    if(!user) {
        return res.status(400).json({ message: 'Invalid or expired token' });
    }

    user.isVerified = true;
    user.verificationToken = undefined; // Clear token
    await user.save();

    res.status(200).json({ message: 'Email verified successfully. You can now login.' });
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req: any, res: any) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
  }

  if (!user.isVerified) {
      return res.status(401).json({ message: 'Please verify your email address first.' });
  }

  if (user && (await bcrypt.compare(password, user.password as string))) {
    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id.toString()),
    });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
};

// @desc    Update password
// @route   PUT /api/auth/password
// @access  Private
export const updatePassword = async (req: any, res: any) => {
    const { password } = req.body;
    
    // req.user is populated by protect middleware
    const user = await User.findById(req.user._id);
    
    if (user) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.json({ message: 'Password updated successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};
