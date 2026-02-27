import express, { Router } from "express";
import User from "../models/userSchema.js";
import { logincontroller, logoutcontroller, signupcontroller } from "../controllers/authcontroller.js";
import {
  getProfile,
  updateProfile,
  updatePassword,
  deleteAccount,
} from "../controllers/usercontroller.js";
const userRouter=Router();
import dotenv from "dotenv";
import { isAuthenticated } from "../middlewares/authmiddlewares.js";
import "../config/passport-setup.js";
import "../config/passportlocal.js";
import passport from "passport";
import "../config/passport.js";
dotenv.config();
const FRONTEND_URI=process.env.FRONTEND_URI;

//  api/user from server

// auth-----------------

//login
userRouter.post("/auth/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: info?.message || "Login failed",
      });
    }

    req.login(user, (err) => {
      if (err) return next(err);

      req.user = user;   // attach user manually
      return logincontroller(req, res);
    });
  })(req, res, next);
});
//signup
userRouter.post("/auth/signup",signupcontroller);
// logout
userRouter.post("/auth/logout",logoutcontroller);
userRouter.get("/auth/google",passport.authenticate("google",{
    scope:["profile","email"]
}));
userRouter.get("/auth/google/redirect",
  passport.authenticate("google", {failureRedirect: `${FRONTEND_URI}/login`,}),
  (req, res) => {
    res.redirect(FRONTEND_URI);
  }
);

// user profile-----------------
userRouter.get("/profile", isAuthenticated, getProfile);
userRouter.put("/profile", isAuthenticated, updateProfile);
userRouter.put("/password", isAuthenticated, updatePassword);
userRouter.delete("/", isAuthenticated, deleteAccount);


export default userRouter