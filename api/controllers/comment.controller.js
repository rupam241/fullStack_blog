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
        res.status(200).json({
            message:"comments get successfully",
            data:comments
        });
    } catch (error) {
        next(error); // Pass any error to the error-handling middleware
    }
};


export const likeComment=async(req,res,next)=>{
 try {
    const comment=await Comment.findById(req.params.commentId);
    if(!comment){
        return next(errorHandler(400,"no comments found"))
    }
    const userIndex=comment.likes.indexOf(req.user.id);
    if(userIndex===-1){
        comment.numberOfLikes+=1;
        comment.likes.push(req.user.id);
        
    }
    else{
        comment.numberOfLikes-=1;
        comment.likes.splice(userIndex,1)
    }
    await comment.save()
    res.status(200).json(comment)
 } catch (error) {
    next(error)
 }
}



export const editComment = async (req, res, next) => {
  try {
    // Check if the user is authorized to edit the comment
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
      return next(errorHandler(403, "You are not authorized to edit the comment"));
    }

    // Find and update the comment
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.commentId, // Assuming commentId is passed as a route parameter
      req.body,             // Fields to update
      { new: true }         // Return the updated document
    );

    // Handle the case where the comment is not found
    if (!updatedComment) {
      return next(errorHandler(404, "Comment not found"));
    }

    // Send a successful response
    res.status(200).json({
      message: "Comment updated successfully",
      data: updatedComment, // Return the updated comment data
    });
  } catch (error) {
    // Handle any errors that occur during the process
    next(errorHandler(500, "An error occurred while updating the comment"));
  }
};
