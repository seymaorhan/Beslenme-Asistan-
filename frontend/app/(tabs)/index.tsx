import { useEffect, useState, useCallback, useRef } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, ActivityIndicator, Animated, Pressable,
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

const categories = [
  { id: "1", emoji: "🍲", label: "Çorba" },
  { id: "2", emoji: "🍗", label: "Ana Yemek" },
  { id: "3", emoji: "🍰", label: "Tatlı" },
  { id: "4", emoji: "🥗", label: "Diyet" },
  { id: "5", emoji: "💪", label: "Sporcu" },
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

// Animated card press wrapper
function AnimatedCard({ onPress, children, style }: any) {
  const scale = useRef(new Animated.Value(1)).current;
  const pressIn = () => Animated.spring(scale, { toValue: 0.96, useNativeDriver: true, speed: 50 }).start();
  const pressOut = () => Animated.spring(scale, { toValue: 1, useNativeDriver: true, speed: 50 }).start();
  return (
    <Pressable onPress={onPress} onPressIn={pressIn} onPressOut={pressOut}>
      <Animated.View style={[{ transform: [{ scale }] }, style]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Kullanıcı");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<Recipe[]>([]);
  const [preferences, setPreferences] = useState<string[]>([]);

  useEffect(() => {
    const init = async () => {
      try {
        const [data, user] = await Promise.all([getRecipes(), getStoredUser()]);
        setRecipes(data.length > 0 ? data : mockRecipes);
        if (user?.name) setUserName(user.name.split(" ")[0]);
      } catch {
        setRecipes(mockRecipes);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  useFocusEffect(useCallback(() => {
    getFavorites().then(setFavorites);
    getPreferences().then(setPreferences);
  }, []));

  const filtered = recipes.filter((r) =>
    selectedCategory ? r.category === selectedCategory : true
  );

  const suggestions = (() => {
    const favIds = new Set(favorites.map((f) => f.id));
    let pool = recipes.filter((r) => !favIds.has(r.id));
    if (preferences.length > 0) {
      const byPref = pool.filter((r) => preferences.some((p) => prefMatchesRecipe(p, r)));
      if (byPref.length >= 3) pool = byPref;
    } else {
      const favCats = [...new Set(favorites.map((f) => f.category))];
      if (favCats.length > 0) {
        const byCat = pool.filter((r) => favCats.includes(r.category));
        if (byCat.length >= 3) pool = byCat;
      }
    }
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 6);
  })();

  const RecipeCard = ({ item, accentColor }: { item: Recipe; accentColor?: string }) => (
    <AnimatedCard onPress={() => router.push(`/detail/${item.id}`)} style={styles.card}>
      <View style={[styles.cardImageBox, { backgroundColor: accentColor ?? C.primaryLight }]}>
        <Text style={styles.cardEmoji}>{item.emoji}</Text>
        <LinearGradient
          colors={["transparent", "rgba(0,0,0,0.55)"]}
          style={styles.cardGradient}
        />
        <View style={styles.cardOverlayBottom}>
          <View style={styles.cardCatPill}>
            <Text style={styles.cardCatText}>{item.category}</Text>
          </View>
        </View>
        {item.tag && (
          <View style={styles.cardTagPill}>
            <Text style={styles.cardTagText}>{item.tag}</Text>
          </View>
        )}
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.cardMeta}>
          <View style={styles.metaChip}>
            <Ionicons name="flame-outline" size={12} color={C.muted} />
            <Text style={styles.metaChipText}>{item.calories} kal</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="time-outline" size={12} color={C.muted} />
            <Text style={styles.metaChipText}>{item.time}</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="bar-chart-outline" size={12} color={C.muted} />
            <Text style={styles.metaChipText}>{item.difficulty}</Text>
          </View>
        </View>
      </View>
    </AnimatedCard>
  );

  const SectionHeader = ({ title, onSeeAll, count }: { title: string; onSeeAll?: () => void; count?: number }) => (
    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        {count !== undefined && count > 0 && (
          <Text style={styles.sectionCount}>{count} tarif</Text>
        )}
      </View>
      {onSeeAll && (
        <TouchableOpacity onPress={onSeeAll} style={styles.seeAllBtn}>
          <Text style={styles.seeAllText}>Tümü</Text>
          <Ionicons name="chevron-forward" size={14} color={C.primary} />
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <ScrollView showsVerticalScrollIndicator={false} bounces>

        {/* ── Hero Header ── */}
        <LinearGradient
          colors={[C.primary, C.primaryDark]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <View style={styles.heroTop}>
            <View style={styles.heroText}>
              <Text style={styles.heroGreeting}>Merhaba, {userName} 👋</Text>
              <Text style={styles.heroSub}>Ne pişirelim bugün?</Text>
            </View>
            <TouchableOpacity
              style={styles.avatarBtn}
              onPress={() => router.push("/(tabs)/profile")}
              activeOpacity={0.85}
            >
              <LinearGradient
                colors={["rgba(255,255,255,0.3)", "rgba(255,255,255,0.15)"]}
                style={styles.avatar}
              >
                <Text style={styles.avatarText}>{userName[0].toUpperCase()}</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* Search bar */}
          <TouchableOpacity
            style={styles.searchBar}
            onPress={() => router.push("/results")}
            activeOpacity={0.95}
          >
            <Ionicons name="search-outline" size={18} color={C.mutedLight} />
            <Text style={styles.searchPlaceholder}>Tarif, malzeme veya kategori...</Text>
            <View style={styles.searchFilterBtn}>
              <Ionicons name="options-outline" size={16} color={C.primary} />
            </View>
          </TouchableOpacity>
        </LinearGradient>

        {/* ── Kategoriler ── */}
        <View style={styles.categoriesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesRow}>
            {categories.map((cat) => {
              const active = selectedCategory === cat.label;
              return (
                <TouchableOpacity
                  key={cat.id}
                  style={[styles.catChip, active && styles.catChipActive]}
                  onPress={() => setSelectedCategory(active ? null : cat.label)}
                  activeOpacity={0.75}
                >
                  <Text style={styles.catEmoji}>{cat.emoji}</Text>
                  <Text style={[styles.catLabel, active && styles.catLabelActive]}>{cat.label}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Popüler Tarifler ── */}
        <SectionHeader
          title="🔥 Popüler Tarifler"
          onSeeAll={() => router.push("/results")}
        />

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator color={C.primary} size="large" />
            <Text style={styles.loadingText}>Tarifler yükleniyor...</Text>
          </View>
        ) : (
          <FlatList
            data={filtered}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.cardsRow}
            renderItem={({ item }) => <RecipeCard item={item} />}
          />
        )}

        {/* ── Favorilerim ── */}
        <SectionHeader title="❤️ Favorilerim" count={favorites.length} />

        {favorites.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="heart-outline" size={32} color={C.mutedLight} />
            </View>
            <Text style={styles.emptyTitle}>Henüz favori eklenmedi</Text>
            <Text style={styles.emptyHint}>Tarif detayında ♡ ikonuna dokun</Text>
          </View>
        ) : (
          <FlatList
            data={favorites}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `fav-${item.id}`}
            contentContainerStyle={styles.cardsRow}
            renderItem={({ item }) => <RecipeCard item={item} accentColor="#FFF3E0" />}
          />
        )}

        {/* ── Beğenebileceğin Tarifler ── */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>✨ Senin İçin</Text>
            {preferences.length > 0 && (
              <Text style={styles.sectionCount}>
                {preferences.map((p) =>
                  p === "vegan" ? "Vegan" : p === "sporcu" ? "Sporcu" :
                  p === "diyet" ? "Diyet" : "Low-carb"
                ).join(" · ")}
              </Text>
            )}
          </View>
          <TouchableOpacity onPress={() => router.push("/(tabs)/profile")} style={styles.seeAllBtn}>
            <Text style={styles.seeAllText}>Tercihleri Düzenle</Text>
            <Ionicons name="chevron-forward" size={14} color={C.primary} />
          </TouchableOpacity>
        </View>

        {suggestions.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIconBox}>
              <Ionicons name="star-outline" size={32} color={C.mutedLight} />
            </View>
            <Text style={styles.emptyTitle}>Tercihlerine göre öneri yok</Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => router.push("/(tabs)/profile")}
            >
              <Text style={styles.emptyBtnText}>Profilde Tercih Seç →</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={suggestions}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => `sug-${item.id}`}
            contentContainerStyle={styles.cardsRow}
            renderItem={({ item }) => <RecipeCard item={item} accentColor="#EDE7F6" />}
          />
        )}

        <View style={{ height: 36 }} />
      </ScrollView>
    </View>
  );
}

const mockRecipes: Recipe[] = [
  { id: "1", emoji: "🍝", name: "Domates Soslu Makarna", calories: 380, time: "20 dk", difficulty: "Kolay", category: "Ana Yemek", tag: "Vegan", ingredients: [], steps: [] },
  { id: "2", emoji: "🥘", name: "Tavuk Sote", calories: 320, time: "35 dk", difficulty: "Orta", category: "Ana Yemek", tag: "Sporcu", ingredients: [], steps: [] },
  { id: "3", emoji: "🥗", name: "Akdeniz Salatası", calories: 140, time: "10 dk", difficulty: "Kolay", category: "Diyet", tag: "Diyet", ingredients: [], steps: [] },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.background },

  // Hero
  hero: {
    paddingHorizontal: 22,
    paddingTop: 58,
    paddingBottom: 26,
    gap: 16,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  heroText: { gap: 4 },
  heroGreeting: { fontSize: 26, fontWeight: "800", color: C.white, letterSpacing: -0.3 },
  heroSub: { fontSize: 14, color: "rgba(255,255,255,0.75)" },
  avatarBtn: {},
  avatar: {
    width: 46, height: 46, borderRadius: 23,
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "rgba(255,255,255,0.5)",
  },
  avatarText: { fontSize: 18, fontWeight: "800", color: C.white },
  searchBar: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: C.white, borderRadius: 16,
    paddingHorizontal: 16, paddingVertical: 13,
    gap: 10, ...theme.shadow.md,
  },
  searchPlaceholder: { flex: 1, fontSize: 14, color: C.mutedLight },
  searchFilterBtn: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: C.primaryLight,
    alignItems: "center", justifyContent: "center",
  },

  // Categories
  categoriesSection: { paddingTop: 20 },
  categoriesRow: { paddingHorizontal: 22, gap: 10 },
  catChip: {
    flexDirection: "row", alignItems: "center", gap: 7,
    backgroundColor: C.white, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 11,
    borderWidth: 1.5, borderColor: C.border,
    ...theme.shadow.sm,
  },
  catChipActive: { backgroundColor: C.primary, borderColor: C.primary },
  catEmoji: { fontSize: 18 },
  catLabel: { fontSize: 13, fontWeight: "700", color: C.text },
  catLabelActive: { color: C.white },

  // Section headers
  sectionHeader: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 22, marginTop: 28, marginBottom: 14,
  },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: C.text, letterSpacing: -0.2 },
  sectionCount: { fontSize: 13, color: C.muted, marginTop: 2 },
  seeAllBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  seeAllText: { fontSize: 14, color: C.primary, fontWeight: "700" },

  // Cards
  cardsRow: { paddingHorizontal: 22, gap: 14, paddingBottom: 6 },
  card: {
    backgroundColor: C.card, borderRadius: 20, width: 210,
    overflow: "hidden", ...theme.shadow.md,
  },
  cardImageBox: {
    height: 140, alignItems: "center", justifyContent: "center",
  },
  cardEmoji: { fontSize: 60, zIndex: 1 },
  cardGradient: {
    position: "absolute", bottom: 0, left: 0, right: 0, height: 60,
  },
  cardOverlayBottom: {
    position: "absolute", bottom: 8, left: 10,
  },
  cardCatPill: {
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  cardCatText: { color: C.white, fontSize: 11, fontWeight: "700" },
  cardTagPill: {
    position: "absolute", top: 8, right: 10,
    backgroundColor: C.primary,
    borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3,
  },
  cardTagText: { color: C.white, fontSize: 10, fontWeight: "700" },
  cardBody: { padding: 14, gap: 10 },
  cardName: { fontSize: 15, fontWeight: "700", color: C.text, lineHeight: 21 },
  cardMeta: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  metaChip: {
    flexDirection: "row", alignItems: "center", gap: 4,
    backgroundColor: C.borderLight, borderRadius: 8,
    paddingHorizontal: 8, paddingVertical: 4,
  },
  metaChipText: { fontSize: 11, color: C.muted, fontWeight: "600" },

  // Loading
  loadingBox: { alignItems: "center", paddingVertical: 40, gap: 12 },
  loadingText: { fontSize: 14, color: C.muted },

  // Empty states
  emptyCard: {
    marginHorizontal: 22, backgroundColor: C.card,
    borderRadius: 20, paddingVertical: 32, alignItems: "center", gap: 8,
    borderWidth: 1.5, borderColor: C.borderLight, borderStyle: "dashed",
  },
  emptyIconBox: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: C.borderLight,
    alignItems: "center", justifyContent: "center",
    marginBottom: 4,
  },
  emptyTitle: { fontSize: 15, color: C.text, fontWeight: "700" },
  emptyHint: { fontSize: 13, color: C.muted },
  emptyBtn: {
    marginTop: 6, backgroundColor: C.primaryLight,
    borderRadius: 12, paddingHorizontal: 18, paddingVertical: 10,
  },
  emptyBtnText: { fontSize: 13, color: C.primary, fontWeight: "700" },
});
