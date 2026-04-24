import { Router } from "express";
import { getItems, addItem, toggleItem, deleteItem } from "../controllers/shoppingController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, getItems);
router.post("/", authenticate, addItem);
router.patch("/:id", authenticate, toggleItem);
router.delete("/:id", authenticate, deleteItem);

export default router;
