import { Tabs } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "../../constants/theme";

const C = theme.colors;

type IoniconName = "home" | "home-outline" | "search" | "search-outline" | "chatbubble-ellipses" | "chatbubble-ellipses-outline" | "cart" | "cart-outline" | "person" | "person-outline";

function TabIcon({ focused, icon, iconOutline }: { focused: boolean; icon: IoniconName; iconOutline: IoniconName }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons
        name={focused ? icon : iconOutline}
        size={22}
        color={focused ? C.primary : C.muted}
      />
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: C.primary,
        tabBarInactiveTintColor: C.muted,
        tabBarStyle: {
          backgroundColor: C.white,
          borderTopWidth: 0,
          height: 72,
          paddingBottom: 10,
          paddingTop: 6,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -6 },
          shadowOpacity: 0.08,
          shadowRadius: 20,
          elevation: 20,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Ana Sayfa",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="home" iconOutline="home-outline" />,
        }}
      />
      <Tabs.Screen
        name="ingredients"
        options={{
          title: "Malzemeler",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="search" iconOutline="search-outline" />,
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "AI Chat",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="chatbubble-ellipses" iconOutline="chatbubble-ellipses-outline" />,
        }}
      />
      <Tabs.Screen
        name="shopping"
        options={{
          title: "Alışveriş",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="cart" iconOutline="cart-outline" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profil",
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="person" iconOutline="person-outline" />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 40, height: 32,
    alignItems: "center", justifyContent: "center",
    borderRadius: 10,
  },
  iconWrapActive: {
    backgroundColor: C.primaryLight,
  },
});
