import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  TextInput,
  View,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system/legacy";
import {
  Download,
  FileUp,
  Music2,
  Sparkles,
  Trash2,
  UploadCloud,
  UserRound,
} from "lucide-react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppText } from "@/components/ui/AppText";
import { useTheme } from "@/hooks/useTheme";
import { useFinanceStore } from "@/stores/financeStore";
import { useSettingsStore } from "@/stores/settingsStore";
import { parseExpenseCSV } from "@/utils/csv";
import { syncExpensesToGoogleSheet } from "@/services/googleSheets";
import { useAppSounds } from "@/utils/sound";

export default function Settings() {
  const t = useTheme();
  const theme = useSettingsStore((s) => s.theme);
  const setTheme = useSettingsStore((s) => s.setTheme);
  const name = useSettingsStore((s) => s.userName);
  const setName = useSettingsStore((s) => s.setUserName);
  const defaultBudget = useSettingsStore((s) => s.defaultMonthlyBudget);
  const setBudget = useSettingsStore((s) => s.setDefaultBudget);
  const webhook = useSettingsStore((s) => s.sheetWebhookUrl);
  const setWebhook = useSettingsStore((s) => s.setSheetWebhookUrl);
  const sounds = useSettingsStore((s) => s.soundsEnabled);
  const setSounds = useSettingsStore((s) => s.setSoundsEnabled);
  const expenses = useFinanceStore((s) => s.expenses);
  const importExpenses = useFinanceStore((s) => s.importExpenses);
  const clearAll = useFinanceStore((s) => s.clearAll);
  const monthlyBudgets = useFinanceStore((s) => s.monthlyBudgets);
  const animeVoice = useSettingsStore((s) => s.animeVoiceEnabled);

  const setAnimeVoice = useSettingsStore((s) => s.setAnimeVoiceEnabled);
  const { play, playVoice } = useAppSounds(sounds, animeVoice);
  const [saving, setSaving] = useState(false);
  const editName = (v: string) => setName(v);
  const editBudget = (v: string) => {
    const n = Number(v.replace(/[^0-9]/g, ""));
    if (Number.isFinite(n) && n >= 0) setBudget(n);
  };

  const currentMonth = new Date().toISOString().slice(0, 7);
  const clearMonth = useFinanceStore((s) => s.clearMonth);
  const resetFinancialData = useFinanceStore((s) => s.resetFinancialData);

  const importFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          "text/csv",
          "text/comma-separated-values",
          "application/csv",
          "text/plain",
        ],
        copyToCacheDirectory: true,
      });
      if (result.canceled) return;
      const uri = result.assets?.[0]?.uri;

      if (!uri) {
        Alert.alert("Import failed", "No file was selected.");
        return;
      }

      const text = await FileSystem.readAsStringAsync(uri);
      const rows = parseExpenseCSV(text);
      if (!rows.length) {
        Alert.alert(
          "Nothing imported",
          "The CSV did not contain valid expense rows.",
        );
        return;
      }
      await importExpenses(rows);
      play("success");

      if (animeVoice) {
        playVoice("yosh");
      }
      Alert.alert(
        "Import complete",
        `${rows.length} expense${rows.length === 1 ? "" : "s"} imported.`,
      );
    } catch (e) {
      Alert.alert(
        "Import failed",
        e instanceof Error ? e.message : "Unable to read the file.",
      );
    }
  };
  const exportSheet = async () => {
    if (!webhook.trim()) {
      Alert.alert(
        "Connect Google Sheets",
        "Add your Google Sheets webhook URL below first.",
      );
      return;
    }
    setSaving(true);
    try {
      await syncExpensesToGoogleSheet(webhook, expenses, monthlyBudgets);
      play("success");

      if (animeVoice) {
        playVoice("yosh");
      }
      Alert.alert(
        "Synced",
        `${expenses.length} expenses are now in your Google Sheet.`,
      );
    } catch (e) {
      Alert.alert(
        "Sync failed",
        e instanceof Error ? e.message : "Unable to sync right now.",
      );
    } finally {
      setSaving(false);
    }
  };

  const clear = () => {
    const runClear = async (action: "month" | "all" | "reset") => {
      try {
        if (action === "month") {
          await clearMonth(currentMonth);
          play("tap");

          Alert.alert(
            "Expenses cleared",
            "Your current month's expenses have been removed.",
          );
          return;
        }

        if (action === "all") {
          await clearAll();
          play("tap");

          Alert.alert(
            "Expenses cleared",
            "All expense transactions have been removed.",
          );
          return;
        }

        await resetFinancialData();
        play("tap");

        Alert.alert(
          "Financial data reset",
          "Your expenses, budgets, and carry-forward data have been removed.",
        );
      } catch (error) {
        console.error("[Monee] Clear operation failed:", error);

        Alert.alert(
          "Something went wrong",
          error instanceof Error
            ? error.message
            : "Unable to complete this action.",
        );
      }
    };

    Alert.alert("Clear expenses", "Choose what you'd like to remove.", [
      {
        text: "Current month",
        onPress: () => {
          Alert.alert(
            "Clear current month?",
            `Remove all expenses recorded in ${currentMonth}?`,
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Clear month",
                style: "destructive",
                onPress: () => runClear("month"),
              },
            ],
          );
        },
      },
      {
        text: "All expenses",
        onPress: () => {
          Alert.alert(
            "Clear all expenses?",
            "This will remove every expense transaction. Your monthly budgets will remain unchanged.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Clear all",
                style: "destructive",
                onPress: () => runClear("all"),
              },
            ],
          );
        },
      },
      {
        text: "Reset financial data",
        style: "destructive",
        onPress: () => {
          Alert.alert(
            "Reset financial data?",
            "This will permanently remove all expenses, monthly budgets, and carry-forward data from this device.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Reset everything",
                style: "destructive",
                onPress: () => runClear("reset"),
              },
            ],
          );
        },
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
  };

  return (
    <SafeAreaView style={[s.safe, { backgroundColor: t.background }]}>
      <ScrollView
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        <AppText style={s.kicker}>PERSONALIZE YOUR Monee</AppText>
        <AppText style={s.title}>Settings</AppText>
        <Section title="Profile">
          <Row
            icon={<UserRound size={18} color={t.accent} />}
            label="Your name"
          >
            <TextInput
              value={name}
              onChangeText={editName}
              placeholder="Your name"
              placeholderTextColor={t.secondary}
              style={[s.inlineInput, { color: t.text }]}
            />
          </Row>
          <Row label="Default monthly budget">
            <TextInput
              value={String(defaultBudget)}
              onChangeText={editBudget}
              keyboardType="number-pad"
              style={[s.inlineInput, { color: t.text }]}
            />
          </Row>
        </Section>
        <Section title="Appearance">
          <View style={s.segment}>
            {(["system", "light", "dark"] as const).map((m) => (
              <Pressable
                key={m}
                onPress={() => setTheme(m)}
                style={[
                  s.option,
                  { backgroundColor: theme === m ? t.accent : t.muted },
                ]}
              >
                <AppText
                  style={{
                    color: theme === m ? "#fff" : t.text,
                    fontSize: 12,
                    fontWeight: "700",
                  }}
                >
                  {m.charAt(0).toUpperCase() + m.slice(1)}
                </AppText>
              </Pressable>
            ))}
          </View>
          <Row
            icon={<Music2 size={18} color={t.accent} />}
            label="Sound effects"
          >
            <Switch
              value={sounds}
              onValueChange={setSounds}
              trackColor={{
                false: t.border,
                true: t.accent,
              }}
            />
          </Row>

          <Row
            icon={<Sparkles size={18} color={t.accent} />}
            label="Anime voice"
          >
            <Switch
              value={animeVoice}
              onValueChange={setAnimeVoice}
              trackColor={{
                false: t.border,
                true: t.accent,
              }}
            />
          </Row>
        </Section>
        <Section title="Data">
          <Pressable onPress={importFile} style={s.action}>
            <View style={[s.icon, { backgroundColor: t.accentSoft }]}>
              <FileUp size={18} color={t.accent} />
            </View>
            <View style={s.actionText}>
              <AppText style={s.actionTitle}>Import expenses</AppText>
              <AppText style={s.actionSub}>
                CSV · merge into your existing Monee
              </AppText>
            </View>
            <UploadCloud size={17} color={t.secondary} />
          </Pressable>
          <Pressable onPress={exportSheet} disabled={saving} style={s.action}>
            <View style={[s.icon, { backgroundColor: "#E8F3EF" }]}>
              <Download size={18} color={t.success} />
            </View>
            <View style={s.actionText}>
              <AppText style={s.actionTitle}>
                {saving ? "Syncing…" : "Export to Google Sheets"}
              </AppText>
              <AppText style={s.actionSub}>
                {expenses.length} expense{expenses.length === 1 ? "" : "s"} ·
                upsert by ID
              </AppText>
            </View>
            <UploadCloud size={17} color={t.secondary} />
          </Pressable>
          <Pressable onPress={clear} style={s.action}>
            <View style={[s.icon, { backgroundColor: "#F9E9EB" }]}>
              <Trash2 size={18} color={t.danger} />
            </View>
            <View style={s.actionText}>
              <AppText style={[s.actionTitle, { color: t.danger }]}>
                Clear expenses
              </AppText>
              <AppText style={s.actionSub}>
                Choose what you want to remove
              </AppText>
            </View>
          </Pressable>
        </Section>
        <Section title="Google Sheets connection">
          <AppText style={s.help}>
            Paste the deployed Google Apps Script Web App URL. The app sends
            your expense records securely over HTTPS; no Google account password
            is stored in Monee.
          </AppText>
          <TextInput
            value={webhook}
            onChangeText={setWebhook}
            autoCapitalize="none"
            autoCorrect={false}
            placeholder="https://script.google.com/macros/s/.../exec"
            placeholderTextColor={t.secondary}
            style={[
              s.urlInput,
              {
                color: t.text,
                borderColor: t.border,
                backgroundColor: t.surface,
              },
            ]}
          />
        </Section>
        <AppText style={s.version}>
          Tracking money I pretend I have · Kuldeep
        </AppText>
      </ScrollView>
    </SafeAreaView>
  );
}
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const t = useTheme();
  return (
    <View style={s.section}>
      <AppText style={s.sectionTitle}>{title}</AppText>
      <View
        style={[s.group, { backgroundColor: t.surface, borderColor: t.border }]}
      >
        {children}
      </View>
    </View>
  );
}
function Row({
  label,
  icon,
  children,
}: {
  label: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  const t = useTheme();
  return (
    <View style={[s.row, { borderBottomColor: t.border }]}>
      {icon ? <View style={s.rowIcon}>{icon}</View> : null}
      <AppText style={s.rowLabel}>{label}</AppText>
      <View style={s.rowValue}>{children}</View>
    </View>
  );
}
const s = StyleSheet.create({
  safe: { flex: 1 },
  content: { padding: 20, paddingBottom: 50 },
  kicker: {
    fontSize: 9,
    letterSpacing: 1.6,
    fontWeight: "800",
    color: "#89838D",
  },
  title: {
    fontSize: 31,
    fontWeight: "800",
    letterSpacing: -0.9,
    marginTop: 5,
    marginBottom: 28,
  },
  section: { marginBottom: 22 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: "800",
    color: "#89838D",
    marginLeft: 4,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  group: { borderRadius: 20, borderWidth: 1, overflow: "hidden" },
  row: {
    minHeight: 56,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    gap: 10,
  },
  rowIcon: {
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  rowLabel: { fontSize: 14, fontWeight: "600", flex: 1 },
  rowValue: { maxWidth: "55%", alignItems: "flex-end" },
  inlineInput: {
    fontSize: 14,
    textAlign: "right",
    minWidth: 100,
    paddingVertical: 4,
  },
  segment: { flexDirection: "row", gap: 6, padding: 7 },
  option: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 12,
  },
  action: {
    minHeight: 66,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#E8E1D7",
  },
  icon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  actionText: { flex: 1 },
  actionTitle: { fontSize: 14, fontWeight: "700" },
  actionSub: { fontSize: 11, color: "#817A88", marginTop: 3 },
  help: {
    fontSize: 12,
    color: "#817A88",
    lineHeight: 19,
    padding: 15,
    paddingBottom: 7,
  },
  urlInput: {
    margin: 15,
    marginTop: 5,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 13,
    height: 48,
    fontSize: 12,
  },
  version: {
    fontSize: 11,
    color: "#89838D",
    textAlign: "center",
    marginTop: 4,
  },
});
