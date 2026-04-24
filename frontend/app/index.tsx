import { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../constants/colors";

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/onboarding");
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <Text style={styles.icon}>👨‍🍳</Text>
      <Text style={styles.title}>ChefMind</Text>
      <Text style={styles.subtitle}>Akıllı Yemek ve Beslenme Asistanı</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  icon: {
    fontSize: 80,
    marginBottom: 8,
  },
  title: {
    fontSize: 36,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.white,
    opacity: 0.85,
    textAlign: "center",
    paddingHorizontal: 32,
  },
});
