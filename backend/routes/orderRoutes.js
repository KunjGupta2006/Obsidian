import { Router } from "express";
import {
  placeOrder,
  getMyOrders,
  getOrderById,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/orderController.js";
import { isAuthenticated, isAdmin } from "../middlewares/authmiddlewares.js";

const orderRouter = Router();

// ─── User ─────────────────────────────────────────────────
orderRouter.post("/", isAuthenticated, placeOrder);
orderRouter.get("/", isAuthenticated, getMyOrders);
orderRouter.get("/:id", isAuthenticated, getOrderById);
orderRouter.put("/:id/cancel", isAuthenticated, cancelOrder);

// ─── Admin ────────────────────────────────────────────────
orderRouter.get("/admin/all", isAuthenticated, isAdmin, getAllOrders);
orderRouter.put("/admin/:id", isAuthenticated, isAdmin, updateOrderStatus);
orderRouter.delete("/admin/:id", isAuthenticated, isAdmin, deleteOrder);

export default orderRouter;