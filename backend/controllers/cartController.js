import User from "../models/userSchema.js";
import Watch from "../models/watchSchema.js";
import mongoose from "mongoose";

// GET /api/cart
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate(
      "cart.watch",
      "title brand price image inStock quantity condition"
    );

    return res.status(200).json({ cart: user.cart });
  } catch (err) {
    return res.status(500).json({ message: "Cannot fetch cart", error: err.message });
  }
};

// POST /api/cart/:watchId — add item or increment quantity
export const addToCart = async (req, res) => {
  try {
    const { watchId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(watchId)) {
      return res.status(400).json({ message: "Invalid watch ID" });
    }

    const watch = await Watch.findById(watchId);
    if (!watch) return res.status(404).json({ message: "Watch not found" });
    if (!watch.inStock) return res.status(400).json({ message: "Watch is out of stock" });

    const user = await User.findById(req.user._id);
    const existingItem = user.cart.find(
      (item) => item.watch.toString() === watchId
    );

    if (existingItem) {
      // check if requested quantity exceeds stock
      if (existingItem.quantity >= watch.quantity) {
        return res.status(400).json({ message: "Not enough stock available" });
      }
      existingItem.quantity += 1;
    } else {
      user.cart.push({ watch: watchId, quantity: 1 });
    }

    await user.save();

    // return populated cart
    await user.populate("cart.watch", "title brand price image inStock quantity condition");
    return res.status(200).json({ message: "Added to cart", cart: user.cart });
  } catch (err) {
    return res.status(500).json({ message: "Cannot add to cart", error: err.message });
  }
};

// PUT /api/cart/:watchId — update quantity
export const updateCartItem = async (req, res) => {
  try {
    const { watchId } = req.params;
    const { quantity } = req.body;

    if (!mongoose.Types.ObjectId.isValid(watchId)) {
      return res.status(400).json({ message: "Invalid watch ID" });
    }

    if (!quantity || quantity < 1) {
      return res.status(400).json({ message: "Quantity must be at least 1. To remove, use DELETE." });
    }

    const watch = await Watch.findById(watchId);
    if (!watch) return res.status(404).json({ message: "Watch not found" });

    if (quantity > watch.quantity) {
      return res.status(400).json({ message: `Only ${watch.quantity} units available` });
    }

    const user = await User.findById(req.user._id);
    const item = user.cart.find((item) => item.watch.toString() === watchId);

    if (!item) return res.status(404).json({ message: "Item not in cart" });

    item.quantity = quantity;
    await user.save();

    await user.populate("cart.watch", "title brand price image inStock quantity condition");
    return res.status(200).json({ message: "Cart updated", cart: user.cart });
  } catch (err) {
    return res.status(500).json({ message: "Cannot update cart", error: err.message });
  }
};

// DELETE /api/cart/:watchId — remove single item
export const removeFromCart = async (req, res) => {
  try {
    const { watchId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(watchId)) {
      return res.status(400).json({ message: "Invalid watch ID" });
    }

    const user = await User.findById(req.user._id);
    const itemExists = user.cart.some((item) => item.watch.toString() === watchId);

    if (!itemExists) return res.status(404).json({ message: "Item not in cart" });

    user.cart = user.cart.filter((item) => item.watch.toString() !== watchId);
    await user.save();

    await user.populate("cart.watch", "title brand price image inStock quantity condition");
    return res.status(200).json({ message: "Item removed from cart", cart: user.cart });
  } catch (err) {
    return res.status(500).json({ message: "Cannot remove from cart", error: err.message });
  }
};

// DELETE /api/cart — clear entire cart
export const clearCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
    return res.status(200).json({ message: "Cart cleared", cart: [] });
  } catch (err) {
    return res.status(500).json({ message: "Cannot clear cart", error: err.message });
  }
};