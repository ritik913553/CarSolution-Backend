import User from "../models/user.model.js";
import {
    Reset_Password_Email_Template,
    Verification_Email_Template,
} from "../utils/EmailTemplate.js";
import { sendEmail } from "../utils/EmailSender.js";
import jwt from "jsonwebtoken";
import {
    fillUserDetailsSchema,
    registerUserSchema,
} from "../validator/user.validation.js";

const generateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save();

        return { accessToken, refreshToken };
    } catch (error) {
        throw new ApiError(
            500,
            "Something went wrong while generating refresh and access tokens"
        );
    }
};
const registerUser = async (req, res) => {
    try {
        const { error, value } = registerUserSchema.validate(req.body, {
            abortEarly: false,
        });

        if (error) {
            return res.status(400).json({ error: error.details[0].message });
        }

        const { fullName, email, password } = value;

        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(409).json({ error: "User already exist" });
        }

        const user = await User.create({
            fullName,
            email,
            password,
            role: "salesman",
        });

        const createdUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );
        if (!createdUser) {
            return res.status(500).json({
                error: "Something went wrong while registering the user",
            });
        }
        const emailVerifcationToken =
            createdUser.generateEmailVerificationToken();
        const link = `http://localhost:5000/api/v1/user/verify-email?token=${emailVerifcationToken}`;
        const htmlContent = Verification_Email_Template.replace(
            "{verification_link}",
            link
        ).replace("{user_name}", createdUser.name);

        await sendEmail(createdUser.email, "Verify your email", htmlContent);

        return res.status(200).json({ user: createdUser });
    } catch (error) {
        console.error("Error in registerUser:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};
const verifyEmail = async (req, res) => {
    const { token } = req.query;

    if (!token) {
        res.status(400).json({ message: "Token is required" });
    }

    try {
        const decodedToken = jwt.verify(
            token,
            process.env.EMAIL_VERIFICATION_SECRET
        );

        const user = await User.findByIdAndUpdate(
            decodedToken?._id,
            { $set: { isEmailVerified: true } },
            { new: true }
        ).select("-password -refreshToken");

        if (!user) {
            res.status(404).json({ message: "User not found" });
        }

        return res.redirect("http://localhost:5173/email-verified");
    } catch (error) {
        return res.redirect("http://localhost:5173/email-verification-failed");
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ error: "email and password is required" });
        }
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "User doesnot exist" });
        }
        if (!user.isEmailVerified) {
            return res
                .status(400)
                .json({ error: "Please verify you email before login" });
        }
        const ispasswordValid = await user.isPasswordCorrect(password);
        if (!ispasswordValid) {
            return res.status(401).json({ error: "Invalid users credentials" });
        }
        const { accessToken, refreshToken } =
            await generateAccessAndRefreshTokens(user._id);
        const loggedInUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );

        res.status(200)
            .cookie("accessToken", accessToken, {
                httpOnly: true,
                maxAge: 24 * 60 * 60 * 1000, //if not give maxAge then it become session cookie that will deleted when the browser is closed ---> test this sentese
                // secure:true
                // SameSite:None
            })
            .cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 10 * 24 * 60 * 60 * 1000,
            })
            .json({ user: loggedInUser, accessToken, refreshToken });
    } catch (error) {
        console.error("Error in loginUser:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

const logoutUser = async (req, res) => {
    try {
        await User.findByIdAndUpdate(
            req.user._id,
            {
                $unset: { refreshToken: 1 }, //this removes the field from  document
            },
            { new: true }
        );

        const options = {
            httpOnly: true,
            secure: true,
        };
        return res
            .status(200)
            .clearCookie("accessToken", options)
            .clearCookie("refreshToken", options)
            .json({ message: "Useer logged out successfullt" });
    } catch (error) {
        console.log("Logout Error:", error);
    }
};

const requestResetPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required" });
    }
    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    if (user.authProvider === "google") {
        return res.status(404).json({
            error: "Your account is linked with Google. Please reset your password through Google.",
        });
    }
    const token = user.generateResetPasswordToken();
    const resetLink = `http://localhost:5173/reset-password/${token}`;

    const htmlContent = Reset_Password_Email_Template.replace(
        "{user_name}",
        user.name
    ).replace(/(\{reset_link\})/g, resetLink);
    await sendEmail(
        email,
        "Reset Password By clickin on the link",
        htmlContent
    );
    return res.status(200).json({
        message: "Email sent successfully click on the link to reset password",
    });
};

