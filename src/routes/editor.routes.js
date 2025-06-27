import {Router } from "express";

import  {createPost,
  getMyPosts,
  getPostDetails,
  updatePost,
  deletePost,}  from "../controllers/editor.controller.js"

  const router = Router();

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";


router.post("/posts", verifyJWT,upload.single("image"), createPost);

router.get("/posts", verifyJWT, getMyPosts);    
router.get("/posts/:postId", verifyJWT, getPostDetails);
router.put("/posts/:postId", verifyJWT, updatePost);
router.delete("/posts/:postId", verifyJWT, deletePost);


export default router;
