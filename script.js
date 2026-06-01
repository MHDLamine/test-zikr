const STORAGE_KEY = "tasbih-online-state-v1";

const defaults = {
  currentDhikrId: "subhan",
  count: 33,
  target: 100,
  dailyGoal: 1000,
  favorites: ["subhan"],
  soundEnabled: true,
  vibrationEnabled: true,
  theme: "light",
  language: "fr",
  dhikrs: [
    { id: "subhan", arabic: "سبحان الله", latin: "Subhan Allah", icon: "leaf" },
    { id: "hamd", arabic: "الحمد لله", latin: "Alhamdulillah", icon: "sprout" },
    { id: "akbar", arabic: "الله أكبر", latin: "Allahu Akbar", icon: "mosque" },
    {
      id: "tahlil",
      arabic: "لا إله إلا الله",
      latin: "La ilaha illa Allah",
      icon: "star",
    },
    {
      id: "istighfar",
      arabic: "أستغفر الله",
      latin: "Astaghfirullah",
      icon: "pen",
    },
  ],
  history: [],
  days: {},
};

let state = loadState();
let audioContext;

const $ = (selector) => document.querySelector(selector);
const todayKey = () => new Date().toISOString().slice(0, 10);
const localeByLanguage = {
  fr: "fr-FR",
  en: "en-US",
  ar: "ar",
};

const translations = {
  fr: {
    languageLabel: "Langue",
    themeLabel: "Changer le theme",
    favoriteLabel: "Ajouter aux favoris",
    countLabel: "Ajouter un dhikr",
    quickTitle: "Dhikr rapides",
    customDhikr: "+ Personnaliser",
    goalTitle: "Objectif quotidien",
    goalSubtitle: "dhikr aujourd'hui",
    editGoal: "Modifier l'objectif",
    reset: "Reinitialiser",
    soundOn: "Son",
    soundOff: "Son off",
    vibrationOn: "Vibration",
    vibrationOff: "Vibration off",
    soundLabel: "Activer ou desactiver le son",
    vibrationLabel: "Activer ou desactiver la vibration",
    feedbackLabel: "Preferences de retour",
    historyTitle: "Historique recent",
    clear: "Effacer",
    showAll: "Voir tout",
    modalTitle: "Ajouter un dhikr",
    arabicLabel: "Texte arabe",
    latinLabel: "Transliteration",
    cancel: "Annuler",
    add: "Ajouter",
    emptyHistory: "Aucun dhikr enregistre pour le moment.",
    dhikrUnit: "dhikr",
    today: "Aujourd'hui",
    yesterday: "Hier",
    targetPrompt: "Nouvelle cible",
    goalPrompt: "Objectif quotidien",
    clearConfirm: "Effacer l'historique recent ?",
    arabicPlaceholder: "الحمد لله",
    latinPlaceholder: "Alhamdulillah",
    resetConfirm: "Réinitialiser le compteur ?",
    targetReached: "Objectif atteint !",
    continueBtn: "Continuer",
    editDhikrTitle: "Modifier le dhikr",
    deleteConfirm: "Supprimer ce dhikr ?",
  },
  en: {
    languageLabel: "Language",
    themeLabel: "Change theme",
    favoriteLabel: "Add to favorites",
    countLabel: "Add dhikr",
    quickTitle: "Quick dhikr",
    customDhikr: "+ Customize",
    goalTitle: "Daily goal",
    goalSubtitle: "dhikr today",
    editGoal: "Edit goal",
    reset: "Reset",
    soundOn: "Sound",
    soundOff: "Sound off",
    vibrationOn: "Vibration",
    vibrationOff: "Vibration off",
    soundLabel: "Turn sound on or off",
    vibrationLabel: "Turn vibration on or off",
    feedbackLabel: "Feedback preferences",
    historyTitle: "Recent history",
    clear: "Clear",
    showAll: "See all",
    modalTitle: "Add a dhikr",
    arabicLabel: "Arabic text",
    latinLabel: "Transliteration",
    cancel: "Cancel",
    add: "Add",
    emptyHistory: "No dhikr saved yet.",
    dhikrUnit: "dhikr",
    today: "Today",
    yesterday: "Yesterday",
    targetPrompt: "New target",
    goalPrompt: "Daily goal",
    clearConfirm: "Clear recent history?",
    arabicPlaceholder: "الحمد لله",
    latinPlaceholder: "Alhamdulillah",
    resetConfirm: "Reset the counter?",
    targetReached: "Target reached!",
    continueBtn: "Continue",
    editDhikrTitle: "Edit dhikr",
    deleteConfirm: "Delete this dhikr?",
  },
  ar: {
    languageLabel: "اللغة",
    themeLabel: "تغيير النمط",
    favoriteLabel: "إضافة إلى المفضلة",
    countLabel: "إضافة ذكر",
    quickTitle: "أذكار سريعة",
    customDhikr: "+ تخصيص",
    goalTitle: "الهدف اليومي",
    goalSubtitle: "ذكر اليوم",
    editGoal: "تعديل الهدف",
    reset: "إعادة الضبط",
    soundOn: "الصوت",
    soundOff: "الصوت مغلق",
    vibrationOn: "الاهتزاز",
    vibrationOff: "الاهتزاز مغلق",
    soundLabel: "تشغيل أو إيقاف الصوت",
    vibrationLabel: "تشغيل أو إيقاف الاهتزاز",
    feedbackLabel: "إعدادات التنبيه",
    historyTitle: "السجل الأخير",
    clear: "مسح",
    showAll: "عرض الكل",
    modalTitle: "إضافة ذكر",
    arabicLabel: "النص العربي",
    latinLabel: "النطق بالحروف اللاتينية",
    cancel: "إلغاء",
    add: "إضافة",
    emptyHistory: "لا يوجد ذكر محفوظ حتى الآن.",
    dhikrUnit: "ذكر",
    today: "اليوم",
    yesterday: "أمس",
    targetPrompt: "الهدف الجديد",
    goalPrompt: "الهدف اليومي",
    clearConfirm: "هل تريد مسح السجل الأخير؟",
    arabicPlaceholder: "الحمد لله",
    latinPlaceholder: "Alhamdulillah",
    resetConfirm: "إعادة تعيين العداد؟",
    targetReached: "تم تحقيق الهدف!",
    continueBtn: "متابعة",
    editDhikrTitle: "تعديل الذكر",
    deleteConfirm: "حذف هذا الذكر؟",
  },
};

