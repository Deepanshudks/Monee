import { useEffect, useMemo, useState } from "react";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Plus, Sparkles } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "@/components/ui/AppText";
import { BalanceHeader } from "@/components/finance/BalanceHeader";
import { MonthSelector } from "@/components/finance/MonthSelector";
import { MonthPicker } from "@/components/finance/MonthPicker";
import { ExpenseRow } from "@/components/finance/ExpenseRow";
import { ExpenseSheet } from "@/components/finance/ExpenseSheet";
import { useFinanceStore } from "@/stores/financeStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { monthKey, monthLabel } from "@/utils/dates";
import { monthlySummary } from "@/utils/calculations";
import { useTheme } from "@/hooks/useTheme";
import { MonthEditor } from "@/components/finance/MonthEditor";

export default function Home() {
  const t = useTheme();
  const expenses = useFinanceStore((s) => s.expenses);
  const monthlyBudgets = useFinanceStore((s) => s.monthlyBudgets);
  const ensureMonth = useFinanceStore((s) => s.ensureMonth);
  const defaultMonthlyBudget = useSettingsStore((s) => s.defaultMonthlyBudget);
  const name = useSettingsStore((s) => s.userName);
  const [month, setMonth] = useState(monthKey());
  const [sheet, setSheet] = useState(false);
  const [picker, setPicker] = useState(false);
  const [editor, setEditor] = useState(false);

  const budgetValues = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(monthlyBudgets).map(([key, value]) => [
          key,
          value.budget,
        ]),
      ),
    [monthlyBudgets],
  );

  const summary = useMemo(
    () => monthlySummary(expenses, budgetValues, month),
    [expenses, budgetValues, month],
  );

  const hydrated = useFinanceStore((s) => s.hydrated);

  useEffect(() => {
    if (!hydrated) return;

    const currentMonth = monthKey();

    if (month >= currentMonth) {
      ensureMonth(month, defaultMonthlyBudget);
    }
  }, [month, hydrated, defaultMonthlyBudget, ensureMonth]);

  const recent = expenses.filter((e) => e.month === month).slice(0, 6);
  return (
    <SafeAreaView
      style={[s.safe, { backgroundColor: t.background }]}
      edges={["top"]}
    >
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.top}>
          <View>
            <AppText style={s.kicker}>YOUR MONEY, SIMPLIFIED</AppText>
            <AppText style={s.greeting}>
              {name ? `Hi, ${name}` : "Your Monee"}
            </AppText>
            <AppText style={s.date}>{monthLabel(month)}</AppText>
          </View>
          <View style={[s.spark, { backgroundColor: t.accentSoft }]}>
            <Sparkles size={17} color={t.accent} />
          </View>
        </View>
        <BalanceHeader
          budget={summary.budget}
          spent={summary.expenses}
          carryForward={summary.budget - (monthlyBudgets[month]?.budget ?? 0)}
        />
        <MonthSelector
          month={month}
          onChange={setMonth}
          onOpenPicker={() => setPicker(true)}
          onEdit={() => setEditor(true)}
        />
        <View style={s.section}>
          <View style={s.sectionHead}>
            <AppText style={s.sectionTitle}>Recent activity</AppText>
            <AppText style={s.count}>{recent.length} latest</AppText>
          </View>
          {recent.length ? (
            recent.map((e) => <ExpenseRow key={e.id} expense={e} />)
          ) : (
            <View style={s.empty}>
              <AppText style={s.emptyTitle}>A clean slate.</AppText>
              <AppText style={s.emptyBody}>
                Add your first expense and Monee will start shaping your monthly
                picture.
              </AppText>
            </View>
          )}
        </View>
      </ScrollView>
      <Pressable
        accessibilityLabel="Add expense"
        onPress={() => setSheet(true)}
        style={[s.fab, { backgroundColor: t.accent }]}
      >
        <Plus size={25} color="#fff" strokeWidth={2.3} />
      </Pressable>
      <ExpenseSheet
        visible={sheet}
        onClose={() => setSheet(false)}
        month={month}
      />
      <MonthPicker
        visible={picker}
        month={month}
        onChange={setMonth}
        onClose={() => setPicker(false)}
      />
      <MonthEditor
        visible={editor}
        month={month}
        onClose={() => setEditor(false)}
      />
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  safe: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 120 },
  top: {
    paddingTop: 10,
    paddingBottom: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  kicker: {
    fontSize: 9,
    letterSpacing: 1.6,
    fontWeight: "800",
    color: "#89838D",
  },
  greeting: {
    fontSize: 28,
    fontWeight: "800",
    letterSpacing: -0.8,
    marginTop: 6,
  },
  date: { fontSize: 13, color: "#817A88", marginTop: 3 },
  spark: {
    width: 42,
    height: 42,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  section: { marginTop: 14 },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 5,
  },
  sectionTitle: { fontSize: 17, fontWeight: "800" },
  count: { fontSize: 11, color: "#817A88" },
  empty: { paddingVertical: 38, paddingHorizontal: 4 },
  emptyTitle: { fontSize: 17, fontWeight: "700" },
  emptyBody: {
    fontSize: 14,
    color: "#817A88",
    lineHeight: 21,
    maxWidth: 320,
    marginTop: 7,
  },
  fab: {
    position: "absolute",
    right: 20,
    bottom: 22,
    width: 60,
    height: 60,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    elevation: 6,
    shadowOpacity: 0.18,
    shadowRadius: 15,
    shadowOffset: { width: 0, height: 7 },
  },
});
