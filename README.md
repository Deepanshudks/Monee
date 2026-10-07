# Monee

A local-first personal expense tracker for Expo / React Native.

## What changed in 1.1

- First-launch aesthetic splash and setup flow for name + default monthly budget.
- Persistent settings backed by SQLite.
- Editable expenses: amount, description, category and date.
- Editable default monthly budget.
- Month/year picker on Home, Activity and Insights.
- Activity search, category filters and sorting.
- CSV expense import with merge/upsert behavior.
- Google Sheets sync through a Google Apps Script Web App.
- Lightweight tap/success sound effects with a Settings toggle.
- More expressive Apple-inspired visual system with lavender, peach, sage and sky accents.
- No automatic development seed on startup; existing local data is preserved.

## Install new native dependencies

```bash
npx expo install expo-audio expo-document-picker expo-file-system
```

Then start clean if needed:

```bash
npx expo start -c
```

## CSV import format

Monee accepts headers such as:

```csv
id,amount,description,category,date,month,createdAt
abc-1,200,Lunch,Food,2026-10-07,2026-10,2026-10-07T12:00:00.000Z
```

The importer also accepts common aliases such as `title`, `name`, `note`, `value`, `price`, `type` and `timestamp`.

## Google Sheets

Follow [GOOGLE_SHEETS.md](./GOOGLE_SHEETS.md) to deploy the tiny Apps Script webhook, then paste its `/exec` URL into Settings.

Export is an upsert by expense ID, so repeated exports do not create duplicate rows.