function t(key) {
  return translations[state.language]?.[key] || translations.fr[key] || key;
}

function formatNumber(value) {
  return new Intl.NumberFormat(
    localeByLanguage[state.language] || "fr-FR",
  ).format(value || 0);
}

const icons = {
  leaf: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4c-8 0-14 4.5-14 10.5 0 3.2 2.6 5.5 5.8 5.5C17.8 20 22 12 20 4Z"/><path d="M4 21c3-6 8-9 14-11"/></svg>',
  sprout:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21V10"/><path d="M12 10C9 5 5 4 3 4c0 5 3 8 9 8"/><path d="M12 10c3-5 7-6 9-6 0 5-3 8-9 8"/></svg>',
  mosque:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h16v10H4z"/><path d="M8 10V8a4 4 0 0 1 8 0v2"/><path d="M12 4V2"/><path d="M7 20v-5h10v5"/></svg>',
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.6 5.4 5.9.8-4.3 4.2 1 5.8L12 16.5 6.8 19.2l1-5.8-4.3-4.2 5.9-.8L12 3Z"/></svg>',
  pen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m16 4 4 4L8 20H4v-4L16 4Z"/><path d="m13 7 4 4"/></svg>',
  chevron:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return structuredClone(defaults);
    return {
      ...structuredClone(defaults),
      ...saved,
      dhikrs: saved.dhikrs?.length
        ? saved.dhikrs
        : structuredClone(defaults.dhikrs),
      history: Array.isArray(saved.history) ? saved.history : [],
      days: saved.days || {},
    };
  } catch {
    return structuredClone(defaults);
  }
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getCurrentDhikr() {
  return (
    state.dhikrs.find((item) => item.id === state.currentDhikrId) ||
    state.dhikrs[0]
  );
}

function todayTotal() {
  return state.days[todayKey()] || 0;
}

function setText(selector, value) {
  const element = $(selector);
  if (element) element.textContent = value;
}

function setAttribute(selector, name, value) {
  const element = $(selector);
  if (element) element.setAttribute(name, value);
}

function isSameDay(firstDate, secondDate) {
  return firstDate.toDateString() === secondDate.toDateString();
}