const resetPassword = async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res
            .status(400)
            .json({ message: "Token and new password are required" });
    }
    try {
        const decoded = jwt.verify(
            token,
            process.env.RESET_PASSWORD_TOKEN_SECRET
        );

        if (decoded.purpose !== "reset-password") {
            return res.status(400).json({ message: "Invalid token purpose" });
        }

        const user = await User.findById(decoded._id);
        user.password = newPassword;
        await user.save();

        res.json({ message: "Password reset successful" });
    } catch (err) {
        return res.status(400).json({ message: "Invalid or expired token" });
    }
};

const refresh = async (req, res) => {
    try {
        const refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ error: "Refresh token missing" });
        }

        // Verify the refresh token
        let decoded;
        try {
            decoded = jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET
            );
        } catch (err) {
            return res
                .status(401)
                .json({ error: "Invalid or expired refresh token" });
        }

        const user = await User.findById(decoded._id);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(401).json({ error: "Invalid refresh token" });
        }

        // Generate new tokens
        const { accessToken, refreshToken: newRefreshToken } =
            await generateAccessAndRefreshTokens(user._id);

        // Set new cookies
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000, // 1 day
        }).cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            maxAge: 10 * 24 * 60 * 60 * 1000, // 10 days
        });

        // Return user data (without sensitive info)
        const safeUser = await User.findById(user._id).select(
            "-password -refreshToken"
        );
        return res.status(200).json({
            user: safeUser,
            accessToken,
            refreshToken: newRefreshToken,
        });
    } catch (error) {
        console.error("Error in refresh:", error);
        return res.status(500).json({ error: "Internal server error" });
    }
};

const fillUserDetails = async (req, res) => {
    try {
        if (req.user.isEmailVerified === false) {
            return res.status(400).json({
                error: "Please verify your email before filling details",
            });
        }
        if (!req.files || req.files.length !== 3) {
            return res.status(400).json({
                success: false,
                message: "You must upload exactly 3 images.",
            });
        }

        const { error, value } = fillUserDetailsSchema.validate(req.body, {
            abortEarly: fasle,
        });

        if (error) {
            req.files?.forEach((f) => fs.unlinkSync(f.path));

            return res.status(400).json({ error: error.details[0].message });
        }
        let avatarLocalPath;
        if (
            req.files &&
            Array.isArray(req.files.avatar) &&
            req.files.avatar.length > 0
        ) {
            avatarLocalPath = req.files.avatar[0].path;
        }

        let addharPicLocalPath;
        if (
            req.files &&
            Array.isArray(req.files.addharPic) &&
            req.files.addharPic.length > 0
        ) {
            addharPicLocalPath = req.files.addharPic[0].path;
        }
        let employeeIdPicLocalPath;
        if (
            req.files &&
            Array.isArray(req.files.employeeIdPic) &&
            req.files.employeeIdPic.length > 0
        ) {
            employeeIdPicLocalPath = req.files.employeeIdPic[0].path;
        }

        if (
            !avatarLocalPath ||
            !addharPicLocalPath ||
            !employeeIdPicLocalPath
        ) {
            return res.status(400).json({ error: "All file is required" });
        }

        const avatar = await uploadOnCloudinary(avatarLocalPath);
        if (!avatar) {
            return res.status(500).json({ error: "Failed to upload avatar" });
        }
        const addharPic = await uploadOnCloudinary(addharPicLocalPath);
        if (!addharPic) {
            return res
                .status(500)
                .json({ error: "Failed to upload Aadhar pic" });
        }
        const employeeIdPic = await uploadOnCloudinary(employeeIdPicLocalPath);
        if (!employeeIdPic) {
            return res.status(500).json({
                error: "Failed to upload Employee ID pic",
            });
        }

        const updatedUser = await User.findByIdAndUpdate(req.user._id, {
            ...value,
            avatar: avatar.secure_url,
            addharPic: addharPic.secure_url,
            employeeIdPic: employeeIdPic.secure_url,
        });
        //send notification in dashboard to the admin for verfiy
        return res
            .status(200)
            .json({ message: "Wait 24 hr for verify by the system." });
    } catch (error) {
        console.log("Error in userDetails");
        return res.status(500).json({ error: "Internal server error" });
    }
};

export {
    registerUser,
    loginUser,
    logoutUser,
    requestResetPassword,
    resetPassword,
    verifyEmail,
    refresh,
    fillUserDetails,
};
