(() => {
  "use strict";

  /* =========================================================
     1. إعداد Firebase Realtime Database
  ========================================================= */
  const firebaseConfig = {
    apiKey: "AIzaSyBz20MLbmsCYPJRBRMDImTZVohtomTLHe8",
    authDomain: "anime-card-legends.firebaseapp.com",
    databaseURL: "https://anime-card-legends-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "anime-card-legends",
    storageBucket: "anime-card-legends.firebasestorage.app",
    messagingSenderId: "77329236652",
    appId: "1:77329236652:web:d7ec1e25db344c08995509",
    measurementId: "G-9YFENM7S4Y"
  };

  let db = null;
  try {
    if (window.firebase && !firebase.apps.length) firebase.initializeApp(firebaseConfig);
    if (window.firebase) db = firebase.database();
  } catch (err) {
    console.warn("Firebase offline fallback:", err);
  }

  /* =========================================================
     2. حقن تنسيقات الواجهة والحزم الخرافية
  ========================================================= */
  (function injectCoreFixStyles() {
    if (document.getElementById("monarchV6Css")) return;
    const st = document.createElement("style");
    st.id = "monarchV6Css";
    st.textContent = `
      .panel-card { overflow: hidden; max-width: 100%; }
      .cards-board-6 { display: grid !important; grid-template-columns: repeat(3, minmax(0, 1fr)) !important; gap: 8px !important; width: 100% !important; max-width: 100% !important; overflow: hidden; padding: 2px; }
      .duel-slot { width: 100% !important; min-width: 0 !important; max-width: 100% !important; aspect-ratio: 3 / 4.1 !important; will-change: transform; position: relative; z-index: 1; }
      .duel-slot.moving-card { z-index: 10; filter: drop-shadow(0 0 10px rgba(245,197,66,0.55)); }
      .duel-card-inner { width: 100% !important; height: 100% !important; }
      .pop-bet-panel { background: rgba(7,9,18,0.6); border: 1px solid var(--border-soft); border-radius: 14px; padding: 12px; margin-bottom: 12px; text-align: center; }
      .pop-bets-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; margin-top: 10px; }
      .pop-bet-btn { background: linear-gradient(145deg, #1b2444, #10162c); border: 1.5px solid rgba(245,197,66,0.4); color: #fff; padding: 10px 6px; border-radius: 12px; font-weight: 800; font-size: 0.84rem; cursor: pointer; display: flex; flex-direction: column; align-items: center; gap: 3px; }
      .pop-bet-btn small { font-size: 0.68rem; color: var(--text-muted); font-weight: 600; }
      .pop-hud-bar { display: flex; justify-content: space-between; align-items: center; gap: 6px; background: var(--bg-card-2); padding: 8px 11px; border-radius: 11px; margin-bottom: 8px; font-size: 0.8rem; border: 1px solid rgba(245,197,66,0.28); }
      .pop-timer-wrap { grid-column: 1 / -1; margin-bottom: 10px; }
      .pop-timer-head { display: flex; justify-content: space-between; font-size: 0.78rem; font-weight: 800; margin-bottom: 4px; color: var(--gold); }
      .pop-timer-head.danger { color: #fb7185; }
      .pop-timer-track { width: 100%; height: 8px; background: rgba(255,255,255,0.08); border-radius: 999px; overflow: hidden; }
      .pop-timer-fill { height: 100%; width: 100%; background: linear-gradient(90deg, #22c55e, #f5c542); transition: width 0.1s linear; }
      .pop-timer-fill.danger { background: linear-gradient(90deg, #f43f5e, #ef4444); }
      .pop-card { position: relative; transition: transform 0.2s ease, border-color 0.2s ease; }
      .pop-card.win-hl { border-color: #22c55e; box-shadow: 0 0 18px rgba(34,197,94,0.35); }
      .pop-card.lose-hl { border-color: #ef4444; box-shadow: 0 0 18px rgba(239,68,68,0.35); }
      .pop-fav-badge { position: absolute; top: 8px; inset-inline: 8px; background: rgba(7,9,18,0.92); border: 1px solid var(--gold); color: var(--gold); padding: 5px 8px; border-radius: 999px; font-weight: 900; font-size: 0.84rem; }
      .pop-decision-box { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
      .btn-cashout { background: linear-gradient(135deg, #22c55e, #15803d); color: #fff; border: none; border-radius: 12px; padding: 11px 10px; font-weight: 800; font-size: 0.82rem; cursor: pointer; }
      .btn-double { background: linear-gradient(135deg, #f43f5e, #f59e0b); color: #fff; border: none; border-radius: 12px; padding: 11px 10px; font-weight: 800; font-size: 0.82rem; cursor: pointer; }
      .clue-card-box { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 10px; text-align: center; }
      .clue-emblem { width: 64px; height: 64px; border-radius: 18px; background: rgba(245,197,66,0.14); border: 2px solid var(--gold); display: flex; align-items: center; justify-content: center; font-size: 2rem; }
      .clue-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-top: 4px; }
      .clue-tag { background: rgba(255,255,255,0.07); border: 1px solid rgba(245,197,66,0.35); color: var(--gold); padding: 4px 10px; border-radius: 999px; font-size: 0.76rem; font-weight: 700; }
      .codex-load-more { grid-column: 1 / -1; text-align: center; padding: 8px 0; }
      .mythic-pack-card { position: relative; overflow: hidden; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px; background: linear-gradient(145deg, #0f172a, #1e293b); transition: transform 0.2s ease; }
      .mythic-pack-card:active { transform: scale(0.98); }
      .pack-ssr { border: 2px solid #f59e0b; box-shadow: 0 0 18px rgba(245, 158, 11, 0.35); }
      .pack-ur  { border: 2px solid #ef4444; box-shadow: 0 0 22px rgba(239, 68, 68, 0.45); }
      .pack-sp  { border: 2px solid #a855f7; box-shadow: 0 0 26px rgba(168, 85, 247, 0.6); }
      .mythic-badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 800; color: #fff; }
      .pack-ssr .mythic-badge { background: linear-gradient(90deg, #d97706, #f59e0b); }
      .pack-ur  .mythic-badge { background: linear-gradient(90deg, #dc2626, #f97316); }
      .pack-sp  .mythic-badge { background: linear-gradient(90deg, #7e22ce, #ec4899); }
      #mythicOpenOverlay { position: fixed; inset: 0; z-index: 99999; background: rgba(2, 6, 23, 0.92); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 20px; text-align: center; backdrop-filter: blur(6px); }
      @keyframes packShake { 0%,100%{transform:rotate(0) scale(1)} 25%{transform:rotate(-6deg) scale(1.06)} 50%{transform:rotate(6deg) scale(1.1)} 75%{transform:rotate(-4deg) scale(1.06)} }
      .pack-shaking { animation: packShake 0.35s infinite; font-size: 64px; }
    `;
    document.head.appendChild(st);
  })();

  /* =========================================================
     3. القواعد، الحزم، والتصنيف الذكي (الاسم + الأنمي + القصة)
  ========================================================= */
  const RANK_POWER = { N: 1, C: 2, R: 3, SR: 4, SSR: 5, UR: 6, SP: 7 };
  const LIMITED_CAPS = { SP: 1, UR: 3, SSR: 10 };
  const INACTIVITY_DAYS = { SP: 7, UR: 14, SSR: 30 };
  const DAY_MS = 24 * 60 * 60 * 1000;
  const DUP_GOLD_REWARD = { N: 30, C: 60, R: 130, SR: 280, SSR: 700, UR: 1500, SP: 3000 };

  const SHOP_PACKS = [
    { id: "pack_N", rarity: "N", gold: 60, gem: 0, rates: { N: 74, C: 21, R: 5 } },
    { id: "pack_C", rarity: "C", gold: 120, gem: 0, rates: { N: 16, C: 62, R: 19, SR: 3 } },
    { id: "pack_R", rarity: "R", gold: 250, gem: 0, rates: { C: 18, R: 62, SR: 19.9, SSR: 0.1 } },
    { id: "pack_SR", rarity: "SR", gold: 500, gem: 3, rates: { R: 22, SR: 77.75, SSR: 0.15, UR: 0.08, SP: 0.02 } },
    { id: "pack_SSR", rarity: "SSR", gold: 950, gem: 7, rates: { R: 10, SR: 89.65, SSR: 0.2, UR: 0.1, SP: 0.05 } },
    { id: "pack_UR", rarity: "UR", gold: 0, gem: 14, rates: { SR: 99.65, SSR: 0.15, UR: 0.14, SP: 0.06 } },
    { id: "pack_SP", rarity: "SP", gold: 0, gem: 25, rates: { SR: 99.6, SSR: 0.15, UR: 0.15, SP: 0.1 } }
  ];

  const MYTHIC_PACKS = [
    { id: "mythic_ssr", rarity: "SSR", cls: "pack-ssr", title: "👑 حزمة SSR الخرافية", gems: 1000, goldReward: 15000, desc: "بطاقة SSR مضمونة + 15,000 🪙 ذهب فوري" },
    { id: "mythic_ur", rarity: "UR", cls: "pack-ur", title: "🔥 حزمة UR الأسطورية", gems: 2500, goldReward: 50000, desc: "بطاقة UR مضمونة + 50,000 🪙 ذهب فوري" },
    { id: "mythic_sp", rarity: "SP", cls: "pack-sp", title: "🌌 حزمة SP الكونية", gems: 5000, goldReward: 100000, desc: "بطاقة SP نادرة مضمونة + 100,000 🪙 ذهب فوري" }
  ];

  // قواعد VIP دقيقة تتحقق من الاسم + الأنمي/القصة لمنع أي تشابه في الأسماء
  const VIP_RULES = [
    // SP (القمة المطلقة)
    { names: ["monkey d. luffy", "luffy monkey"], anime: "one piece", rarity: "SP" },
    { names: ["satoru gojo", "satoru gojou"], anime: "jujutsu", rarity: "SP" },
    { names: ["ryomen sukuna", "sukuna"], anime: "jujutsu", rarity: "SP" },
    { names: ["son goku", "goku son"], anime: "dragon ball", rarity: "SP" },
    { names: ["guts"], anime: "berserk", rarity: "SP" },
    { names: ["sung jin-woo", "jin-u seong", "jinwoo sung"], anime: "solo leveling", rarity: "SP" },
    { names: ["sosuke aizen", "sousuke aizen"], anime: "bleach", rarity: "SP" },
    { names: ["madara uchiha", "uchiha madara"], anime: "naruto", rarity: "SP" },
    { names: ["levi", "levi ackerman"], anime: "titan", rarity: "SP" },
    { names: ["lelouch lamperouge", "lelouch vi britannia"], anime: "geass", rarity: "SP" },
    { names: ["shigeo kageyama"], anime: "mob psycho", rarity: "SP" },
    { names: ["rimuru tempest"], anime: "slime", rarity: "SP" },
    { names: ["saitama"], anime: "one punch", rarity: "SP" },
    { names: ["edward newgate", "newgate edward"], anime: "one piece", rarity: "SP" },
    { names: ["isaac netero"], anime: "hunter", rarity: "SP" },
    { names: ["meruem"], anime: "hunter", rarity: "SP" },
    { names: ["yoriichi tsugikuni"], anime: "demon slayer", rarity: "SP" },
    { names: ["anos voldigoad"], anime: "demon king academy", rarity: "SP" },
    { names: ["gilgamesh"], anime: "fate", rarity: "SP" },
    { names: ["ainz ooal gown"], anime: "overlord", rarity: "SP" },
    { names: ["sinbad"], anime: "magi", rarity: "SP" },

    // UR (النخبة والعباقرة)
    { names: ["naruto uzumaki"], anime: "naruto", rarity: "UR" },
    { names: ["sasuke uchiha", "itachi uchiha", "minato namikaze", "kakashi hatake"], anime: "naruto", rarity: "UR" },
    { names: ["roronoa zoro", "zoro roronoa", "shanks", "sanji"], anime: "one piece", rarity: "UR" },
    { names: ["eren yeager", "eren jaeger", "mikasa ackerman"], anime: "titan", rarity: "UR" },
    { names: ["ichigo kurosaki", "kisuke urahara", "kenpachi zaraki"], anime: "bleach", rarity: "UR" },
    { names: ["light yagami", "l lawliet", "ryuk"], anime: "death note", rarity: "UR" },
    { names: ["killua zoldyck", "hisoka morow", "gon freecss", "kurapika", "chrollo lucilfer"], anime: "hunter", rarity: "UR" },
    { names: ["vegeta", "piccolo", "gohan son", "son gohan"], anime: "dragon ball", rarity: "UR" },
    { names: ["tanjirou kamado", "tanjiro kamado"], anime: "demon slayer", rarity: "UR" },
    { names: ["edward elric", "roy mustang"], anime: "fullmetal", rarity: "UR" },
    { names: ["dio brando", "jotaro kujo", "giorno giovanna"], anime: "jojo", rarity: "UR" },
    { names: ["dazai osamu", "osamu dazai"], anime: "bungo", rarity: "UR" },
    { names: ["gintoki sakata"], anime: "gintama", rarity: "UR" },

    // SSR (شخصيات قوية ومحبوبة)
    { names: ["sebastian michaelis"], anime: "black butler", rarity: "SSR" },
    { names: ["ken kaneki"], anime: "tokyo ghoul", rarity: "SSR" },
    { names: ["robin nico", "nico robin", "nami"], anime: "one piece", rarity: "SSR" },
    { names: ["senkuu ishigami"], anime: "dr. stone", rarity: "SSR" },
    { names: ["manjirou sano"], anime: "tokyo revengers", rarity: "SSR" },
    { names: ["megumi fushiguro", "yuta okkotsu"], anime: "jujutsu", rarity: "SSR" },
    { names: ["kusuo saiki"], anime: "saiki", rarity: "SSR" },
    { names: ["koro-sensei"], anime: "assassination", rarity: "SSR" },
    { names: ["keigo takami", "izuku midoriya", "katsuki bakugou", "shouto todoroki"], anime: "hero academia", rarity: "SSR" },
    { names: ["shinei nouzen"], anime: "86", rarity: "SSR" }
  ];

  const NON_COMBAT_ANIME_RE = /k-on|silent voice|koe no katachi|clannad|toradora|kaguya-sama|horimiya|bocchi|oregairu|fruits basket|your lie in april|hyouka|nichijou|lucky star|nisekoi|love live|kimi ni todoke|violet evergarden|anohana|angel beats|haruhi|dress-up|komi|bunny girl|rascal does not dream|oreimo|haikyuu|blue lock|kuroko|aikatsu|real girl|food wars|shokugeki|paradise kiss|tokyo mew mew|natsume|princess kaguya/i;
  const COMBAT_GENRES = ["Action", "Adventure", "Fantasy", "Supernatural", "Sci-Fi", "Mecha"];
  const COMBAT_STORY_RE = /\b(fight|battle|warrior|sword|demon|curse|magic|power|king|assassin|hero|villain|hunter|ninja|pirate|shinigami|sorcerer|saiyan|titan|alchemist|stand|quirk|strongest|army)\b/i;

  function classifyStrictRarity(ch) {
    if (!ch) return "N";
    const name = String(ch.name || "").trim().toLowerCase();
    const anime = String(ch.anime || "").trim().toLowerCase();
    const story = String(ch.bioEn || "").toLowerCase();
    const favs = Number(ch.favorites || ch.favourites || 0);
    const genres = Array.isArray(ch.genres) ? ch.genres : [];

    // 1. فحص قائمة VIP بالاسم الكامل + الأنمي/القصة معاً
    for (const rule of VIP_RULES) {
      if (rule.names.includes(name)) {
        if (!rule.anime || anime.includes(rule.anime) || story.includes(rule.anime)) {
          return rule.rarity;
        }
      }
    }

    // 2. استبعاد الأعمال غير القتالية من النوادر العليا
    const isBlockedAnime = NON_COMBAT_ANIME_RE.test(anime);
    const hasCombatGenre = genres.some((g) => COMBAT_GENRES.includes(g));
    const hasCombatStory = COMBAT_STORY_RE.test(story);
    const isCombat = !isBlockedAnime && (hasCombatGenre || (genres.length === 0 && hasCombatStory));

    if (isCombat) {
      if (favs >= 32000) return "SP";
      if (favs >= 16000) return "UR";
      if (favs >= 7500) return "SSR";
      if (favs >= 3000) return "SR";
      if (favs >= 1000) return "R";
      if (favs >= 350) return "C";
      return "N";
    }

    if (favs >= 12000) return "SR";
    if (favs >= 3500) return "R";
    if (favs >= 900) return "C";
    return "N";
  }

  /* =========================================================
     4. قاموس الترجمة للغات الأربع (AR / EN / FR / JA)
  ========================================================= */
  const I18N = {
    ar: {
      app_title: "أساطير بطاقات الأنمي", app_subtitle: "اجمع النوادر • نافس أونلاين • انتزع العرش",
      start_play: "ابدأ اللعب", nav_arena: "الساحة", nav_online: "أونلاين", nav_shop: "المتجر", nav_cards: "بطاقاتي", nav_codex: "النوادر",
      solo_shuffle: "🎴 نزال الـ 6 بطاقات", solo_trivia: "🧠 ألغاز الأنمي", solo_pop: "🔥 تحدي الشعبية",
      shuffle_title: "نزال الذاكرة (6 بطاقات)", shuffle_ready: "اختر الصعوبة وابدأ",
      diff_normal: "عادي (+2 💎)", diff_hard: "صعب (+3 💎)", diff_legend: "أسطوري (+4 💎)",
      lbl_you: "أنت", lbl_opp: "الخصم", shuffle_hint: "احفظ مواقع البطاقات!", btn_start_duel: "⚡ ابدأ النزال",
      trivia_title: "ألغاز الشخصيات والقدرات", lbl_streak: "السلسلة",
      tmode_img: "🖼️ صورة", tmode_sil: "🗡️ سلاح / قدرة", tmode_lore: "📜 قصة / وصف",
      trivia_who: "من هي هذه الشخصية؟", trivia_clue: "تعرّف على الشخصية من سلاحها أو قدرتها!", trivia_lore: "من صاحب هذه القصة؟",
      btn_5050: "✂️ حذف إجابة (50 🪙)", btn_skip: "⏭️ سؤال جديد", pop_title: "أي شخصية أكثر شعبية؟",
      online_tab_arena: "⚔️ ساحة 1 ضد 1", online_tab_challenges: "📩 التحديات", online_tab_leaders: "🏆 المتصدرون",
      online_title: "نزال الـ 6 بطاقات المباشر", online_sub: "اختر نمط المواجهة وتحدّ خصمك بكود الغرفة المباشر",
      lbl_duel_mode: "اختر نوع المواجهة:", mode_safe_title: "نزال آمن", mode_safe_desc: "ذهب + جواهر + كؤوس بدون مخاطرة",
      mode_gems_title: "رهان الجواهر", mode_gems_desc: "30 / 100 / 1000 💎 بموافقة الطرفين",
      mode_card_title: "رهان بطاقة نادرة", mode_card_desc: "مواجهة مصيرية على بطاقات النوادر",
      lbl_pick_stake: "اضغط على بطاقتك النادرة للرهان:", btn_create_room: "➕ إنشاء غرفة نزال جديدة",
      ph_room_code: "كود من 4 أرقام", btn_join_room: "دخول", lbl_room_code: "الكود", btn_leave: "خروج",
      consent_warn: "⚠️ نزال رهان: يتطلب موافقة الطرفين قبل البدء", btn_agree: "✅ أوافق على الرهان", btn_cancel: "❌ إلغاء",
      ch_title: "📩 تحديات البطاقات النادرة", ch_desc: "تظهر هنا تحديات اللاعبين على بطاقاتك النادرة.",
      lead_title: "🏆 أبطال السيرفر (Top 20)", shop_title: "🛒 متجر الحزم الأسطورية",
      shop_sub: "استدعِ أعظم شخصيات الأنمي — النوادر الحقيقية لا تظهر إلا للمحظوظين!",
      inv_title: "بطاقاتي", inv_unlimited: "∞ مخزون مفتوح", ph_search_cards: "🔍 ابحث بالاسم أو الأنمي...",
      filter_all: "الكل", btn_load_more: "عرض المزيد ⬇️",
      codex_title: "👑 سجل الأساطير والنوادر", codex_sub: "اضغط على أي بطاقة لقراءة ملفها الكامل أو تحدي مالكها",
      ph_search_rare: "🔍 ابحث عن أي أسطورة أنمي...", btn_claim: "رائع! استلام",
      set_title: "⚙️ الإعدادات والملف الشخصي", set_name: "اسم اللاعب في السيرفر:", btn_save: "حفظ",
      set_lang: "اللغة / Language:", set_bgm: "🎵 موسيقى الخلفية", set_sfx: "🔔 المؤثرات الصوتية",
      set_uid: "معرّف الحساب", set_shield: "درع الحماية", set_pool: "الشخصيات المحمّلة",
      pack_N: "حزمة البداية", pack_N_desc: "استدعاء أساسي لأبطال الأنمي",
      pack_C: "حزمة المغامر", pack_C_desc: "فرصة أكبر لأبطال مشهورين",
      pack_R: "حزمة النخبة", pack_R_desc: "مقاتلون مميزون من أشهر الأعمال",
      pack_SR: "حزمة القادة", pack_SR_desc: "شخصيات قوية وفرصة لأساطير نادرة",
      pack_SSR: "الحزمة الأسطورية", pack_SSR_desc: "بوابتك نحو النوادر العالمية",
      pack_UR: "الحزمة الخرافية", pack_UR_desc: "مخصصة لصيادي البطاقات الفريدة",
      pack_SP: "الحزمة الملكية", pack_SP_desc: "أرقى استدعاء في عالم الملوك",
      lbl_anime: "الأنمي", lbl_pop: "الشعبية", lbl_serial: "النسخة", lbl_bio: "📜 السيرة والمعلومات",
      lbl_owners: "👑 الملّاك الحاليون", lbl_free_slots: "متاح في المتجر", lbl_unlimited_copy: "نسخة عامة غير محدودة",
      btn_challenge: "⚔️ تحدّي", btn_recycle: "♻️ تحويل إلى", btn_accept: "قبول", btn_reject: "رفض",
      msg_loading_bio: "جاري ترجمة المعلومات...", msg_no_cards: "لا توجد بطاقات بعد — افتح حزمة من المتجر!",
      msg_no_rares_stake: "لا تملك بطاقة نادرة (SSR/UR/SP) للرهان حالياً.", msg_no_gold: "⚠️ رصيد الذهب غير كافٍ!",
      msg_no_gems: "⚠️ رصيد الجواهر غير كافٍ!", msg_shield_off: "غير مفعّل",
      msg_protected: "👑 بطاقة نادرة محمية (تُربح أو تُخسر في نزال الرهان فقط)",
      msg_waiting_opp: "بانتظار خصم...", msg_your_turn: "🟢 دورك الآن! اختر بطاقة", msg_opp_turn: "⏳ بانتظار اختيار الخصم...",
      msg_memorize: "👀 احفظ مواقع البطاقات!", msg_shuffling: "🔀 جاري الخلط السريع...",
      msg_win: "🏆 فوز رائع!", msg_lose: "خسرت الجولة — حاول مجدداً!", msg_saved: "✅ تم الحفظ بنجاح!",
      dup_converted: "♻️ بطاقة مكررة! تم تحويلها إلى ذهب:", codex_more: "🔄 تحميل المزيد من الأساطير",
      codex_searching: "🔍 جاري البحث...", pop_pick_bet: "اختر رهانك (مؤقت 6 ثوانٍ لكل جولة • مضاعفة ×2):",
      pop_low: "مخاطرة خفيفة", pop_mid: "مخاطرة متوسطة", pop_high: "مخاطرة عالية",
      pop_round: "الجولة", pop_pot: "الجائزة", pop_risk: "الصعوبة", pop_time: "⏱️ الوقت",
      pop_cashout: "💰 سحب الأرباح", pop_double: "🔥 استمرار ×2",
      pop_lost: "💥 خسرت الرهان!", pop_timeout: "⏰ انتهى الوقت! خسرت الرهان", pop_cashed: "✅ تم سحب الأرباح بنجاح!"
    },
    en: {
      app_title: "Anime Card Legends", app_subtitle: "Collect Rares • Duel Online • Claim the Throne",
      start_play: "Start Game", nav_arena: "Arena", nav_online: "Online 1v1", nav_shop: "Shop", nav_cards: "My Cards", nav_codex: "Rare Codex",
      solo_shuffle: "🎴 6-Card Duel", solo_trivia: "🧠 Anime Trivia", solo_pop: "🔥 Popularity",
      shuffle_title: "Memory Duel (6 Cards)", shuffle_ready: "Choose difficulty & start",
      diff_normal: "Normal (+2 💎)", diff_hard: "Hard (+3 💎)", diff_legend: "Legendary (+4 💎)",
      lbl_you: "You", lbl_opp: "Opponent", shuffle_hint: "Memorize card positions!", btn_start_duel: "⚡ Start Duel",
      trivia_title: "Character & Ability Trivia", lbl_streak: "Streak",
      tmode_img: "🖼️ Image", tmode_sil: "🗡️ Weapon / Power", tmode_lore: "📜 Story / Lore",
      trivia_who: "Who is this character?", trivia_clue: "Guess by weapon or power!", trivia_lore: "Who does this story belong to?",
      btn_5050: "✂️ Remove 1 (50 🪙)", btn_skip: "⏭️ New Question", pop_title: "Which character is more popular?",
      online_tab_arena: "⚔️ 1v1 Arena", online_tab_challenges: "📩 Challenges", online_tab_leaders: "🏆 Leaderboard",
      online_title: "Live 6-Card Duel", online_sub: "Pick your duel mode and battle live with a room code",
      lbl_duel_mode: "Select Duel Mode:", mode_safe_title: "Safe Duel", mode_safe_desc: "Gold + Gems + Trophies with zero risk",
      mode_gems_title: "Gem Wager", mode_gems_desc: "30 / 100 / 1000 💎 with mutual consent",
      mode_card_title: "Rare Card Stake", mode_card_desc: "High-stakes clash for rare limited cards",
      lbl_pick_stake: "Tap your rare card to stake:", btn_create_room: "➕ Create Duel Room",
      ph_room_code: "4-digit code", btn_join_room: "Join", lbl_room_code: "Code", btn_leave: "Leave",
      consent_warn: "⚠️ Wager Duel: Both players must agree before starting", btn_agree: "✅ Agree to Stake", btn_cancel: "❌ Cancel",
      ch_title: "📩 Rare Card Challenges", ch_desc: "Incoming challenges for your rare cards appear here.",
      lead_title: "🏆 Server Champions (Top 20)", shop_title: "🛒 Legendary Pack Shop",
      shop_sub: "Summon iconic anime heroes — true limited rares await the luckiest!",
      inv_title: "My Cards", inv_unlimited: "∞ Unlimited Vault", ph_search_cards: "🔍 Search by name or anime...",
      filter_all: "All", btn_load_more: "Load More ⬇️",
      codex_title: "👑 Legends & Rares Codex", codex_sub: "Tap any card to read its full dossier or challenge its owner",
      ph_search_rare: "🔍 Search any anime legend...", btn_claim: "Awesome! Claim",
      set_title: "⚙️ Settings & Profile", set_name: "Server Player Name:", btn_save: "Save",
      set_lang: "Language:", set_bgm: "🎵 Background Music", set_sfx: "🔔 Sound Effects",
      set_uid: "Account ID", set_shield: "Protection Shield", set_pool: "Loaded Characters",
      pack_N: "Starter Pack", pack_N_desc: "Core anime heroes summon", pack_C: "Adventurer Pack", pack_C_desc: "Fan-favorite heroes",
      pack_R: "Elite Pack", pack_R_desc: "Iconic fighters from hit series", pack_SR: "Captain Pack", pack_SR_desc: "Strong heroes & legends",
      pack_SSR: "Mythic Pack", pack_SSR_desc: "Gateway to global rares", pack_UR: "Ultra Pack", pack_UR_desc: "For rare card hunters",
      pack_SP: "Monarch Pack", pack_SP_desc: "The ultimate royal summon",
      lbl_anime: "Anime", lbl_pop: "Popularity", lbl_serial: "Edition", lbl_bio: "📜 Biography & Lore",
      lbl_owners: "👑 Current Owners", lbl_free_slots: "Available in Shop", lbl_unlimited_copy: "Standard Unlimited Edition",
      btn_challenge: "⚔️ Challenge", btn_recycle: "♻️ Convert to", btn_accept: "Accept", btn_reject: "Decline",
      msg_loading_bio: "Loading dossier...", msg_no_cards: "No cards yet — open a pack in the Shop!",
      msg_no_rares_stake: "No limited rare card (SSR/UR/SP) to stake.", msg_no_gold: "⚠️ Not enough Gold!",
      msg_no_gems: "⚠️ Not enough Gems!", msg_shield_off: "Inactive",
      msg_protected: "👑 Protected Rare Card", msg_waiting_opp: "Waiting for opponent...",
      msg_your_turn: "🟢 Your turn! Pick a card", msg_opp_turn: "⏳ Waiting for opponent...",
      msg_memorize: "👀 Memorize the 6 cards!", msg_shuffling: "🔀 Rapid shuffling...",
      msg_win: "🏆 Victory!", msg_lose: "Defeat — try again!", msg_saved: "✅ Saved!",
      dup_converted: "♻️ Duplicate! Converted to Gold:", codex_more: "🔄 Load More Legends",
      codex_searching: "🔍 Searching...", pop_pick_bet: "Pick your wager (6s timer • Double ×2):",
      pop_low: "Low Risk", pop_mid: "Medium Risk", pop_high: "High Risk",
      pop_round: "Round", pop_pot: "Pot", pop_risk: "Risk", pop_time: "⏱️ Time",
      pop_cashout: "💰 Cash Out", pop_double: "🔥 Double ×2",
      pop_lost: "💥 Wager lost!", pop_timeout: "⏰ Time's up!", pop_cashed: "✅ Prize collected!"
    },
    fr: {
      app_title: "Légendes des Cartes Anime", app_subtitle: "Collectionne les Rares • Duel en Ligne",
      start_play: "Jouer", nav_arena: "Arène", nav_online: "En ligne", nav_shop: "Boutique", nav_cards: "Mes Cartes", nav_codex: "Raretés",
      solo_shuffle: "🎴 Duel 6 Cartes", solo_trivia: "🧠 Quiz Anime", solo_pop: "🔥 Popularité",
      shuffle_title: "Duel Mémoire (6 Cartes)", shuffle_ready: "Choisis la difficulté",
      diff_normal: "Normal (+2 💎)", diff_hard: "Difficile (+3 💎)", diff_legend: "Légendaire (+4 💎)",
      lbl_you: "Toi", lbl_opp: "Adversaire", shuffle_hint: "Mémorise les cartes !", btn_start_duel: "⚡ Lancer le Duel",
      trivia_title: "Quiz Personnages", lbl_streak: "Série", tmode_img: "🖼️ Image", tmode_sil: "🗡️ Arme / Pouvoir", tmode_lore: "📜 Histoire",
      trivia_who: "Qui est ce personnage ?", trivia_clue: "Devine grâce au pouvoir !", trivia_lore: "À qui appartient cette histoire ?",
      btn_5050: "✂️ Retirer 1 (50 🪙)", btn_skip: "⏭️ Suivant", pop_title: "Quel personnage est le plus populaire ?",
      online_tab_arena: "⚔️ Arène 1v1", online_tab_challenges: "📩 Défis", online_tab_leaders: "🏆 Classement",
      online_title: "Duel Direct 6 Cartes", online_sub: "Affronte un joueur avec un code",
      lbl_duel_mode: "Mode de Duel :", mode_safe_title: "Duel Sûr", mode_safe_desc: "Or + Gemmes + Trophées sans risque",
      mode_gems_title: "Pari Gemmes", mode_gems_desc: "30 / 100 / 1000 💎 avec accord mutuel",
      mode_card_title: "Pari Carte Rare", mode_card_desc: "Duel décisif pour cartes rares",
      lbl_pick_stake: "Choisis ta carte rare :", btn_create_room: "➕ Créer une Salle",
      ph_room_code: "Code à 4 chiffres", btn_join_room: "Rejoindre", lbl_room_code: "Code", btn_leave: "Quitter",
      consent_warn: "⚠️ Accord des deux joueurs requis", btn_agree: "✅ Accepter", btn_cancel: "❌ Annuler",
      ch_title: "📩 Défis de Cartes Rares", ch_desc: "Les défis pour tes cartes rares s'affichent ici.",
      lead_title: "🏆 Top 20", shop_title: "🛒 Boutique de Packs", shop_sub: "Invoque les plus grands héros !",
      inv_title: "Mes Cartes", inv_unlimited: "∞ Stock Illimité", ph_search_cards: "🔍 Chercher...",
      filter_all: "Tout", btn_load_more: "Afficher plus ⬇️", codex_title: "👑 Codex des Légendes",
      codex_sub: "Clique sur une carte pour voir son dossier", ph_search_rare: "🔍 Chercher...", btn_claim: "Récupérer",
      set_title: "⚙️ Paramètres", set_name: "Nom :", btn_save: "Enregistrer", set_lang: "Langue :",
      set_bgm: "🎵 Musique", set_sfx: "🔔 Effets", set_uid: "ID", set_shield: "Bouclier", set_pool: "Personnages",
      pack_N: "Pack Débutant", pack_N_desc: "Invocation de base", pack_C: "Pack Aventurier", pack_C_desc: "Héros appréciés",
      pack_R: "Pack Élite", pack_R_desc: "Combattants célèbres", pack_SR: "Pack Capitaine", pack_SR_desc: "Héros puissants",
      pack_SSR: "Pack Mythique", pack_SSR_desc: "Éditions rares", pack_UR: "Pack Ultra", pack_UR_desc: "Chasseurs de rares",
      pack_SP: "Pack Royal", pack_SP_desc: "Invocation suprême",
      lbl_anime: "Anime", lbl_pop: "Popularité", lbl_serial: "Édition", lbl_bio: "📜 Biographie",
      lbl_owners: "👑 Propriétaires", lbl_free_slots: "Dispo", lbl_unlimited_copy: "Standard",
      btn_challenge: "⚔️ Défier", btn_recycle: "♻️ Convertir", btn_accept: "Accepter", btn_reject: "Refuser",
      msg_loading_bio: "Traduction...", msg_no_cards: "Aucune carte !", msg_no_rares_stake: "Aucune carte rare.",
      msg_no_gold: "⚠️ Pas assez d'or !", msg_no_gems: "⚠️ Pas assez de gemmes !", msg_shield_off: "Inactif",
      msg_protected: "👑 Carte Protégée", msg_waiting_opp: "En attente...", msg_your_turn: "🟢 À toi !",
      msg_opp_turn: "⏳ Tour adverse...", msg_memorize: "👀 Mémorise !", msg_shuffling: "🔀 Mélange...",
      msg_win: "🏆 Victoire !", msg_lose: "Défaite !", msg_saved: "✅ Enregistré !",
      dup_converted: "♻️ Double ! Or :", codex_more: "🔄 Charger plus", codex_searching: "🔍 Recherche...",
      pop_pick_bet: "Choisis ta mise (6s • ×2) :", pop_low: "Faible", pop_mid: "Moyen", pop_high: "Haut",
      pop_round: "Manche", pop_pot: "Gains", pop_risk: "Risque", pop_time: "⏱️ Temps",
      pop_cashout: "💰 Encaisser", pop_double: "🔥 Doubler ×2", pop_lost: "💥 Perdu !", pop_timeout: "⏰ Temps écoulé !", pop_cashed: "✅ Encaissé !"
    },
    ja: {
      app_title: "アニメカード・レジェンド", app_subtitle: "限定レア収集 • オンライン対戦",
      start_play: "ゲーム開始", nav_arena: "アリーナ", nav_online: "オンライン", nav_shop: "ショップ", nav_cards: "所持カード", nav_codex: "限定図鑑",
      solo_shuffle: "🎴 6枚カード決闘", solo_trivia: "🧠 アニメクイズ", solo_pop: "🔥 人気対決",
      shuffle_title: "記憶決闘 (6枚)", shuffle_ready: "難易度を選択",
      diff_normal: "普通 (+2 💎)", diff_hard: "難しい (+3 💎)", diff_legend: "伝説 (+4 💎)",
      lbl_you: "あなた", lbl_opp: "相手", shuffle_hint: "位置を記憶せよ！", btn_start_duel: "⚡ 決闘開始",
      trivia_title: "アニメクイズ", lbl_streak: "連勝", tmode_img: "🖼️ 画像", tmode_sil: "🗡️ 武器・能力", tmode_lore: "📜 ストーリー",
      trivia_who: "このキャラは誰？", trivia_clue: "ヒントから当てよう！", trivia_lore: "この物語の主人公は？",
      btn_5050: "✂️ 1択削除 (50 🪙)", btn_skip: "⏭️ 次の問題", pop_title: "より人気のあるキャラは？",
      online_tab_arena: "⚔️ 1対1対戦", online_tab_challenges: "📩 挑戦状", online_tab_leaders: "🏆 ランキング",
      online_title: "リアルタイム6枚決闘", online_sub: "ルームコードで対戦しよう",
      lbl_duel_mode: "モード選択：", mode_safe_title: "安全マッチ", mode_safe_desc: "リスクなしで報酬獲得",
      mode_gems_title: "ジェム賭け戦", mode_gems_desc: "30 / 100 / 1000 💎",
      mode_card_title: "限定カード争奪戦", mode_card_desc: "希少カードを懸けた勝負",
      lbl_pick_stake: "賭けるレアカードを選択：", btn_create_room: "➕ ルーム作成",
      ph_room_code: "4桁コード", btn_join_room: "参加", lbl_room_code: "コード", btn_leave: "退出",
      consent_warn: "⚠️ 双方の同意が必要です", btn_agree: "✅ 同意", btn_cancel: "❌ キャンセル",
      ch_title: "📩 挑戦状", ch_desc: "届いた挑戦状が表示されます。", lead_title: "🏆 トップ20",
      shop_title: "🛒 ガチャショップ", shop_sub: "名作アニメの英雄を召喚！",
      inv_title: "所持カード", inv_unlimited: "∞ 無制限", ph_search_cards: "🔍 検索...",
      filter_all: "すべて", btn_load_more: "さらに表示 ⬇️", codex_title: "👑 伝説レア図鑑",
      codex_sub: "タップして詳細を確認", ph_search_rare: "🔍 検索...", btn_claim: "受け取る！",
      set_title: "⚙️ 設定", set_name: "名前：", btn_save: "保存", set_lang: "言語 :",
      set_bgm: "🎵 BGM", set_sfx: "🔔 効果音", set_uid: "ID", set_shield: "シールド", set_pool: "キャラ数",
      pack_N: "スターター", pack_N_desc: "基本召喚", pack_C: "冒険者", pack_C_desc: "定番ヒーロー",
      pack_R: "エリート", pack_R_desc: "精鋭キャラ", pack_SR: "隊長", pack_SR_desc: "強力キャラ",
      pack_SSR: "神話", pack_SSR_desc: "限定レアへの扉", pack_UR: "ウルトラ", pack_UR_desc: "レアハンター専用",
      pack_SP: "王族", pack_SP_desc: "最高峰の召喚",
      lbl_anime: "作品名", lbl_pop: "人気度", lbl_serial: "シリアル", lbl_bio: "📜 プロフィール",
      lbl_owners: "👑 所有者", lbl_free_slots: "在庫", lbl_unlimited_copy: "通常版",
      btn_challenge: "⚔️ 挑戦", btn_recycle: "♻️ 変換", btn_accept: "承諾", btn_reject: "拒否",
      msg_loading_bio: "翻訳中...", msg_no_cards: "カードがありません", msg_no_rares_stake: "レアカードがありません",
      msg_no_gold: "⚠️ ゴールド不足！", msg_no_gems: "⚠️ ジェム不足！", msg_shield_off: "未発動",
      msg_protected: "👑 保護カード", msg_waiting_opp: "待機中...", msg_your_turn: "🟢 あなたの番！",
      msg_opp_turn: "⏳ 相手の番...", msg_memorize: "👀 記憶せよ！", msg_shuffling: "🔀 シャッフル中...",
      msg_win: "🏆 勝利！", msg_lose: "敗北！", msg_saved: "✅ 保存しました！",
      dup_converted: "♻️ 重複！ゴールド:", codex_more: "🔄 さらに読み込む", codex_searching: "🔍 検索中...",
      pop_pick_bet: "賭け金を選択 (6秒 • 2倍)：", pop_low: "低", pop_mid: "中", pop_high: "高",
      pop_round: "ラウンド", pop_pot: "賞金", pop_risk: "難易度", pop_time: "⏱️ 時間",
      pop_cashout: "💰 獲得", pop_double: "🔥 2倍", pop_lost: "💥 没収！", pop_timeout: "⏰ 時間切れ！", pop_cashed: "✅ 獲得！"
    }
  };

  function t(key) {
    return (I18N[state.lang] && I18N[state.lang][key]) || I18N.ar[key] || key;
  }
  /* =========================================================
     5. حالة اللاعب والتخزين
  ========================================================= */
  const STORAGE_KEY = "monarch_anime_legends_v3";
  const CACHE_CHARS_KEY = "monarch_anilist_cache_v5";
  const CACHE_TRANS_KEY = "monarch_trans_cache_v3";
  const generateUid = () => "usr_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);

  let state = {
    uid: generateUid(),
    name: "البطل الملكي",
    lang: "ar",
    gold: 700,
    gems: 20,
    tickets: 0,
    trophies: 0,
    bgmEnabled: true,
    sfxEnabled: true,
    shieldUntil: 0,
    inventory: []
  };

  let characterCatalog = new Map();
  let limitedRegistry = {};
  let transCache = {};
  let codexPageCursor = 3;

  function loadCaches() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved && typeof saved === "object") {
        state = { ...state, ...saved };
        if (!Array.isArray(state.inventory)) state.inventory = [];
      }
      const cachedChars = JSON.parse(localStorage.getItem(CACHE_CHARS_KEY) || "[]");
      if (Array.isArray(cachedChars)) cachedChars.forEach((c) => registerCharacter(c, false));
      transCache = JSON.parse(localStorage.getItem(CACHE_TRANS_KEY) || "{}");
    } catch (_) {}

    let changed = false;
    state.inventory.forEach((c) => {
      const cat = characterCatalog.get(Number(c.charId));
      const fixedRarity = classifyStrictRarity({
        name: c.name,
        anime: c.anime || cat?.anime || "",
        bioEn: c.bioEn || cat?.bioEn || "",
        favorites: c.favorites || cat?.favorites || 0,
        genres: cat?.genres || []
      });
      if (c.rarity !== fixedRarity) {
        c.rarity = fixedRarity;
        if (!LIMITED_CAPS[fixedRarity]) {
          c.serial = null;
          c.maxCopies = null;
        } else {
          c.maxCopies = LIMITED_CAPS[fixedRarity];
          c.serial = c.serial || 1;
        }
        changed = true;
      }
    });
    if (changed) saveState();
  }

  function saveState() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
    syncPlayerToCloud();
  }

  function saveCharCache() {
    try {
      const arr = Array.from(characterCatalog.values());
      localStorage.setItem(CACHE_CHARS_KEY, JSON.stringify(arr));
      localStorage.setItem("monarch_anilist_cursor_v1", String(codexPageCursor));
    } catch (_) {
      try {
        const compact = Array.from(characterCatalog.values()).map((c) => ({
          ...c, bioEn: c.bioEn ? c.bioEn.slice(0, 120) : ""
        }));
        localStorage.setItem(CACHE_CHARS_KEY, JSON.stringify(compact));
      } catch (__) {}
    }
    const el = document.getElementById("settingsCatalogCount");
    if (el) el.textContent = characterCatalog.size;
  }

  /* =========================================================
     6. جلب الشخصيات من AniList
  ========================================================= */
  const ANILIST_ENDPOINT = "https://graphql.anilist.co";

  function cleanDescription(raw) {
    if (!raw) return "";
    return raw
      .replace(/~!([\s\S]*?)!~/g, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
      .replace(/[*_~`#>]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 420);
  }

  function makeFallbackSvg(name, rarity) {
    const safe = encodeURIComponent((name || "Hero").slice(0, 14));
    const r = encodeURIComponent(rarity || "R");
    return `data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' width='300' height='420'><defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'><stop offset='0%25' stop-color='%231b2345'/><stop offset='100%25' stop-color='%230b0f1e'/></linearGradient></defs><rect width='100%25' height='100%25' fill='url(%23g)'/><text x='50%25' y='46%25' fill='%23f5c542' font-size='42' font-weight='bold' text-anchor='middle'>${r}</text><text x='50%25' y='58%25' fill='%23ffffff' font-size='20' text-anchor='middle'>${safe}</text></svg>`;
  }

  function registerCharacter(raw, shouldSave = true) {
    const id = Number(raw.id);
    if (!id || !raw.image || raw.image.includes("default.jpg")) return null;
    const obj = {
      id,
      name: raw.name || "Anime Hero",
      nativeName: raw.nativeName || "",
      anime: raw.anime || "Anime Legend",
      genres: Array.isArray(raw.genres) ? raw.genres : [],
      favorites: Number(raw.favorites || raw.favourites || 0),
      image: raw.image,
      bioEn: raw.bioEn || `${raw.name || "Hero"} is a character from ${raw.anime || "anime"}.`
    };
    obj.rarity = classifyStrictRarity(obj);
    characterCatalog.set(id, obj);
    if (shouldSave) saveCharCache();
    return obj;
  }

  let isFetchingAniList = false;
  async function fetchAniListPage(page, searchQuery = "") {
    const query = `
      query ($page: Int, $search: String) {
        Page(page: $page, perPage: 45) {
          characters(sort: FAVOURITES_DESC, search: $search) {
            id
            name { full native }
            image { large }
            description(asHtml: false)
            favourites
            media(sort: POPULARITY_DESC, perPage: 1) {
              nodes { title { romaji english } genres }
            }
          }
        }
      }
    `;
    const variables = { page };
    if (searchQuery && searchQuery.trim()) variables.search = searchQuery.trim();

    const res = await fetch(ANILIST_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ query, variables })
    });
    if (!res.ok) return 0;
    const json = await res.json();
    const list = json?.data?.Page?.characters || [];
    let added = 0;
    list.forEach((item) => {
      const img = item.image?.large || "";
      if (!img || img.includes("default.jpg")) return;
      const node = item.media?.nodes?.[0];
      const animeTitle = node?.title?.english || node?.title?.romaji || "Anime Legend";
      const saved = registerCharacter({
        id: item.id,
        name: item.name?.full,
        nativeName: item.name?.native || "",
        anime: animeTitle,
        genres: node?.genres || [],
        favorites: item.favourites || 0,
        image: img,
        bioEn: cleanDescription(item.description) || `${item.name?.full} from ${animeTitle}.`
      }, false);
      if (saved) added++;
    });
    if (added > 0) saveCharCache();
    return added;
  }

  async function ensureRichCatalog() {
    if (isFetchingAniList || !navigator.onLine) return;
    isFetchingAniList = true;
    try {
      const savedC = Number(localStorage.getItem("monarch_anilist_cursor_v1")) || 1;
      const nextP = Math.max(codexPageCursor, savedC, Math.floor(characterCatalog.size / 45) + 1);
      const pages = characterCatalog.size < 80 ? [1, 2, 12] : [nextP, nextP + 1];
      for (const p of pages) {
        await fetchAniListPage(p);
        codexPageCursor = Math.max(codexPageCursor, p + 1);
        localStorage.setItem("monarch_anilist_cursor_v1", String(codexPageCursor));
      }
      saveCharCache();
      initStartScreenBackground();
      updateHud();
      renderCodex();
    } catch (_) {} finally {
      isFetchingAniList = false;
    }
  }

  /* =========================================================
     7. الترجمة الفورية والتلميحات
  ========================================================= */
  const INSTANT_BIO_DICT = {
    "satoru gojo": { ar: "أقوى ساحر جوجوتسو في عصره، يمتلك عيني الستة وتقنية اللامحدود وتوسع نطاق الفراغ اللامتناهي." },
    "satoru gojou": { ar: "أقوى ساحر جوجوتسو في عصره، يمتلك عيني الستة وتقنية اللامحدود وتوسع نطاق الفراغ اللامتناهي." },
    "ryomen sukuna": { ar: "ملك اللعنات الأسطوري، يُعرف بقوته التدميرية الهائلة ومهارته القتالية المطلقة." },
    "sung jin-woo": { ar: "ملك الظلال الذي ارتقى من أضعف صياد إلى قوة لا تُقهر قادر على إحياء جيش من الظلال." },
    "jin-u seong": { ar: "ملك الظلال الذي ارتقى من أضعف صياد إلى قوة لا تُقهر قادر على إحياء جيش من الظلال." },
    "son goku": { ar: "مقاتل سايان نشأ على الأرض ويعشق تحدي الأقوى باستمرار حتى وصوله للغريزة الفائقة." },
    "monkey d. luffy": { ar: "قبطان قراصنة قبعة القش الساعي ليصبح ملك القراصنة بقدرة فاكهة المطاط." },
    "luffy monkey": { ar: "قبطان قراصنة قبعة القش الساعي ليصبح ملك القراصنة بقدرة فاكهة المطاط." }
  };

  async function getTranslatedText(cacheKey, textEn) {
    const lang = state.lang || "ar";
    if (lang === "en" || !textEn) return textEn;
    const fullKey = `${cacheKey}_${lang}`;
    if (transCache[fullKey]) return transCache[fullKey];
    if (!navigator.onLine) return textEn;
    try {
      const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(textEn.slice(0, 380))}&langpair=en|${lang}`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        const tr = data?.responseData?.translatedText;
        if (tr && !tr.toUpperCase().includes("MYMEMORY WARNING")) {
          transCache[fullKey] = tr;
          try { localStorage.setItem(CACHE_TRANS_KEY, JSON.stringify(transCache)); } catch (_) {}
          return tr;
        }
      }
    } catch (_) {}
    return textEn;
  }

  function getTranslatedBio(charObj) {
    const lang = state.lang || "ar";
    const keyName = String(charObj?.name || "").toLowerCase().trim();
    if (lang !== "en" && INSTANT_BIO_DICT[keyName]?.[lang]) {
      return Promise.resolve(INSTANT_BIO_DICT[keyName][lang]);
    }
    return Promise.race([
      getTranslatedText(`bio_${charObj.id}`, charObj.bioEn || `${charObj.name} from ${charObj.anime}.`),
      new Promise((resolve) => setTimeout(() => resolve(charObj.bioEn || `${charObj.name} — ${charObj.anime}`), 2500))
    ]);
  }

  const ICONIC_CLUES = [
    { re: /gojo/i, icon: "🤞", clueEn: "Blindfold, Six Eyes, Limitless & Unlimited Void" },
    { re: /sukuna/i, icon: "🔥", clueEn: "King of Curses, 20 Cursed Fingers & Malevolent Shrine" },
    { re: /luffy/i, icon: "👒", clueEn: "Straw Hat, Gum-Gum Fruit & Gear 5" },
    { re: /zoro/i, icon: "⚔️", clueEn: "Three-Sword Style (Santoryu), Enma & Green Hair" },
    { re: /goku/i, icon: "🟠", clueEn: "Power Pole, Kamehameha & Ultra Instinct" },
    { re: /naruto/i, icon: "🍥", clueEn: "Nine-Tails Fox (Kurama), Rasengan & Shadow Clones" },
    { re: /levi/i, icon: "🗡️", clueEn: "ODM Gear, Dual Blades & Humanity's Strongest Soldier" },
    { re: /jin-?woo|jin-u/i, icon: "🌑", clueEn: "Twin Daggers, 'Arise' Command & Shadow Monarch Army" },
    { re: /saitama/i, icon: "🥊", clueEn: "Yellow Suit, Red Gloves & One Punch" },
    { re: /light yagami/i, icon: "📓", clueEn: "Black Notebook that kills anyone whose name is written in it" }
  ];

  function buildDynamicClueEn(ch) {
    const iconic = ICONIC_CLUES.find((x) => x.re.test(ch.name || ""));
    if (iconic) return { icon: iconic.icon, textEn: iconic.clueEn };
    const bio = ch.bioEn || "";
    const firstWord = (ch.name || "").split(" ")[0];
    const sentences = bio.split(/(?<=[.!?])\s+/).filter((s) => s.length > 20);
    const chosen = sentences[0] || `A notable character from ${ch.anime}.`;
    const masked = firstWord.length > 2
      ? chosen.replace(new RegExp(firstWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "???")
      : chosen;
    return { icon: "✨", textEn: masked.slice(0, 170) };
  }

  /* =========================================================
     8. الصوت، الإشعارات، اللغات، ومزامنة الملاك الموحدة
  ========================================================= */
  let toastTimer = null;
  function showToast(msg) {
    const el = document.getElementById("toastBanner");
    if (!el) return;
    el.textContent = msg;
    el.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("show"), 2600);
  }

  function playSfx(type = "click") {
    if (!state.sfxEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain); gain.connect(ctx.destination);
      const now = ctx.currentTime;
      if (type === "win") {
        osc.frequency.setValueAtTime(520, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.22);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.start(now); osc.stop(now + 0.25);
      } else if (type === "summon") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(340, now);
        osc.frequency.exponentialRampToValueAtTime(780, now + 0.35);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);
        osc.start(now); osc.stop(now + 0.38);
      } else {
        osc.frequency.setValueAtTime(440, now);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc.start(now); osc.stop(now + 0.08);
      }
    } catch (_) {}
  }

  function updateBgmPlayback() {
    const audio = document.getElementById("bgmAudio");
    const btn = document.getElementById("btnAudioToggle");
    if (btn) btn.textContent = state.bgmEnabled ? "🔊" : "🔇";
    if (!audio) return;
    if (state.bgmEnabled) { audio.volume = 0.35; audio.play().catch(() => {}); }
    else audio.pause();
  }

  function applyLanguage(lang) {
    state.lang = I18N[lang] ? lang : "ar";
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";
    document.querySelectorAll("[data-i18n]").forEach((el) => { el.textContent = t(el.getAttribute("data-i18n")); });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => { el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder"))); });
    document.querySelectorAll(".lang-chip").forEach((btn) => { btn.classList.toggle("active", btn.dataset.lang === state.lang); });
    saveState(); updateHud(); renderShop(); renderInventory(false); renderCodex(); populateMyStakeCardsRow();
    if (currentTriviaAnswer) refreshTriviaView();
  }

  function isValidOwner(ow) {
    return Boolean(ow && typeof ow === "object" && ow.uid && typeof ow.name === "string" && ow.name.trim() && ow.name.trim().toLowerCase() !== "undefined");
  }

  function getCleanOwnersForChar(cid, maxCopies) {
    const map = new Map();
    const remote = limitedRegistry[cid]?.owners || {};
    Object.entries(remote).forEach(([slot, ow]) => {
      if (isValidOwner(ow) && Number(slot) >= 1 && Number(slot) <= maxCopies) {
        map.set(String(slot), ow);
      }
    });
    state.inventory.forEach((c) => {
      if (Number(c.charId) === Number(cid) && LIMITED_CAPS[c.rarity]) {
        const already = Array.from(map.values()).some((o) => o.uid === state.uid);
        if (!already) {
          let s = Number(c.serial) || 1;
          while (map.has(String(s)) && s < maxCopies) s++;
          c.serial = s;
          c.maxCopies = maxCopies;
          map.set(String(s), { uid: state.uid, name: state.name, claimedAt: c.acquiredAt || Date.now(), lastActiveAt: Date.now() });
        }
      }
    });
    return map;
  }

  async function syncPlayerToCloud() {
    if (!db || !navigator.onLine) return;
    const now = Date.now();
    db.ref(`players/${state.uid}`).update({
      uid: state.uid, name: state.name, trophies: state.trophies,
      rareCount: state.inventory.filter((c) => LIMITED_CAPS[c.rarity]).length,
      shieldUntil: state.shieldUntil || 0, lastActive: now
    }).catch(() => {});

    for (const card of state.inventory) {
      const max = LIMITED_CAPS[card.rarity];
      if (!max || !card.charId) continue;
      const slot = card.serial || 1;
      db.ref(`limitedCards/${card.charId}/owners/${slot}`).set({
        uid: state.uid, name: state.name, claimedAt: card.acquiredAt || now, lastActiveAt: now
      }).catch(() => {});
    }
  }

  function initFirebaseListeners() {
    if (!db) return;
    db.ref("limitedCards").on("value", (snap) => {
      limitedRegistry = snap.val() || {};
      renderCodex();
    });
    db.ref(`challenges/${state.uid}`).on("value", (snap) => {
      const list = Object.values(snap.val() || {}).filter((c) => c.status === "pending");
      const badge = document.getElementById("incomingBadge");
      const dot = document.getElementById("navOnlineDot");
      if (badge) { badge.textContent = list.length; badge.classList.toggle("hidden", list.length === 0); }
      if (dot) dot.classList.toggle("hidden", list.length === 0);
      renderIncomingChallenges(list);
    });
    db.ref("players").orderByChild("trophies").limitToLast(20).on("value", (snap) => {
      const players = [];
      snap.forEach((child) => players.push(child.val()));
      players.sort((a, b) => (b.trophies || 0) - (a.trophies || 0));
      renderLeaderboard(players);
    });
  }
  /* =========================================================
     9. الشريط العلوي، المخزون، وملف البطاقة
  ========================================================= */
  let invRenderLimit = 30;
  let invFilterRarity = "ALL";
  let invSearchQuery = "";

  function updateHud() {
    const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    setTxt("hudPlayerName", state.name);
    setTxt("startPlayerName", state.name);
    setTxt("hudTrophies", state.trophies);
    setTxt("goldCount", state.gold);
    setTxt("gemCount", state.gems);
    setTxt("ticketCount", state.tickets);
    setTxt("invTotalCount", state.inventory.length);
    setTxt("settingsUid", state.uid);
    setTxt("settingsCatalogCount", characterCatalog.size);
    const inp = document.getElementById("inputPlayerName");
    if (inp) inp.value = state.name;
    document.getElementById("netDot")?.classList.toggle("offline", !navigator.onLine);
    const shieldActive = state.shieldUntil && state.shieldUntil > Date.now();
    setTxt("settingsShield", shieldActive ? `${Math.ceil((state.shieldUntil - Date.now()) / 3600000)}h` : t("msg_shield_off"));
  }

  function renderInventory(resetLimit = false) {
    if (resetLimit) invRenderLimit = 30;
    const grid = document.getElementById("invGrid");
    const loadMoreBox = document.getElementById("invLoadMoreBox");
    if (!grid) return;

    const sorted = [...state.inventory].sort((a, b) => (RANK_POWER[b.rarity] || 0) - (RANK_POWER[a.rarity] || 0));
    const filtered = sorted.filter((c) => {
      const matchR = invFilterRarity === "ALL" || c.rarity === invFilterRarity;
      const q = invSearchQuery.trim().toLowerCase();
      return matchR && (!q || c.name.toLowerCase().includes(q) || (c.anime || "").toLowerCase().includes(q));
    });

    const slice = filtered.slice(0, invRenderLimit);
    grid.innerHTML = "";
    if (slice.length === 0) {
      grid.innerHTML = `<p class="muted-text" style="grid-column:1/-1;text-align:center;padding:24px;">${t("msg_no_cards")}</p>`;
      loadMoreBox?.classList.add("hidden");
      return;
    }

    slice.forEach((card) => {
      const div = document.createElement("div");
      div.className = "inv-card";
      const serialHtml = card.serial ? `<span class="serial-tag">#${card.serial}/${card.maxCopies}</span>` : "";
      const fallback = makeFallbackSvg(card.name, card.rarity);
      div.innerHTML = `
        <img src="${card.image}" alt="${card.name}" loading="lazy" onerror="this.onerror=null;this.src='${fallback}'" />
        <div class="inv-card-top">
          <span class="card-rarity-pill r-${card.rarity}">${card.rarity}</span>
          ${serialHtml}
        </div>
        <div class="inv-card-name">${card.name}</div>
      `;
      div.addEventListener("click", () => openCardDossierModal(card, true));
      grid.appendChild(div);
    });
    loadMoreBox?.classList.toggle("hidden", filtered.length <= invRenderLimit);
  }

  async function openCardDossierModal(cardOrChar, isOwnedCard = false) {
    const modal = document.getElementById("cardModal");
    const body = document.getElementById("cardModalBody");
    const cid = Number(cardOrChar.charId || cardOrChar.id);
    const catalogChar = characterCatalog.get(cid) || cardOrChar;
    const rarity = catalogChar.rarity || cardOrChar.rarity || "R";
    const isLimited = Boolean(LIMITED_CAPS[rarity]);
    const maxCopies = LIMITED_CAPS[rarity] || null;
    const fallback = makeFallbackSvg(catalogChar.name, rarity);

    document.getElementById("cardModalTitle").textContent = catalogChar.name;
    const serialDisplay = cardOrChar.serial ? `#${cardOrChar.serial}/${maxCopies}` : isLimited ? `${maxCopies}/${maxCopies}` : t("lbl_unlimited_copy");

    let ownersSectionHtml = "";
    if (isLimited) {
      const ownersMap = getCleanOwnersForChar(cid, maxCopies);
      const freeCount = Math.max(0, maxCopies - ownersMap.size);
      let rowsHtml = `<div class="dossier-owner-row"><span>🛒 ${t("lbl_free_slots")}</span><b dir="ltr" style="color:${freeCount > 0 ? "#4ade80" : "#fb7185"};">${freeCount} / ${maxCopies}</b></div>`;
      ownersMap.forEach((ow, slot) => {
        const isMe = ow.uid === state.uid;
        const btnHtml = !isMe
          ? `<button class="danger-btn-sm btn-dossier-ch" data-cid="${cid}" data-slot="${slot}" data-ouid="${ow.uid}" data-oname="${ow.name}">${t("btn_challenge")}</button>`
          : `<span class="status-badge">👑 ${t("lbl_you")}</span>`;
        rowsHtml += `
          <div class="dossier-owner-row">
            <span>${isMe ? "👑 " + ow.name : "👤 " + ow.name} <small dir="ltr" style="color:var(--gold);">#${slot}/${maxCopies}</small></span>
            ${btnHtml}
          </div>`;
      });
      ownersSectionHtml = `<div class="field-label" style="margin-top:8px;">${t("lbl_owners")}</div><div class="dossier-owners-section">${rowsHtml}</div>`;
    }

    let footerActionHtml = "";
    if (isOwnedCard && !isLimited) {
      const sellVal = (RANK_POWER[rarity] || 1) * 18;
      footerActionHtml = `<button id="btnRecycleCard" class="secondary-btn full-w" style="margin-top:12px;">${t("btn_recycle")} ${sellVal} 🪙</button>`;
    } else if (isOwnedCard && isLimited) {
      footerActionHtml = `<p class="status-badge" style="display:block;text-align:center;margin-top:12px;">${t("msg_protected")}</p>`;
    }

    body.innerHTML = `
      <div class="dossier-hero">
        <img class="dossier-poster" src="${catalogChar.image}" alt="${catalogChar.name}" onerror="this.onerror=null;this.src='${fallback}'" />
        <div class="dossier-side">
          <span class="card-rarity-pill r-${rarity}" style="margin:0;">${rarity}</span>
          ${catalogChar.nativeName ? `<div class="dossier-native">${catalogChar.nativeName}</div>` : ""}
          <div class="muted-text"><b>${t("lbl_anime")}:</b> ${catalogChar.anime || "Anime Legend"}</div>
          <div class="dossier-stat-row">
            <div class="dossier-stat-box">${t("lbl_pop")}<b>❤️ ${(catalogChar.favorites || 0).toLocaleString()}</b></div>
            <div class="dossier-stat-box">${t("lbl_serial")}<b>${serialDisplay}</b></div>
          </div>
        </div>
      </div>
      <div class="field-label">${t("lbl_bio")}</div>
      <div id="dossierBioText" class="dossier-lore-box">${t("msg_loading_bio")}</div>
      ${ownersSectionHtml}
      ${footerActionHtml}
    `;

    body.querySelectorAll(".btn-dossier-ch").forEach((btn) => {
      btn.addEventListener("click", () => {
        sendDirectChallenge(Number(btn.dataset.cid), Number(btn.dataset.slot), btn.dataset.ouid, btn.dataset.oname);
        modal.classList.add("hidden");
      });
    });

    document.getElementById("btnRecycleCard")?.addEventListener("click", () => {
      const idx = state.inventory.findIndex((x) => x.uidCard === cardOrChar.uidCard);
      if (idx !== -1) {
        const sellVal = (RANK_POWER[rarity] || 1) * 18;
        state.inventory.splice(idx, 1);
        state.gold += sellVal;
        saveState(); updateHud(); renderInventory(false);
        modal.classList.add("hidden");
        showToast(`+${sellVal} 🪙`);
      }
    });

    modal.classList.remove("hidden");
    const translatedBio = await getTranslatedBio(catalogChar);
    const bioEl = document.getElementById("dossierBioText");
    if (bioEl) bioEl.textContent = translatedBio;
  }

  /* =========================================================
     10. المتجر (الحزم العادية + الحزم الخرافية SSR / UR / SP)
  ========================================================= */
  function rollRarity(rates) {
    const entries = Object.entries(rates);
    let rand = Math.random() * entries.reduce((s, [, w]) => s + w, 0);
    for (const [r, w] of entries) { rand -= w; if (rand <= 0) return r; }
    return entries[0][0];
  }

  function openMythicPack(pack) {
    if (state.gems < pack.gems) return showToast(`⚠️ تحتاج ${pack.gems} 💎`);
    const allChars = Array.from(characterCatalog.values());
    let pool = allChars.filter((c) => c.rarity === pack.rarity);
    if (!pool.length) pool = allChars;
    if (!pool.length) return showToast("⏳ Loading heroes...");

    const chosen = pool[Math.floor(Math.random() * pool.length)];
    const maxCopies = LIMITED_CAPS[pack.rarity] || 10;
    const ownersMap = getCleanOwnersForChar(chosen.id, maxCopies);
    let freeSlot = 1;
    for (let s = 1; s <= maxCopies; s++) { if (!ownersMap.has(String(s))) { freeSlot = s; break; } }

    const newCard = {
      uidCard: "c_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      charId: chosen.id, name: chosen.name, nativeName: chosen.nativeName || "",
      anime: chosen.anime, image: chosen.image, bioEn: chosen.bioEn || "",
      favorites: chosen.favorites || 0, rarity: pack.rarity,
      serial: freeSlot, maxCopies, acquiredAt: Date.now()
    };

    state.gems -= pack.gems;
    state.gold += pack.goldReward;
    state.inventory.push(newCard);
    saveState(); updateHud(); renderInventory(true); renderCodex();
    playSfx("summon");

    const overlay = document.createElement("div");
    overlay.id = "mythicOpenOverlay";
    overlay.innerHTML = `<div class="pack-shaking">🎁</div><h2 style="color:#fff;margin-top:16px;">جاري فتح ${pack.title}...</h2>`;
    document.body.appendChild(overlay);

    setTimeout(() => {
      overlay.innerHTML = `
        <div style="max-width:300px;width:100%;background:#0f172a;border-radius:18px;padding:18px;border:2px solid #f59e0b;box-shadow:0 0 35px rgba(245,158,11,0.5);">
          <span class="mythic-badge" style="background:#f59e0b;margin-bottom:10px;">${pack.rarity} #${freeSlot}/${maxCopies}</span>
          <img src="${newCard.image}" alt="${newCard.name}" style="width:100%;height:240px;object-fit:cover;border-radius:12px;margin-bottom:10px;" />
          <h3 style="color:#fff;margin:6px 0;">${newCard.name}</h3>
          <p style="color:#fbbf24;font-weight:bold;font-size:16px;margin:8px 0;">+${pack.goldReward.toLocaleString()} 🪙 ذهب!</p>
          <button id="btnCloseMythicOverlay" class="primary-btn" style="width:100%;margin-top:10px;">${t("btn_claim")}</button>
        </div>
      `;
      document.getElementById("btnCloseMythicOverlay")?.addEventListener("click", () => overlay.remove());
    }, 1400);
  }

  function renderShop() {
    const grid = document.getElementById("shopPacksGrid");
    if (!grid) return;
    grid.innerHTML = "";

    SHOP_PACKS.forEach((pack) => {
      const card = document.createElement("div");
      card.className = "pack-card";
      card.innerHTML = `
        <div class="pack-info">
          <h3><span class="card-rarity-pill r-${pack.rarity}" style="margin:0;">${pack.rarity}</span> ${t(pack.id)}</h3>
          <div class="pack-desc">${t(pack.id + "_desc")}</div>
        </div>
        <div class="pack-btns">
          ${pack.gold > 0 ? `<button class="buy-btn gold" data-pack="${pack.id}" data-curr="gold">${pack.gold} 🪙</button>` : ""}
          ${pack.gem > 0 ? `<button class="buy-btn gem" data-pack="${pack.id}" data-curr="gem">${pack.gem} 💎</button>` : ""}
        </div>
      `;
      grid.appendChild(card);
    });

    grid.querySelectorAll(".buy-btn").forEach((btn) => {
      btn.addEventListener("click", () => handlePackPurchase(btn.dataset.pack, btn.dataset.curr));
    });

    MYTHIC_PACKS.forEach((pack) => {
      const card = document.createElement("div");
      card.className = `mythic-pack-card ${pack.cls}`;
      card.innerHTML = `
        <div>
          <span class="mythic-badge">${pack.rarity} مضمون</span>
          <h3 style="color:#fff;margin:8px 0 4px;">${pack.title}</h3>
          <p style="color:#cbd5e1;font-size:13px;margin:0;">${pack.desc}</p>
        </div>
        <button type="button" class="primary-btn" style="width:100%;margin-top:8px;">شراء بـ ${pack.gems.toLocaleString()} 💎</button>
      `;
      card.querySelector("button").addEventListener("click", () => openMythicPack(pack));
      grid.appendChild(card);
    });
  }

  async function handlePackPurchase(packId, currency) {
    const pack = SHOP_PACKS.find((p) => p.id === packId);
    if (!pack) return;
    if (characterCatalog.size < 25) await ensureRichCatalog();
    if (currency === "gold") {
      if (state.gold < pack.gold) return showToast(t("msg_no_gold"));
      state.gold -= pack.gold;
    } else {
      if (state.gems < pack.gem) return showToast(t("msg_no_gems"));
      state.gems -= pack.gem;
    }

    const rolledRarity = rollRarity(pack.rates);
    const allChars = Array.from(characterCatalog.values());
    let pool = allChars.filter((c) => c.rarity === rolledRarity);
    if (!pool.length) pool = allChars.filter((c) => !LIMITED_CAPS[c.rarity]);
    if (!pool.length) return showToast("⏳ Loading heroes...");

    const chosen = pool[Math.floor(Math.random() * pool.length)];
    if (state.inventory.some((c) => Number(c.charId) === Number(chosen.id))) {
      const dupGold = DUP_GOLD_REWARD[chosen.rarity] || 40;
      state.gold += dupGold;
      saveState(); updateHud(); playSfx("win");
      showSummonReveal({ ...chosen, serial: null }, `${t("dup_converted")} +${dupGold} 🪙`);
      return;
    }

    const maxCopies = LIMITED_CAPS[chosen.rarity] || null;
    let serial = null;
    if (maxCopies) {
      const owners = getCleanOwnersForChar(chosen.id, maxCopies);
      for (let s = 1; s <= maxCopies; s++) { if (!owners.has(String(s))) { serial = s; break; } }
      if (!serial) {
        state.tickets += 1; state.gems += 5;
        saveState(); updateHud(); return showToast("🎟️ +1 | 💎 +5");
      }
    }

    const newCard = {
      uidCard: "c_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      charId: chosen.id, name: chosen.name, nativeName: chosen.nativeName || "",
      anime: chosen.anime, image: chosen.image, bioEn: chosen.bioEn || "",
      favorites: chosen.favorites || 0, rarity: chosen.rarity,
      serial, maxCopies, acquiredAt: Date.now()
    };

    state.inventory.push(newCard);
    saveState(); updateHud(); renderInventory(true); renderCodex();
    showSummonReveal(newCard, serial ? `👑 #${serial}/${maxCopies}` : chosen.anime);
  }

  function showSummonReveal(card, noteText) {
    playSfx("summon");
    const modal = document.getElementById("summonModal");
    const stage = document.getElementById("summonCardStage");
    const fallback = makeFallbackSvg(card.name, card.rarity);
    document.getElementById("summonHeadline").textContent = `✨ ${card.rarity} — ${card.name}`;
    document.getElementById("summonNote").textContent = noteText;
    const serialHtml = card.serial ? `<span class="serial-tag">#${card.serial}/${card.maxCopies}</span>` : "";
    stage.innerHTML = `
      <img src="${card.image}" alt="${card.name}" onerror="this.onerror=null;this.src='${fallback}'" />
      <div class="inv-card-top"><span class="card-rarity-pill r-${card.rarity}">${card.rarity}</span>${serialHtml}</div>
      <div class="inv-card-name">${card.name}</div>
    `;
    modal.classList.remove("hidden");
  }

  /* =========================================================
     11. سجل النوادر، التحديات، ولوحة المتصدرين
  ========================================================= */
  let codexFilter = "ALL";
  let codexSearch = "";

  function renderCodex() {
    const grid = document.getElementById("codexGrid");
    const counterEl = document.getElementById("codexDiscoveredCount");
    if (!grid) return;

    const allLegends = Array.from(characterCatalog.values())
      .filter((ch) => ch && LIMITED_CAPS[ch.rarity])
      .sort((a, b) => (RANK_POWER[b.rarity] - RANK_POWER[a.rarity]) || ((b.favorites || 0) - (a.favorites || 0)));

    if (counterEl) counterEl.textContent = allLegends.length;
    const q = (codexSearch || "").trim().toLowerCase();
    const filtered = allLegends.filter((c) => (codexFilter === "ALL" || c.rarity === codexFilter) && (!q || c.name.toLowerCase().includes(q) || (c.anime || "").toLowerCase().includes(q)));

    grid.innerHTML = "";
    filtered.forEach((ch) => {
      const max = LIMITED_CAPS[ch.rarity];
      const owners = getCleanOwnersForChar(ch.id, max);
      const freeCount = Math.max(0, max - owners.size);
      const fallback = makeFallbackSvg(ch.name, ch.rarity);
      const card = document.createElement("div");
      card.className = `codex-card tier-${ch.rarity}`;
      card.innerHTML = `
        <img class="codex-card-img" src="${ch.image}" alt="${ch.name}" loading="lazy" onerror="this.onerror=null;this.src='${fallback}'" />
        <div class="inv-card-top">
          <span class="card-rarity-pill r-${ch.rarity}">${ch.rarity}</span>
          <span class="serial-tag">${freeCount}/${max}</span>
        </div>
        <div class="codex-card-body">
          <h4>${ch.name}</h4>
          <div class="anime-sub">${ch.anime || "Anime Legend"}</div>
          <div class="codex-card-foot">
            <span style="color:${freeCount > 0 ? "#4ade80" : "#fb7185"};">${t("lbl_free_slots")}: ${freeCount}/${max}</span>
            <span style="color:var(--gold);">ℹ️</span>
          </div>
        </div>
      `;
      card.addEventListener("click", () => openCardDossierModal(ch, false));
      grid.appendChild(card);
    });

    const moreWrap = document.createElement("div");
    moreWrap.className = "codex-load-more";
    moreWrap.innerHTML = `<button id="btnCodexMoreLive" class="secondary-btn full-w">${t("codex_more")}</button>`;
    grid.appendChild(moreWrap);
    document.getElementById("btnCodexMoreLive")?.addEventListener("click", async (e) => {
      e.target.disabled = true; e.target.textContent = t("codex_searching");
      await fetchAniListPage(codexPageCursor++);
      renderCodex();
    });
  }

  async function sendDirectChallenge(charId, slot, targetUid, targetName) {
    if (!db || !navigator.onLine) return showToast("⚠️ Offline!");
    const ch = characterCatalog.get(charId);
    if (!ch) return;
    const roomCode = String(Math.floor(1000 + Math.random() * 9000));
    const challengeId = "ch_" + Date.now();
    await db.ref(`challenges/${targetUid}/${challengeId}`).set({
      id: challengeId, fromUid: state.uid, fromName: state.name,
      charId, charName: ch.name, rarity: ch.rarity, slot, roomCode,
      status: "pending", createdAt: Date.now()
    });
    showToast(`📩 ${ch.name} → ${targetName} (${roomCode})`);
  }

  function renderIncomingChallenges(list) {
    const box = document.getElementById("challengesList");
    if (!box) return;
    if (!list.length) { box.innerHTML = `<p class="muted-text" style="text-align:center;padding:16px;">---</p>`; return; }
    box.innerHTML = "";
    list.forEach((ch) => {
      const div = document.createElement("div");
      div.className = "codex-item";
      div.innerHTML = `
        <div class="codex-meta"><h4>⚔️ ${ch.fromName}</h4><p class="muted-text"><b>${ch.charName} (${ch.rarity} #${ch.slot})</b></p></div>
        <div class="row-gap">
          <button class="primary-btn btn-accept-ch" data-id="${ch.id}" data-room="${ch.roomCode}">${t("btn_accept")}</button>
          <button class="danger-btn-sm btn-reject-ch" data-id="${ch.id}">${t("btn_reject")}</button>
        </div>
      `;
      box.appendChild(div);
    });
    box.querySelectorAll(".btn-accept-ch").forEach((btn) => {
      btn.addEventListener("click", async () => {
        if (db) await db.ref(`challenges/${state.uid}/${btn.dataset.id}/status`).set("accepted");
        document.getElementById("inputRoomCode").value = btn.dataset.room;
        switchOnlineSubTab("lobby");
        joinOnlineRoom(btn.dataset.room);
      });
    });
    box.querySelectorAll(".btn-reject-ch").forEach((btn) => {
      btn.addEventListener("click", async () => { if (db) await db.ref(`challenges/${state.uid}/${btn.dataset.id}`).remove(); });
    });
  }

  function renderLeaderboard(players) {
    const box = document.getElementById("leaderboardList");
    if (!box) return;
    if (!players.length) { box.innerHTML = `<p class="muted-text" style="text-align:center;padding:16px;">---</p>`; return; }
    box.innerHTML = players.map((p, idx) => `
      <div class="codex-item">
        <b style="font-size:1.1rem;color:var(--gold);width:28px;">#${idx + 1}</b>
        <div class="codex-meta"><h4>${p.uid === state.uid ? "👑 " + p.name : p.name}</h4><p class="muted-text">👑 ${p.rareCount || 0}</p></div>
        <span class="status-badge">🏆 ${p.trophies || 0}</span>
      </div>
    `).join("");
  }
  /* =========================================================
     12. الأوضاع الفردية: 6 بطاقات + الألغاز + الشعبية
  ========================================================= */
  let soloDiff = "normal";
  let soloState = { active: false, phase: "idle", cards: [], picked: [], turn: "player" };
  let soloRunId = 0;

  function pickSixUniqueRarityCards() {
    const all = Array.from(characterCatalog.values());
    const rarities = ["N", "C", "R", "SR", "SSR", "UR", "SP"].sort(() => Math.random() - 0.5);
    const chosen = [];
    for (const r of rarities) {
      if (chosen.length === 6) break;
      const bucket = all.filter((c) => c.rarity === r);
      if (bucket.length) chosen.push(bucket[Math.floor(Math.random() * bucket.length)]);
    }
    return chosen.sort(() => Math.random() - 0.5);
  }

  async function animateRealCardSwap(idxA, idxB, durationMs) {
    const board = document.getElementById("soloBoard");
    const slots = board?.querySelectorAll(".duel-slot");
    const elA = slots?.[idxA], elB = slots?.[idxB];
    if (!elA || !elB) return;
    const rA = elA.getBoundingClientRect(), rB = elB.getBoundingClientRect();
    const dx = rB.left - rA.left, dy = rB.top - rA.top;

    elA.classList.add("moving-card"); elB.classList.add("moving-card");
    elA.style.transition = `transform ${durationMs}ms ease`;
    elB.style.transition = `transform ${durationMs}ms ease`;
    elA.style.transform = `translate(${dx}px, ${dy}px) scale(1.03)`;
    elB.style.transform = `translate(${-dx}px, ${-dy}px) scale(1.03)`;
    playSfx("click");
    await new Promise((r) => setTimeout(r, durationMs + 25));

    [soloState.cards[idxA], soloState.cards[idxB]] = [soloState.cards[idxB], soloState.cards[idxA]];
    elA.style.transition = "none"; elB.style.transition = "none";
    elA.style.transform = ""; elB.style.transform = "";
    elA.classList.remove("moving-card"); elB.classList.remove("moving-card");
  }

  async function startSoloShuffleDuel() {
    let sixCards = pickSixUniqueRarityCards();
    if (sixCards.length < 6) {
      await ensureRichCatalog();
      sixCards = pickSixUniqueRarityCards();
      if (sixCards.length < 6) return showToast("⏳ Loading heroes...");
    }
    const runId = ++soloRunId;
    soloState = { active: true, phase: "preview", cards: sixCards, picked: Array(6).fill(null), turn: "player" };
    const cfg = soloDiff === "legendary" ? { preview: 1900, swaps: 12, speed: 165 }
      : soloDiff === "hard" ? { preview: 2300, swaps: 8, speed: 260 }
      : { preview: 2800, swaps: 5, speed: 410 };

    document.getElementById("soloShuffleStatus").textContent = t("msg_memorize");
    renderSoloBoard(true);
    await new Promise((r) => setTimeout(r, cfg.preview));
    if (runId !== soloRunId) return;

    soloState.phase = "shuffling";
    document.getElementById("soloShuffleStatus").textContent = t("msg_shuffling");
    renderSoloBoard(false);
    await new Promise((r) => setTimeout(r, 240));
    for (let i = 0; i < cfg.swaps; i++) {
      if (runId !== soloRunId) return;
      const a = Math.floor(Math.random() * 6);
      let b = Math.floor(Math.random() * 6);
      while (b === a) b = Math.floor(Math.random() * 6);
      await animateRealCardSwap(a, b, cfg.speed);
    }
    if (runId !== soloRunId) return;
    soloState.phase = "picking"; soloState.turn = "player";
    document.getElementById("soloShuffleStatus").textContent = t("msg_your_turn");
    renderSoloBoard(false);
  }

  function renderSoloBoard(revealAll) {
    const board = document.getElementById("soloBoard");
    if (!board) return;
    board.innerHTML = "";
    document.getElementById("soloPlayerPicks").textContent = `${soloState.picked.filter((x) => x === "player").length}/3`;
    document.getElementById("soloBotPicks").textContent = `${soloState.picked.filter((x) => x === "bot").length}/3`;

    soloState.cards.forEach((card, idx) => {
      const owner = soloState.picked[idx];
      const showFace = revealAll || owner !== null || soloState.phase === "result";
      const slot = document.createElement("div");
      slot.className = "duel-slot";
      const borderCls = owner === "player" ? " picked-me" : owner === "bot" ? " picked-opp" : "";
      const fallback = makeFallbackSvg(card.name, card.rarity);
      slot.innerHTML = showFace
        ? `<div class="duel-card-inner${borderCls}"><img src="${card.image}" alt="${card.name}" onerror="this.onerror=null;this.src='${fallback}'" /><span class="card-rarity-pill r-${card.rarity}">${card.rarity}</span><div class="card-bottom-label">${card.name}</div></div>`
        : `<div class="duel-card-inner face-down"></div>`;
      slot.addEventListener("click", () => handleSoloCardClick(idx));
      board.appendChild(slot);
    });
  }

  function handleSoloCardClick(idx) {
    if (soloState.phase !== "picking" || soloState.turn !== "player" || soloState.picked[idx] !== null) return;
    playSfx("click");
    soloState.picked[idx] = "player";
    const myCount = soloState.picked.filter((x) => x === "player").length;
    const botCount = soloState.picked.filter((x) => x === "bot").length;
    renderSoloBoard(false);
    if (myCount + botCount === 6) return finishSoloShuffleDuel();
    if (myCount === 1 && botCount === 0) { soloState.turn = "bot"; botPickCards(2); }
    else if (myCount === 3 && botCount === 2) { soloState.turn = "bot"; botPickCards(1); }
  }

  function botPickCards(count) {
    document.getElementById("soloShuffleStatus").textContent = t("msg_opp_turn");
    let left = count;
    const step = () => {
      const free = soloState.picked.map((v, i) => (v === null ? i : -1)).filter((i) => i !== -1);
      if (!free.length || left <= 0) {
        if (soloState.picked.filter((x) => x !== null).length === 6) return finishSoloShuffleDuel();
        soloState.turn = "player";
        document.getElementById("soloShuffleStatus").textContent = t("msg_your_turn");
        return;
      }
      soloState.picked[free[Math.floor(Math.random() * free.length)]] = "bot";
      left--; renderSoloBoard(false); setTimeout(step, 420);
    };
    setTimeout(step, 420);
  }

  function finishSoloShuffleDuel() {
    soloState.phase = "result"; renderSoloBoard(true);
    let pScore = 0, bScore = 0;
    soloState.cards.forEach((c, i) => {
      const pwr = RANK_POWER[c.rarity] || 1;
      if (soloState.picked[i] === "player") pScore += pwr; else bScore += pwr;
    });
    const gemReward = soloDiff === "legendary" ? 4 : soloDiff === "hard" ? 3 : 2;
    const goldReward = soloDiff === "legendary" ? 350 : soloDiff === "hard" ? 220 : 150;
    if (pScore >= bScore) {
      state.gold += goldReward; state.gems += gemReward;
      saveState(); updateHud(); playSfx("win");
      document.getElementById("soloShuffleStatus").textContent = `${t("msg_win")} (${pScore} - ${bScore})`;
      showToast(`${t("msg_win")} +${goldReward} 🪙 | +${gemReward} 💎`);
    } else {
      document.getElementById("soloShuffleStatus").textContent = `${t("msg_lose")} (${pScore} - ${bScore})`;
      showToast(t("msg_lose"));
    }
  }

  /* --- ألغاز الأنمي (حذف إجابة واحدة بتكلفة 50 -> 100 -> 150 ذهب بدون حذف الصحيح أبداً) --- */
  let triviaMode = "image";
  let triviaStreak = 0;
  let currentTriviaAnswer = null;
  const HINT_COSTS = [50, 100, 150];
  let triviaHintCount = 0;

  function updateTriviaHintBtn() {
    const btn = document.getElementById("btnTrivia5050");
    if (!btn) return;
    if (triviaHintCount >= HINT_COSTS.length) {
      btn.disabled = true;
      btn.textContent = "✂️ تم حذف كل الأخطاء";
    } else {
      btn.disabled = false;
      btn.textContent = `✂️ حذف إجابة (${HINT_COSTS[triviaHintCount]} 🪙)`;
    }
  }

  async function refreshTriviaView() {
    if (!currentTriviaAnswer) return;
    const mediaBox = document.getElementById("triviaMediaBox");
    const promptEl = document.getElementById("triviaPrompt");
    if (triviaMode === "image") {
      promptEl.textContent = t("trivia_who");
      mediaBox.innerHTML = `<img id="triviaImg" src="${currentTriviaAnswer.image}" alt="Quiz" />`;
    } else if (triviaMode === "silhouette") {
      promptEl.textContent = t("trivia_clue");
      const clue = buildDynamicClueEn(currentTriviaAnswer);
      mediaBox.innerHTML = `
        <div class="clue-card-box">
          <div class="clue-emblem">${clue.icon}</div>
          <div class="clue-tags"><span class="clue-tag">🎬 ${currentTriviaAnswer.anime}</span><span class="clue-tag">⭐ ${currentTriviaAnswer.rarity}</span></div>
          <p id="clueTranslatedText" class="trivia-lore">${t("msg_loading_bio")}</p>
        </div>`;
      const trClue = await getTranslatedText(`clue_${currentTriviaAnswer.id}`, clue.textEn);
      const clueEl = document.getElementById("clueTranslatedText");
      if (clueEl) clueEl.textContent = `« ${trClue} »`;
    } else {
      promptEl.textContent = t("trivia_lore");
      mediaBox.innerHTML = `<p id="triviaLoreText" class="trivia-lore">${t("msg_loading_bio")}</p>`;
      const bio = await getTranslatedBio(currentTriviaAnswer);
      const first = (currentTriviaAnswer.name || "").split(" ")[0];
      const masked = first.length > 2 ? bio.replace(new RegExp(first.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "???") : bio;
      const loreEl = document.getElementById("triviaLoreText");
      if (loreEl) loreEl.textContent = `« ${masked} »`;
    }
  }

  async function loadNextTriviaQuestion() {
    const all = Array.from(characterCatalog.values());
    if (all.length < 4) return ensureRichCatalog();
    const choices = [...all].sort(() => Math.random() - 0.5).slice(0, 4);
    currentTriviaAnswer = choices[0];
    triviaHintCount = 0;
    updateTriviaHintBtn();

    const options = [...choices].sort(() => Math.random() - 0.5);
    const optBox = document.getElementById("triviaOptions");
    optBox.innerHTML = "";
    options.forEach((opt) => {
      const b = document.createElement("button");
      b.className = "opt-btn";
      b.textContent = opt.name;
      b.dataset.id = opt.id;
      b.addEventListener("click", () => handleTriviaAnswer(b, opt.id === currentTriviaAnswer.id));
      optBox.appendChild(b);
    });
    await refreshTriviaView();
  }

  function handleTriviaAnswer(btn, isCorrect) {
    document.querySelectorAll("#triviaOptions .opt-btn").forEach((b) => {
      b.disabled = true;
      if (Number(b.dataset.id) === currentTriviaAnswer.id) b.classList.add("correct");
    });
    if (isCorrect) {
      triviaStreak++; state.gold += 120;
      if (triviaStreak % 3 === 0) state.gems += 1;
      saveState(); updateHud(); playSfx("win");
      showToast("✅ +120 🪙" + (triviaStreak % 3 === 0 ? " | +1 💎" : ""));
    } else {
      btn.classList.add("wrong"); triviaStreak = 0;
      showToast(`❌ ${currentTriviaAnswer.name}`);
    }
    document.getElementById("triviaStreak").textContent = triviaStreak;
    setTimeout(loadNextTriviaQuestion, 1300);
  }

  /* --- تحدي الشعبية --- */
  let popBetState = { phase: "bet", baseBet: 0, pot: 0, round: 0, pair: [] };
  let popTimerInterval = null;

  function stopPopTimer() {
    if (popTimerInterval) { clearInterval(popTimerInterval); popTimerInterval = null; }
  }

  function startPopTimer() {
    stopPopTimer();
    const startedAt = Date.now();
    popTimerInterval = setInterval(() => {
      if (popBetState.phase !== "playing") return stopPopTimer();
      const left = Math.max(0, 6000 - (Date.now() - startedAt));
      const fill = document.getElementById("popTimerFill");
      const txt = document.getElementById("popTimerText");
      if (fill) { fill.style.width = (left / 6000) * 100 + "%"; fill.classList.toggle("danger", left <= 2000); }
      if (txt) txt.textContent = (left / 1000).toFixed(1) + "s";
      if (left <= 0) {
        stopPopTimer(); popBetState.phase = "lost";
        showToast(t("pop_timeout")); renderPopularityGame();
        setTimeout(() => { popBetState.phase = "bet"; renderPopularityGame(); }, 1600);
      }
    }, 100);
  }

  function pickDifficultyScaledPair(round) {
    const all = Array.from(characterCatalog.values()).filter((c) => Number(c.favorites) > 0);
    if (all.length < 2) return [];
    const sorted = [...all].sort((a, b) => b.favorites - a.favorites);
    const maxRatio = round <= 1 ? 4.5 : round === 2 ? 2.1 : 1.4;
    const minRatio = round <= 1 ? 1.7 : 1.05;
    for (let i = 0; i < 60; i++) {
      const a = sorted[Math.floor(Math.random() * sorted.length)];
      const b = sorted[Math.floor(Math.random() * sorted.length)];
      if (!a || !b || a.id === b.id || a.favorites === b.favorites) continue;
      const ratio = Math.max(a.favorites, b.favorites) / Math.max(1, Math.min(a.favorites, b.favorites));
      if (ratio >= minRatio && ratio <= maxRatio) return Math.random() < 0.5 ? [a, b] : [b, a];
    }
    return [...all].sort(() => Math.random() - 0.5).slice(0, 2);
  }

  function renderPopularityGame() {
    const box = document.getElementById("popDuelContainer");
    if (!box) return;
    box.innerHTML = "";

    if (popBetState.phase === "bet") {
      stopPopTimer();
      box.innerHTML = `
        <div class="pop-bet-panel" style="grid-column:1/-1;">
          <p class="muted-text">${t("pop_pick_bet")}</p>
          <div class="pop-bets-row">
            <button class="pop-bet-btn" data-bet="50"><span>50 🪙</span><small>${t("pop_low")}</small></button>
            <button class="pop-bet-btn" data-bet="150"><span>150 🪙</span><small>${t("pop_mid")}</small></button>
            <button class="pop-bet-btn" data-bet="400"><span>400 🪙</span><small>${t("pop_high")}</small></button>
          </div>
        </div>`;
      box.querySelectorAll(".pop-bet-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const bet = Number(btn.dataset.bet);
          if (state.gold < bet) return showToast(t("msg_no_gold"));
          if (characterCatalog.size < 10) await ensureRichCatalog();
          state.gold -= bet; saveState(); updateHud();
          popBetState = { phase: "playing", baseBet: bet, pot: bet * 2, round: 1, pair: pickDifficultyScaledPair(1) };
          playSfx("click"); renderPopularityGame(); startPopTimer();
        });
      });
      return;
    }

    const hud = document.createElement("div");
    hud.className = "pop-hud-bar"; hud.style.gridColumn = "1 / -1";
    hud.innerHTML = `<span>${t("pop_round")}: <b>#${popBetState.round}</b></span><span>${t("pop_pot")}: <b style="color:var(--gold);">${popBetState.pot} 🪙</b></span>`;
    box.appendChild(hud);

    if (popBetState.phase === "playing") {
      const tw = document.createElement("div");
      tw.className = "pop-timer-wrap";
      tw.innerHTML = `<div id="popTimerHead" class="pop-timer-head"><span>${t("pop_time")}</span><span id="popTimerText">6.0s</span></div><div class="pop-timer-track"><div id="popTimerFill" class="pop-timer-fill"></div></div>`;
      box.appendChild(tw);
    }

    const reveal = popBetState.phase === "decision" || popBetState.phase === "lost";
    const maxFav = Math.max(popBetState.pair[0]?.favorites || 0, popBetState.pair[1]?.favorites || 0);
    popBetState.pair.forEach((ch, idx) => {
      const other = popBetState.pair[1 - idx];
      const fallback = makeFallbackSvg(ch.name, ch.rarity);
      const card = document.createElement("div");
      card.className = "pop-card" + (reveal ? (ch.favorites >= maxFav ? " win-hl" : " lose-hl") : "");
      card.innerHTML = `${reveal ? `<div class="pop-fav-badge">❤️ ${ch.favorites.toLocaleString()}</div>` : ""}<img src="${ch.image}" alt="${ch.name}" onerror="this.onerror=null;this.src='${fallback}'" /><div class="pop-card-info"><h4>${ch.name}</h4><p class="muted-text">${ch.anime}</p></div>`;
      if (popBetState.phase === "playing") {
        card.addEventListener("click", () => {
          stopPopTimer();
          if (ch.favorites >= other.favorites) { popBetState.phase = "decision"; playSfx("win"); renderPopularityGame(); }
          else { popBetState.phase = "lost"; showToast(t("pop_lost")); renderPopularityGame(); setTimeout(() => { popBetState.phase = "bet"; renderPopularityGame(); }, 1600); }
        });
      }
      box.appendChild(card);
    });

    if (popBetState.phase === "decision") {
      const dec = document.createElement("div");
      dec.className = "pop-decision-box"; dec.style.gridColumn = "1 / -1";
      const bonusGems = popBetState.round >= 2 ? popBetState.round - 1 : 0;
      dec.innerHTML = `<button id="btnPopCashout" class="btn-cashout">${t("pop_cashout")} (+${popBetState.pot} 🪙)</button><button id="btnPopDouble" class="btn-double">${t("pop_double")} (${popBetState.pot * 2} 🪙)</button>`;
      box.appendChild(dec);
      document.getElementById("btnPopCashout").addEventListener("click", () => {
        state.gold += popBetState.pot; if (bonusGems > 0) state.gems += bonusGems;
        saveState(); updateHud(); playSfx("win"); showToast(t("pop_cashed"));
        popBetState.phase = "bet"; renderPopularityGame();
      });
      document.getElementById("btnPopDouble").addEventListener("click", () => {
        popBetState.round++; popBetState.pot *= 2; popBetState.phase = "playing";
        popBetState.pair = pickDifficultyScaledPair(popBetState.round);
        playSfx("click"); renderPopularityGame(); startPopTimer();
      });
    }
  }
  /* =========================================================
     13. النزالات أونلاين (معاينة 10ث + خلط سريع 15ث + الرهانات)
  ========================================================= */
  let selectedDuelMode = "safe";
  let selectedGemsStake = 30;
  let selectedStakeCardUid = "";
  let currentRoomCode = null;
  let currentRole = null;
  let roomListenerRef = null;
  let onlinePreviewStartedFor = null;
  let activeShuffleInterval = null;
  let activePreviewTimer = null;
  let rewardedRooms = new Set();

  window.selectGemsStake = function (val, btn) {
    selectedGemsStake = val;
    document.querySelectorAll("[data-gem-stake]").forEach((b) => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
  };

  function populateMyStakeCardsRow() {
    const row = document.getElementById("myStakeCardsRow");
    if (!row) return;
    const rares = state.inventory.filter((c) => LIMITED_CAPS[c.rarity]);
    if (!rares.length) {
      selectedStakeCardUid = "";
      row.innerHTML = `<p class="muted-text" style="padding:6px;">${t("msg_no_rares_stake")}</p>`;
      return;
    }
    if (!rares.some((c) => c.uidCard === selectedStakeCardUid)) selectedStakeCardUid = rares[0].uidCard;
    row.innerHTML = "";
    rares.forEach((c) => {
      const item = document.createElement("div");
      item.className = "stake-mini-card" + (c.uidCard === selectedStakeCardUid ? " selected" : "");
      item.innerHTML = `<img src="${c.image}" alt="${c.name}" /><span>${c.rarity} #${c.serial || 1}</span><span>${c.name}</span>`;
      item.addEventListener("click", () => { selectedStakeCardUid = c.uidCard; playSfx("click"); populateMyStakeCardsRow(); });
      row.appendChild(item);
    });
  }

  async function createOnlineRoom() {
    if (!db || !navigator.onLine) return showToast("⚠️ Offline!");
    if (characterCatalog.size < 6) await ensureRichCatalog();
    const duelType = selectedDuelMode;
    const goldStake = duelType === "safe" ? Math.max(0, Math.floor(Number(document.getElementById("inputGoldStake")?.value) || 0)) : 0;
    const gemsStake = duelType === "stake_gems" ? selectedGemsStake : 0;
    let stakeCard = null;

    if (duelType === "safe" && goldStake > 0 && state.gold < goldStake) return showToast(t("msg_no_gold"));
    if (duelType === "stake_gems" && state.gems < gemsStake) return showToast(t("msg_no_gems"));
    if (duelType === "stake_card") {
      stakeCard = state.inventory.find((c) => c.uidCard === selectedStakeCardUid) || null;
      if (!stakeCard) return showToast(t("msg_no_rares_stake"));
    }

    const code = String(Math.floor(1000 + Math.random() * 9000));
    const boardCards = pickSixUniqueRarityCards().map((c) => ({ id: c.id, name: c.name, image: c.image, rarity: c.rarity }));
    await db.ref(`duels/${code}`).set({
      code, duelType, goldStake, gemsStake, status: "waiting", turn: "p1",
      cards: boardCards, picked: ["", "", "", "", "", ""],
      p1: { uid: state.uid, name: state.name, consent: false, stakeCard },
      p2: null, createdAt: Date.now()
    });
    attachToRoom(code, "p1");
    showToast(`✅ ${t("lbl_room_code")}: ${code}`);
  }

  async function joinOnlineRoom(codeInput) {
    const code = (codeInput || document.getElementById("inputRoomCode").value).trim();
    if (!/^\d{4}$/.test(code)) return showToast("⚠️ 4-digit code!");
    if (!db || !navigator.onLine) return showToast("⚠️ Offline!");
    const snap = await db.ref(`duels/${code}`).get();
    if (!snap.exists()) return showToast("❌ Room not found!");
    const room = snap.val();
    if (room.p1?.uid === state.uid) { attachToRoom(code, "p1"); return; }
    if (room.p2 && room.p2.uid !== state.uid) return showToast("⚠️ Room full!");

    const reqGold = Number(room.goldStake) || 0;
    const reqGems = Number(room.gemsStake) || 30;
    let p2StakeCard = null;
    if (room.duelType === "safe" && reqGold > 0 && state.gold < reqGold) return showToast(t("msg_no_gold"));
    if (room.duelType === "stake_gems" && state.gems < reqGems) return showToast(t("msg_no_gems"));
    if (room.duelType === "stake_card") {
      const reqR = room.p1?.stakeCard?.rarity;
      p2StakeCard = state.inventory.find((c) => c.rarity === reqR) || null;
      if (!p2StakeCard) return showToast(`⚠️ Requires ${reqR} card!`);
    }

    const needsConsent = room.duelType !== "safe" || reqGold > 0;
    await db.ref(`duels/${code}`).update({
      status: needsConsent ? "consent" : "preview",
      p2: { uid: state.uid, name: state.name, consent: !needsConsent, stakeCard: p2StakeCard }
    });
    attachToRoom(code, "p2");
  }

  function attachToRoom(code, role) {
    leaveCurrentRoom(false);
    currentRoomCode = code; currentRole = role;
    onlinePreviewStartedFor = null;
    document.getElementById("roomSetupBox").classList.add("hidden");
    document.getElementById("activeDuelBox").classList.remove("hidden");
    document.getElementById("activeRoomCode").textContent = code;
    roomListenerRef = db.ref(`duels/${code}`);
    roomListenerRef.on("value", (snap) => {
      if (!snap.exists()) { leaveCurrentRoom(false); return; }
      renderOnlineRoomState(snap.val());
    });
  }

  function leaveCurrentRoom(removeFromDb = true) {
    if (activePreviewTimer) { clearInterval(activePreviewTimer); activePreviewTimer = null; }
    if (activeShuffleInterval) { clearInterval(activeShuffleInterval); activeShuffleInterval = null; }
    if (roomListenerRef) { roomListenerRef.off(); roomListenerRef = null; }
    if (removeFromDb && currentRoomCode && db) db.ref(`duels/${currentRoomCode}`).remove().catch(() => {});
    currentRoomCode = null; currentRole = null; onlinePreviewStartedFor = null;
    document.getElementById("activeDuelBox").classList.add("hidden");
    document.getElementById("roomSetupBox").classList.remove("hidden");
  }

  function startOnlineVisibleShuffle(room) {
    if (onlinePreviewStartedFor === room.code) return;
    onlinePreviewStartedFor = room.code;
    if (activePreviewTimer) clearInterval(activePreviewTimer);
    if (activeShuffleInterval) clearInterval(activeShuffleInterval);

    const statusBanner = document.getElementById("onlineDuelStatus");
    renderOnlineBoard(room, true);
    let previewLeft = 10;
    if (statusBanner) statusBanner.textContent = `👀 احفظ أماكن البطاقات! سيبدأ الخلط خلال ${previewLeft} ثانية...`;

    activePreviewTimer = setInterval(() => {
      previewLeft--;
      if (previewLeft > 0) {
        if (statusBanner) statusBanner.textContent = `👀 احفظ أماكن البطاقات! سيبدأ الخلط خلال ${previewLeft} ثانية...`;
      } else {
        clearInterval(activePreviewTimer); activePreviewTimer = null;
        renderOnlineBoard(room, false);

        let secondsLeft = 15;
        let cardsOrder = [...(room.cards || [])];
        let seed = Number(room.code) || 1234;
        const nextRand = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };

        const doFastSwap = () => {
          const board = document.getElementById("onlineBoard");
          if (!board || board.children.length < 6) return;
          const i = Math.floor(nextRand() * 6);
          let j = Math.floor(nextRand() * 6);
          if (i === j) j = (i + 1) % 6;
          [cardsOrder[i], cardsOrder[j]] = [cardsOrder[j], cardsOrder[i]];

          const elA = board.children[i], elB = board.children[j];
          const rA = elA.getBoundingClientRect(), rB = elB.getBoundingClientRect();
          const dx = rB.left - rA.left, dy = rB.top - rA.top;
          elA.style.transition = "transform 0.15s ease"; elB.style.transition = "transform 0.15s ease";
          elA.style.transform = `translate(${dx}px, ${dy}px)`; elB.style.transform = `translate(${-dx}px, ${-dy}px)`;
          setTimeout(() => {
            elA.style.transition = "none"; elB.style.transition = "none";
            elA.style.transform = ""; elB.style.transform = "";
          }, 160);
        };

        if (statusBanner) statusBanner.textContent = `⚡ خلط فائق السرعة... متبقي ${secondsLeft} ثانية`;
        let tick = 0;
        activeShuffleInterval = setInterval(async () => {
          tick++;
          doFastSwap();
          if (tick % 5 === 0) {
            secondsLeft--;
            if (statusBanner) statusBanner.textContent = `⚡ خلط فائق السرعة... متبقي ${secondsLeft} ثانية`;
          }
          if (secondsLeft <= 0) {
            clearInterval(activeShuffleInterval); activeShuffleInterval = null;
            if (currentRole === "p1") {
              await db.ref(`duels/${room.code}`).update({ cards: cardsOrder, status: "playing", turn: "p1" });
            }
          }
        }, 200);
      }
    }, 1000);
  }

  function renderOnlineRoomState(room) {
    document.getElementById("p1NameLabel").textContent = room.p1?.name || "P1";
    document.getElementById("p2NameLabel").textContent = room.p2?.name || t("msg_waiting_opp");
    const modeTags = { safe: "🛡️ " + t("mode_safe_title"), stake_gems: "💎 " + t("mode_gems_title"), stake_card: "🔥 " + t("mode_card_title") };
    document.getElementById("activeDuelModeTag").textContent = modeTags[room.duelType] || "⚔️";

    const stakeText = room.duelType === "stake_gems" ? `${room.gemsStake || 30} 💎`
      : (room.duelType === "safe" && room.goldStake > 0 ? `${room.goldStake} 🪙` : "✓");
    document.getElementById("p1StakeLabel").textContent = room.p1?.stakeCard ? `${room.p1.stakeCard.name} (${room.p1.stakeCard.rarity})` : stakeText;
    document.getElementById("p2StakeLabel").textContent = room.p2 ? (room.p2.stakeCard ? `${room.p2.stakeCard.name} (${room.p2.stakeCard.rarity})` : stakeText) : "---";

    const consentBar = document.getElementById("mutualConsentBar");
    const statusBanner = document.getElementById("onlineDuelStatus");

    if (room.status === "waiting") {
      onlinePreviewStartedFor = null;
      consentBar.classList.add("hidden");
      statusBanner.textContent = `${t("lbl_room_code")}: ${room.code} — ${t("msg_waiting_opp")}`;
      renderOnlineBoard(room, false);
      return;
    }
    if (room.status === "consent") {
      onlinePreviewStartedFor = null;
      consentBar.classList.remove("hidden");
      statusBanner.textContent = t("consent_warn");
      if (room.p1?.consent && room.p2?.consent && currentRole === "p1") {
        db.ref(`duels/${room.code}/status`).set("preview");
      }
      renderOnlineBoard(room, false);
      return;
    }
    consentBar.classList.add("hidden");
    if (room.status === "preview") {
      startOnlineVisibleShuffle(room);
      return;
    }
    if (room.status === "playing") {
      statusBanner.textContent = room.turn === currentRole ? t("msg_your_turn") : t("msg_opp_turn");
      renderOnlineBoard(room, false);
      return;
    }
    if (room.status === "finished") {
      renderOnlineBoard(room, true);
      finalizeOnlineMatchRewards(room);
    }
  }

  function renderOnlineBoard(room, revealAll) {
    const board = document.getElementById("onlineBoard");
    if (!board) return;
    board.innerHTML = "";
    const pickedArr = room.picked || ["", "", "", "", "", ""];
    (room.cards || []).forEach((card, idx) => {
      const owner = pickedArr[idx] || "";
      const showFace = revealAll || owner !== "";
      const slot = document.createElement("div");
      slot.className = "duel-slot";
      const borderCls = owner === currentRole ? " picked-me" : owner !== "" ? " picked-opp" : "";
      const fallback = makeFallbackSvg(card.name, card.rarity);
      slot.innerHTML = showFace
        ? `<div class="duel-card-inner${borderCls}"><img src="${card.image}" alt="${card.name}" onerror="this.onerror=null;this.src='${fallback}'" /><span class="card-rarity-pill r-${card.rarity}">${card.rarity}</span><div class="card-bottom-label">${card.name}</div></div>`
        : `<div class="duel-card-inner face-down"></div>`;
      slot.addEventListener("click", () => handleOnlineCardPick(room, idx));
      board.appendChild(slot);
    });
  }

  async function handleOnlineCardPick(room, idx) {
    if (room.status !== "playing" || room.turn !== currentRole) return;
    const picked = [...(room.picked || ["", "", "", "", "", ""])];
    if (picked[idx]) return;
    playSfx("click");
    picked[idx] = currentRole;
    const p1c = picked.filter((x) => x === "p1").length;
    const p2c = picked.filter((x) => x === "p2").length;
    if (p1c + p2c === 6) { await db.ref(`duels/${room.code}`).update({ picked, status: "finished" }); return; }
    let nextTurn = room.turn;
    if (p1c === 1 && p2c === 0) nextTurn = "p2";
    else if (p1c === 1 && p2c === 2) nextTurn = "p1";
    else if (p1c === 3 && p2c === 2) nextTurn = "p2";
    await db.ref(`duels/${room.code}`).update({ picked, turn: nextTurn });
  }

  async function finalizeOnlineMatchRewards(room) {
    if (rewardedRooms.has(room.code)) return;
    rewardedRooms.add(room.code);
    const picked = room.picked || [];
    let p1Score = 0, p2Score = 0;
    (room.cards || []).forEach((c, i) => {
      const p = RANK_POWER[c.rarity] || 1;
      if (picked[i] === "p1") p1Score += p; else if (picked[i] === "p2") p2Score += p;
    });
    const iWon = (p1Score >= p2Score ? "p1" : "p2") === currentRole;
    const statusBanner = document.getElementById("onlineDuelStatus");
    const gStake = Number(room.goldStake) || 0;
    const gemStake = Number(room.gemsStake) || 30;

    if (iWon) {
      state.trophies += 25; state.gold += 300 + (room.duelType === "safe" ? gStake : 0); state.gems += 5;
      if (room.duelType === "stake_gems") state.gems += gemStake;
      else if (room.duelType === "stake_card") {
        const wonCard = currentRole === "p1" ? room.p2?.stakeCard : room.p1?.stakeCard;
        if (wonCard) {
          wonCard.acquiredAt = Date.now();
          state.inventory.push(wonCard);
          state.shieldUntil = Date.now() + DAY_MS;
          showToast(`👑 +${wonCard.name}`);
        }
      }
      playSfx("win");
      statusBanner.textContent = `${t("msg_win")} (${p1Score} - ${p2Score}) +25 🏆`;
    } else {
      state.trophies = Math.max(0, state.trophies - 10);
      if (room.duelType === "safe" && gStake > 0) state.gold = Math.max(0, state.gold - gStake);
      else if (room.duelType === "stake_gems") state.gems = Math.max(0, state.gems - gemStake);
      else if (room.duelType === "stake_card") {
        const lostCard = currentRole === "p1" ? room.p1?.stakeCard : room.p2?.stakeCard;
        if (lostCard) state.inventory = state.inventory.filter((c) => c.uidCard !== lostCard.uidCard);
      }
      statusBanner.textContent = `${t("msg_lose")} (${p1Score} - ${p2Score})`;
    }
    saveState(); updateHud(); renderInventory(true); populateMyStakeCardsRow();
  }

  /* =========================================================
     14. التنقل، الأحداث، والتشغيل
  ========================================================= */
  function switchMainTab(tabId) {
    stopPopTimer();
    document.querySelectorAll(".tab-view").forEach((v) => v.classList.remove("active"));
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
    document.getElementById(tabId)?.classList.add("active");
    document.querySelector(`.nav-btn[data-tab="${tabId}"]`)?.classList.add("active");
    if (tabId === "viewCards") renderInventory(false);
    if (tabId === "viewCodex") renderCodex();
    if (tabId === "viewOnline") populateMyStakeCardsRow();
    if (tabId === "viewArena" && document.getElementById("soloPopPane")?.classList.contains("active")) renderPopularityGame();
  }

  function switchOnlineSubTab(paneKey) {
    document.querySelectorAll("#viewOnline .sub-tab").forEach((b) => b.classList.toggle("active", b.dataset.online === paneKey));
    document.querySelectorAll(".online-pane").forEach((p) => p.classList.remove("active"));
    const map = { lobby: "onlineLobbyPane", challenges: "onlineChallengesPane", leaders: "onlineLeadersPane" };
    document.getElementById(map[paneKey])?.classList.add("active");
  }

  function initStartScreenBackground() {
    const bg = document.getElementById("startBgCards");
    if (!bg) return;
    const topChars = Array.from(characterCatalog.values()).slice(0, 9);
    if (topChars.length) bg.innerHTML = topChars.map((c) => `<img src="${c.image}" alt="" />`).join("");
  }

  function bindAllEvents() {
    document.getElementById("btnStartGame")?.addEventListener("click", () => {
      document.getElementById("startScreen").classList.add("hidden");
      document.getElementById("appShell").classList.remove("hidden");
      updateBgmPlayback(); syncPlayerToCloud(); ensureRichCatalog();
    });

    document.querySelectorAll(".lang-chip").forEach((c) => c.addEventListener("click", () => applyLanguage(c.dataset.lang)));
    document.querySelectorAll(".nav-btn").forEach((b) => b.addEventListener("click", () => switchMainTab(b.dataset.tab)));

    document.querySelectorAll("#viewArena .sub-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        stopPopTimer();
        document.querySelectorAll("#viewArena .sub-tab").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        document.querySelectorAll(".solo-pane").forEach((p) => p.classList.remove("active"));
        const map = { shuffle: "soloShufflePane", trivia: "soloTriviaPane", pop: "soloPopPane" };
        document.getElementById(map[btn.dataset.solo])?.classList.add("active");
        if (btn.dataset.solo === "trivia") loadNextTriviaQuestion();
        if (btn.dataset.solo === "pop") { popBetState.phase = "bet"; renderPopularityGame(); }
      });
    });

    document.querySelectorAll(".diff-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".diff-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active"); soloDiff = btn.dataset.diff;
      });
    });
    document.getElementById("btnStartSoloShuffle")?.addEventListener("click", startSoloShuffleDuel);

    document.querySelectorAll(".trivia-mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".trivia-mode-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active"); triviaMode = btn.dataset.tmode; loadNextTriviaQuestion();
      });
    });

    // زر الحذف التدريجي (50 -> 100 -> 150 ذهب) — مضمون 100% ألا يحذف الجواب الصحيح
    document.getElementById("btnTrivia5050")?.addEventListener("click", () => {
      if (!currentTriviaAnswer || triviaHintCount >= HINT_COSTS.length) return;
      const cost = HINT_COSTS[triviaHintCount];
      if (state.gold < cost) return showToast(`⚠️ تحتاج ${cost} ذهب`);
      const wrongBtns = Array.from(document.querySelectorAll("#triviaOptions .opt-btn"))
        .filter((b) => Number(b.dataset.id) !== Number(currentTriviaAnswer.id) && !b.disabled && !b.classList.contains("eliminated"));
      if (!wrongBtns.length) return;
      const victim = wrongBtns[Math.floor(Math.random() * wrongBtns.length)];
      victim.disabled = true;
      victim.classList.add("eliminated");
      victim.style.opacity = "0.25";
      victim.style.textDecoration = "line-through";
      state.gold -= cost;
      triviaHintCount++;
      saveState(); updateHud(); playSfx("click"); updateTriviaHintBtn();
    });
    document.getElementById("btnTriviaSkip")?.addEventListener("click", loadNextTriviaQuestion);

    document.querySelectorAll("#viewOnline .sub-tab").forEach((b) => b.addEventListener("click", () => switchOnlineSubTab(b.dataset.online)));
    document.querySelectorAll("#duelModeCards .duel-mode-card").forEach((cardBtn) => {
      cardBtn.addEventListener("click", () => {
        document.querySelectorAll("#duelModeCards .duel-mode-card").forEach((c) => c.classList.remove("active"));
        cardBtn.classList.add("active");
        selectedDuelMode = cardBtn.dataset.mode;
        playSfx("click");
        document.getElementById("myStakeCardPicker")?.classList.toggle("hidden", selectedDuelMode !== "stake_card");
        document.getElementById("safeGoldStakeBox")?.classList.toggle("hidden", selectedDuelMode !== "safe");
        document.getElementById("gemsStakeBox")?.classList.toggle("hidden", selectedDuelMode !== "stake_gems");
        if (selectedDuelMode === "stake_card") populateMyStakeCardsRow();
      });
    });

    document.getElementById("btnCreateRoom")?.addEventListener("click", createOnlineRoom);
    document.getElementById("btnJoinRoom")?.addEventListener("click", () => joinOnlineRoom());
    document.getElementById("btnLeaveRoom")?.addEventListener("click", () => leaveCurrentRoom(true));
    document.getElementById("btnConfirmConsent")?.addEventListener("click", () => {
      if (db && currentRoomCode && currentRole) { db.ref(`duels/${currentRoomCode}/${currentRole}/consent`).set(true); showToast("✅"); }
    });
    document.getElementById("btnDeclineConsent")?.addEventListener("click", () => leaveCurrentRoom(true));

    document.getElementById("invSearch")?.addEventListener("input", (e) => { invSearchQuery = e.target.value; renderInventory(true); });
    document.querySelectorAll("#invRarityFilters .r-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("#invRarityFilters .r-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active"); invFilterRarity = chip.dataset.r; renderInventory(true);
      });
    });
    document.getElementById("btnLoadMoreInv")?.addEventListener("click", () => { invRenderLimit += 30; renderInventory(false); });

    let codexSearchTimer = null;
    document.getElementById("codexSearch")?.addEventListener("input", (e) => {
      codexSearch = e.target.value; renderCodex();
      clearTimeout(codexSearchTimer);
      if (codexSearch.trim().length >= 2 && navigator.onLine) {
        codexSearchTimer = setTimeout(async () => { await fetchAniListPage(1, codexSearch.trim()); renderCodex(); }, 500);
      }
    });
    document.querySelectorAll("#codexRarityFilters .r-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("#codexRarityFilters .r-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active"); codexFilter = chip.dataset.cr; renderCodex();
      });
    });

    document.getElementById("btnCloseSummon")?.addEventListener("click", () => document.getElementById("summonModal").classList.add("hidden"));
    document.getElementById("btnCloseCardModal")?.addEventListener("click", () => document.getElementById("cardModal").classList.add("hidden"));
    document.getElementById("btnSettings")?.addEventListener("click", () => { updateHud(); document.getElementById("settingsModal").classList.remove("hidden"); });
    document.getElementById("btnProfileHud")?.addEventListener("click", () => { updateHud(); document.getElementById("settingsModal").classList.remove("hidden"); });
    document.getElementById("btnCloseSettings")?.addEventListener("click", () => document.getElementById("settingsModal").classList.add("hidden"));

    document.getElementById("btnSavePlayerName")?.addEventListener("click", () => {
      const val = document.getElementById("inputPlayerName").value.trim();
      if (val.length >= 2) { state.name = val; saveState(); updateHud(); showToast(t("msg_saved")); }
    });
    document.getElementById("btnAudioToggle")?.addEventListener("click", () => {
      state.bgmEnabled = !state.bgmEnabled; document.getElementById("chkBgm").checked = state.bgmEnabled;
      saveState(); updateBgmPlayback();
    });
    document.getElementById("chkBgm")?.addEventListener("change", (e) => { state.bgmEnabled = e.target.checked; saveState(); updateBgmPlayback(); });
    document.getElementById("chkSfx")?.addEventListener("change", (e) => { state.sfxEnabled = e.target.checked; saveState(); });

    window.addEventListener("online", () => { updateHud(); ensureRichCatalog(); });
    window.addEventListener("offline", updateHud);
  }

  loadCaches();
  initStartScreenBackground();
  applyLanguage(state.lang);
  bindAllEvents();
  initFirebaseListeners();
  ensureRichCatalog();
  /* === نظام التوسيع التلقائي للشخصيات + إصلاح زر تحميل المزيد في النوادر === */
