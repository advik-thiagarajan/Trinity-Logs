# Trinity Logs

**Trinity Logs** is an elegant, client-side web application designed for monthly class attendance and fee reconciliation. It allows instructors, coaches, and studio administrators to enter class attendees (via direct text/paste or spreadsheet) and cross-reference them against monthly fee collection logs to immediately identify students who have not paid their dues.

---

## Features

- **✍️ Flexible Attendance Entry**:
  - **Type or Paste Names**: Paste lists directly from WhatsApp or Notes (e.g. `Aarav Patel`, `Diya Sharma (Evening Dance)`).
  - **Excel / CSV Upload**: Drop `.xlsx`, `.xls`, or `.csv` files.
- **📁 Monthly Payment Log**:
  - Upload fee receipts spreadsheet or paste payment records.
  - Auto-detects columns for Student Name, Contact Number, Batch, and Amount.
  - Customizable Column Mapping modal for non-standard spreadsheets.
- **⚡ Smart Reconciliation Engine**:
  - Automatically matches students across variations in casing, token order (e.g. `Advik Sharma` vs `Sharma Advik`), and prefixes (`Mr.`, `Ms.`).
  - Secondary phone number match to resolve spelling differences.
- **🚨 Actionable Outcomes**:
  - **Unpaid Students Tab**: Focused view of all defaulters.
  - **Excel Export**: Download the unpaid list as a cleanly formatted `.xlsx` file.
  - **1-Click WhatsApp Reminders**: Generate personalized fee reminders with direct `wa.me` links or bulk copy.
  - **Printable Audit Report**: Formal printable layout (`Ctrl+P` or via the Print button).
- **🔒 100% Client-Side Privacy**:
  - All processing occurs directly in the user's browser. No student or financial data is transmitted to external servers.

---

## Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev

# Run automated reconciliation tests
npm test

# Build for production
npm run build
```

---

## Deploying to Vercel

Trinity Logs is built with Vite and React and deploys seamlessly on Vercel with zero extra configuration.

1. Push your code to GitHub:
   ```bash
   git push -u origin main
   ```
2. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
3. Click **"Add New..."** → **"Project"**.
4. Select the **`Trinity-Logs`** repository and click **"Import"**.
5. Vercel automatically detects the **Vite** preset:
   - **Framework Preset**: `Vite`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
6. Click **"Deploy"**. Your site will be live within 30 seconds with a free `.vercel.app` domain!
