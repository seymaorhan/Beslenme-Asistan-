import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "./api";
import { gunlukTarifBildirimi } from "./notificationService";

export type AuthResponse = {
  token: string;
  user: { id: string; name: string; email: string };
};

export const register = async (
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/register", {
    name,
    email,
    password,
  });
  console.log("Register response:", JSON.stringify(data));
  if (!data.token) {
    throw new Error("Token alınamadı: " + JSON.stringify(data));
  }
  await AsyncStorage.setItem("token", data.token);
  await AsyncStorage.setItem("user", JSON.stringify(data.user));
  const existing = await AsyncStorage.getItem("joinDate");
  if (!existing) {
    await AsyncStorage.setItem("joinDate", new Date().toISOString());
  }
  gunlukTarifBildirimi(); // 1 dk sonra bildirim
  return data;
};

export const login = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  const { data } = await api.post<AuthResponse>("/auth/login", {
    email,
    password,
  });
  await AsyncStorage.setItem("token", data.token);
  await AsyncStorage.setItem("user", JSON.stringify(data.user));
  const existing = await AsyncStorage.getItem("joinDate");
  if (!existing) {
    await AsyncStorage.setItem("joinDate", new Date().toISOString());
  }
  gunlukTarifBildirimi(); // 1 dk sonra bildirim
  return data;
};

export const logout = async (): Promise<void> => {
  await AsyncStorage.multiRemove(["token", "user"]);
};

export const getDaysActive = async (): Promise<number> => {
  const joinDate = await AsyncStorage.getItem("joinDate");
  if (!joinDate) return 1;
  const diff = Date.now() - new Date(joinDate).getTime();
  return Math.max(1, Math.floor(diff / (1000 * 60 * 60 * 24)) + 1);
};

export const getStoredUser = async () => {
  const raw = await AsyncStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
};
