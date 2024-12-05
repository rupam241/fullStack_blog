import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PostCart from '../components/PostCart';

function Search() {
  const [sidebarData, setSidebarData] = useState({
    searchTerm: '',
    sort: 'desc',
    category: 'uncategorized',
  });

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  // Fetch posts when location.search changes
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    const sortFromUrl = urlParams.get('sort');
    const categoryFromUrl = urlParams.get('category');

    // Only update if something is different
    setSidebarData({
      searchTerm: searchTermFromUrl || '',
      sort: sortFromUrl || 'desc',
      category: categoryFromUrl || 'uncategorized',
    });

    // Function to fetch posts based on current query parameters
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/posts/get-post?${urlParams.toString()}`);
        if (!res.ok) {
          setLoading(false);
          alert('Failed to load posts.');
          return;
        }

        const data = await res.json();
        setPosts(data.posts);
        setLoading(false);
        setShowMore(data.posts.length === 9); // Assumes 9 posts per page
      } catch (error) {
        setLoading(false);
        console.error('Error fetching posts:', error);
        alert('Error fetching posts');
      }
    };

    fetchPosts();
  }, [location.search]); // Trigger this useEffect when location.search changes

  // Handle input changes
  const handleChange = (e) => {
    const { id, value } = e.target;
    setSidebarData(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams();
    urlParams.set('searchTerm', sidebarData.searchTerm);
    urlParams.set('sort', sidebarData.sort);
    urlParams.set('category', sidebarData.category);
    navigate(`/search?${urlParams.toString()}`);
  };

  // Handle loading more posts
  const handleShowMore = async () => {
    const startIndex = posts.length;
    const urlParams = new URLSearchParams(location.search);
    urlParams.set('startIndex', startIndex); // Set start index for pagination

    setLoading(true);
    try {
      const res = await fetch(`/api/posts/get-post?${urlParams.toString()}`);
      if (!res.ok) {
        setLoading(false);
        alert('Failed to load more posts.');
        return;
      }

      const data = await res.json();
      setPosts(prevPosts => [...prevPosts, ...data.posts]);
      setLoading(false);
      setShowMore(data.posts.length === 9); // Assumes 9 posts per page
    } catch (error) {
      setLoading(false);
      console.error('Error fetching more posts:', error);
      alert('Error fetching more posts');
    }
  };

  return (
    <div className="flex flex-col md:flex-row">
      <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
        <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
          <div className="flex items-center gap-2">
            <label className="whitespace-nowrap font-semibold">Search Term:</label>
            <input
              placeholder="Search..."
              id="searchTerm"
              type="text"
              value={sidebarData.searchTerm}
              onChange={handleChange}
              className="border p-2 rounded"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Sort:</label>
            <select
              onChange={handleChange}
              value={sidebarData.sort}
              id="sort"
              className="border p-2 rounded"
            >
              <option value="desc">Latest</option>
              <option value="asc">Oldest</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label className="font-semibold">Category:</label>
            <select
              onChange={handleChange}
              value={sidebarData.category}
              id="category"
              className="border p-2 rounded"
            >
              <option value="uncategorized">Uncategorized</option>
              <option value="reactjs">React.js</option>
              <option value="nextjs">Next.js</option>
              <option value="javascript">JavaScript</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-purple-600 text-white py-2 px-4 rounded hover:bg-purple-700 transition"
          >
            Apply Filters
          </button>
        </form>
      </div>
      <div className="w-full">
        <h1 className="text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5">
          Posts results:
        </h1>
        <div className="p-7 flex flex-wrap gap-4">
          {!loading && posts.length === 0 && (
            <p className="text-xl text-gray-500">No posts found.</p>
          )}
          {loading && <p className="text-xl text-gray-500">Loading...</p>}
          {!loading &&
            posts &&
            posts.map((post) => <PostCart key={post._id} post={post} />)}
          {showMore && (
            <button
              onClick={handleShowMore}
              className="text-teal-500 text-lg hover:underline p-7 w-full"
            >
              Show More
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Search;
