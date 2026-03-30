// CSS.escape polyfill — needed for older Android browsers and some WebViews
if (typeof CSS === 'undefined' || typeof CSS.escape === 'undefined') {
  if (typeof CSS === 'undefined') { window.CSS = {}; }
  CSS.escape = function(value) {
    var str = String(value);
    var result = '';
    for (var i = 0; i < str.length; i++) {
      var char = str.charCodeAt(i);
      if (char === 0) { result += '\uFFFD'; continue; }
      if (char >= 0x0001 && char <= 0x001F || char === 0x007F ||
          i === 0 && char >= 0x0030 && char <= 0x0039 ||
          i === 1 && char >= 0x0030 && char <= 0x0039 &&
          str.charCodeAt(0) === 0x002D) {
        result += '\\' + char.toString(16) + ' '; continue;
      }
      if (i === 0 && char === 0x002D && str.length === 1) {
        result += '\\' + str[i]; continue;
      }
      if (char >= 0x0080 || char === 0x002D || char === 0x005F ||
          char >= 0x0030 && char <= 0x0039 ||
          char >= 0x0041 && char <= 0x005A ||
          char >= 0x0061 && char <= 0x007A) {
        result += str[i]; continue;
      }
      result += '\\' + str[i];
    }
    return result;
  };
}

/* ============================================================
   ICAR-IIAB Data Management Survey  —  form.js
   ============================================================ */

// ── STATE ─────────────────────────────────────────────────
const state = {
  selectedProjects: new Set(), // project ids checked
  includeOther: false,
};

// ── INIT ──────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  buildProjectList("ALL", "");
  initAutocomplete();
  initChoiceHighlight();
  initDraft();
  document.getElementById("main-form").addEventListener("submit", handleSubmit);
});

// ── AUTOCOMPLETE ──────────────────────────────────────────
function initAutocomplete() {
  const input = document.getElementById("name-input");
  const dropdown = document.getElementById("name-dropdown");

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    if (!q) {
      closeDropdown(dropdown);
      return;
    }
    const matches = ICAR_DATA.PERSONNEL.filter((p) =>
      p.toLowerCase().includes(q),
    );
    if (!matches.length) {
      closeDropdown(dropdown);
      return;
    }
    dropdown.innerHTML = matches
      .map((p) => {
        const hi = p.replace(
          new RegExp(`(${escRe(q)})`, "gi"),
          "<mark>$1</mark>",
        );
        return `<div class="ac-item" data-name="${esc(p)}">${hi}</div>`;
      })
      .join("");
    dropdown.classList.add("open");
  });

  dropdown.addEventListener("click", (e) => {
    const item = e.target.closest(".ac-item");
    if (!item) return;
    input.value = item.dataset.name;
    closeDropdown(dropdown);
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".autocomplete-wrap")) closeDropdown(dropdown);
  });
}

function closeDropdown(el) {
  el.classList.remove("open");
}

function toggleOtherName() {
  const wrap = document.getElementById("other-name-wrap");
  const showing = wrap.style.display !== "none";
  wrap.style.display = showing ? "none" : "block";
}

// ── PROJECT LIST ──────────────────────────────────────────
function buildProjectList(filter, query) {
  const container = document.getElementById("project-list");
  let projects = ICAR_DATA.PROJECTS;

  if (filter !== "ALL") projects = projects.filter((p) => p.type === filter);
  if (query) {
    const q = query.toLowerCase();
    projects = projects.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.pi.toLowerCase().includes(q) ||
        p.copis.some((c) => c.toLowerCase().includes(q)),
    );
  }

  if (!projects.length) {
    container.innerHTML =
      '<div style="padding:14px 16px;font-size:0.85rem;color:var(--muted)">No projects match.</div>';
    return;
  }

  container.innerHTML = projects
    .map(
      (p) => `
    <div class="proj-item${state.selectedProjects.has(p.id) ? " checked" : ""}"
         id="proj-row-${p.id}"
         onclick="toggleProject('${p.id}', this)">
      <input type="checkbox"
             name="project_ids"
             value="${p.id}"
             ${state.selectedProjects.has(p.id) ? "checked" : ""}
             onclick="event.stopPropagation()">
      <div class="proj-body">
        <div class="proj-title-text">${p.title}</div>
        <div class="proj-meta-row">
          <span class="tag tag-${p.type.toLowerCase()}">${p.type}</span>
          <span class="tag">PI: ${p.pi}</span>
          <span class="tag">${p.funding}</span>
        </div>
      </div>
    </div>
  `,
    )
    .join("");
}

