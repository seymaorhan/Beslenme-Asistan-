import { Router } from "express";
import { getFavorites, checkFavorite, addFavorite, removeFavorite } from "../controllers/favoriteController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, getFavorites);
router.get("/:recipeId/check", authenticate, checkFavorite);
router.post("/", authenticate, addFavorite);
router.delete("/:recipeId", authenticate, removeFavorite);

export default router;
