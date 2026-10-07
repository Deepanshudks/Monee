import { useEffect, useState } from "react";
import { Modal, Pressable, StyleSheet, TextInput, View } from "react-native";
import { X } from "lucide-react-native";

import { AppText } from "@/components/ui/AppText";
import { useFinanceStore } from "@/stores/financeStore";
import { monthLabel } from "@/utils/dates";
import { useTheme } from "@/hooks/useTheme";

type Props = {
  visible: boolean;
  month: string;
  onClose: () => void;
};

function parseAmount(value: string) {
  const cleaned = value.replace(/[^0-9.]/g, "");
  const number = Number(cleaned);

  return Number.isFinite(number) ? number : 0;
}

export function MonthEditor({ visible, month, onClose }: Props) {
  const t = useTheme();

  const monthlyBudget = useFinanceStore((s) => s.monthlyBudgets[month]);

  const setMonthlyBudget = useFinanceStore((s) => s.setMonthlyBudget);

  const [budget, setBudget] = useState("");
  const [startingBalance, setStartingBalance] = useState("");

  useEffect(() => {
    if (!visible) return;

    setBudget(String(monthlyBudget?.budget ?? 0));

    setStartingBalance(String(monthlyBudget?.startingBalance ?? 0));
  }, [visible, monthlyBudget]);

  const handleSave = async () => {
    const budgetValue = parseAmount(budget);
    const startingBalanceValue = parseAmount(startingBalance);

    await setMonthlyBudget(month, budgetValue, startingBalanceValue);

    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: t.surface,
            },
          ]}
        >
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <AppText style={styles.title}>Edit month</AppText>

              <AppText style={[styles.subtitle, { color: t.secondary }]}>
                {monthLabel(month)}
              </AppText>
            </View>

            <Pressable
              onPress={onClose}
              style={[styles.close, { backgroundColor: t.muted }]}
              accessibilityLabel="Close"
            >
              <X size={18} color={t.text} />
            </Pressable>
          </View>

          <View style={styles.form}>
            <View style={styles.field}>
              <AppText style={styles.label}>Monthly budget</AppText>

              <View style={[styles.inputWrap, { borderColor: t.border }]}>
                <AppText style={[styles.currency, { color: t.secondary }]}>
                  ₹
                </AppText>

                <TextInput
                  value={budget}
                  onChangeText={setBudget}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={t.secondary}
                  style={[styles.input, { color: t.text }]}
                />
              </View>
            </View>

            <View style={styles.field}>
              <AppText style={styles.label}>Starting balance</AppText>

              <AppText style={[styles.hint, { color: t.secondary }]}>
                Money available at the beginning of this month.
              </AppText>

              <View style={[styles.inputWrap, { borderColor: t.border }]}>
                <AppText style={[styles.currency, { color: t.secondary }]}>
                  ₹
                </AppText>

                <TextInput
                  value={startingBalance}
                  onChangeText={setStartingBalance}
                  keyboardType="decimal-pad"
                  placeholder="0"
                  placeholderTextColor={t.secondary}
                  style={[styles.input, { color: t.text }]}
                />
              </View>
            </View>
          </View>

          <Pressable
            onPress={handleSave}
            style={[styles.save, { backgroundColor: t.accent }]}
          >
            <AppText style={styles.saveText}>Save changes</AppText>
          </Pressable>

          <Pressable onPress={onClose} style={styles.cancel}>
            <AppText style={[styles.cancelText, { color: t.secondary }]}>
              Cancel
            </AppText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.28)",
  },

  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
  },

  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D8D2C9",
    alignSelf: "center",
    marginBottom: 20,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
  },

  subtitle: {
    fontSize: 13,
    marginTop: 4,
  },

  close: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },

  form: {
    marginTop: 28,
    gap: 22,
  },

  field: {
    gap: 7,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
  },

  hint: {
    fontSize: 12,
    lineHeight: 17,
  },

  inputWrap: {
    height: 54,
    borderWidth: 1,
    borderRadius: 15,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  currency: {
    fontSize: 18,
    fontWeight: "700",
    marginRight: 8,
  },

  input: {
    flex: 1,
    fontSize: 18,
    fontWeight: "600",
    paddingVertical: 0,
  },

  save: {
    height: 54,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 28,
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  cancel: {
    alignItems: "center",
    paddingTop: 17,
  },

  cancelText: {
    fontSize: 14,
    fontWeight: "600",
  },
});
