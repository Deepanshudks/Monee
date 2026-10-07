import { useMemo, useState } from "react";
import { FlatList, Pressable, StyleSheet, TextInput, View } from "react-native";
import { Filter, Search, SlidersHorizontal } from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "@/components/ui/AppText";
import { ExpenseRow } from "@/components/finance/ExpenseRow";
import { ExpenseSheet } from "@/components/finance/ExpenseSheet";
import { MonthPicker } from "@/components/finance/MonthPicker";
import { useFinanceStore } from "@/stores/financeStore";
import { useTheme } from "@/hooks/useTheme";
import { CATEGORIES, type Expense } from "@/types/finance";
import { dayLabel, monthKey, monthLabel } from "@/utils/dates";
import { formatINR } from "@/utils/currency";

export default function Activity() {
  const t = useTheme();
  const expenses = useFinanceStore((s) => s.expenses);
  const monthlyBudgets = useFinanceStore((s) => s.monthlyBudgets);
  const [month, setMonth] = useState(monthKey());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<"newest" | "oldest" | "highest" | "lowest">(
    "newest",
  );
  const [filters, setFilters] = useState(false);
  const [picker, setPicker] = useState(false);
  const [editing, setEditing] = useState<Expense>();

  const monthFinance = monthlyBudgets[month];

  const monthExpenses = useMemo(
    () =>
      expenses
        .filter((e) => e.month === month)
        .reduce((total, e) => total + e.amount, 0),
    [expenses, month],
  );

  const budgetRemaining = (monthFinance?.budget ?? 0) - monthExpenses;

  const cashRemaining = (monthFinance?.startingBalance ?? 0) - monthExpenses;
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let a = expenses.filter(
      (e) =>
        e.month === month &&
        (category === "All" || e.category === category) &&
        (!q ||
          e.description.toLowerCase().includes(q) ||
          e.category.toLowerCase().includes(q)),
    );
    return a.sort((x, y) =>
      sort === "highest"
        ? y.amount - x.amount
        : sort === "lowest"
          ? x.amount - y.amount
          : sort === "oldest"
            ? x.date.localeCompare(y.date)
            : y.date.localeCompare(x.date) ||
              y.createdAt.localeCompare(x.createdAt),
    );
  }, [expenses, month, search, category, sort]);
  const grouped = useMemo(
    () =>
      filtered.reduce<Record<string, Expense[]>>((a, e) => {
        (a[e.date] ??= []).push(e);
        return a;
      }, {}),
    [filtered],
  );
  const data = Object.entries(grouped);
  return (
    <SafeAreaView style={[s.safe, { backgroundColor: t.background }]}>
      <View style={s.header}>
        <View>
          <AppText style={s.kicker}>TRANSACTIONS</AppText>
          <AppText style={s.title}>Activity</AppText>
        </View>
        <Pressable
          onPress={() => setPicker(true)}
          style={[
            s.period,
            { backgroundColor: t.surface, borderColor: t.border },
          ]}
        >
          <AppText style={s.periodText}>{monthLabel(month)}</AppText>
        </Pressable>
      </View>
      <View
        style={[
          s.search,
          { backgroundColor: t.surface, borderColor: t.border },
        ]}
      >
        <Search size={17} color={t.secondary} />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search expenses"
          placeholderTextColor={t.secondary}
          style={[s.searchInput, { color: t.text }]}
        />
        <Pressable onPress={() => setFilters((v) => !v)}>
          <SlidersHorizontal size={18} color={t.accent} />
        </Pressable>
      </View>
      <View
        style={[
          s.summaryCard,
          {
            backgroundColor: t.surface,
            borderColor: t.border,
          },
        ]}
      >
        <View style={s.summaryItem}>
          <AppText style={s.summaryLabel}>BUDGET</AppText>

          <AppText style={[s.summaryValue, { color: t.text }]}>
            {formatINR(monthFinance?.budget ?? 0)}
          </AppText>
        </View>

        <View style={[s.summaryDivider, { backgroundColor: t.border }]} />

        <View style={s.summaryItem}>
          <AppText style={s.summaryLabel}>SPENT</AppText>

          <AppText style={[s.summaryValue, { color: t.text }]}>
            {formatINR(monthExpenses)}
          </AppText>
        </View>

        <View style={[s.summaryDivider, { backgroundColor: t.border }]} />

        <View style={s.summaryItem}>
          <AppText style={s.summaryLabel}>CASH LEFT</AppText>

          <AppText
            style={[
              s.summaryValue,
              {
                color: cashRemaining < 0 ? t.danger : t.text,
              },
            ]}
          >
            {formatINR(cashRemaining)}
          </AppText>
        </View>
      </View>
      {filters && (
        <View
          style={[
            s.filterCard,
            { backgroundColor: t.surface, borderColor: t.border },
          ]}
        >
          <View style={s.filterTop}>
            <AppText style={s.filterTitle}>Filter & sort</AppText>
            <Pressable
              onPress={() => {
                setCategory("All");
                setSort("newest");
              }}
            >
              <AppText
                style={{ fontSize: 12, color: t.accent, fontWeight: "700" }}
              >
                Reset
              </AppText>
            </Pressable>
          </View>
          <AppText style={s.label}>CATEGORY</AppText>
          <View style={s.chips}>
            {["All", ...CATEGORIES].map((c) => (
              <Pressable
                key={c}
                onPress={() => setCategory(c)}
                style={[
                  s.chip,
                  {
                    backgroundColor: category === c ? t.accentSoft : t.muted,
                    borderColor: category === c ? t.accent : t.border,
                  },
                ]}
              >
                <AppText
                  style={{
                    fontSize: 12,
                    color: category === c ? t.accent : t.text,
                    fontWeight: category === c ? "700" : "500",
                  }}
                >
                  {c}
                </AppText>
              </Pressable>
            ))}
          </View>
          <AppText style={s.label}>SORT</AppText>
          <View style={s.sorts}>
            {(
              [
                ["newest", "Newest"],
                ["oldest", "Oldest"],
                ["highest", "Highest"],
                ["lowest", "Lowest"],
              ] as const
            ).map(([v, label]) => (
              <Pressable
                key={v}
                onPress={() => setSort(v)}
                style={[
                  s.sort,
                  { backgroundColor: sort === v ? t.accent : t.muted },
                ]}
              >
                <AppText
                  style={{
                    fontSize: 12,
                    color: sort === v ? "#fff" : t.text,
                    fontWeight: "600",
                  }}
                >
                  {label}
                </AppText>
              </Pressable>
            ))}
          </View>
        </View>
      )}
      <FlatList
        data={data}
        keyExtractor={([date]) => date}
        contentContainerStyle={s.list}
        renderItem={({ item: [date, items] }) => (
          <View style={s.group}>
            <AppText style={s.day}>{dayLabel(date)}</AppText>
            {items.map((e) => (
              <ExpenseRow
                key={e.id}
                expense={e}
                onPress={() => setEditing(e)}
              />
            ))}
          </View>
        )}
        ListEmptyComponent={
          <View style={s.empty}>
            <Filter size={28} color={t.secondary} />
            <AppText style={s.emptyTitle}>Nothing matches</AppText>
            <AppText style={s.emptyBody}>
              Try another month, category or search term.
            </AppText>
          </View>
        }
      />
      <MonthPicker
        visible={picker}
        month={month}
        onChange={setMonth}
        onClose={() => setPicker(false)}
      />
      <ExpenseSheet
        visible={!!editing}
        expense={editing}
        month={month}
        onClose={() => setEditing(undefined)}
      />
    </SafeAreaView>
  );
}
const s = StyleSheet.create({
  summaryCard: {
    marginHorizontal: 20,
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 18,
    paddingVertical: 14,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
  },

  summaryItem: {
    flex: 1,
    alignItems: "center",
  },

  summaryLabel: {
    fontSize: 8,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#89838D",
  },

  summaryValue: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 5,
  },

  summaryDivider: {
    width: 1,
    height: 28,
  },
  safe: { flex: 1 },
  header: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  kicker: {
    fontSize: 9,
    letterSpacing: 1.6,
    fontWeight: "800",
    color: "#89838D",
  },
  title: { fontSize: 29, fontWeight: "800", letterSpacing: -0.8, marginTop: 5 },
  period: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    maxWidth: 125,
  },
  periodText: { fontSize: 12, fontWeight: "700" },
  search: {
    marginHorizontal: 20,
    borderWidth: 1,
    borderRadius: 17,
    height: 48,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  searchInput: { flex: 1, fontSize: 14 },
  filterCard: {
    marginHorizontal: 20,
    marginTop: 10,
    borderWidth: 1,
    borderRadius: 20,
    padding: 14,
  },
  filterTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  filterTitle: { fontSize: 15, fontWeight: "800" },
  label: {
    fontSize: 9,
    letterSpacing: 1.3,
    fontWeight: "800",
    color: "#89838D",
    marginTop: 14,
    marginBottom: 8,
  },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  chip: {
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 999,
    borderWidth: 1,
  },
  sorts: { flexDirection: "row", gap: 7 },
  sort: { paddingHorizontal: 11, paddingVertical: 8, borderRadius: 999 },
  list: { paddingHorizontal: 20, paddingTop: 18, paddingBottom: 40 },
  group: { marginBottom: 18 },
  day: { fontSize: 11, fontWeight: "800", color: "#89838D", marginBottom: 3 },
  empty: { alignItems: "center", paddingTop: 70, paddingHorizontal: 30 },
  emptyTitle: { fontSize: 17, fontWeight: "800", marginTop: 12 },
  emptyBody: {
    fontSize: 13,
    color: "#817A88",
    textAlign: "center",
    marginTop: 5,
    lineHeight: 20,
  },
});