function toggleProject(id, rowEl) {
  const cb = rowEl.querySelector('input[type="checkbox"]');
  if (cb) {
    cb.checked = !cb.checked;
    if (cb.checked) {
      state.selectedProjects.add(id);
      rowEl.classList.add("checked");
    } else {
      state.selectedProjects.delete(id);
      rowEl.classList.remove("checked");
    }
  }
  updateSelectedSummary();
  rebuildProjectForms();
}

function filterProjects(type, btn) {
  document
    .querySelectorAll(".filter-btn")
    .forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");
  buildProjectList(type, document.getElementById("proj-search").value);
}

function searchProjects(q) {
  const active = document.querySelector(".filter-btn.active");
  buildProjectList(active ? active.dataset.filter : "ALL", q);
}

function toggleOtherProject(cb) {
  state.includeOther = cb.checked;
  document.getElementById("proj-other-fields").style.display = cb.checked
    ? "block"
    : "none";
  updateSelectedSummary();
  rebuildProjectForms();
}

function updateSelectedSummary() {
  const box = document.getElementById("selected-projects-summary");
  const ids = [...state.selectedProjects];
  const otherChecked = state.includeOther;

  if (!ids.length && !otherChecked) {
    box.style.display = "none";
    return;
  }

  const lines = ids.map((id) => {
    const p = ICAR_DATA.PROJECTS.find((x) => x.id === id);
    return p
      ? `<b>${p.id}</b> — ${p.title.substring(0, 80)}${p.title.length > 80 ? "..." : ""}`
      : id;
  });
  if (otherChecked) lines.push("<b>Other</b> — to be described below");

  box.style.display = "block";
  box.innerHTML = `<b>Selected (${lines.length}):</b><br>` + lines.join("<br>");
}

// ── PER-PROJECT DATA ENTRY FORMS ──────────────────────────
// Each selected project gets its own data-entry block
function rebuildProjectForms() {
  const container = document.getElementById("project-forms-container");
  const ids = [...state.selectedProjects];

  // Remove blocks for deselected projects
  container.querySelectorAll(".proj-form-block").forEach((block) => {
    const bid = block.dataset.projId;
    if (bid === "OTHER" && !state.includeOther) block.remove();
    else if (bid !== "OTHER" && !ids.includes(bid)) block.remove();
  });

  // Add blocks for newly selected projects
  ids.forEach((id) => {
    if (container.querySelector(`[data-proj-id="${id}"]`)) return;
    const p = ICAR_DATA.PROJECTS.find((x) => x.id === id);
    if (!p) return;
    container.insertAdjacentHTML("beforeend", projectFormBlock(p));
    initChoiceHighlightIn(container.querySelector(`[data-proj-id="${id}"]`));
  });

  // Add OTHER block
  if (
    state.includeOther &&
    !container.querySelector('[data-proj-id="OTHER"]')
  ) {
    container.insertAdjacentHTML("beforeend", projectFormBlockOther());
  }
}

function projectFormBlock(p) {
  const n = p.id;
  return `
<div class="proj-form-block section-card" data-proj-id="${p.id}">
  <div class="proj-form-header">
    <span class="proj-id-tag">${p.id}</span>
    <span>${p.title.substring(0, 90)}${p.title.length > 90 ? "..." : ""}</span>
    <span class="proj-pi-note">PI: ${p.pi}</span>
  </div>
  <div class="proj-form-body">
    ${dataEntryFields(n)}
  </div>
</div>`;
}

function projectFormBlockOther() {
  return `
<div class="proj-form-block section-card" data-proj-id="OTHER">
  <div class="proj-form-header">
    <span class="proj-id-tag">OTHER</span>
    Other Project (described below)
  </div>
  <div class="proj-form-body">
    <div class="field-group">
      <label class="field-label">Project Title</label>
      <input type="text" name="OTHER_proj_title" placeholder="Full project title">
    </div>
    <div class="field-group">
      <label class="field-label">Funding Agency</label>
      <input type="text" name="OTHER_proj_funding" placeholder="e.g. ICAR, DBT, ANRF, RKVY">
    </div>
    ${dataEntryFields("OTHER")}
  </div>
</div>`;
}

