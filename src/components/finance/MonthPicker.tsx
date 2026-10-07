import { Modal, Pressable, StyleSheet, View } from "react-native";
import { ChevronLeft, ChevronRight, X } from "lucide-react-native";
import { format, addYears, subYears, parseISO } from "date-fns";
import { AppText } from "@/components/ui/AppText";
import { useTheme } from "@/hooks/useTheme";

export function MonthPicker({
  visible,
  month,
  onChange,
  onClose,
}: {
  visible: boolean;
  month: string;
  onChange: (m: string) => void;
  onClose: () => void;
}) {
  const t = useTheme();
  const date = parseISO(`${month}-01`);
  const year = date.getFullYear();
  const months = Array.from({ length: 12 }, (_, i) =>
    format(new Date(year, i, 1), "MMM"),
  );
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={s.overlay}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View
          style={[
            s.card,
            { backgroundColor: t.elevated, borderColor: t.border },
          ]}
        >
          <View style={s.head}>
            <View>
              <AppText style={s.kicker}>SELECT PERIOD</AppText>
              <AppText style={s.title}>Month & year</AppText>
            </View>
            <Pressable onPress={onClose}>
              <X size={20} color={t.secondary} />
            </Pressable>
          </View>
          <View style={s.year}>
            <Pressable
              onPress={() => onChange(format(subYears(date, 1), "yyyy-MM"))}
            >
              <ChevronLeft size={20} color={t.secondary} />
            </Pressable>
            <AppText style={s.yearText}>{year}</AppText>
            <Pressable
              onPress={() => onChange(format(addYears(date, 1), "yyyy-MM"))}
            >
              <ChevronRight size={20} color={t.secondary} />
            </Pressable>
          </View>
          <View style={s.grid}>
            {months.map((m, i) => {
              const selected = i === date.getMonth();
              return (
                <Pressable
                  key={m}
                  onPress={() => {
                    onChange(`${year}-${String(i + 1).padStart(2, "0")}`);
                    onClose();
                  }}
                  style={[
                    s.month,
                    { backgroundColor: selected ? t.accent : t.muted },
                  ]}
                >
                  <AppText
                    style={{
                      fontSize: 14,
                      fontWeight: selected ? "700" : "500",
                      color: selected ? "#fff" : t.text,
                    }}
                  >
                    {m}
                  </AppText>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>
    </Modal>
  );
}
const s = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(10,8,14,.42)",
    justifyContent: "center",
    padding: 22,
  },
  card: {
    borderRadius: 28,
    borderWidth: 1,
    padding: 20,
    shadowOpacity: 0.2,
    shadowRadius: 30,
    shadowOffset: { width: 0, height: 12 },
  },
  head: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kicker: {
    fontSize: 10,
    letterSpacing: 1.5,
    fontWeight: "700",
    color: "#8C8790",
  },
  title: { fontSize: 22, fontWeight: "700", marginTop: 3 },
  year: {
    marginTop: 22,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  yearText: { fontSize: 22, fontWeight: "700" },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 9, marginTop: 18 },
  month: {
    width: "30%",
    height: 48,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
});
