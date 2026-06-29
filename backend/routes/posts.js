import express from 'express';
import Post from '../models/Post.js';
import Comment from '../models/Comment.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get all posts with search, filter, and sort
// @route   GET /api/posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { search, category, tag, sort } = req.query;
    let query = {};

    // Apply general search term (searches title, content, category, or tags)
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    // Apply category filter (exact case-insensitive match)
    if (category) {
      query.category = { $regex: `^${category}$`, $options: 'i' };
    }

    // Apply tag filter
    if (tag) {
      query.tags = { $regex: `^${tag}$`, $options: 'i' };
    }

    // Determine sorting options and query using aggregation (for sorting by likes count)
    const pipeline = [
      { $match: query },
      {
        $addFields: {
          likesCount: { $size: { $ifNull: ['$likes', []] } },
        },
      },
    ];

    if (sort === 'popular') {
      pipeline.push({ $sort: { likesCount: -1, createdAt: -1 } });
    } else if (sort === 'oldest') {
      pipeline.push({ $sort: { createdAt: 1 } });
    } else {
      // Default: newest first
      pipeline.push({ $sort: { createdAt: -1 } });
    }

    const posts = await Post.aggregate(pipeline);
    
    // Populate the author info on the aggregated post documents
    const populatedPosts = await Post.populate(posts, {
      path: 'author',
      select: 'name email avatar',
    });

    res.json(populatedPosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'name email avatar');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new post
// @route   POST /api/posts
// @access  Private
router.post('/', protect, async (req, res) => {
  const { title, content, image, category, tags } = req.body;

  try {
    if (!title || !content) {
      return res.status(400).json({ message: 'Please provide title and content' });
    }

    // Ensure tags is parsed as array if sent as string or array
    let parsedTags = [];
    if (tags) {
      parsedTags = Array.isArray(tags)
        ? tags
        : tags.split(',').map((t) => t.trim()).filter((t) => t !== '');
    }

    const post = new Post({
      title,
      content,
      image: image || 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80',
      category: category || 'General',
      tags: parsedTags,
      author: req.user._id,
      likes: [],
    });

    const createdPost = await post.save();
    const populatedPost = await createdPost.populate('author', 'name email avatar');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a post
// @route   PUT /api/posts/:id
// @access  Private
router.put('/:id', protect, async (req, res) => {
  const { title, content, image, category, tags } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the caller is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this post' });
    }

    // Update fields
    post.title = title || post.title;
    post.content = content || post.content;
    post.image = image !== undefined ? image : post.image;
    post.category = category || post.category;
    
    if (tags) {
      post.tags = Array.isArray(tags)
        ? tags
        : tags.split(',').map((t) => t.trim()).filter((t) => t !== '');
    }

    const updatedPost = await post.save();
    const populatedPost = await updatedPost.populate('author', 'name email avatar');
    res.json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a post
// @route   DELETE /api/posts/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if the caller is the author
    if (post.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete associated comments
    await Comment.deleteMany({ post: post._id });

    // Use deleteOne or findByIdAndDelete instead of remove (since mongoose v6+ remove is deprecated)
    await Post.deleteOne({ _id: post._id });

    res.json({ message: 'Post and associated comments removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Like or unlike a post
// @route   POST /api/posts/:id/like
// @access  Private
router.post('/:id/like', protect, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isLiked = post.likes.includes(req.user._id);

    if (isLiked) {
      // Unlike (remove userId)
      post.likes = post.likes.filter((userId) => userId.toString() !== req.user._id.toString());
    } else {
      // Like (add userId)
      post.likes.push(req.user._id);
    }

    await post.save();
    res.json({ likes: post.likes, likesCount: post.likes.length });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
