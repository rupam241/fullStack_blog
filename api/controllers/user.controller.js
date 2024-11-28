import user from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from 'bcrypt';

export const updateUser = async (req, res, next) => {

 

    // Check if the authenticated user is the same as the user being updated
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, "You are not allowed"));
    }

    // Validate password length if provided
    if (req.body.password && req.body.password.length < 6) {
        return next(errorHandler(400, "Password must be at least 6 characters"));
    }

    // Validate username if provided
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, "Username must be between 7 and 20 characters"));
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, "Username cannot contain spaces"));
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, "Username must be lowercase"));
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, "Username can only contain letters and numbers"));
        }
    }

    try {
        // Hash password if it's being updated
        if (req.body.password) {
            req.body.password = bcrypt.hashSync(req.body.password, 10);
        }

        // Update the user in the database and return the updated user (excluding password)
        const updatedUser = await user.findByIdAndUpdate(
            req.params.userId,
            {
                $set: {
                    username: req.body.username || undefined,
                    email: req.body.email || undefined,
                    profilePicture: req.body.profilePicture || undefined,
                    password: req.body.password || undefined,
                },
            },
            { new: true }
        );

        // Remove password field from response
        const { password, ...rest } = updatedUser._doc;
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};
