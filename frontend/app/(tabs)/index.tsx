import { useEffect, useState, useCallback, useRef } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, ActivityIndicator, Animated, Pressable, Image,
} from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants/theme";
import { getRecipes, Recipe } from "../../services/recipeService";
import { getStoredUser } from "../../services/authService";
import { getFavorites } from "../../services/favoritesService";
import { getPreferences } from "../../services/preferencesService";

const C = theme.colors;

const CATEGORY_FILTERS = [
  { label: "Tümü", icon: "apps-outline" as const },
  { label: "Çorba", icon: "water-outline" as const },
  { label: "Ana Yemek", icon: "restaurant-outline" as const },
  { label: "Tatlı", icon: "ice-cream-outline" as const },
  { label: "Diyet", icon: "leaf-outline" as const },
  { label: "Sporcu", icon: "barbell-outline" as const },
];

const prefMatchesRecipe = (pref: string, r: Recipe) => {
  const tag = (r.tag ?? "").toLowerCase();
  const cat = (r.category ?? "").toLowerCase();
  if (pref === "vegan") return tag === "vegan";
  if (pref === "sporcu") return tag === "sporcu" || cat === "sporcu";
  if (pref === "diyet") return tag === "diyet" || cat === "diyet";
  if (pref === "lowcarb") return parseInt(String(r.calories)) < 300;
  return false;
};

function AnimatedCard({ onPress, children, style }: any) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(scale, { toValue: 0.97, useNativeDriver: true, speed: 60 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 60 }).start();
  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

const DIFF_COLOR: Record<string, string> = {
  "Kolay": "#22C55E",
  "Orta": "#F59E0B",
  "Zor": "#EF4444",
};