// Shared per-project data fields; prefix = project id used for input names
function dataEntryFields(pfx) {
  return `
  <!-- Data Types -->
  <div class="field-group">
    <label class="field-label">Types of data generated <span class="req">*</span></label>
    <div class="choice-grid">
      ${checkboxes(pfx, "data_type", [
        "Lab / field measurements (crops, animals, fisheries)",
        "Germplasm / genetic resource data",
        "Survey / socio-economic data",
        "Meteorological / environmental data",
        "Genomics / metagenomics / metabolomics data",
        "Sequence data (DNA / RNA / protein)",
        "Geo-referenced / GIS data",
        "IPR / technology commercialisation data",
        "Photographs / audio-visual materials",
        "Publications / reports",
        "Other",
      ])}
    </div>
    <input type="text" name="${pfx}_data_type_other" style="margin-top:8px"
           placeholder="If Other, specify...">
  </div>

  <!-- Data Format (multi-select) -->
  <div class="field-group">
    <label class="field-label">
      Primary format(s) of data recording <span class="req">*</span>
      <span class="field-hint">Select all formats used.</span>
    </label>
    <div class="choice-grid">
      ${checkboxes(pfx, "data_format", [
        "Handwritten field books / lab notebooks",
        "MS Excel spreadsheets",
        "Digital apps / mobile sensors",
        "Custom software / database",
        "LIMS (Lab Information Management System)",
        "Statistical software output (R, SAS, SPSS)",
        "Bioinformatics pipeline output",
        "Mixed / multiple formats",
        "Other",
      ])}
    </div>
    <input type="text" name="${pfx}_data_format_other" style="margin-top:8px"
           placeholder="If Other, specify...">
  </div>

  <!-- Data Volume -->
  <div class="field-group">
    <label class="field-label">Approximate data volume generated per year <span class="req">*</span></label>
    <div class="choice-grid">
      ${radios(pfx, "data_volume", [
        "Less than 1 GB",
        "1 GB - 10 GB",
        "10 GB - 100 GB",
        "More than 100 GB",
        "Not measured / not sure",
      ])}
    </div>
  </div>

  <!-- Standardised Format -->
  <div class="field-group">
    <label class="field-label">Are standardised data collection formats used?</label>
    <div class="choice-grid col-1">
      ${radios(pfx, "std_format", [
        "Yes - ICAR-prescribed formats",
        "Yes - custom institute formats",
        "Partially standardised",
        "No - each person uses their own format",
      ])}
    </div>
  </div>

  <hr class="field-divider">

  <!-- Metadata -->
  <div class="field-group">
    <label class="field-label">
      Is metadata systematically recorded? <span class="req">*</span>
      <span class="field-hint">Metadata = who collected, when, where, with what instrument, in what format.</span>
    </label>
    <div class="choice-grid col-1">
      ${radios(pfx, "metadata", [
        "Yes - systematically (all six metadata dimensions)",
        "Partially - some fields recorded",
        "No metadata recorded",
        "Not aware of metadata requirements",
      ])}
    </div>
  </div>

  <!-- GPS -->
  <div class="field-group">
    <label class="field-label">Is GPS / geo-referencing done for field data?</label>
    <div class="choice-grid">
      ${radios(pfx, "gps", [
        "Yes - all field activities",
        "Sometimes",
        "No",
        "Not applicable",
      ])}
    </div>
  </div>

  <hr class="field-divider">

  <!-- Storage -->
  <div class="field-group">
    <label class="field-label">Where is data currently stored? <span class="req">*</span>
      <span class="field-hint">Select all that apply.</span>
    </label>
    <div class="choice-grid">
      ${checkboxes(pfx, "storage", [
        "Personal computer / laptop",
        "Institute server",
        "External hard drive / pen drive",
        "NIC cloud / ICAR Data Centre",
        "KRISHI Portal",
        "Google Drive / OneDrive / Dropbox",
        "AWS / Azure / other cloud",
        "No systematic storage",
      ])}
    </div>
    <input type="text" name="${pfx}_cloud_detail" style="margin-top:8px"
           placeholder="If cloud, name the specific service (e.g. NIC S3, Google Drive personal)">
  </div>

  <!-- Backup -->
  <div class="field-group">
    <label class="field-label">Backup frequency <span class="req">*</span></label>
    <div class="choice-grid col-1">
      ${radios(pfx, "backup", [
        "Automated daily backup",
        "Weekly manual backup",
        "Occasional / irregular",
        "No backup in place",
      ])}
    </div>
  </div>

  <!-- KRISHI -->
  <div class="field-group">
    <label class="field-label">Has data been uploaded to KRISHI Portal? <span class="req">*</span>
      <span class="field-hint">KRISHI is the official ICAR centralised data repository.</span>
    </label>
    <div class="choice-grid col-1">
      ${radios(pfx, "krishi", [
        "Yes - fully uploaded",
        "Partially uploaded",
        "No - planning to upload",
        "No - no plans currently",
        "Not aware of KRISHI Portal",
      ])}
    </div>
    <textarea name="${pfx}_krishi_reason" style="margin-top:8px"
              placeholder="If not uploaded, state the reason (e.g. data is proprietary, process not known, incomplete data)"></textarea>
  </div>

  <hr class="field-divider">

  <!-- Sharing -->
  <div class="field-group">
    <label class="field-label">Has data been shared with collaborators or other institutes? <span class="req">*</span></label>
    <div class="choice-grid col-1">
      ${radios(pfx, "sharing", [
        "Yes - through a formal Data Sharing Agreement (DSA)",
        "Yes - informally",
        "No sharing done yet",
        "Not applicable",
      ])}
    </div>
  </div>

  <!-- Open Access -->
  <div class="field-group">
    <label class="field-label">Open access or restricted?</label>
    <div class="choice-grid col-2">
      ${radios(pfx, "openaccess", [
        "Open access - deposited in public databases",
        "Restricted - institute / project use only",
        "Partially open - some datasets published",
        "Not decided yet",
      ])}
    </div>
    <input type="text" name="${pfx}_open_databases" style="margin-top:8px"
           placeholder="If open, name the database(s) — e.g. GenBank: MN123456, NCBI SRA: SRR9876543">
  </div>

  <hr class="field-divider">

  <!-- Policy Awareness -->
  <div class="field-group">
    <label class="field-label">Awareness of ICAR Data Policy 2025 <span class="req">*</span></label>
    <div class="choice-grid">
      ${radios(pfx, "policy_aware", [
        "Fully aware and following",
        "Partially aware",
        "Just heard of it",
        "Not aware",
      ])}
    </div>
  </div>

  <!-- DMP -->
  <div class="field-group">
    <label class="field-label">Does the project have a Data Management Plan (DMP)?
      <span class="field-hint">A DMP describes how data will be collected, stored, shared and preserved.</span>
    </label>
    <div class="choice-grid col-1">
      ${radios(pfx, "dmp", [
        "Yes - formal DMP prepared",
        "Informal plan exists",
        "No DMP",
        "Not aware of DMP requirement",
      ])}
    </div>
  </div>

  <!-- Compliance Scale -->
  <div class="field-group">
    <label class="field-label">Self-assessed compliance with ICAR Data Policy 2025
      <span class="field-hint">1 = Not compliant at all &nbsp; | &nbsp; 5 = Fully compliant</span>
    </label>
    <div class="scale-wrap">
      <input type="range" name="${pfx}_compliance" min="1" max="5" value="3"
             oninput="document.getElementById('sv-${pfx}').textContent=this.value">
      <span class="scale-display" id="sv-${pfx}">3</span>
    </div>
    <div class="scale-labels"><span>1 - Not compliant</span><span>3</span><span>5 - Fully compliant</span></div>
  </div>

  <!-- Challenges -->
  <div class="field-group">
    <label class="field-label">Key challenges in data management for this project</label>
    <textarea name="${pfx}_challenges"
              placeholder="e.g. No standardised format, data scattered across lab members, no access to institute server..."></textarea>
  </div>
  `;
}

