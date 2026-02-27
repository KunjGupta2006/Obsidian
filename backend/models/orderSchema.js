import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  watch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Watch",
  },
  // snapshots at time of purchase
  title: { type: String, required: true },
  brand: { type: String, required: true },
  image: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
});

const shippingAddressSchema = new mongoose.Schema({
  fullname: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  addressLine1: { type: String, required: true, trim: true },
  addressLine2: { type: String, trim: true },
  city: { type: String, required: true, trim: true },
  state: { type: String, required: true, trim: true },
  postalCode: { type: String, required: true, trim: true },
  country: { type: String, required: true, trim: true },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      validate: {
        validator: (items) => items.length > 0,
        message: "Order must have at least one item",
      },
    },

    shippingAddress: {
      type: shippingAddressSchema,
      required: true,
    },

    // kept minimal — will be expanded when payment is integrated
    paymentMethod: {
      type: String,
      enum: ["cod", "online"], // "online" will be replaced with stripe/razorpay/paypal later
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
      // cod orders stay "pending" until marked paid manually by admin
      // online orders will go pending → paid via webhook later
    },

    // placeholder for whatever payment gateway you pick
    // stripe → stripePaymentIntentId
    // razorpay → razorpayOrderId
    // paypal → paypalOrderId
    paymentGatewayId: {
      type: String,
      sparse: true,
    },

    orderStatus: {
      type: String,
      enum: ["processing", "confirmed", "shipped", "delivered", "cancelled"],
      default: "processing",
    },

    trackingNumber: { type: String, trim: true },
    estimatedDelivery: { type: Date },

    // pricing
    subtotal: { type: Number, required: true },
    shippingCost: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },

    // cancellation
    cancelledAt: { type: Date },
    cancellationReason: { type: String, trim: true },

    // delivery
    deliveredAt: { type: Date },
  },
  { timestamps: true }
);

// auto-set timestamps when status changes
orderSchema.pre("save", async function () {
  if (this.isModified("orderStatus")) {
    if (this.orderStatus === "delivered" && !this.deliveredAt) {
      this.deliveredAt = new Date();
    }
    if (this.orderStatus === "cancelled" && !this.cancelledAt) {
      this.cancelledAt = new Date();
    }
  }
});
const Order = mongoose.model("Order", orderSchema);
export default Order;