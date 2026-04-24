import { useState } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  ScrollView, FlatList,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../../constants/colors";

const suggestions = ["Domates", "Soğan", "Sarımsak", "Zeytinyağı", "Tavuk", "Patates", "Biber", "Maydanoz"];

export default function IngredientsScreen() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [ingredients, setIngredients] = useState<string[]>([]);

  const addIngredient = (value?: string) => {
    const item = (value ?? input).trim();
    if (!item || ingredients.includes(item)) return;
    setIngredients((prev) => [...prev, item]);
    setInput("");
  };

  const removeIngredient = (item: string) => setIngredients((prev) => prev.filter((i) => i !== item));

  const handleFind = () => {
    router.push({ pathname: "/results", params: { ingredients: JSON.stringify(ingredients) } });
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.title}>🥦 Malzemelerini Ekle</Text>
        <Text style={styles.subtitle}>Elindeki malzemeleri gir, tarif bulalım</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.inputSection}>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Malzeme adı gir..."
              placeholderTextColor={Colors.subtextLight}
              value={input}
              onChangeText={setInput}
              onSubmitEditing={() => addIngredient()}
              returnKeyType="done"
            />
            <TouchableOpacity
              style={[styles.addBtn, !input.trim() && styles.addBtnDisabled]}
              onPress={() => addIngredient()}
              disabled={!input.trim()}
              activeOpacity={0.8}
            >
              <Text style={styles.addBtnText}>+ Ekle</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.sectionLabel}>⚡ Hızlı Ekle</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.suggestionsRow} style={{ flexGrow: 0 }}>
          {suggestions.filter((s) => !ingredients.includes(s)).map((s) => (
            <TouchableOpacity key={s} style={styles.suggestionChip} onPress={() => addIngredient(s)} activeOpacity={0.75}>
              <Text style={styles.suggestionText}>+ {s}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.listHeaderRow}>
          <Text style={styles.sectionLabel}>✅ Eklenenler ({ingredients.length})</Text>
          {ingredients.length > 0 && (
            <TouchableOpacity onPress={() => setIngredients([])} style={styles.clearAllBtn}>
              <Text style={styles.clearAllText}>Temizle</Text>
            </TouchableOpacity>
          )}
        </View>

        {ingredients.length === 0 ? (
          <View style={styles.emptyBox}>
            <Text style={styles.emptyEmoji}>🥕</Text>
            <Text style={styles.emptyTitle}>Henüz malzeme eklenmedi</Text>
            <Text style={styles.emptyHint}>Yukarıdan ekle veya hızlı seç</Text>
          </View>
        ) : (
          <FlatList
            data={ingredients}
            keyExtractor={(item) => item}
            scrollEnabled={false}
            contentContainerStyle={styles.ingredientsList}
            renderItem={({ item }) => (
              <View style={styles.ingredientItem}>
                <View style={styles.ingredientDot} />
                <Text style={styles.ingredientName}>{item}</Text>
                <TouchableOpacity onPress={() => removeIngredient(item)} style={styles.removeBtn} activeOpacity={0.7}>
                  <Text style={styles.removeBtnText}>✕</Text>
                </TouchableOpacity>
              </View>
            )}
          />
        )}

        <View style={{ height: 140 }} />
      </ScrollView>

      {ingredients.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.findBtn} onPress={handleFind} activeOpacity={0.85}>
            <Text style={styles.findBtnEmoji}>🔍</Text>
            <Text style={styles.findBtnText}>Tarif Bul ({ingredients.length} malzeme)</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary, paddingHorizontal: 24,
    paddingTop: 58, paddingBottom: 24, gap: 6,
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  title: { fontSize: 26, fontWeight: "800", color: Colors.white },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.8)" },
  inputSection: { paddingHorizontal: 20, paddingTop: 20 },
  inputRow: { flexDirection: "row", gap: 10 },
  input: {
    flex: 1, backgroundColor: Colors.white, borderRadius: 16,
    paddingHorizontal: 18, paddingVertical: 14, fontSize: 15, color: Colors.text,
    borderWidth: 1.5, borderColor: Colors.border,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  addBtn: {
    backgroundColor: Colors.primary, borderRadius: 16, paddingHorizontal: 20, justifyContent: "center",
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  addBtnDisabled: { backgroundColor: Colors.border, shadowOpacity: 0, elevation: 0 },
  addBtnText: { color: Colors.white, fontWeight: "700", fontSize: 15 },
  sectionLabel: { fontSize: 16, fontWeight: "700", color: Colors.text, marginHorizontal: 20, marginTop: 24, marginBottom: 12 },
  suggestionsRow: { paddingHorizontal: 20, gap: 8, alignItems: "center" },
  suggestionChip: {
    backgroundColor: Colors.white, borderRadius: 22, paddingHorizontal: 16, paddingVertical: 9,
    borderWidth: 1.5, borderColor: Colors.primaryLight,
    shadowColor: "#000", shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1,
  },
  suggestionText: { color: Colors.primaryDark, fontWeight: "600", fontSize: 13 },
  listHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginRight: 20 },
  clearAllBtn: { marginTop: 24, paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#FEE2E2", borderRadius: 10 },
  clearAllText: { fontSize: 13, color: Colors.error, fontWeight: "600" },
  emptyBox: { alignItems: "center", paddingVertical: 40, gap: 8 },
  emptyEmoji: { fontSize: 52 },
  emptyTitle: { fontSize: 16, color: Colors.text, fontWeight: "700" },
  emptyHint: { fontSize: 13, color: Colors.subtext },
  ingredientsList: { paddingHorizontal: 20, gap: 10 },
  ingredientItem: {
    flexDirection: "row", alignItems: "center", backgroundColor: Colors.white,
    borderRadius: 16, paddingHorizontal: 16, paddingVertical: 15, gap: 12,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  ingredientDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary },
  ingredientName: { flex: 1, fontSize: 15, fontWeight: "600", color: Colors.text },
  removeBtn: { backgroundColor: Colors.borderLight, borderRadius: 8, padding: 6 },
  removeBtnText: { fontSize: 13, color: Colors.subtext, fontWeight: "700" },
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    padding: 20, paddingBottom: 30, backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
    shadowColor: "#000", shadowOffset: { width: 0, height: -4 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 8,
  },
  findBtn: {
    backgroundColor: Colors.primary, paddingVertical: 17, borderRadius: 18,
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6,
  },
  findBtnEmoji: { fontSize: 18 },
  findBtnText: { color: Colors.white, fontSize: 17, fontWeight: "700" },
});
