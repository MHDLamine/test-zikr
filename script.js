const STORAGE_KEY = "tasbih-online-state-v1";

const defaults = {
  currentDhikrId: "subhan",
  count: 0,
  target: 100,
  dailyGoal: 1000,
  favorites: ["subhan"],
  soundEnabled: true,
  vibrationEnabled: true,
  theme: "light",
  language: "fr",
  dhikrs: [
    { id: "neutral", arabic: "", latin: "", icon: "circle" },
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
    {
      id: "hawqala",
      arabic: "لا حول ولا قوة إلا بالله",
      latin: "La hawla wa la quwwata illa billah",
      icon: "shield",
    },
    {
      id: "salawat",
      arabic: "اللهم صل وسلم على نبينا محمد",
      latin: "Allahumma salli wa sallim 'ala nabiyyina Muhammad",
      icon: "heart",
    },
    {
      id: "hasbiya",
      arabic: "حسبي الله ونعم الوكيل",
      latin: "Hasbiya Allah wa ni'ma al-wakil",
      icon: "shield-check",
    },
    {
      id: "subhan_bihamdihi",
      arabic: "سبحان الله وبحمده",
      latin: "Subhan Allahi wa bihamdihi",
      icon: "flower",
    },
    {
      id: "subhan_azim",
      arabic: "سبحان الله العظيم",
      latin: "Subhan Allah al-Azim",
      icon: "mountain",
    },
    {
      id: "la_ilaha_wahdah",
      arabic:
        "لا إله إلا الله وحده لا شريك له له الملك وله الحمد وهو على كل شيء قدير",
      latin:
        "La ilaha illa Allah wahdahu la sharika lah, lahul mulku wa lahul hamdu wa huwa 'ala kulli shay'in qadir",
      icon: "crown",
    },
    {
      id: "sayyid_istighfar",
      arabic: "اللهم أنت ربي لا إله إلا أنت خلقتني وأنا عبدك",
      latin: "Allahumma anta rabbi la ilaha illa anta khalaqtani wa ana 'abduk",
      icon: "book-open",
    },
  ],
  history: [],
  days: {},
};

let state = loadState();
let audioContext;
let mobileMenuCloseTimer;

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
    vibrationUnavailable: "Vibration indisponible",
    vibrationUnsupportedInfo:
      "La vibration n'est pas prise en charge par ce navigateur ou cet appareil.",
    mobileMenuOpen: "Ouvrir le menu mobile",
    mobileMenuClose: "Fermer le menu mobile",
    mobileMenuTitle: "Menu",
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
    vibrationUnavailable: "Vibration unavailable",
    vibrationUnsupportedInfo:
      "Vibration is not supported by this browser or device.",
    mobileMenuOpen: "Open mobile menu",
    mobileMenuClose: "Close mobile menu",
    mobileMenuTitle: "Menu",
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
    vibrationUnavailable: "الاهتزاز غير متاح",
    vibrationUnsupportedInfo: "الاهتزاز غير مدعوم على هذا المتصفح أو الجهاز.",
    mobileMenuOpen: "فتح القائمة",
    mobileMenuClose: "إغلاق القائمة",
    mobileMenuTitle: "القائمة",
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

function canVibrate() {
  return typeof navigator.vibrate === "function";
}

