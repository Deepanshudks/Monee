# Monee

A local-first personal finance and expense tracker built with **Expo + React Native**.

Monee is designed for simple personal use: track expenses, manage monthly budgets, carry unused/overspent budget between months, and keep your financial data stored locally on your device.

## Features

- 🏠 **Personal finance dashboard** with monthly spending overview.
- 💰 **Rolling monthly budgets** with automatic carry-forward.
- 📊 **Budget, spending and remaining balance** calculations.
- 📅 **Month/year picker** across Home, Activity and Insights.
- ✏️ **Editable expenses** — amount, description, category and date.
- 🗑️ **Delete expenses** with confirmation.
- 🔎 **Expense search** with category filtering.
- ↕️ **Expense sorting** by newest, oldest, highest and lowest.
- 📥 **CSV expense import** with merge/upsert behavior.
- 📤 **Google Sheets sync** through a Google Apps Script Web App.
- 🔊 **Sound effects** for important actions.
- ✨ **Optional anime-style voice reactions** for selected actions.
- ⚙️ **Persistent settings** stored locally.
- 🎨 **Modern Apple-inspired UI** with soft accent colors and clean typography.
- 🌙 **Light, dark and system themes**.
- 🔒 **Local-first architecture** — financial data stays on the device unless you explicitly sync/export it.
- 🚫 **No automatic development seed data** on startup.

## Budget System

Monee uses a rolling monthly budget model.

Each month has a **base budget**. Any remaining amount from the previous month is automatically carried into the next month.

For example:

```text
October
Base budget:      ₹25,000
Spent:             ₹5,000
Remaining:        ₹20,000

November
Base budget:      ₹25,000
Carry forward:    ₹20,000
Available budget: ₹45,000
```

Overspending also carries forward:

```text
October
Base budget:      ₹25,000
Spent:            ₹30,000
Remaining:        -₹5,000

November
Base budget:      ₹25,000
Carry forward:    -₹5,000
Available budget: ₹20,000
```

Carry-forward is calculated dynamically from the previous month's remaining balance rather than being stored as a separate value.

## First Launch

On the first launch, Monee guides you through a simple setup flow:

- Your name
- Default monthly budget

These settings are persisted locally and can be changed later from **Settings**.

## Expense Management

Each expense supports:

- Amount
- Description
- Category
- Date
- Month

Existing expenses can be edited or deleted directly from the Activity screen.

Deleting an expense requires confirmation before the transaction is permanently removed.

## CSV Import

Monee accepts CSV files with headers such as:

```csv
id,amount,description,category,date,month,createdAt
abc-1,200,Lunch,Food,2026-10-07,2026-10,2026-10-07T12:00:00.000Z
```

The importer also supports common aliases such as:

- `title`
- `name`
- `note`
- `value`
- `price`
- `type`
- `timestamp`

Imported expenses are merged using their expense ID, helping avoid duplicate transactions when the same data is imported more than once.

## Google Sheets

Monee can sync expenses and monthly budget data to Google Sheets using a small Google Apps Script Web App.

Follow:

`GOOGLE_SHEETS.md`

to deploy the webhook.

Then add the deployed `/exec` URL under:

**Settings → Google Sheets connection**

Exports use the expense ID as the unique identifier, so repeated syncs update existing records instead of creating duplicate rows.

## Sound & Anime Voice

Monee includes optional sound feedback for important interactions.

Sound effects include:

- Tap
- Expense added
- Success
- Delete
- Warning
- Error
- Transition

Optional voice reactions can also be enabled from:

**Settings → Anime voice**

Examples include reactions such as:

- `Yatta!`
- `Yosh!`
- `Sugoi!`
- `Nani?!`
- `Yabai!`
- `Sayonara`
- `Ikuzo`
- `Otsukaresama`

The app uses original/local audio assets rather than bundled dialogue from copyrighted anime episodes.

## Install Dependencies

Install the required Expo packages:

```bash
npx expo install expo-audio expo-document-picker expo-file-system
```

If you are using the latest project configuration and need to install all dependencies:

```bash
npm install
```

## Start Development

Start the Expo development server:

```bash
npx expo start
```

If you encounter Metro cache issues:

```bash
npx expo start -c
```

## Android APK

To create an installable Android APK using EAS:

```bash
eas build --platform android --profile preview
```

For a production Android App Bundle:

```bash
eas build --platform android --profile production
```

## iOS Build

Monee can also be built for iOS through Expo Application Services:

```bash
eas build --platform ios --profile preview
```

For App Store/TestFlight distribution:

```bash
eas build --platform ios --profile production
```

An Apple Developer account is required for iOS device distribution and TestFlight/App Store releases.

## Project Principles

Monee is intentionally built around a few simple principles:

- **Local first**
- **Simple personal finance**
- **Minimal data collection**
- **Fast interactions**
- **Clean UI**
- **No unnecessary complexity**

The goal is not to build another enterprise finance platform — it's a small, practical money tracker that is actually pleasant to use.

## Tech Stack

- **React Native**
- **Expo**
- **TypeScript**
- **Expo SQLite**
- **Zustand**
- **Expo Audio**
- **Expo Document Picker**
- **Expo File System**
- **Lucide React Native**
- **Expo Haptics**
- **Google Apps Script**
- **EAS Build**

## Version

**Monee 1.1**

> Built for personal use. Somehow became a real app.
