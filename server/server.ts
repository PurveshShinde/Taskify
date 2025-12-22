import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import taskRoutes from './routes/taskRoutes';
import teamRoutes from './routes/teamRoutes';
import projectRoutes from './routes/projectRoutes';
import userRoutes from './routes/userRoutes';
import { startCronJobs } from './services/cronService';

dotenv.config();

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
        callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json() as any);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/teams', teamRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

// Start Background Jobs
startCronJobs();

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((err) => {
    console.error("Failed to connect to DB", err);
    process.exit(1);
});
