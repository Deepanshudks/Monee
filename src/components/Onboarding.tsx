import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { Sparkles } from "lucide-react-native";
import { AppText } from "@/components/ui/AppText";
import { useTheme } from "@/hooks/useTheme";
import { useSettingsStore } from "@/stores/settingsStore";
import { useAppSounds } from "@/utils/sound";

export function Onboarding({ onDone }: { onDone: () => void }) {
  const t = useTheme();
  const complete = useSettingsStore((s) => s.completeOnboarding);
  const { play } = useAppSounds();
  const [name, setName] = useState("");
  const [budget, setBudget] = useState("30000");
  const [busy, setBusy] = useState(false);
  const finish = async () => {
    const b = Number(budget.replace(/,/g, ""));
    if (!Number.isFinite(b) || b <= 0) return;
    setBusy(true);
    await complete(name.trim() || "there", b);
    play("success");
    onDone();
  };
  return (
    <View style={[s.root, { backgroundColor: t.background }]}>
      <View style={[s.glow, s.glow1, { backgroundColor: t.lavender + "55" }]} />
      <View style={[s.glow, s.glow2, { backgroundColor: t.peach + "35" }]} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={s.inner}
      >
        <View style={[s.mark, { backgroundColor: t.accentSoft }]}>
          <Sparkles size={28} color={t.accent} />
        </View>
        <AppText style={s.eyebrow}>WELCOME TO MONEE</AppText>
        <AppText style={s.title}>Make every rupee feel intentional.</AppText>
        <AppText style={[s.body, { color: t.secondary }]}>
          A private space to understand where your money goes.
        </AppText>
        <View style={s.form}>
          <AppText style={s.label}>YOUR NAME</AppText>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="What should we call you?"
            placeholderTextColor={t.secondary}
            style={[
              s.input,
              {
                color: t.text,
                borderColor: t.border,
                backgroundColor: t.surface,
              },
            ]}
          />
          <AppText style={s.label}>DEFAULT MONTHLY BUDGET</AppText>
          <TextInput
            value={budget}
            onChangeText={setBudget}
            keyboardType="number-pad"
            placeholder="30000"
            placeholderTextColor={t.secondary}
            style={[
              s.input,
              {
                color: t.text,
                borderColor: t.border,
                backgroundColor: t.surface,
              },
            ]}
          />
          <Pressable
            disabled={busy}
            onPress={finish}
            style={[s.button, { backgroundColor: t.accent }]}
          >
            <AppText style={s.buttonText}>
              {busy ? "Setting things up…" : "Continue"}
            </AppText>
          </Pressable>
        </View>
        <AppText style={[s.note, { color: t.secondary }]}>
          You can change everything later in Settings.
        </AppText>
      </KeyboardAvoidingView>
    </View>
  );
}
const s = StyleSheet.create({
  root: { flex: 1, overflow: "hidden" },
  inner: { flex: 1, padding: 28, justifyContent: "center" },
  glow: { position: "absolute", width: 260, height: 260, borderRadius: 130 },
  glow1: { top: -80, right: -90 },
  glow2: { bottom: -80, left: -100 },
  mark: {
    width: 58,
    height: 58,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 26,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: 2,
    fontWeight: "800",
    color: "#817A88",
  },
  title: {
    fontSize: 40,
    lineHeight: 46,
    fontWeight: "800",
    letterSpacing: -1.5,
    maxWidth: 360,
    marginTop: 10,
  },
  body: { fontSize: 16, lineHeight: 24, marginTop: 14, maxWidth: 340 },
  form: { marginTop: 36, gap: 10 },
  label: {
    fontSize: 10,
    letterSpacing: 1.4,
    fontWeight: "800",
    color: "#817A88",
    marginTop: 5,
  },
  input: {
    height: 54,
    borderRadius: 17,
    borderWidth: 1,
    paddingHorizontal: 16,
    fontSize: 16,
  },
  button: {
    height: 56,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  note: { fontSize: 12, textAlign: "center", marginTop: 20 },
});
