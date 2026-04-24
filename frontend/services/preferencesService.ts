import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "dietPreferences";

export const getPreferences = async (): Promise<string[]> => {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
};

export const savePreferences = async (prefs: string[]): Promise<void> => {
  await AsyncStorage.setItem(KEY, JSON.stringify(prefs));
};
