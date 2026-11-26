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
     2. حقن تنسيقات إصلاح الإطار والمؤقت والتلميح تلقائياً
  ========================================================= */
  (function injectCoreFixStyles() {
    if (document.getElementById("monarchV5Css")) return;
    const st = document.createElement("style");
    st.id = "monarchV5Css";
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
      .clue-emblem { width: 64px; height: 64px; border-radius: 18px; background: rgba(245,197,66,0.14); border: 2px solid var(--gold); display: flex; align-items: center; justify-content: center; font-size: 2rem; box-shadow: 0 0 18px rgba(245,197,66,0.25); }
      .clue-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-top: 4px; }
      .clue-tag { background: rgba(255,255,255,0.07); border: 1px solid rgba(245,197,66,0.35); color: var(--gold); padding: 4px 10px; border-radius: 999px; font-size: 0.76rem; font-weight: 700; }
      .codex-load-more { grid-column: 1 / -1; text-align: center; padding: 8px 0; }
    `;
    document.head.appendChild(st);
  })();

  /* =========================================================
     3. قواعد اللعبة، الحزم، والتصنيف الأسطوري الصارم
  ========================================================= */
  const RANK_POWER = { N: 1, C: 2, R: 3, SR: 4, SSR: 5, UR: 6, SP: 7 };
  const LIMITED_CAPS = { SP: 1, UR: 3, SSR: 10 };
  const INACTIVITY_DAYS = { SP: 7, UR: 14, SSR: 30 };
  const DAY_MS = 24 * 60 * 60 * 1000;
  const DUP_GOLD_REWARD = { N: 30, C: 60, R: 130, SR: 280, SSR: 700, UR: 1500, SP: 3000 };

  // حزم المتجر بنسب نادرة حقيقية (1/500 فأقل للنوادر) ومنع تسرّبها في N و C
  const SHOP_PACKS = [
    { id: "pack_N", rarity: "N", gold: 60, gem: 0, rates: { N: 74, C: 21, R: 5 } },
    { id: "pack_C", rarity: "C", gold: 120, gem: 0, rates: { N: 16, C: 62, R: 19, SR: 3 } },
    { id: "pack_R", rarity: "R", gold: 250, gem: 0, rates: { C: 18, R: 62, SR: 19.9, SSR: 0.1 } },
    { id: "pack_SR", rarity: "SR", gold: 500, gem: 3, rates: { R: 22, SR: 77.75, SSR: 0.15, UR: 0.08, SP: 0.02 } },
    { id: "pack_SSR", rarity: "SSR", gold: 950, gem: 7, rates: { R: 10, SR: 89.65, SSR: 0.2, UR: 0.1, SP: 0.05 } },
    { id: "pack_UR", rarity: "UR", gold: 0, gem: 14, rates: { SR: 99.65, SSR: 0.15, UR: 0.14, SP: 0.06 } },
    { id: "pack_SP", rarity: "SP", gold: 0, gem: 25, rates: { SR: 99.6, SSR: 0.15, UR: 0.15, SP: 0.1 } }
  ];

  // SP: الأقوى مطلقاً في عالمهم وعالم الأنمي فقط
  const SP_GOD_RE = /\b(son goku|goku|saitama|satoru gojo|gojo satoru|ryomen sukuna|sukuna|sung jin-?woo|jin-?woo|monkey d\.?\s*luffy|luffy|madara uchiha|hashirama senju|naruto uzumaki|sasuke uchiha|sousuke aizen|aizen|ichigo kurosaki|yhwach|yamamoto|rimuru tempest|anos voldigoad|gilgamesh|beerus|whis|zeno|edward newgate|whitebeard|shanks|kaido|yoriichi tsugikuni|meruem|isaac netero|alucard|ainz ooal gown|giorno giovanna|shigeo kageyama|mob|reinhard van astrea|guts|sinbad|simon|anti-spiral|jin mori|kaguya otsutsuki|isshiki)\b/i;

  // UR: أقوى شخصيتين بعد القمة والأكثر مهارة وذكاءً وعبقرية
  const UR_ELITE_RE = /\b(vegeta|gohan|broly|frieza|piccolo|roronoa zoro|zoro|dracule mihawk|mihawk|trafalgar|doflamingo|portgas d\.?\s*ace|sabo|monkey d\.?\s*garp|garp|itachi uchiha|minato namikaze|kakashi hatake|pain|nagato|obito uchiha|jiraiya|levi ackerman|levi|eren yeager|eren jaeger|mikasa ackerman|kenpachi zaraki|byakuya kuchiki|ulquiorra|toshiro hitsugaya|toji fushiguro|yuta okkotsu|suguru geto|killua zoldyck|hisoka|chrollo|kurapika|gon freecss|lelouch|l lawliet|light yagami|roy mustang|edward elric|muzan kibutsuji|kokushibo|akaza|kyojuro rengoku|tanjiro kamado|garou|tatsumaki|escanor|meliodas|ban|dio brando|jotaro kujo|ken kaneki|all might|izuku midoriya|katsuki bakugou|bakugo|shoto todoroki|griffith|thorfinn|erwin smith|shikamaru nara|dazai osamu|chuuya nakahara|artoria pendragon|saber|archer|emiya|frieren|makima|denji|esdeath|akame|erza scarlet|natsu dragneel|yami sukehiro|asta|yujiro hanma|baki hanma|spike spiegel|gintoki sakata|kamina|shinra kusakabe)\b/i;

  // أعمال غير قتالية (لا تدخل أبداً في SP أو UR أو SSR)
  const NON_COMBAT_ANIME_RE = /k-on|silent voice|koe no katachi|clannad|toradora|kaguya|horimiya|bocchi|oregairu|fruits basket|your lie in april|hyouka|nichijou|lucky star|nisekoi|love live|kimi ni todoke|violet evergarden|anohana|angel beats|haruhi|monogatari|dress-up|komi|bunny girl|rascal does not dream|darling in the franxx|re:zero|steins;gate|oreimo|haikyuu|blue lock|kuroko|spy x family|oregairu|land of the lustrous|houseki no kuni|no game, no life/i;
  const COMBAT_GENRES = ["Action", "Adventure", "Fantasy", "Supernatural", "Sci-Fi", "Mecha"];

  function classifyStrictRarity(ch) {
    const name = String(ch.name || "");
    const anime = String(ch.anime || "");
    const favs = Number(ch.favorites || 0);
    const genres = Array.isArray(ch.genres) ? ch.genres : [];

    // 1. استثناء صارم لـ SP (القمة المطلقة فقط)
    if (SP_GOD_RE.test(name) && !/darling in the franxx/i.test(anime)) return "SP";
    // 2. استثناء صارم لـ UR (الأقوى بعد القمة والعباقرة المهرة)
    if (UR_ELITE_RE.test(name)) return "UR";

    // 3. منع أي شخصية من أعمال غير قتالية أو شريحة حياة من دخول SSR/UR/SP
    const isBlockedAnime = NON_COMBAT_ANIME_RE.test(anime);
    const isCombat = !isBlockedAnime && (genres.length === 0 ? favs >= 6000 : genres.some((g) => COMBAT_GENRES.includes(g)));

    if (isCombat) {
      if (favs >= 8500) return "SSR";
      if (favs >= 3200) return "SR";
      if (favs >= 1100) return "R";
      if (favs >= 350) return "C";
      return "N";
    }

    if (favs >= 10000) return "SR";
    if (favs >= 3500) return "R";
    if (favs >= 900) return "C";
    return "N";
  }

  /* =========================================================
     4. قاموس الترجمة الشامل للغات الأربع (AR / EN / FR / JA)
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
      btn_5050: "✂️ حذف إجابتين", btn_skip: "⏭️ سؤال جديد", pop_title: "أي شخصية أكثر شعبية؟",
      online_tab_arena: "⚔️ ساحة 1 ضد 1", online_tab_challenges: "📩 التحديات", online_tab_leaders: "🏆 المتصدرون",
      online_title: "نزال الـ 6 بطاقات المباشر", online_sub: "اختر نمط المواجهة وتحدّ خصمك بكود الغرفة المباشر",
      lbl_duel_mode: "اختر نوع المواجهة:", mode_safe_title: "نزال آمن", mode_safe_desc: "ذهب + جواهر + كؤوس بدون مخاطرة",
      mode_gems_title: "رهان الجواهر", mode_gems_desc: "30 💎 للفائز بموافقة الطرفين",
      mode_card_title: "رهان بطاقة نادرة", mode_card_desc: "مواجهة مصيرية على بطاقات النوادر",
      lbl_pick_stake: "اضغط على بطاقتك النادرة للرهان:", btn_create_room: "➕ إنشاء غرفة نزال جديدة",
      ph_room_code: "كود من 4 أرقام", btn_join_room: "دخول", lbl_room_code: "الكود", btn_leave: "خروج",
      consent_warn: "⚠️ نزال رهان: يتطلب موافقة الطرفين قبل البدء", btn_agree: "✅ أوافق على الرهان", btn_cancel: "❌ إلغاء",
      ch_title: "📩 تحديات البطاقات النادرة", ch_desc: "عندما يتحداك لاعب من سجل النوادر على بطاقتك، يظهر التحدي هنا.",
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
      trivia_who: "Who is this character?", trivia_clue: "Guess the character by their weapon or power!", trivia_lore: "Who does this story belong to?",
      btn_5050: "✂️ 50/50 Cut", btn_skip: "⏭️ New Question", pop_title: "Which character is more popular?",
      online_tab_arena: "⚔️ 1v1 Arena", online_tab_challenges: "📩 Challenges", online_tab_leaders: "🏆 Leaderboard",
      online_title: "Live 6-Card Duel", online_sub: "Pick your duel mode and battle live with a room code",
      lbl_duel_mode: "Select Duel Mode:", mode_safe_title: "Safe Duel", mode_safe_desc: "Gold + Gems + Trophies with zero risk",
      mode_gems_title: "Gem Wager", mode_gems_desc: "30 💎 to winner with mutual consent",
      mode_card_title: "Rare Card Stake", mode_card_desc: "High-stakes clash for rare limited cards",
      lbl_pick_stake: "Tap your rare card to stake:", btn_create_room: "➕ Create Duel Room",
      ph_room_code: "4-digit code", btn_join_room: "Join", lbl_room_code: "Code", btn_leave: "Leave",
      consent_warn: "⚠️ Wager Duel: Both players must agree before starting", btn_agree: "✅ Agree to Stake", btn_cancel: "❌ Cancel",
      ch_title: "📩 Rare Card Challenges", ch_desc: "Incoming challenges from players wanting your rare cards appear here.",
      lead_title: "🏆 Server Champions (Top 20)", shop_title: "🛒 Legendary Pack Shop",
      shop_sub: "Summon iconic anime heroes — true limited rares await the luckiest!",
      inv_title: "My Cards", inv_unlimited: "∞ Unlimited Vault", ph_search_cards: "🔍 Search by name or anime...",
      filter_all: "All", btn_load_more: "Load More ⬇️",
      codex_title: "👑 Legends & Rares Codex", codex_sub: "Tap any card to read its full dossier or challenge its owner",
      ph_search_rare: "🔍 Search any anime legend...", btn_claim: "Awesome! Claim",
      set_title: "⚙️ Settings & Profile", set_name: "Server Player Name:", btn_save: "Save",
      set_lang: "Language:", set_bgm: "🎵 Background Music", set_sfx: "🔔 Sound Effects",
      set_uid: "Account ID", set_shield: "Protection Shield", set_pool: "Loaded Characters",
      pack_N: "Starter Pack", pack_N_desc: "Core anime heroes summon",
      pack_C: "Adventurer Pack", pack_C_desc: "Higher chance for fan-favorite heroes",
      pack_R: "Elite Pack", pack_R_desc: "Iconic fighters from hit series",
      pack_SR: "Captain Pack", pack_SR_desc: "Strong heroes & a shot at legends",
      pack_SSR: "Mythic Pack", pack_SSR_desc: "Gateway to global rare editions",
      pack_UR: "Ultra Pack", pack_UR_desc: "Crafted for rare card hunters",
      pack_SP: "Monarch Pack", pack_SP_desc: "The ultimate royal summon",
      lbl_anime: "Anime", lbl_pop: "Popularity", lbl_serial: "Edition", lbl_bio: "📜 Biography & Lore",
      lbl_owners: "👑 Current Owners", lbl_free_slots: "Available in Shop", lbl_unlimited_copy: "Standard Unlimited Edition",
      btn_challenge: "⚔️ Challenge", btn_recycle: "♻️ Convert to", btn_accept: "Accept", btn_reject: "Decline",
      msg_loading_bio: "Loading dossier...", msg_no_cards: "No cards yet — open a pack in the Shop!",
      msg_no_rares_stake: "You have no limited rare card (SSR/UR/SP) to stake yet.", msg_no_gold: "⚠️ Not enough Gold!",
      msg_no_gems: "⚠️ Not enough Gems!", msg_shield_off: "Inactive",
      msg_protected: "👑 Protected Rare Card (only won or lost in Wager Duels)",
      msg_waiting_opp: "Waiting for opponent...", msg_your_turn: "🟢 Your turn! Pick a card", msg_opp_turn: "⏳ Waiting for opponent...",
      msg_memorize: "👀 Memorize the 6 cards!", msg_shuffling: "🔀 Rapid shuffling...",
      msg_win: "🏆 Victory!", msg_lose: "Defeat — try again!", msg_saved: "✅ Saved!",
      dup_converted: "♻️ Duplicate card! Converted to Gold:", codex_more: "🔄 Load More Legends",
      codex_searching: "🔍 Searching...", pop_pick_bet: "Pick your wager (6s timer per round • Double ×2):",
      pop_low: "Low Risk", pop_mid: "Medium Risk", pop_high: "High Risk",
      pop_round: "Round", pop_pot: "Pot", pop_risk: "Risk", pop_time: "⏱️ Time",
      pop_cashout: "💰 Cash Out", pop_double: "🔥 Double ×2",
      pop_lost: "💥 Wager lost!", pop_timeout: "⏰ Time's up! Wager lost", pop_cashed: "✅ Prize collected!"
    },
    fr: {
      app_title: "Légendes des Cartes Anime", app_subtitle: "Collectionne les Rares • Duel en Ligne • Prends le Trône",
      start_play: "Jouer", nav_arena: "Arène", nav_online: "En ligne", nav_shop: "Boutique", nav_cards: "Mes Cartes", nav_codex: "Raretés",
      solo_shuffle: "🎴 Duel 6 Cartes", solo_trivia: "🧠 Quiz Anime", solo_pop: "🔥 Popularité",
      shuffle_title: "Duel Mémoire (6 Cartes)", shuffle_ready: "Choisis la difficulté",
      diff_normal: "Normal (+2 💎)", diff_hard: "Difficile (+3 💎)", diff_legend: "Légendaire (+4 💎)",
      lbl_you: "Toi", lbl_opp: "Adversaire", shuffle_hint: "Mémorise les cartes !", btn_start_duel: "⚡ Lancer le Duel",
      trivia_title: "Quiz Personnages & Pouvoirs", lbl_streak: "Série",
      tmode_img: "🖼️ Image", tmode_sil: "🗡️ Arme / Pouvoir", tmode_lore: "📜 Histoire",
      trivia_who: "Qui est ce personnage ?", trivia_clue: "Devine le personnage grâce à son arme ou pouvoir !", trivia_lore: "À qui appartient cette histoire ?",
      btn_5050: "✂️ 50/50", btn_skip: "⏭️ Suivant", pop_title: "Quel personnage est le plus populaire ?",
      online_tab_arena: "⚔️ Arène 1v1", online_tab_challenges: "📩 Défis", online_tab_leaders: "🏆 Classement",
      online_title: "Duel Direct 6 Cartes", online_sub: "Choisis ton mode et affronte un joueur avec un code",
      lbl_duel_mode: "Mode de Duel :", mode_safe_title: "Duel Sûr", mode_safe_desc: "Or + Gemmes + Trophées sans risque",
      mode_gems_title: "Pari Gemmes", mode_gems_desc: "30 💎 au vainqueur avec accord mutuel",
      mode_card_title: "Pari Carte Rare", mode_card_desc: "Duel décisif pour cartes rares limitées",
      lbl_pick_stake: "Choisis ta carte rare à miser :", btn_create_room: "➕ Créer une Salle",
      ph_room_code: "Code à 4 chiffres", btn_join_room: "Rejoindre", lbl_room_code: "Code", btn_leave: "Quitter",
      consent_warn: "⚠️ Duel à enjeu : accord des deux joueurs requis", btn_agree: "✅ Accepter le Pari", btn_cancel: "❌ Annuler",
      ch_title: "📩 Défis de Cartes Rares", ch_desc: "Les défis envoyés pour tes cartes rares s'affichent ici.",
      lead_title: "🏆 Champions du Serveur (Top 20)", shop_title: "🛒 Boutique de Packs",
      shop_sub: "Invoque les plus grands héros — les vraies raretés sont légendaires !",
      inv_title: "Mes Cartes", inv_unlimited: "∞ Stock Illimité", ph_search_cards: "🔍 Chercher par nom ou anime...",
      filter_all: "Tout", btn_load_more: "Afficher plus ⬇️",
      codex_title: "👑 Codex des Légendes", codex_sub: "Clique sur une carte pour lire son dossier complet",
      ph_search_rare: "🔍 Chercher une légende...", btn_claim: "Super ! Récupérer",
      set_title: "⚙️ Paramètres & Profil", set_name: "Nom du Joueur :", btn_save: "Enregistrer",
      set_lang: "Langue :", set_bgm: "🎵 Musique", set_sfx: "🔔 Effets Sonores",
      set_uid: "ID Compte", set_shield: "Bouclier", set_pool: "Personnages chargés",
      pack_N: "Pack Débutant", pack_N_desc: "Invocation de héros d'anime",
      pack_C: "Pack Aventurier", pack_C_desc: "Héros appréciés des fans",
      pack_R: "Pack Élite", pack_R_desc: "Combattants célèbres",
      pack_SR: "Pack Capitaine", pack_SR_desc: "Héros puissants & chance de légendes",
      pack_SSR: "Pack Mythique", pack_SSR_desc: "Porte vers les éditions rares",
      pack_UR: "Pack Ultra", pack_UR_desc: "Conçu pour les chasseurs de rares",
      pack_SP: "Pack Royal", pack_SP_desc: "L'invocation suprême",
      lbl_anime: "Anime", lbl_pop: "Popularité", lbl_serial: "Édition", lbl_bio: "📜 Biographie & Détails",
      lbl_owners: "👑 Propriétaires actuels", lbl_free_slots: "Dispo en Boutique", lbl_unlimited_copy: "Édition Standard Illimitée",
      btn_challenge: "⚔️ Défier", btn_recycle: "♻️ Convertir en", btn_accept: "Accepter", btn_reject: "Refuser",
      msg_loading_bio: "Traduction...", msg_no_cards: "Aucune carte — ouvre un pack en boutique !",
      msg_no_rares_stake: "Aucune carte rare (SSR/UR/SP) disponible.", msg_no_gold: "⚠️ Pas assez d'or !",
      msg_no_gems: "⚠️ Pas assez de gemmes !", msg_shield_off: "Inactif",
      msg_protected: "👑 Carte Rare Protégée (uniquement en Duel Pari)",
      msg_waiting_opp: "En attente d'un adversaire...", msg_your_turn: "🟢 À toi ! Choisis une carte", msg_opp_turn: "⏳ Tour de l'adversaire...",
      msg_memorize: "👀 Mémorise les 6 cartes !", msg_shuffling: "🔀 Mélange rapide...",
      msg_win: "🏆 Victoire !", msg_lose: "Défaite — réessaie !", msg_saved: "✅ Enregistré !",
      dup_converted: "♻️ Carte en double ! Convertie en Or :", codex_more: "🔄 Charger plus de Légendes",
      codex_searching: "🔍 Recherche...", pop_pick_bet: "Choisis ta mise (chrono 6s • Doubler ×2) :",
      pop_low: "Risque Faible", pop_mid: "Risque Moyen", pop_high: "Haut Risque",
      pop_round: "Manche", pop_pot: "Gains", pop_risk: "Difficulté", pop_time: "⏱️ Temps",
      pop_cashout: "💰 Encaisser", pop_double: "🔥 Doubler ×2",
      pop_lost: "💥 Mise perdue !", pop_timeout: "⏰ Temps écoulé ! Mise perdue", pop_cashed: "✅ Gains encaissés !"
    },
    ja: {
      app_title: "アニメカード・レジェンド", app_subtitle: "限定レア収集 • オンライン対戦 • 王座を奪え",
      start_play: "ゲーム開始", nav_arena: "アリーナ", nav_online: "オンライン", nav_shop: "ショップ", nav_cards: "所持カード", nav_codex: "限定図鑑",
      solo_shuffle: "🎴 6枚カード決闘", solo_trivia: "🧠 アニメクイズ", solo_pop: "🔥 人気対決",
      shuffle_title: "記憶決闘 (6枚)", shuffle_ready: "難易度を選んで開始",
      diff_normal: "普通 (+2 💎)", diff_hard: "難しい (+3 💎)", diff_legend: "伝説 (+4 💎)",
      lbl_you: "あなた", lbl_opp: "相手", shuffle_hint: "カードの位置を記憶せよ！", btn_start_duel: "⚡ 決闘開始",
      trivia_title: "キャラ＆能力クイズ", lbl_streak: "連勝",
      tmode_img: "🖼️ 画像", tmode_sil: "🗡️ 武器・能力", tmode_lore: "📜 ストーリー",
      trivia_who: "このキャラクターは誰？", trivia_clue: "武器や能力のヒントからキャラを当てよう！", trivia_lore: "この物語の主人公は誰？",
      btn_5050: "✂️ 2択削除", btn_skip: "⏭️ 次の問題", pop_title: "より人気のあるキャラは？",
      online_tab_arena: "⚔️ 1対1対戦", online_tab_challenges: "📩 挑戦状", online_tab_leaders: "🏆 ランキング",
      online_title: "リアルタイム6枚決闘", online_sub: "モードを選んでルームコードで対戦しよう",
      lbl_duel_mode: "対戦モード選択：", mode_safe_title: "安全マッチ", mode_safe_desc: "リスクなしで報酬＆トロフィー獲得",
      mode_gems_title: "ジェム賭け戦", mode_gems_desc: "双方同意で勝者に30 💎",
      mode_card_title: "限定カード争奪戦", mode_card_desc: "希少カードを懸けた真剣勝負",
      lbl_pick_stake: "賭けるレアカードを選択：", btn_create_room: "➕ ルーム作成",
      ph_room_code: "4桁コード", btn_join_room: "参加", lbl_room_code: "コード", btn_leave: "退出",
      consent_warn: "⚠️ 賭け対戦：開始前に双方の同意が必要です", btn_agree: "✅ 条件に同意", btn_cancel: "❌ キャンセル",
      ch_title: "📩 レアカード挑戦状", ch_desc: "図鑑から届いた対戦申し込みがここに表示されます。",
      lead_title: "🏆 サーバートップ20", shop_title: "🛒 伝説ガチャショップ",
      shop_sub: "名作アニメの英雄を召喚！真の限定レアは選ばれし者だけ。",
      inv_title: "所持カード", inv_unlimited: "∞ 無制限ボックス", ph_search_cards: "🔍 キャラ名・作品名で検索...",
      filter_all: "すべて", btn_load_more: "さらに表示 ⬇️",
      codex_title: "👑 伝説レア図鑑", codex_sub: "カードをタップして詳細プロフィールを確認",
      ph_search_rare: "🔍 伝説キャラを検索...", btn_claim: "受け取る！",
      set_title: "⚙️ 設定とプロフィール", set_name: "プレイヤー名：", btn_save: "保存",
      set_lang: "言語 / Language:", set_bgm: "🎵 BGM音楽", set_sfx: "🔔 効果音",
      set_uid: "アカウントID", set_shield: "保護シールド", set_pool: "読込済みキャラ数",
      pack_N: "スターターパック", pack_N_desc: "人気アニメキャラの基本召喚",
      pack_C: "冒険者パック", pack_C_desc: "定番ヒーローが出やすいパック",
      pack_R: "エリートパック", pack_R_desc: "名作の精鋭キャラが集結",
      pack_SR: "隊長パック", pack_SR_desc: "強力キャラ＆伝説のチャンス",
      pack_SSR: "神話パック", pack_SSR_desc: "世界限定レアへの扉",
      pack_UR: "ウルトラパック", pack_UR_desc: "レアハンター専用召喚",
      pack_SP: "王族パック", pack_SP_desc: "最高峰のロイヤル召喚",
      lbl_anime: "作品名", lbl_pop: "人気度", lbl_serial: "シリアル", lbl_bio: "📜 プロフィール・詳細",
      lbl_owners: "👑 現在の所有者", lbl_free_slots: "ショップ在庫", lbl_unlimited_copy: "通常無制限エディション",
      btn_challenge: "⚔️ 挑戦", btn_recycle: "♻️ 変換する", btn_accept: "承諾", btn_reject: "拒否",
      msg_loading_bio: "翻訳中...", msg_no_cards: "カードがありません。ショップで引いてみよう！",
      msg_no_rares_stake: "賭けられる限定カード(SSR/UR/SP)がありません。", msg_no_gold: "⚠️ ゴールド不足！",
      msg_no_gems: "⚠️ ジェム不足！", msg_shield_off: "未発動",
      msg_protected: "👑 保護レアカード（賭け決闘でのみ移動）",
      msg_waiting_opp: "対戦相手を待っています...", msg_your_turn: "🟢 あなたの番！カードを選択", msg_opp_turn: "⏳ 相手の選択を待っています...",
      msg_memorize: "👀 6枚のカードを記憶せよ！", msg_shuffling: "🔀 高速シャッフル中...",
      msg_win: "🏆 勝利！", msg_lose: "敗北 — 再挑戦しよう！", msg_saved: "✅ 保存しました！",
      dup_converted: "♻️ 重複カード！ゴールドに変換：", codex_more: "🔄 伝説キャラをさらに読み込む",
      codex_searching: "🔍 検索中...", pop_pick_bet: "賭け金を選択（制限時間6秒 • 2倍チャレンジ）：",
      pop_low: "低リスク", pop_mid: "中リスク", pop_high: "高リスク",
      pop_round: "ラウンド", pop_pot: "賞金", pop_risk: "難易度", pop_time: "⏱️ 残り時間",
      pop_cashout: "💰 賞金を受け取る", pop_double: "🔥 続行して2倍",
      pop_lost: "💥 賭け金没収！", pop_timeout: "⏰ 時間切れ！賭け金没収", pop_cashed: "✅ 賞金を獲得！"
    }
  };

  function t(key) {
    return (I18N[state.lang] && I18N[state.lang][key]) || I18N.ar[key] || key;
  }

  /* =========================================================
     5. حالة اللاعب والتخزين + تصحيح تصنيف البطاقات القديمة تلقائياً
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

    // تصحيح تلقائي لتصنيف أي بطاقة موجودة مسبقاً في مخزون اللاعب
    let changed = false;
    state.inventory.forEach((c) => {
      const fixedRarity = classifyStrictRarity({ name: c.name, anime: c.anime, favorites: c.favorites || 0 });
      if (c.rarity !== fixedRarity) {
        c.rarity = fixedRarity;
        if (!LIMITED_CAPS[fixedRarity]) {
          c.serial = null;
          c.maxCopies = null;
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
      const arr = Array.from(characterCatalog.values()).slice(0, 360);
      localStorage.setItem(CACHE_CHARS_KEY, JSON.stringify(arr));
    } catch (_) {}
  }
  /* =========================================================
     6. جلب الشخصيات من AniList وتنظيف البيانات
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
      favorites: Number(raw.favorites || 0),
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
      // صفحات متوازنة: 1-2 للأساطير SP/UR/SSR، 12 لـ SR/R، و 50 و 100 لـ C/N
      const pages = characterCatalog.size < 80 ? [1, 2, 12, 50, 100] : [codexPageCursor++];
      for (const p of pages) {
        await fetchAniListPage(p);
      }
      initStartScreenBackground();
      updateHud();
      renderCodex();
    } catch (err) {
      console.warn("AniList fetch skipped:", err);
    } finally {
      isFetchingAniList = false;
    }
  }

  /* =========================================================
     7. الترجمة التلقائية + نظام تلميحات الأسلحة والقدرات اللانهائي
  ========================================================= */
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
    return getTranslatedText(`bio_${charObj.id}`, charObj.bioEn || `${charObj.name} from ${charObj.anime}.`);
  }

  // تلميحات أيقونية لأشهر الشخصيات + استخراج تلقائي لا نهائي من وصف وأنمي أي شخصية أخرى
  const ICONIC_CLUES = [
    { re: /gojo/i, icon: "🤞", clueEn: "Blindfold, Six Eyes, Limitless & Domain Expansion: Unlimited Void" },
    { re: /sukuna/i, icon: "🔥", clueEn: "King of Curses, 20 Cursed Fingers & Malevolent Shrine" },
    { re: /luffy/i, icon: "👒", clueEn: "Straw Hat, Gum-Gum Fruit & Gear 5" },
    { re: /zoro/i, icon: "⚔️", clueEn: "Three-Sword Style (Santoryu), Enma & Green Hair" },
    { re: /goku/i, icon: "🟠", clueEn: "Power Pole, Kamehameha & Ultra Instinct" },
    { re: /vegeta/i, icon: "👑", clueEn: "Prince of All Saiyans, Final Flash & Galick Gun" },
    { re: /naruto/i, icon: "🍥", clueEn: "Nine-Tails Fox (Kurama), Rasengan & Shadow Clones" },
    { re: /sasuke/i, icon: "⚡", clueEn: "Sharingan, Rinnegan, Chidori & Sword of Kusanagi" },
    { re: /itachi/i, icon: "👁️", clueEn: "Mangekyo Sharingan, Tsukuyomi, Amaterasu & Crows" },
    { re: /levi/i, icon: "🗡️", clueEn: "ODM Gear, Dual Blades & Humanity's Strongest Soldier" },
    { re: /jin-?woo/i, icon: "🌑", clueEn: "Twin Daggers, 'Arise' Command & Shadow Monarch Army" },
    { re: /saitama/i, icon: "🥊", clueEn: "Yellow Suit, Red Gloves & Defeats any enemy in One Punch" },
    { re: /ichigo/i, icon: "🗡️", clueEn: "Zangetsu, Getsuga Tenshou & Substitute Soul Reaper" },
    { re: /aizen/i, icon: "👓", clueEn: "Kyoka Suigetsu (Complete Hypnosis) & Hogyoku" },
    { re: /guts/i, icon: "⚔️", clueEn: "Dragon Slayer Greatsword & Berserker Armor" },
    { re: /killua/i, icon: "⚡", clueEn: "Yo-Yos, Godspeed Lightning & Zoldyck Assassin" },
    { re: /tanjiro/i, icon: "🌊", clueEn: "Black Nichirin Blade, Hanafuda Earrings & Sun Breathing" },
    { re: /light yagami/i, icon: "📓", clueEn: "Black Notebook that kills anyone whose name is written in it" },
    { re: /l lawliet/i, icon: "🍰", clueEn: "World's Greatest Detective, sits crouched & loves sweets" },
    { re: /lelouch/i, icon: "♟️", clueEn: "Zero Mask, Chess Mastermind & Geass of Absolute Obedience" },
    { re: /edward elric/i, icon: "🦾", clueEn: "Automail Right Arm, Red Coat & Fullmetal Alchemist" },
    { re: /roy mustang/i, icon: "🔥", clueEn: "Ignition Gloves & Snap of fingers creates Flame Alchemy" },
    { re: /gilgamesh/i, icon: "👑", clueEn: "Gate of Babylon, Golden Armor & Sword of Rupture Ea" },
    { re: /alucard/i, icon: "🔫", clueEn: "Red Trench Coat, Jackal & Casull Pistols, Vampire King" },
    { re: /dio/i, icon: "⏱️", clueEn: "The World Stand, Time Stop & Throwing Knives" },
    { re: /jotaro/i, icon: "⭐", clueEn: "Star Platinum Stand, Torn Cap & 'Yare Yare Daze'" },
    { re: /kaneki/i, icon: "🎭", clueEn: "Zipper Mask, Red Rinkaku Kagune & Eyepatch" },
    { re: /bakugou|bakugo/i, icon: "💥", clueEn: "Grenade Gauntlets & Explosion Quirk" },
    { re: /midoriya/i, icon: "⚡", clueEn: "Green Lightning, Full Cowling & One For All" }
  ];

  function buildDynamicClueEn(ch) {
    const iconic = ICONIC_CLUES.find((x) => x.re.test(ch.name || ""));
    if (iconic) return { icon: iconic.icon, textEn: iconic.clueEn };

    const bio = ch.bioEn || "";
    const lower = bio.toLowerCase();
    let icon = "✨";
    if (/sword|blade|katana|scythe|spear/i.test(lower)) icon = "⚔️";
    else if (/gun|pistol|rifle|sniper/i.test(lower)) icon = "🔫";
    else if (/magic|spell|wizard|witch|mana/i.test(lower)) icon = "🔮";
    else if (/fire|flame|burn|inferno/i.test(lower)) icon = "🔥";
    else if (/ice|frost|snow|water/i.test(lower)) icon = "❄️";
    else if (/thunder|lightning|electric/i.test(lower)) icon = "⚡";
    else if (/king|queen|prince|emperor|captain|leader/i.test(lower)) icon = "👑";
    else if (/demon|vampire|devil|curse|shadow/i.test(lower)) icon = "🌑";
    else if (/mecha|robot|eva|pilot/i.test(lower)) icon = "🤖";

    // استخراج جملة مميزة تحتوي على قدرة أو سلاح أو لقب مع إخفاء اسم الشخصية
    const firstWord = (ch.name || "").split(" ")[0];
    const sentences = bio.split(/(?<=[.!?])\s+/).filter((s) => s.length > 20);
    const powerSentence = sentences.find((s) => /power|ability|weapon|sword|magic|quirk|skill|known as|leader|captain|member|strongest|fight|wields|uses/i.test(s))
      || sentences[0]
      || `A notable character from the world of ${ch.anime}.`;

    const masked = firstWord.length > 2
      ? powerSentence.replace(new RegExp(firstWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "???")
      : powerSentence;

    return { icon, textEn: masked.slice(0, 170) };
  }

  /* =========================================================
     8. الصوت والإشعارات وتطبيق اللغات الأربع
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
      osc.connect(gain);
      gain.connect(ctx.destination);
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
    if (state.bgmEnabled) {
      audio.volume = 0.35;
      audio.play().catch(() => {});
    } else {
      audio.pause();
    }
  }

  function applyLanguage(lang) {
    state.lang = I18N[lang] ? lang : "ar";
    document.documentElement.lang = state.lang;
    document.documentElement.dir = state.lang === "ar" ? "rtl" : "ltr";

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
      el.setAttribute("placeholder", t(el.getAttribute("data-i18n-placeholder")));
    });
    document.querySelectorAll(".lang-chip").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.lang === state.lang);
    });

    saveState();
    updateHud();
    renderShop();
    renderInventory(false);
    renderCodex();
    populateMyStakeCardsRow();
    if (currentTriviaAnswer) refreshTriviaView();
  }

  /* =========================================================
     9. مزامنة Firebase ونظام النسخ المحدودة + قانون النشاط
  ========================================================= */
  function syncPlayerToCloud() {
    if (!db || !navigator.onLine) return;
    const now = Date.now();
    db.ref(`players/${state.uid}`).update({
      uid: state.uid,
      name: state.name,
      trophies: state.trophies,
      rareCount: state.inventory.filter((c) => LIMITED_CAPS[c.rarity]).length,
      shieldUntil: state.shieldUntil || 0,
      lastActive: now
    }).catch(() => {});

    state.inventory.forEach((card) => {
      if (LIMITED_CAPS[card.rarity] && card.serial) {
        db.ref(`limitedCards/${card.charId}/owners/${card.serial}/lastActiveAt`).set(now).catch(() => {});
      }
    });
  }

  function cleanExpiredOwnersForCard(charId, rarity, entry) {
    if (!entry || !entry.owners) return false;
    const maxDays = INACTIVITY_DAYS[rarity];
    if (!maxDays) return false;
    const now = Date.now();
    let changed = false;
    Object.keys(entry.owners).forEach((slot) => {
      const owner = entry.owners[slot];
      if (!owner || !owner.lastActiveAt) return;
      if (now - owner.lastActiveAt > maxDays * DAY_MS) {
        delete entry.owners[slot];
        changed = true;
        if (db) db.ref(`limitedCards/${charId}/owners/${slot}`).remove().catch(() => {});
      }
    });
    return changed;
  }

  function initFirebaseListeners() {
    if (!db) return;

    db.ref("limitedCards").on("value", (snap) => {
      limitedRegistry = snap.val() || {};
      Object.keys(limitedRegistry).forEach((cid) => {
        const entry = limitedRegistry[cid];
        const ch = characterCatalog.get(Number(cid));
        const rarity = ch?.rarity || entry?.rarity;
        if (rarity && LIMITED_CAPS[rarity]) {
          cleanExpiredOwnersForCard(cid, rarity, entry);
        }
      });
      renderCodex();
    });

    db.ref(`challenges/${state.uid}`).on("value", (snap) => {
      const data = snap.val() || {};
      const list = Object.values(data).filter((c) => c.status === "pending");
      const badge = document.getElementById("incomingBadge");
      const dot = document.getElementById("navOnlineDot");
      badge.textContent = list.length;
      badge.classList.toggle("hidden", list.length === 0);
      dot.classList.toggle("hidden", list.length === 0);
      renderIncomingChallenges(list);
    });

    db.ref("players").orderByChild("trophies").limitToLast(20).on("value", (snap) => {
      const players = [];
      snap.forEach((child) => { players.push(child.val()); });
      players.sort((a, b) => (b.trophies || 0) - (a.trophies || 0));
      renderLeaderboard(players);
    });
  }
  /* =========================================================
     10. الشريط العلوي، المخزون، وملف البطاقة الاحترافي
  ========================================================= */
  let invRenderLimit = 30;
  let invFilterRarity = "ALL";
  let invSearchQuery = "";

  function updateHud() {
    document.getElementById("hudPlayerName").textContent = state.name;
    document.getElementById("startPlayerName").textContent = state.name;
    document.getElementById("hudTrophies").textContent = state.trophies;
    document.getElementById("goldCount").textContent = state.gold;
    document.getElementById("gemCount").textContent = state.gems;
    document.getElementById("ticketCount").textContent = state.tickets;
    document.getElementById("invTotalCount").textContent = state.inventory.length;
    document.getElementById("settingsUid").textContent = state.uid;
    document.getElementById("inputPlayerName").value = state.name;
    document.getElementById("settingsCatalogCount").textContent = characterCatalog.size;
    document.getElementById("netDot").classList.toggle("offline", !navigator.onLine);

    const shieldActive = state.shieldUntil && state.shieldUntil > Date.now();
    document.getElementById("settingsShield").textContent = shieldActive
      ? `${Math.ceil((state.shieldUntil - Date.now()) / 3600000)}h`
      : t("msg_shield_off");
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
      const matchQ = !q || c.name.toLowerCase().includes(q) || (c.anime || "").toLowerCase().includes(q);
      return matchR && matchQ;
    });

    const slice = filtered.slice(0, invRenderLimit);
    grid.innerHTML = "";

    if (slice.length === 0) {
      grid.innerHTML = `<p class="muted-text" style="grid-column:1/-1;text-align:center;padding:24px;">${t("msg_no_cards")}</p>`;
      loadMoreBox.classList.add("hidden");
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

    loadMoreBox.classList.toggle("hidden", filtered.length <= invRenderLimit);
  }

  async function openCardDossierModal(cardOrChar, isOwnedCard = false) {
    const modal = document.getElementById("cardModal");
    const body = document.getElementById("cardModalBody");
    const cid = Number(cardOrChar.charId || cardOrChar.id);
    const catalogChar = characterCatalog.get(cid) || cardOrChar;

    const rarity = cardOrChar.rarity || catalogChar.rarity || "R";
    const isLimited = Boolean(LIMITED_CAPS[rarity]);
    const maxCopies = LIMITED_CAPS[rarity] || null;
    const fallback = makeFallbackSvg(catalogChar.name, rarity);

    document.getElementById("cardModalTitle").textContent = `${catalogChar.name}`;

    const serialDisplay = cardOrChar.serial
      ? `#${cardOrChar.serial}/${cardOrChar.maxCopies}`
      : isLimited ? `${maxCopies}/${maxCopies}` : t("lbl_unlimited_copy");

    let ownersSectionHtml = "";
    if (isLimited) {
      const regOwners = { ...(limitedRegistry[cid]?.owners || {}) };
      const localOwned = state.inventory.find((c) => Number(c.charId) === cid && c.serial);
      if (localOwned && !regOwners[localOwned.serial]) {
        regOwners[localOwned.serial] = { uid: state.uid, name: state.name };
      }
      const ownerEntries = Object.entries(regOwners);
      const freeCount = Math.max(0, maxCopies - ownerEntries.length);

      let rowsHtml = `<div class="dossier-owner-row"><span>🛒 ${t("lbl_free_slots")}</span><b style="color:#4ade80;">${freeCount} / ${maxCopies}</b></div>`;
      ownerEntries.forEach(([slot, ow]) => {
        const isMe = ow.uid === state.uid;
        const btnHtml = !isMe
          ? `<button class="danger-btn-sm btn-dossier-ch" data-cid="${cid}" data-slot="${slot}" data-ouid="${ow.uid}" data-oname="${ow.name}">${t("btn_challenge")}</button>`
          : `<span class="status-badge">👑 ${t("lbl_you")}</span>`;
        rowsHtml += `
          <div class="dossier-owner-row">
            <span>${isMe ? "👑 " + ow.name : "👤 " + ow.name} <small style="color:var(--gold);">#${slot}/${maxCopies}</small></span>
            ${btnHtml}
          </div>`;
      });

      ownersSectionHtml = `
        <div class="field-label" style="margin-top:8px;">${t("lbl_owners")}</div>
        <div class="dossier-owners-section">${rowsHtml}</div>
      `;
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

    const recycleBtn = document.getElementById("btnRecycleCard");
    if (recycleBtn) {
      recycleBtn.addEventListener("click", () => {
        const idx = state.inventory.findIndex((x) => x.uidCard === cardOrChar.uidCard);
        if (idx !== -1) {
          const sellVal = (RANK_POWER[rarity] || 1) * 18;
          state.inventory.splice(idx, 1);
          state.gold += sellVal;
          saveState();
          updateHud();
          renderInventory(false);
          modal.classList.add("hidden");
          showToast(`+${sellVal} 🪙`);
        }
      });
    }

    modal.classList.remove("hidden");
    const translatedBio = await getTranslatedBio(catalogChar);
    const bioEl = document.getElementById("dossierBioText");
    if (bioEl) bioEl.textContent = translatedBio;
  }

  /* =========================================================
     11. المتجر (نسب حقيقية مخفية + تحويل المكرر لذهب + خصم فوري)
  ========================================================= */
  function rollRarity(rates) {
    const entries = Object.entries(rates);
    const total = entries.reduce((sum, [, w]) => sum + w, 0);
    let rand = Math.random() * total;
    for (const [rarity, weight] of entries) {
      rand -= weight;
      if (rand <= 0) return rarity;
    }
    return entries[0][0];
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
  }

  async function handlePackPurchase(packId, currency) {
    const pack = SHOP_PACKS.find((p) => p.id === packId);
    if (!pack) return;

    if (characterCatalog.size < 25) {
      await ensureRichCatalog();
      if (characterCatalog.size === 0) return showToast("⚠️ Connect to internet!");
    }

    if (currency === "gold") {
      if (state.gold < pack.gold) return showToast(t("msg_no_gold"));
      state.gold -= pack.gold;
    } else {
      if (state.gems < pack.gem) return showToast(t("msg_no_gems"));
      state.gems -= pack.gem;
    }

    const rolledRarity = rollRarity(pack.rates);
    const allowedRarities = Object.keys(pack.rates);
    let allChars = Array.from(characterCatalog.values());
    let pool = allChars.filter((c) => c.rarity === rolledRarity);

    if (pool.length === 0 && !LIMITED_CAPS[rolledRarity]) {
      await fetchAniListPage(50);
      await fetchAniListPage(100);
      allChars = Array.from(characterCatalog.values());
      pool = allChars.filter((c) => c.rarity === rolledRarity);
      if (pool.length === 0) pool = allChars.filter((c) => allowedRarities.includes(c.rarity) && !LIMITED_CAPS[c.rarity]);
      if (pool.length === 0) pool = allChars.filter((c) => !LIMITED_CAPS[c.rarity]);
    }

    if (pool.length === 0) {
      if (currency === "gold") state.gold += pack.gold; else state.gems += pack.gem;
      updateHud();
      return showToast("⏳ Loading heroes...");
    }

    if (LIMITED_CAPS[rolledRarity]) {
      const maxCopies = LIMITED_CAPS[rolledRarity];
      const availableOptions = [];
      pool.forEach((ch) => {
        const reg = limitedRegistry[ch.id] || { maxCopies, owners: {} };
        cleanExpiredOwnersForCard(ch.id, rolledRarity, reg);
        const owners = reg.owners || {};
        for (let slot = 1; slot <= maxCopies; slot++) {
          if (!owners[slot]) { availableOptions.push({ char: ch, slot, maxCopies }); break; }
        }
      });

      if (availableOptions.length === 0) {
        state.tickets += 1;
        state.gems += 5;
        saveState();
        updateHud();
        playSfx("win");
        showToast("🎟️ +1 | 💎 +5");
        return;
      }

      const pick = availableOptions[Math.floor(Math.random() * availableOptions.length)];
      if (state.inventory.some((c) => Number(c.charId) === Number(pick.char.id))) {
        const bonusGold = DUP_GOLD_REWARD[rolledRarity] || 700;
        state.gold += bonusGold;
        saveState();
        updateHud();
        showSummonReveal({ ...pick.char, rarity: rolledRarity, serial: null }, `${t("dup_converted")} +${bonusGold} 🪙`);
        showToast(`${t("dup_converted")} +${bonusGold} 🪙`);
        return;
      }

      const now = Date.now();
      const newCard = {
        uidCard: "c_" + now + "_" + Math.random().toString(36).slice(2, 6),
        charId: pick.char.id, name: pick.char.name, nativeName: pick.char.nativeName || "",
        anime: pick.char.anime, image: pick.char.image, bioEn: pick.char.bioEn || "",
        favorites: pick.char.favorites || 0, rarity: rolledRarity,
        serial: pick.slot, maxCopies: pick.maxCopies, acquiredAt: now
      };

      if (!limitedRegistry[pick.char.id]) {
        limitedRegistry[pick.char.id] = { charId: pick.char.id, name: pick.char.name, rarity: rolledRarity, maxCopies: pick.maxCopies, owners: {} };
      }
      if (!limitedRegistry[pick.char.id].owners) limitedRegistry[pick.char.id].owners = {};
      limitedRegistry[pick.char.id].owners[pick.slot] = { uid: state.uid, name: state.name, claimedAt: now, lastActiveAt: now };

      if (db && navigator.onLine) {
        try {
          await db.ref(`limitedCards/${pick.char.id}`).update({ charId: pick.char.id, name: pick.char.name, rarity: rolledRarity, maxCopies: pick.maxCopies });
          await db.ref(`limitedCards/${pick.char.id}/owners/${pick.slot}`).set({ uid: state.uid, name: state.name, claimedAt: now, lastActiveAt: now });
        } catch (_) {}
      }

      state.inventory.push(newCard);
      saveState();
      updateHud();
      renderInventory(true);
      renderCodex();
      showSummonReveal(newCard, `👑 #${pick.slot}/${pick.maxCopies}`);
      return;
    }

    const chosen = pool[Math.floor(Math.random() * pool.length)];
    if (state.inventory.some((c) => Number(c.charId) === Number(chosen.id))) {
      const dupGold = DUP_GOLD_REWARD[chosen.rarity] || 40;
      state.gold += dupGold;
      saveState();
      updateHud();
      playSfx("win");
      showSummonReveal({ ...chosen, serial: null }, `${t("dup_converted")} +${dupGold} 🪙`);
      showToast(`${t("dup_converted")} +${dupGold} 🪙`);
      return;
    }

    const normalCard = {
      uidCard: "c_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      charId: chosen.id, name: chosen.name, nativeName: chosen.nativeName || "",
      anime: chosen.anime, image: chosen.image, bioEn: chosen.bioEn || "",
      favorites: chosen.favorites || 0, rarity: chosen.rarity,
      serial: null, maxCopies: null, acquiredAt: Date.now()
    };

    state.inventory.push(normalCard);
    saveState();
    updateHud();
    renderInventory(true);
    showSummonReveal(normalCard, chosen.anime);
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
      <div class="inv-card-top">
        <span class="card-rarity-pill r-${card.rarity}">${card.rarity}</span>
        ${serialHtml}
      </div>
      <div class="inv-card-name">${card.name}</div>
    `;
    modal.classList.remove("hidden");
  }

  /* =========================================================
     12. سجل النوادر التلقائي (يعرض جميع الأساطير + بحث حي)
  ========================================================= */
  let codexFilter = "ALL";
  let codexSearch = "";

  function renderCodex() {
    const grid = document.getElementById("codexGrid");
    const counterEl = document.getElementById("codexDiscoveredCount");
    if (!grid) return;

    const allLegends = Array.from(characterCatalog.values())
      .filter((ch) => ch && LIMITED_CAPS[ch.rarity])
      .sort((a, b) => {
        const diff = (RANK_POWER[b.rarity] || 0) - (RANK_POWER[a.rarity] || 0);
        return diff !== 0 ? diff : (b.favorites || 0) - (a.favorites || 0);
      });

    if (counterEl) counterEl.textContent = allLegends.length;

    const q = (codexSearch || "").trim().toLowerCase();
    const filtered = allLegends.filter((c) => {
      const okR = codexFilter === "ALL" || c.rarity === codexFilter;
      const okQ = !q || c.name.toLowerCase().includes(q) || (c.anime || "").toLowerCase().includes(q);
      return okR && okQ;
    });

    grid.innerHTML = "";
    filtered.forEach((ch) => {
      const max = LIMITED_CAPS[ch.rarity];
      const regOwners = { ...(limitedRegistry[ch.id]?.owners || {}) };
      const localOwned = state.inventory.find((c) => Number(c.charId) === Number(ch.id) && c.serial);
      if (localOwned && !regOwners[localOwned.serial]) {
        regOwners[localOwned.serial] = { uid: state.uid, name: state.name };
      }

      const freeCount = Math.max(0, max - Object.keys(regOwners).length);
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
            <span style="color:${freeCount > 0 ? "#4ade80" : "#fb7185"};">${freeCount > 0 ? `${t("lbl_free_slots")}: ${freeCount}/${max}` : "👑 0/" + max}</span>
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
      e.target.disabled = true;
      e.target.textContent = t("codex_searching");
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
    if (list.length === 0) { box.innerHTML = `<p class="muted-text" style="text-align:center;padding:16px;">---</p>`; return; }
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
      btn.addEventListener("click", async () => {
        if (db) await db.ref(`challenges/${state.uid}/${btn.dataset.id}`).remove();
      });
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
     13. الأوضاع الفردية: 6 بطاقات (رتب مختلفة 100%) + ألغاز + شعبية بمؤقت 6ث
  ========================================================= */
  let soloDiff = "normal";
  let soloState = { active: false, phase: "idle", cards: [], picked: [], turn: "player" };
  let soloRunId = 0;

  // اختيار 6 بطاقات بـ 6 تصنيفات مختلفة تماماً (لا يوجد تكرار للرتبة أبداً)
  function pickSixUniqueRarityCards() {
    const all = Array.from(characterCatalog.values());
    const allRarities = ["N", "C", "R", "SR", "SSR", "UR", "SP"].sort(() => Math.random() - 0.5);
    const chosen = [];
    for (const r of allRarities) {
      if (chosen.length === 6) break;
      const bucket = all.filter((c) => c.rarity === r);
      if (bucket.length > 0) {
        chosen.push(bucket[Math.floor(Math.random() * bucket.length)]);
      }
    }
    return chosen.sort(() => Math.random() - 0.5);
  }

  async function animateRealCardSwap(idxA, idxB, durationMs) {
    const board = document.getElementById("soloBoard");
    if (!board) return;
    const slots = board.querySelectorAll(".duel-slot");
    const elA = slots[idxA], elB = slots[idxB];
    if (!elA || !elB) return;

    const rA = elA.getBoundingClientRect(), rB = elB.getBoundingClientRect();
    const dx = rB.left - rA.left, dy = rB.top - rA.top;

    elA.classList.add("moving-card");
    elB.classList.add("moving-card");
    elA.style.transition = `transform ${durationMs}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
    elB.style.transition = `transform ${durationMs}ms cubic-bezier(0.45, 0.05, 0.55, 0.95)`;
    elA.style.transform = `translate(${dx}px, ${dy}px) scale(1.03)`;
    elB.style.transform = `translate(${-dx}px, ${-dy}px) scale(1.03)`;

    playSfx("click");
    await new Promise((r) => setTimeout(r, durationMs + 25));

    const temp = soloState.cards[idxA];
    soloState.cards[idxA] = soloState.cards[idxB];
    soloState.cards[idxB] = temp;

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

    const cfg = soloDiff === "legendary"
      ? { preview: 1900, swaps: 12, speed: 165 }
      : soloDiff === "hard"
      ? { preview: 2300, swaps: 8, speed: 260 }
      : { preview: 2800, swaps: 5, speed: 410 };

    document.getElementById("soloShuffleStatus").textContent = t("msg_memorize");
    document.getElementById("soloRoundHint").textContent = t("shuffle_hint");
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
    soloState.phase = "picking";
    soloState.turn = "player";
    document.getElementById("soloShuffleStatus").textContent = t("msg_your_turn");
    renderSoloBoard(false);
  }

  function renderSoloBoard(revealAll) {
    const board = document.getElementById("soloBoard");
    if (!board) return;
    board.innerHTML = "";
    const myCount = soloState.picked.filter((x) => x === "player").length;
    const botCount = soloState.picked.filter((x) => x === "bot").length;
    document.getElementById("soloPlayerPicks").textContent = `${myCount}/3`;
    document.getElementById("soloBotPicks").textContent = `${botCount}/3`;

    soloState.cards.forEach((card, idx) => {
      const owner = soloState.picked[idx];
      const showFace = revealAll || owner !== null || soloState.phase === "result";
      const slot = document.createElement("div");
      slot.className = "duel-slot";
      const borderCls = owner === "player" ? " picked-me" : owner === "bot" ? " picked-opp" : "";
      const fallback = makeFallbackSvg(card.name, card.rarity);

      slot.innerHTML = showFace
        ? `<div class="duel-card-inner${borderCls}">
             <img src="${card.image}" alt="${card.name}" onerror="this.onerror=null;this.src='${fallback}'" />
             <span class="card-rarity-pill r-${card.rarity}">${card.rarity}</span>
             <div class="card-bottom-label">${card.name}</div>
           </div>`
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
      if (free.length === 0 || left <= 0) {
        if (soloState.picked.filter((x) => x !== null).length === 6) return finishSoloShuffleDuel();
        soloState.turn = "player";
        document.getElementById("soloShuffleStatus").textContent = t("msg_your_turn");
        return;
      }
      soloState.picked[free[Math.floor(Math.random() * free.length)]] = "bot";
      left--;
      renderSoloBoard(false);
      setTimeout(step, 420);
    };
    setTimeout(step, 420);
  }

  function finishSoloShuffleDuel() {
    soloState.phase = "result";
    renderSoloBoard(true);
    let playerScore = 0, botScore = 0;
    soloState.cards.forEach((c, idx) => {
      const pwr = RANK_POWER[c.rarity] || 1;
      if (soloState.picked[idx] === "player") playerScore += pwr;
      else botScore += pwr;
    });

    const gemReward = soloDiff === "legendary" ? 4 : soloDiff === "hard" ? 3 : 2;
    const goldReward = soloDiff === "legendary" ? 350 : soloDiff === "hard" ? 220 : 150;

    if (playerScore >= botScore) {
      state.gold += goldReward;
      state.gems += gemReward;
      saveState();
      updateHud();
      playSfx("win");
      document.getElementById("soloShuffleStatus").textContent = `${t("msg_win")} (${playerScore} - ${botScore})`;
      showToast(`${t("msg_win")} +${goldReward} 🪙 | +${gemReward} 💎`);
    } else {
      document.getElementById("soloShuffleStatus").textContent = `${t("msg_lose")} (${playerScore} - ${botScore})`;
      showToast(t("msg_lose"));
    }
  }

  /* --- ألغاز الأنمي (صورة / سلاح وقدرة لا نهائية / قصة) --- */
  let triviaMode = "image";
  let triviaStreak = 0;
  let currentTriviaAnswer = null;

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
          <div class="clue-tags">
            <span class="clue-tag">🎬 ${currentTriviaAnswer.anime}</span>
            <span class="clue-tag">⭐ ${currentTriviaAnswer.rarity}</span>
          </div>
          <p id="clueTranslatedText" class="trivia-lore">${t("msg_loading_bio")}</p>
        </div>
      `;
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
      triviaStreak++;
      state.gold += 120;
      if (triviaStreak % 3 === 0) state.gems += 1;
      saveState();
      updateHud();
      playSfx("win");
      showToast("✅ +120 🪙" + (triviaStreak % 3 === 0 ? " | +1 💎" : ""));
    } else {
      btn.classList.add("wrong");
      triviaStreak = 0;
      showToast(`❌ ${currentTriviaAnswer.name}`);
    }
    document.getElementById("triviaStreak").textContent = triviaStreak;
    setTimeout(loadNextTriviaQuestion, 1300);
  }

  /* --- تحدي الشعبية: 3 رهانات + مؤقت 6 ثوانٍ + مضاعفة ×2 --- */
  let popBetState = { phase: "bet", baseBet: 0, pot: 0, round: 0, pair: [], usedIds: new Set() };
  let popTimerInterval = null;
  let popTimeLeftMs = 6000;

  function stopPopTimer() {
    if (popTimerInterval) { clearInterval(popTimerInterval); popTimerInterval = null; }
  }

  function startPopTimer() {
    stopPopTimer();
    popTimeLeftMs = 6000;
    const startedAt = Date.now();
    popTimerInterval = setInterval(() => {
      if (popBetState.phase !== "playing") return stopPopTimer();
      popTimeLeftMs = Math.max(0, 6000 - (Date.now() - startedAt));
      const fill = document.getElementById("popTimerFill");
      const txt = document.getElementById("popTimerText");
      const head = document.getElementById("popTimerHead");
      const pct = (popTimeLeftMs / 6000) * 100;
      if (fill) { fill.style.width = pct + "%"; fill.classList.toggle("danger", popTimeLeftMs <= 2000); }
      if (txt) txt.textContent = (popTimeLeftMs / 1000).toFixed(1) + "s";
      if (head) head.classList.toggle("danger", popTimeLeftMs <= 2000);

      if (popTimeLeftMs <= 0) {
        stopPopTimer();
        popBetState.phase = "lost";
        showToast(t("pop_timeout"));
        renderPopularityGame();
        setTimeout(() => { popBetState.phase = "bet"; renderPopularityGame(); }, 1600);
      }
    }, 100);
  }

  function pickDifficultyScaledPair(round) {
    const all = Array.from(characterCatalog.values()).filter((c) => Number(c.favorites) > 0);
    if (all.length < 2) return [];
    const sorted = [...all].sort((a, b) => b.favorites - a.favorites);
    const maxRatio = round <= 1 ? 4.5 : round === 2 ? 2.1 : round === 3 ? 1.45 : 1.18;
    const minRatio = round <= 1 ? 1.7 : round === 2 ? 1.25 : 1.03;

    for (let tries = 0; tries < 60; tries++) {
      const a = sorted[Math.floor(Math.random() * sorted.length)];
      const b = sorted[Math.floor(Math.random() * sorted.length)];
      if (!a || !b || a.id === b.id || a.favorites === b.favorites) continue;
      const ratio = Math.max(a.favorites, b.favorites) / Math.max(1, Math.min(a.favorites, b.favorites));
      if (ratio >= minRatio && ratio <= maxRatio) {
        return Math.random() < 0.5 ? [a, b] : [b, a];
      }
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
        </div>
      `;
      box.querySelectorAll(".pop-bet-btn").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const bet = Number(btn.dataset.bet);
          if (state.gold < bet) return showToast(t("msg_no_gold"));
          if (characterCatalog.size < 10) await ensureRichCatalog();
          state.gold -= bet;
          saveState();
          updateHud();
          popBetState = { phase: "playing", baseBet: bet, pot: bet * 2, round: 1, usedIds: new Set(), pair: pickDifficultyScaledPair(1) };
          playSfx("click");
          renderPopularityGame();
          startPopTimer();
        });
      });
      return;
    }

    const stars = "🔥".repeat(Math.min(5, popBetState.round));
    const hud = document.createElement("div");
    hud.className = "pop-hud-bar";
    hud.style.gridColumn = "1 / -1";
    hud.innerHTML = `
      <span>${t("pop_round")}: <b>#${popBetState.round}</b></span>
      <span>${t("pop_pot")}: <b style="color:var(--gold);">${popBetState.pot} 🪙</b></span>
      <span>${t("pop_risk")}: ${stars}</span>
    `;
    box.appendChild(hud);

    if (popBetState.phase === "playing") {
      const timerWrap = document.createElement("div");
      timerWrap.className = "pop-timer-wrap";
      timerWrap.innerHTML = `
        <div id="popTimerHead" class="pop-timer-head"><span>${t("pop_time")}</span><span id="popTimerText">6.0s</span></div>
        <div class="pop-timer-track"><div id="popTimerFill" class="pop-timer-fill"></div></div>
      `;
      box.appendChild(timerWrap);
    }

    const revealNums = popBetState.phase === "decision" || popBetState.phase === "lost";
    const maxFav = Math.max(popBetState.pair[0]?.favorites || 0, popBetState.pair[1]?.favorites || 0);

    popBetState.pair.forEach((ch, idx) => {
      const other = popBetState.pair[1 - idx];
      const fallback = makeFallbackSvg(ch.name, ch.rarity);
      const hlClass = revealNums ? (ch.favorites >= maxFav ? " win-hl" : " lose-hl") : "";

      const card = document.createElement("div");
      card.className = "pop-card" + hlClass;
      card.innerHTML = `
        ${revealNums ? `<div class="pop-fav-badge">❤️ ${ch.favorites.toLocaleString()}</div>` : ""}
        <img src="${ch.image}" alt="${ch.name}" onerror="this.onerror=null;this.src='${fallback}'" />
        <div class="pop-card-info"><h4>${ch.name}</h4><p class="muted-text">${ch.anime}</p></div>
      `;

      if (popBetState.phase === "playing") {
        card.addEventListener("click", () => {
          stopPopTimer();
          if (ch.favorites >= other.favorites) {
            popBetState.phase = "decision";
            playSfx("win");
            renderPopularityGame();
          } else {
            popBetState.phase = "lost";
            showToast(t("pop_lost"));
            renderPopularityGame();
            setTimeout(() => { popBetState.phase = "bet"; renderPopularityGame(); }, 1600);
          }
        });
      }
      box.appendChild(card);
    });

    if (popBetState.phase === "decision") {
      const dec = document.createElement("div");
      dec.className = "pop-decision-box";
      dec.style.gridColumn = "1 / -1";
      const bonusGems = popBetState.round >= 2 ? popBetState.round - 1 : 0;
      dec.innerHTML = `
        <button id="btnPopCashout" class="btn-cashout">${t("pop_cashout")} (+${popBetState.pot} 🪙${bonusGems ? ` +${bonusGems} 💎` : ""})</button>
        <button id="btnPopDouble" class="btn-double">${t("pop_double")} (${popBetState.pot * 2} 🪙)</button>
      `;
      box.appendChild(dec);

      document.getElementById("btnPopCashout").addEventListener("click", () => {
        state.gold += popBetState.pot;
        if (bonusGems > 0) state.gems += bonusGems;
        saveState();
        updateHud();
        playSfx("win");
        showToast(`${t("pop_cashed")} +${popBetState.pot} 🪙${bonusGems ? ` | +${bonusGems} 💎` : ""}`);
        popBetState.phase = "bet";
        renderPopularityGame();
      });

      document.getElementById("btnPopDouble").addEventListener("click", () => {
        popBetState.round += 1;
        popBetState.pot *= 2;
        popBetState.phase = "playing";
        popBetState.pair = pickDifficultyScaledPair(popBetState.round);
        playSfx("click");
        renderPopularityGame();
        startPopTimer();
      });
    }
  }

  function loadNextPopularityDuel() {
    stopPopTimer();
    popBetState.phase = "bet";
    renderPopularityGame();
  }
  /* =========================================================
     14. النزالات أونلاين بواجهة البطاقات الداكنة (1 ضد 1 عبر Firebase)
  ========================================================= */
  let selectedDuelMode = "safe";
  let selectedStakeCardUid = "";
  let currentRoomCode = null;
  let currentRole = null;
  let roomListenerRef = null;
  let onlinePreviewStartedFor = null;
  let rewardedRooms = new Set();

  function populateMyStakeCardsRow() {
    const row = document.getElementById("myStakeCardsRow");
    if (!row) return;
    const rares = state.inventory.filter((c) => LIMITED_CAPS[c.rarity]);

    if (rares.length === 0) {
      selectedStakeCardUid = "";
      row.innerHTML = `<p class="muted-text" style="padding:6px;">${t("msg_no_rares_stake")}</p>`;
      return;
    }

    if (!rares.some((c) => c.uidCard === selectedStakeCardUid)) {
      selectedStakeCardUid = rares[0].uidCard;
    }

    row.innerHTML = "";
    rares.forEach((c) => {
      const item = document.createElement("div");
      item.className = "stake-mini-card" + (c.uidCard === selectedStakeCardUid ? " selected" : "");
      const fallback = makeFallbackSvg(c.name, c.rarity);
      item.innerHTML = `
        <img src="${c.image}" alt="${c.name}" onerror="this.onerror=null;this.src='${fallback}'" />
        <span>${c.rarity} #${c.serial}</span>
        <span>${c.name}</span>
      `;
      item.addEventListener("click", () => {
        selectedStakeCardUid = c.uidCard;
        playSfx("click");
        populateMyStakeCardsRow();
      });
      row.appendChild(item);
    });
  }

  async function createOnlineRoom() {
    if (!db || !navigator.onLine) return showToast("⚠️ Offline!");
    if (characterCatalog.size < 6) {
      await ensureRichCatalog();
      if (characterCatalog.size < 6) return showToast("⏳ Loading...");
    }

    const duelType = selectedDuelMode;
    let stakeCard = null;

    if (duelType === "stake_gems" && state.gems < 30) {
      return showToast(t("msg_no_gems"));
    }
    if (duelType === "stake_card") {
      stakeCard = state.inventory.find((c) => c.uidCard === selectedStakeCardUid) || null;
      if (!stakeCard) return showToast(t("msg_no_rares_stake"));
    }

    const code = String(Math.floor(1000 + Math.random() * 9000));
    const boardCards = pickSixUniqueRarityCards().map((c) => ({
      id: c.id, name: c.name, image: c.image, rarity: c.rarity
    }));

    await db.ref(`duels/${code}`).set({
      code, duelType, status: "waiting", turn: "p1",
      cards: boardCards,
      picked: ["", "", "", "", "", ""],
      p1: { uid: state.uid, name: state.name, consent: duelType === "safe", stakeCard },
      p2: null,
      createdAt: Date.now()
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

    let p2StakeCard = null;
    if (room.duelType === "stake_gems" && state.gems < 30) return showToast(t("msg_no_gems"));
    if (room.duelType === "stake_card") {
      const reqRarity = room.p1?.stakeCard?.rarity;
      p2StakeCard = state.inventory.find((c) => c.rarity === reqRarity) || null;
      if (!p2StakeCard) return showToast(`⚠️ Requires ${reqRarity} card!`);
    }

    const nextStatus = room.duelType === "safe" ? "preview" : "consent";
    await db.ref(`duels/${code}`).update({
      status: nextStatus,
      p2: { uid: state.uid, name: state.name, consent: room.duelType === "safe", stakeCard: p2StakeCard }
    });

    attachToRoom(code, "p2");
  }

  function attachToRoom(code, role) {
    leaveCurrentRoom(false);
    currentRoomCode = code;
    currentRole = role;

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
    if (roomListenerRef) { roomListenerRef.off(); roomListenerRef = null; }
    if (removeFromDb && currentRoomCode && db) {
      db.ref(`duels/${currentRoomCode}`).remove().catch(() => {});
    }
    currentRoomCode = null;
    currentRole = null;
    document.getElementById("activeDuelBox").classList.add("hidden");
    document.getElementById("roomSetupBox").classList.remove("hidden");
  }

  function renderOnlineRoomState(room) {
    document.getElementById("p1NameLabel").textContent = room.p1?.name || "P1";
    document.getElementById("p2NameLabel").textContent = room.p2?.name || t("msg_waiting_opp");

    const modeTags = {
      safe: "🛡️ " + t("mode_safe_title"),
      stake_gems: "💎 " + t("mode_gems_title"),
      stake_card: "🔥 " + t("mode_card_title")
    };
    document.getElementById("activeDuelModeTag").textContent = modeTags[room.duelType] || "⚔️";

    document.getElementById("p1StakeLabel").textContent = room.p1?.stakeCard
      ? `${room.p1.stakeCard.name} (${room.p1.stakeCard.rarity})`
      : room.duelType === "stake_gems" ? "30 💎" : "✓";

    document.getElementById("p2StakeLabel").textContent = room.p2
      ? (room.p2.stakeCard ? `${room.p2.stakeCard.name} (${room.p2.stakeCard.rarity})` : room.duelType === "stake_gems" ? "30 💎" : "✓")
      : "---";

    const consentBar = document.getElementById("mutualConsentBar");
    const statusBanner = document.getElementById("onlineDuelStatus");

    if (room.status === "waiting") {
      consentBar.classList.add("hidden");
      statusBanner.textContent = `${t("lbl_room_code")}: ${room.code} — ${t("msg_waiting_opp")}`;
      renderOnlineBoard(room, false);
      return;
    }

    if (room.status === "consent") {
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
      statusBanner.textContent = t("msg_memorize");
      renderOnlineBoard(room, true);
      if (currentRole === "p1" && onlinePreviewStartedFor !== room.code) {
        onlinePreviewStartedFor = room.code;
        setTimeout(() => {
          const shuffled = [...room.cards].sort(() => Math.random() - 0.5);
          db.ref(`duels/${room.code}`).update({ cards: shuffled, status: "playing", turn: "p1" });
        }, 3200);
      }
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
        ? `<div class="duel-card-inner${borderCls}">
             <img src="${card.image}" alt="${card.name}" onerror="this.onerror=null;this.src='${fallback}'" />
             <span class="card-rarity-pill r-${card.rarity}">${card.rarity}</span>
             <div class="card-bottom-label">${card.name}</div>
           </div>`
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

    const p1Count = picked.filter((x) => x === "p1").length;
    const p2Count = picked.filter((x) => x === "p2").length;

    if (p1Count + p2Count === 6) {
      await db.ref(`duels/${room.code}`).update({ picked, status: "finished" });
      return;
    }

    let nextTurn = room.turn;
    if (p1Count === 1 && p2Count === 0) nextTurn = "p2";
    else if (p1Count === 1 && p2Count === 2) nextTurn = "p1";
    else if (p1Count === 3 && p2Count === 2) nextTurn = "p2";

    await db.ref(`duels/${room.code}`).update({ picked, turn: nextTurn });
  }

  async function finalizeOnlineMatchRewards(room) {
    if (rewardedRooms.has(room.code)) return;
    rewardedRooms.add(room.code);

    const picked = room.picked || [];
    let p1Score = 0, p2Score = 0;
    room.cards.forEach((c, i) => {
      const p = RANK_POWER[c.rarity] || 1;
      if (picked[i] === "p1") p1Score += p;
      else if (picked[i] === "p2") p2Score += p;
    });

    const winnerRole = p1Score >= p2Score ? "p1" : "p2";
    const iWon = winnerRole === currentRole;
    const statusBanner = document.getElementById("onlineDuelStatus");

    if (iWon) {
      state.trophies += 25;
      state.gold += 300;
      state.gems += 5;

      if (room.duelType === "stake_gems") {
        state.gems += 30;
      } else if (room.duelType === "stake_card") {
        const wonCard = currentRole === "p1" ? room.p2?.stakeCard : room.p1?.stakeCard;
        if (wonCard) {
          wonCard.acquiredAt = Date.now();
          state.inventory.push(wonCard);
          state.shieldUntil = Date.now() + DAY_MS;
          if (db && wonCard.serial) {
            await db.ref(`limitedCards/${wonCard.charId}/owners/${wonCard.serial}`).set({
              uid: state.uid, name: state.name, claimedAt: Date.now(), lastActiveAt: Date.now()
            });
          }
          showToast(`👑 +${wonCard.name} (🛡️ 24h)`);
        }
      }

      playSfx("win");
      statusBanner.textContent = `${t("msg_win")} (${p1Score} - ${p2Score}) +25 🏆`;
    } else {
      state.trophies = Math.max(0, state.trophies - 10);
      if (room.duelType === "stake_gems") state.gems = Math.max(0, state.gems - 30);
      else if (room.duelType === "stake_card") {
        const lostCard = currentRole === "p1" ? room.p1?.stakeCard : room.p2?.stakeCard;
        if (lostCard) {
          state.inventory = state.inventory.filter((c) => c.uidCard !== lostCard.uidCard);
          showToast(`-${lostCard.name}`);
        }
      }
      statusBanner.textContent = `${t("msg_lose")} (${p1Score} - ${p2Score})`;
    }

    saveState();
    updateHud();
    renderInventory(true);
    populateMyStakeCardsRow();
  }

  /* =========================================================
     15. التنقل، الأحداث، والإقلاع الفوري
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
    if (tabId === "viewArena") {
      const popActive = document.getElementById("soloPopPane")?.classList.contains("active");
      if (popActive) renderPopularityGame();
    }
  }

  function switchOnlineSubTab(paneKey) {
    document.querySelectorAll("#viewOnline .sub-tab").forEach((b) => {
      b.classList.toggle("active", b.dataset.online === paneKey);
    });
    document.querySelectorAll(".online-pane").forEach((p) => p.classList.remove("active"));
    const map = { lobby: "onlineLobbyPane", challenges: "onlineChallengesPane", leaders: "onlineLeadersPane" };
    document.getElementById(map[paneKey])?.classList.add("active");
  }

  function initStartScreenBackground() {
    const bg = document.getElementById("startBgCards");
    if (!bg) return;
    const topChars = Array.from(characterCatalog.values()).slice(0, 9);
    if (topChars.length === 0) return;
    bg.innerHTML = topChars.map((c) => `<img src="${c.image}" alt="" />`).join("");
  }

  function bindAllEvents() {
    document.getElementById("btnStartGame").addEventListener("click", () => {
      document.getElementById("startScreen").classList.add("hidden");
      document.getElementById("appShell").classList.remove("hidden");
      updateBgmPlayback();
      syncPlayerToCloud();
      ensureRichCatalog();
    });

    document.querySelectorAll(".lang-chip").forEach((chip) => {
      chip.addEventListener("click", () => applyLanguage(chip.dataset.lang));
    });

    document.querySelectorAll(".nav-btn").forEach((btn) => {
      btn.addEventListener("click", () => switchMainTab(btn.dataset.tab));
    });

    document.querySelectorAll("#viewArena .sub-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        stopPopTimer();
        document.querySelectorAll("#viewArena .sub-tab").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        document.querySelectorAll(".solo-pane").forEach((p) => p.classList.remove("active"));
        const map = { shuffle: "soloShufflePane", trivia: "soloTriviaPane", pop: "soloPopPane" };
        document.getElementById(map[btn.dataset.solo])?.classList.add("active");
        if (btn.dataset.solo === "trivia") loadNextTriviaQuestion();
        if (btn.dataset.solo === "pop") loadNextPopularityDuel();
      });
    });

    document.querySelectorAll(".diff-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".diff-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        soloDiff = btn.dataset.diff;
      });
    });
    document.getElementById("btnStartSoloShuffle").addEventListener("click", startSoloShuffleDuel);

    document.querySelectorAll(".trivia-mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".trivia-mode-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        triviaMode = btn.dataset.tmode;
        loadNextTriviaQuestion();
      });
    });

    document.getElementById("btnTrivia5050").addEventListener("click", () => {
      const wrongBtns = Array.from(document.querySelectorAll("#triviaOptions .opt-btn"))
        .filter((b) => Number(b.dataset.id) !== currentTriviaAnswer?.id && !b.classList.contains("eliminated"));
      wrongBtns.slice(0, 2).forEach((b) => b.classList.add("eliminated"));
    });
    document.getElementById("btnTriviaSkip").addEventListener("click", loadNextTriviaQuestion);

    document.querySelectorAll("#viewOnline .sub-tab").forEach((btn) => {
      btn.addEventListener("click", () => switchOnlineSubTab(btn.dataset.online));
    });

    document.querySelectorAll("#duelModeCards .duel-mode-card").forEach((cardBtn) => {
      cardBtn.addEventListener("click", () => {
        document.querySelectorAll("#duelModeCards .duel-mode-card").forEach((c) => c.classList.remove("active"));
        cardBtn.classList.add("active");
        selectedDuelMode = cardBtn.dataset.mode;
        playSfx("click");
        const picker = document.getElementById("myStakeCardPicker");
        picker.classList.toggle("hidden", selectedDuelMode !== "stake_card");
        if (selectedDuelMode === "stake_card") populateMyStakeCardsRow();
      });
    });

    document.getElementById("btnCreateRoom").addEventListener("click", createOnlineRoom);
    document.getElementById("btnJoinRoom").addEventListener("click", () => joinOnlineRoom());
    document.getElementById("btnLeaveRoom").addEventListener("click", () => leaveCurrentRoom(true));

    document.getElementById("btnConfirmConsent").addEventListener("click", () => {
      if (db && currentRoomCode && currentRole) {
        db.ref(`duels/${currentRoomCode}/${currentRole}/consent`).set(true);
        showToast("✅");
      }
    });
    document.getElementById("btnDeclineConsent").addEventListener("click", () => leaveCurrentRoom(true));

    document.getElementById("invSearch").addEventListener("input", (e) => {
      invSearchQuery = e.target.value;
      renderInventory(true);
    });
    document.querySelectorAll("#invRarityFilters .r-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("#invRarityFilters .r-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        invFilterRarity = chip.dataset.r;
        renderInventory(true);
      });
    });
    document.getElementById("btnLoadMoreInv").addEventListener("click", () => {
      invRenderLimit += 30;
      renderInventory(false);
    });

    let codexSearchTimer = null;
    document.getElementById("codexSearch").addEventListener("input", (e) => {
      codexSearch = e.target.value;
      renderCodex();
      const q = codexSearch.trim();
      clearTimeout(codexSearchTimer);
      if (q.length >= 2 && navigator.onLine) {
        codexSearchTimer = setTimeout(async () => {
          await fetchAniListPage(1, q);
          renderCodex();
        }, 500);
      }
    });
    document.querySelectorAll("#codexRarityFilters .r-chip").forEach((chip) => {
      chip.addEventListener("click", () => {
        document.querySelectorAll("#codexRarityFilters .r-chip").forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        codexFilter = chip.dataset.cr;
        renderCodex();
      });
    });

    document.getElementById("btnCloseSummon").addEventListener("click", () => {
      document.getElementById("summonModal").classList.add("hidden");
    });
    document.getElementById("btnCloseCardModal").addEventListener("click", () => {
      document.getElementById("cardModal").classList.add("hidden");
    });
    document.getElementById("btnSettings").addEventListener("click", () => {
      updateHud();
      document.getElementById("settingsModal").classList.remove("hidden");
    });
    document.getElementById("btnProfileHud").addEventListener("click", () => {
      updateHud();
      document.getElementById("settingsModal").classList.remove("hidden");
    });
    document.getElementById("btnCloseSettings").addEventListener("click", () => {
      document.getElementById("settingsModal").classList.add("hidden");
    });

    document.getElementById("btnSavePlayerName").addEventListener("click", () => {
      const val = document.getElementById("inputPlayerName").value.trim();
      if (val.length >= 2) {
        state.name = val;
        saveState();
        updateHud();
        showToast(t("msg_saved"));
      }
    });

    document.getElementById("btnAudioToggle").addEventListener("click", () => {
      state.bgmEnabled = !state.bgmEnabled;
      document.getElementById("chkBgm").checked = state.bgmEnabled;
      saveState();
      updateBgmPlayback();
    });
    document.getElementById("chkBgm").addEventListener("change", (e) => {
      state.bgmEnabled = e.target.checked;
      saveState();
      updateBgmPlayback();
    });
    document.getElementById("chkSfx").addEventListener("change", (e) => {
      state.sfxEnabled = e.target.checked;
      saveState();
    });

    window.addEventListener("online", () => { updateHud(); ensureRichCatalog(); });
    window.addEventListener("offline", updateHud);
  }

  loadCaches();
  initStartScreenBackground();
  applyLanguage(state.lang);
  bindAllEvents();
  initFirebaseListeners();
  ensureRichCatalog();
    /* =========================================================
     إضافة إصلاح تصنيف SP/UR وإنقاص النسخ في النوادر (Fix v6)
  ========================================================= */
  (function applySpUrAndCopiesFix() {
    const TRUE_SP_RE = /\b(goku|gokuu|saitama|gojo|gojou|sukuna|jin-?woo|jin-?u seong|luffy|madara|hashirama|naruto|sasuke|aizen|ichigo|yhwach|yamamoto|rimuru|anos|gilgamesh|beerus|whis|zeno|newgate|whitebeard|shanks|kaido|yoriichi|meruem|netero|alucard|ainz|giorno|shigeo|mob|reinhard|guts|sinbad|simon|anti-spiral|jin mori|kaguya|isshiki(?!\s*iroha)|iroha(?!\s*isshiki))\b/i;

    // استثناء صريح لشخصية Iroha Isshiki من أي رتبة عليا
    const BLOCK_SP_UR_RE = /\b(iroha\s*isshiki|isshiki\s*iroha)\b/i;

    const TRUE_UR_RE = /\b(vegeta|gohan|broly|frieza|piccolo|zoro|mihawk|trafalgar|doflamingo|ace|sabo|garp|itachi|minato|kakashi|pain|nagato|obito|jiraiya|levi|eren|mikasa|kenpachi|byakuya|ulquiorra|hitsugaya|toji|yuta|geto|killua|hisoka|chrollo|kurapika|gon|lelouch|l lawliet|light yagami|roy mustang|edward elric|muzan|kokushibo|akaza|rengoku|tanjiro|garou|tatsumaki|escanor|meliodas|ban|dio|jotaro|kaneki|all might|midoriya|bakugou|bakugo|todoroki|griffith|thorfinn|erwin|shikamaru|dazai|chuuya|saber|artoria|archer|emiya|frieren|makima|denji|esdeath|akame|erza|natsu|yami|asta|yujiro|baki|spike spiegel|gintoki|kamina|shinra|musashi)\b/i;

    function strictFixRarity(ch) {
      const name = String(ch.name || "");
      const anime = String(ch.anime || "");
      const favs = Number(ch.favorites || 0);
      const genres = Array.isArray(ch.genres) ? ch.genres : [];

      if (BLOCK_SP_UR_RE.test(name)) {
        return favs >= 2000 ? "C" : "N";
      }
      if (TRUE_SP_RE.test(name) && !/darling in the franxx/i.test(anime)) {
        return "SP";
      }
      if (TRUE_UR_RE.test(name)) {
        return "UR";
      }

      const isBlocked = typeof NON_COMBAT_ANIME_RE !== "undefined" && NON_COMBAT_ANIME_RE.test(anime);
      const isCombat = !isBlocked && (genres.length === 0 ? favs >= 6500 : genres.some((g) => ["Action", "Adventure", "Fantasy", "Supernatural", "Sci-Fi", "Mecha"].includes(g)));

      if (isCombat) {
        if (favs >= 9000) return "SSR";
        if (favs >= 3200) return "SR";
        if (favs >= 1100) return "R";
        if (favs >= 350) return "C";
        return "N";
      }
      if (favs >= 10000) return "SR";
      if (favs >= 3500) return "R";
      if (favs >= 900) return "C";
      return "N";
    }

    // إعادة تصنيف الكتالوج والمخزون بالكامل وتصحيح أي نسخ قديمة
    characterCatalog.forEach((ch) => {
      ch.rarity = strictFixRarity(ch);
    });
    saveCharCache();

    let invModified = false;
    state.inventory.forEach((card) => {
      const cat = characterCatalog.get(Number(card.charId));
      const newRarity = strictFixRarity({
        name: card.name,
        anime: card.anime,
        favorites: card.favorites || cat?.favorites || 0,
        genres: cat?.genres || []
      });
      if (card.rarity !== newRarity) {
        card.rarity = newRarity;
        invModified = true;
      }
      if (LIMITED_CAPS[newRarity]) {
        if (!card.serial || !card.maxCopies || card.maxCopies !== LIMITED_CAPS[newRarity]) {
          card.maxCopies = LIMITED_CAPS[newRarity];
          card.serial = card.serial || 1;
          invModified = true;
        }
      } else if (card.serial || card.maxCopies) {
        card.serial = null;
        card.maxCopies = null;
        invModified = true;
      }
    });
    if (invModified) saveState();

    // حساب النسخ المستخدمة فعلياً لبطاقة نادرة (السحابة + المخزون المحلي)
    function computeUsedSlotsForChar(cid, maxCopies) {
      const used = new Map();
      const remoteOwners = limitedRegistry[cid]?.owners || {};
      Object.entries(remoteOwners).forEach(([slot, ow]) => {
        if (ow) used.set(String(slot), ow);
      });
      state.inventory.forEach((c) => {
        if (Number(c.charId) === Number(cid) && LIMITED_CAPS[c.rarity]) {
          let s = Number(c.serial) || 1;
          if (s > maxCopies) s = 1;
          while (used.has(String(s)) && used.get(String(s))?.uid !== state.uid && s < maxCopies) {
            s++;
          }
          if (!c.serial) c.serial = s;
          c.maxCopies = maxCopies;
          used.set(String(s), { uid: state.uid, name: state.name, claimedAt: c.acquiredAt || Date.now(), lastActiveAt: Date.now() });
        }
      });
      return used;
    }

    // إعادة رسم سجل النوادر بحيث ينقص عدد النسخ المتاحة فوراً عند امتلاك أي نسخة
    renderCodex = function () {
      const grid = document.getElementById("codexGrid");
      const counterEl = document.getElementById("codexDiscoveredCount");
      if (!grid) return;

      const allLegends = Array.from(characterCatalog.values())
        .filter((ch) => ch && LIMITED_CAPS[ch.rarity] && !BLOCK_SP_UR_RE.test(ch.name || ""))
        .sort((a, b) => {
          const diff = (RANK_POWER[b.rarity] || 0) - (RANK_POWER[a.rarity] || 0);
          return diff !== 0 ? diff : (b.favorites || 0) - (a.favorites || 0);
        });

      if (counterEl) counterEl.textContent = allLegends.length;

      const q = (codexSearch || "").trim().toLowerCase();
      const filtered = allLegends.filter((c) => {
        const okR = codexFilter === "ALL" || c.rarity === codexFilter;
        const okQ = !q || c.name.toLowerCase().includes(q) || (c.anime || "").toLowerCase().includes(q);
        return okR && okQ;
      });

      grid.innerHTML = "";
      filtered.forEach((ch) => {
        const max = LIMITED_CAPS[ch.rarity];
        const usedMap = computeUsedSlotsForChar(ch.id, max);
        const freeCount = Math.max(0, max - usedMap.size);
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
        e.target.disabled = true;
        e.target.textContent = t("codex_searching");
        await fetchAniListPage(codexPageCursor++);
        characterCatalog.forEach((c) => { c.rarity = strictFixRarity(c); });
        renderCodex();
      });
    };

    // تحديث عرض الملاك داخل ملف البطاقة أيضاً ليطابق النسخ المحجوزة
    const prevOpenDossier = openCardDossierModal;
    openCardDossierModal = async function (cardOrChar, isOwnedCard = false) {
      await prevOpenDossier(cardOrChar, isOwnedCard);
      const cid = Number(cardOrChar.charId || cardOrChar.id);
      const cat = characterCatalog.get(cid) || cardOrChar;
      const rarity = cat.rarity || cardOrChar.rarity || "R";
      const max = LIMITED_CAPS[rarity];
      if (!max) return;

      const usedMap = computeUsedSlotsForChar(cid, max);
      const freeCount = Math.max(0, max - usedMap.size);
      const body = document.getElementById("cardModalBody");
      const ownersSec = body?.querySelector(".dossier-owners-section");
      if (!ownersSec) return;

      let rowsHtml = `<div class="dossier-owner-row"><span>🛒 ${t("lbl_free_slots")}</span><b style="color:${freeCount > 0 ? "#4ade80" : "#fb7185"};">${freeCount} / ${max}</b></div>`;
      usedMap.forEach((ow, slot) => {
        const isMe = ow.uid === state.uid;
        const btnHtml = !isMe
          ? `<button class="danger-btn-sm btn-dossier-ch" data-cid="${cid}" data-slot="${slot}" data-ouid="${ow.uid}" data-oname="${ow.name}">${t("btn_challenge")}</button>`
          : `<span class="status-badge">👑 ${t("lbl_you")}</span>`;
        rowsHtml += `
          <div class="dossier-owner-row">
            <span>${isMe ? "👑 " + ow.name : "👤 " + ow.name} <small style="color:var(--gold);">#${slot}/${max}</small></span>
            ${btnHtml}
          </div>`;
      });
      ownersSec.innerHTML = rowsHtml;

      ownersSec.querySelectorAll(".btn-dossier-ch").forEach((btn) => {
        btn.addEventListener("click", () => {
          sendDirectChallenge(Number(btn.dataset.cid), Number(btn.dataset.slot), btn.dataset.ouid, btn.dataset.oname);
          document.getElementById("cardModal").classList.add("hidden");
        });
      });
    };

    updateHud();
    renderInventory(false);
    renderCodex();
  })();
    /* =========================================================
     إضافة تنظيف ملاك undefined وتصحيح ترتيب 1/3 (Fix v7)
  ========================================================= */
  (function fixUndefinedOwnersAndOrder() {
    function isValidCloudOwner(ow) {
      return Boolean(ow && typeof ow === "object" && ow.uid && typeof ow.name === "string" && ow.name.trim() && ow.name.trim().toLowerCase() !== "undefined");
    }

    // تنظيف أي ملاك غير صالحين من السجل المحلي ومن Firebase
    Object.keys(limitedRegistry || {}).forEach((cid) => {
      const entry = limitedRegistry[cid];
      if (!entry || !entry.owners) return;
      Object.keys(entry.owners).forEach((slot) => {
        if (!isValidCloudOwner(entry.owners[slot])) {
          delete entry.owners[slot];
          if (db && navigator.onLine) {
            db.ref(`limitedCards/${cid}/owners/${slot}`).remove().catch(() => {});
          }
        }
      });
    });

    const prevOpen = openCardDossierModal;
    openCardDossierModal = async function (cardOrChar, isOwnedCard = false) {
      await prevOpen(cardOrChar, isOwnedCard);
      const cid = Number(cardOrChar.charId || cardOrChar.id);
      const cat = characterCatalog.get(cid) || cardOrChar;
      const rarity = cat.rarity || cardOrChar.rarity || "R";
      const max = LIMITED_CAPS[rarity];
      if (!max) return;

      const validOwners = new Map();
      const remoteOwners = limitedRegistry[cid]?.owners || {};
      Object.entries(remoteOwners).forEach(([slot, ow]) => {
        if (isValidCloudOwner(ow)) validOwners.set(String(slot), ow);
      });

      state.inventory.forEach((c) => {
        if (Number(c.charId) === cid && LIMITED_CAPS[c.rarity]) {
          const s = String(c.serial || 1);
          validOwners.set(s, { uid: state.uid, name: state.name });
        }
      });

      const freeCount = Math.max(0, max - validOwners.size);
      const body = document.getElementById("cardModalBody");
      const ownersSec = body?.querySelector(".dossier-owners-section");
      if (!ownersSec) return;

      let rowsHtml = `
        <div class="dossier-owner-row">
          <span>🛒 ${t("lbl_free_slots")}</span>
          <b dir="ltr" style="color:${freeCount > 0 ? "#4ade80" : "#fb7185"};">${freeCount} / ${max}</b>
        </div>`;

      validOwners.forEach((ow, slot) => {
        const isMe = ow.uid === state.uid;
        const btnHtml = !isMe
          ? `<button class="danger-btn-sm btn-dossier-ch" data-cid="${cid}" data-slot="${slot}" data-ouid="${ow.uid}" data-oname="${ow.name}">${t("btn_challenge")}</button>`
          : `<span class="status-badge">👑 ${t("lbl_you")}</span>`;
        rowsHtml += `
          <div class="dossier-owner-row">
            <span>${isMe ? "👑 " + ow.name : "👤 " + ow.name} <small dir="ltr" style="color:var(--gold);">#${slot}/${max}</small></span>
            ${btnHtml}
          </div>`;
      });

      ownersSec.innerHTML = rowsHtml;
      ownersSec.querySelectorAll(".btn-dossier-ch").forEach((btn) => {
        btn.addEventListener("click", () => {
          sendDirectChallenge(Number(btn.dataset.cid), Number(btn.dataset.slot), btn.dataset.ouid, btn.dataset.oname);
          document.getElementById("cardModal").classList.add("hidden");
        });
      });
    };

    renderCodex();
  })();
    /* =========================================================
     إضافة القاموس الفوري، مؤقت الترجمة، وتوجيه اللاعب (Fix v8)
  ========================================================= */
  (function applyOfflineAndUxBoost() {
    const INSTANT_BIO_DICT = {
      "satoru gojo": {
        ar: "أقوى ساحر جوجوتسو في عصره، يمتلك عيني الستة وتقنية اللامحدود التي تمنعه من اللمس وتتيح له توسع نطاق الفراغ اللامتناهي.",
        fr: "Le plus puissant exorciste de son époque, détenteur des Six Yeux et de l'Infini qui bloque toute attaque.",
        ja: "現代最強の呪術師。六眼と無下限呪術を操り、領域展開「無量空処」で相手を圧倒する。"
      },
      "ryomen sukuna": {
        ar: "ملك اللعنات الأسطوري في عصر الجوجوتسو، يُعرف بقوته التدميرية الهائلة ومهارته القتالية المطلقة وضريبه الخبيث.",
        fr: "Le Roi des Fléaux légendaire, redouté pour sa puissance destructrice absolue et son sanctuaire malveillant.",
        ja: "呪いの王と称される伝説の存在。圧倒的な呪力量と領域展開「伏魔御廚子」で畏怖される。"
      },
      "sung jin-woo": {
        ar: "ملك الظلال الذي ارتقى من أضعف صياد إلى قوة لا تُقهر قادر على إحياء جيش كامل من ظلال أعدائه.",
        fr: "Le Monarque des Ombres, passé du chasseur le plus faible à une puissance souveraine capable de lever une armée d'ombres.",
        ja: "最弱のハンターから影の君主へと覚醒した存在。倒した敵を影の兵士として使役する。"
      },
      "son goku": {
        ar: "مقاتل سايان نشأ على الأرض ويعشق تحدي الأقوى باستمرار، يتجاوز حدوده عبر التحولات الفائقة والغريزة الفائقة.",
        fr: "Guerrier Saiyan élevé sur Terre, toujours en quête d'adversaires plus forts et repoussant ses limites jusqu'à l'Ultra Instinct.",
        ja: "地球育ちのサイヤ人戦士。強敵を求め続け、限界を超えて身勝手の極意へと到達する。"
      },
      "monkey d. luffy": {
        ar: "قبطان قراصنة قبعة القش الساعي ليصبح ملك القراصنة، يمتلك قدرة فاكهة المطاط وإيقاعات القتال الحرة.",
        fr: "Capitaine de l'équipage du Chapeau de Paille visant le titre de Roi des Pirates, doté des pouvoirs du fruit du caoutchouc.",
        ja: "海賊王を目指す麦わらの一味の船長。ゴムゴムの実の能力と自由な戦闘スタイルで仲間を導く。"
      },
      "naruto uzumaki": {
        ar: "نينجا من قرية الورق يحمل ثعلب الذيول التسعة بداخله، يسعى ليصبح الهوكاجي ويحمي رفاقه بإرادة لا تنكسر.",
        fr: "Ninja du Village Caché des Feuilles portant le démon à neuf queues, déterminé à devenir Hokage et protéger ses amis.",
        ja: "木ノ葉隠れの里の忍。九尾を宿し、火影となって仲間を守るという強い意志で道を切り開く。"
      },
      "sasuke uchiha": {
        ar: "من آخر ناجي عشيرة الأوتشيها، يجمع بين سرعة البرق وقوة الشارينغان والرينيغان في مبارزات دقيقة وحاسمة.",
        fr: "Survivant du clan Uchiwa alliant vitesse de la foudre, Sharingan et Rinnegan dans des duels redoutables.",
        ja: "うちは一族の生き残り。写輪眼と輪廻眼、雷遁の鋭い剣技を操る実力者。"
      },
      "levi ackerman": {
        ar: "أقوى جندي في البشرية ضمن فيلق الاستطلاع، معروف بدقته الخاطفة ومناوراته الجوية السريعة ضد العمالقة.",
        fr: "Le soldat le plus fort de l'humanité au sein du Bataillon d'exploration, célèbre pour sa rapidité et sa précision.",
        ja: "調査兵団の「人類最強の兵士」。立体機動装置による高速かつ精密な斬撃で巨人を討つ。"
      }
    };

    const prevGetBio = getTranslatedBio;
    getTranslatedBio = async function (charObj) {
      const lang = state.lang || "ar";
      const keyName = String(charObj?.name || "").toLowerCase().trim();
      if (lang !== "en") {
        for (const [k, dict] of Object.entries(INSTANT_BIO_DICT)) {
          if (keyName.includes(k) && dict[lang]) return dict[lang];
        }
      }
      // مؤقت 2.5 ثانية حتى لا تتعطل الواجهة أبداً عند بطء الشبكة
      return Promise.race([
        prevGetBio(charObj),
        new Promise((resolve) => setTimeout(() => resolve(charObj.bioEn || `${charObj.name} — ${charObj.anime}`), 2500))
      ]);
    };

    // إضافة سطر توجيه سريع وواضح في رأس الساحة الفردية دون تغيير هيكلي
    const arenaPane = document.getElementById("soloShufflePane");
    if (arenaPane && !document.getElementById("quickGuideBanner")) {
      const tip = document.createElement("p");
      tip.id = "quickGuideBanner";
      tip.className = "muted-text";
      tip.style.cssText = "margin-bottom:10px;padding:8px 10px;background:rgba(245,197,66,0.07);border-radius:10px;border:1px solid rgba(245,197,66,0.2);";
      const guideText = {
        ar: "💡 احفظ مواقع البطاقات قبل الخلط، ثم اختر 3 بطاقات لتتفوق على الخصم.",
        en: "💡 Memorize the cards before shuffling, then pick 3 cards to outscore your rival.",
        fr: "💡 Mémorise les cartes avant le mélange, puis choisis 3 cartes pour battre l'adversaire.",
        ja: "💡 シャッフル前に位置を覚え、3枚のカードを選んで相手より高いスコアを狙おう。"
      };
      tip.textContent = guideText[state.lang] || guideText.ar;
      arenaPane.querySelector(".panel-card")?.prepend(tip);
    }
  })();
})();
function ensureOfflineStartWorks() {
  const startBtn =
    document.getElementById("btnStartGame") ||
    document.getElementById("startGameBtn") ||
    document.querySelector("[data-action='start-game']") ||
    Array.from(document.querySelectorAll("button")).find((btn) =>
      /ابدأ اللعب|start game|play/i.test(btn.textContent || "")
    );

  if (!startBtn || startBtn.dataset.offlineGuardBound === "1") return;
  startBtn.dataset.offlineGuardBound = "1";

  startBtn.addEventListener(
    "click",
    () => {
      if (!navigator.onLine) {
        const startScreen =
          document.getElementById("startScreen") ||
          document.getElementById("homeScreen") ||
          document.querySelector(".start-screen");
        const gameScreen =
          document.getElementById("gameScreen") ||
          document.getElementById("mainScreen") ||
          document.getElementById("appScreen");

        if (startScreen) startScreen.classList.add("hidden");
        if (gameScreen) {
          gameScreen.classList.remove("hidden");
          gameScreen.style.display = "block";
        }
      }
    },
    true
  );
}

document.addEventListener("DOMContentLoaded", ensureOfflineStartWorks);
window.addEventListener("load", ensureOfflineStartWorks);