function formatHistoryDay(date) {
  const now = new Date();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);

  if (isSameDay(date, now)) return t("today");
  if (isSameDay(date, yesterday)) return t("yesterday");
  return date.toLocaleDateString(localeByLanguage[state.language] || "fr-FR", {
    day: "2-digit",
    month: "short",
  });
}

function renderTranslations() {
  document.documentElement.lang = state.language;
  document.documentElement.dir = state.language === "ar" ? "rtl" : "ltr";

  setAttribute("#languageSwitch", "aria-label", t("languageLabel"));
  setAttribute("#themeToggle", "aria-label", t("themeLabel"));
  setAttribute("#favoriteBtn", "aria-label", t("favoriteLabel"));
  setAttribute("#countButton", "aria-label", t("countLabel"));
  setAttribute("#goalEditMobileBtn", "aria-label", t("editGoal"));
  setAttribute(".feedback-controls", "aria-label", t("feedbackLabel"));
  setAttribute("#soundToggle", "aria-label", t("soundLabel"));
  setAttribute("#vibrationToggle", "aria-label", t("vibrationLabel"));

  setText("#quickTitle", t("quickTitle"));
  setText("#mobileQuickTitle", t("quickTitle"));
  setText("#customDhikrBtn", t("customDhikr"));
  setText("#goalTitle", t("goalTitle"));
  setText("#mobileGoalTitle", t("goalTitle"));
  setText("#goalSubtitle", t("goalSubtitle"));
  setText("#mobileGoalSubtitle", t("goalSubtitle"));
  setText("#goalEditBtn", t("editGoal"));
  setText("#resetText", t("reset"));
  setText("#historyTitle", t("historyTitle"));
  setText("#clearHistoryBtn", t("clear"));
  setText("#showQuickBtn", t("showAll"));
  setText("#modalTitle", t("modalTitle"));
  setText("#arabicLabel", t("arabicLabel"));
  setText("#latinLabel", t("latinLabel"));
  setText("[data-close-modal]", t("cancel"));
  setText(".primary-small", t("add"));
  setAttribute("#newArabic", "placeholder", t("arabicPlaceholder"));
  setAttribute("#newLatin", "placeholder", t("latinPlaceholder"));
}

function renderQuickLists() {
  const desktop = $("#quickList");
  const mobile = $("#quickScroll");

  desktop.innerHTML = state.dhikrs
    .map((dhikr) => {
      const isActive = dhikr.id === state.currentDhikrId;
      const isCustom = dhikr.id.startsWith("custom-");
      return `
    <div class="quick-item${isActive ? " active" : ""}">
      <button class="quick-select" type="button" data-dhikr-id="${dhikr.id}">
        <span>
          <strong>${dhikr.arabic}</strong>
          <span>${dhikr.latin}</span>
        </span>
      </button>
      ${
        isCustom
          ? `
      <div class="quick-actions">
        <button class="quick-action-btn" type="button" data-action="edit" data-dhikr-id="${dhikr.id}" aria-label="Modifier">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m16 4 4 4L8 20H4v-4L16 4Z"/><path d="m13 7 4 4"/></svg>
        </button>
        <button class="quick-action-btn" type="button" data-action="delete" data-dhikr-id="${dhikr.id}" aria-label="Supprimer">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
        </button>
      </div>`
          : icons.chevron
      }
    </div>`;
    })
    .join("");

  mobile.innerHTML = state.dhikrs
    .slice(0, 6)
    .map((dhikr) => {
      const isActive = dhikr.id === state.currentDhikrId;
      return `
    <button class="quick-item${isActive ? " active" : ""}" type="button" data-dhikr-id="${dhikr.id}">
      ${icons[dhikr.icon] || icons.leaf}
      <strong>${dhikr.arabic}</strong>
    </button>`;
    })
    .join("");
}

function renderCounter() {
  const dhikr = getCurrentDhikr();
  const progress = Math.min(state.count / state.target, 1) * 360;
  $(".counter-ring").style.setProperty("--progress", `${progress}deg`);
  $("#arabicName").textContent = dhikr.arabic;
  $("#latinName").textContent = dhikr.latin;
  $("#counterValue").textContent = formatNumber(state.count);
  $("#targetValue").textContent = formatNumber(state.target);
  $("#favoriteBtn").classList.toggle(
    "active",
    state.favorites.includes(dhikr.id),
  );
}

