import jwt from "jsonwebtoken";
import User from "../models/userSchema.js";

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token)
      return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select("-password");
    if (!user)
      return res.status(401).json({ message: "User not found" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// use this for admin routes
export const isAdmin = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token)
      return res.status(401).json({ message: "Not authenticated" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded._id).select("-password");
    if (!user)
      return res.status(401).json({ message: "User not found" });

    if (user.role !== 'admin')
      return res.status(403).json({ message: "Admin access required" });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};