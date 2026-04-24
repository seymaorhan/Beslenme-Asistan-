import { Router } from "express";
import { searchByIngredients } from "../controllers/ingredientController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.post("/search", authenticate, searchByIngredients);

export default router;
