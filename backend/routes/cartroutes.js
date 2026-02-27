import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";
import { isAuthenticated } from "../middlewares/authmiddlewares.js";

const cartRouter = Router();

// all cart routes require login
cartRouter.use(isAuthenticated);

cartRouter.get("/", getCart);
cartRouter.post("/:watchId", addToCart);
cartRouter.put("/:watchId", updateCartItem);
cartRouter.delete("/:watchId", removeFromCart);
cartRouter.delete("/", clearCart);

export default cartRouter;