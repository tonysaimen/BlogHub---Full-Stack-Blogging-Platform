import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Trash2, Edit2, Check, X, MessageSquare, Send } from 'lucide-react';

const CommentSection = ({ postId, postAuthorId }) => {
  const { user } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  
  // State for editing comment
  const [editCommentId, setEditCommentId] = useState(null);
  const [editContent, setEditContent] = useState('');

  // Fetch comments
  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/comments/${postId}`);
      setComments(res.data);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Could not load comments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [postId]);

  // Handle post new comment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(`/api/comments/${postId}`, { content: newComment });
      setComments([...comments, res.data]);
      setNewComment('');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post comment.');
    }
  };

  // Handle delete comment
  const handleDelete = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      await axios.delete(`/api/comments/${commentId}`);
      setComments(comments.filter((c) => c._id !== commentId));
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to delete comment.');
    }
  };

  // Handle submit edit comment
  const handleEditSubmit = async (commentId) => {
    if (!editContent.trim()) return;

    try {
      const res = await axios.put(`/api/comments/${commentId}`, { content: editContent });
      setComments(comments.map((c) => (c._id === commentId ? res.data : c)));
      setEditCommentId(null);
      setEditContent('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update comment.');
    }
  };

  const startEdit = (comment) => {
    setEditCommentId(comment._id);
    setEditContent(comment.content);
  };

  const cancelEdit = () => {
    setEditCommentId(null);
    setEditContent('');
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="mt-8 border-t border-slate-800/80 pt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="h-5 w-5 text-indigo-400" />
        <h2 className="text-xl font-bold text-slate-100">
          Comments ({comments.length})
        </h2>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-2.5 rounded-xl text-sm mb-4">
          {error}
        </div>
      )}

      {/* Add Comment Section */}
      {user ? (
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-3">
            <img
              src={user.avatar}
              alt={user.name}
              className="h-9 w-9 rounded-full border border-slate-700 object-cover"
            />
            <div className="flex-1">
              <textarea
                placeholder="Share your thoughts..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                rows="3"
                className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 rounded-xl px-4 py-2.5 text-sm outline-none transition-all resize-none"
              ></textarea>
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 disabled:cursor-not-allowed text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  <Send className="h-3.5 w-3.5" />
                  Post Comment
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800/60 rounded-xl p-4 text-center mb-8">
          <p className="text-slate-400 text-sm">
            Please{' '}
            <a href="/login" className="text-indigo-400 font-semibold hover:underline">
              login
            </a>{' '}
            to participate in the conversation.
          </p>
        </div>
      )}

      {/* Comments List */}
      {loading ? (
        <div className="flex justify-center py-6">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : comments.length === 0 ? (
        <p className="text-slate-500 text-sm italic text-center py-6">
          No comments yet. Be the first to start the conversation!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => {
            const isCommentOwner = user && user._id === comment.user?._id;
            const isPostOwner = user && user._id === postAuthorId;
            const canDelete = isCommentOwner || isPostOwner;

            return (
              <div
                key={comment._id}
                className="flex gap-3 bg-slate-900/30 border border-slate-800/40 rounded-xl p-4 hover:border-slate-800/80 transition-colors"
              >
                <img
                  src={comment.user?.avatar || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(comment.user?.name || '')}`}
                  alt={comment.user?.name}
                  className="h-8 w-8 rounded-full border border-slate-700 object-cover"
                />

                <div className="flex-1 min-w-0">
                  {/* Top info row */}
                  <div className="flex items-center justify-between mb-1">
                    <div>
                      <span className="text-sm font-semibold text-slate-200">
                        {comment.user?.name || 'Anonymous'}
                      </span>
                      <span className="text-[10px] text-slate-500 ml-2">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>

                    {/* Actions panel */}
                    {!editCommentId || editCommentId !== comment._id ? (
                      <div className="flex items-center gap-1.5">
                        {isCommentOwner && (
                          <button
                            onClick={() => startEdit(comment)}
                            className="p-1 text-slate-500 hover:text-indigo-400 transition-colors rounded hover:bg-slate-850"
                            title="Edit comment"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {canDelete && (
                          <button
                            onClick={() => handleDelete(comment._id)}
                            className="p-1 text-slate-500 hover:text-red-400 transition-colors rounded hover:bg-slate-850"
                            title="Delete comment"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    ) : null}
                  </div>

                  {/* Comment Body */}
                  {editCommentId === comment._id ? (
                    <div className="mt-2">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        rows="2"
                        className="w-full bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-100 rounded-lg px-3 py-1.5 text-sm outline-none resize-none"
                      ></textarea>
                      <div className="flex gap-2 justify-end mt-1.5">
                        <button
                          onClick={cancelEdit}
                          className="flex items-center gap-1 text-[11px] font-semibold bg-slate-800 text-slate-400 hover:text-slate-350 px-2 py-1 rounded transition-colors"
                        >
                          <X className="h-3 w-3" />
                          Cancel
                        </button>
                        <button
                          onClick={() => handleEditSubmit(comment._id)}
                          className="flex items-center gap-1 text-[11px] font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-2 py-1 rounded transition-colors"
                        >
                          <Check className="h-3 w-3" />
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-slate-300 text-sm whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CommentSection;
