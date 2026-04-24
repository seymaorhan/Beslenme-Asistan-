import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const parseRecipe = (recipe: any) => ({
  ...recipe,
  ingredients: JSON.parse(recipe.ingredients),
  steps: JSON.parse(recipe.steps),
});

export const getRecipes = async (req: Request, res: Response): Promise<void> => {
  const { category, tag } = req.query;
  const recipes = await prisma.recipe.findMany({
    where: {
      ...(category ? { category: String(category) } : {}),
      ...(tag ? { tag: String(tag) } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
  res.json(recipes.map(parseRecipe));
};

export const getRecipeById = async (req: Request, res: Response): Promise<void> => {
  const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const recipe = await prisma.recipe.findUnique({
    where: { id },
  });
  if (!recipe) {
    res.status(404).json({ error: "Tarif bulunamadı" });
    return;
  }
  res.json(parseRecipe(recipe));
};
