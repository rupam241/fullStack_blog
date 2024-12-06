import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'node:path';

// Importing Routes
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import imageFileRoutes from './routes/files.route.js';
import postRouter from './routes/post.route.js';
import commentRouter from './routes/comment.route.js';

// Load environment variables from .env file
dotenv.config();
const __dirname = path.resolve();

// Initialize Express App
const app = express();

// Middleware
app.use(cors()); // Add necessary options for production
app.use(express.json());
app.use(cookieParser());

// MongoDB Connection
mongoose
    .connect(process.env.MONGODB_URI, )
    .then(() => {
        console.log('Connected to MongoDB!');
        app.listen(process.env.PORT || 3000, () => {
            console.log(`Server is running on port ${process.env.PORT || 3000}`);
        });
    })
    .catch((error) => {
        console.error('Connection error:', error);
        process.exit(1); // Exit process if unable to connect to MongoDB
    });

// Route Middleware
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/files', imageFileRoutes);
app.use('/api/posts', postRouter);
app.use('/api/comment', commentRouter);

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '/client/dist/index.html'));
});

// Error Handling Middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    res.status(statusCode).json({
        success: false,
        statusCode,
        message,
    });
});
