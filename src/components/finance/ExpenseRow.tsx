import { Pressable, View, StyleSheet } from "react-native";
import {
  Utensils,
  Car,
  ShoppingBag,
  Receipt,
  Zap,
  Film,
  HeartPulse,
  BookOpen,
  Circle,
} from "lucide-react-native";
import type { Expense } from "@/types/finance";
import { categoryMeta } from "@/constants/categories";
import { useTheme } from "@/hooks/useTheme";
import { AppText } from "@/components/ui/AppText";
import { formatINR } from "@/utils/currency";
import { timeLabel } from "@/utils/dates";
const icons = {
  utensils: Utensils,
  car: Car,
  "shopping-bag": ShoppingBag,
  receipt: Receipt,
  zap: Zap,
  film: Film,
  "heart-pulse": HeartPulse,
  "book-open": BookOpen,
  circle: Circle,
};
export function ExpenseRow({
  expense,
  onPress,
}: {
  expense: Expense;
  onPress?: () => void;
}) {
  const t = useTheme();
  const meta = categoryMeta[expense.category];
  const Icon = icons[meta.icon as keyof typeof icons];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      style={({ pressed }) => [s.row, pressed && { opacity: 0.65 }]}
    >
      <View style={[s.icon, { backgroundColor: meta.color + "18" }]}>
        <Icon size={17} color={meta.color} strokeWidth={2.2} />
      </View>
      <View style={s.info}>
        <AppText style={s.title}>
          {expense.description || expense.category}
        </AppText>
        <AppText style={[s.sub, { color: t.secondary }]}>
          {expense.category} · {timeLabel(expense.createdAt)}
        </AppText>
      </View>
      <AppText style={s.amount}>{formatINR(expense.amount)}</AppText>
    </Pressable>
  );
}
const s = StyleSheet.create({
  row: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#E8E1D7",
  },
  icon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { flex: 1 },
  title: { fontSize: 14, fontWeight: "700" },
  sub: { fontSize: 11, marginTop: 3 },
  amount: { fontSize: 14, fontWeight: "800" },
});
