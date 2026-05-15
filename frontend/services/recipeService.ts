import api from "./api";

export type Recipe = {
  id: string;
  name: string;
  category: string;
  tag?: string;
  calories: number;
  time: string;
  difficulty: string;
  emoji: string;
  imageUrl?: string;
  ingredients: string[];
  steps: string[];
};

export const getRecipes = async (params?: {
  category?: string;
  tag?: string;
}): Promise<Recipe[]> => {
  const { data } = await api.get<Recipe[]>("/recipes", { params });
  return data;
};

export const getRecipeById = async (id: string): Promise<Recipe> => {
  const { data } = await api.get<Recipe>(`/recipes/${id}`);
  return data;
};