// ── HTML HELPERS ──────────────────────────────────────────
function checkboxes(pfx, field, values) {
  return values
    .map(
      (v) => `
    <label class="choice-item">
      <input type="checkbox" name="${pfx}_${field}" value="${esc(v)}">
      ${v}
    </label>`,
    )
    .join("");
}

function radios(pfx, field, values) {
  return values
    .map(
      (v) => `
    <label class="choice-item">
      <input type="radio" name="${pfx}_${field}" value="${esc(v)}">
      ${v}
    </label>`,
    )
    .join("");
}

// ── CHOICE HIGHLIGHT ──────────────────────────────────────
function initChoiceHighlight() {
  initChoiceHighlightIn(document);
}

function initChoiceHighlightIn(root) {
  root.querySelectorAll(".choice-item input").forEach((inp) => {
    inp.addEventListener("change", () => updateChoiceState(inp));
  });
}

function updateChoiceState(inp) {
  if (inp.type === "radio") {
    document.querySelectorAll(`input[name="${inp.name}"]`).forEach((r) => {
      r.closest(".choice-item").classList.remove("selected");
    });
  }
  if (inp.checked) inp.closest(".choice-item").classList.add("selected");
  else inp.closest(".choice-item").classList.remove("selected");
}

// ── FORM VALIDATION & SUBMIT ──────────────────────────────
function handleSubmit(e) {
  e.preventDefault();
  let valid = true;

  // Validate respondent name
  const nameEl = document.getElementById("name-input");
  const otherEl = document.getElementById("other-name");
  const otherWrap = document.getElementById("other-name-wrap");
  const otherVis = getComputedStyle(otherWrap).display !== "none";
  const nameVal = otherVis ? otherEl.value.trim() : nameEl.value.trim();
  const fgName = document.getElementById("fg-name");
  if (!nameVal) {
    fgName.classList.add("has-error");
    valid = false;
  } else fgName.classList.remove("has-error");

  // Validate email
  const email = document.getElementById("email").value.trim();
  const fgEmail = document.getElementById("fg-email");
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    fgEmail.classList.add("has-error");
    valid = false;
  } else fgEmail.classList.remove("has-error");

  // Validate at least one project
  const fgProj = document.getElementById("fg-project");
  if (!state.selectedProjects.size && !state.includeOther) {
    fgProj.classList.add("has-error");
    valid = false;
  } else {
    fgProj.classList.remove("has-error");
  }

  if (!valid) {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  // Build payload
  const payload = buildPayload(nameVal, email);
  submitData(payload);
}

