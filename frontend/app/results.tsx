import { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ScrollView, TextInput, ActivityIndicator,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../constants/colors";
import { getRecipes, Recipe } from "../services/recipeService";
import { searchByIngredients, RecipeWithMatch } from "../services/ingredientService";

const tags = ["Tümü", "Vegan", "Sporcu", "Diyet"];

export default function ResultsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ search?: string; ingredients?: string }>();
  const [recipes, setRecipes] = useState<(Recipe | RecipeWithMatch)[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState(params.search ?? "");
  const [activeTag, setActiveTag] = useState("Tümü");

  const ingredientMode = !!params.ingredients;
  const passedIngredients: string[] = params.ingredients ? JSON.parse(params.ingredients) : [];

  useEffect(() => {
    if (ingredientMode && passedIngredients.length > 0) {
      searchByIngredients(passedIngredients).then(setRecipes).catch(() => setRecipes([])).finally(() => setLoading(false));
    } else {
      getRecipes().then(setRecipes).catch(() => setRecipes([])).finally(() => setLoading(false));
    }
  }, []);

  const filtered = recipes.filter((r) => {
    const matchSearch = r.name.toLowerCase().includes(search.toLowerCase());
    const matchTag = activeTag === "Tümü" || r.tag === activeTag;
    return matchSearch && matchTag;
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>‹</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>{ingredientMode ? "Eşleşen Tarifler" : "Tüm Tarifler"}</Text>
          <Text style={styles.subtitle}>{ingredientMode ? `${passedIngredients.length} malzeme · ${filtered.length} sonuç` : `${filtered.length} tarif bulundu`}</Text>
        </View>
      </View>

      <View style={styles.searchBar}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput style={styles.searchInput} placeholder="Tarif adı ara..." placeholderTextColor={Colors.subtextLight} value={search} onChangeText={setSearch} autoCapitalize="none" />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")} style={styles.clearBtn}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filtersRow} style={{ flexGrow: 0 }}>
        {tags.map((t) => (
          <TouchableOpacity key={t} style={[styles.filterChip, activeTag === t && styles.filterChipActive]} onPress={() => setActiveTag(t)} activeOpacity={0.75}>
            <Text style={[styles.filterText, activeTag === t && styles.filterTextActive]}>{t}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Tarifler aranıyor...</Text>
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>🍽️</Text>
          <Text style={styles.emptyTitle}>Tarif bulunamadı</Text>
          <Text style={styles.emptyHint}>Farklı bir arama dene</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => router.push(`/detail/${item.id}`)} activeOpacity={0.75}>
              <View style={styles.imageBox}>
                <Text style={styles.emoji}>{item.emoji}</Text>
                <View style={styles.catLabel}><Text style={styles.catLabelText}>{item.category}</Text></View>
                {"matchPercent" in item ? (
                  <View style={[styles.badge, { backgroundColor: Colors.primary }]}><Text style={styles.badgeText}>%{(item as RecipeWithMatch).matchPercent} eşleşme</Text></View>
                ) : item.tag ? (
                  <View style={styles.badge}><Text style={styles.badgeText}>{item.tag}</Text></View>
                ) : null}
              </View>
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.metaRow}>
                  <View style={styles.metaPill}><Text style={styles.metaText}>🔥 {item.calories} kal</Text></View>
                  <View style={styles.metaPill}><Text style={styles.metaText}>⏱ {item.time}</Text></View>
                  <View style={styles.metaPill}><Text style={styles.metaText}>📊 {item.difficulty}</Text></View>
                </View>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: "row", alignItems: "center", paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, gap: 14, backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 42, height: 42, borderRadius: 14, backgroundColor: Colors.borderLight, alignItems: "center", justifyContent: "center" },
  backIcon: { fontSize: 28, color: Colors.text, fontWeight: "300", lineHeight: 34 },
  headerCenter: { flex: 1 },
  title: { fontSize: 22, fontWeight: "800", color: Colors.text },
  subtitle: { fontSize: 13, color: Colors.subtext, marginTop: 2 },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.white, marginHorizontal: 20, marginVertical: 14, borderRadius: 16, paddingHorizontal: 16, paddingVertical: 13, gap: 10, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  searchIcon: { fontSize: 16 },
  searchInput: { flex: 1, fontSize: 15, color: Colors.text },
  clearBtn: { padding: 4 },
  clearIcon: { fontSize: 16, color: Colors.subtext },
  filtersRow: { paddingHorizontal: 20, gap: 10, paddingBottom: 14 },
  filterChip: { paddingHorizontal: 20, paddingVertical: 9, borderRadius: 22, backgroundColor: Colors.white, borderWidth: 1.5, borderColor: Colors.border },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 14, fontWeight: "600", color: Colors.subtext },
  filterTextActive: { color: Colors.white },
  loadingBox: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14 },
  loadingText: { fontSize: 15, color: Colors.subtext },
  emptyBox: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 17, color: Colors.text, fontWeight: "700" },
  emptyHint: { fontSize: 14, color: Colors.subtext },
  list: { paddingHorizontal: 20, gap: 16, paddingTop: 4, paddingBottom: 32 },
  card: { backgroundColor: Colors.white, borderRadius: 20, overflow: "hidden", shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 12, elevation: 4 },
  imageBox: { height: 150, backgroundColor: Colors.primaryLight, alignItems: "center", justifyContent: "center" },
  emoji: { fontSize: 68 },
  catLabel: { position: "absolute", bottom: 10, left: 12, backgroundColor: "rgba(0,0,0,0.45)", borderRadius: 8, paddingHorizontal: 10, paddingVertical: 4 },
  catLabelText: { color: Colors.white, fontSize: 12, fontWeight: "600" },
  badge: { position: "absolute", top: 10, right: 12, backgroundColor: Colors.primaryDark, borderRadius: 10, paddingHorizontal: 10, paddingVertical: 4 },
  badgeText: { color: Colors.white, fontSize: 11, fontWeight: "800" },
  info: { padding: 16, gap: 10 },
  name: { fontSize: 17, fontWeight: "700", color: Colors.text },
  metaRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  metaPill: { backgroundColor: Colors.borderLight, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  metaText: { fontSize: 12, color: Colors.subtext, fontWeight: "600" },
});
