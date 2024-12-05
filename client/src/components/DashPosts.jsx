import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

function DashPosts() {
  const { currentuser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPost, setCurrentPost] = useState(null); // Store the post data to delete

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `/api/posts/get-post?userId=${currentuser._id}`
        );
        const data = await res.json();

        if (res.ok) {
          setUserPosts(data.posts);
          if (data.posts.length < 9) {
            setShowMore(false);
          }
        }
      } catch (error) {
        console.log(error.message);
      }
    };
    if (currentuser.isAdmin) {
      fetchPosts();
    }
  }, [currentuser._id]);

  const handleSubmitMore = async () => {
    const startIndex = userPosts.length;
    try {
      const res = await fetch(
        `/api/posts/get-post?userId=${currentuser._id}&startIndex=${startIndex}`
      );
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => [...prev, ...data.posts]);
        if (data.posts.length < 9) {
          setShowMore(false);
        }
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const deletePost = async ({ postId, userId }) => {
    try {
      const res = await fetch(`/api/posts/delete-post/${postId}/${userId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (res.ok) {
        setUserPosts((prev) => prev.filter((post) => post._id !== postId));
        setShowModal(false); // Close the modal
        setCurrentPost(null); // Clear the current post
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  const handleModalClose = () => {
    setShowModal(false);
    setCurrentPost(null); // Clear the current post when closing the modal
  };

  

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-5 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 ">
      {currentuser.isAdmin && userPosts.length > 0 ? (
        <Table hoverable className="shadow-md mt-2 ml-5 ">
          <Table.Head>
            <Table.HeadCell>Date updated</Table.HeadCell>
            <Table.HeadCell>Post Image</Table.HeadCell>
            <Table.HeadCell>Post Title</Table.HeadCell>
            <Table.HeadCell>Category</Table.HeadCell>
            <Table.HeadCell>Delete</Table.HeadCell>
            <Table.HeadCell>Edit</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {userPosts.map((post) => {
              const updatedDate = new Date(post.updatedAt).toLocaleDateString();
              return (
                <Table.Row key={post._id}>
                  <Table.Cell>{updatedDate}</Table.Cell>
                  <Table.Cell>
                    <Link to={`/post/${post.slug}`}>
                      <img
                        src={post.imageUrl}
                        alt=""
                        className="w-20 h-10 object-cover mt-5"
                      />
                    </Link>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/post/${post.slug}`}
                      className="font-medium text-gray-900 "
                    >
                      {post.title}
                    </Link>
                  </Table.Cell>
                  <Table.Cell>{post.category}</Table.Cell>
                  <Table.Cell>
                    <button
                      onClick={() => {
                        setShowModal(true);
                        setCurrentPost(post); // Set the post to be deleted
                      }}
                      className="text-red-500 hover:underline"
                    >
                      Delete
                    </button>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/update-post/${post._id}`}
                      className="text-teal-500 hover:underline"
                    >
                      Edit
                    </Link>
                  </Table.Cell>
                </Table.Row>
              );
            })}
          </Table.Body>
        </Table>
      ) : (
        <p>You have no posts</p>
      )}

      {/* Show More Button */}
      {showMore && (
        <button
          className="w-full text-teal-500 self-center mt-4 border-2 p-3 mx-auto"
          onClick={handleSubmitMore}
        >
          Show More
        </button>
      )}

      {/* Modal for confirmation */}
      {showModal && currentPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                onClick={() =>
                  deletePost({ postId: currentPost._id, userId: currentuser._id })
                }
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={handleModalClose}
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DashPosts;
