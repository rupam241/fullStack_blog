import express from 'express';

import { deleteUser, updateUser,signoutUser,getUser,getUsers} from '../controllers/user.controller.js';

import { verifyToken } from '../utils/verifyUser.js';
const router=express.Router();


router.put('/update/:userId',verifyToken  ,updateUser)
router.delete('/delete/:userId',verifyToken,deleteUser)
router.delete('/signout/:userId',verifyToken,signoutUser)
router.get('/getUsers',verifyToken,getUser)
router.get('/:userId',getUsers) //comment
export default router;