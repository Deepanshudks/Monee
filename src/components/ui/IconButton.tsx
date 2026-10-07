import {
  Pressable,
  type PressableProps,
  type PressableStateCallbackType,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import { useTheme } from "@/hooks/useTheme";

export function IconButton({ children, style, ...props }: PressableProps) {
  const t = useTheme();

  const baseStyle: ViewStyle = {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: t.surface,
    borderWidth: 1,
    borderColor: t.border,
  };

  return (
    <Pressable
      {...props}
      style={(state: PressableStateCallbackType) => [
        baseStyle,
        typeof style === "function" ? style(state) : style,
      ]}
    >
      {children}
    </Pressable>
  );
}
