import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Button, Table } from "flowbite-react";
import { Link } from "react-router-dom";

function DashPosts() {
  const { currentuser } = useSelector((state) => state.user);
  const [userPosts, setUserPosts] = useState([]);
  const [showMore, setShowMore] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(
          `/api/posts/get-post?userId=${currentuser._id}`
        );
        const data = await res.json();

        if (res.ok) {
          setUserPosts(data.posts);
          // If there are fewer than 9 posts, hide the "Show More" button
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

  const handleSUbmitMore=async()=>{
    const startIndex=userPosts.length;
    try {
      const res=await fetch( `/api/posts/get-post?userId=${currentuser._id}&startIndex=${startIndex}`)
      const data=  await res.json();
      console.log(data)
      if(res.ok){
        setUserPosts((prev)=>[...prev,...data.posts])
        if(data.posts.length<9){
          setShowMore(false);
        }

      }
    } catch (error) {
      console.log(error.message);
      
    }

  }

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
          <Table.Body className="mt-20">
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
                    <span className="font-medium text-red-500 hover:underline cursor-pointer">
                      Delete
                    </span>
                  </Table.Cell>
                  <Table.Cell>
                    <Link
                      to={`/update-post/${post._id}`}
                      className="text-teal-500 hover:underline"
                    >
                      <span>Edit</span>
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
          className="w-full text-teal-500 self-center mt-4 border-2 p-3 mx-auto" // Added mx-auto for horizontal centering
          onClick={handleSUbmitMore} // Handle show more logic here
        >
          Show More
        </button>
      )}
    </div>
  );
}

export default DashPosts;
