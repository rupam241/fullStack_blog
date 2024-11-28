import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from "./routes/auth.route.js";
import imageFileRoutes from "./routes/files.route.js"
import cookieParser from 'cookie-parser';


import cors from 'cors';

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());
app.use(cookieParser())


// Ensure that you are using process.env.MONGODB_URI
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB!");

        // Start the server only after a successful connection
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((error) => {
        console.error("Connection error:", error);
        process.exit(1); // Exit process if unable to connect to MongoDB
    });

// Route middleware
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/auth',authRoutes);
app.use('/api/files',imageFileRoutes)







// Error-handling middleware
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    });
});
