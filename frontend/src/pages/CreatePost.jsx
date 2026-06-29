import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FilePlus2, Eye, Edit3, Image, Tag, FolderOpen, AlertCircle, ArrowLeft } from 'lucide-react';

const CATEGORIES = ['Technology', 'Lifestyle', 'Business', 'Design', 'Health', 'Travel', 'Food', 'General'];

const CreatePost = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: '',
    category: 'Technology',
    tags: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState('edit'); // 'edit' or 'preview'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) return setError('Title is required');
    if (!formData.content.trim()) return setError('Content is required');

    setSubmitting(true);

    try {
      await axios.post('/api/posts', {
        ...formData,
        // Make sure tags are trimmed
        tags: formData.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter((tag) => tag !== ''),
      });
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to publish post. Please check your fields.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-slate-400 hover:text-white text-xs font-semibold mb-6 transition-colors cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </button>

      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="bg-indigo-600/10 p-2.5 rounded-2xl border border-indigo-500/20">
          <FilePlus2 className="h-6 w-6 text-indigo-400" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-100 tracking-tight">Create Blog Post</h1>
          <p className="text-slate-400 text-xs">Share your stories, tutorials, or updates with the readers.</p>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/25 text-red-400 p-4 rounded-2xl text-sm mb-6 flex items-center gap-2">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {/* Form and Preview Layout */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Tabs selector */}
        <div className="flex border-b border-slate-800/80 bg-slate-950/40 px-6 pt-3 gap-4">
          <button
            onClick={() => setActiveTab('edit')}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'edit'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Edit3 className="h-4 w-4" />
            Write Editor
          </button>
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold uppercase tracking-wider border-b-2 transition-all cursor-pointer ${
              activeTab === 'preview'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Eye className="h-4 w-4" />
            Live Preview
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 sm:p-8">
          {activeTab === 'edit' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Post Title
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter a catchy title..."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-100 text-base font-semibold px-4 py-2.5 rounded-xl outline-none transition-colors"
                />
              </div>

              {/* Grid Inputs (Category, Image, Tags) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 text-slate-200 text-sm px-4 py-2.5 rounded-xl outline-none appearance-none cursor-pointer"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    <FolderOpen className="absolute right-3.5 top-3.5 h-4 w-4 text-slate-500 pointer-events-none" />
                  </div>
                </div>

                {/* Featured Image Link */}
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                    Featured Image URL
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      name="image"
                      value={formData.image}
                      onChange={handleChange}
                      placeholder="https://images.unsplash.com/photo-..."
                      className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-200 text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none transition-colors"
                    />
                    <Image className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  </div>
                </div>
              </div>

              {/* Tags Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Tags (separated by commas)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleChange}
                    placeholder="programming, webdev, tutorial"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-200 text-sm pl-10 pr-4 py-2.5 rounded-xl outline-none transition-colors"
                  />
                  <Tag className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                </div>
              </div>

              {/* Editor Workspace Content */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-1.5 uppercase tracking-wider">
                  Blog Content (Markdown / HTML / Plain Text supported)
                </label>
                <textarea
                  name="content"
                  required
                  rows="14"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Write your blog post content here... You can use paragraphs, lists, or HTML tags."
                  className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-150 text-sm p-4 rounded-2xl outline-none transition-colors resize-y font-mono"
                ></textarea>
              </div>

              {/* Publish CTA Button */}
              <div className="flex justify-end pt-4 border-t border-slate-800/80">
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all duration-300 transform hover:-translate-y-0.5 shadow-md shadow-indigo-950/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                >
                  {submitting ? 'Publishing...' : 'Publish Post'}
                </button>
              </div>
            </form>
          ) : (
            /* PREVIEW TAB */
            <div className="space-y-6">
              {/* Preview Header */}
              {formData.image && (
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-950">
                  <img
                    src={formData.image}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center gap-2">
                <span className="bg-indigo-600/90 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  {formData.category}
                </span>
                {formData.tags && (
                  <div className="flex gap-1.5">
                    {formData.tags
                      .split(',')
                      .map((t) => t.trim())
                      .filter((t) => t !== '')
                      .map((tag, idx) => (
                        <span key={idx} className="text-[10px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                          #{tag}
                        </span>
                      ))}
                  </div>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 leading-tight">
                {formData.title || 'Untitled Article'}
              </h1>

              {/* Preview Excerpt */}
              <div className="border-t border-slate-800/80 pt-6">
                <div
                  className="prose prose-invert max-w-none text-slate-300 text-base leading-relaxed whitespace-pre-wrap"
                  dangerouslySetInnerHTML={{
                    __html: formData.content || '<p class="text-slate-500 italic">No content written yet.</p>',
                  }}
                ></div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
