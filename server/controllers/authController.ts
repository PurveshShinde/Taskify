
import { Request as ExpressRequest, Response as ExpressResponse } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import User from '../models/User';
import { sendEmail } from '../services/emailService';
import admin from '../config/firebaseAdmin';

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

  if (!user) {
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


// @desc    Authenticate with Firebase ID Token
// @route   POST /api/auth/firebase
// @access  Public
export const firebaseLogin = async (req: any, res: any) => {
  const { token } = req.body;

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    if (!decodedToken.email_verified) {
      return res.status(403).json({ message: 'Please verify your email address to continue.' });
    }

    let user = await User.findOne({ email: decodedToken.email });

    // Create shadow user if first time
    if (!user) {
      user = await User.create({
        name: decodedToken.name || decodedToken.email?.split('@')[0],
        email: decodedToken.email,
        password: crypto.randomBytes(16).toString('hex'), // Random password for shadow user
        isVerified: true,
        authProvider: decodedToken.firebase.sign_in_provider
      });
    } else {
      // Ensure shadow user is marked verified if they are now verified in Firebase
      if (!user.isVerified) {
        user.isVerified = true;
        await user.save();
      }
    }

    res.json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      token: generateToken(user._id.toString()),
    });

  } catch (error) {
    console.error("Firebase Login Error", error);
    res.status(401).json({ message: 'Invalid or expired token' });
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
  }
};

// @desc    Delete user account (MongoDB + Firebase)
// @route   DELETE /api/auth/me
// @access  Private
export const deleteAccount = async (req: any, res: any) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // 1. Delete from MongoDB
    await User.deleteOne({ _id: user._id });

    // 2. Optionally delete from Firebase (if we have the UID stored or can look up by email)
    try {
      const firebaseUser = await admin.auth().getUserByEmail(user.email);
      await admin.auth().deleteUser(firebaseUser.uid);
    } catch (fbError) {
      console.error("Firebase deletion error (user might not exist in Firebase):", fbError);
    }

    res.json({ message: 'Account deleted successfully' });

  } catch (error) {
    console.error("Delete Account Error:", error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getUserProfile = async (req: any, res: any) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email
  };
  res.status(200).json(user);
};
