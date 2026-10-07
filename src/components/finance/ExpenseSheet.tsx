import {
  Modal,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { AppText } from "@/components/ui/AppText";
import { Button } from "@/components/ui/Button";
import { useTheme } from "@/hooks/useTheme";
import {
  CATEGORIES,
  type Expense,
  type ExpenseCategory,
} from "@/types/finance";
import { useFinanceStore } from "@/stores/financeStore";
import * as Haptics from "expo-haptics";
import { useAppSounds } from "@/utils/sound";

export function ExpenseSheet({
  visible,
  onClose,
  month,
  expense,
}: {
  visible: boolean;
  onClose: () => void;
  month: string;
  expense?: Expense;
}) {
  const t = useTheme();
  const add = useFinanceStore((s) => s.addExpense);
  const update = useFinanceStore((s) => s.updateExpense);
  const { play } = useAppSounds();
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ExpenseCategory>("Food");
  const [date, setDate] = useState(
    `${month}-${String(new Date().getDate()).padStart(2, "0")}`,
  );
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    if (visible) {
      setAmount(expense ? String(expense.amount) : "");
      setDescription(expense?.description ?? "");
      setCategory(expense?.category ?? "Food");
      setDate(
        expense?.date ??
          `${month}-${String(new Date().getDate()).padStart(2, "0")}`,
      );
    }
  }, [visible, expense, month]);

  const save = async () => {
    const n = Number(amount.replace(/,/g, ""));

    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);

    const safeDate = isValidDate ? date : `${month}-01`;

    if (!Number.isFinite(n) || n <= 0) {
      return;
    }

    setSaving(true);

    try {
      if (expense) {
        await update({
          ...expense,
          amount: n,
          description: description.trim(),
          category,
          date: safeDate,
          month: safeDate.slice(0, 7),
        });
      } else {
        await add({
          amount: n,
          description: description.trim(),
          category,
          date: safeDate,
          month: safeDate.slice(0, 7),
        });
      }

      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      play("success");

      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={s.overlay}
      >
        <Pressable style={s.backdrop} onPress={onClose} />
        <View style={[s.sheet, { backgroundColor: t.surface }]}>
          <View style={s.handle} />
          <View style={s.header}>
            <View>
              <AppText style={s.kicker}>
                {expense ? "EDIT ENTRY" : "NEW ENTRY"}
              </AppText>
              <AppText style={s.title}>
                {expense ? "Edit expense" : "Add expense"}
              </AppText>
            </View>
            <Pressable onPress={onClose}>
              <AppText style={s.close}>Close</AppText>
            </Pressable>
          </View>
          <TextInput
            autoFocus={!expense}
            keyboardType="number-pad"
            value={amount}
            onChangeText={setAmount}
            placeholder="₹ 0"
            placeholderTextColor={t.secondary}
            style={[s.amount, { color: t.text, borderBottomColor: t.border }]}
            accessibilityLabel="Expense amount"
          />
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder="What was this for?"
            placeholderTextColor={t.secondary}
            style={[s.input, { color: t.text, borderBottomColor: t.border }]}
            returnKeyType="done"
          />
          <TextInput
            value={date}
            onChangeText={setDate}
            placeholder="YYYY-MM-DD"
            placeholderTextColor={t.secondary}
            style={[s.input, { color: t.text, borderBottomColor: t.border }]}
            autoCapitalize="none"
          />
          <AppText style={s.label}>CATEGORY</AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.chips}
          >
            {CATEGORIES.map((c) => (
              <Pressable
                key={c}
                onPress={() => setCategory(c)}
                style={[
                  s.chip,
                  {
                    borderColor: category === c ? t.accent : t.border,
                    backgroundColor: category === c ? t.accentSoft : t.surface,
                  },
                ]}
              >
                <AppText
                  style={{
                    fontSize: 13,
                    color: category === c ? t.accent : t.text,
                    fontWeight: category === c ? "700" : "500",
                  }}
                >
                  {c}
                </AppText>
              </Pressable>
            ))}
          </ScrollView>
          <Button
            title={expense ? "Save changes" : "Add expense"}
            onPress={save}
            disabled={saving || !amount}
          />
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
const s = StyleSheet.create({
  overlay: { flex: 1, justifyContent: "flex-end" },
  backdrop: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0,0,0,0.38)",
  },
  sheet: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    gap: 14,
  },
  handle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#C8C8C4",
    alignSelf: "center",
    marginBottom: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  kicker: {
    fontSize: 10,
    letterSpacing: 1.4,
    fontWeight: "800",
    color: "#89838D",
  },
  title: { fontSize: 22, fontWeight: "800", marginTop: 3 },
  close: { fontSize: 13, color: "#737373" },
  amount: {
    fontSize: 42,
    fontWeight: "700",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  input: { fontSize: 16, paddingVertical: 12, borderBottomWidth: 1 },
  label: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    marginTop: 4,
    color: "#817A88",
  },
  chips: { gap: 8, paddingVertical: 2, paddingRight: 20 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: 1,
  },
});
