import express from 'express'
import { createComment,getComment,likeComment,editComment,deleteComment,getDashComment,getDashDeleteComment } from '../controllers/comment.controller.js';
import {verifyToken} from '../utils/verifyUser.js'

const router=express.Router();

router.post('/create',verifyToken , createComment)
router.get('/get-comment/:postId', getComment);
router.put('/likeComment/:commentId',verifyToken,likeComment);
router.put('/editComment/:commentId/:userId',verifyToken,editComment)
router.delete('/deleteComment/:commentId/:userId',verifyToken,deleteComment)
router.get('/getDashComment',verifyToken, getDashComment);
router.delete('/getDashDeleteComment/:commentId/:userId',verifyToken,getDashDeleteComment)


export default router