(function enableAutoCatalogExpansion() {
  function getNextUnseenPage() {
    const saved = Number(localStorage.getItem("monarch_anilist_cursor_v1")) || 1;
    const bySize = Math.floor(characterCatalog.size / 45) + 1;
    return Math.max(codexPageCursor, saved, bySize);
  }

  // ضبط المؤشر فوراً لما بعد الشخصيات المحمّلة حالياً
  codexPageCursor = getNextUnseenPage();

  async function loadNextBatch(showNotice = false) {
    if (isFetchingAniList || !navigator.onLine) return 0;
    isFetchingAniList = true;
    let added = 0;
    try {
      const targetPage = getNextUnseenPage();
      const before = characterCatalog.size;
      await fetchAniListPage(targetPage);
      codexPageCursor = targetPage + 1;
      localStorage.setItem("monarch_anilist_cursor_v1", String(codexPageCursor));
      added = characterCatalog.size - before;
      updateHud();
      if (added > 0) renderCodex();
      if (showNotice) {
        showToast(added > 0 ? `✅ تمت إضافة ${added} شخصية جديدة (المجموع: ${characterCatalog.size})` : "⏳ جاري تخطي المكرر... اضغط مجدداً");
      }
    } catch (_) {} finally {
      isFetchingAniList = false;
    }
    return added;
  }

  // 1. التوسيع التلقائي في الخلفية (صفحة جديدة كل 20 ثانية أثناء اللعب بدون إرهاق السيرفر)
  setTimeout(() => loadNextBatch(false), 5000);
  setInterval(() => loadNextBatch(false), 20000);

  // 2. ربط زر "تحميل المزيد من الأساطير" ليجلب الصفحة الجديدة فعلياً
  document.addEventListener("click", async (e) => {
    const btn = e.target?.closest?.("#btnCodexMoreLive");
    if (!btn) return;
    e.stopImmediatePropagation();
    btn.disabled = true;
    btn.textContent = t("codex_searching");
    await loadNextBatch(true);
    btn.disabled = false;
    btn.textContent = t("codex_more");
  }, true);
})();
/* === إصلاح المشاكل الـ 6: Gokuu SP + ظهور البطاقات + التحديات + نقل الملكية + اختيار البطاقة + التوسيع بعد 4860 === */
(function applyFinalSixFixes() {
  /* 1. ترقية Gokuu Son إلى SP فوراً في الكتالوج والمخزون */
  function fixGokuuRarity() {
    const isGoku = (c) => {
      const n = String(c?.name || "").trim().toLowerCase();
      const a = String(c?.anime || "").toLowerCase();
      return (n === "gokuu son" || n === "son gokuu" || n === "goku son" || n === "son goku") && (!a || a.includes("dragon ball"));
    };
    characterCatalog.forEach((c) => { if (isGoku(c)) c.rarity = "SP"; });
    let invChanged = false;
    state.inventory.forEach((c) => {
      if (isGoku(c) && c.rarity !== "SP") {
        c.rarity = "SP"; c.maxCopies = 1; c.serial = c.serial || 1; invChanged = true;
      }
    });
    if (invChanged) saveState();
  }
  fixGokuuRarity();
  setTimeout(() => { fixGokuuRarity(); renderCodex(); }, 2500);

  /* 2. ضمان ظهور البطاقات مكشوفة طوال الـ 10 ثوانٍ لمنشئ الغرفة والضيف معاً */
  const _origShuffle = startOnlineVisibleShuffle;
  startOnlineVisibleShuffle = function (room) {
    _origShuffle(room);
    let checks = 0;
    const ensureFaceUp = setInterval(() => {
      checks++;
      if (checks > 18 || !currentRoomCode || currentRoomCode !== room.code) {
        clearInterval(ensureFaceUp);
        return;
      }
      const statusText = document.getElementById("onlineDuelStatus")?.textContent || "";
      if (statusText.includes("احفظ") || statusText.includes("Memorize")) {
        const hasHidden = document.querySelector("#onlineBoard .face-down");
        if (hasHidden) renderOnlineBoard(room, true);
      } else {
        clearInterval(ensureFaceUp);
      }
    }, 500);
  };

  /* 3. إصلاح تحدي البطاقة النادرة: إنشاء الغرفة فعلياً قبل إرسال التحدي */
  sendDirectChallenge = async function (charId, slot, targetUid, targetName) {
    if (!db || !navigator.onLine) return showToast("⚠️ Offline!");
    const ch = characterCatalog.get(charId);
    if (!ch) return;

    const myMatchingCard = state.inventory.find((c) => c.rarity === ch.rarity);
    if (!myMatchingCard) return showToast(`⚠️ تحتاج بطاقة ندرة ${ch.rarity} لتحدي ${targetName}`);

    const roomCode = String(Math.floor(1000 + Math.random() * 9000));
    const boardCards = pickSixUniqueRarityCards().map((c) => ({ id: c.id, name: c.name, image: c.image, rarity: c.rarity }));

    await db.ref(`duels/${roomCode}`).set({
      code: roomCode, duelType: "stake_card", goldStake: 0, gemsStake: 0,
      status: "waiting", turn: "p1", cards: boardCards, picked: ["", "", "", "", "", ""],
      p1: { uid: state.uid, name: state.name, consent: true, stakeCard: myMatchingCard },
      p2: null, createdAt: Date.now()
    });

    const challengeId = "ch_" + Date.now();
    await db.ref(`challenges/${targetUid}/${challengeId}`).set({
      id: challengeId, fromUid: state.uid, fromName: state.name,
      charId, charName: ch.name, rarity: ch.rarity, slot, roomCode,
      status: "pending", createdAt: Date.now()
    });

    switchMainTab("viewOnline");
    switchOnlineSubTab("lobby");
    attachToRoom(roomCode, "p1");
    showToast(`📩 تم إرسال التحدي وفتح الغرفة (${roomCode})`);
  };

  /* 4. اختيار بطاقة الرهان يدوياً قبل الدخول لغرفة رهان البطاقات */
  function openManualStakePicker(reqRarity, onSelect) {
    document.getElementById("manualStakeOverlay")?.remove();
    const matching = state.inventory.filter((c) => c.rarity === reqRarity);
    if (!matching.length) return showToast(`⚠️ لا تملك بطاقة ندرة ${reqRarity} للرهان`);

    const overlay = document.createElement("div");
    overlay.id = "manualStakeOverlay";
    overlay.style.cssText = "position:fixed;inset:0;z-index:99999;background:rgba(2,6,23,0.92);display:flex;align-items:center;justify-content:center;padding:16px;backdrop-filter:blur(5px);";
    overlay.innerHTML = `
      <div style="width:100%;max-width:360px;background:#0f172a;border:1.5px solid #f59e0b;border-radius:16px;padding:16px;max-height:80vh;overflow-y:auto;">
        <h3 style="color:#fff;margin:0 0 10px;text-align:center;">🔥 اختر بطاقة (${reqRarity}) للرهان</h3>
        <div id="manualStakeGrid" style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;"></div>
        <button id="btnCancelManualStake" class="secondary-btn full-w" style="margin-top:12px;">إلغاء</button>
      </div>
    `;
    document.body.appendChild(overlay);

    const grid = overlay.querySelector("#manualStakeGrid");
    matching.forEach((card) => {
      const el = document.createElement("div");
      el.style.cssText = "background:#1e293b;border:1px solid #334155;border-radius:12px;padding:8px;text-align:center;cursor:pointer;";
      el.innerHTML = `<img src="${card.image}" style="width:100%;height:120px;object-fit:cover;border-radius:8px;" /><div style="color:#fff;font-size:12px;font-weight:bold;margin-top:6px;">${card.name}</div><div style="color:#fbbf24;font-size:11px;">#${card.serial || 1}</div>`;
      el.addEventListener("click", () => { overlay.remove(); onSelect(card); });
      grid.appendChild(el);
    });
    overlay.querySelector("#btnCancelManualStake").addEventListener("click", () => overlay.remove());
  }

  joinOnlineRoom = async function (codeInput) {
    const code = (codeInput || document.getElementById("inputRoomCode")?.value || "").trim();
    if (!/^\d{4}$/.test(code)) return showToast("⚠️ أدخل كود من 4 أرقام");
    if (!db || !navigator.onLine) return showToast("⚠️ Offline!");

    const snap = await db.ref(`duels/${code}`).get();
    if (!snap.exists()) return showToast("❌ الغرفة غير موجودة!");
    const room = snap.val();
    if (room.p1?.uid === state.uid) { attachToRoom(code, "p1"); return; }
    if (room.p2 && room.p2.uid !== state.uid) return showToast("⚠️ الغرفة ممتلئة!");

    const reqGold = Number(room.goldStake) || 0;
    const reqGems = Number(room.gemsStake) || 30;
    if (room.duelType === "safe" && reqGold > 0 && state.gold < reqGold) return showToast(t("msg_no_gold"));
    if (room.duelType === "stake_gems" && state.gems < reqGems) return showToast(t("msg_no_gems"));

    const proceedJoin = async (p2StakeCard) => {
      const needsConsent = room.duelType !== "safe" || reqGold > 0;
      await db.ref(`duels/${code}`).update({
        status: needsConsent ? "consent" : "preview",
        p2: { uid: state.uid, name: state.name, consent: !needsConsent, stakeCard: p2StakeCard }
      });
      attachToRoom(code, "p2");
    };

    if (room.duelType === "stake_card") {
      const reqR = room.p1?.stakeCard?.rarity || "SSR";
      openManualStakePicker(reqR, (chosenCard) => proceedJoin(chosenCard));
    } else {
      await proceedJoin(null);
    }
  };

  const joinBtn = document.getElementById("btnJoinRoom");
  if (joinBtn) {
    const clone = joinBtn.cloneNode(true);
    joinBtn.replaceWith(clone);
    clone.addEventListener("click", () => joinOnlineRoom());
  }

  /* 5. حذف ملكية الخاسر من Firebase ونقلها للفائز فوراً عند نهاية رهان البطاقات */
  const _origFinalizeRewards = finalizeOnlineMatchRewards;
  finalizeOnlineMatchRewards = async function (room) {
    if (rewardedRooms.has(room.code)) return;
    await _origFinalizeRewards(room);

    if (room.duelType === "stake_card" && db && navigator.onLine) {
      const picked = room.picked || [];
      let p1Score = 0, p2Score = 0;
      (room.cards || []).forEach((c, i) => {
        const p = RANK_POWER[c.rarity] || 1;
        if (picked[i] === "p1") p1Score += p; else if (picked[i] === "p2") p2Score += p;
      });
      const iWon = (p1Score >= p2Score ? "p1" : "p2") === currentRole;

      if (iWon) {
        const wonCard = currentRole === "p1" ? room.p2?.stakeCard : room.p1?.stakeCard;
        if (wonCard && wonCard.charId && wonCard.serial) {
          await db.ref(`limitedCards/${wonCard.charId}/owners/${wonCard.serial}`).set({
            uid: state.uid, name: state.name, claimedAt: Date.now(), lastActiveAt: Date.now()
          }).catch(() => {});
        }
      } else {
        const lostCard = currentRole === "p1" ? room.p1?.stakeCard : room.p2?.stakeCard;
        if (lostCard && lostCard.charId && lostCard.serial) {
          const snap = await db.ref(`limitedCards/${lostCard.charId}/owners/${lostCard.serial}`).get();
          if (snap.exists() && snap.val()?.uid === state.uid) {
            await db.ref(`limitedCards/${lostCard.charId}/owners/${lostCard.serial}`).remove().catch(() => {});
          }
        }
      }
      renderCodex();
    }
  };

  /* 6. تجاوز حد الـ 4860 شخصية في AniList عبر التبديل التلقائي إلى الترتيب بـ ID_DESC */
  async function fetchFreshByIdPage() {
    if (isFetchingAniList || !navigator.onLine) return 0;
    isFetchingAniList = true;
    let added = 0;
    try {
      let idPage = Number(localStorage.getItem("monarch_anilist_id_page_v1")) || 1;
      const query = `query ($page: Int) { Page(page: $page, perPage: 45) { characters(sort: ID_DESC) { id name { full native } image { large } description(asHtml: false) favourites media(sort: POPULARITY_DESC, perPage: 1) { nodes { title { romaji english } genres } } } } }`;
      const res = await fetch("https://graphql.anilist.co", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ query, variables: { page: idPage } })
      });
      if (res.ok) {
        const json = await res.json();
        const list = json?.data?.Page?.characters || [];
        const before = characterCatalog.size;
        list.forEach((item) => {
          const img = item.image?.large || "";
          if (!img || img.includes("default.jpg")) return;
          const node = item.media?.nodes?.[0];
          registerCharacter({
            id: item.id, name: item.name?.full, nativeName: item.name?.native || "",
            anime: node?.title?.english || node?.title?.romaji || "Anime Legend",
            genres: node?.genres || [], favorites: item.favourites || 0, image: img,
            bioEn: cleanDescription(item.description) || `${item.name?.full}`
          }, false);
        });
        added = characterCatalog.size - before;
        localStorage.setItem("monarch_anilist_id_page_v1", String(idPage + 1));
        if (added > 0) { saveCharCache(); fixGokuuRarity(); updateHud(); renderCodex(); }
      }
    } catch (_) {} finally {
      isFetchingAniList = false;
    }
    return added;
  }

  setInterval(() => { if (characterCatalog.size >= 4500) fetchFreshByIdPage(); }, 25000);

  document.addEventListener("click", async (e) => {
    const btn = e.target?.closest?.("#btnCodexMoreLive");
    if (!btn) return;
    e.stopImmediatePropagation();
    btn.disabled = true;
    btn.textContent = t("codex_searching");
    const added = await fetchFreshByIdPage();
    showToast(added > 0 ? `✅ تمت إضافة ${added} شخصية جديدة (المجموع: ${characterCatalog.size})` : "⏳ جاري جلب المزيد...");
    btn.disabled = false;
    btn.textContent = t("codex_more");
  }, true);
})();
/* === التحقق الصارم بالاسم الكامل + الأنمي + القصة (bioEn) لمنع أي خطأ === */
(function restoreTrueLegendsStrict() {
  const EXTRA_LEGENDS = [
    // SP (القمة المطلقة — الاسم + الأنمي + القصة)
    { names: ["gokuu son", "son goku", "goku son"], anime: "dragon ball", story: /saiyan|kamehameha|earth|martial/i, rarity: "SP" },
    { names: ["beerus"], anime: "dragon ball", story: /god of destruction|universe 7|whis/i, rarity: "SP" },
    { names: ["whis"], anime: "dragon ball", story: /angel|beerus|universe 7|grand minister/i, rarity: "SP" },
    { names: ["zeno", "zen-oh"], anime: "dragon ball", story: /omni-king|universe|multiverse|god/i, rarity: "SP" },
    { names: ["goku black", "gokuu black"], anime: "dragon ball", story: /zamasu|saiyan|zero mortals|time ring/i, rarity: "SP" },
    { names: ["broly", "jiren"], anime: "dragon ball", story: /saiyan|pride troopers|universe|power/i, rarity: "SP" },
    { names: ["hashirama senju", "kaguya otsutsuki", "kaguya ootsutsuki", "isshiki otsutsuki"], anime: "naruto", story: /hokage|chakra|otsutsuki|shinobi|konoha/i, rarity: "SP" },
    { names: ["yhwach", "genryuusai shigekuni yamamoto"], anime: "bleach", story: /quincy|soul society|gotei|zanpakuto|captain/i, rarity: "SP" },
    { names: ["shanks", "kaido", "kaidou", "gol d. roger", "roger gol d."], anime: "one piece", story: /pirate|yonko|emperor|haki|sea/i, rarity: "SP" },
    { names: ["alucard"], anime: "hellsing", story: /vampire|hellsing|integra|undead/i, rarity: "SP" },
    { names: ["reinhard van astrea"], anime: "re:zero", story: /sword saint|knight|astrea/i, rarity: "SP" },
    { names: ["simon"], anime: "gurren lagann", story: /drill|spiral|kamina|gunmen|lagann/i, rarity: "SP" },
    { names: ["mori jin", "jin mori"], anime: "god of high school", story: /taekwondo|monkey king|tournament/i, rarity: "SP" },

    // UR (النخبة والأقوياء — الاسم + الأنمي + القصة)
    { names: ["frieza", "freeza", "cell", "majin buu"], anime: "dragon ball", story: /emperor|saiyan|android|destroy|planet/i, rarity: "UR" },
    { names: ["dracule mihawk", "mihawk dracule", "trafalgar law", "law trafalgar", "donquixote doflamingo", "portgas d. ace", "sabo", "monkey d. garp"], anime: "one piece", story: /pirate|marine|warlord|swordsman|devil fruit|revolutionary/i, rarity: "UR" },
    { names: ["pain", "nagato", "obito uchiha", "jiraiya"], anime: "naruto", story: /akatsuki|rinnegan|sharingan|sannin|shinobi|konoha/i, rarity: "UR" },
    { names: ["byakuya kuchiki", "ulquiorra cifer", "toushirou hitsugaya", "toshiro hitsugaya"], anime: "bleach", story: /captain|espada|hollow|shinigami|soul/i, rarity: "UR" },
    { names: ["toji fushiguro", "suguru geto", "suguru getou", "yuuta okkotsu", "yuta okkotsu"], anime: "jujutsu", story: /curse|sorcerer|zenin|jujutsu/i, rarity: "UR" },
    { names: ["zeno zoldyck", "silva zoldyck", "illumi zoldyck"], anime: "hunter", story: /zoldyck|assassin|killua|nen/i, rarity: "UR" },
    { names: ["muzan kibutsuji", "kokushibo", "akaza", "kyoujurou rengoku", "kyojuro rengoku"], anime: "demon slayer", story: /demon|hashira|upper moon|slayer|breathing/i, rarity: "UR" },
    { names: ["garou", "tatsumaki"], anime: "one punch", story: /hero|monster|psychic|martial/i, rarity: "UR" },
    { names: ["escanor", "meliodas", "ban"], anime: "seven deadly sins", story: /sin|sin of|britannia|holy knight|demon/i, rarity: "UR" },
    { names: ["all might", "toshinori yagi"], anime: "hero academia", story: /hero|quirk|one for all|symbol of peace/i, rarity: "UR" },
    { names: ["griffith"], anime: "berserk", story: /band of the hawk|guts|god hand|eclipse/i, rarity: "UR" },
    { names: ["thorfinn"], anime: "vinland", story: /viking|askeladd|warrior|thors/i, rarity: "UR" },
    { names: ["erwin smith"], anime: "titan", story: /survey corps|commander|titan/i, rarity: "UR" },
    { names: ["saber", "artoria pendragon", "archer", "emiya"], anime: "fate", story: /servant|holy grail|excalibur|master/i, rarity: "UR" },
    { names: ["frieren"], anime: "frieren", story: /elf|mage|demon king|himmel/i, rarity: "UR" },
    { names: ["makima", "denji"], anime: "chainsaw man", story: /devil|chainsaw|public safety|hunter/i, rarity: "UR" },
    { names: ["esdeath", "akame"], anime: "akame ga kill", story: /empire|night raid|imperial arms|teigu|assassin/i, rarity: "UR" },
    { names: ["yami sukehiro", "asta"], anime: "black clover", story: /magic|clover|black bull|grimoire/i, rarity: "UR" },
    { names: ["yuujirou hanma", "yujiro hanma", "baki hanma"], anime: "baki", story: /strongest|fighter|hanma|martial/i, rarity: "UR" },
    { names: ["musashi miyamoto"], anime: "vagabond", story: /sword|samurai|ronin|takezo/i, rarity: "UR" },
    { names: ["alucard"], anime: "castlevania", story: /dracula|dhampir|vampire|belmont/i, rarity: "UR" },
    { names: ["chuuya nakahara"], anime: "bungo", story: /port mafia|gravity|ability|dazai/i, rarity: "UR" }
  ];

  const STRICT_COMBAT_LORE = /\b(fight|battle|warrior|sword|demon|curse|magic|power|assassin|hunter|ninja|pirate|shinigami|sorcerer|saiyan|titan|alchemist|stand|quirk|strongest|army|vampire|mecha|martial|monster|knight|hero|villain)\b/i;

  function applyExtraLegends() {
    if (typeof characterCatalog === "undefined") return;
    characterCatalog.forEach((ch) => {
      const name = String(ch.name || "").trim().toLowerCase();
      const anime = String(ch.anime || "").trim().toLowerCase();
      const story = String(ch.bioEn || "").toLowerCase();
      const favs = Number(ch.favorites || ch.favourites || 0);

      for (const rule of EXTRA_LEGENDS) {
        if (rule.names.includes(name)) {
          const animeOk = !rule.anime || anime.includes(rule.anime);
          const storyOk = !rule.story || rule.story.test(story) || story.length < 30;
          if (animeOk && storyOk) {
            ch.rarity = rule.rarity;
            return;
          }
        }
      }

      // توسيع تلقائي آمن: يشترط عدم وجود الأنمي في القائمة المستبعدة + وجود طابع قتالي في القصة
      if (ch.rarity === "SP" || ch.rarity === "UR") return;
      const isBlocked = typeof NON_COMBAT_ANIME_RE !== "undefined" && NON_COMBAT_ANIME_RE.test(anime);
      if (isBlocked || !STRICT_COMBAT_LORE.test(story)) return;

      if (favs >= 18000) ch.rarity = "SP";
      else if (favs >= 9000) ch.rarity = "UR";
      else if (favs >= 3500) ch.rarity = "SSR";
    });
    if (typeof renderCodex === "function") renderCodex();
  }

  applyExtraLegends();
  setTimeout(applyExtraLegends, 2000);
})();
/* === الخطوة التالية: النزال التلقائي السريع (Quick Match) عبر Firebase === */
(function applyQuickMatchFeature() {
  let quickMatchTimer = null;
  let quickMatchQueueCode = null;
  let quickMatchPollRef = null;

  function injectQuickMatchUi() {
    const createBtn = document.getElementById("btnCreateRoom");
    if (!createBtn || document.getElementById("btnQuickMatch")) return;

    const wrap = document.createElement("div");
    wrap.id = "quickMatchWrap";
    wrap.style.cssText = "margin-top:10px;display:flex;flex-direction:column;gap:8px;";

    const btn = document.createElement("button");
    btn.id = "btnQuickMatch";
    btn.type = "button";
    btn.className = "secondary-btn full-w";
    btn.style.cssText = "border-color:rgba(56,189,248,0.55);background:linear-gradient(135deg,#0f2942,#163859);color:#e0f2fe;font-weight:800;";
    btn.textContent = "⚡ بحث تلقائي عن خصم (Quick Match)";

    const statusEl = document.createElement("div");
    statusEl.id = "quickMatchStatus";
    statusEl.className = "muted-text hidden";
    statusEl.style.cssText = "text-align:center;font-size:0.82rem;padding:8px;border-radius:10px;background:rgba(15,23,42,0.75);border:1px solid rgba(56,189,248,0.3);";

    wrap.appendChild(btn);
    wrap.appendChild(statusEl);
    createBtn.insertAdjacentElement("afterend", wrap);

    btn.addEventListener("click", startOrCancelQuickMatch);
  }

  function stopQuickMatchSearch(removeQueueRoom = true) {
    if (quickMatchTimer) {
      clearTimeout(quickMatchTimer);
      quickMatchTimer = null;
    }
    if (quickMatchPollRef) {
      quickMatchPollRef.off();
      quickMatchPollRef = null;
    }
    if (removeQueueRoom && quickMatchQueueCode && db) {
      db.ref(`duels/${quickMatchQueueCode}`).remove().catch(() => {});
    }
    quickMatchQueueCode = null;

    const btn = document.getElementById("btnQuickMatch");
    const statusEl = document.getElementById("quickMatchStatus");
    if (btn) btn.textContent = "⚡ بحث تلقائي عن خصم (Quick Match)";
    if (statusEl) {
      statusEl.classList.add("hidden");
      statusEl.textContent = "";
    }
  }

  async function startOrCancelQuickMatch() {
    if (quickMatchQueueCode) {
      stopQuickMatchSearch(true);
      showToast("تم إلغاء البحث التلقائي");
      return;
    }

    if (!db || !navigator.onLine) {
      return showToast("⚠️ يلزم اتصال بالإنترنت للبحث التلقائي");
    }

    if (characterCatalog.size < 6) {
      await ensureRichCatalog();
      if (characterCatalog.size < 6) return showToast("⏳ جاري تحميل الشخصيات...");
    }

    const mode = selectedDuelMode || "safe";
    const goldStake = mode === "safe"
      ? Math.max(0, Math.floor(Number(document.getElementById("inputGoldStake")?.value) || 0))
      : 0;
    const gemsStake = mode === "stake_gems" ? (selectedGemsStake || 30) : 0;

    if (mode === "safe" && goldStake > 0 && state.gold < goldStake) {
      return showToast(t("msg_no_gold"));
    }
    if (mode === "stake_gems" && state.gems < gemsStake) {
      return showToast(t("msg_no_gems"));
    }

    const btn = document.getElementById("btnQuickMatch");
    const statusEl = document.getElementById("quickMatchStatus");
    if (btn) btn.textContent = "✖️ إلغاء البحث التلقائي...";
    if (statusEl) {
      statusEl.classList.remove("hidden");
      statusEl.textContent = "🔎 جاري البحث عن غرفة متاحة بنفس النمط...";
    }

    try {
      const snap = await db.ref("duels").limitToLast(25).get();
      let matchedRoom = null;

      if (snap.exists()) {
        snap.forEach((child) => {
          const r = child.val();
          if (!r || matchedRoom) return;
          const isOpen = r.status === "waiting" && !r.p2 && r.p1?.uid !== state.uid;
          const sameMode = (r.duelType || "safe") === mode;
          const sameGold = mode !== "safe" || Number(r.goldStake || 0) === goldStake;
          const sameGems = mode !== "stake_gems" || Number(r.gemsStake || 30) === gemsStake;

          if (isOpen && sameMode && sameGold && sameGems) {
            matchedRoom = r;
          }
        });
      }

      if (matchedRoom) {
        stopQuickMatchSearch(false);
        const inputEl = document.getElementById("inputRoomCode");
        if (inputEl) inputEl.value = matchedRoom.code;
        await joinOnlineRoom(matchedRoom.code);
        return;
      }

      // إنشاء غرفة انتظار عامة إذا لم توجد غرفة جاهزة
      const code = String(Math.floor(1000 + Math.random() * 9000));
      const boardCards = pickSixUniqueRarityCards().map((c) => ({
        id: c.id, name: c.name, image: c.image, rarity: c.rarity
      }));

      await db.ref(`duels/${code}`).set({
        code,
        duelType: mode,
        goldStake,
        gemsStake,
        isQuickMatch: true,
        status: "waiting",
        turn: "p1",
        cards: boardCards,
        picked: ["", "", "", "", "", ""],
        p1: { uid: state.uid, name: state.name, consent: false, stakeCard: null },
        p2: null,
        createdAt: Date.now()
      });

      quickMatchQueueCode = code;
      if (statusEl) {
        statusEl.textContent = `⏳ تم إنشاء غرفة انتظار (${code}) — بانتظار انضمام خصم...`;
      }

      quickMatchPollRef = db.ref(`duels/${code}/p2`);
      quickMatchPollRef.on("value", (p2Snap) => {
        if (!quickMatchQueueCode || code !== quickMatchQueueCode) return;
        if (p2Snap.exists() && p2Snap.val()?.uid) {
          const joinedCode = quickMatchQueueCode;
          stopQuickMatchSearch(false);
          attachToRoom(joinedCode, "p1");
        }
      });

      // مهلة تلقائية 35 ثانية إذا لم ينضم أحد
      quickMatchTimer = setTimeout(() => {
        if (quickMatchQueueCode === code) {
          stopQuickMatchSearch(true);
          showToast("⌛ لم يتم العثور على خصم حالياً — جرّب إنشاء غرفة بكود");
        }
      }, 35000);
    } catch (_) {
      stopQuickMatchSearch(true);
      showToast("⚠️ تعذر إتمام البحث التلقائي");
    }
  }

  injectQuickMatchUi();
  setTimeout(injectQuickMatchUi, 1200);

  const origLeave = leaveCurrentRoom;
  leaveCurrentRoom = function (removeFromDb = true) {
    stopQuickMatchSearch(false);
    origLeave(removeFromDb);
  };
})();
/* === مضاعفة حقيقية 2 / 4 / 8 / 16 / 32 مع تكرار نفس الشخصيتين وتنسيق واضح === */
(function applyTrueLadder2to32() {
  const LADDER = [2, 4, 8, 16, 32];

  const st = document.createElement("style");
  st.id = "monarchLadder32Css";
  st.textContent = `
    .pop-decision-box {
      display: grid !important;
      grid-template-columns: 1fr 1fr !important;
      gap: 8px !important;
      align-items: stretch !important;
    }
    .btn-cashout, .btn-double {
      display: flex !important;
      flex-direction: column !important;
      align-items: center !important;
      justify-content: center !important;
      gap: 3px !important;
      line-height: 1.25 !important;
      white-space: normal !important;
      word-break: break-word !important;
      text-align: center !important;
      min-height: 56px !important;
    }
    .pop-reward-line {
      direction: ltr;
      unicode-bidi: isolate;
      font-size: 0.78rem;
      font-weight: 800;
    }
  `;
  document.head.appendChild(st);

  let fixedPair = [];

  function getPairForLoop() {
    const pool = Array.from(characterCatalog.values()).filter(
      (c) => Number(c.favorites || c.favourites || 0) > 0 && c.image
    );
    if (pool.length < 2) return [];
    const sorted = [...pool].sort(
      (a, b) => Number(b.favorites || b.favourites || 0) - Number(a.favorites || a.favourites || 0)
    );
    const slice = sorted.slice(0, Math.min(120, sorted.length));
    for (let i = 0; i < 45; i++) {
      const a = slice[Math.floor(Math.random() * slice.length)];
      const b = slice[Math.floor(Math.random() * slice.length)];
      if (a && b && a.id !== b.id && Number(a.favorites || 0) !== Number(b.favorites || 0)) {
        return Math.random() < 0.5 ? [a, b] : [b, a];
      }
    }
    return [slice[0], slice[1]];
  }

  function getLadderMult(roundIdx) {
    const i = Math.max(0, (roundIdx || 1) - 1);
    if (i < LADDER.length) return LADDER[i];
    return LADDER[LADDER.length - 1] * Math.pow(2, i - (LADDER.length - 1));
  }

  function getGemsForMult(mult) {
    // 2 -> 4 -> 8 -> 16 -> 32 جوهرة بالتوازي مع المضاعف
    return Math.max(2, mult);
  }

  renderPopularityGame = function () {
    const box = document.getElementById("popDuelContainer");
    if (!box) return;
    box.innerHTML = "";

    if (popBetState.phase === "bet") {
      stopPopTimer();
      fixedPair = [];
      box.innerHTML = `
        <div class="pop-bet-panel" style="grid-column:1/-1;">
          <p class="muted-text">${t("pop_pick_bet")} • ${t("pop_pot")}: 🪙 + 💎 (2 / 4 / 8 / 16 / 32)</p>
          <div class="pop-bets-row">
            <button class="pop-bet-btn" data-bet="50"><span>50 🪙</span><small>${t("pop_low")}</small></button>
            <button class="pop-bet-btn" data-bet="150"><span>150 🪙</span><small>${t("pop_mid")}</small></button>
            <button class="pop-bet-btn" data-bet="400"><span>400 🪙</span><small>${t("pop_high")}</small></button>
          </div>
        </div>`;

      box.querySelectorAll(".pop-bet-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const bet = Number(btn.dataset.bet);
          if (state.gold < bet) return showToast(t("msg_no_gold"));
          if (characterCatalog.size < 10) await ensureRichCatalog();

          fixedPair = getPairForLoop();
          if (fixedPair.length < 2) return showToast("⏳ جاري تحميل الشخصيات...");

          state.gold -= bet;
          saveState();
          updateHud();

          const startMult = getLadderMult(1); // 2
          popBetState = {
            phase: "playing",
            baseBet: bet,
            multIndex: 1,
            multiplier: startMult,
            pot: bet * startMult,
            gemPot: getGemsForMult(startMult),
            round: 1,
            pair: [...fixedPair]
          };

          playSfx("click");
          renderPopularityGame();
          startPopTimer();
        });
      });
      return;
    }

    if (fixedPair.length === 2) {
      popBetState.pair =
        popBetState.round % 2 === 0 ? [fixedPair[1], fixedPair[0]] : [fixedPair[0], fixedPair[1]];
    }

    const curRound = popBetState.multIndex || popBetState.round || 1;
    const curMult = getLadderMult(curRound);
    const nextMult = getLadderMult(curRound + 1);
    const curPot = popBetState.baseBet * curMult;
    const nextPot = popBetState.baseBet * nextMult;
    const curGems = getGemsForMult(curMult);
    const nextGems = getGemsForMult(nextMult);

    popBetState.multiplier = curMult;
    popBetState.pot = curPot;
    popBetState.gemPot = curGems;

    const hud = document.createElement("div");
    hud.className = "pop-hud-bar";
    hud.style.gridColumn = "1 / -1";
    hud.innerHTML = `
      <span>${t("pop_round")}: <b>#${popBetState.round} (×${curMult})</b></span>
      <span>${t("pop_pot")}: <b class="pop-reward-line" style="color:var(--gold);">${curPot} 🪙 + ${curGems} 💎</b></span>
    `;
    box.appendChild(hud);

    if (popBetState.phase === "playing") {
      const tw = document.createElement("div");
      tw.className = "pop-timer-wrap";
      tw.innerHTML = `
        <div id="popTimerHead" class="pop-timer-head"><span>${t("pop_time")}</span><span id="popTimerText">6.0s</span></div>
        <div class="pop-timer-track"><div id="popTimerFill" class="pop-timer-fill"></div></div>
      `;
      box.appendChild(tw);
    }

    const reveal = popBetState.phase === "decision" || popBetState.phase === "lost";
    const fav0 = Number(popBetState.pair[0]?.favorites || popBetState.pair[0]?.favourites || 0);
    const fav1 = Number(popBetState.pair[1]?.favorites || popBetState.pair[1]?.favourites || 0);
    const maxFav = Math.max(fav0, fav1);

    popBetState.pair.forEach((ch, idx) => {
      const other = popBetState.pair[1 - idx];
      const myFav = Number(ch.favorites || ch.favourites || 0);
      const otherFav = Number(other?.favorites || other?.favourites || 0);
      const fallback = makeFallbackSvg(ch.name, ch.rarity);

      const card = document.createElement("div");
      card.className = "pop-card" + (reveal ? (myFav >= maxFav ? " win-hl" : " lose-hl") : "");
      card.innerHTML = `
        ${reveal ? `<div class="pop-fav-badge">❤️ ${myFav.toLocaleString()}</div>` : ""}
        <img src="${ch.image}" alt="${ch.name}" onerror="this.onerror=null;this.src='${fallback}'" />
        <div class="pop-card-info"><h4>${ch.name}</h4><p class="muted-text">${ch.anime}</p></div>
      `;

      if (popBetState.phase === "playing") {
        card.addEventListener("click", () => {
          stopPopTimer();
          if (myFav >= otherFav) {
            popBetState.phase = "decision";
            playSfx("win");
            renderPopularityGame();
          } else {
            popBetState.phase = "lost";
            showToast(t("pop_lost"));
            renderPopularityGame();
            setTimeout(() => {
              popBetState.phase = "bet";
              fixedPair = [];
              renderPopularityGame();
            }, 1600);
          }
        });
      }
      box.appendChild(card);
    });

    if (popBetState.phase === "decision") {
      const dec = document.createElement("div");
      dec.className = "pop-decision-box";
      dec.style.gridColumn = "1 / -1";

      dec.innerHTML = `
        <button id="btnPopCashout" class="btn-cashout">
          <span>💰 ${t("pop_cashout")}</span>
          <span class="pop-reward-line">+${curPot} 🪙 + ${curGems} 💎</span>
        </button>
        <button id="btnPopDouble" class="btn-double">
          <span>🔥 ×${nextMult}</span>
          <span class="pop-reward-line">${nextPot} 🪙 + ${nextGems} 💎</span>
        </button>
      `;
      box.appendChild(dec);

      document.getElementById("btnPopCashout").addEventListener("click", () => {
        state.gold += curPot;
        state.gems += curGems;
        saveState();
        updateHud();
        playSfx("win");
        showToast(`${t("pop_cashed")} +${curPot} 🪙 | +${curGems} 💎`);
        popBetState.phase = "bet";
        fixedPair = [];
        renderPopularityGame();
      });

      document.getElementById("btnPopDouble").addEventListener("click", () => {
        popBetState.round += 1;
        popBetState.multIndex = curRound + 1;
        popBetState.multiplier = nextMult;
        popBetState.pot = nextPot;
        popBetState.gemPot = nextGems;
        popBetState.phase = "playing";
        playSfx("click");
        renderPopularityGame();
        startPopTimer();
      });
    }
  };
})();


})();

function forceOfflineEnterApp() {
  const btnStart = document.getElementById("btnStartGame");
  const startScreen = document.getElementById("startScreen");
  const appShell = document.getElementById("appShell");
  if (!btnStart || btnStart.dataset.offlineBound === "1") return;
  btnStart.dataset.offlineBound = "1";
  btnStart.addEventListener("click", () => {
    if (startScreen) { startScreen.classList.add("hidden"); startScreen.style.display = "none"; }
    if (appShell) { appShell.classList.remove("hidden"); appShell.style.display = ""; }
  });
}
if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", forceOfflineEnterApp);
else forceOfflineEnterApp();
window.addEventListener("load", forceOfflineEnterApp);
