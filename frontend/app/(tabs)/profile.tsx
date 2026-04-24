import { useState, useEffect, useCallback } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from "react-native";
import { useRouter, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../../constants/colors";
import { getStoredUser, logout, getDaysActive } from "../../services/authService";
import { getItems } from "../../services/shoppingService";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { gunlukTarifBildirimi, bildirimiIptalEt, izinIste } from "../../services/notificationService";
import { getPreferences, savePreferences } from "../../services/preferencesService";

const getBadge = (count: number) => {
  if (count >= 30) return { emoji: "👨‍🍳", label: "Usta Şef", color: "#F59E0B", bg: "#FEF3C7" };
  if (count >= 20) return { emoji: "🏆", label: "Pro Şef", color: "#6B7280", bg: "#F3F4F6" };
  if (count >= 10) return { emoji: "⭐", label: "Şef", color: "#CD7F32", bg: "#FEF9EE" };
  return { emoji: "🌱", label: "Çırak", color: Colors.primary, bg: Colors.primaryLight };
};

const dietPrefs = [
  { id: "vegan", label: "🌱 Vegan" },
  { id: "sporcu", label: "💪 Sporcu" },
  { id: "diyet", label: "🥗 Diyet" },
  { id: "lowcarb", label: "🌾 Low-carb" },
];

const menuItems = [
  { id: "notif", icon: "🔔", label: "Bildirimler" },
  { id: "privacy", icon: "🔒", label: "Gizlilik", info: "Verileriniz şifreli saklanır ve üçüncü taraflarla paylaşılmaz." },
  { id: "help", icon: "❓", label: "Yardım & Destek", info: "destek@chefmind.com" },
  { id: "about", icon: "ℹ️", label: "Hakkında", info: "ChefMind v1.0.0\nAkıllı beslenme ve tarif asistanınız." },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [activePrefs, setActivePrefs] = useState<string[]>([]);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [shoppingCount, setShoppingCount] = useState(0);
  const [cookedCount, setCookedCount] = useState(0);
  const [daysActive, setDaysActive] = useState(1);

  useEffect(() => {
    getStoredUser().then((user) => {
      if (user) { setUserName(user.name ?? ""); setUserEmail(user.email ?? ""); }
    });
    getDaysActive().then(setDaysActive).catch(() => {});
    getPreferences().then((prefs) => setActivePrefs(prefs.length > 0 ? prefs : []));
  }, []);

  useFocusEffect(useCallback(() => {
    getItems().then((items) => setShoppingCount(items.length)).catch(() => {});
    AsyncStorage.getItem("cookedCount").then((val) => setCookedCount(val ? parseInt(val) : 0));
  }, []));

  const togglePref = (id: string) => {
    setActivePrefs((prev) => {
      const updated = prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id];
      savePreferences(updated);
      return updated;
    });
  };

  const handleLogout = () => {
    Alert.alert("Çıkış Yap", "Hesabından çıkmak istediğine emin misin?", [
      { text: "İptal", style: "cancel" },
      { text: "Çıkış Yap", style: "destructive", onPress: async () => { await logout(); router.replace("/(auth)/login"); } },
    ]);
  };

  const badge = getBadge(cookedCount);
  const nextMilestone = cookedCount < 10 ? 10 : cookedCount < 20 ? 20 : cookedCount < 30 ? 30 : null;
  const initial = userName ? userName[0].toUpperCase() : "?";

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{initial}</Text>
        </View>
        <Text style={styles.name}>{userName || "Kullanıcı"}</Text>
        <Text style={styles.email}>{userEmail}</Text>

        {/* Stats strip */}
        <View style={styles.statsStrip}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{daysActive}</Text>
            <Text style={styles.statLabel}>Gün Aktif</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{cookedCount}</Text>
            <Text style={styles.statLabel}>Tarif Denendi</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{shoppingCount}</Text>
            <Text style={styles.statLabel}>Listede Ürün</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* Badge card */}
        <View style={[styles.badgeCard, { borderLeftColor: badge.color }]}>
          <View style={[styles.badgeIconBox, { backgroundColor: badge.bg }]}>
            <Text style={styles.badgeEmoji}>{badge.emoji}</Text>
          </View>
          <View style={styles.badgeInfo}>
            <Text style={[styles.badgeTitle, { color: badge.color }]}>{badge.label}</Text>
            <Text style={styles.badgeDesc}>
              {nextMilestone
                ? `${nextMilestone - cookedCount} tarif daha yap → sonraki rozet`
                : "En yüksek rozete ulaştın! 🎉"}
            </Text>
          </View>
        </View>

        {/* Badge yolu */}
        <View style={styles.badgeTrack}>
          {[
            { emoji: "🌱", label: "Çırak", min: 0 },
            { emoji: "⭐", label: "Şef", min: 10 },
            { emoji: "🏆", label: "Pro", min: 20 },
            { emoji: "👨‍🍳", label: "Usta", min: 30 },
          ].map((b, i) => {
            const unlocked = cookedCount >= b.min;
            return (
              <View key={i} style={styles.badgeStep}>
                <View style={[styles.badgeCircle, unlocked && styles.badgeCircleActive]}>
                  <Text style={styles.badgeStepEmoji}>{b.emoji}</Text>
                </View>
                <Text style={[styles.badgeStepLabel, unlocked && styles.badgeStepLabelActive]}>{b.label}</Text>
                <Text style={styles.badgeStepMin}>{b.min}+</Text>
              </View>
            );
          })}
        </View>

        {/* Beslenme Tercihleri */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>🥦 Beslenme Tercihleri</Text>
          <Text style={styles.sectionSub}>Seçimlerine göre tarif önerileri sunulur</Text>
          <View style={styles.prefsGrid}>
            {dietPrefs.map((pref) => {
              const active = activePrefs.includes(pref.id);
              return (
                <TouchableOpacity
                  key={pref.id}
                  style={[styles.prefChip, active && styles.prefChipActive]}
                  onPress={() => togglePref(pref.id)}
                  activeOpacity={0.75}
                >
                  <Text style={[styles.prefText, active && styles.prefTextActive]}>{pref.label}</Text>
                  {active && <Text style={styles.prefCheck}>✓</Text>}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Ayarlar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚙️ Ayarlar</Text>
          <View style={styles.menuCard}>
            {menuItems.map((item, index) => (
              <TouchableOpacity
                key={item.id}
                style={[styles.menuItem, index < menuItems.length - 1 && styles.menuItemBorder]}
                onPress={async () => {
                  if (item.id === "notif") {
                    const izinVar = await izinIste();
                    if (!izinVar) { Alert.alert("İzin Gerekli", "Bildirimler için izin vermeniz gerekiyor."); return; }
                    Alert.alert("🔔 Bildirimler", "Günlük tarif bildirimi almak ister misin?", [
                      { text: "Kapat", style: "destructive", onPress: () => { bildirimiIptalEt(); Alert.alert("Kapatıldı."); } },
                      { text: "Aç", onPress: () => { gunlukTarifBildirimi(); Alert.alert("✅ Açık!"); } },
                    ]);
                  } else if (item.info) {
                    Alert.alert(item.label, item.info);
                  }
                }}
                activeOpacity={0.7}
              >
                <View style={styles.menuIconBox}>
                  <Text style={styles.menuIcon}>{item.icon}</Text>
                </View>
                <Text style={styles.menuLabel}>{item.label}</Text>
                <Text style={styles.menuArrow}>›</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <Text style={styles.logoutText}>🚪  Çıkış Yap</Text>
        </TouchableOpacity>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    backgroundColor: Colors.primary,
    paddingTop: 60, paddingBottom: 28,
    alignItems: "center", gap: 6,
    borderBottomLeftRadius: 28, borderBottomRightRadius: 28,
  },
  avatar: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: Colors.white,
    alignItems: "center", justifyContent: "center",
    marginBottom: 6,
    shadowColor: "#000", shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15, shadowRadius: 10, elevation: 5,
  },
  avatarText: { fontSize: 36, fontWeight: "800", color: Colors.primary },
  name: { fontSize: 22, fontWeight: "800", color: Colors.white },
  email: { fontSize: 14, color: "rgba(255,255,255,0.75)" },
  statsStrip: {
    flexDirection: "row", marginTop: 16,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 18, paddingVertical: 14, paddingHorizontal: 24,
    alignSelf: "stretch", marginHorizontal: 24,
  },
  statItem: { flex: 1, alignItems: "center", gap: 3 },
  statValue: { fontSize: 22, fontWeight: "800", color: Colors.white },
  statLabel: { fontSize: 11, color: "rgba(255,255,255,0.75)", textAlign: "center" },
  statDivider: { width: 1, height: 36, backgroundColor: "rgba(255,255,255,0.3)" },

  scrollContent: { paddingHorizontal: 20, paddingTop: 20, gap: 16 },

  // Badge card
  badgeCard: {
    backgroundColor: Colors.white, borderRadius: 18,
    padding: 18, flexDirection: "row", alignItems: "center", gap: 16,
    borderLeftWidth: 4,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  badgeIconBox: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  badgeEmoji: { fontSize: 30 },
  badgeInfo: { flex: 1, gap: 4 },
  badgeTitle: { fontSize: 17, fontWeight: "800" },
  badgeDesc: { fontSize: 13, color: Colors.subtext, lineHeight: 18 },

  // Badge track
  badgeTrack: {
    flexDirection: "row", justifyContent: "space-between",
    backgroundColor: Colors.white, borderRadius: 18, padding: 18,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  badgeStep: { alignItems: "center", gap: 6, flex: 1 },
  badgeCircle: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: Colors.borderLight,
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: Colors.border,
  },
  badgeCircleActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  badgeStepEmoji: { fontSize: 22 },
  badgeStepLabel: { fontSize: 11, color: Colors.subtext, fontWeight: "600", textAlign: "center" },
  badgeStepLabelActive: { color: Colors.primaryDark },
  badgeStepMin: { fontSize: 10, color: Colors.subtextLight },

  // Section
  section: { gap: 12 },
  sectionTitle: { fontSize: 17, fontWeight: "800", color: Colors.text },
  sectionSub: { fontSize: 13, color: Colors.subtext, marginTop: -6 },
  prefsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  prefChip: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: Colors.white, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 12,
    borderWidth: 1.5, borderColor: Colors.border,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  prefChipActive: { backgroundColor: Colors.primaryLight, borderColor: Colors.primary },
  prefText: { fontSize: 14, fontWeight: "600", color: Colors.subtext },
  prefTextActive: { color: Colors.primaryDark },
  prefCheck: { fontSize: 13, color: Colors.primary, fontWeight: "800" },

  // Menu
  menuCard: {
    backgroundColor: Colors.white, borderRadius: 18, overflow: "hidden",
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  menuItem: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 18, paddingVertical: 17, gap: 14,
  },
  menuItemBorder: { borderBottomWidth: 1, borderBottomColor: Colors.borderLight },
  menuIconBox: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: Colors.borderLight,
    alignItems: "center", justifyContent: "center",
  },
  menuIcon: { fontSize: 18 },
  menuLabel: { flex: 1, fontSize: 15, fontWeight: "600", color: Colors.text },
  menuArrow: { fontSize: 22, color: Colors.subtext, fontWeight: "300" },

  // Logout
  logoutBtn: {
    backgroundColor: Colors.white, borderRadius: 18,
    paddingVertical: 17, alignItems: "center",
    borderWidth: 1.5, borderColor: "#FCA5A5",
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  logoutText: { color: Colors.error, fontSize: 16, fontWeight: "700" },
});
