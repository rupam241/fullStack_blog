import React, { useEffect, useState } from "react";
import { Button, Table, TableBody } from "flowbite-react";

function DashComments() {
  const [dashcomment, setdashcomment] = useState([]);
  const [show, setShow] = useState(true);  // Initially show the "Show More" button
  const [showModal, setShowModal] = useState(false);
  const [deleteC, setDeleteC] = useState(null);

  const fetchComments = async () => {
    const res = await fetch("/api/comment/getDashComment");
    if (res.ok) {
      const data = await res.json();
      setdashcomment(data.comments);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleShow = async () => {
    const startIndex = dashcomment.length;
    console.log(startIndex);

    try {
      const res = await fetch(`/api/comment/getDashComment?startIndex=${startIndex}`);
      if (res.ok) {
        const data = await res.json();
        console.log(data);

        // Append the new comments to the existing ones
        setdashcomment((prev) => [...prev, ...data.comments]);

        // If there are fewer than 9 comments, hide the Show More button
        if (data.comments.length < 9) {
          setShow(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteComment = async ({ commentId, userId }) => {
    try {
      const res = await fetch(`/api/comment/getDashDeleteComment/${commentId}/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        const data = await res.json();
        console.log(data);
        
        // Close the modal and reset deleteC after deletion
        setShowModal(false);
        setDeleteC(null);

        // Optionally, remove the deleted comment from the UI
        setdashcomment(prev => prev.filter(com => com._id !== commentId));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-5 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300">
      <Table hoverable className="shadow-md mt-2 ml-5 ">
        <Table.Head>
          <Table.HeadCell>DATA UPDATED</Table.HeadCell>
          <Table.HeadCell>COMMENT CONTENT</Table.HeadCell>
          <Table.HeadCell>NUMBER OF LIKES</Table.HeadCell>
          <Table.HeadCell>POSTID</Table.HeadCell>
          <Table.HeadCell>DELETE</Table.HeadCell>
        </Table.Head>
        <Table.Body>
          {dashcomment.map((com) => {
            const updatedDate = new Date(com.updatedAt).toLocaleDateString();
            return (
              <Table.Row key={com._id}>
                <Table.Cell>{updatedDate}</Table.Cell>
                <Table.Cell className="truncate max-w-[200px]">{com.content}</Table.Cell>
                <Table.Cell>{com.numberOfLikes}</Table.Cell>
                <Table.Cell className="truncate max-w-[200px]">{com.postId}</Table.Cell>
                <Table.Cell className="text-red-500 hover:underline cursor-pointer" onClick={() => {
                  setShowModal(true);
                  setDeleteC(com);
                }}>
                  Delete
                </Table.Cell>
              </Table.Row>
            );
          })}
        </Table.Body>
      </Table>

      {show && (
        <button
          className="w-full text-teal-500 self-center mt-4 border-2 p-3 mx-auto"
          onClick={handleShow}
        >
          Show More
        </button>
      )}

      {/* Show modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Are you sure?
            </h2>
            <p className="text-gray-500 mb-6 text-center">
              Do you really want to delete this post? This action is irreversible.
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                onClick={() => handleDeleteComment({ commentId: deleteC._id, userId: deleteC.userId })}
              >
                Yes, Delete
              </button>
              <button
                className="px-6 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
                onClick={() => {
                  setShowModal(false);
                  setDeleteC(null);
                }}
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

export default DashComments;
