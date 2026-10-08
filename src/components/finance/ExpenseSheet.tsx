import {
  Alert,
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
import { useSettingsStore } from "@/stores/settingsStore";

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
  const sounds = useSettingsStore((s) => s.soundsEnabled);
  const animeVoice = useSettingsStore((s) => s.animeVoiceEnabled);
  const deleteExpense = useFinanceStore((s) => s.deleteExpense);
  const { play, playVoice } = useAppSounds(sounds, animeVoice);
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

  const remove = () => {
    if (!expense) return;

    Alert.alert(
      "Delete expense?",
      `Remove "${expense.description || expense.category}"?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              setSaving(true);

              await deleteExpense(expense.id);

              try {
                await Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Warning,
                );
              } catch {}

              try {
                play("delete");

                if (animeVoice) {
                  playVoice("sayonara");
                }
              } catch {}

              onClose();
            } catch (error) {
              console.error("[Monee] Failed to delete expense:", error);

              Alert.alert(
                "Couldn't delete expense",
                error instanceof Error
                  ? error.message
                  : "Something went wrong while deleting the expense.",
              );
            } finally {
              setSaving(false);
            }
          },
        },
      ],
    );
  };

  const save = async () => {
    const n = Number(amount.replace(/,/g, "").trim());

    const isValidDate = /^\d{4}-\d{2}-\d{2}$/.test(date);
    const safeDate = isValidDate ? date : `${month}-01`;

    if (!Number.isFinite(n) || n <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid expense amount.");
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

      try {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success,
        );
      } catch (error) {
        console.warn("[Monee] Haptics failed:", error);
      }

      try {
        play("expense");

        if (!expense && animeVoice) {
          playVoice("yatta");
        }
      } catch (error) {
        console.warn("[Monee] Sound failed:", error);
      }

      onClose();
    } catch (error) {
      console.error("[Monee] Failed to save expense:", error);

      Alert.alert(
        "Couldn't save expense",
        error instanceof Error
          ? error.message
          : "Something went wrong while saving the expense.",
      );
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

          {expense && (
            <Pressable
              onPress={remove}
              disabled={saving}
              style={({ pressed }) => [
                s.deleteButton,
                {
                  borderColor: t.danger,
                  opacity: pressed || saving ? 0.6 : 1,
                },
              ]}
            >
              <AppText style={[s.deleteText, { color: t.danger }]}>
                Delete expense
              </AppText>
            </Pressable>
          )}
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
  deleteButton: {
    height: 48,
    borderWidth: 1,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -4,
  },

  deleteText: {
    fontSize: 14,
    fontWeight: "700",
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
