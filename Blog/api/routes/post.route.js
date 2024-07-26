import express from "express"
import { verifyToken } from "../utils/verifyUser.js"
import { createPosts, deletePost, getPosts, updatePost } from "../controllers/post.controller.js";
const router = express.Router();

router.post('/createpost', verifyToken, createPosts);
router.get('/getposts', getPosts);
router.delete('/deletepost/:postId/:userId', verifyToken, deletePost);
router.put('/updatepost/:postId/:userId', verifyToken, updatePost);

export default router;