import React, { useEffect, useState } from "react";
import { FaThumbsUp } from "react-icons/fa";
import { useSelector } from "react-redux";

function Comment({ comment, onLike,onEdit }) {
  const [user, setUser] = useState(null); // State to store user data, initialized as null
  const [error, setError] = useState(null); // State for error handling
  const { currentuser } = useSelector((state) => state.user);

  useEffect(() => {
    const getUser = async () => {
      try {
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

  // Handle the case when user data is still loading
  if (user === null && !error) {
    return <p>Loading user data...</p>; // Show loading state while user data is being fetched
  }

  // Handle error state
  if (error) {
    return <p className="text-red-500">{error}</p>; // Show error message if fetch fails
  }

  // Handle case when user data is missing
  if (!user) {
    return <p>User data not available.</p>;
  }

  // Calculate the time the comment was created (HH:MM format)
  const createDate = new Date(comment.createdAt);
  const hours = createDate.getHours().toString().padStart(2, "0"); // Add leading zero if hour is single digit
  const minutes = createDate.getMinutes().toString().padStart(2, "0"); // Add leading zero if minute is single digit
  const time = `${hours}:${minutes}`;


 
console.log(comment);


  return (
    <div className="flex p-4 border-b  text-sm">
      <div className="flex-shrink-0 mr-3">
        <img
          src={user.profilePicture}
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
        <p>{comment.content}</p>
        <div className="flex items-center pt-2 text-xs border-t max-w-fit gap-2">
          <button
            type="button"
            className={`text-gray-500 hover:text-blue-500 ${
              currentuser &&
              comment.likes.includes(currentuser._id) &&
              "!text-blue-500"
            }`}
            onClick={() => {
              onLike(comment._id);
            }}
          >
            <FaThumbsUp className="text-sm" />
          </button>
          <span>{comment.numberOfLikes}Likes</span>
          <span onClick={()=>onEdit(comment._id,comment.userId)}>edit</span>
        </div>
      </div>
    </div>
  );
}

export default Comment;
