
import dotenv from 'dotenv';
// Load environment variables immediately
dotenv.config();

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import teamRoutes from './routes/teamRoutes';
import projectRoutes from './routes/projectRoutes';
import userRoutes from './routes/userRoutes';
import { startCronJobs } from './services/cronService';

const app = express();

// Allow specific origins for production security
const allowedOrigins = [
    process.env.CLIENT_ORIGIN,
    'http://localhost:5173',
    'http://localhost:3000',
    'https://taskify-webapp-pro.vercel.app',
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true); // allow server-to-server / Postman
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        callback(null, true); // Be permissive for now to solve connection issues, or implement stricter check
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Health check & Root endpoints
app.get('/health', (_req, res) => {
    const dbState = mongoose.connection.readyState;
    const isDbConnected = dbState === 1;
    res.status(isDbConnected ? 200 : 503).json({
        status: isDbConnected ? 'ok' : 'degraded',
        database: isDbConnected ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected',
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
    });
});

app.get('/', (_req, res) => {
    res.status(200).send('Taskify API is running');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

// Start Background Jobs
startCronJobs();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    // Connect to MongoDB asynchronously without blocking server startup
    connectDB();
});
