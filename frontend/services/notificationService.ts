import * as Notifications from "expo-notifications";
import api from "./api";

const gunlukTarifler = [
  { baslik: "🍅 Günün Tarifi: Domates Çorbası", mesaj: "Sıcacık bir çorba seni bekliyor! Sadece 25 dakikada hazır.", isim: "Domates Çorbası" },
  { baslik: "🍗 Günün Tarifi: Tavuk Sote", mesaj: "Protein dolu lezzetli bir ana yemek deneye hazır mısın?", isim: "Tavuk Sote" },
  { baslik: "🥗 Günün Tarifi: Akdeniz Salatası", mesaj: "Hafif ve sağlıklı, sadece 10 dakikada hazır!", isim: "Akdeniz Salatası" },
  { baslik: "🥣 Günün Tarifi: Mercimek Çorbası", mesaj: "Klasik Türk mutfağının vazgeçilmezi seni bekliyor.", isim: "Mercimek Çorbası" },
  { baslik: "💪 Günün Tarifi: Protein Kasesi", mesaj: "Sporcu dostu, doyurucu ve lezzetli bir kase!", isim: "Protein Kasesi" },
  { baslik: "🫐 Günün Tarifi: Smoothie Bowl", mesaj: "Güne enerjik başlamak için harika bir seçim!", isim: "Smoothie Bowl" },
  { baslik: "🍆 Günün Tarifi: Karnıyarık", mesaj: "Türk mutfağının incisi bugün sofranda olsun!", isim: "Karnıyarık" },
  { baslik: "🐟 Günün Tarifi: Fırında Somon", mesaj: "Omega-3 deposu, nefis bir akşam yemeği!", isim: "Fırında Somon" },
];

export const izinIste = async (): Promise<boolean> => {
  const { status: mevcut } = await Notifications.getPermissionsAsync();
  if (mevcut === "granted") return true;
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
};

export const gunlukTarifBildirimi = async () => {
  const izinVar = await izinIste();
  if (!izinVar) return;

  await Notifications.cancelAllScheduledNotificationsAsync();

  const gun = new Date().getDay();
  const tarif = gunlukTarifler[gun % gunlukTarifler.length];

  // Tarif ID'sini backend'den çek
  let recipeId: string | null = null;
  try {
    const { data } = await api.get<{ id: string }[]>("/recipes", {
      params: { name: tarif.isim },
    });
    // İsme göre eşleştir
    const { data: tumTarifler } = await api.get<{ id: string; name: string }[]>("/recipes");
    const bulunan = tumTarifler.find((r) =>
      r.name.toLowerCase().includes(tarif.isim.toLowerCase())
    );
    if (bulunan) recipeId = bulunan.id;
  } catch {}

  await Notifications.scheduleNotificationAsync({
    content: {
      title: tarif.baslik,
      body: tarif.mesaj,
      sound: true,
      data: {
        type: "gunluk_tarif",
        recipeId,
      },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60,
    },
  });
};

export const bildirimiIptalEt = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};
