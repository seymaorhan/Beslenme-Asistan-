import api from "./api";

export const sendMessage = async (message: string): Promise<string> => {
  try {
    const { data } = await api.post<{ reply: string }>("/ai", { message }, { timeout: 30000 });
    return data.reply;
  } catch (err: any) {
    const msg = err?.message ?? "";
    if (msg.includes("Network") || msg.includes("ECONNREFUSED")) {
      throw new Error("Sunucuya bağlanılamıyor. İnternet bağlantını kontrol et.");
    }
    throw err;
  }
};