function buildPayload(nameVal, email) {
  const fd = new FormData(document.getElementById("main-form"));
  const base = {
    timestamp: new Date().toISOString(),
    respondent: nameVal,
    email: email,
    designation: fd.get("designation") || "",
    role: fd.get("role") || "",
    suggestions: fd.get("suggestions") || "",
    other_info: fd.get("other_info") || "",
  };

  // Per-project entries
  const projectEntries = [];

  state.selectedProjects.forEach((id) => {
    const p = ICAR_DATA.PROJECTS.find((x) => x.id === id);
    const pfx = id;
    projectEntries.push({
      project_id: id,
      project_title: p ? p.title : "",
      project_type: p ? p.type : "",
      funding: p ? p.funding : "",
      pi: p ? p.pi : "",
      copis: p ? p.copis.join("; ") : "",
      ...extractProjectFields(fd, pfx),
    });
  });

  if (state.includeOther) {
    projectEntries.push({
      project_id: "OTHER",
      project_title: fd.get("OTHER_proj_title") || "",
      project_type: "Other",
      funding: fd.get("OTHER_proj_funding") || "",
      pi: nameVal,
      copis: "",
      ...extractProjectFields(fd, "OTHER"),
    });
  }

  return { ...base, projects: projectEntries };
}

function extractProjectFields(fd, pfx) {
  return {
    data_types: fd.getAll(`${pfx}_data_type`).join("; ") || "",
    data_type_other: fd.get(`${pfx}_data_type_other`) || "",
    data_formats: fd.getAll(`${pfx}_data_format`).join("; ") || "",
    data_format_other: fd.get(`${pfx}_data_format_other`) || "",
    data_volume: fd.get(`${pfx}_data_volume`) || "",
    std_format: fd.get(`${pfx}_std_format`) || "",
    metadata: fd.get(`${pfx}_metadata`) || "",
    gps: fd.get(`${pfx}_gps`) || "",
    storage: fd.getAll(`${pfx}_storage`).join("; ") || "",
    cloud_detail: fd.get(`${pfx}_cloud_detail`) || "",
    backup: fd.get(`${pfx}_backup`) || "",
    krishi: fd.get(`${pfx}_krishi`) || "",
    krishi_reason: fd.get(`${pfx}_krishi_reason`) || "",
    sharing: fd.get(`${pfx}_sharing`) || "",
    openaccess: fd.get(`${pfx}_openaccess`) || "",
    open_databases: fd.get(`${pfx}_open_databases`) || "",
    policy_aware: fd.get(`${pfx}_policy_aware`) || "",
    dmp: fd.get(`${pfx}_dmp`) || "",
    compliance: fd.get(`${pfx}_compliance`) || "",
    challenges: fd.get(`${pfx}_challenges`) || "",
  };
}

