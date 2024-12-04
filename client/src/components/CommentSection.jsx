import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Alert } from "flowbite-react";
import Comment from "./CommentComponent";

function CommentSection({ postId }) {
  const navigate = useNavigate();
  const { currentuser } = useSelector((state) => state.user);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]); // Initialize as an array
  const [commentError, setCommentError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); // To track loading state
  const [isLoading, setIsLoading] = useState(true); // To track loading of user data

  const handleCommentSubmit = async (e) => {
    e.preventDefault();

    // Ensure comment length does not exceed 200 characters
    if (comment.length > 200) {
      setCommentError("Comment cannot exceed 200 characters.");
      return;
    }

    try {
      setIsSubmitting(true); // Start loading
      const res = await fetch("/api/comment/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: comment,
          postId,
          userId: currentuser._id,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setComment(""); // Clear the comment input on successful submission
        setCommentError(null); // Reset any previous errors
        setComments([data, ...comments]); // Prepend the new comment to the state
      } else {
        setCommentError(data.message || "Failed to post the comment.");
      }
    } catch (error) {
      setCommentError(
        error.message || "An error occurred while submitting your comment."
      );
    } finally {
      setIsSubmitting(false); // End loading
    }
  };

  useEffect(() => {
    // Fetch user data only once, then stop loading
    if (currentuser) {
      setIsLoading(false); // Set loading to false once the currentuser is loaded
    }
  }, [currentuser]);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const res = await fetch(`/api/comment/get-comment/${postId}`);
        if (res.ok) {
          const data = await res.json();
          if (data && data.data && Array.isArray(data.data)) {
            setComments(data.data); // Set valid comment data
          } else {
            console.error("Invalid comment data:", data);
          }
        } else {
          console.error("Failed to fetch comments");
        }
      } catch (error) {
        console.error("Error fetching comments:", error.message);
      }
    };
    fetchComments();
  }, [comment]);

  const handleLike = async (commentId) => {
    try {
      if (!currentuser) {
        navigate("/signin");
      }

      const res = await fetch(`/api/comment/likeComment/${commentId}`, {
        method: "PUT",
      });

      if (res.ok) {
        const data = await res.json();

        setComments(
          comments.map((comment) =>
            comment._id === commentId
              ? {
                  ...comment,
                  likes: data.likes,
                  numberOfLikes: data.likes.length,
                }
              : comment
          )
        );
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="max-w-2xl mx-auto w-full p-3">
      {isLoading ? (
        <p>Loading user data...</p>
      ) : currentuser ? (
        <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
          <p>Sign in as :</p>
          <img
            src={currentuser.profilePicture}
            alt="User"
            className="h-5 w-5 object-cover rounded-full"
          />
          <Link
            to="/dashboard?tab=profile"
            className="text-xs text-cyan-500 hover:underline"
          >
            @{currentuser.username}
          </Link>
        </div>
      ) : (
        <div className="text-sm text-teal-500 my-5 flex gap-1">
          You must be logged in to comment{" "}
          <Link to="/signin" className="text-xs text-blue-500 hover:underline">
            Sign in
          </Link>
        </div>
      )}

      {currentuser && (
        <form
          className="border border-teal-500 rounded-md p-3"
          onSubmit={handleCommentSubmit}
        >
          <textarea
            placeholder="Add your comment here"
            rows="3"
            maxLength="200"
            style={{
              width: "100%",
              fontSize: "18px",
              padding: "10px",
              borderRadius: "5px",
              border: "1px solid #ccc",
              resize: "none",
            }}
            onChange={(e) => setComment(e.target.value)}
            value={comment} // Bind the textarea to state
          />

          <div className="flex justify-between items-center mt-5">
            <p className="text-gray-500 text-xs">
              {200 - comment.length} characters remaining
            </p>
            <button
              type="submit"
              disabled={isSubmitting || comment.length === 0} // Disable button when submitting or comment is empty
              style={{
                color: "black",
                background: "linear-gradient(to right, purple, blue)",
                border: "1px solid black",
                padding: "10px 20px",
                borderRadius: "5px",
                cursor:
                  isSubmitting || comment.length === 0
                    ? "not-allowed"
                    : "pointer",
              }}
            >
              {isSubmitting ? "Submitting..." : "Submit"}
            </button>
          </div>
        </form>
      )}

      {commentError && (
        <Alert color="failure" className="mt-5">
          {commentError}
        </Alert>
      )}

      {comments.length === 0 ? (
        <p className="text-sm my-5">No comments yet!</p>
      ) : (
        <>
          <div className="text-sm my-5 flex items-center gap-1">
            <p>Comments</p>
            <div className="border border-gray-400 py-1 px-2 rounded-s-md">
              {comments.length}
            </div>
          </div>
          {comments.map((comment, index) => {
            if (!comment) return null; // Skip undefined comments
            return (
              <Comment
                key={comment._id || index}
                comment={comment}
                onLike={handleLike}
              />
            );
          })}
        </>
      )}
    </div>
  );
}

export default CommentSection;
