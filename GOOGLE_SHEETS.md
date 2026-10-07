# Google Sheets sync

Monee exports expenses through a small Google Apps Script Web App. This keeps Google credentials out of the mobile app.

## 1. Create the sheet

Create a Google Sheet and use the first row for:

`id | amount | description | category | date | month | createdAt`

## 2. Add Apps Script

In **Extensions → Apps Script**, paste:

```javascript
const SHEET_NAME = "Expenses";

function doPost(e) {
  const body = JSON.parse(e.postData.contents || "{}");
  const expenses = Array.isArray(body.expenses) ? body.expenses : [];
  const sheet =
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(SHEET_NAME) ||
    SpreadsheetApp.getActiveSpreadsheet().insertSheet(SHEET_NAME);

  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "id",
      "amount",
      "description",
      "category",
      "date",
      "month",
      "createdAt",
    ]);
  }

  const values = sheet.getDataRange().getValues();
  const idColumn = 0;
  const index = new Map();
  for (let i = 1; i < values.length; i++)
    index.set(String(values[i][idColumn]), i + 1);

  expenses.forEach((expense) => {
    const row = [
      expense.id,
      expense.amount,
      expense.description || "",
      expense.category,
      expense.date,
      expense.month,
      expense.createdAt,
    ];
    const existingRow = index.get(String(expense.id));
    if (existingRow)
      sheet.getRange(existingRow, 1, 1, row.length).setValues([row]);
    else sheet.appendRow(row);
  });

  return ContentService.createTextOutput(
    JSON.stringify({ ok: true, synced: expenses.length }),
  ).setMimeType(ContentService.MimeType.JSON);
}
```

## 3. Deploy

Choose **Deploy → New deployment → Web app**.

- Execute as: **Me**
- Who has access: **Anyone**

Copy the Web App URL ending in `/exec` and paste it into Monee → Settings → Google Sheets connection.

The app sends the complete local expense list on every export. The script upserts rows by `id`, so pressing Export again does not duplicate existing transactions.
