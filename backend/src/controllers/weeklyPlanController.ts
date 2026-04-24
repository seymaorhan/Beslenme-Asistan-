import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();

export const getPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  const plans = await prisma.weeklyPlan.findMany({
    where: { userId: req.userId! },
    include: { recipe: true },
  });
  res.json(plans);
};

export const addMeal = async (req: AuthRequest, res: Response): Promise<void> => {
  const { day, mealType, recipeId } = req.body;
  if (!day || !mealType || !recipeId) {
    res.status(400).json({ error: "Gün, öğün tipi ve tarif zorunludur" });
    return;
  }
  const plan = await prisma.weeklyPlan.upsert({
    where: { userId_day_mealType: { userId: req.userId!, day, mealType } },
    update: { recipeId },
    create: { userId: req.userId!, day, mealType, recipeId },
    include: { recipe: true },
  });
  res.json(plan);
};

export const removeMeal = async (req: AuthRequest, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const plan = await prisma.weeklyPlan.findUnique({ where: { id } });
  if (!plan || plan.userId !== req.userId) {
    res.status(404).json({ error: "Plan bulunamadı" });
    return;
  }
  await prisma.weeklyPlan.delete({ where: { id } });
  res.json({ success: true });
};
