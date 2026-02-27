import mongoose from "mongoose";
import Order from "../models/orderSchema.js";
import Watch from "../models/watchSchema.js";
import User from "../models/userSchema.js";

// POST /api/orders — place an order
export const placeOrder = async (req, res) => {
  try {
    const { shippingAddress, paymentMethod } = req.body;

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({ message: "Shipping address and payment method are required" });
    }
    if (!["cod", "online"].includes(paymentMethod)) {
      return res.status(400).json({ message: "Invalid payment method" });
    }

    const user = await User.findById(req.user._id).populate("cart.watch");

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ message: "Your cart is empty" });
    }

    const orderItems = [];
    for (const cartItem of user.cart) {
      const watch = cartItem.watch;

      if (!watch) {
        return res.status(400).json({ message: "One or more items in your cart no longer exist" });
      }

      if (!watch.inStock || watch.quantity < cartItem.quantity) {
        return res.status(400).json({
          message: `"${watch.title}" does not have enough stock. Available: ${watch.quantity}`,
        });
      }

      orderItems.push({
        watch:    watch._id,
        title:    watch.title,
        brand:    watch.brand,
        image:    watch.image,
        price:    watch.price,
        quantity: cartItem.quantity,
      });

      await Watch.findByIdAndUpdate(watch._id, {
        $inc: { quantity: -cartItem.quantity },
      });
    }

    const subtotal     = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const shippingCost = subtotal > 500 ? 0 : 20;
    const totalAmount  = subtotal + shippingCost;

    const order = await Order.create({
      user:            req.user._id,
      items:           orderItems,
      shippingAddress,
      paymentMethod,
      paymentStatus:   "pending",
      orderStatus:     "processing",
      subtotal,
      shippingCost,
      totalAmount,
    });

    user.purchaseHistory.push(order._id);
    user.cart = [];
    await user.save();
    // console.log("order created: --",order._id);
    return res.status(201).json({ message: "Order placed successfully", order });

  } catch (err) {
    console.error("placeOrder error:", err);
    return res.status(500).json({ message: "Cannot place order", error: err.message });
  
  }
};

// GET /api/orders — logged in user's orders
export const getMyOrders = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;

    const query = { user: req.user._id };
    if (status) query.orderStatus = status;

    const total  = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    return res.status(200).json({
      orders,
      pagination: {
        total,
        page:  Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Cannot fetch orders", error: err.message });
  }
};

// GET /api/orders/:id — single order detail
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(200).json({ order });
  } catch (err) {
    return res.status(500).json({ message: "Cannot fetch order", error: err.message });
  }
};

// PUT /api/orders/:id/cancel — user cancels their own order
export const cancelOrder = async (req, res) => {
  try {
    const { id }     = req.params;
    const { reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Forbidden" });
    }

    if (["shipped", "delivered", "cancelled"].includes(order.orderStatus)) {
      return res.status(400).json({
        message: `Order cannot be cancelled once it is ${order.orderStatus}`,
      });
    }

    for (const item of order.items) {
      await Watch.findByIdAndUpdate(item.watch, {
        $inc: { quantity: item.quantity },
      });
    }

    order.orderStatus        = "cancelled";
    order.cancellationReason = reason || "Cancelled by user";
    await order.save();

    return res.status(200).json({ message: "Order cancelled", order });

  } catch (err) {
    console.error("cancelOrder error:", err);
    return res.status(500).json({ message: "Cannot cancel order", error: err.message });
  }
};

// ─── Admin Controllers ─────────────────────────────────────────────────────

// GET /api/orders/admin/all
export const getAllOrders = async (req, res) => {
  try {
    const { page = 1, limit = 20, status, paymentStatus } = req.query;

    const query = {};
    if (status)        query.orderStatus  = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const total  = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate("user", "fullname email avatar")
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    return res.status(200).json({
      orders,
      pagination: {
        total,
        page:  Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err) {
    return res.status(500).json({ message: "Cannot fetch orders", error: err.message });
  }
};

// PUT /api/orders/admin/:id — update order status, tracking etc
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus, trackingNumber, estimatedDelivery, paymentStatus } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.orderStatus === "cancelled") {
      return res.status(400).json({ message: "Cannot update a cancelled order" });
    }

    const allowedStatuses = ["processing", "confirmed", "shipped", "delivered", "cancelled"];
    if (orderStatus && !allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const allowedPaymentStatuses = ["pending", "paid", "failed", "refunded"];
    if (paymentStatus && !allowedPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    if (orderStatus)       order.orderStatus       = orderStatus;
    if (trackingNumber)    order.trackingNumber     = trackingNumber;
    if (estimatedDelivery) order.estimatedDelivery  = new Date(estimatedDelivery);
    if (paymentStatus)     order.paymentStatus      = paymentStatus;

    await order.save();
    return res.status(200).json({ message: "Order updated", order });

  } catch (err) {
    return res.status(500).json({ message: "Cannot update order", error: err.message });
  }
};

// DELETE /api/orders/admin/:id
export const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid order ID" });
    }

    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ message: "Order not found" });

    await User.findByIdAndUpdate(order.user, {
      $pull: { purchaseHistory: order._id },
    });

    return res.status(200).json({ message: "Order deleted" });

  } catch (err) {
    return res.status(500).json({ message: "Cannot delete order", error: err.message });
  }
};