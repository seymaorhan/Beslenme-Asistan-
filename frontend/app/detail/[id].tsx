import { useEffect, useState, useRef } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Alert, Modal, Animated, Pressable,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants/theme";
import { getRecipeById, Recipe } from "../../services/recipeService";
import { addItem } from "../../services/shoppingService";
import { isFavorite, toggleFavorite } from "../../services/favoritesService";
import AsyncStorage from "@react-native-async-storage/async-storage";

const C = theme.colors;

export default function DetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"ingredients" | "steps">("ingredients");
  const [isFav, setIsFav] = useState(false);
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [addingToList, setAddingToList] = useState(false);
  const [cookMode, setCookMode] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  // Heart animation
  const heartScale = useRef(new Animated.Value(1)).current;

  const animateHeart = () => {
    Animated.sequence([
      Animated.spring(heartScale, { toValue: 1.4, useNativeDriver: true, speed: 60 }),
      Animated.spring(heartScale, { toValue: 1, useNativeDriver: true, speed: 40 }),
    ]).start();
  };

  useEffect(() => {
    if (!id) return;
    getRecipeById(id)
      .then(async (data) => {
        setRecipe(data);
        const fav = await isFavorite(data.id);
        setIsFav(fav);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToList = async () => {
    if (!recipe) return;
    setAddingToList(true);
    try {
      for (const ingredient of recipe.ingredients) await addItem(ingredient, "Tarif Malzemesi");
      Alert.alert("✅ Eklendi!", `${recipe.ingredients.length} malzeme alışveriş listesine eklendi.`);
    } catch {
      Alert.alert("Hata", "Malzemeler eklenirken bir sorun oluştu.");
    } finally {
      setAddingToList(false);
    }
  };

  const handleStartCooking = async () => {
    if (!recipe || recipe.steps.length === 0) return;
    const raw = await AsyncStorage.getItem("cookedCount");
    await AsyncStorage.setItem("cookedCount", String((raw ? parseInt(raw) : 0) + 1));
    setCurrentStep(0);
    setCookMode(true);
  };

  const handleToggleFav = async () => {
    if (!recipe) return;
    animateHeart();
    const newState = await toggleFavorite(recipe);
    setIsFav(newState);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={C.primary} />
        <Text style={styles.loadingText}>Tarif yükleniyor...</Text>
      </View>
    );
  }

  if (error || !recipe) {
    return (
      <View style={styles.center}>
        <Ionicons name="alert-circle-outline" size={56} color={C.mutedLight} />
        <Text style={styles.errorText}>Tarif bulunamadı</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.errorBtn}>
          <Text style={styles.errorBtnText}>← Geri Dön</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Hero */}
      <View style={styles.hero}>
        <LinearGradient
          colors={[C.primaryLight, "#C8E6C9"]}
          style={StyleSheet.absoluteFillObject}
        />
        <Text style={styles.heroEmoji}>{recipe.emoji}</Text>
        <View style={styles.heroOverlay}>
          <TouchableOpacity style={styles.overlayBtn} onPress={() => router.back()} activeOpacity={0.8}>
            <Ionicons name="chevron-back" size={22} color={C.text} />
          </TouchableOpacity>
          <Pressable
            onPress={handleToggleFav}
            style={({ pressed }) => [styles.overlayBtn, pressed && { opacity: 0.8 }]}
          >
            <Animated.View style={{ transform: [{ scale: heartScale }] }}>
              <Ionicons
                name={isFav ? "heart" : "heart-outline"}
                size={22}
                color={isFav ? "#E53935" : C.text}
              />
            </Animated.View>
          </Pressable>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={styles.titleBlock}>
          <View style={styles.pillRow}>
            <View style={styles.catPill}>
              <Text style={styles.catPillText}>{recipe.category}</Text>
            </View>
            {recipe.tag && (
              <View style={[styles.catPill, { backgroundColor: C.accentLight }]}>
                <Text style={[styles.catPillText, { color: C.accent }]}>{recipe.tag}</Text>
              </View>
            )}
          </View>
          <Text style={styles.recipeName}>{recipe.name}</Text>

          <View style={styles.metaStrip}>
            <View style={styles.metaItem}>
              <Ionicons name="flame" size={20} color={C.accent} />
              <Text style={styles.metaValue}>{recipe.calories}</Text>
              <Text style={styles.metaLabel}>kal</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={20} color={C.primary} />
              <Text style={styles.metaValue}>{recipe.time}</Text>
            </View>
            <View style={styles.metaDivider} />
            <View style={styles.metaItem}>
              <Ionicons name="stats-chart-outline" size={20} color={C.muted} />
              <Text style={styles.metaValue}>{recipe.difficulty}</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          {(["ingredients", "steps"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, activeTab === tab && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Ionicons
                name={tab === "ingredients" ? "restaurant-outline" : "list-outline"}
                size={15}
                color={activeTab === tab ? C.white : C.muted}
              />
              <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
                {tab === "ingredients"
                  ? `Malzemeler (${recipe.ingredients.length})`
                  : `Hazırlanış (${recipe.steps.length} adım)`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.tabContent}>
          {activeTab === "ingredients"
            ? recipe.ingredients.map((item, i) => (
                <View key={i} style={styles.ingredientRow}>
                  <View style={styles.bullet} />
                  <Text style={styles.ingredientText}>{item}</Text>
                </View>
              ))
            : recipe.steps.map((step, i) => (
                <View key={i} style={styles.stepRow}>
                  <LinearGradient
                    colors={[C.primary, C.primaryDark]}
                    style={styles.stepNumber}
                  >
                    <Text style={styles.stepNumberText}>{i + 1}</Text>
                  </LinearGradient>
                  <Text style={styles.stepText}>{step}</Text>
                </View>
              ))}
        </View>

        <View style={{ height: 130 }} />
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.listBtn, addingToList && { opacity: 0.6 }]}
          onPress={handleAddToList}
          disabled={addingToList}
          activeOpacity={0.8}
        >
          {addingToList
            ? <ActivityIndicator size="small" color={C.primary} />
            : <>
                <Ionicons name="cart-outline" size={18} color={C.primary} />
                <Text style={styles.listBtnText}>Listeye Ekle</Text>
              </>}
        </TouchableOpacity>
        <TouchableOpacity style={styles.startBtn} onPress={handleStartCooking} activeOpacity={0.85}>
          <LinearGradient colors={[C.primary, C.primaryDark]} style={styles.startBtnGradient}>
            <Ionicons name="restaurant" size={18} color={C.white} />
            <Text style={styles.startBtnText}>Pişirmeye Başla</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Cook Mode */}
      <Modal visible={cookMode} animationType="slide" statusBarTranslucent>
        <LinearGradient colors={[C.primary, C.primaryDark]} style={styles.cookContainer}>
          <StatusBar style="light" />
          <View style={styles.cookHeader}>
            <TouchableOpacity onPress={() => setCookMode(false)} style={styles.cookCloseBtn}>
              <Ionicons name="close" size={20} color={C.white} />
            </TouchableOpacity>
            <Text style={styles.cookTitle}>{recipe.emoji}  {recipe.name}</Text>
            <Text style={styles.cookStep}>{currentStep + 1} / {recipe.steps.length}</Text>
          </View>
          <View style={styles.cookProgressBar}>
            <View style={[styles.cookProgressFill, { width: `${((currentStep + 1) / recipe.steps.length) * 100}%` as any }]} />
          </View>
          <View style={styles.cookStepBox}>
            <LinearGradient colors={["rgba(255,255,255,0.25)", "rgba(255,255,255,0.1)"]} style={styles.cookStepCircle}>
              <Text style={styles.cookStepNum}>{currentStep + 1}</Text>
            </LinearGradient>
            <Text style={styles.cookStepText}>{recipe.steps[currentStep]}</Text>
          </View>
          <View style={styles.cookNav}>
            <TouchableOpacity
              style={[styles.cookNavBtn, currentStep === 0 && { opacity: 0.3 }]}
              onPress={() => setCurrentStep((s) => Math.max(0, s - 1))}
              disabled={currentStep === 0}
            >
              <Ionicons name="arrow-back" size={18} color={C.white} />
              <Text style={styles.cookNavTxt}>Önceki</Text>
            </TouchableOpacity>
            {currentStep < recipe.steps.length - 1 ? (
              <TouchableOpacity style={styles.cookNavBtnPrimary} onPress={() => setCurrentStep((s) => s + 1)}>
                <Text style={styles.cookNavPrimaryTxt}>Sonraki</Text>
                <Ionicons name="arrow-forward" size={18} color={C.primary} />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={[styles.cookNavBtnPrimary, { backgroundColor: "#FFD700" }]}
                onPress={() => { setCookMode(false); Alert.alert("🎉 Afiyet olsun!", `${recipe.name} hazır!`); }}>
                <Text style={styles.cookNavPrimaryTxt}>🎉 Tamamlandı</Text>
              </TouchableOpacity>
            )}
          </View>
        </LinearGradient>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: C.background, gap: 14 },
  loadingText: { fontSize: 15, color: C.muted },
  errorText: { fontSize: 17, color: C.text, fontWeight: "700" },
  errorBtn: { backgroundColor: C.primaryLight, borderRadius: 14, paddingHorizontal: 24, paddingVertical: 12 },
  errorBtnText: { color: C.primary, fontWeight: "700" },

  container: { flex: 1, backgroundColor: C.background },
  hero: { height: 290, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  heroEmoji: { fontSize: 110 },
  heroOverlay: { position: "absolute", top: 52, left: 18, right: 18, flexDirection: "row", justifyContent: "space-between" },
  overlayBtn: {
    width: 44, height: 44, borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.92)",
    alignItems: "center", justifyContent: "center",
    ...theme.shadow.sm,
  },

  content: { flex: 1 },
  titleBlock: {
    backgroundColor: C.card, paddingHorizontal: 22,
    paddingTop: 22, paddingBottom: 20, gap: 10,
    borderBottomWidth: 1, borderBottomColor: C.border,
  },
  pillRow: { flexDirection: "row", gap: 8 },
  catPill: {
    backgroundColor: C.primaryLight, borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 5,
  },
  catPillText: { fontSize: 12, color: C.primary, fontWeight: "700" },
  recipeName: { fontSize: 26, fontWeight: "800", color: C.text, letterSpacing: -0.3, lineHeight: 32 },
  metaStrip: {
    flexDirection: "row", backgroundColor: C.background,
    borderRadius: 16, padding: 16, marginTop: 4, alignItems: "center",
  },
  metaItem: { flex: 1, alignItems: "center", gap: 3 },
  metaValue: { fontSize: 14, fontWeight: "800", color: C.text },
  metaLabel: { fontSize: 11, color: C.muted },
  metaDivider: { width: 1, height: 40, backgroundColor: C.border },

  tabsContainer: {
    flexDirection: "row", backgroundColor: C.card,
    marginHorizontal: 20, marginTop: 16, borderRadius: 16,
    padding: 4, ...theme.shadow.sm,
  },
  tab: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 11, borderRadius: 13, gap: 6 },
  tabActive: { backgroundColor: C.primary },
  tabText: { fontSize: 13, fontWeight: "600", color: C.muted },
  tabTextActive: { color: C.white },
  tabContent: { paddingHorizontal: 20, paddingTop: 18, gap: 10 },
  ingredientRow: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: C.card, borderRadius: 14,
    paddingHorizontal: 16, paddingVertical: 15, gap: 14,
    ...theme.shadow.sm,
  },
  bullet: { width: 10, height: 10, borderRadius: 5, backgroundColor: C.primary },
  ingredientText: { fontSize: 15, color: C.text, fontWeight: "500" },
  stepRow: { flexDirection: "row", gap: 14, alignItems: "flex-start" },
  stepNumber: {
    width: 34, height: 34, borderRadius: 17,
    alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 2,
  },
  stepNumberText: { color: C.white, fontWeight: "800", fontSize: 14 },
  stepText: { flex: 1, fontSize: 15, color: C.text, lineHeight: 23 },

  footer: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    flexDirection: "row", gap: 12, padding: 18, paddingBottom: 34,
    backgroundColor: C.card, borderTopWidth: 1, borderTopColor: C.border,
    ...theme.shadow.lg,
  },
  listBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 15, borderRadius: 16, gap: 8,
    borderWidth: 2, borderColor: C.primary,
  },
  listBtnText: { color: C.primary, fontWeight: "700", fontSize: 15 },
  startBtn: { flex: 1, borderRadius: 16, overflow: "hidden" },
  startBtnGradient: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 15, gap: 8,
  },
  startBtnText: { color: C.white, fontWeight: "700", fontSize: 15 },

  // Cook Mode
  cookContainer: { flex: 1 },
  cookHeader: { paddingTop: 60, paddingHorizontal: 22, paddingBottom: 16, gap: 6 },
  cookCloseBtn: {
    alignSelf: "flex-end", width: 38, height: 38, borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center",
  },
  cookTitle: { fontSize: 22, fontWeight: "800", color: C.white },
  cookStep: { fontSize: 14, color: "rgba(255,255,255,0.7)", fontWeight: "600" },
  cookProgressBar: { height: 5, backgroundColor: "rgba(255,255,255,0.25)", marginHorizontal: 22, borderRadius: 3, overflow: "hidden" },
  cookProgressFill: { height: "100%", backgroundColor: C.white, borderRadius: 3 },
  cookStepBox: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 32, gap: 28 },
  cookStepCircle: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  cookStepNum: { fontSize: 34, fontWeight: "800", color: C.white },
  cookStepText: { fontSize: 20, color: C.white, textAlign: "center", lineHeight: 30, fontWeight: "500" },
  cookNav: { flexDirection: "row", gap: 12, padding: 22, paddingBottom: 48 },
  cookNavBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 16, borderRadius: 18, gap: 6,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  cookNavTxt: { color: C.white, fontWeight: "700", fontSize: 16 },
  cookNavBtnPrimary: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 16, borderRadius: 18, gap: 6, backgroundColor: C.white,
  },
  cookNavPrimaryTxt: { color: C.primary, fontWeight: "800", fontSize: 16 },
});
