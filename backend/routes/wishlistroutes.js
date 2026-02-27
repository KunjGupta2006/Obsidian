import { Router } from "express";
import {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  moveToCart,
} from "../controllers/wishlistController.js";
import { isAuthenticated } from "../middlewares/authmiddlewares.js";

const wishlistRouter = Router();

wishlistRouter.use(isAuthenticated);

wishlistRouter.get("/", getWishlist);
wishlistRouter.post("/:watchId", addToWishlist);
wishlistRouter.delete("/:watchId", removeFromWishlist);
wishlistRouter.post("/:watchId/move-to-cart", moveToCart);

export default wishlistRouter;