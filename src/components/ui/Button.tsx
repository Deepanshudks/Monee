import { Pressable, StyleSheet } from "react-native";
import { AppText } from "./AppText";
import { useTheme } from "@/hooks/useTheme";
export function Button({
  title,
  onPress,
  disabled = false,
}: {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}) {
  const t = useTheme();
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      accessibilityRole="button"
      style={[s.button, { backgroundColor: disabled ? t.border : t.accent }]}
    >
      <AppText style={s.text}>{title}</AppText>
    </Pressable>
  );
}
const s = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { color: "#fff", fontSize: 15, fontWeight: "600" },
});
