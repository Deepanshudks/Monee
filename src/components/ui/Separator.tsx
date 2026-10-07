import { View } from "react-native";
import { useTheme } from "@/hooks/useTheme";
export function Separator() {
  const t = useTheme();
  return <View style={{ height: 1, backgroundColor: t.border }} />;
}
