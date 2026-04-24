import api from "./api";
import { Recipe } from "./recipeService";

export const getFavorites = async (): Promise<Recipe[]> => {
  const { data } = await api.get<{ recipe: Recipe }[]>("/favorites");
  return data.map((f) => f.recipe);
};

export const isFavorite = async (id: string): Promise<boolean> => {
  try {
    const { data } = await api.get<{ isFavorite: boolean }>(`/favorites/${id}/check`);
    return data.isFavorite;
  } catch {
    return false;
  }
};

export const toggleFavorite = async (recipe: Recipe): Promise<boolean> => {
  const fav = await isFavorite(recipe.id);
  if (fav) {
    await api.delete(`/favorites/${recipe.id}`);
    return false;
  } else {
    await api.post("/favorites", { recipeId: recipe.id });
    return true;
  }
};