// ── DRAFT SYSTEM ──────────────────────────────────────────
// Drafts are saved to localStorage under this key.
// Each browser/device has its own draft — this is intentional
// so different scientists filling on their own machines don't clash.
const DRAFT_KEY = 'icar_iiab_survey_draft';
let autoSaveTimer = null;

function initDraft() {
  let saved = null;
  try { saved = loadDraftFromStorage(); } catch(e) { saved = null; }
  if (saved) {
    setDraftStatus('saved', 'Draft found — restored from last session.');
    document.getElementById('btn-clear-draft').style.display = 'inline-block';
    restoreDraft(saved);
  } else {
    setDraftStatus('neutral', 'No draft saved yet.');
  }
  // Auto-save every 30 seconds
  autoSaveTimer = setInterval(autoSave, 30000);
  // Also save on any input change
  document.getElementById('main-form').addEventListener('input', () => {
    setDraftStatus('unsaved', 'Unsaved changes.');
    clearTimeout(autoSaveTimer);
    autoSaveTimer = setTimeout(autoSave, 5000); // save 5 sec after last keystroke
  });
  document.getElementById('main-form').addEventListener('change', () => {
    setDraftStatus('unsaved', 'Unsaved changes.');
  });
}

function autoSave() {
  saveDraft(true); // silent = true, no alert
}

function saveDraft(silent) {
  try {
    const snapshot = captureDraftSnapshot();
    localStorage.setItem(DRAFT_KEY, JSON.stringify(snapshot));
    const now = new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setDraftStatus('saved', 'Draft saved at ' + now);
    document.getElementById('btn-clear-draft').style.display = 'inline-block';
    if (!silent) {
      // Brief visual feedback
      const bar = document.getElementById('draft-status');
      bar.textContent = 'Draft saved successfully at ' + now;
    }
  } catch(err) {
    setDraftStatus('unsaved', 'Could not save draft (storage may be full).');
  }
}

function clearDraft() {
  if (!confirm('Clear the saved draft? This cannot be undone.')) return;
  localStorage.removeItem(DRAFT_KEY);
  setDraftStatus('neutral', 'Draft cleared.');
  document.getElementById('btn-clear-draft').style.display = 'none';
}

function clearDraftSilent() {
  localStorage.removeItem(DRAFT_KEY);
  document.getElementById('btn-clear-draft').style.display = 'none';
}

function setDraftStatus(type, msg) {
  const el = document.getElementById('draft-status');
  el.textContent = msg;
  el.className = type === 'saved' ? 'saved' : type === 'unsaved' ? 'unsaved' : '';
}

// Capture everything needed to restore the form
function captureDraftSnapshot() {
  const fd = new FormData(document.getElementById('main-form'));
  const snap = {
    version: 1,
    savedAt: new Date().toISOString(),
    // Respondent fields
    name:        document.getElementById('name-input').value,
    otherName:   document.getElementById('other-name').value,
    otherNameVis: getComputedStyle(document.getElementById('other-name-wrap')).display !== 'none',
    email:       document.getElementById('email').value,
    designation: fd.get('designation') || '',
    role:        fd.get('role')        || '',
    suggestions: fd.get('suggestions') || '',
    other_info:  fd.get('other_info')  || '',
    // Project selection state
    selectedProjects: [...state.selectedProjects],
    includeOther:     state.includeOther,
    otherProjTitle:   fd.get('OTHER_proj_title')   || '',
    otherProjFunding: fd.get('OTHER_proj_funding')  || '',
    // Per-project field values keyed by project id
    projectData: {}
  };

  // Capture all inputs inside each project form block
  document.querySelectorAll('.proj-form-block').forEach(block => {
    const pid = block.dataset.projId;
    const pData = {};
    block.querySelectorAll('input, textarea, select').forEach(el => {
      if (!el.name) return;
      if (el.type === 'checkbox' || el.type === 'radio') {
        if (el.checked) {
          if (!pData[el.name]) pData[el.name] = [];
          pData[el.name].push(el.value);
        }
      } else {
        pData[el.name] = el.value;
      }
    });
    snap.projectData[pid] = pData;
  });

  return snap;
}

function loadDraftFromStorage() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch(e) {
    return null;
  }
}

