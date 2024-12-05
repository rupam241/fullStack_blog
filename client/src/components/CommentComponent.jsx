import { Textarea, Button } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

function Comment({ comment, onLike, onEdit,onDelete }) {
  const [user, setUser] = useState(null); // State to store user data
  const [error, setError] = useState(null); // State for error handling
  const [isEdit, setIsEdit] = useState(false); // State for edit mode
  const [editedComment, setEditedComments] = useState("");
  const [isdelete, setisDelete] = useState(false); // State for updating comment content
  const { currentuser } = useSelector((state) => state.user);

  // Fetch user data
  useEffect(() => {
    const getUser = async () => {
      try {
        setError(null); // Reset error state
        const res = await fetch(`/api/user/${comment.userId}`);
        if (res.ok) {
          const data = await res.json();
          setUser(data); // Set the fetched user data
        } else {
          setError("Failed to fetch user data.");
        }
      } catch (error) {
        setError("An error occurred while fetching user data.");
      }
    };

    if (comment.userId) {
      getUser(); // Fetch user data only if userId exists
    }
  }, [comment]);

  // Handle the time the comment was created (HH:MM format)
  const createDate = new Date(comment.createdAt);
  const time = `${createDate
    .getHours()
    .toString()
    .padStart(2, "0")}:${createDate.getMinutes().toString().padStart(2, "0")}`;

  // Enter edit mode
  const handleEdit = () => {
    setEditedComments(comment.content); // Initialize with current comment content
    setIsEdit(true);
  };

  // Handle the case when user data is still loading
  if (user === null && !error) {
    return <p>Loading user data...</p>;
  }

  // Handle error state
  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  // Handle missing user data
  if (!user) {
    return <p>User data not available.</p>;
  }
  const hadleSave = async () => {
    try {
      const res = await fetch(
        `/api/comment/editComment/${comment._id}/${comment.userId}`,
        {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            content: editedComment,
          }),
        }
      );
      if (res.ok) {
        setIsEdit(false);
        onEdit(comment, editedComment);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleDelete=async()=>{
         try {
          const res=await fetch(`/api/comment/deleteComment/${comment._id}/${comment.userId}`,{
            method:"DELETE"
          })
         if(res.ok){
          setisDelete(false);
          onDelete(comment);

         }
         } catch (error) {
          console.log(error.message)
         }
  }
  return (
    <div className="flex p-4 border-b text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user.profilePicture || "/path/to/default/profile.jpg"}
          alt={user.username}
          className="w-10 h-10 rounded-full bg-gray-200"
        />
      </div>
      <div className="flex-1">
        <div className="flex items-center mb-1">
          <span className="font-bold mr-1 text-xs truncate">
            {user ? `@${user.username}` : "anonymous user"}
          </span>
          <span className="text-gray-500 text-xs">{time}</span>
        </div>
        {isEdit ? (
          <div>
            <input
              className="w-full h-16 p-2 border outline-none rounded-md border-blue-600 text-[16px] font-serif "
              value={editedComment}
              onChange={(e) => setEditedComments(e.target.value)}
            />
            <div className="flex gap-2 mt-1 justify-end ">
              <button
                type="button"
                className="bg-blue-400 py-1 px-2 text-white font-semibold rounded-md hover:bg-red-500 text-sm"
                onClick={hadleSave}
              >
                Save
              </button>
              <button
                type="button"
                className="font-semibold"
                onClick={() => setIsEdit(false)}
              >
                cancel
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p>{comment.content}</p>
            <div className="flex items-center pt-2 text-xs border-t max-w-fit gap-2">
              <button
                type="button"
                className={`text-gray-500 hover:text-blue-500 ${
                  currentuser &&
                  comment.likes.includes(currentuser._id) &&
                  "!text-blue-500"
                }`}
                onClick={() => onLike(comment._id)}
              >
                <FaThumbsUp className="text-sm" />
              </button>
              <span>{comment.numberOfLikes} Likes</span>
              {currentuser &&
                (currentuser._id === comment.userId || currentuser.isAdmin) && (
                  <>
                    <span
                      onClick={handleEdit}
                      className="text-gray-500 hover:text-blue-500 cursor-pointer"
                    >
                      Edit
                    </span>
                    <span
                      className="text-gray-500 hover:text-red-500 cursor-pointer"
                      onClick={()=>setisDelete(true)}
                    >
                      Delete
                    </span>
                  </>
                )}
            </div>
          </div>
        )}
      </div>

      {/* //show modal */}

      {isdelete?( <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Are you sure?
            </h2>
            <p className="text-gray-500 mb-6 text-center">
              Do you really want to delete this post? This action is
              irreversible.
            </p>
            <div className="flex justify-center gap-4">
              <button
                
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={handleDelete}
              >
                Yes, Delete
              </button>
              <button
                
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                onClick={()=>setisDelete(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>):null}
    </div>
  );
}

export default Comment;
