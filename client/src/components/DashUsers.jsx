import React, { useEffect, useState } from "react";
import { Table } from "flowbite-react";
import { useSelector } from "react-redux";

function DashUsers() {
  const [userData, setUserData] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { currentuser } = useSelector((state) => state.user);

  const getUserData = async () => {
    try {
      const res = await fetch("/api/user/getUsers");
      const data = await res.json();
      if (res.ok) {
        setUserData(data); // Assuming `data` contains the response object with `data` array
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    getUserData();
  }, []);

  // Ensure that userData is not null before accessing userData.data
  const users = userData ? userData.data : [];

  const handleDeleteClick = (userId) => {
    setShowModal(true);
    // Store the userId in state to use for deletion
    setUserIdToDelete(userId);
  };

  const deleteUser = async () => {
    try {
      const res = await fetch(`/api/user/deleteUser/${userIdToDelete}`, {
        method: "DELETE",
      });
      if (res.ok) {
        // Remove the deleted user from the state
        setUserData((prevData) =>
          prevData.filter((user) => user._id !== userIdToDelete)
        );
        setShowModal(false);
      } else {
        console.error("Error deleting user");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="table-auto overflow-x-scroll md:mx-auto p-5 scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300">
      {users.length > 0 ? (
        <Table hoverable className="shadow-md mt-2 ml-5">
          <Table.Head>
            <Table.HeadCell>DATE CREATED</Table.HeadCell>
            <Table.HeadCell>USER IMAGE</Table.HeadCell>
            <Table.HeadCell>USERNAME</Table.HeadCell>
            <Table.HeadCell>EMAIL</Table.HeadCell>
            <Table.HeadCell>ADMIN</Table.HeadCell>
            <Table.HeadCell>DELETE</Table.HeadCell>
          </Table.Head>
          <Table.Body>
            {users.map((user) => (
              <Table.Row key={user._id}>
                <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>
                  <img
                    src={user.profilePicture}
                    alt={`${user.username}'s profile`}
                    className="h-10 w-10 rounded-full"
                  />
                </Table.Cell>
                <Table.Cell>{user.username}</Table.Cell>
                <Table.Cell>{user.email}</Table.Cell>
                <Table.Cell>
                  <span>{user.isAdmin ? "Yes" : "No"}</span>
                </Table.Cell>
                <Table.Cell>
                  <button
                    className="text-red-500 hover:underline"
                    onClick={() => handleDeleteClick(user._id)}
                  >
                    Delete
                  </button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p>No users to show</p>
      )}

      {/* Modal for confirmation */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Are you sure?
            </h2>
            <p className="text-gray-500 mb-6 text-center">
              Do you really want to delete this user? This action is irreversible.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={deleteUser}
                className="px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setShowModal(false)}
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

export default DashUsers;
