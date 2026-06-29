import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Calendar, User } from 'lucide-react';

const PostCard = ({ post }) => {
  // Format Date
  const formatDate = (dateStr) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  // Strip html content to show plain text preview
  const getExcerpt = (htmlContent) => {
    const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
    const text = doc.body.textContent || "";
    return text.length > 120 ? text.substring(0, 120) + '...' : text;
  };

  return (
    <article className="group bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/50 rounded-2xl overflow-hidden shadow-lg hover:shadow-indigo-950/20 hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Featured Image Link */}
      <Link to={`/post/${post._id}`} className="relative block overflow-hidden aspect-video bg-slate-950">
        <img
          src={post.image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80'}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Category Badge */}
        {post.category && (
          <span className="absolute top-3 left-3 bg-indigo-600/90 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            {post.category}
          </span>
        )}
      </Link>

      {/* Post content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Date and Likes */}
        <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-slate-500" />
            {formatDate(post.createdAt)}
          </span>
          <span className="flex items-center gap-1">
            <Heart className="h-3.5 w-3.5 text-pink-500 fill-pink-500/20" />
            {post.likes?.length || 0}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-100 group-hover:text-indigo-400 line-clamp-2 transition-colors mb-2">
          <Link to={`/post/${post._id}`}>{post.title}</Link>
        </h3>

        {/* Excerpt */}
        <p className="text-slate-400 text-sm line-clamp-3 mb-4 flex-1">
          {getExcerpt(post.content)}
        </p>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {post.tags.slice(0, 3).map((tag, index) => (
              <Link
                key={index}
                to={`/search?tag=${encodeURIComponent(tag)}`}
                className="text-[11px] font-medium bg-slate-800 hover:bg-slate-700/80 text-slate-300 hover:text-white px-2 py-0.5 rounded-md transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        {/* Author Details Footer */}
        <div className="flex items-center gap-3 pt-4 border-t border-slate-800/80 mt-auto">
          {post.author ? (
            <Link to={`/profile/${post.author._id}`} className="flex items-center gap-2 group/author">
              <img
                src={post.author.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(post.author.name)}`}
                alt={post.author.name}
                className="h-8 w-8 rounded-full border border-slate-700 group-hover/author:border-indigo-500 object-cover transition-colors"
              />
              <div>
                <p className="text-xs font-semibold text-slate-200 group-hover/author:text-white transition-colors">
                  {post.author.name}
                </p>
                <p className="text-[10px] text-slate-500">Author</p>
              </div>
            </Link>
          ) : (
            <div className="flex items-center gap-2 text-slate-500">
              <div className="h-8 w-8 rounded-full bg-slate-800 flex items-center justify-center">
                <User className="h-4 w-4" />
              </div>
              <p className="text-xs">Anonymous</p>
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default PostCard;
