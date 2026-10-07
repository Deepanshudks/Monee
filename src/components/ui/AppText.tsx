import { Text, type TextProps } from "react-native";
import { useTheme } from "@/hooks/useTheme";
export function AppText({ style, ...props }: TextProps) {
  const theme = useTheme();
  return (
    <Text
      {...props}
      style={[{ color: theme.text, fontFamily: "System" }, style]}
    />
  );
}