function restoreDraft(snap) {
  try {
  // Respondent fields
  if (snap.name) document.getElementById('name-input').value = snap.name;
  if (snap.otherName) document.getElementById('other-name').value = snap.otherName;
  if (snap.otherNameVis) {
    document.getElementById('other-name-wrap').style.display = 'block';
  }
  if (snap.email)       document.getElementById('email').value       = snap.email;
  if (snap.designation) document.getElementById('designation').value = snap.designation;
  if (snap.role)        document.getElementById('role').value        = snap.role;
  if (snap.suggestions) document.getElementById('suggestions').value = snap.suggestions;
  if (snap.other_info)  document.getElementById('other-info').value  = snap.other_info;

  // Restore project selection
  if (snap.selectedProjects && snap.selectedProjects.length) {
    snap.selectedProjects.forEach(id => {
      state.selectedProjects.add(id);
    });
    // Rebuild list with restored selection
    buildProjectList('ALL', '');
    rebuildProjectForms();
    updateSelectedSummary();
  }

  if (snap.includeOther) {
    state.includeOther = true;
    const cb = document.getElementById('other-proj-cb');
    if (cb) cb.checked = true;
    document.getElementById('proj-other-fields').style.display = 'block';
    rebuildProjectForms();
    updateSelectedSummary();
  }

  // Restore per-project field values (after blocks are built)
  // Use a small timeout to allow DOM to settle after rebuildProjectForms
  setTimeout(() => {
    if (!snap.projectData) return;
    Object.entries(snap.projectData).forEach(([pid, pData]) => {
      const block = document.querySelector(`[data-proj-id="${pid}"]`);
      if (!block) return;
      Object.entries(pData).forEach(([name, val]) => {
        if (Array.isArray(val)) {
          // Checkboxes and radios
          val.forEach(v => {
            const el = block.querySelector(`input[name="${name}"][value="${CSS.escape(v)}"]`);
            if (el) {
              el.checked = true;
              el.closest('.choice-item') && el.closest('.choice-item').classList.add('selected');
            }
          });
        } else {
          const el = block.querySelector(`[name="${name}"]`);
          if (el) {
            el.value = val;
            // Update range display
            if (el.type === 'range') {
              const displayId = 'sv-' + pid;
              const display = document.getElementById(displayId);
              if (display) display.textContent = val;
            }
          }
        }
      });
    });

    // Restore other project fields
    if (snap.otherProjTitle) {
      const el = document.querySelector('[name="OTHER_proj_title"]');
      if (el) el.value = snap.otherProjTitle;
    }
    if (snap.otherProjFunding) {
      const el = document.querySelector('[name="OTHER_proj_funding"]');
      if (el) el.value = snap.otherProjFunding;
    }
  }, 100);
  } catch(err) {
    // Draft restore failed (corrupted data) — clear it and start fresh
    console.warn('Draft restore failed, clearing:', err);
    localStorage.removeItem(DRAFT_KEY);
    setDraftStatus('neutral', 'Previous draft was corrupted and has been cleared.');
  }
}

