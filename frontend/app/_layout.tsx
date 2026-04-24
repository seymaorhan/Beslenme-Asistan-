import { useEffect, useRef } from "react";
import { Stack, useRouter } from "expo-router";
import * as Notifications from "expo-notifications";
import { Platform, LogBox } from "react-native";
import { Provider as PaperProvider } from "react-native-paper";
import { paperTheme } from "../constants/theme";

LogBox.ignoreLogs([
  "expo-notifications: Android Push notifications",
  "shadow*",
  "props.pointerEvents",
]);

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function RootLayout() {
  const router = useRouter();
  const responseListener = useRef<Notifications.EventSubscription>();

  useEffect(() => {
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "ChefMind Bildirimleri",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#4CAF50",
      });
    }

    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data as any;
        if (data?.type === "gunluk_tarif" && data?.recipeId) {
          router.push(`/detail/${data.recipeId}`);
        }
      }
    );

    return () => { responseListener.current?.remove(); };
  }, []);

  return (
    <PaperProvider theme={paperTheme as any}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(auth)/login" />
        <Stack.Screen name="(auth)/register" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="results" />
        <Stack.Screen name="detail/[id]" />
        <Stack.Screen name="weekly-plan" />
      </Stack>
    </PaperProvider>
  );
}
