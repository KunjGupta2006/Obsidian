import { Router } from "express";
import {
  logincontroller,
  logoutcontroller,
  signupcontroller,
} from "../controllers/authcontroller.js";
import {
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount,
} from "../controllers/usercontroller.js";
import { isAuthenticated } from "../middlewares/authmiddlewares.js";
import passport from "passport";
import "../config/passport-setup.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const userRouter = Router();
const FRONTEND_URI = process.env.FRONTEND_URI;

// LOCAL AUTH
userRouter.post("/auth/login",  logincontroller);
userRouter.post("/auth/signup", signupcontroller);
userRouter.post("/auth/logout", logoutcontroller);

// GOOGLE OAUTH
userRouter.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"], session: false })
);

userRouter.get("/auth/google/redirect",
  passport.authenticate("google", { failureRedirect: `${FRONTEND_URI}/login`, session: false }),
  (req, res) => {
    const token = jwt.sign(
      { _id: req.user._id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.cookie('token', token, {
      httpOnly: true,
      secure:   process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge:   7 * 24 * 60 * 60 * 1000,
    });
    res.redirect(FRONTEND_URI);
  }
);

// USER PROFILE
userRouter.get("/profile",  isAuthenticated, getProfile);
userRouter.put("/profile",  isAuthenticated, updateProfile);
userRouter.put("/password", isAuthenticated, updatePassword);
userRouter.delete("/",      isAuthenticated, deleteAccount);

export default userRouter;