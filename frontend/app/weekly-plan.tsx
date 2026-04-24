import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../constants/colors";

const days = [
  { id: "mon", short: "Pzt", full: "Pazartesi" },
  { id: "tue", short: "Sal", full: "Salı" },
  { id: "wed", short: "Çar", full: "Çarşamba" },
  { id: "thu", short: "Per", full: "Perşembe" },
  { id: "fri", short: "Cum", full: "Cuma" },
  { id: "sat", short: "Cmt", full: "Cumartesi" },
  { id: "sun", short: "Paz", full: "Pazar" },
];

type Meal = {
  id: string;
  emoji: string;
  name: string;
  calories: number;
  time: string;
};

type DayPlan = {
  targetCalories: number;
  kahvalti: Meal | null;
  ogle: Meal | null;
  aksam: Meal | null;
};

const weekData: Record<string, DayPlan> = {
  mon: {
    targetCalories: 1800,
    kahvalti: { id: "k1", emoji: "🥚", name: "Yumurtalı Menemen", calories: 280, time: "10 dk" },
    ogle: { id: "o1", emoji: "🥗", name: "Akdeniz Salatası", calories: 320, time: "10 dk" },
    aksam: { id: "a1", emoji: "🍗", name: "Fırın Tavuk", calories: 450, time: "40 dk" },
  },
  tue: {
    targetCalories: 1800,
    kahvalti: { id: "k2", emoji: "🥣", name: "Yulaf Ezmesi", calories: 240, time: "5 dk" },
    ogle: null,
    aksam: { id: "a2", emoji: "🥘", name: "Mercimek Çorbası", calories: 300, time: "25 dk" },
  },
  wed: {
    targetCalories: 2000,
    kahvalti: null,
    ogle: { id: "o3", emoji: "🍝", name: "Makarna", calories: 420, time: "20 dk" },
    aksam: { id: "a3", emoji: "🥩", name: "Izgara Köfte", calories: 500, time: "20 dk" },
  },
  thu: { targetCalories: 1800, kahvalti: null, ogle: null, aksam: null },
  fri: { targetCalories: 1800, kahvalti: null, ogle: null, aksam: null },
  sat: { targetCalories: 2200, kahvalti: null, ogle: null, aksam: null },
  sun: { targetCalories: 2200, kahvalti: null, ogle: null, aksam: null },
};

const mealLabels: { key: "kahvalti" | "ogle" | "aksam"; icon: string; label: string }[] = [
  { key: "kahvalti", icon: "☀️", label: "Kahvaltı" },
  { key: "ogle", icon: "🌤", label: "Öğle" },
  { key: "aksam", icon: "🌙", label: "Akşam" },
];

export default function WeeklyPlanScreen() {
  const router = useRouter();
  const [activeDay, setActiveDay] = useState("mon");

  const plan = weekData[activeDay];
  const consumed =
    (plan.kahvalti?.calories ?? 0) +
    (plan.ogle?.calories ?? 0) +
    (plan.aksam?.calories ?? 0);
  const progress = Math.min(consumed / plan.targetCalories, 1);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Haftalık Plan</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Gün seçimi */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysRow}
      >
        {days.map((day) => (
          <TouchableOpacity
            key={day.id}
            style={[styles.dayBtn, activeDay === day.id && styles.dayBtnActive]}
            onPress={() => setActiveDay(day.id)}
          >
            <Text
              style={[styles.dayShort, activeDay === day.id && styles.dayShortActive]}
            >
              {day.short}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Günlük hedef */}
        <View style={styles.goalCard}>
          <View style={styles.goalRow}>
            <Text style={styles.goalLabel}>
              Günlük Hedef — {days.find((d) => d.id === activeDay)?.full}
            </Text>
            <Text style={styles.goalValue}>
              {consumed} / {plan.targetCalories} kal
            </Text>
          </View>
          <View style={styles.progressBg}>
            <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
          </View>
          <Text style={styles.progressPct}>
            %{Math.round(progress * 100)} tamamlandı
          </Text>
        </View>

        {/* Öğünler */}
        {mealLabels.map(({ key, icon, label }) => {
          const meal = plan[key];
          return (
            <View key={key} style={styles.mealSection}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealIcon}>{icon}</Text>
                <Text style={styles.mealLabel}>{label}</Text>
                {meal && (
                  <Text style={styles.mealCalories}>{meal.calories} kal</Text>
                )}
              </View>

              {meal ? (
                <View style={styles.mealCard}>
                  <Text style={styles.mealEmoji}>{meal.emoji}</Text>
                  <View style={styles.mealInfo}>
                    <Text style={styles.mealName}>{meal.name}</Text>
                    <View style={styles.mealMeta}>
                      <Text style={styles.metaText}>🔥 {meal.calories} kal</Text>
                      <Text style={styles.metaText}>⏱ {meal.time}</Text>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.mealEditBtn}>
                    <Text style={styles.mealEditText}>✎</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={styles.emptyMeal}>
                  <Text style={styles.emptyMealPlus}>+</Text>
                  <Text style={styles.emptyMealText}>Öğün ekle</Text>
                </TouchableOpacity>
              )}
            </View>
          );
        })}

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingTop: 56,
    paddingBottom: 16,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  backIcon: {
    fontSize: 20,
    color: Colors.text,
    fontWeight: "600",
  },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.text,
  },
  daysRow: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 8,
  },
  dayBtn: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: Colors.border,
  },
  dayBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayShort: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.subtext,
  },
  dayShortActive: {
    color: Colors.white,
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 20,
    paddingBottom: 24,
  },
  goalCard: {
    backgroundColor: Colors.white,
    borderRadius: 18,
    padding: 20,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  goalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  goalLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.text,
  },
  goalValue: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primary,
  },
  progressBg: {
    height: 10,
    backgroundColor: Colors.background,
    borderRadius: 5,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 5,
  },
  progressPct: {
    fontSize: 12,
    color: Colors.subtext,
    textAlign: "right",
  },
  mealSection: {
    gap: 10,
  },
  mealHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  mealIcon: {
    fontSize: 18,
  },
  mealLabel: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: Colors.text,
  },
  mealCalories: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: "700",
  },
  mealCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  mealEmoji: {
    fontSize: 40,
  },
  mealInfo: {
    flex: 1,
    gap: 6,
  },
  mealName: {
    fontSize: 15,
    fontWeight: "700",
    color: Colors.text,
  },
  mealMeta: {
    flexDirection: "row",
    gap: 10,
  },
  metaText: {
    fontSize: 12,
    color: Colors.subtext,
  },
  mealEditBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
  },
  mealEditText: {
    fontSize: 16,
    color: Colors.subtext,
  },
  emptyMeal: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: "dashed",
  },
  emptyMealPlus: {
    fontSize: 22,
    color: Colors.primary,
    fontWeight: "700",
  },
  emptyMealText: {
    fontSize: 15,
    color: Colors.subtext,
    fontWeight: "600",
  },
});