function renderGoal() {
  const total = todayTotal();
  const percent = Math.min((total / state.dailyGoal) * 100, 100);
  $("#todayTotalSmall").textContent = formatNumber(total);
  $("#todayTotalMobile").textContent = formatNumber(total);
  $("#dailyGoalSmall").textContent = formatNumber(state.dailyGoal);
  $("#dailyGoalMobile").textContent = formatNumber(state.dailyGoal);
  $("#goalBarSmall").style.width = `${percent}%`;
  $("#goalBarMobile").style.width = `${percent}%`;
}

function renderHistory() {
  const historyList = $("#historyList");
  if (!state.history.length) {
    historyList.innerHTML = `<div class="empty-state">${t("emptyHistory")}</div>`;
    return;
  }

  historyList.innerHTML = state.history
    .slice(0, 8)
    .map((entry) => {
      const date = new Date(entry.timestamp);
      const dayLabel = formatHistoryDay(date);
      return `
      <article class="history-row">
        <span class="history-icon">${icons[entry.icon] || icons.leaf}</span>
        <span class="history-name"><strong>${entry.arabic}</strong><span>${entry.latin}</span></span>
        <span class="history-count"><strong>${formatNumber(entry.count)}</strong><span>${t("dhikrUnit")}</span></span>
        <span class="history-time"><strong>${dayLabel}</strong><span>${date.toLocaleTimeString(localeByLanguage[state.language] || "fr-FR", { hour: "2-digit", minute: "2-digit" })}</span></span>
        ${icons.chevron}
      </article>
    `;
    })
    .join("");
}

function renderTheme() {
  document.body.classList.toggle("dark", state.theme === "dark");
  document.querySelectorAll("[data-language]").forEach((button) => {
    const isActive = button.dataset.language === state.language;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-pressed", String(isActive));
  });
}

function renderFeedbackControls() {
  const soundToggle = $("#soundToggle");
  const vibrationToggle = $("#vibrationToggle");
  soundToggle.setAttribute("aria-pressed", String(state.soundEnabled));
  vibrationToggle.setAttribute("aria-pressed", String(state.vibrationEnabled));
  soundToggle.querySelector("span").textContent = state.soundEnabled
    ? t("soundOn")
    : t("soundOff");
  vibrationToggle.querySelector("span").textContent = state.vibrationEnabled
    ? t("vibrationOn")
    : t("vibrationOff");
}

function render() {
  renderTranslations();
  renderQuickLists();
  renderCounter();
  renderGoal();
  renderHistory();
  renderTheme();
  renderFeedbackControls();
}

function playTickSound() {
  if (!state.soundEnabled) return;
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) return;
  audioContext ||= new AudioContextClass();
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const now = audioContext.currentTime;

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(640, now);
  oscillator.frequency.exponentialRampToValueAtTime(420, now + 0.06);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.12, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.1);
}

function vibrateTick() {
  if (state.vibrationEnabled && "vibrate" in navigator) {
    navigator.vibrate(24);
  }
}

function giveFeedback() {
  playTickSound();
  vibrateTick();
}

function addCount() {
  state.count += 1;
  const key = todayKey();
  state.days[key] = (state.days[key] || 0) + 1;
  saveState();
  giveFeedback();
  renderCounter();
  renderGoal();
  if (state.count === state.target) showTargetReached();
}

async function showAllDhikrsModal() {
  getSwal().fire({
    title: t("quickTitle"),
    html: state.dhikrs
      .map((d) => {
        const isActive = d.id === state.currentDhikrId;
        return `<button class="swal-dhikr-btn${isActive ? " swal-dhikr-active" : ""}" type="button" data-dhikr-id="${d.id}">
        <strong>${d.arabic}</strong>
        <span>${d.latin}</span>
      </button>`;
      })
      .join(""),
    showConfirmButton: false,
    showCloseButton: true,
    didOpen: () => {
      document.querySelectorAll(".swal-dhikr-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          selectDhikr(btn.dataset.dhikrId);
          Swal.close();
        });
      });
    },
  });
}

async function showTargetReached() {
  const dhikr = getCurrentDhikr();
  const { isConfirmed } = await getSwal().fire({
    title: t("targetReached"),
    html: `<p style="font-family:Amiri,serif;font-size:1.6rem;margin:0 0 6px;color:#246852">${dhikr.arabic}</p><p style="margin:0;color:var(--muted)">${formatNumber(state.target)} ${t("dhikrUnit")} accomplis</p>`,
    icon: "success",
    confirmButtonText: t("reset"),
    showCancelButton: true,
    cancelButtonText: t("continueBtn"),
    reverseButtons: true,
  });
  if (isConfirmed) resetCounter();
}

