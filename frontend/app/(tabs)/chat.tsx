import { useState, useRef } from "react";
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  FlatList, KeyboardAvoidingView, Platform, ScrollView,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { Colors } from "../../constants/colors";
import { sendMessage as aiSendMessage } from "../../services/aiService";

type Message = {
  id: string;
  role: "user" | "ai";
  text: string;
};

const quickChips = [
  { label: "🌱 Vegan", prompt: "Vegan tarif öner" },
  { label: "🥗 Diyet", prompt: "Düşük kalorili diyet yemek öner" },
  { label: "⚡ Hızlı", prompt: "30 dakikada yapılabilecek hızlı tarif öner" },
  { label: "💪 Protein", prompt: "Yüksek proteinli sporcu tarifi öner" },
];

const defaultAI = `Merhaba! 👨‍🍳 Ben ChefMind AI asistanınım.

Sana özel tarif önerileri, beslenme tavsiyeleri ve mutfak ipuçları sunabilirim.

Aşağıdaki hızlı seçenekleri kullanabilir veya istediğini yazabilirsin!`;

let msgId = 0;

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Message[]>([{ id: "0", role: "ai", text: defaultAI }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const sendMessage = async (text?: string) => {
    const userText = (text ?? input).trim();
    if (!userText || loading) return;

    const userMsg: Message = { id: String(++msgId), role: "user", text: userText };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const reply = await aiSendMessage(userText);
      setMessages((prev) => [...prev, { id: String(++msgId), role: "ai", text: reply }]);
    } catch (err: any) {
      setMessages((prev) => [...prev, {
        id: String(++msgId), role: "ai",
        text: `⚠️ ${err?.message ?? "Şu an yanıt veremiyorum. Lütfen tekrar dene."}`,
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isUser = item.role === "user";
    return (
      <View style={[styles.msgRow, isUser && styles.msgRowUser]}>
        {!isUser && (
          <View style={styles.aiAvatar}>
            <Text style={styles.aiAvatarText}>🤖</Text>
          </View>
        )}
        <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAI]}>
          <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
            {item.text}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
    >
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerAvatar}>
          <Text style={{ fontSize: 24 }}>🤖</Text>
        </View>
        <View style={styles.headerInfo}>
          <Text style={styles.headerTitle}>AI Asistan</Text>
          <View style={styles.headerStatusRow}>
            <View style={styles.onlineDot} />
            <Text style={styles.headerStatus}>ChefMind · Her zaman aktif</Text>
          </View>
        </View>
      </View>

      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messageList}
        showsVerticalScrollIndicator={false}
        renderItem={renderMessage}
        style={{ flex: 1 }}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={
          loading ? (
            <View style={styles.msgRow}>
              <View style={styles.aiAvatar}>
                <Text style={styles.aiAvatarText}>🤖</Text>
              </View>
              <View style={[styles.bubbleAI, styles.typingBubble]}>
                <Text style={styles.typingText}>Yazıyor   ●  ●  ●</Text>
              </View>
            </View>
          ) : null
        }
      />

      {/* Quick chips */}
      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chipsRow}
        keyboardShouldPersistTaps="handled"
        style={styles.chipsScroll}
      >
        {quickChips.map((chip) => (
          <TouchableOpacity
            key={chip.label}
            style={styles.chip}
            onPress={() => sendMessage(chip.prompt)}
            activeOpacity={0.75}
          >
            <Text style={styles.chipText}>{chip.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={[styles.inputRow, { paddingBottom: insets.bottom + 10 }]}>
        <TextInput
          style={styles.input}
          placeholder="Bir şey sor..."
          placeholderTextColor={Colors.subtextLight}
          value={input}
          onChangeText={setInput}
          multiline
          maxLength={300}
        />
        <TouchableOpacity
          style={[styles.sendBtn, (!input.trim() || loading) && styles.sendBtnDisabled]}
          onPress={() => sendMessage()}
          disabled={!input.trim() || loading}
          activeOpacity={0.8}
        >
          <Text style={styles.sendIcon}>➤</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },

  // Header
  header: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16,
    backgroundColor: Colors.primary, gap: 14,
    borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
  },
  headerAvatar: {
    width: 46, height: 46, borderRadius: 23,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center",
    borderWidth: 2, borderColor: "rgba(255,255,255,0.4)",
  },
  headerInfo: { flex: 1, gap: 3 },
  headerTitle: { fontSize: 18, fontWeight: "800", color: Colors.white },
  headerStatusRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  onlineDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#A5F3A5" },
  headerStatus: { fontSize: 12, color: "rgba(255,255,255,0.8)" },

  // Messages
  messageList: { padding: 16, gap: 12, paddingBottom: 8 },
  msgRow: { flexDirection: "row", alignItems: "flex-end", gap: 10, marginVertical: 2 },
  msgRowUser: { flexDirection: "row-reverse" },
  aiAvatar: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: Colors.primaryLight,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  aiAvatarText: { fontSize: 18 },
  bubble: {
    maxWidth: "76%", borderRadius: 20,
    paddingHorizontal: 16, paddingVertical: 10,
  },
  bubbleUser: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 5,
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25, shadowRadius: 6, elevation: 3,
  },
  bubbleAI: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 5,
    shadowColor: "#000", shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  bubbleText: { fontSize: 15, color: Colors.text, lineHeight: 22 },
  bubbleTextUser: { color: Colors.white },
  typingBubble: { paddingVertical: 12, paddingHorizontal: 18 },
  typingText: { fontSize: 14, color: Colors.subtext, letterSpacing: 2 },

  // Chips
  chipsScroll: { flexGrow: 0, flexShrink: 0, backgroundColor: Colors.white, borderTopWidth: 1, borderTopColor: Colors.border },
  chipsRow: { paddingHorizontal: 16, paddingVertical: 10, gap: 8, alignItems: "center" },
  chip: {
    backgroundColor: Colors.primaryLight, borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 8,
    borderWidth: 1, borderColor: Colors.primaryMid,
  },
  chipText: { color: Colors.primaryDark, fontSize: 13, fontWeight: "700" },

  // Input
  inputRow: {
    flexDirection: "row", alignItems: "flex-end",
    paddingHorizontal: 16, paddingTop: 10, gap: 10,
    backgroundColor: Colors.white,
    borderTopWidth: 1, borderTopColor: Colors.border,
  },
  input: {
    flex: 1, backgroundColor: Colors.background,
    borderRadius: 22, paddingHorizontal: 18, paddingVertical: 12,
    fontSize: 15, color: Colors.text, maxHeight: 100,
    borderWidth: 1.5, borderColor: Colors.border,
  },
  sendBtn: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center",
    shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35, shadowRadius: 8, elevation: 4,
  },
  sendBtnDisabled: { backgroundColor: Colors.border, shadowOpacity: 0, elevation: 0 },
  sendIcon: { color: Colors.white, fontSize: 18, fontWeight: "700" },
});
