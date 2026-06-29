import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { FilePenLine, Trash2, LayoutDashboard, Plus, MessageSquare, Heart, FileText, ExternalLink } from 'lucide-react';

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalComments: 0,
    totalLikes: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Fetch all posts
      const postsRes = await axios.get('/api/posts');
      // Filter user's posts
      const myPosts = postsRes.data.filter((p) => p.author?._id === user._id);
      
      // Fetch comments for each user post to aggregate count
      const commentPromises = myPosts.map((p) => axios.get(`/api/comments/${p._id}`));
      const commentsResponses = await Promise.all(commentPromises);
      
      const totalCommentsCount = commentsResponses.reduce(
        (sum, res) => sum + res.data.length,
        0
      );

      const totalLikesCount = myPosts.reduce(
        (sum, p) => sum + (p.likes?.length || 0),
        0
      );

      setPosts(myPosts);
      setStats({
        totalPosts: myPosts.length,
        totalComments: totalCommentsCount,
        totalLikes: totalLikesCount,
      });
    } catch (err) {
      console.error(err);
      setError('Failed to retrieve dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to permanently delete this post? This action will also delete all comments on it.')) return;

    try {
      await axios.delete(`/api/posts/${postId}`);
      // Refresh data
      fetchDashboardData();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete post.');
    }
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="bg-indigo-600/10 p-2.5 rounded-2xl border border-indigo-500/20">
            <LayoutDashboard className="h-6 w-6 text-indigo-400" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-100 tracking-tight">Creator Dashboard</h1>
            <p className="text-slate-400 text-xs">Manage your content, analyze statistics, and write new articles.</p>
          </div>
        </div>
        <Link
          to="/create"
          className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold px-5 py-2.5 rounded-xl text-sm transition-all duration-300 transform hover:-translate-y-0.5 shadow-md shadow-indigo-950/20 w-fit cursor-pointer"
        >
          <Plus className="h-4.5 w-4.5" />
          Create New Post
        </Link>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-4 rounded-2xl text-sm mb-6">
          {error}
        </div>
      )}

      {/* Stats Cards Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
        {/* Total Posts */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Posts</p>
            <h3 className="text-3xl font-black text-slate-150">{stats.totalPosts}</h3>
          </div>
          <div className="bg-indigo-500/10 p-3 rounded-2xl border border-indigo-500/20">
            <FileText className="h-6 w-6 text-indigo-400" />
          </div>
        </div>

        {/* Total Likes */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Total Likes Received</p>
            <h3 className="text-3xl font-black text-slate-150">{stats.totalLikes}</h3>
          </div>
          <div className="bg-pink-500/10 p-3 rounded-2xl border border-pink-500/20">
            <Heart className="h-6 w-6 text-pink-400" />
          </div>
        </div>

        {/* Total Comments */}
        <div className="bg-slate-900/40 border border-slate-800/80 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1">Comments Received</p>
            <h3 className="text-3xl font-black text-slate-150">{stats.totalComments}</h3>
          </div>
          <div className="bg-purple-500/10 p-3 rounded-2xl border border-purple-500/20">
            <MessageSquare className="h-6 w-6 text-purple-400" />
          </div>
        </div>
      </section>

      {/* Authored Posts Management Table / List */}
      <section className="bg-slate-900/40 border border-slate-800/80 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800/60 bg-slate-900/20">
          <h2 className="text-lg font-bold text-slate-200">Your Published Articles</h2>
        </div>

        {posts.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="h-12 w-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-base font-bold text-slate-400">You haven't written any posts yet</h3>
            <p className="text-slate-500 text-xs mt-1">Get started by sharing your first article with the community.</p>
            <Link
              to="/create"
              className="mt-4 inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
            >
              Write Your First Post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800/60 text-xs font-semibold text-slate-400 uppercase bg-slate-900/10">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Published Date</th>
                  <th className="px-6 py-4">Likes</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {posts.map((post) => (
                  <tr key={post._id} className="hover:bg-slate-900/20 transition-colors text-sm text-slate-350">
                    <td className="px-6 py-4 font-semibold text-slate-200 max-w-xs truncate">
                      <div className="flex flex-col">
                        <span className="truncate">{post.title}</span>
                        <Link
                          to={`/post/${post._id}`}
                          className="flex items-center gap-1 text-[10px] text-slate-500 hover:text-indigo-400 w-fit mt-0.5 transition-colors"
                        >
                          View Live <ExternalLink className="h-2.5 w-2.5" />
                        </Link>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="bg-slate-800 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(post.createdAt).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-6 py-4 font-medium text-pink-500">
                      {post.likes?.length || 0}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/edit/${post._id}`}
                          className="p-2 text-slate-400 hover:text-indigo-400 hover:bg-slate-800/50 rounded-lg transition-all"
                          title="Edit Post"
                        >
                          <FilePenLine className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => handleDeletePost(post._id)}
                          className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800/50 rounded-lg transition-all"
                          title="Delete Post"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default Dashboard;
