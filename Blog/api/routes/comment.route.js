import express from 'express';
import { addComment, deleteComment, editComment, getPostComments, likeComment } from '../controllers/comment.controller.js';
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.post('/add', verifyToken, addComment);
router.get('/getpostcomments/:postId', getPostComments);
router.put('/edit/:commentId', verifyToken, editComment);
router.put('/like/:commentId', verifyToken, likeComment);
router.delete('/delete/:commentId', verifyToken, deleteComment);

export default router;