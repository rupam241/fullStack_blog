import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment=async(req,res,next)=>{

    try {
        const{content,postId,userId}=req.body;
        if(userId!==req.user.id){
            return next(errorHandler(403,"you are not allowed to comment"))

        }

        const newComment= new Comment({
            content,
            postId,
            userId
        })
        await newComment.save()   
        res.status(200).json({
            message:"commented",
            data:newComment
        })
    } catch (error) {
        next(error)
    }

}

export const getComment = async (req, res, next) => {
    try {
        // Ensure that postId is provided in the URL
        const postId = req.params.postId;
        if (!postId) {
            return res.status(400).json({ message: "postId is required" });
        }

        // Fetch comments for the given postId and sort them by createdAt in descending order
        const comments = await Comment.find({ postId: postId }).sort({
            createdAt: -1,
        });

        // Check if comments were found
        if (comments.length === 0) {
            return res.status(404).json({ message: "No comments found for this post" });
        }

        // Send the comments as a response
        res.status(200).json(comments);
    } catch (error) {
        next(error); // Pass any error to the error-handling middleware
    }
};