const icons = {
  circle:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/></svg>',
  leaf: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 4c-8 0-14 4.5-14 10.5 0 3.2 2.6 5.5 5.8 5.5C17.8 20 22 12 20 4Z"/><path d="M4 21c3-6 8-9 14-11"/></svg>',
  sprout:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 21V10"/><path d="M12 10C9 5 5 4 3 4c0 5 3 8 9 8"/><path d="M12 10c3-5 7-6 9-6 0 5-3 8-9 8"/></svg>',
  mosque:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 10h16v10H4z"/><path d="M8 10V8a4 4 0 0 1 8 0v2"/><path d="M12 4V2"/><path d="M7 20v-5h10v5"/></svg>',
  star: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 3 2.6 5.4 5.9.8-4.3 4.2 1 5.8L12 16.5 6.8 19.2l1-5.8-4.3-4.2 5.9-.8L12 3Z"/></svg>',
  pen: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m16 4 4 4L8 20H4v-4L16 4Z"/><path d="m13 7 4 4"/></svg>',
  shield:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 7v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V7l-8-4Z"/></svg>',
  heart:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20.8 5.7c-2.1-2.1-5.4-1.9-7.3.4L12 7.8l-1.5-1.7C8.6 3.8 5.3 3.6 3.2 5.7 1 7.9 1.1 11.4 3.5 13.7L12 22l8.5-8.3c2.4-2.3 2.5-5.8.3-8Z"/></svg>',
  "shield-check":
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3 4 7v6c0 5 3.5 8.5 8 10 4.5-1.5 8-5 8-10V7l-8-4Z"/><path d="m9 12 2 2 4-4"/></svg>',
  flower:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="2"/><path d="M12 4v3M12 17v3M4 12h3M17 12h3M6.3 6.3l2.1 2.1M15.6 15.6l2.1 2.1M6.3 17.7l2.1-2.1M15.6 8.4l2.1-2.1"/></svg>',
  mountain:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m4 20 8-14 4 7 4-5 4 12H4Z"/></svg>',
  crown:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 18h16M6 16l2-9 4 5 4-7 4 11H6Z"/></svg>',
  "book-open":
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6c3 0 5 2 8 2s5-2 8-2v13c-3 0-5-2-8-2s-5 2-8 2V6Z"/><path d="M12 8v13"/></svg>',
  chevron:
    '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
};