async function deleteDhikr(id) {
  const dhikr = state.dhikrs.find((d) => d.id === id);
  if (!dhikr) return;
  const { isConfirmed } = await getSwal().fire({
    title: t("deleteConfirm"),
    html: `<span style="font-family:Amiri,serif;font-size:1.2rem">${dhikr.arabic}</span>`,
    icon: "warning",
    showCancelButton: true,
    cancelButtonText: t("cancel"),
    confirmButtonText: t("clear"),
    confirmButtonColor: "#c0392b",
  });
  if (!isConfirmed) return;
  if (state.currentDhikrId === id) {
    state.currentDhikrId =
      state.dhikrs.find((d) => d.id !== id)?.id || state.dhikrs[0].id;
    state.count = 0;
  }
  state.dhikrs = state.dhikrs.filter((d) => d.id !== id);
  state.favorites = state.favorites.filter((f) => f !== id);
  saveState();
  render();
}

async function editDhikr(id) {
  const dhikr = state.dhikrs.find((d) => d.id === id);
  if (!dhikr) return;
  const { value } = await getSwal().fire({
    title: t("editDhikrTitle"),
    html: `
      <label style="display:block;text-align:start;font-size:.85rem;font-weight:600;margin-bottom:4px">${t("arabicLabel")}</label>
      <input id="swal-arabic" class="swal2-input swal-tasbih-input" dir="rtl" placeholder="${t("arabicPlaceholder")}" value="${dhikr.arabic}">
      <label style="display:block;text-align:start;font-size:.85rem;font-weight:600;margin:10px 0 4px">${t("latinLabel")}</label>
      <input id="swal-latin" class="swal2-input swal-tasbih-input" placeholder="${t("latinPlaceholder")}" value="${dhikr.latin}">
    `,
    showCancelButton: true,
    cancelButtonText: t("cancel"),
    confirmButtonText: t("add"),
    preConfirm: () => {
      const arabic = document.getElementById("swal-arabic").value.trim();
      const latin = document.getElementById("swal-latin").value.trim();
      if (!arabic || !latin) {
        Swal.showValidationMessage("Tous les champs sont requis");
        return false;
      }
      return { arabic, latin };
    },
  });
  if (!value) return;
  state.dhikrs = state.dhikrs.map((d) =>
    d.id === id ? { ...d, arabic: value.arabic, latin: value.latin } : d,
  );
  saveState();
  render();
}

function resetCounter() {
  const dhikr = getCurrentDhikr();
  if (state.count > 0) {
    state.history.unshift({
      ...dhikr,
      count: state.count,
      timestamp: new Date().toISOString(),
    });
    state.history = state.history.slice(0, 50);
  }
  state.count = 0;
  saveState();
  render();
}

function selectDhikr(id) {
  if (state.currentDhikrId === id) return;
  if (state.count > 0) resetCounter();
  state.currentDhikrId = id;
  state.count = 0;
  saveState();
  render();
}

function getSwal() {
  const dark = state.theme === "dark";
  return Swal.mixin({
    background: dark ? "#14352e" : "#fffdfa",
    color: dark ? "#f6f0e7" : "#173c34",
    confirmButtonColor: "#246852",
    cancelButtonColor: dark ? "rgba(255,255,255,0.08)" : "rgba(23,79,64,0.1)",
    customClass: {
      popup: "swal-tasbih",
      title: "swal-tasbih-title",
      input: "swal-tasbih-input",
      confirmButton: "swal-tasbih-confirm",
      cancelButton: "swal-tasbih-cancel",
    },
  });
}

async function setTarget() {
  const { value } = await getSwal().fire({
    title: t("targetPrompt"),
    input: "number",
    inputValue: state.target,
    inputAttributes: { min: 1, step: 1 },
    showCancelButton: true,
    cancelButtonText: t("cancel"),
    confirmButtonText: "OK",
  });
  const next = Number(value);
  if (!Number.isFinite(next) || next <= 0) return;
  state.target = Math.round(next);
  saveState();
  renderCounter();
}

