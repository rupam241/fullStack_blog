import user from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";
import bcrypt from "bcrypt";

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }
  if (req.body.password) {
    if (req.body.password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }
    req.body.password = bcrypt.hashSync(req.body.password, 10);
  }
  if (req.body.username) {
    if (req.body.username.length < 7 || req.body.username.length > 20) {
      return next(
        errorHandler(400, "Username must be between 7 and 20 characters")
      );
    }
    if (req.body.username.includes(" ")) {
      return next(errorHandler(400, "Username cannot contain spaces"));
    }
    if (req.body.username !== req.body.username.toLowerCase()) {
      return next(errorHandler(400, "Username must be lowercase"));
    }
    if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
      return next(
        errorHandler(400, "Username can only contain letters and numbers")
      );
    }
  }
  try {
    const updatedUser = await user.findByIdAndUpdate(
      req.params.userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          profilePicture: req.body.profilePicture,
          password: req.body.password,
        },
      },
      { new: true }
    );
    const { password, ...rest } = updatedUser._doc;
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this user"));
  }

  try {
    await user.findByIdAndDelete(req.params.userId);
    res.status(200).json({ message: "user delete succefully" });
  } catch (error) {}
};

export const signoutUser = async (req, res, next) => {
  try {
    // Authorization check
    if (req.user.id !== req.params.userId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to update this user" });
    }

    // Find the user by ID
    const userMatch = await user.findById(req.params.userId);
    if (!userMatch) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete cookie
    res.clearCookie("access_token", { httpOnly: true, secure: true });

    // Optional: Additional logout logic (if needed)
    // user.isLoggedIn = false;
    // await user.save();

    return res.status(200).json({ message: "Successfully signed out" });
  } catch (error) {
    // Error handling
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

export const getUser = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(400, "You are not authorized to view this"));
  }

  const { limit = 10, sortDir = 'asc', startIndex = 0 } = req.query; // Default values if not provided

  try {
    // Calculate the date for one month ago
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);

    // Count total users
    const totalUsers = await user.countDocuments();

    // Count users created in the last month
    const lastMonthUsers = await user.countDocuments({
      createdAt: { $gte: oneMonthAgo }
    });

    // Fetch paginated and sorted user data
    const users = await user.find()
      .skip(parseInt(startIndex))  // Skip the records before the start index
      .limit(parseInt(limit))     // Limit the number of records to 'limit'
      .sort({ createdAt: sortDir === 'desc' ? -1 : 1 });  // Sort by createdAt field, 'desc' or 'asc'

    if (users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    res.status(200).json({
      success: true,
      data: users,
      totalUsers,             // Total number of users
      lastMonthUsers,         // Users created in the last month
    });
  } catch (error) {
    next(error);
  }
};


// comment section

export const getUsers = async (req, res, next) => {
  try {
    // Fetch user by ID
    const userData = await user.findById(req.params.userId);
    if (!userData) {
      return next(errorHandler(404, "User not found")); // Pass error to middleware
    }

    // Exclude sensitive data (like password) before sending the response
    const { password, ...rest } = userData._doc;

    res.status(200).json(rest); // Send filtered user data
  } catch (error) {
    // Handle any other errors
    return next(
      errorHandler(500, "An error occurred while fetching the user.")
    );
  }
};
