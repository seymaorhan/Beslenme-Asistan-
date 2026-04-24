import { Response } from "express";
import { PrismaClient } from "@prisma/client";
import { AuthRequest } from "../middleware/auth";

const prisma = new PrismaClient();

const parseRecipe = (recipe: any) => ({
  ...recipe,
  ingredients: JSON.parse(recipe.ingredients),
  steps: JSON.parse(recipe.steps),
});

export const getFavorites = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const favorites = await prisma.favorite.findMany({
      where: { userId: req.userId! },
      include: { recipe: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(favorites.map((f) => ({ ...f, recipe: parseRecipe(f.recipe) })));
  } catch (err) {
    console.error("getFavorites hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const checkFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recipeId = Array.isArray(req.params.recipeId)
      ? req.params.recipeId[0]
      : req.params.recipeId;
    const favorite = await prisma.favorite.findUnique({
      where: { userId_recipeId: { userId: req.userId!, recipeId } },
    });
    res.json({ isFavorite: !!favorite });
  } catch (err) {
    console.error("checkFavorite hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const addFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { recipeId } = req.body;
    if (!recipeId) {
      res.status(400).json({ error: "recipeId zorunludur" });
      return;
    }
    const recipe = await prisma.recipe.findUnique({ where: { id: recipeId } });
    if (!recipe) {
      res.status(404).json({ error: "Tarif bulunamadı" });
      return;
    }
    const existing = await prisma.favorite.findUnique({
      where: { userId_recipeId: { userId: req.userId!, recipeId } },
    });
    if (existing) {
      res.json({ ...existing, recipe: parseRecipe(recipe), isFavorite: true });
      return;
    }
    const favorite = await prisma.favorite.create({
      data: { userId: req.userId!, recipeId },
      include: { recipe: true },
    });
    res.status(201).json({ ...favorite, recipe: parseRecipe(favorite.recipe), isFavorite: true });
  } catch (err) {
    console.error("addFavorite hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};

export const removeFavorite = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const recipeId = Array.isArray(req.params.recipeId)
      ? req.params.recipeId[0]
      : req.params.recipeId;
    const existing = await prisma.favorite.findUnique({
      where: { userId_recipeId: { userId: req.userId!, recipeId } },
    });
    if (!existing || existing.userId !== req.userId) {
      res.status(404).json({ error: "Favori bulunamadı" });
      return;
    }
    await prisma.favorite.delete({
      where: { userId_recipeId: { userId: req.userId!, recipeId } },
    });
    res.json({ success: true, isFavorite: false });
  } catch (err) {
    console.error("removeFavorite hatası:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
};