// ── SUBMISSION RECEIPT ────────────────────────────────────
function buildReceipt(payload) {
  const submittedAt = new Date().toLocaleString('en-IN', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });

  let html = '';

  // Reference number (timestamp-based, unique enough for tracking)
  const ref = 'IIAB-' + Date.now().toString(36).toUpperCase();

  // Summary header rows
  html += `
  <div class="receipt-section">
    <div class="receipt-section-title">Submission Details</div>
    <div class="receipt-row"><span class="receipt-label">Reference No.</span><span class="receipt-value">${ref}</span></div>
    <div class="receipt-row"><span class="receipt-label">Submitted On</span><span class="receipt-value">${submittedAt}</span></div>
    <div class="receipt-row"><span class="receipt-label">Survey</span><span class="receipt-value">Research Data Management Survey 2025-26</span></div>
    <div class="receipt-row"><span class="receipt-label">Nodal Officer</span><span class="receipt-value">Dr. Sandip Garai, MELIA, ICAR-IIAB Ranchi</span></div>
  </div>

  <div class="receipt-section">
    <div class="receipt-section-title">Respondent</div>
    <div class="receipt-row"><span class="receipt-label">Name</span><span class="receipt-value">${payload.respondent}</span></div>
    <div class="receipt-row"><span class="receipt-label">Email</span><span class="receipt-value">${payload.email}</span></div>
    <div class="receipt-row"><span class="receipt-label">Designation</span><span class="receipt-value">${payload.designation || '—'}</span></div>
    <div class="receipt-row"><span class="receipt-label">Role</span><span class="receipt-value">${payload.role || '—'}</span></div>
  </div>`;

  // Per-project summary
  if (payload.projects && payload.projects.length) {
    html += `<div class="receipt-section"><div class="receipt-section-title">Projects Covered (${payload.projects.length})</div>`;
    payload.projects.forEach(p => {
      html += `
      <div class="receipt-project-block">
        <div class="receipt-project-head">
          <span class="proj-id-tag">${p.project_id}</span>
          ${p.project_title || 'Other Project'}
        </div>
        <div class="receipt-project-body">
          <div class="receipt-row"><span class="receipt-label">PI</span><span class="receipt-value">${p.pi || '—'}</span></div>
          <div class="receipt-row"><span class="receipt-label">Funding</span><span class="receipt-value">${p.funding || '—'}</span></div>
          <div class="receipt-row"><span class="receipt-label">Data Types</span><span class="receipt-value">${p.data_types || '—'}</span></div>
          <div class="receipt-row"><span class="receipt-label">Data Formats</span><span class="receipt-value">${p.data_formats || '—'}</span></div>
          <div class="receipt-row"><span class="receipt-label">Data Volume/Year</span><span class="receipt-value">${p.data_volume || '—'}</span></div>
          <div class="receipt-row"><span class="receipt-label">Metadata Collected</span><span class="receipt-value">${p.metadata || '—'}</span></div>
          <div class="receipt-row"><span class="receipt-label">Storage</span><span class="receipt-value">${p.storage || '—'}</span></div>
          <div class="receipt-row"><span class="receipt-label">Backup</span><span class="receipt-value">${p.backup || '—'}</span></div>
          <div class="receipt-row"><span class="receipt-label">KRISHI Status</span><span class="receipt-value">${p.krishi || '—'}</span></div>
          <div class="receipt-row"><span class="receipt-label">Data Sharing</span><span class="receipt-value">${p.sharing || '—'}</span></div>
          <div class="receipt-row"><span class="receipt-label">Policy Awareness</span><span class="receipt-value">${p.policy_aware || '—'}</span></div>
          <div class="receipt-row"><span class="receipt-label">Data Management Plan</span><span class="receipt-value">${p.dmp || '—'}</span></div>
          <div class="receipt-row"><span class="receipt-label">Compliance Score</span><span class="receipt-value">${p.compliance ? p.compliance + ' / 5' : '—'}</span></div>
          ${p.challenges ? `<div class="receipt-row"><span class="receipt-label">Challenges</span><span class="receipt-value">${p.challenges}</span></div>` : ''}
        </div>
      </div>`;
    });
    html += '</div>';
  }

  if (payload.suggestions) {
    html += `
    <div class="receipt-section">
      <div class="receipt-section-title">General Suggestions</div>
      <div class="receipt-row"><span class="receipt-value">${payload.suggestions}</span></div>
    </div>`;
  }

  html += `
  <div class="receipt-section" style="margin-top:16px;padding-top:12px;border-top:1px dashed var(--border)">
    <p style="font-size:0.78rem;color:var(--muted);line-height:1.6">
      This is a record of your submission to the ICAR-IIAB Research Data Management Survey 2025-26.
      Please save or print this page for your reference.
      Reference number: <strong>${ref}</strong>
    </p>
  </div>`;

  return html;
}

// ── SUBMIT TO APPS SCRIPT ─────────────────────────────────
function submitData(payload) {
  const btn = document.querySelector(".btn-submit");
  btn.textContent = "Submitting...";
  btn.disabled = true;

  const SCRIPT_URL =
    "https://script.google.com/macros/s/AKfycbwvlzGwM011MZrk2IxYoqC7d_cZ-uoSbsYpc8QA-ZMO9K_N2h6kz88Yo__bObJm0G_Y/exec";

  if (SCRIPT_URL === "YOUR_APPS_SCRIPT_WEBAPP_URL_HERE") {
    console.log("Payload (demo):", JSON.stringify(payload, null, 2));
    showSuccess(payload);
    return;
  }

  fetch(SCRIPT_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    mode: "no-cors",
  })
    .then(() => showSuccess(payload))
    .catch(() => showSuccess(payload));
}

function showSuccess(payload) {
  // Clear the draft — submission is complete
  clearDraftSilent();

  // Hide form
  document.getElementById('main-form').style.display = 'none';
  document.getElementById('draft-bar').style.display  = 'none';

  // Build and show receipt
  document.getElementById('receipt-body').innerHTML = buildReceipt(payload);
  document.getElementById('receipt-screen').style.display = 'block';

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── UTILITIES ─────────────────────────────────────────────
function esc(s) {
  return s.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function escRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
