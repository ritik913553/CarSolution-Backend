import { Router } from "express";
import {getAvailablePosts,
getAllPosts,
placeBid,
getMyBidPost,
updateBid,

} from "../controllers/salesPerson.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.get("/available-posts", verifyJWT, getAvailablePosts);
router.get("/all-posts", verifyJWT, getAllPosts);
router.post("/place-bid/:postId", verifyJWT, placeBid);
router.get("/my-bid-post", verifyJWT, getMyBidPost);
router.put("/update-bid/:postId", verifyJWT, updateBid);


export default router;