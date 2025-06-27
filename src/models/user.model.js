import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const addressSchema = new mongoose.Schema({
    street: { type: String },
    city: { type: String },
    state: { type: String },
    pincode: { type: String },
    country: { type: String },
});

const userSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            type: String,
        },
        role: {
            type: String,
            enum: ["admin", "salesman", "editor"],
            default: "salesman",
        },
        gender: {
            type: String,
        },
        dob: {
            type: Date,
        },
        age: {
            type: Number,
        },
        address: [addressSchema],
        phone: {
            type: String,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        refreshToken: {
            type: String,
        },
        isVerifiedByAdmin: {
            type: Boolean,
            default: false,
        },
        addharNumber: {
            type: String,
        },
        addharPic: {
            type: String,
        },
        employeeIdPic: {
            type: String,
        },
        brandName:[
            {
                type:String
            }
        ]
    },
    { timeStamp: true }
);

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name,
            role: this.role,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );
};
userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(
        {
            _id: this._id,
        },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
    );
};

userSchema.methods.generateResetPasswordToken = function () {
    return jwt.sign(
        {
            _id: this.id,
            purpose: "reset-password",
        },
        process.env.RESET_PASSWORD_TOKEN_SECRET,
        { expiresIn: process.env.RESET_PASSWORD_TOKEN_EXPIRY }
    );
};

userSchema.methods.generateEmailVerificationToken = function () {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
        },
        process.env.EMAIL_VERIFICATION_SECRET,
        {
            expiresIn: process.env.EMAIL_VERIFICATION_SECRET_EXPIRY,
        }
    );
};

const User = mongoose.model("User", userSchema);
export default User;
