import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const searchByIngredients = async (req: Request, res: Response): Promise<void> => {
  const { ingredients } = req.body as { ingredients: string[] };
  if (!ingredients || ingredients.length === 0) {
    res.status(400).json({ error: "En az bir malzeme gerekli" });
    return;
  }

  const allRecipes = await prisma.recipe.findMany();

  const scored = allRecipes.map((recipe) => {
    const recipeIngredients: string[] = JSON.parse(recipe.ingredients);
    const matched = ingredients.filter((ing) =>
      recipeIngredients.some((ri) => ri.toLowerCase().includes(ing.toLowerCase()))
    );
    const matchPercent = Math.round((matched.length / recipeIngredients.length) * 100);
    return {
      ...recipe,
      ingredients: recipeIngredients,
      steps: JSON.parse(recipe.steps),
      matchPercent,
    };
  });

  const results = scored
    .filter((r) => r.matchPercent > 0)
    .sort((a, b) => b.matchPercent - a.matchPercent);

  res.json(results);
};