function mergeDhikrs(savedDhikrs) {
  const catalog = structuredClone(defaults.dhikrs);
  const custom = (savedDhikrs || []).filter((d) => d.id.startsWith("custom-"));
  const ids = new Set(catalog.map((d) => d.id));
  for (const dhikr of custom) {
    if (!ids.has(dhikr.id)) catalog.push(dhikr);
  }
  return catalog;
}

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (!saved) return structuredClone(defaults);
    return {
      ...structuredClone(defaults),
      ...saved,
      dhikrs: mergeDhikrs(saved.dhikrs),
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

  const menuToggle = $("#mobileMenuToggle");
  if (menuToggle) {
    const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute(
      "aria-label",
      isExpanded ? t("mobileMenuClose") : t("mobileMenuOpen"),
    );
  }

  setText(".mobile-drawer-title", t("mobileMenuTitle"));
  setAttribute("#mobileMenuClose", "aria-label", t("mobileMenuClose"));

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
      const isCustom = dhikr.id.startsWith("custom-");
      const isNeutral = dhikr.id === "neutral";
      const label = isNeutral
        ? `<strong class="quick-item-neutral-label">Dhikr libre</strong>`
        : `<strong>${dhikr.arabic}</strong>`;
      return `
    <div class="quick-item-wrap${isCustom ? " has-actions" : ""}">
      <button class="quick-item${isActive ? " active" : ""}" type="button" data-dhikr-id="${dhikr.id}">
        ${icons[dhikr.icon] || icons.leaf}
        ${label}
      </button>
      ${
        isCustom
          ? `
      <div class="quick-item-mobile-actions">
        <button class="quick-action-btn" type="button" data-action="edit" data-dhikr-id="${dhikr.id}" aria-label="Modifier">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="m16 4 4 4L8 20H4v-4L16 4Z"/><path d="m13 7 4 4"/></svg>
        </button>
        <button class="quick-action-btn" type="button" data-action="delete" data-dhikr-id="${dhikr.id}" aria-label="Supprimer">
          <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
        </button>
      </div>`
          : ""
      }
    </div>`;
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
  const vibrationSupported = canVibrate();
  soundToggle.setAttribute("aria-pressed", String(state.soundEnabled));
  vibrationToggle.setAttribute(
    "aria-pressed",
    String(vibrationSupported && state.vibrationEnabled),
  );
  vibrationToggle.toggleAttribute("disabled", !vibrationSupported);
  vibrationToggle.setAttribute("aria-disabled", String(!vibrationSupported));
  vibrationToggle.setAttribute(
    "title",
    vibrationSupported ? t("vibrationLabel") : t("vibrationUnsupportedInfo"),
  );
  soundToggle.querySelector("span").textContent = state.soundEnabled
    ? t("soundOn")
    : t("soundOff");
  vibrationToggle.querySelector("span").textContent = !vibrationSupported
    ? t("vibrationUnavailable")
    : state.vibrationEnabled
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
  if (state.vibrationEnabled && canVibrate()) {
    navigator.vibrate([36, 18, 54]);
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
        const isCustom = d.id.startsWith("custom-");
        return `<div class="swal-dhikr-row">
        <button class="swal-dhikr-btn${isActive ? " swal-dhikr-active" : ""}" type="button" data-dhikr-id="${d.id}">
          <strong>${d.arabic || "—"}</strong>
          <span>${d.latin || ""}</span>
        </button>
        ${
          isCustom
            ? `
        <div class="swal-dhikr-actions">
          <button class="swal-dhikr-action-btn" type="button" data-action="edit" data-dhikr-id="${d.id}" aria-label="Modifier">
            <svg viewBox="0 0 24 24"><path d="m16 4 4 4L8 20H4v-4L16 4Z"/><path d="m13 7 4 4"/></svg>
          </button>
          <button class="swal-dhikr-action-btn" type="button" data-action="delete" data-dhikr-id="${d.id}" aria-label="Supprimer">
            <svg viewBox="0 0 24 24"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
          </button>
        </div>`
            : ""
        }
      </div>`;
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
      document.querySelectorAll(".swal-dhikr-action-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          e.stopPropagation();
          const { action, dhikrId } = btn.dataset;
          Swal.close();
          if (action === "edit") editDhikr(dhikrId);
          else if (action === "delete") deleteDhikr(dhikrId);
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

const ARABIC_KEYBOARD_HTML = `
<div class="arabic-keyboard">
  <div class="arabic-kb-row">
    <button type="button" class="arabic-kb-key" data-char="ض">ض</button><button type="button" class="arabic-kb-key" data-char="ص">ص</button><button type="button" class="arabic-kb-key" data-char="ث">ث</button><button type="button" class="arabic-kb-key" data-char="ق">ق</button><button type="button" class="arabic-kb-key" data-char="ف">ف</button><button type="button" class="arabic-kb-key" data-char="غ">غ</button><button type="button" class="arabic-kb-key" data-char="ع">ع</button><button type="button" class="arabic-kb-key" data-char="ه">ه</button><button type="button" class="arabic-kb-key" data-char="خ">خ</button><button type="button" class="arabic-kb-key" data-char="ح">ح</button><button type="button" class="arabic-kb-key" data-char="ج">ج</button><button type="button" class="arabic-kb-key" data-char="د">د</button>
  </div>
  <div class="arabic-kb-row">
    <button type="button" class="arabic-kb-key" data-char="ش">ش</button><button type="button" class="arabic-kb-key" data-char="س">س</button><button type="button" class="arabic-kb-key" data-char="ي">ي</button><button type="button" class="arabic-kb-key" data-char="ب">ب</button><button type="button" class="arabic-kb-key" data-char="ل">ل</button><button type="button" class="arabic-kb-key" data-char="ا">ا</button><button type="button" class="arabic-kb-key" data-char="ت">ت</button><button type="button" class="arabic-kb-key" data-char="ن">ن</button><button type="button" class="arabic-kb-key" data-char="م">م</button><button type="button" class="arabic-kb-key" data-char="ك">ك</button><button type="button" class="arabic-kb-key" data-char="ط">ط</button>
  </div>
  <div class="arabic-kb-row">
    <button type="button" class="arabic-kb-key" data-char="ئ">ئ</button><button type="button" class="arabic-kb-key" data-char="ء">ء</button><button type="button" class="arabic-kb-key" data-char="ؤ">ؤ</button><button type="button" class="arabic-kb-key" data-char="ر">ر</button><button type="button" class="arabic-kb-key" data-char="لا">لا</button><button type="button" class="arabic-kb-key" data-char="ى">ى</button><button type="button" class="arabic-kb-key" data-char="ة">ة</button><button type="button" class="arabic-kb-key" data-char="و">و</button><button type="button" class="arabic-kb-key" data-char="ز">ز</button><button type="button" class="arabic-kb-key" data-char="ظ">ظ</button><button type="button" class="arabic-kb-key" data-char="ذ">ذ</button>
  </div>
  <div class="arabic-kb-row">
    <button type="button" class="arabic-kb-key" data-char="أ">أ</button><button type="button" class="arabic-kb-key" data-char="إ">إ</button><button type="button" class="arabic-kb-key" data-char="آ">آ</button><button type="button" class="arabic-kb-key arabic-kb-space" data-action="space">مسافة</button><button type="button" class="arabic-kb-key arabic-kb-backspace" data-action="backspace">⌫</button>
  </div>
</div>`;

function attachArabicKeyboard(input, keyboard) {
  if (!input || !keyboard) return;

  keyboard.addEventListener("mousedown", (e) => {
    e.preventDefault();
  });

  keyboard.addEventListener("click", (e) => {
    const key = e.target.closest(".arabic-kb-key");
    if (!key) return;

    const action = key.dataset.action;
    const char = key.dataset.char;

    input.focus();

    if (action === "backspace") {
      const start = input.selectionStart;
      const end = input.selectionEnd;
      if (start !== end) {
        const val = input.value;
        input.value = val.slice(0, start) + val.slice(end);
        input.setSelectionRange(start, start);
      } else if (start > 0) {
        const val = input.value;
        input.value = val.slice(0, start - 1) + val.slice(start);
        input.setSelectionRange(start - 1, start - 1);
      }
    } else if (action === "space") {
      insertAtCursor(input, " ");
    } else if (char) {
      insertAtCursor(input, char);
    }

    input.dispatchEvent(new Event("input", { bubbles: true }));
  });
}

async function editDhikr(id) {
  const dhikr = state.dhikrs.find((d) => d.id === id);
  if (!dhikr) return;
  const { value } = await getSwal().fire({
    title: t("editDhikrTitle"),
    html: `
      <label style="display:block;text-align:start;font-size:.85rem;font-weight:600;margin-bottom:4px">${t("arabicLabel")}</label>
      <input id="swal-arabic" class="swal2-input swal-tasbih-input" dir="rtl" placeholder="${t("arabicPlaceholder")}" value="${dhikr.arabic}" inputmode="none" autocomplete="off">
      ${ARABIC_KEYBOARD_HTML}
      <label style="display:block;text-align:start;font-size:.85rem;font-weight:600;margin:10px 0 4px">${t("latinLabel")}</label>
      <input id="swal-latin" class="swal2-input swal-tasbih-input" placeholder="${t("latinPlaceholder")}" value="${dhikr.latin}">
    `,
    showCancelButton: true,
    cancelButtonText: t("cancel"),
    confirmButtonText: t("add"),
    didOpen: () => {
      const input = document.getElementById("swal-arabic");
      const keyboard = document.querySelector(
        ".swal2-html-container .arabic-keyboard",
      );
      if (input && keyboard) {
        keyboard.hidden = false;
        attachArabicKeyboard(input, keyboard);
      }
    },
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

function showVibrationUnsupportedNotice() {
  getSwal().fire({
    toast: true,
    position: "top",
    icon: "info",
    title: t("vibrationUnsupportedInfo"),
    showConfirmButton: false,
    timer: 2600,
    timerProgressBar: true,
  });
}

function isMobileViewport() {
  return window.matchMedia("(max-width: 760px)").matches;
}

function syncMobileMenuState(isOpen, phase = isOpen ? "open" : "closed") {
  const menu = $("#mobilePanelsShell");
  const backdrop = $("#mobilePanelsBackdrop");
  const toggle = $("#mobileMenuToggle");
  if (!menu || !backdrop || !toggle) return;

  menu.dataset.menuState = phase;
  menu.setAttribute("aria-hidden", String(!isOpen));
  toggle.setAttribute("aria-expanded", String(isOpen));
  toggle.setAttribute(
    "aria-label",
    isOpen ? t("mobileMenuClose") : t("mobileMenuOpen"),
  );
  document.body.classList.toggle(
    "mobile-menu-open",
    isOpen || phase === "closing",
  );

  if (isOpen || phase === "closing") {
    backdrop.hidden = false;
    backdrop.dataset.visible = "true";
  } else {
    backdrop.hidden = true;
    delete backdrop.dataset.visible;
  }
}

function openMobileMenu() {
  clearTimeout(mobileMenuCloseTimer);
  syncMobileMenuState(true);
}

function closeMobileMenu() {
  const menu = $("#mobilePanelsShell");
  if (!menu || menu.dataset.menuState === "closed") return;

  clearTimeout(mobileMenuCloseTimer);
  syncMobileMenuState(false, "closing");
  mobileMenuCloseTimer = window.setTimeout(() => {
    syncMobileMenuState(false, "closed");
  }, 340);
}

function toggleMobileMenu() {
  const menu = $("#mobilePanelsShell");
  if (!menu || !isMobileViewport()) return;

  if (menu.dataset.menuState === "open") closeMobileMenu();
  else openMobileMenu();
}

function closeMobileMenuIfNeeded() {
  if (isMobileViewport()) closeMobileMenu();
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

function initMobileQuickAccordion() {
  const panel = $("#mobileQuickPanel");
  const btn = $("#mobileQuickToggleBtn");
  const body = $("#mobileQuickBody");
  if (!panel || !btn || !body) return;

  function updateHeight() {
    const isOpen = panel.dataset.collapsed === "false";
    const h = isOpen
      ? "var(--mobile-quick-height-open)"
      : "var(--mobile-quick-height)";
    document.documentElement.style.setProperty(
      "--mobile-quick-height",
      isOpen ? "170px" : "58px",
    );
  }

  function setRingOffset(isOpen) {
    document.documentElement.style.setProperty(
      "--ring-extra-offset",
      isOpen ? "0px" : "110px",
    );
  }

  btn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isCollapsed = panel.dataset.collapsed === "true";
    panel.dataset.collapsed = isCollapsed ? "false" : "true";
    btn.setAttribute("aria-expanded", String(isCollapsed));
    body.hidden = !isCollapsed;
    document.documentElement.style.setProperty(
      "--mobile-quick-height",
      isCollapsed ? "170px" : "58px",
    );
    setRingOffset(!isCollapsed);
  });

  setRingOffset(false);
}

function initArabicKeyboard() {
  const input = $("#newArabic");
  const keyboard = $("#arabicKeyboard");
  if (!input || !keyboard) return;

  input.addEventListener("focus", () => {
    keyboard.hidden = false;
  });

  attachArabicKeyboard(input, keyboard);

  document.addEventListener("click", (e) => {
    if (
      !keyboard.hidden &&
      !keyboard.contains(e.target) &&
      e.target !== input
    ) {
      keyboard.hidden = true;
    }
  });

  $("#dhikrModal").addEventListener("close", () => {
    keyboard.hidden = true;
  });
}

function insertAtCursor(input, text) {
  const start = input.selectionStart;
  const end = input.selectionEnd;
  const val = input.value;
  input.value = val.slice(0, start) + text + val.slice(end);
  const pos = start + text.length;
  input.setSelectionRange(pos, pos);
}

function bindEvents() {
  $("#countButton").addEventListener("click", addCount);
  $("#mobileMenuToggle").addEventListener("click", toggleMobileMenu);
  $("#mobileMenuClose").addEventListener("click", closeMobileMenu);
  $("#mobilePanelsBackdrop").addEventListener("click", closeMobileMenu);
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
  $("#goalEditMobileBtn").addEventListener("click", () => {
    closeMobileMenuIfNeeded();
    setDailyGoal();
  });
  $("#showQuickBtn").addEventListener("click", () => {
    closeMobileMenuIfNeeded();
    showAllDhikrsModal();
  });
  $("#soundToggle").addEventListener("click", () => {
    state.soundEnabled = !state.soundEnabled;
    saveState();
    renderFeedbackControls();
  });
  $("#vibrationToggle").addEventListener("click", () => {
    if (!canVibrate()) {
      showVibrationUnsupportedNotice();
      return;
    }
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
  const mobileCustomBtn = $("#customDhikrBtnMobile");
  if (mobileCustomBtn) {
    mobileCustomBtn.addEventListener("click", () => {
      closeMobileMenuIfNeeded();
      $("#dhikrModal").showModal();
    });
  }
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
    if (quick) {
      closeMobileMenuIfNeeded();
      selectDhikr(quick.dataset.dhikrId);
    }
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMobileMenu();
    if (
      event.code === "Space" &&
      !["INPUT", "SELECT", "TEXTAREA"].includes(document.activeElement.tagName)
    ) {
      event.preventDefault();
      addCount();
    }
  });

  window.addEventListener("resize", () => {
    if (!isMobileViewport()) {
      clearTimeout(mobileMenuCloseTimer);
      syncMobileMenuState(false, "closed");
    }
  });
}

bindEvents();
render();
initMobileQuickAccordion();
initArabicKeyboard();

(function showSplash() {
  const splash = document.getElementById("splashScreen");
  if (!splash) return;
  setTimeout(() => {
    splash.classList.add("splash-fade");
    splash.addEventListener(
      "transitionend",
      () => {
        splash.classList.add("splash-hidden");
      },
      { once: true },
    );
  }, 2600);
})();
