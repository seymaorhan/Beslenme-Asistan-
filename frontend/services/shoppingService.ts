import api from "./api";

export type ShoppingItem = {
  id: string;
  name: string;
  category: string;
  checked: boolean;
};

export const getItems = async (): Promise<ShoppingItem[]> => {
  const { data } = await api.get<ShoppingItem[]>("/shopping");
  return data;
};

export const addItem = async (
  name: string,
  category?: string
): Promise<ShoppingItem> => {
  const { data } = await api.post<ShoppingItem>("/shopping", { name, category });
  return data;
};

export const toggleItem = async (id: string): Promise<ShoppingItem> => {
  const { data } = await api.patch<ShoppingItem>(`/shopping/${id}`);
  return data;
};

export const deleteItem = async (id: string): Promise<void> => {
  await api.delete(`/shopping/${id}`);
};
