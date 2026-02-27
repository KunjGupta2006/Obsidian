import User from "../models/userSchema.js";
import bcrypt from "bcryptjs";

// GET /api/user — get current user profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password").populate(
      "purchaseHistory"
    );
    return res.status(200).json({ user });
  } catch (err) {
    return res.status(500).json({ message: "Cannot fetch profile", error: err.message });
  }
};

// PUT /api/user/profile — update name and avatar
export const updateProfile = async (req, res) => {
  try {
    const { fullname, avatar } = req.body;

    if (!fullname && !avatar) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    const updates = {};
    if (fullname) updates.fullname = fullname.trim();
    if (avatar) updates.avatar = avatar.trim();

    const user = await User.findByIdAndUpdate(
      req.user._id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    return res.status(200).json({ message: "Profile updated", user });
  } catch (err) {
    if (err.name === "ValidationError") {
      const errors = Object.values(err.errors).map((e) => e.message);
      return res.status(400).json({ message: "Validation failed", errors });
    }
    return res.status(500).json({ message: "Cannot update profile", error: err.message });
  }
};

// PUT /api/user/password — change password
export const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: "Both current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ message: "New password must be at least 6 characters" });
    }

    // fetch user with password field (normally excluded)
    const user = await User.findById(req.user._id);

    // google-only users have no password
    if (!user.password) {
      return res.status(400).json({
        message: "Your account uses Google login and has no password to change",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    if (currentPassword === newPassword) {
      return res.status(400).json({ message: "New password cannot be the same as current" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    return res.status(200).json({ message: "Password updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Cannot update password", error: err.message });
  }
};

// DELETE /api/user — delete own account
export const deleteAccount = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.user._id);
    req.logout(() => {
      return res.status(200).json({ message: "Account deleted successfully" });
    });
  } catch (err) {
    return res.status(500).json({ message: "Cannot delete account", error: err.message });
  }
};