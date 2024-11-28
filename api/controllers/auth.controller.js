import user from "../models/user.model.js";
import bcrypt from 'bcrypt';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

    // Validate the input fields
    if (!username || !email || !password || username === "" || email === "" || password === "") {
        return next(errorHandler(400, "All fields are required"));
    }

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user instance with the hashed password
        const newUser = new user({ username, email, password: hashedPassword });

        // Save the user to the database
        await newUser.save();
        res.json({ message: "User registered successfully" });
    } catch (error) {
        next(error); // Pass the error to the error-handling middleware
    }
};

export const signin = async (req, res, next) => {
    const { email, password } = req.body;

    // Validate the input fields
    if (!email || !password || email === "" || password === "") {
        return next(errorHandler(400, "All fields are required"));
    }

    try {
        const validUser = await user.findOne({ email });
        if (!validUser) {
            return next(errorHandler(401, "User not found"));
        }

        const validPassword = bcrypt.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(401, "Invalid password"));
        }

        const token = jwt.sign(
            { id: validUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Optional expiry time
        );

        const { password: pass, ...rest } = validUser._doc;

        res.status(200).cookie('access_token', token, {
            httpOnly: true,
        }).json(rest);
    } catch (error) {
        next(error);
    }
};



export const google = async (req, res, next) => {
    const { displayName, email, photoURL } = req.body;
    try {
        // Check if the user already exists
        const existingUser = await user.findOne({ email });
        
        if (existingUser) {
            // Generate JWT token for existing user
            const token = jwt.sign(
                { id: existingUser._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            const { password, ...rest } = existingUser._doc;
            
            // Send response with token in HTTP-only cookie
            return res
                .status(200)
                .cookie('access_token', token, { httpOnly: true })
                .json(rest);
        } else {
            // Generate a random password and hash it
            const generatedPassword = Math.random().toString(36).slice(-8);
            const hashedPassword = await bcrypt.hash(generatedPassword, 10);

            // Create a unique username
            const generatedUsername = displayName.toLowerCase().replace(/\s/g, '') + Math.random().toString().slice(2, 6);

            // Create new user with hashed password
            const newUser = new user({
                email,
                username: generatedUsername,
                password: hashedPassword,
                profilePicture: photoURL,
            });
            
            await newUser.save();

            // Generate JWT for the new user
            const token = jwt.sign(
                { id: newUser._id },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );
            const { password, ...rest } = newUser._doc;

            // Send response with token in HTTP-only cookie
            return res
                .status(200)
                .cookie('access_token', token, { httpOnly: true })
                .json(rest);
        }
    } catch (error) {
        next(error);
    }
};
export const logout = async (req, res, next) => {
    try {
        // Clear the access_token cookie
        res.clearCookie('access_token', { httpOnly: true }).status(200).json({
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error); // Pass the error to the middleware
    }
};