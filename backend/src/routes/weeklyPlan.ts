import { Router } from "express";
import { getPlan, addMeal, removeMeal } from "../controllers/weeklyPlanController";
import { authenticate } from "../middleware/auth";

const router = Router();

router.get("/", authenticate, getPlan);
router.post("/", authenticate, addMeal);
router.delete("/:id", authenticate, removeMeal);

export default router;
