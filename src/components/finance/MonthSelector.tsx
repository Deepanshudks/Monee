import { View, Pressable, StyleSheet } from "react-native";
import {
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Pencil,
} from "lucide-react-native";
import { addMonths, parseISO, format } from "date-fns";

import { AppText } from "@/components/ui/AppText";
import { useTheme } from "@/hooks/useTheme";

export function MonthSelector({
  month,
  onChange,
  onOpenPicker,
  onEdit,
}: {
  month: string;
  onChange: (m: string) => void;
  onOpenPicker?: () => void;
  onEdit: () => void;
}) {
  const t = useTheme();

  const d = parseISO(`${month}-01`);

  const change = (n: number) => onChange(format(addMonths(d, n), "yyyy-MM"));

  return (
    <View style={s.wrap}>
      <Pressable
        hitSlop={10}
        onPress={() => change(-1)}
        accessibilityLabel="Previous month"
      >
        <ChevronLeft size={20} color={t.secondary} />
      </Pressable>

      <View style={s.centerGroup}>
        <Pressable
          style={s.center}
          onPress={onOpenPicker}
          accessibilityLabel="Choose month"
        >
          <View>
            <AppText style={[s.active, { color: t.text }]}>
              {format(d, "MMMM")}
            </AppText>

            <AppText style={[s.year, { color: t.secondary }]}>
              {format(d, "yyyy")}
            </AppText>
          </View>

          <CalendarDays size={16} color={t.accent} />
        </Pressable>

        <Pressable
          onPress={onEdit}
          style={[s.editButton, { backgroundColor: t.muted }]}
          accessibilityLabel="Edit month"
        >
          <Pencil size={15} color={t.text} />
        </Pressable>
      </View>

      <Pressable
        hitSlop={10}
        onPress={() => change(1)}
        accessibilityLabel="Next month"
      >
        <ChevronRight size={20} color={t.secondary} />
      </Pressable>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: {
    height: 58,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  centerGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  center: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 16,
  },

  editButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  active: {
    fontSize: 17,
    fontWeight: "800",
    textAlign: "center",
  },

  year: {
    fontSize: 11,
    textAlign: "center",
    marginTop: 1,
  },
});
