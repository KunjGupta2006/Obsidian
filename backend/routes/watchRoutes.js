import { Router } from "express";
import {
  getwatches,
  getWatchById,
  createWatch,
  updateWatch,
  deleteWatch,
} from "../controllers/watchcontroller.js";
import { isAuthenticated,isAdmin } from "../middlewares/authmiddlewares.js";
const watchRouter=Router();
// api/watches from server

watchRouter.get("/",getwatches);

watchRouter.get("/:id", getWatchById);
watchRouter.post("/", isAuthenticated, isAdmin, createWatch);
watchRouter.put("/:id", isAuthenticated, isAdmin, updateWatch);
watchRouter.delete("/:id", isAuthenticated, isAdmin, deleteWatch);
export default watchRouter;