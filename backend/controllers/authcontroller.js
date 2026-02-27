import mongoose from "mongoose";
import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";

// const FRONTEND_URI = process.env.FRONTEND_URI;
export const logincontroller=(req,res)=>{
    res.json({
      message: "Login successful",
      user: req.user,
    });
  };

export const signupcontroller=async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullname,
      email,
      password: hashedPassword,
    });
    // login user immediately after signup
    req.login(user, (err) => {
      if (err) return res.status(500).json({ error: err.message });

      // redirect to frontend home
      return res.status(201).json({ message: "Signup successful", user });
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

export const logoutcontroller=(req, res) => {
  req.logout(() => {
    res.json({ message: "Logged out" });
  });
}