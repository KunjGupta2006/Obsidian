import { Router } from "express";
import {
  getDashboardStats,
  getMonthlyRevenue,
  getAllUsers,
  updateUserRole,
  deleteUser,
} from "../controllers/adminController.js";
import { isAuthenticated, isAdmin } from "../middlewares/authmiddlewares.js";

const adminRouter = Router();

// all admin routes are protected
adminRouter.use(isAuthenticated, isAdmin);

adminRouter.get("/stats", getDashboardStats);
adminRouter.get("/stats/revenue", getMonthlyRevenue);

adminRouter.get("/users", getAllUsers);
adminRouter.put("/users/:id/role", updateUserRole);
adminRouter.delete("/users/:id", deleteUser);

export default adminRouter;