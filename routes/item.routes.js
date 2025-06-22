import express from "express";

import {
  createItem,
  deleteAllItems,
  deleteItem,
  getAllItems,
  getItemById,
} from "../controllers/item.controller.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Define routes for item operations
router.post("/", upload.array("files", 5), createItem);
router.get("/", getAllItems);
router.get("/:id", getItemById);
// delete all route
router.delete("/", deleteAllItems);
// router.put("/:id", updateItem);
router.delete("/:id", deleteItem);

// Export the router
export const itemRouter = router;
