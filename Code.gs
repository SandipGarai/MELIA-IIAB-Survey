// ============================================================
//  ICAR-IIAB Data Management Survey  —  Code.gs
//  Google Apps Script backend
//
//  SETUP:
//  1. Go to https://script.google.com  ->  New project
//  2. Paste this entire file, save (Ctrl+S)
//  3. Deploy -> New deployment -> Web app
//       Execute as : Me
//       Who has access : Anyone
//  4. Click Deploy, copy the Web App URL
//  5. Open form.js in VS Code
//     Find:  const SCRIPT_URL = 'YOUR_APPS_SCRIPT_WEBAPP_URL_HERE';
//     Replace the string with the URL you just copied
//  6. Save form.js. The form will now save to Google Sheets.
//
//  GENERATING THE REPORT:
//  After responses are collected, open this script in
//  script.google.com and run  generateReport()  manually.
//  It creates a formatted "REPORT" sheet and a second
//  "CHALLENGES" sheet listing all free-text challenges.
// ============================================================

// ── CONFIGURATION ─────────────────────────────────────────
// Edit these two values if you ever need to rename or move the file.
// Everything else in this script reads from CONFIG automatically.

const CONFIG = {

  // Name of the Google Spreadsheet that will be created in your Drive.
  // This is what you will see in Google Drive and Google Sheets.
  FILE_NAME: 'IIAB-Survey 2025-26',

  // Full path of the folder inside your Google Drive where the file
  // will be saved.  Use  /  to separate nested folders.
  // Examples:
  //   'MELIA'                   — top-level folder called MELIA
  //   'MELIA/Surveys'           — subfolder Surveys inside MELIA
  //   'MELIA/Surveys/2025-26'   — two levels deep
  //
  // The script will create any missing folders automatically.
  FOLDER_PATH: 'MELIA/Surveys/2025-26'

};

// ── COLUMN SCHEMA ─────────────────────────────────────────
// One row per project entry (a respondent with 3 projects = 3 rows).
// Base respondent columns are repeated on every row for easy filtering.

const BASE_COLS = [
  'Submission Timestamp',
  'Respondent Name',
  'Email',
  'Designation',
  'Role',
  'Suggestions (General)',
  'Other Info'
];

const PROJECT_COLS = [
  'Project ID',
  'Project Title',
  'Project Type',
  'Funding Agency',
  'PI Name',
  'Co-PIs',
  'Data Types',
  'Data Type (Other)',
  'Data Formats',
  'Data Format (Other)',
  'Data Volume',
  'Standardised Format Used',
  'Metadata Collected',
  'GPS / Geo-referencing',
  'Storage Locations',
  'Cloud Storage Detail',
  'Backup Frequency',
  'KRISHI Upload Status',
  'KRISHI Non-upload Reason',
  'Data Sharing',
  'Open Access Status',
  'Open Databases',
  'ICAR Data Policy Awareness',
  'Data Management Plan',
  'Compliance Score (1-5)',
  'Challenges'
];

const ALL_COLS = [...BASE_COLS, ...PROJECT_COLS];

// ── RECEIVE POST ───────────────────────────────────────────
function doPost(e) {
  try {
    const payload = JSON.parse(e.postData.contents);
    writeToSheet(payload);
    return ok('saved');
  } catch(err) {
    return ok('error: ' + err.toString());
  }
}

// ── HEALTH CHECK ───────────────────────────────────────────
function doGet() {
  return ContentService
    .createTextOutput('ICAR-IIAB Survey backend is live.')
    .setMimeType(ContentService.MimeType.TEXT);
}

// ── WRITE ROWS ─────────────────────────────────────────────
function writeToSheet(payload) {
  const ss    = getSheet('Responses');
  if (ss.getLastRow() === 0) writeHeaders(ss);

  const base = [
    payload.timestamp   || '',
    payload.respondent  || '',
    payload.email       || '',
    payload.designation || '',
    payload.role        || '',
    payload.suggestions || '',
    payload.other_info  || ''
  ];

  const projects = payload.projects || [];
  if (!projects.length) {
    ss.appendRow([...base, ...Array(PROJECT_COLS.length).fill('')]);
    return;
  }

  projects.forEach(p => {
    const projRow = [
      p.project_id    || '',
      p.project_title || '',
      p.project_type  || '',
      p.funding       || '',
      p.pi            || '',
      p.copis         || '',
      p.data_types    || '',
      p.data_type_other   || '',
      p.data_formats  || '',
      p.data_format_other || '',
      p.data_volume   || '',
      p.std_format    || '',
      p.metadata      || '',
      p.gps           || '',
      p.storage       || '',
      p.cloud_detail  || '',
      p.backup        || '',
      p.krishi        || '',
      p.krishi_reason || '',
      p.sharing       || '',
      p.openaccess    || '',
      p.open_databases || '',
      p.policy_aware  || '',
      p.dmp           || '',
      p.compliance    || '',
      p.challenges    || ''
    ];
    ss.appendRow([...base, ...projRow]);
  });

  try { ss.autoResizeColumns(1, ALL_COLS.length); } catch(_) {}
}

