import api from "./api";
import { Recipe } from "./recipeService";

export type RecipeWithMatch = Recipe & { matchPercent: number };

export const searchByIngredients = async (
  ingredients: string[]
): Promise<RecipeWithMatch[]> => {
  const { data } = await api.post<RecipeWithMatch[]>("/ingredients/search", {
    ingredients,
  });
  return data;
};
