import { Button, Spinner } from "flowbite-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";
import Post from "../../../api/models/post.model";
import CallToAction from "../components/CallToAction";
import CommentSection from "../components/CommentSection";
import PostCart from "../components/PostCart";

function PostPage() {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [post, setPost] = useState();
  const [recentPosts, setRecentPosts] = useState([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/posts/get-post?slug=${postSlug}`);

        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
        }
        if (res.ok) {
          setPost(data.posts[0]);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
        setLoading(false);
      }
    };
    fetchPost();
  }, [postSlug]);
  useEffect(() => {
    const recentpostsFun = async () => {
      try {
        const res = await fetch("/api/posts/get-post?limit=3");

        if (res.ok) {
          const data = await res.json(); // Get the response data
          setRecentPosts(data.posts); // Set the posts data
        }
      } catch (error) {
        console.error("Error fetching recent posts:", error); // Handle error
      }
    };
    recentpostsFun();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="xl " />
      </div>
    );
  return (
    <main className="p-3 flex flex-col max-w-6xl mx-auto min-h-screen">
      <h1 className="text-3xl mt-10 p-3 text-center font-serif max-w-2xl mx-auto lg:text-4xl">
        {post.title}
      </h1>
      <Link
        to={`/search?category=${post && post.category}`}
        className="self-center mt-5"
      >
        <Button color="gray" pill size="xs">
          {post && post.category}
        </Button>
      </Link>
      <img
        src={post && post.imageUrl}
        alt={post.title}
        srcset=""
        className="mt-10 p-3 mx-h-[600px] w-full object-cover "
      />
      <div className="flex justify-between p-3 border-b border-slate-500 mx-auto w-full max-w-2xl text-xs">
        <span>{post && new Date(post.createdAt).toLocaleDateString()}</span>
        <span className="italic">
          {post && post.content && (post.content.length / 1000).toFixed(0)} mins
          read
        </span>
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: post && post.content }}
        className="p-3 max-w-2xl  mx-auto w-full post-content"
      ></div>
      <div className="max-w-4xl mx-auto w-full">
        <CallToAction />
      </div>
      <div>
        <CommentSection postId={post._id} />
      </div>
      <div className="flex flex-col justify-center items-center mb-5">
        <h1 className="text-xl mt-5">Recent aricles</h1>
        <div className="flex flex-wrap gap-5 mt-5 justify-center"> 
          {recentPosts.map((post) => {
            return <PostCart key={post._id} post={post} />;
          })}
        </div>
      </div>
    </main>
  );
}

export default PostPage;
