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

        await user.findByIdAndDelete(req.params.userId)
        res.status(200).json({message:"user delete succefully"})
        
      } catch (error) {
        
      }

};


export const signoutUser = async (req, res, next) => {
  try {
    // Authorization check
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: "You are not allowed to update this user" });
    }

    // Find the user by ID
    const userMatch = await user.findById(req.params.userId);
    if (!userMatch) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete cookie
    res.clearCookie('access_token', { httpOnly: true, secure: true });

    // Optional: Additional logout logic (if needed)
    // user.isLoggedIn = false;
    // await user.save();

    return res.status(200).json({ message: "Successfully signed out" });
  } catch (error) {
    // Error handling
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
};


export const getUser=async(req,res,next)=>{

  if(!req.user.isAdmin ){
    next(errorHandler(400,"you are not authorized to view "))
  }
  try {
    const getUserData=await user.find();

  
    
    if(( getUserData).length===0){
      return res.status(404).json({ message: 'No users found'})
    }

    res.status(200).json({
      success: true,
      data: getUserData,
    });
  } catch (error) {
    next(error)
  }

  

}