import { View, StyleSheet } from "react-native";
import { AppText } from "@/components/ui/AppText";
import { formatINR } from "@/utils/currency";
import { useTheme } from "@/hooks/useTheme";

export function BalanceHeader({
  budget,
  spent,
  carryForward,
}: {
  budget: number;
  spent: number;
  carryForward: number;
}) {
  const t = useTheme();

  const budgetRemaining = budget - spent;
  const negativeBudget = budgetRemaining < 0;

  const baseBudget = budget - carryForward;

  const pct = budget > 0 ? Math.min(Math.max(spent / budget, 0), 1) : 0;

  return (
    <View
      style={[
        s.card,
        {
          backgroundColor: t.surface,
          borderColor: t.border,
        },
      ]}
    >
      <View style={s.orb}>
        <View style={[s.orb2, { backgroundColor: t.lavender + "33" }]} />
      </View>

      <AppText style={s.eyebrow}>BUDGET REMAINING</AppText>

      <AppText
        style={[
          s.balance,
          {
            color: negativeBudget ? t.danger : t.text,
          },
        ]}
      >
        {formatINR(budgetRemaining)}
      </AppText>

      <View style={s.metaRow}>
        <AppText style={s.meta}>{formatINR(spent)} spent</AppText>

        <AppText style={s.meta}>{formatINR(budget)} budget</AppText>
      </View>

      <View style={[s.track, { backgroundColor: t.border }]}>
        <View
          style={[
            s.fill,
            {
              backgroundColor: negativeBudget ? t.danger : t.accent,
              width: `${pct * 100}%`,
            },
          ]}
        />
      </View>

      <AppText style={s.percent}>
        {budget > 0
          ? `${Math.round((spent / budget) * 100)}% used`
          : "No budget set"}
      </AppText>

      <View style={[s.divider, { backgroundColor: t.border }]} />

      <View style={s.cashRow}>
        <View style={s.cashItem}>
          <AppText style={s.cashLabel}>BASE BUDGET</AppText>

          <AppText style={[s.cashValue, { color: t.text }]}>
            {formatINR(baseBudget)}
          </AppText>
        </View>

        <View style={s.cashItem}>
          <AppText style={s.cashLabel}>CARRY FORWARD</AppText>

          <AppText
            style={[
              s.cashValue,
              {
                color: carryForward < 0 ? t.danger : t.text,
              },
            ]}
          >
            {formatINR(carryForward)}
          </AppText>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    borderRadius: 26,
    borderWidth: 1,
    padding: 22,
    overflow: "hidden",
    marginTop: 18,
    marginBottom: 8,
  },

  orb: {
    position: "absolute",
    right: -20,
    top: -35,
    width: 130,
    height: 130,
    borderRadius: 65,
    backgroundColor: "#A99CFF22",
  },

  orb2: {
    width: 90,
    height: 90,
    borderRadius: 45,
    position: "absolute",
    right: 20,
    top: 20,
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.5,
    color: "#89838D",
  },

  balance: {
    fontSize: 40,
    fontWeight: "800",
    letterSpacing: -1.4,
    marginTop: 7,
  },

  metaRow: {
    flexDirection: "row",
    gap: 18,
    marginTop: 8,
  },

  meta: {
    fontSize: 13,
    color: "#817A88",
  },

  track: {
    height: 7,
    borderRadius: 99,
    overflow: "hidden",
    marginTop: 19,
  },

  fill: {
    height: 7,
    borderRadius: 99,
  },

  percent: {
    fontSize: 11,
    color: "#817A88",
    marginTop: 8,
  },

  divider: {
    height: 1,
    marginVertical: 18,
  },

  cashRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },

  cashItem: {
    flex: 1,
  },

  cashLabel: {
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.1,
    color: "#89838D",
  },

  cashValue: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 5,
  },
});
