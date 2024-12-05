import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import {
  HiAnnotation,
  HiArrowNarrowUp,
  HiDocumentText,
  HiOutlineUserGroup,
} from "react-icons/hi";
import { Link } from "react-router-dom";

function DashBoardData() {
  const [user, setUser] = useState([]);
  const [posts, setposts] = useState([]);
  const [comments, setcomments] = useState([]);
  const [totalUser, setTotalUser] = useState(0);
  const [totalPosts, setTotalposts] = useState(0);
  const [totalComments, setTotalComments] = useState(0);
  const [lastMonthsUser, setlastMonthsUser] = useState(0);
  const [lastMonthsComments, setlastMonthsComments] = useState(0);
  const [lastMonthsPosts, setlastMonthsPosts] = useState(0);
  const { currentuser } = useSelector((state) => state.user);
  console.log(
    user,
    comments,
    posts,
    totalPosts,
    totalComments,
    totalUser,
    lastMonthsComments,
    lastMonthsUser,
    lastMonthsPosts
  );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/user/getUsers?limit=5");
        if (res.ok) {
          const data = await res.json();
          setUser(data.data);
          setTotalUser(data.totalUsers);
          setlastMonthsUser(data.lastMonthUsers);
        }
      } catch (error) {
        console.log(error);
      }
    };
    const fetchComments = async () => {
      try {
        const res = await fetch("/api/comment/getDashComment?limit=5");
        if (res.ok) {
          const data = await res.json();
          setcomments(data.comments);
          setlastMonthsComments(data.lastMonthsComment);
          setTotalComments(data.totalComments);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPosts = async () => {
      try {
        const res = await fetch("/api/posts/get-post?limit=5");
        if (res.ok) {
          const data = await res.json();
          setposts(data.posts);
          setTotalposts(data.totalPosts);
          setlastMonthsPosts(data.lastMonthsPost);
        }
      } catch (error) {
        console.log(error);
      }
    };

    if (currentuser.isAdmin) {
      fetchComments();
      fetchPosts();
      fetchUsers();
    }
  }, [currentuser]);

  return (
    <div className="p-3 md:mx-auto">
    <div className="flex-wrap flex gap-4 justify-center">
      {/* Total Users Card */}
      <div className="flex flex-col p-3 gap-4 md:w-72 w-full rounded-md shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
        <div className="flex justify-between p-2">
          <div className="">
            <h3 className="text-gray-500 text-md uppercase">Total Users</h3>
            <p className="text-2xl">{totalUser}</p>
          </div>
          <HiOutlineUserGroup className="bg-teal-600 text-white rounded-full text-5xl p-3 shadow-lg" />
        </div>
        <div className="flex gap-2 text-sm">
          <span className="text-green-500 flex items-center">
            <HiArrowNarrowUp />
            {lastMonthsUser}
          </span>
          <div className="text-gray-500">Last month</div>
        </div>
      </div>
  
      {/* Total Comments Card */}
      <div className="flex flex-col p-3 gap-4 md:w-72 w-full rounded-md shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
        <div className="flex justify-between">
          <div className="">
            <h3 className="text-gray-500 text-md uppercase">Total Comments</h3>
            <p className="text-2xl">{totalComments}</p>
          </div>
          <HiAnnotation className="bg-indigo-600 text-white rounded-full text-5xl p-3 shadow-lg" />
        </div>
        <div className="flex gap-2 text-sm">
          <span className="text-green-500 flex items-center">
            <HiArrowNarrowUp />
            {lastMonthsComments}
          </span>
          <div className="text-gray-500">Last month</div>
        </div>
      </div>
  
      {/* Total Posts Card */}
      <div className="flex flex-col p-3 gap-4 md:w-72 w-full rounded-md shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
        <div className="flex justify-between">
          <div className="">
            <h3 className="text-gray-500 text-md uppercase">Total Posts</h3>
            <p className="text-2xl">{totalPosts}</p>
          </div>
          <HiDocumentText className="bg-lime-600 text-white rounded-full text-5xl p-3 shadow-lg" />
        </div>
        <div className="flex gap-2 text-sm">
          <span className="text-green-500 flex items-center">
            <HiArrowNarrowUp />
            {lastMonthsPosts}
          </span>
          <div className="text-gray-500">Last month</div>
        </div>
      </div>
    </div>
  
    {/* Recent Users, Comments, and Posts Cards */}
    <div className="flex flex-wrap gap-4 py-3 mx-auto justify-center">
      {/* Recent Users Card */}
      <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md transition-transform transform hover:scale-105 hover:shadow-lg">
        <div className="flex justify-between p-3 text-sm font-semibold">
          <h1 className="text-center p-2">Recent users</h1>
          <button className="text-sm text-purple-600 hover:text-purple-800">
            <Link to={"/dashboard?tab=users"}>See all</Link>
          </button>
        </div>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">User image</th>
              <th className="py-2 px-4">Username</th>
            </tr>
          </thead>
          <tbody>
            {user &&
              user.map((user) => (
                <tr key={user._id} className="bg-white">
                  <td className="py-2 px-4">
                    <img
                      src={user.profilePicture}
                      alt="user"
                      className="w-10 h-10 rounded-full bg-gray-500"
                    />
                  </td>
                  <td className="py-2 px-4">{user.username}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
  
      {/* Recent Comments Card */}
      <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md transition-transform transform hover:scale-105 hover:shadow-lg">
        <div className="flex justify-between p-3 text-sm font-semibold">
          <h1 className="text-center p-2">Recent comments</h1>
          <button className="text-sm text-purple-600 hover:text-purple-800">
            <Link to={"/dashboard?tab=comments"}>See all</Link>
          </button>
        </div>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">Comment content</th>
              <th className="py-2 px-4">Likes</th>
            </tr>
          </thead>
          <tbody>
            {comments &&
              comments.map((comment) => (
                <tr key={comment._id} className="bg-white">
                  <td className="py-2 px-4">
                    <p className="line-clamp-2">{comment.content}</p>
                  </td>
                  <td className="py-2 px-4">{comment.numberOfLikes}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
  
      {/* Recent Posts Card */}
      <div className="flex flex-col w-full md:w-auto shadow-md p-2 rounded-md transition-transform transform hover:scale-105 hover:shadow-lg">
        <div className="flex justify-between p-3 text-sm font-semibold">
          <h1 className="text-center p-2">Recent posts</h1>
          <button className="text-sm text-purple-600 hover:text-purple-800">
            <Link to={"/dashboard?tab=posts"}>See all</Link>
          </button>
        </div>
        <table className="table-auto w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4">Post image</th>
              <th className="py-2 px-4">Post title</th>
              <th className="py-2 px-4">Post content</th>
            </tr>
          </thead>
          <tbody>
            {posts &&
              posts.map((post) => (
                <tr key={post._id} className="bg-white">
                  <td className="py-2 px-4">
                    <img
                      src={post.imageUrl}
                      alt=""
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  </td>
                  <td className="py-2 px-4">{post.title}</td>
                  <td
                    className="py-2 px-4"
                    dangerouslySetInnerHTML={{
                      __html: post.content.slice(0, 40),
                    }}
                  />
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  </div>
  


  );
}

export default DashBoardData;
