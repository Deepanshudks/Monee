import { useMemo, useState } from "react";
import { View, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "@/components/ui/AppText";
import { useFinanceStore } from "@/stores/financeStore";
import { useTheme } from "@/hooks/useTheme";
import { formatINR } from "@/utils/currency";
import { categoryTotals } from "@/utils/calculations";
import { monthKey, monthLabel } from "@/utils/dates";
import { MonthPicker } from "@/components/finance/MonthPicker";

export default function Insights() {
  const t = useTheme();

  const expenses = useFinanceStore((s) => s.expenses);
  const monthlyBudgets = useFinanceStore((s) => s.monthlyBudgets);

  const [month, setMonth] = useState(monthKey());
  const [picker, setPicker] = useState(false);

  const monthFinance = monthlyBudgets[month];

  const cats = useMemo(
    () =>
      Object.entries(categoryTotals(expenses, month)).sort(
        (a, b) => b[1] - a[1],
      ),
    [expenses, month],
  );

  const spent = cats.reduce((sum, [, value]) => sum + value, 0);

  const budget = monthFinance?.budget ?? 0;
  const startingBalance = monthFinance?.startingBalance ?? 0;

  const budgetRemaining = budget - spent;
  const cashRemaining = startingBalance - spent;

  const budgetUsedPercent = budget > 0 ? Math.round((spent / budget) * 100) : 0;

  const budgetProgress = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;

  const selectedDate = new Date(`${month}-01`);
  const now = new Date();

  const isCurrentMonth =
    selectedDate.getMonth() === now.getMonth() &&
    selectedDate.getFullYear() === now.getFullYear();

  const days = isCurrentMonth
    ? now.getDate()
    : new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth() + 1,
        0,
      ).getDate();

  const averagePerDay = days > 0 ? Math.round(spent / days) : 0;

  const top = cats[0];

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: t.background }]}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={s.head}>
          <View>
            <AppText style={s.kicker}>YOUR SPENDING PATTERN</AppText>

            <AppText style={[s.title, { color: t.text }]}>Insights</AppText>
          </View>

          <Pressable
            onPress={() => setPicker(true)}
            style={[
              s.period,
              {
                backgroundColor: t.surface,
                borderColor: t.border,
              },
            ]}
          >
            <AppText style={[s.periodText, { color: t.text }]}>
              {monthLabel(month)}
            </AppText>
          </Pressable>
        </View>

        {/* Main spending card */}
        <View
          style={[
            s.hero,
            {
              backgroundColor: t.surface,
              borderColor: t.border,
            },
          ]}
        >
          <AppText style={s.label}>SPENT THIS MONTH</AppText>

          <AppText
            style={[
              s.big,
              {
                color: t.text,
              },
            ]}
          >
            {formatINR(spent)}
          </AppText>

          <AppText style={s.meta}>
            {budget > 0
              ? `${budgetUsedPercent}% of ${formatINR(budget)} budget`
              : "No budget set for this month"}
          </AppText>

          <View
            style={[
              s.track,
              {
                backgroundColor: t.border,
              },
            ]}
          >
            <View
              style={[
                s.fill,
                {
                  backgroundColor: budgetRemaining < 0 ? t.danger : t.accent,
                  width: `${budgetProgress}%`,
                },
              ]}
            />
          </View>

          {budget > 0 && (
            <AppText
              style={[
                s.progressText,
                {
                  color: budgetRemaining < 0 ? t.danger : t.secondary,
                },
              ]}
            >
              {budgetRemaining >= 0
                ? `${formatINR(budgetRemaining)} budget remaining`
                : `${formatINR(Math.abs(budgetRemaining))} over budget`}
            </AppText>
          )}
        </View>

        {/* Financial overview */}
        <View
          style={[
            s.financeCard,
            {
              backgroundColor: t.surface,
              borderColor: t.border,
            },
          ]}
        >
          <View style={s.financeItem}>
            <AppText style={s.label}>STARTING BALANCE</AppText>

            <AppText
              style={[
                s.financeValue,
                {
                  color: t.text,
                },
              ]}
            >
              {formatINR(startingBalance)}
            </AppText>
          </View>

          <View
            style={[
              s.financeDivider,
              {
                backgroundColor: t.border,
              },
            ]}
          />

          <View style={s.financeItem}>
            <AppText style={s.label}>CASH REMAINING</AppText>

            <AppText
              style={[
                s.financeValue,
                {
                  color: cashRemaining < 0 ? t.danger : t.text,
                },
              ]}
            >
              {formatINR(cashRemaining)}
            </AppText>
          </View>
        </View>

        {/* Spending stats */}
        <View
          style={[
            s.grid,
            {
              borderColor: t.border,
            },
          ]}
        >
          <View style={s.stat}>
            <AppText style={s.label}>AVERAGE / DAY</AppText>

            <AppText
              style={[
                s.value,
                {
                  color: t.text,
                },
              ]}
            >
              {formatINR(averagePerDay)}
            </AppText>
          </View>

          <View style={s.stat}>
            <AppText style={s.label}>TOP CATEGORY</AppText>

            <AppText
              style={[
                s.value,
                {
                  color: t.text,
                },
              ]}
              numberOfLines={1}
            >
              {top?.[0] ?? "—"}
            </AppText>

            <AppText style={s.meta}>
              {top ? formatINR(top[1]) : "No spending"}
            </AppText>
          </View>
        </View>

        {/* Category breakdown */}
        <AppText
          style={[
            s.section,
            {
              color: t.text,
            },
          ]}
        >
          Where your money went
        </AppText>

        {cats.length ? (
          cats.map(([name, value], i) => {
            const percentage = spent > 0 ? (value / spent) * 100 : 0;

            const categoryColors = [
              t.accent,
              t.peach,
              t.sage,
              t.sky,
              t.lavender,
            ];

            return (
              <View key={name} style={s.cat}>
                <View style={s.catHead}>
                  <AppText
                    style={[
                      s.catName,
                      {
                        color: t.text,
                      },
                    ]}
                  >
                    {name}
                  </AppText>

                  <AppText
                    style={[
                      s.catValue,
                      {
                        color: t.text,
                      },
                    ]}
                  >
                    {formatINR(value)}
                  </AppText>
                </View>

                <View
                  style={[
                    s.track,
                    {
                      backgroundColor: t.border,
                    },
                  ]}
                >
                  <View
                    style={[
                      s.fill,
                      {
                        backgroundColor:
                          categoryColors[i % categoryColors.length],
                        width: `${percentage}%`,
                      },
                    ]}
                  />
                </View>

                <AppText style={s.categoryPercent}>
                  {Math.round(percentage)}% of spending
                </AppText>
              </View>
            );
          })
        ) : (
          <View
            style={[
              s.empty,
              {
                backgroundColor: t.surface,
                borderColor: t.border,
              },
            ]}
          >
            <AppText style={s.meta}>
              No spending data for {monthLabel(month)}.
            </AppText>
          </View>
        )}
      </ScrollView>

      <MonthPicker
        visible={picker}
        month={month}
        onChange={setMonth}
        onClose={() => setPicker(false)}
      />
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 50,
  },

  head: {
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

  title: {
    fontSize: 30,
    fontWeight: "800",
    letterSpacing: -0.9,
    marginTop: 5,
  },

  period: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 9,
    maxWidth: 125,
  },

  periodText: {
    fontSize: 12,
    fontWeight: "700",
  },

  hero: {
    marginTop: 24,
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },

  label: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.3,
    color: "#89838D",
  },

  big: {
    fontSize: 35,
    fontWeight: "800",
    letterSpacing: -1.1,
    marginTop: 7,
  },

  meta: {
    fontSize: 12,
    color: "#817A88",
    marginTop: 5,
  },

  progressText: {
    fontSize: 11,
    fontWeight: "700",
    marginTop: 8,
  },

  track: {
    height: 6,
    borderRadius: 99,
    overflow: "hidden",
    marginTop: 17,
  },

  fill: {
    height: 6,
    borderRadius: 99,
  },

  financeCard: {
    marginTop: 12,
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 17,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
  },

  financeItem: {
    flex: 1,
    alignItems: "center",
  },

  financeDivider: {
    width: 1,
    height: 34,
  },

  financeValue: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 7,
  },

  grid: {
    flexDirection: "row",
    marginTop: 12,
    paddingVertical: 22,
    borderBottomWidth: 1,
  },

  stat: {
    flex: 1,
  },

  value: {
    fontSize: 17,
    fontWeight: "800",
    marginTop: 8,
  },

  section: {
    fontSize: 17,
    fontWeight: "800",
    marginTop: 28,
    marginBottom: 16,
  },

  cat: {
    marginBottom: 17,
  },

  catHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 7,
  },

  catName: {
    fontSize: 13,
    fontWeight: "600",
  },

  catValue: {
    fontSize: 13,
    fontWeight: "700",
  },

  categoryPercent: {
    fontSize: 10,
    color: "#89838D",
    marginTop: 5,
  },

  empty: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 18,
  },
});
