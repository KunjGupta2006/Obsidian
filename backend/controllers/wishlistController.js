import User from "../models/userSchema.js";
import Watch from "../models/watchSchema.js";
import mongoose from "mongoose";

// GET /api/wishlist
export const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "wishlist",
      "title brand price image inStock condition"
    );
    return res.status(200).json({ wishlist: user.wishlist });
  } catch (err) {
    return res.status(500).json({ message: "Cannot fetch wishlist", error: err.message });
  }
};

// POST /api/wishlist/:watchId — add to wishlist
export const addToWishlist = async (req, res) => {
  try {
    const { watchId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(watchId)) {
      return res.status(400).json({ message: "Invalid watch ID" });
    }

    const watch = await Watch.findById(watchId);
    if (!watch) return res.status(404).json({ message: "Watch not found" });

    const user = await User.findById(req.user._id);
    const alreadyInWishlist = user.wishlist.some(
      (id) => id.toString() === watchId
    );

    if (alreadyInWishlist) {
      return res.status(400).json({ message: "Watch already in wishlist" });
    }

    user.wishlist.push(watchId);
    await user.save();

    await user.populate("wishlist", "title brand price image inStock condition");
    return res.status(200).json({ message: "Added to wishlist", wishlist: user.wishlist });
  } catch (err) {
    return res.status(500).json({ message: "Cannot add to wishlist", error: err.message });
  }
};

// DELETE /api/wishlist/:watchId — remove from wishlist
export const removeFromWishlist = async (req, res) => {
  try {
    const { watchId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(watchId)) {
      return res.status(400).json({ message: "Invalid watch ID" });
    }

    const user = await User.findById(req.user._id);
    const itemExists = user.wishlist.some((id) => id.toString() === watchId);

    if (!itemExists) {
      return res.status(404).json({ message: "Watch not in wishlist" });
    }

    user.wishlist = user.wishlist.filter((id) => id.toString() !== watchId);
    await user.save();

    await user.populate("wishlist", "title brand price image inStock condition");
    return res.status(200).json({ message: "Removed from wishlist", wishlist: user.wishlist });
  } catch (err) {
    return res.status(500).json({ message: "Cannot remove from wishlist", error: err.message });
  }
};

// POST /api/wishlist/:watchId/move-to-cart — move item from wishlist to cart
export const moveToCart = async (req, res) => {
  try {
    const { watchId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(watchId)) {
      return res.status(400).json({ message: "Invalid watch ID" });
    }

    const watch = await Watch.findById(watchId);
    if (!watch) return res.status(404).json({ message: "Watch not found" });
    if (!watch.inStock) return res.status(400).json({ message: "Watch is out of stock" });

    const user = await User.findById(req.user._id);

    const inWishlist = user.wishlist.some((id) => id.toString() === watchId);
    if (!inWishlist) return res.status(404).json({ message: "Watch not in wishlist" });

    // remove from wishlist
    user.wishlist = user.wishlist.filter((id) => id.toString() !== watchId);

    // add to cart if not already there
    const inCart = user.cart.some((item) => item.watch.toString() === watchId);
    if (!inCart) {
      user.cart.push({ watch: watchId, quantity: 1 });
    }

    await user.save();

    await user.populate("wishlist", "title brand price image inStock condition");
    await user.populate("cart.watch", "title brand price image inStock quantity condition");

    return res.status(200).json({
      message: "Moved to cart",
      wishlist: user.wishlist,
      cart: user.cart,
    });
  } catch (err) {
    return res.status(500).json({ message: "Cannot move to cart", error: err.message });
  }
};