// ── HEADERS ────────────────────────────────────────────────
function writeHeaders(sheet) {
  sheet.appendRow(ALL_COLS);
  const rng = sheet.getRange(1, 1, 1, ALL_COLS.length);
  rng.setBackground('#1a3a2a')
     .setFontColor('#ffffff')
     .setFontWeight('bold')
     .setWrap(true);
  sheet.setFrozenRows(1);
}

// ── GET / CREATE SHEET ─────────────────────────────────────
// Finds or creates the spreadsheet inside the configured folder.
// If the folder path does not exist, it is created automatically.
function getSheet(name) {
  const folder = getOrCreateFolder(CONFIG.FOLDER_PATH);

  // Look for an existing file with the configured name inside the folder
  const files = folder.getFilesByName(CONFIG.FILE_NAME);
  let ss;
  if (files.hasNext()) {
    ss = SpreadsheetApp.open(files.next());
  } else {
    // Create a new spreadsheet in the root, then move it to the folder
    ss = SpreadsheetApp.create(CONFIG.FILE_NAME);
    const file = DriveApp.getFileById(ss.getId());
    folder.addFile(file);
    DriveApp.getRootFolder().removeFile(file);  // remove from root
    Logger.log('Created spreadsheet "' + CONFIG.FILE_NAME +
               '" in folder "' + CONFIG.FOLDER_PATH + '"');
    Logger.log('URL: ' + ss.getUrl());
  }

  let sheet = ss.getSheetByName(name);
  if (!sheet) sheet = ss.insertSheet(name);
  return sheet;
}

// Walks the FOLDER_PATH string, creating any missing folders along the way.
// Returns the final (deepest) Folder object.
function getOrCreateFolder(path) {
  const parts = path.split('/').map(p => p.trim()).filter(Boolean);
  let current = DriveApp.getRootFolder();
  parts.forEach(part => {
    const found = current.getFoldersByName(part);
    if (found.hasNext()) {
      current = found.next();
    } else {
      current = current.createFolder(part);
      Logger.log('Created folder: ' + part);
    }
  });
  return current;
}

