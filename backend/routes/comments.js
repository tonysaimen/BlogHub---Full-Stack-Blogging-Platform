import express from 'express';
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// @desc    Get comments for a specific post
// @route   GET /api/comments/:postId
// @access  Public
router.get('/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'name email avatar')
      .sort({ createdAt: 1 }); // Chronological order (oldest first for message thread style)

    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Add a comment to a post
// @route   POST /api/comments/:postId
// @access  Private
router.post('/:postId', protect, async (req, res) => {
  const { content } = req.body;

  try {
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = new Comment({
      content,
      user: req.user._id,
      post: req.params.postId,
    });

    const savedComment = await comment.save();
    const populatedComment = await savedComment.populate('user', 'name email avatar');

    res.status(201).json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Update a comment
// @route   PUT /api/comments/:commentId
// @access  Private
router.put('/:commentId', protect, async (req, res) => {
  const { content } = req.body;

  try {
    if (!content) {
      return res.status(400).json({ message: 'Comment content is required' });
    }

    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the comment belongs to the user
    if (comment.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to edit this comment' });
    }

    comment.content = content;
    const updatedComment = await comment.save();
    const populatedComment = await updatedComment.populate('user', 'name email avatar');

    res.json(populatedComment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Delete a comment
// @route   DELETE /api/comments/:commentId
// @access  Private
router.delete('/:commentId', protect, async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if the comment belongs to the user or the post author
    // We fetch the post first to see if the caller is the author of the post (who should also be allowed to moderate/delete comments on their post)
    const post = await Post.findById(comment.post);
    const isPostAuthor = post && post.author.toString() === req.user._id.toString();
    const isCommentAuthor = comment.user.toString() === req.user._id.toString();

    if (!isCommentAuthor && !isPostAuthor) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await Comment.deleteOne({ _id: comment._id });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
