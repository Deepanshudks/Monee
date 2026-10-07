import { useColorScheme } from "react-native";
import { dark, light } from "@/constants/theme";
import { useSettingsStore } from "@/stores/settingsStore";
export function useTheme() {
  const mode = useSettingsStore((s) => s.theme);
  const system = useColorScheme();
  return mode === "dark" || (mode === "system" && system === "dark")
    ? dark
    : light;
}
