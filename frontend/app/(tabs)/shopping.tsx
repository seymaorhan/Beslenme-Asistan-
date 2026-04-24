import { useState, useCallback } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, Share, ActivityIndicator, RefreshControl,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { useFocusEffect } from "expo-router";
import { Colors } from "../../constants/colors";
import { getItems, toggleItem, deleteItem, ShoppingItem } from "../../services/shoppingService";

export default function ShoppingScreen() {
  const [items, setItems] = useState<ShoppingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchItems = async () => {
    try {
      const data = await getItems();
      setItems(data);
    } catch {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(useCallback(() => { setLoading(true); fetchItems(); }, []));

  const handleToggle = async (id: string) => {
    try {
      const updated = await toggleItem(id);
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
    } catch {}
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    } catch {}
  };

  const clearAll = () => {
    Alert.alert("Listeyi Temizle", "Tüm ürünler silinecek. Emin misin?", [
      { text: "İptal", style: "cancel" },
      { text: "Temizle", style: "destructive", onPress: async () => { for (const item of items) await deleteItem(item.id).catch(() => {}); setItems([]); } },
    ]);
  };

  const handleShare = async () => {
    const text = items.map((i) => `${i.checked ? "✅" : "⬜"} ${i.name}`).join("\n");
    await Share.share({ message: `🛒 Alışveriş Listem\n\n${text}` });
  };

  const checkedCount = items.filter((i) => i.checked).length;
  const progress = items.length > 0 ? checkedCount / items.length : 0;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <View>
          <Text style={styles.title}>🛒 Alışveriş</Text>
          <Text style={styles.subtitle}>
            {items.length === 0 ? "Liste boş" : `${checkedCount} / ${items.length} tamamlandı`}
          </Text>
        </View>
        {items.length > 0 && (
          <View style={styles.percentBadge}>
            <Text style={styles.percentText}>%{Math.round(progress * 100)}</Text>
          </View>
        )}
      </View>

      {items.length > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` as any }]} />
          </View>
        </View>
      )}

      {loading ? (
        <View style={styles.loadingBox}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Liste yükleniyor...</Text>
        </View>
      ) : items.length === 0 ? (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyEmoji}>🛒</Text>
          <Text style={styles.emptyTitle}>Liste boş</Text>
          <Text style={styles.emptyHint}>Tarif detayından malzemeleri ekleyebilirsin</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchItems(); }} colors={[Colors.primary]} />
          }
          renderItem={({ item }) => (
            <View style={[styles.itemRow, item.checked && styles.itemRowDone]}>
              <TouchableOpacity
                style={[styles.checkbox, item.checked && styles.checkboxChecked]}
                onPress={() => handleToggle(item.id)}
                activeOpacity={0.75}
              >
                {item.checked && <Text style={styles.checkmark}>✓</Text>}
              </TouchableOpacity>
              <View style={styles.itemInfo}>
                <Text style={[styles.itemName, item.checked && styles.itemNameDone]}>
                  {item.name}
                </Text>
                {item.category && <Text style={styles.itemCategory}>{item.category}</Text>}
              </View>
              <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteBtn} activeOpacity={0.7}>
                <Text style={styles.deleteIcon}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {items.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity style={styles.clearBtn} onPress={clearAll} activeOpacity={0.8}>
            <Text style={styles.clearText}>🗑  Temizle</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareBtn} onPress={handleShare} activeOpacity={0.8}>
            <Text style={styles.shareText}>↗  Paylaş</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24, paddingTop: 58, paddingBottom: 22,
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    borderBottomLeftRadius: 24, borderBottomRightRadius: 24,
  },
  title: { fontSize: 26, fontWeight: "800", color: Colors.white },
  subtitle: { fontSize: 14, color: "rgba(255,255,255,0.8)", marginTop: 3 },
  percentBadge: {
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 16, paddingHorizontal: 14, paddingVertical: 8,
    borderWidth: 1.5, borderColor: "rgba(255,255,255,0.4)",
  },
  percentText: { fontSize: 18, fontWeight: "800", color: Colors.white },
  progressContainer: { paddingHorizontal: 24, paddingVertical: 14 },
  progressBg: { height: 8, backgroundColor: Colors.borderLight, borderRadius: 4, overflow: "hidden" },
  progressFill: { height: "100%", backgroundColor: Colors.primary, borderRadius: 4 },
  listContent: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 120, gap: 10 },
  itemRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: Colors.white, borderRadius: 16,
    paddingHorizontal: 16, paddingVertical: 15, gap: 14,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05, shadowRadius: 8, elevation: 2,
  },
  itemRowDone: { opacity: 0.65 },
  checkbox: {
    width: 26, height: 26, borderRadius: 8,
    borderWidth: 2, borderColor: Colors.border,
    alignItems: "center", justifyContent: "center",
  },
  checkboxChecked: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  checkmark: { color: Colors.white, fontSize: 14, fontWeight: "800" },
  itemInfo: { flex: 1, gap: 3 },
  itemName: { fontSize: 15, color: Colors.text, fontWeight: "600" },
  itemNameDone: { textDecorationLine: "line-through", color: Colors.subtext },
  itemCategory: { fontSize: 12, color: Colors.subtextLight },
  deleteBtn: { padding: 6, borderRadius: 8, backgroundColor: Colors.borderLight },
  deleteIcon: { fontSize: 13, color: Colors.subtext, fontWeight: "700" },
  loadingBox: { flex: 1, alignItems: "center", justifyContent: "center", gap: 14 },
  loadingText: { fontSize: 15, color: Colors.subtext },
  emptyBox: { flex: 1, alignItems: "center", justifyContent: "center", gap: 10, paddingBottom: 80 },
  emptyEmoji: { fontSize: 60, marginBottom: 8 },
  emptyTitle: { fontSize: 18, color: Colors.text, fontWeight: "700" },
  emptyHint: { fontSize: 14, color: Colors.subtext, textAlign: "center", paddingHorizontal: 40, lineHeight: 20 },
  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    flexDirection: "row", gap: 12,
    padding: 20, paddingBottom: 30,
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
    shadowColor: "#000", shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.06, shadowRadius: 12, elevation: 8,
  },
  clearBtn: {
    flex: 1, paddingVertical: 15, borderRadius: 16,
    alignItems: "center", borderWidth: 2, borderColor: Colors.error,
  },
  clearText: { color: Colors.error, fontWeight: "700", fontSize: 15 },
  shareBtn: {
    flex: 1, paddingVertical: 15, borderRadius: 16,
    alignItems: "center", backgroundColor: Colors.primary,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 4,
  },
  shareText: { color: Colors.white, fontWeight: "700", fontSize: 15 },
});
