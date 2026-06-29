import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { Search, ArrowLeft, AlertCircle, BookOpen } from 'lucide-react';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Extract query parameters
  const queryParams = new URLSearchParams(location.search);
  const searchQuery = queryParams.get('q');
  const tagQuery = queryParams.get('tag');

  const fetchResults = async () => {
    try {
      setLoading(true);
      setError('');
      
      let url = '/api/posts';
      const params = new URLSearchParams();

      if (searchQuery) {
        params.append('search', searchQuery);
      } else if (tagQuery) {
        params.append('tag', tagQuery);
      }

      const res = await axios.get(params.toString() ? `${url}?${params.toString()}` : url);
      setPosts(res.data);
    } catch (err) {
      console.error(err);
      setError('An error occurred while fetching your search results.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [searchQuery, tagQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-semibold mb-6 transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Articles
        </button>

        <div className="flex items-center gap-3">
          <div className="bg-indigo-600/10 p-2.5 rounded-2xl border border-indigo-500/20">
            <Search className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-100 tracking-tight">
              Search Results
            </h1>
            <p className="text-slate-400 text-xs mt-1">
              {searchQuery && (
                <>
                  Showing results for query: <span className="text-indigo-400 font-bold">"{searchQuery}"</span>
                </>
              )}
              {tagQuery && (
                <>
                  Showing results for tag: <span className="text-indigo-400 font-bold">#{tagQuery}</span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 flex items-center gap-2">
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
          <h3 className="text-xl font-bold text-slate-300 font-sans">No matching results</h3>
          <p className="text-slate-500 mt-2">We couldn't find any articles matching your search criteria. Try different terms or browse the homepage.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 animate-in fade-in duration-300">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchResults;
