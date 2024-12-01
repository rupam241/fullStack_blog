import express from 'express'
import { verifyToken } from '../utils/verifyUser.js';
import {createPost,getposts} from '../controllers/post.controller.js'

const router=express.Router();

router.post('/create-post',verifyToken,createPost)
router.get('/get-post',getposts);

export default router;