// ── GENERATE REPORT ────────────────────────────────────────
// Run this manually after collecting responses.
// It creates two sheets: REPORT (statistics) and CHALLENGES (free text).
function generateReport() {
  const folder = getOrCreateFolder(CONFIG.FOLDER_PATH);
  const files  = folder.getFilesByName(CONFIG.FILE_NAME);
  if (!files.hasNext()) {
    Browser.msgBox('Spreadsheet "' + CONFIG.FILE_NAME + '" not found in folder "' +
                   CONFIG.FOLDER_PATH + '". No responses yet.');
    return;
  }
  const ss        = SpreadsheetApp.open(files.next());
  const dataSheet = ss.getSheetByName('Responses');
  if (!dataSheet || dataSheet.getLastRow() < 2) {
    Browser.msgBox('No responses found in the Responses sheet.');
    return;
  }

  const allData = dataSheet.getDataRange().getValues();
  const headers = allData[0];
  const rows    = allData.slice(1);
  const total   = rows.length;

  // Helper functions
  function col(name) { return headers.indexOf(name); }

  function countUnique(colName) {
    const idx = col(colName);
    const map = {};
    rows.forEach(r => {
      const vals = String(r[idx] || '').split(';').map(v => v.trim()).filter(Boolean);
      vals.forEach(v => { map[v] = (map[v] || 0) + 1; });
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }

  function avg(colName) {
    const idx    = col(colName);
    const values = rows.map(r => parseFloat(r[idx])).filter(n => !isNaN(n));
    if (!values.length) return 'N/A';
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2);
  }

  function uniqueRespondents() {
    const idx = col('Respondent Name');
    return new Set(rows.map(r => r[idx])).size;
  }

  function uniqueProjects() {
    const idx = col('Project ID');
    return new Set(rows.map(r => r[idx])).size;
  }

  // --- Build REPORT sheet ---
  let rSheet = ss.getSheetByName('REPORT');
  if (rSheet) ss.deleteSheet(rSheet);
  rSheet = ss.insertSheet('REPORT');

  let r = 1;

  function cell(row, c, val, style) {
    const cl = rSheet.getRange(row, c).setValue(val);
    if (style) {
      if (style.bold)    cl.setFontWeight('bold');
      if (style.bg)      cl.setBackground(style.bg);
      if (style.fg)      cl.setFontColor(style.fg);
      if (style.size)    cl.setFontSize(style.size);
      if (style.italic)  cl.setFontStyle('italic');
      if (style.wrap)    cl.setWrap(true);
      if (style.merge)   rSheet.getRange(row, c, 1, style.merge).merge();
      if (style.halign)  cl.setHorizontalAlignment(style.halign);
    }
  }

  // Title
  cell(r, 1, 'ICAR-IIAB RESEARCH DATA MANAGEMENT STATUS REPORT ' + new Date().getFullYear(),
    { bold:true, bg:'#1a3a2a', fg:'#ffffff', size:13, merge:5, wrap:true });
  r++;
  cell(r, 1, 'Prepared by: Dr. Sandip Garai, MELIA Nodal Officer, ICAR-IIAB, Ranchi',
    { italic:true, merge:5 });
  r++;
  cell(r, 1, 'Report generated: ' + new Date().toDateString(), { merge:5 });
  r++;
  cell(r, 1, 'Total submission rows: ' + total +
    '   |   Unique respondents: ' + uniqueRespondents() +
    '   |   Projects covered: '   + uniqueProjects(),
    { bold:true, merge:5 });
  r += 2;

  function sectionHeader(title) {
    rSheet.getRange(r, 1, 1, 5).merge()
      .setValue(title)
      .setBackground('#c3dfc9')
      .setFontWeight('bold')
      .setFontColor('#1a3a2a');
  }

  function tableHeader() {
    cell(r, 1, 'Response Option', { bold:true, bg:'#e8f4ea' });
    cell(r, 2, 'Count',           { bold:true, bg:'#e8f4ea', halign:'center' });
    cell(r, 3, '% of rows',       { bold:true, bg:'#e8f4ea', halign:'center' });
  }

  function addTable(colName) {
    const entries = countUnique(colName);
    tableHeader();
    r++;
    entries.forEach(([k, v]) => {
      cell(r, 1, k);
      cell(r, 2, v, { halign:'center' });
      cell(r, 3, Math.round(v / total * 100) + '%', { halign:'center' });
      r++;
    });
    r++;
  }

  const sections = [
    ['KRISHI Portal Upload Status',       'KRISHI Upload Status'],
    ['Metadata Collection Practice',      'Metadata Collected'],
    ['Backup Frequency',                  'Backup Frequency'],
    ['Data Sharing Practice',             'Data Sharing'],
    ['Open Access Status',                'Open Access Status'],
    ['ICAR Data Policy Awareness',        'ICAR Data Policy Awareness'],
    ['Data Management Plan Status',       'Data Management Plan'],
    ['Standardised Format Usage',         'Standardised Format Used'],
    ['GPS / Geo-referencing Practice',    'GPS / Geo-referencing'],
    ['Data Volume per Year',              'Data Volume'],
    ['Storage Locations Used',            'Storage Locations'],
    ['Data Types Generated',              'Data Types'],
    ['Data Recording Formats',            'Data Formats']
  ];

  sections.forEach(([title, colName]) => {
    sectionHeader(title); r++;
    addTable(colName);
  });

  // Compliance score average
  sectionHeader('Compliance Score with ICAR Data Policy 2025 (Average)'); r++;
  cell(r, 1, 'Average score (1 = not compliant, 5 = fully compliant)',
    { bold:true });
  cell(r, 2, avg('Compliance Score (1-5)'), { bold:true, halign:'center' });
  r += 2;

  rSheet.autoResizeColumns(1, 5);

  // --- Build CHALLENGES sheet ---
  let cSheet = ss.getSheetByName('CHALLENGES');
  if (cSheet) ss.deleteSheet(cSheet);
  cSheet = ss.insertSheet('CHALLENGES');

  cSheet.appendRow(['Respondent', 'Project ID', 'Project Title', 'Challenges Reported']);
  const hdr = cSheet.getRange(1, 1, 1, 4);
  hdr.setBackground('#1a3a2a').setFontColor('#ffffff').setFontWeight('bold');
  cSheet.setFrozenRows(1);

  const namIdx  = col('Respondent Name');
  const pidIdx  = col('Project ID');
  const ptIdx   = col('Project Title');
  const challIdx = col('Challenges');

  rows.forEach(row => {
    const ch = String(row[challIdx] || '').trim();
    if (ch) {
      cSheet.appendRow([row[namIdx], row[pidIdx], row[ptIdx], ch]);
    }
  });
  cSheet.autoResizeColumns(1, 4);

  const url = ss.getUrl();
  Logger.log('Report created: ' + url);
  Browser.msgBox('Report generated.\n\n' +
    'File : ' + CONFIG.FILE_NAME + '\n' +
    'Folder : ' + CONFIG.FOLDER_PATH + '\n\n' +
    'Sheets created:\n' +
    '  - REPORT (statistics)\n' +
    '  - CHALLENGES (free text)\n\n' +
    'URL: ' + url);
}

// ── UTILITY ────────────────────────────────────────────────
function ok(msg) {
  return ContentService
    .createTextOutput(JSON.stringify({ status: msg }))
    .setMimeType(ContentService.MimeType.JSON);
}