async function setDailyGoal() {
  const { value } = await getSwal().fire({
    title: t("goalPrompt"),
    input: "number",
    inputValue: state.dailyGoal,
    inputAttributes: { min: 1, step: 1 },
    showCancelButton: true,
    cancelButtonText: t("cancel"),
    confirmButtonText: "OK",
  });
  const next = Number(value);
  if (!Number.isFinite(next) || next <= 0) return;
  state.dailyGoal = Math.round(next);
  saveState();
  renderGoal();
}

function addCustomDhikr(event) {
  event.preventDefault();
  const arabic = $("#newArabic").value.trim();
  const latin = $("#newLatin").value.trim();
  if (!arabic || !latin) return;

  const id = `custom-${Date.now()}`;
  state.dhikrs.push({ id, arabic, latin, icon: "leaf" });
  state.currentDhikrId = id;
  state.count = 0;
  saveState();
  $("#dhikrForm").reset();
  $("#dhikrModal").close();
  render();
}

function bindEvents() {
  $("#countButton").addEventListener("click", addCount);
  $("#resetButton").addEventListener("click", async () => {
    if (state.count === 0) return;
    const { isConfirmed } = await getSwal().fire({
      title: t("resetConfirm"),
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: t("cancel"),
      confirmButtonText: t("reset"),
      confirmButtonColor: "#c0392b",
    });
    if (isConfirmed) resetCounter();
  });
  $("#targetButton").addEventListener("click", setTarget);
  $("#goalEditBtn").addEventListener("click", setDailyGoal);
  $("#goalEditMobileBtn").addEventListener("click", setDailyGoal);
  $("#showQuickBtn").addEventListener("click", showAllDhikrsModal);
  $("#soundToggle").addEventListener("click", () => {
    state.soundEnabled = !state.soundEnabled;
    saveState();
    renderFeedbackControls();
  });
  $("#vibrationToggle").addEventListener("click", () => {
    state.vibrationEnabled = !state.vibrationEnabled;
    saveState();
    renderFeedbackControls();
    if (state.vibrationEnabled) vibrateTick();
  });

  $("#favoriteBtn").addEventListener("click", () => {
    const id = getCurrentDhikr().id;
    state.favorites = state.favorites.includes(id)
      ? state.favorites.filter((item) => item !== id)
      : [...state.favorites, id];
    saveState();
    renderCounter();
  });

  $("#themeToggle").addEventListener("click", () => {
    state.theme = state.theme === "dark" ? "light" : "dark";
    saveState();
    renderTheme();
  });

  document.querySelectorAll("[data-language]").forEach((button) => {
    button.addEventListener("click", () => {
      state.language = button.dataset.language;
      saveState();
      render();
    });
  });

  $("#languageSwitch").addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight"].includes(event.key)) return;
    const languages = ["fr", "en", "ar"];
    const step = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex =
      (languages.indexOf(state.language) + step + languages.length) %
      languages.length;
    state.language = languages[nextIndex];
    saveState();
    render();
  });

  $("#customDhikrBtn").addEventListener("click", () =>
    $("#dhikrModal").showModal(),
  );
  $("#dhikrForm").addEventListener("submit", addCustomDhikr);
  document
    .querySelector("[data-close-modal]")
    .addEventListener("click", () => $("#dhikrModal").close());

  $("#clearHistoryBtn").addEventListener("click", async () => {
    if (!state.history.length) return;
    const { isConfirmed } = await getSwal().fire({
      title: t("clearConfirm"),
      icon: "warning",
      showCancelButton: true,
      cancelButtonText: t("cancel"),
      confirmButtonText: t("clear"),
      confirmButtonColor: "#c0392b",
    });
    if (!isConfirmed) return;
    state.history = [];
    saveState();
    renderHistory();
  });

  document.addEventListener("click", (event) => {
    const actionBtn = event.target.closest("[data-action]");
    if (actionBtn) {
      const { action, dhikrId } = actionBtn.dataset;
      if (action === "delete") deleteDhikr(dhikrId);
      else if (action === "edit") editDhikr(dhikrId);
      return;
    }
    const quick = event.target.closest("[data-dhikr-id]");
    if (quick) selectDhikr(quick.dataset.dhikrId);
  });

  window.addEventListener("keydown", (event) => {
    if (
      event.code === "Space" &&
      !["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)
    ) {
      event.preventDefault();
      addCount();
    }
  });
}

bindEvents();
render();
