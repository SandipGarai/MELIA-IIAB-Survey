# ICAR-IIAB Research Data Management Survey 2025-26

A mobile-friendly web form for collecting research data management information from Principal Investigators and project scientists at ICAR-Indian Institute of Agricultural Biotechnology, Ranchi.

Developed for the MELIA (Monitoring, Evaluation, Learning and Impact Assessment) Unit.  
Nodal Officer: Dr. Sandip Garai, Scientist, ICAR-IIAB Ranchi.

---

## Files

| File | Purpose |
|---|---|
| `form.html` | The survey form — this is the page users open |
| `style.css` | All visual styles |
| `form.js` | All interactivity (draft save, validation, receipt) |
| `data.js` | Project and personnel data — **edit this when projects change** |
| `Code.gs` | Google Apps Script backend — paste into script.google.com |
| `README.md` | This file |

---

## Hosting on GitHub Pages (step by step)

### Step 1 — Create a GitHub account
Go to [github.com](https://github.com) and sign up if you do not have an account.

### Step 2 — Create a new repository
1. Click the **+** icon (top right) → **New repository**
2. Repository name: `iiab-survey` (or any name you prefer)
3. Set visibility to **Public** (required for free GitHub Pages)
4. Click **Create repository**

### Step 3 — Upload the files
1. On the repository page, click **Add file** → **Upload files**
2. Drag and drop all five files:
   - `form.html`
   - `style.css`
   - `form.js`
   - `data.js`
   - `README.md`
   - (Do **not** upload `Code.gs` — that goes in Google Apps Script only)
3. Click **Commit changes**

### Step 4 — Enable GitHub Pages
1. Go to **Settings** tab of your repository
2. Scroll to **Pages** in the left sidebar
3. Under **Source**, select **Deploy from a branch**
4. Branch: **main**, folder: **/ (root)**
5. Click **Save**
6. Wait 1–2 minutes. A green banner will appear with your URL.

### Step 5 — Your form URL
GitHub Pages will give you a URL like:

```
https://YOUR-USERNAME.github.io/iiab-survey/form.html
```

Share this URL with scientists at ICAR-IIAB. It works on any mobile browser.

---

## Connecting to Google Sheets (backend setup)

### Step 1 — Set up the Apps Script
1. Go to [script.google.com](https://script.google.com)
2. Click **New project**, name it `IIAB Survey Backend`
3. Delete all existing code
4. Paste the entire contents of `Code.gs`
5. Save (Ctrl+S)

### Step 2 — Deploy as Web App
1. Click **Deploy** → **New deployment**
2. Type: **Web app**
3. Execute as: **Me**
4. Who has access: **Anyone**
5. Click **Deploy**
6. Authorise the permissions when prompted
7. Copy the **Web App URL**

### Step 3 — Link the form to the backend
1. Open `form.js` in VS Code
2. Find this line near the bottom:
   ```js
   const SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEBAPP_URL_HERE';
   ```
3. Replace the placeholder with the URL you copied
4. Save `form.js`
5. Go to your GitHub repository → click `form.js` → click the pencil (Edit) icon
6. Paste the updated content → **Commit changes**

Responses will now be saved automatically to a Google Sheet at:
`My Drive / MELIA / Surveys / 2025-26 / IIAB-Survey 2025-26`

---

## Updating projects in future

Open `data.js` and edit the `PROJECTS` array. Each entry looks like:

```js
{
  id:      "IP-28",
  title:   "Artificial Intelligence driven monitoring...",
  type:    "IP",
  funding: "ICAR",
  pi:      "Dr. Sandip Garai",
  copis:   ["Dr. Suryakant Manik", "Dr. Tanmaya K. Sahu"]
}
```

After editing, upload the new `data.js` to GitHub (replace the existing file). The form updates automatically.

---

## Features

- Autocomplete name search with pre-loaded scientist list
- Multi-project selection — one form covers all projects
- Per-project data entry panels generated dynamically
- Auto-save draft to browser local storage (every 5 seconds after last keystroke)
- Restore draft on page reload
- Submission confirmation receipt with reference number
- Print / Save as PDF receipt
- Fully mobile-friendly — tested on iOS Safari and Android Chrome
- Responses saved to a named Google Sheet in a specific Drive folder

---

## Contact

Dr. Sandip Garai  
Scientist and MELIA Nodal Officer  
ICAR-Indian Institute of Agricultural Biotechnology  
Garhkhatanga, Ranchi — 834010, Jharkhand  
Email: sandipnicksandy@gmail.com
