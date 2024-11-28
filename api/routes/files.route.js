import express, { Router } from 'express'
import upload from '../middleware/multer.js'
import {uploadSingleImage} from "../controllers/image.controller.js"



const router=express.Router();



router.post('/upload-single', upload.single('image'), uploadSingleImage);


export default router;