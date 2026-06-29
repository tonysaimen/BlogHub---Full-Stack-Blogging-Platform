import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import CommentSection from '../components/CommentSection';
import { Heart, Calendar, ArrowLeft, HeartOff, User, FolderOpen } from 'lucide-react';

const BlogDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Like states
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/posts/${id}`);
        setPost(res.data);
        setLikesCount(res.data.likes?.length || 0);
        
        if (user) {
          setIsLiked(res.data.likes?.includes(user._id));
        }
        setError('');
      } catch (err) {
        console.error(err);
        setError('Blog post not found or server issue.');
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id, user]);

  const handleLikeToggle = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (liking) return;

    try {
      setLiking(true);
      const res = await axios.post(`/api/posts/${id}/like`);
      setLikesCount(res.data.likesCount);
      setIsLiked(!isLiked);
    } catch (err) {
      console.error(err);
    } finally {
      setLiking(false);
    }
  };

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

  if (error || !post) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl mb-6">
          {error || 'The requested blog post could not be retrieved.'}
        </div>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-1.5 text-indigo-400 hover:text-indigo-300 font-semibold hover:underline"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </button>
      </div>
    );
  }

  return (
    <article className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-semibold mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Articles
      </button>

      {/* Featured Cover Image */}
      {post.image && (
        <div className="w-full aspect-video rounded-3xl overflow-hidden bg-slate-950 mb-8 border border-slate-800/80 shadow-2xl">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Meta tags header */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {post.category && (
          <span className="flex items-center gap-1 bg-indigo-600/90 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            <FolderOpen className="h-3 w-3" />
            {post.category}
          </span>
        )}
        <span className="flex items-center gap-1 text-slate-400 text-xs font-medium">
          <Calendar className="h-3.5 w-3.5" />
          {formatDate(post.createdAt)}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-100 leading-tight tracking-tight mb-6">
        {post.title}
      </h1>

      {/* Author profile banner */}
      <div className="flex items-center justify-between border-y border-slate-800/60 py-4 mb-8">
        {post.author ? (
          <Link to={`/profile/${post.author._id}`} className="flex items-center gap-3 group">
            <img
              src={post.author.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(post.author.name)}`}
              alt={post.author.name}
              className="h-10 w-10 rounded-full border border-slate-700 group-hover:border-indigo-500 object-cover transition-colors"
            />
            <div>
              <p className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                {post.author.name}
              </p>
              <p className="text-[10px] text-slate-500">{post.author.email}</p>
            </div>
          </Link>
        ) : (
          <div className="flex items-center gap-2 text-slate-500">
            <div className="h-10 w-10 rounded-full bg-slate-850 flex items-center justify-center">
              <User className="h-5 w-5" />
            </div>
            <p className="text-sm">Anonymous</p>
          </div>
        )}

        {/* Like Button */}
        <button
          onClick={handleLikeToggle}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
            isLiked
              ? 'bg-pink-600/15 border border-pink-500/30 text-pink-400 hover:bg-pink-600/20'
              : 'bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-800/80'
          }`}
        >
          <Heart className={`h-4 w-4 ${isLiked ? 'fill-pink-500 text-pink-500' : ''}`} />
          <span>{likesCount} {likesCount === 1 ? 'Like' : 'Likes'}</span>
        </button>
      </div>

      {/* Main content body */}
      <section className="prose prose-invert max-w-none text-slate-350 text-base sm:text-lg leading-relaxed whitespace-pre-wrap">
        <div dangerouslySetInnerHTML={{ __html: post.content }}></div>
      </section>

      {/* Tags footer */}
      {post.tags && post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-8 pt-4 border-t border-slate-850">
          {post.tags.map((tag, idx) => (
            <Link
              key={idx}
              to={`/search?tag=${encodeURIComponent(tag)}`}
              className="text-xs bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 text-indigo-400 px-3 py-1 rounded-xl transition-all"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Embedded Comments Section */}
      <CommentSection postId={post._id} postAuthorId={post.author?._id} />
    </article>
  );
};

export default BlogDetails;
