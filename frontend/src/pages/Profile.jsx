import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PostCard from '../components/PostCard';
import { User, Mail, Calendar, BookOpen, AlertCircle } from 'lucide-react';

const Profile = () => {
  const { id } = useParams();
  
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfileAndPosts = async () => {
      try {
        setLoading(true);
        setError('');
        
        // Fetch posts
        const postsRes = await axios.get('/api/posts');
        const userPosts = postsRes.data.filter((p) => p.author?._id === id);
        setPosts(userPosts);

        // Fetch user info from the posts or use context.
        // Since profile endpoints can get current user or we can find user info from the post details:
        if (userPosts.length > 0) {
          setProfileUser(userPosts[0].author);
        } else {
          // Fallback: If they haven't posted anything, we fetch posts to check if the author exists or retrieve details.
          // Since our profile fetch API can get user details by ID, let's create a custom retrieval or search.
          // Wait! In auth routes, we have `/api/auth/profile`. But that's for the logged in user.
          // If we want to read another user's profile info and they have 0 posts, we can display a generic card,
          // or read from user details. Since user details are protected/private, displaying author info from their posts is standard.
          // Let's check if the current logged in user profile is being viewed:
          const localToken = localStorage.getItem('token');
          if (localToken) {
            const selfRes = await axios.get('/api/auth/profile');
            if (selfRes.data._id === id) {
              setProfileUser(selfRes.data);
            }
          }
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProfileAndPosts();
  }, [id]);

  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Profile Bio Banner */}
      {profileUser ? (
        <header className="bg-slate-900/60 border border-slate-800 p-6 sm:p-8 rounded-3xl mb-12 flex flex-col sm:flex-row items-center gap-6 shadow-2xl">
          <img
            src={profileUser.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(profileUser.name)}`}
            alt={profileUser.name}
            className="h-24 w-24 rounded-full border-2 border-indigo-500 object-cover shadow-lg"
          />
          <div className="text-center sm:text-left space-y-2">
            <h1 className="text-3xl font-black text-slate-100 tracking-tight">{profileUser.name}</h1>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-slate-400">
              <span className="flex items-center justify-center sm:justify-start gap-1">
                <Mail className="h-4 w-4 text-slate-500" />
                {profileUser.email}
              </span>
              <span className="flex items-center justify-center sm:justify-start gap-1">
                <Calendar className="h-4 w-4 text-slate-500" />
                Member since {formatDate(profileUser.createdAt || new Date())}
              </span>
            </div>
            <div className="bg-indigo-600/10 border border-indigo-500/25 px-4 py-1 rounded-full text-indigo-400 text-xs font-semibold w-fit mx-auto sm:mx-0">
              {posts.length} {posts.length === 1 ? 'Article Published' : 'Articles Published'}
            </div>
          </div>
        </header>
      ) : (
        <div className="bg-slate-900/40 border border-slate-850 p-6 rounded-3xl text-center mb-12 text-slate-400">
          No profile biography details found. The user has not published any posts.
        </div>
      )}

      {/* Grid listing */}
      <h2 className="text-xl font-bold text-slate-200 mb-6 flex items-center gap-2">
        <BookOpen className="h-5 w-5 text-indigo-400" />
        Articles by {profileUser?.name || 'this Author'}
      </h2>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6">
          {error}
        </div>
      )}

      {posts.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/20 border border-slate-800/40 rounded-3xl">
          <BookOpen className="h-10 w-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-450">No published articles</h3>
          <p className="text-slate-500 text-xs mt-1">This user hasn't written any posts yet.</p>
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

export default Profile;