export default function HomeScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Kullanıcı");
  const [selectedCategory, setSelectedCategory] = useState("Tümü");
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const [data, user] = await Promise.all([getRecipes(), getStoredUser()]);
        setRecipes(data);
        if (user?.name) setUserName(user.name.split(" ")[0]);
      } catch {
        setRecipes([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useFocusEffect(useCallback(() => {
    getFavorites().then(setFavorites).catch(() => {});
    getPreferences().then(setPreferences).catch(() => {});
  }, []));

  const filtered = selectedCategory === "Tümü"
    ? recipes
    : recipes.filter((r) => r.category === selectedCategory);

  const suggestions = (() => {
    const favIds = new Set(favorites.map((f) => f.id));
    let pool = recipes.filter((r) => !favIds.has(r.id));
    if (preferences.length > 0) {
      const byPref = pool.filter((r) => preferences.some((p) => prefMatchesRecipe(p, r)));
      if (byPref.length >= 3) pool = byPref;
    }
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 8);
  })();

  const today = new Date();
  const days = ["Paz", "Pzt", "Sal", "Çar", "Per", "Cum", "Cmt"];
  const months = ["Ocak","Şubat","Mart","Nisan","Mayıs","Haziran","Temmuz","Ağustos","Eylül","Ekim","Kasım","Aralık"];
  const dateStr = `${days[today.getDay()]} · ${today.getDate()} ${months[today.getMonth()]}`;

  // ── Recipe Card (image-forward, magazine style) ──────────
  const RecipeCard = ({ item }: { item: Recipe }) => (
    <AnimatedCard onPress={() => router.push(`/detail/${item.id}`)} style={styles.card}>
      <View style={styles.cardImg}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: C.primarySurface, alignItems: "center", justifyContent: "center" }]}>
            <Text style={{ fontSize: 54 }}>{item.emoji}</Text>
          </View>
        )}
        <LinearGradient
          colors={["transparent", "transparent", "rgba(0,0,0,0.78)"]}
          locations={[0, 0.35, 1]}
          style={StyleSheet.absoluteFillObject}
        />
        {item.tag && (
          <View style={[styles.cardBadge, { backgroundColor: item.tag === "Vegan" ? "#16A34A" : item.tag === "Sporcu" ? "#2563EB" : C.accent }]}>
            <Text style={styles.cardBadgeText}>{item.tag}</Text>
          </View>
        )}
        <View style={styles.cardFooter}>
          <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
          <View style={styles.cardMeta}>
            <View style={styles.metaPill}>
              <Ionicons name="flame" size={11} color="#FFB800" />
              <Text style={styles.metaText}>{item.calories}</Text>
            </View>
            <View style={styles.metaPill}>
              <Ionicons name="time-outline" size={11} color="rgba(255,255,255,0.75)" />
              <Text style={styles.metaText}>{item.time}</Text>
            </View>
            <View style={[styles.metaPill, { backgroundColor: `${DIFF_COLOR[item.difficulty] ?? "#888"}33` }]}>
              <Text style={[styles.metaText, { color: DIFF_COLOR[item.difficulty] ?? "#fff" }]}>{item.difficulty}</Text>
            </View>
          </View>
        </View>
      </View>
    </AnimatedCard>
  );

  // ── Wide Card (featured / horizontal list) ───────────────
  const WideCard = ({ item }: { item: Recipe }) => (
    <AnimatedCard onPress={() => router.push(`/detail/${item.id}`)} style={styles.wideCard}>
      <View style={styles.wideCardImg}>
        {item.imageUrl ? (
          <Image source={{ uri: item.imageUrl }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        ) : (
          <View style={[StyleSheet.absoluteFillObject, { backgroundColor: C.primarySurface, alignItems: "center", justifyContent: "center" }]}>
            <Text style={{ fontSize: 44 }}>{item.emoji}</Text>
          </View>
        )}
        <LinearGradient colors={["transparent", "rgba(0,0,0,0.7)"]} style={StyleSheet.absoluteFillObject} />
        <View style={styles.wideCatPill}>
          <Text style={styles.wideCatText}>{item.category}</Text>
        </View>
      </View>
      <View style={styles.wideCardBody}>
        <Text style={styles.wideCardName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.wideCardMeta}>
          <Ionicons name="flame" size={13} color={C.accent} />
          <Text style={styles.wideCardMetaText}>{item.calories} kal</Text>
          <Text style={styles.wideCardDot}>·</Text>
          <Ionicons name="time-outline" size={13} color={C.muted} />
          <Text style={styles.wideCardMetaText}>{item.time}</Text>
        </View>
      </View>
    </AnimatedCard>
  );

  const SectionTitle = ({ title, sub, onMore }: { title: string; sub?: string; onMore?: () => void }) => (
    <View style={styles.secHeader}>
      <View>
        <Text style={styles.secTitle}>{title}</Text>
        {sub ? <Text style={styles.secSub}>{sub}</Text> : null}
      </View>
      {onMore && (
        <TouchableOpacity onPress={onMore} style={styles.moreBtn} activeOpacity={0.7}>
          <Text style={styles.moreBtnText}>Tümü</Text>
          <Ionicons name="chevron-forward" size={14} color={C.primary} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.root}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── Header ── */}
        <LinearGradient colors={["#1B4332", "#2D6A4F"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerDate}>{dateStr}</Text>
              <Text style={styles.headerGreet}>Merhaba, {userName} 👋</Text>
            </View>
            <TouchableOpacity onPress={() => router.push("/(tabs)/profile")} activeOpacity={0.85}>
              <LinearGradient colors={["rgba(255,255,255,0.25)", "rgba(255,255,255,0.1)"]} style={styles.avatar}>
                <Text style={styles.avatarLetter}>{userName[0]?.toUpperCase()}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Search */}
          <TouchableOpacity style={styles.search} onPress={() => router.push("/results")} activeOpacity={0.9}>
            <Ionicons name="search-outline" size={17} color="#9CA3AF" />
            <Text style={styles.searchText}>Tarif veya malzeme ara...</Text>
            <View style={styles.searchFilter}>
              <Ionicons name="options-outline" size={15} color={C.primary} />
            </View>
          </TouchableOpacity>
        </LinearGradient>

        {/* ── Kategori filtreleri ── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={styles.filterContent}>
          {CATEGORY_FILTERS.map((f) => {
            const active = selectedCategory === f.label;
            return (
              <TouchableOpacity
                key={f.label}
                style={[styles.filterChip, active && styles.filterChipActive]}
                onPress={() => setSelectedCategory(f.label)}
                activeOpacity={0.75}
              >
                <Ionicons name={f.icon} size={14} color={active ? C.white : C.muted} />
                <Text style={[styles.filterLabel, active && styles.filterLabelActive]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* ── Featured (ilk tarif büyük kart) ── */}
        {!loading && filtered.length > 0 && (
          <TouchableOpacity
            style={styles.featured}
            onPress={() => router.push(`/detail/${filtered[0].id}`)}
            activeOpacity={0.93}
          >
            <View style={styles.featuredImg}>
              {filtered[0].imageUrl ? (
                <Image source={{ uri: filtered[0].imageUrl }} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
              ) : (
                <View style={[StyleSheet.absoluteFillObject, { backgroundColor: C.primarySurface, alignItems: "center", justifyContent: "center" }]}>
                  <Text style={{ fontSize: 80 }}>{filtered[0].emoji}</Text>
                </View>
              )}
              <LinearGradient
                colors={["rgba(0,0,0,0.15)", "transparent", "rgba(0,0,0,0.82)"]}
                locations={[0, 0.4, 1]}
                style={StyleSheet.absoluteFillObject}
              />
              <View style={styles.featuredTopRow}>
                <View style={styles.featuredBadge}>
                  <Ionicons name="star" size={11} color="#FFD700" />
                  <Text style={styles.featuredBadgeText}>Öne Çıkan</Text>
                </View>
                {filtered[0].tag && (
                  <View style={[styles.featuredTag, { backgroundColor: filtered[0].tag === "Vegan" ? "#16A34A" : "#2563EB" }]}>
                    <Text style={styles.featuredTagText}>{filtered[0].tag}</Text>
                  </View>
                )}
              </View>
              <View style={styles.featuredBottom}>
                <Text style={styles.featuredCat}>{filtered[0].category}</Text>
                <Text style={styles.featuredTitle}>{filtered[0].name}</Text>
                <View style={styles.featuredMetaRow}>
                  <View style={styles.metaPill}>
                    <Ionicons name="flame" size={12} color="#FFB800" />
                    <Text style={styles.metaText}>{filtered[0].calories} kal</Text>
                  </View>
                  <View style={styles.metaPill}>
                    <Ionicons name="time-outline" size={12} color="rgba(255,255,255,0.75)" />
                    <Text style={styles.metaText}>{filtered[0].time}</Text>
                  </View>
                  <View style={styles.metaPill}>
                    <Ionicons name="bar-chart-outline" size={12} color="rgba(255,255,255,0.75)" />
                    <Text style={styles.metaText}>{filtered[0].difficulty}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}

        {/* ── Tarifler ── */}
        <SectionTitle title="Tarifler" sub={`${filtered.length} tarif`} onMore={() => router.push("/results")} />

        {loading ? (
          <View style={styles.loadBox}>
            <ActivityIndicator color={C.primary} size="large" />
            <Text style={styles.loadText}>Tarifler yükleniyor...</Text>
          </View>
        ) : (
          <FlatList
            data={filtered.slice(1)}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listPad}
            renderItem={({ item }) => <RecipeCard item={item} />}
          />
        )}

        {/* ── Favorilerim ── */}
        <SectionTitle title="Favorilerim" sub={favorites.length > 0 ? `${favorites.length} kayıtlı tarif` : undefined} />

        {favorites.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="heart-outline" size={30} color={C.mutedLight} />
            <Text style={styles.emptyTitle}>Henüz favori yok</Text>
            <Text style={styles.emptySub}>Tarif detayında kalp ikonuna dokun</Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `fav-${item.id}`}
            contentContainerStyle={styles.listPad}
            renderItem={({ item }) => <WideCard item={item} />}
          />
        )}

        {/* ── Senin için ── */}
        <SectionTitle
          title="Senin İçin"
          sub={preferences.length > 0 ? preferences.map((p) =>
            p === "vegan" ? "Vegan" : p === "sporcu" ? "Sporcu" : p === "diyet" ? "Diyet" : "Low-carb"
          ).join(" · ") : "Kişiselleştirilmiş öneriler"}
          onMore={() => router.push("/(tabs)/profile")}
        />

        {suggestions.length === 0 ? (
          <TouchableOpacity style={styles.emptyBox} onPress={() => router.push("/(tabs)/profile")} activeOpacity={0.8}>
            <Ionicons name="options-outline" size={30} color={C.mutedLight} />
            <Text style={styles.emptyTitle}>Tercihlerini belirle</Text>
            <Text style={styles.emptySub}>Profil → beslenme tercihlerin</Text>
          </TouchableOpacity>
        ) : (
          <FlatList
            data={suggestions}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `sug-${item.id}`}
            contentContainerStyle={styles.listPad}
            renderItem={({ item }) => <RecipeCard item={item} />}
          />
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F8F7F4" },

  // Header
  header: { paddingTop: 56, paddingBottom: 24, paddingHorizontal: 22, gap: 16, borderBottomLeftRadius: 32, borderBottomRightRadius: 32 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  headerDate: { fontSize: 12, color: "rgba(255,255,255,0.6)", fontWeight: "600", letterSpacing: 0.5, textTransform: "uppercase" },
  headerGreet: { fontSize: 24, fontWeight: "800", color: "#fff", marginTop: 2, letterSpacing: -0.3 },
  avatar: { width: 44, height: 44, borderRadius: 22, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: "rgba(255,255,255,0.4)" },
  avatarLetter: { fontSize: 18, fontWeight: "800", color: "#fff" },
  search: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 16, paddingHorizontal: 16, paddingVertical: 13, gap: 10 },
  searchText: { flex: 1, fontSize: 14, color: "#9CA3AF" },
  searchFilter: { width: 30, height: 30, borderRadius: 9, backgroundColor: "#E8F5E9", alignItems: "center", justifyContent: "center" },

  // Filters
  filterRow: { paddingTop: 20 },
  filterContent: { paddingHorizontal: 22, gap: 8 },
  filterChip: { flexDirection: "row", alignItems: "center", gap: 6, backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 14, paddingVertical: 9, borderWidth: 1.5, borderColor: "#E5E7EB" },
  filterChipActive: { backgroundColor: "#1B4332", borderColor: "#1B4332" },
  filterLabel: { fontSize: 13, fontWeight: "700", color: C.muted },
  filterLabelActive: { color: "#fff" },

  // Featured
  featured: { marginHorizontal: 22, marginTop: 22, borderRadius: 24, overflow: "hidden", height: 260 },
  featuredImg: { flex: 1 },
  featuredTopRow: { position: "absolute", top: 14, left: 14, right: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  featuredBadge: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(0,0,0,0.45)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  featuredBadgeText: { color: "#FFD700", fontSize: 11, fontWeight: "700" },
  featuredTag: { borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  featuredTagText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  featuredBottom: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 18 },
  featuredCat: { fontSize: 11, color: "rgba(255,255,255,0.65)", fontWeight: "700", letterSpacing: 1, textTransform: "uppercase", marginBottom: 5 },
  featuredTitle: { fontSize: 22, fontWeight: "800", color: "#fff", letterSpacing: -0.3, marginBottom: 10 },
  featuredMetaRow: { flexDirection: "row", gap: 6 },

  // Section
  secHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 22, marginTop: 30, marginBottom: 14 },
  secTitle: { fontSize: 19, fontWeight: "800", color: "#111827", letterSpacing: -0.2 },
  secSub: { fontSize: 12, color: C.muted, marginTop: 2 },
  moreBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  moreBtnText: { fontSize: 13, color: C.primary, fontWeight: "700" },

  // Card (vertical, magazine)
  listPad: { paddingHorizontal: 22, gap: 12, paddingBottom: 4 },
  card: { width: 185, borderRadius: 20, overflow: "hidden", backgroundColor: "#111" },
  cardImg: { height: 235, width: "100%" },
  cardBadge: { position: "absolute", top: 12, right: 12, borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  cardBadgeText: { color: "#fff", fontSize: 10, fontWeight: "800" },
  cardFooter: { position: "absolute", bottom: 0, left: 0, right: 0, padding: 12 },
  cardName: { fontSize: 15, fontWeight: "700", color: "#fff", lineHeight: 21, marginBottom: 8 },
  cardMeta: { flexDirection: "row", gap: 5, flexWrap: "wrap" },
  metaPill: { flexDirection: "row", alignItems: "center", gap: 4, backgroundColor: "rgba(255,255,255,0.18)", borderRadius: 7, paddingHorizontal: 7, paddingVertical: 3 },
  metaText: { fontSize: 11, color: "#fff", fontWeight: "600" },

  // Wide card (favorites)
  wideCard: { width: 220, borderRadius: 20, overflow: "hidden", backgroundColor: "#fff", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  wideCardImg: { height: 130 },
  wideCatPill: { position: "absolute", bottom: 10, left: 10, backgroundColor: "rgba(0,0,0,0.5)", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  wideCatText: { color: "#fff", fontSize: 11, fontWeight: "700" },
  wideCardBody: { padding: 12 },
  wideCardName: { fontSize: 14, fontWeight: "700", color: "#111827" },
  wideCardMeta: { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 6 },
  wideCardMetaText: { fontSize: 12, color: C.muted, fontWeight: "600" },
  wideCardDot: { color: C.muted, fontSize: 12 },

  // Loading
  loadBox: { alignItems: "center", paddingVertical: 40, gap: 10 },
  loadText: { color: C.muted, fontSize: 14 },

  // Empty
  emptyBox: { marginHorizontal: 22, backgroundColor: "#fff", borderRadius: 20, paddingVertical: 30, alignItems: "center", gap: 8, borderWidth: 1.5, borderColor: "#F3F4F6", borderStyle: "dashed" },
  emptyTitle: { fontSize: 15, fontWeight: "700", color: "#374151" },
  emptySub: { fontSize: 13, color: C.muted },
});
