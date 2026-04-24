import { Router } from "express";
import { getRecipes, getRecipeById } from "../controllers/recipeController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, getRecipes);
router.get("/:id", authenticate, getRecipeById);

export default router;
