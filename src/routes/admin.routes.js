import { Router } from "express"

import { getAllEditors,
  getAllSalespersons,
  getUserDetails,
  getAllPosts,
  getPostWithAllBids,
  deletePost,
  getPendingApprovals,
  approveSalesperson,
  rejectSalesperson,
  getSalespersonApplication} from "../controllers/admin.controller.js"


const router = Router()


import { verifyJWT } from "../middlewares/auth.middleware.js"

router.get("/editors", verifyJWT, getAllEditors)
router.get("/salespersons", verifyJWT, getAllSalespersons)
router.get("/user/:userId", verifyJWT, getUserDetails)
router.get("/posts", verifyJWT, getAllPosts)
router.get("/posts/:postId/bids", verifyJWT, getPostWithAllBids)
router.delete("/posts/:postId", verifyJWT, deletePost)
router.get("/pending-approvals", verifyJWT, getPendingApprovals)
router.post("/approve-salesperson/:userId", verifyJWT, approveSalesperson)
router.post("/reject-salesperson/:userId", verifyJWT, rejectSalesperson)
router.get("/salesperson-application/:userId", verifyJWT, getSalespersonApplication)

export default router