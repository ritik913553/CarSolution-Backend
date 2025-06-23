import { Router } from "express";

import {
    loginUser,
    registerUser,
    logoutUser,
    requestResetPassword,
    resetPassword,
    verifyEmail,
    refresh,
    fillUserDetails,
} from "../controllers/user.controller.js";

import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";
// import passport from "../config/passport.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);

router.route("/verify-email").get(verifyEmail);

router.route("/request-reset-password").post(requestResetPassword);

router.route("/reset-password").post(resetPassword);

router.route("/refresh").get(verifyJWT, refresh);

router.route("/fill-user-details").post(
    verifyJWT,
    upload.fields([
        { name: "addharPic", maxCount: 1 },
        { name: "employeeIdPic", maxCount: 1 },
        { name: "avatar", maxCount: 1 },
    ]),
    fillUserDetails
);

export default router;
