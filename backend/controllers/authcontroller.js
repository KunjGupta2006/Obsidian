import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const signToken = (user) => jwt.sign(
  { _id: user._id, email: user.email, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' }
);

const sendToken = (res, user, status, message) => {
  const token = signToken(user);
  res.cookie('token', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge:   7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return res.status(status).json({ message, user });
};

// POST /api/user/auth/login
export const logincontroller = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ message: "User not found" });

    if (!user.password)
      return res.status(401).json({ message: "This account uses Google login" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ message: "Wrong password" });

    sendToken(res, user, 200, "Login successful");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/user/auth/signup
export const signupcontroller = async (req, res) => {
  try {
    const { fullname, email, password } = req.body;

    if (!fullname || !email || !password)
      return res.status(400).json({ message: "All fields are required" });

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ fullname, email, password: hashedPassword });

    sendToken(res, user, 201, "Signup successful");
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// POST /api/user/auth/logout
export const logoutcontroller = (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  });
  res.json({ message: "Logged out" });
};