import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { Search, SlidersHorizontal, BookOpen, AlertCircle } from 'lucide-react';

const CATEGORIES = ['All', 'Technology', 'Lifestyle', 'Business', 'Design', 'Health', 'Travel', 'Food'];

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filtering & Sorting State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortOption, setSortOption] = useState('newest');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search query to prevent massive API calls
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 450);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Fetch posts from API
  const fetchPosts = async () => {
    try {
      setLoading(true);
      
      let url = '/api/posts';
      const params = new URLSearchParams();

      if (selectedCategory && selectedCategory !== 'All') {
        params.append('category', selectedCategory);
      }
      if (debouncedSearch) {
        params.append('search', debouncedSearch);
      }
      if (sortOption) {
        params.append('sort', sortOption);
      }

      const queryString = params.toString();
      const res = await axios.get(queryString ? `${url}?${queryString}` : url);
      setPosts(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch blog posts. Please check back later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory, debouncedSearch, sortOption]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Header */}
      <header className="text-center max-w-2xl mx-auto mb-12">
        <h1 className="text-4xl sm:text-5xl font-black text-slate-100 mb-4 tracking-tight leading-tight">
          Read, Think &{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 text-transparent bg-clip-text">
            Inspire
          </span>
        </h1>
        <p className="text-slate-400 text-base sm:text-lg">
          Welcome to BlogHub, a space where stories unfold and knowledge flows freely. Discover articles from writers all over the world.
        </p>
      </header>

      {/* Control panel (Search & Sort) */}
      <section className="flex flex-col md:flex-row gap-4 items-center justify-between bg-slate-900/40 border border-slate-800/60 p-4 rounded-2xl mb-8">
        {/* Search */}
        <div className="w-full md:max-w-xs relative">
          <input
            type="text"
            placeholder="Search blogs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 placeholder-slate-500 pl-10 pr-4 py-2 rounded-xl text-sm outline-none transition-all"
          />
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
        </div>

        {/* Categories Desktop & Mobile */}
        <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-950/20'
                  : 'bg-slate-950/50 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort option */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end border-t border-slate-800/60 md:border-t-0 pt-3 md:pt-0">
          <SlidersHorizontal className="h-4 w-4 text-slate-500" />
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-350 text-sm py-1.5 px-3 rounded-xl outline-none transition-colors cursor-pointer"
          >
            <option value="newest">Newest First</option>
            <option value="popular">Most Liked</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </section>

      {/* Main Blog Feed */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl flex items-center gap-2 mb-6">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="min-h-[300px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/20 border border-slate-800/40 rounded-3xl">
          <BookOpen className="h-12 w-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-300">No blog posts found</h3>
          <p className="text-slate-500 mt-2">Try adjusting your filters, search terms, or category selection.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
