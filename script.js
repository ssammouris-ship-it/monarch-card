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
     2. تنسيقات الواجهة الموحّدة (فائقة الخفة بدون التغبيش الثقيل)
  ========================================================= */
  (function injectUnifiedLiteStyles() {
    if (document.getElementById("monarchUnifiedCss")) return;
    const st = document.createElement("style");
    st.id = "monarchUnifiedCss";
    st.textContent = `
      * { backdrop-filter: none !important; -webkit-backdrop-filter: none !important; }
      .panel-card { overflow: hidden; max-width: 100%; }
      .inv-card, .codex-card, .pack-card, .mythic-pack-card { contain: layout style; }

      /* Shimmer loading للشبكات البطيئة مثل H+ */
      @keyframes mShimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      .inv-card img, .codex-card-img, .pop-card img, #triviaMediaBox img, .shadow-img, .mpro-img {
        background: linear-gradient(90deg, #0f172a 25%, #1e293b 50%, #0f172a 75%);
        background-size: 200% 100%;
        animation: mShimmer 1.3s infinite linear;
      }

      /* لوحة الـ 6 بطاقات */
      .cards-board-6 { display: grid !important; grid-template-columns: repeat(3, minmax(0, 1fr)) !important; gap: 8px !important; width: 100% !important; max-width: 100% !important; overflow: hidden; padding: 2px; }
      .duel-slot { width: 100% !important; min-width: 0 !important; max-width: 100% !important; aspect-ratio: 3 / 4.1 !important; will-change: transform; position: relative; z-index: 1; }
      .duel-slot.moving-card { z-index: 10; filter: drop-shadow(0 0 8px rgba(245,197,66,0.5)); }
      .duel-card-inner { width: 100% !important; height: 100% !important; }

      /* تحدي الشعبية */
      .pop-bet-panel { background: rgba(7,9,18,0.65); border: 1px solid var(--border-soft); border-radius: 14px; padding: 12px; margin-bottom: 12px; text-align: center; }
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
      .pop-card.win-hl { border-color: #22c55e; box-shadow: 0 0 16px rgba(34,197,94,0.35); }
      .pop-card.lose-hl { border-color: #ef4444; box-shadow: 0 0 16px rgba(239,68,68,0.35); }
      .pop-fav-badge { position: absolute; top: 8px; inset-inline: 8px; background: rgba(7,9,18,0.92); border: 1px solid var(--gold); color: var(--gold); padding: 5px 8px; border-radius: 999px; font-weight: 900; font-size: 0.84rem; }
      .pop-decision-box { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 12px; }
      .btn-cashout { background: linear-gradient(135deg, #22c55e, #15803d); color: #fff; border: none; border-radius: 12px; padding: 11px 10px; font-weight: 800; font-size: 0.82rem; cursor: pointer; }
      .btn-double { background: linear-gradient(135deg, #f43f5e, #f59e0b); color: #fff; border: none; border-radius: 12px; padding: 11px 10px; font-weight: 800; font-size: 0.82rem; cursor: pointer; }

      /* ألغاز + تخمين الظل */
      .clue-card-box { width: 100%; display: flex; flex-direction: column; align-items: center; gap: 8px; padding: 10px; text-align: center; }
      .clue-emblem { width: 64px; height: 64px; border-radius: 18px; background: rgba(245,197,66,0.14); border: 2px solid var(--gold); display: flex; align-items: center; justify-content: center; font-size: 2rem; }
      .clue-tags { display: flex; flex-wrap: wrap; justify-content: center; gap: 6px; margin-top: 4px; }
      .clue-tag { background: rgba(255,255,255,0.07); border: 1px solid rgba(245,197,66,0.35); color: var(--gold); padding: 4px 10px; border-radius: 999px; font-size: 0.76rem; font-weight: 700; }
      .shadow-stage { position: relative; width: 190px; height: 220px; margin: 8px auto 12px; border-radius: 16px; overflow: hidden; border: 2px solid rgba(168,85,247,0.55); background: #020617; }
      .shadow-img { width: 100%; height: 100%; object-fit: cover; transition: filter 0.35s ease, transform 0.35s ease; }
      .shadow-img.masked { filter: brightness(0) contrast(1.4) drop-shadow(0 0 8px rgba(168,85,247,0.75)); }
      .shadow-img.zoomed { transform: scale(2.35); object-position: 50% 25%; }
      .codex-load-more { grid-column: 1 / -1; text-align: center; padding: 8px 0; }

      /* الحزم الخرافية وكشفها الاحترافي الخفيف */
      .mythic-pack-card { position: relative; overflow: hidden; border-radius: 16px; padding: 16px; display: flex; flex-direction: column; justify-content: space-between; gap: 10px; background: linear-gradient(145deg, #0f172a, #1e293b); }
      .pack-ssr { border: 2px solid #f59e0b; box-shadow: 0 0 16px rgba(245,158,11,0.32); }
      .pack-ur  { border: 2px solid #ef4444; box-shadow: 0 0 18px rgba(239,68,68,0.4); }
      .pack-sp  { border: 2px solid #a855f7; box-shadow: 0 0 22px rgba(168,85,247,0.55); }
      .mythic-badge { display: inline-block; padding: 3px 10px; border-radius: 999px; font-size: 12px; font-weight: 800; color: #fff; }
      .pack-ssr .mythic-badge { background: linear-gradient(90deg, #d97706, #f59e0b); }
      .pack-ur  .mythic-badge { background: linear-gradient(90deg, #dc2626, #f97316); }
      .pack-sp  .mythic-badge { background: linear-gradient(90deg, #7e22ce, #ec4899); }
      #mythicOpenOverlay { position: fixed; inset: 0; z-index: 99999; background: rgba(2,6,23,0.94); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 18px; text-align: center; }
      @keyframes packShake { 0%,100%{transform:rotate(0) scale(1)} 25%{transform:rotate(-7deg) scale(1.07)} 50%{transform:rotate(7deg) scale(1.12)} 75%{transform:rotate(-4deg) scale(1.07)} }
      @keyframes epicPopIn { 0%{opacity:0;transform:scale(0.65) translateY(20px)} 70%{opacity:1;transform:scale(1.04) translateY(-3px)} 100%{opacity:1;transform:scale(1) translateY(0)} }
      .pack-shaking { animation: packShake 0.35s infinite; font-size: 64px; }
      .mythic-reveal-card { animation: epicPopIn 0.45s cubic-bezier(0.22,1.15,0.36,1) forwards; max-width: 315px; width: 100%; background: #0f172a; border-radius: 18px; padding: 18px; }

      /* أدوات المركز الملكي، الفرز، عدّاد الضمان، والرتب */
      .mpro-overlay { position: fixed; inset: 0; z-index: 10020; background: rgba(2,6,23,0.92); display: flex; align-items: center; justify-content: center; padding: 14px; }
      .mpro-box { width: 100%; max-width: 440px; max-height: 86vh; display: flex; flex-direction: column; background: #0f172a; border: 1px solid rgba(56,189,248,0.42); border-radius: 18px; padding: 16px; color: #f8fafc; overflow: hidden; }
      .mpro-scroll { overflow-y: auto; flex: 1; padding-inline-end: 2px; }
      .mpro-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; gap: 8px; }
      .mpro-close { background: none; border: none; color: #94a3b8; font-size: 1.2rem; cursor: pointer; padding: 4px 8px; }
      .mpro-tabs { display: flex; gap: 6px; overflow-x: auto; padding-bottom: 8px; margin-bottom: 8px; }
      .mpro-tab { padding: 7px 11px; border-radius: 10px; border: 1px solid #334155; background: #1e293b; color: #cbd5e1; font-weight: 800; font-size: 0.76rem; white-space: nowrap; cursor: pointer; }
      .mpro-tab.active { border-color: #f59e0b; background: rgba(245,158,11,0.22); color: #fde047; }
      .mpro-card { background: #1e293b; border: 1px solid rgba(148,163,184,0.22); border-radius: 12px; padding: 10px; margin-bottom: 8px; }
      .mpro-bar-track { width: 100%; height: 7px; background: #020617; border-radius: 999px; overflow: hidden; margin-top: 6px; }
      .mpro-bar-fill { height: 100%; background: linear-gradient(90deg, #38bdf8, #f59e0b); border-radius: 999px; }
      .mpro-btn { padding: 7px 12px; border-radius: 9px; border: none; background: linear-gradient(135deg, #22c55e, #16a34a); color: #fff; font-weight: 800; font-size: 0.78rem; cursor: pointer; }
      .mpro-btn:disabled { opacity: 0.45; cursor: not-allowed; }
      .mpro-fab { position: fixed; bottom: 72px; inset-inline-end: 12px; z-index: 9980; width: 46px; height: 46px; border-radius: 50%; border: 2px solid #f59e0b; background: linear-gradient(135deg, #1e293b, #0f172a); color: #fde047; font-size: 1.2rem; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 18px rgba(0,0,0,0.55); cursor: pointer; }
      .mpro-fab-dot { position: absolute; top: -2px; right: -2px; min-width: 17px; height: 17px; padding: 0 4px; border-radius: 999px; background: #ef4444; color: #fff; font-size: 0.65rem; font-weight: 900; display: flex; align-items: center; justify-content: center; }
      .inv-tools-bar { display: flex; gap: 6px; align-items: center; flex-wrap: wrap; margin: 8px 0; }
      .inv-sort-select { flex: 1; min-width: 135px; padding: 7px 10px; border-radius: 10px; background: #0f172a; border: 1px solid rgba(148,163,184,0.35); color: #f8fafc; font-size: 0.78rem; font-weight: 700; }
      .inv-recycle-btn { padding: 7px 11px; border-radius: 10px; border: 1px solid rgba(56,189,248,0.45); background: rgba(56,189,248,0.14); color: #7dd3fc; font-size: 0.76rem; font-weight: 800; cursor: pointer; white-space: nowrap; }
      .copy-count-badge { position: absolute; bottom: 26px; inset-inline-end: 6px; padding: 2px 6px; border-radius: 999px; background: rgba(2,6,23,0.85); border: 1px solid rgba(251,191,36,0.55); color: #fde047; font-size: 0.66rem; font-weight: 900; }
      .pity-shop-box { grid-column: 1 / -1; background: linear-gradient(145deg, #0f172a, #172554); border: 1px solid rgba(56,189,248,0.38); border-radius: 14px; padding: 11px 13px; display: flex; flex-direction: column; gap: 6px; }
      .hud-avatar-mini { width: 22px; height: 22px; border-radius: 50%; object-fit: cover; border: 1.5px solid #f59e0b; vertical-align: middle; margin-inline-end: 4px; }
      .hud-rank-badge { font-size: 0.72rem; margin-inline-end: 3px; }
    `;
    document.head.appendChild(st);
  })();

  /* =========================================================
     3. القواعد، الحزم، الرتب، والتصنيف الصارم الموحد للأساطير
  ========================================================= */
  const RANK_POWER = { N: 1, C: 2, R: 3, SR: 4, SSR: 5, UR: 6, SP: 7 };
  const RARITY_COLORS = {
    SP: "#ec4899", UR: "#ef4444", SSR: "#f59e0b",
    SR: "#a855f7", R: "#3b82f6", C: "#22c55e", N: "#94a3b8"
  };
  const LIMITED_CAPS = { SP: 1, UR: 3, SSR: 10 };
  const REFUSE_PENALTY = { SP: 1000, UR: 500, SSR: 100 };
  const INACTIVITY_DAYS = { SP: 7, UR: 14, SSR: 30 };
  const DAY_MS = 24 * 60 * 60 * 1000;
  const DUP_GOLD_REWARD = { N: 30, C: 60, R: 130, SR: 280, SSR: 700, UR: 1500, SP: 3000 };
  const RECYCLE_DUST_VALUE = { N: 5, C: 10, R: 22, SR: 50 };
  const PITY_THRESHOLD = 30;

  const TROPHY_RANKS = [
    { id: "bronze", min: 0, icon: "🥉", rewardGems: 0 },
    { id: "silver", min: 150, icon: "🥈", rewardGems: 30 },
    { id: "gold", min: 400, icon: "🥇", rewardGems: 80 },
    { id: "platinum", min: 800, icon: "💎", rewardGems: 180 },
    { id: "monarch", min: 1500, icon: "👑", rewardGems: 400 }
  ];

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
    { id: "mythic_ssr", rarity: "SSR", cls: "pack-ssr", gems: 1000, goldReward: 15000 },
    { id: "mythic_ur", rarity: "UR", cls: "pack-ur", gems: 2500, goldReward: 50000 },
    { id: "mythic_sp", rarity: "SP", cls: "pack-sp", gems: 5000, goldReward: 100000 }
  ];

  // قائمة VIP الموحدة والصارمة (تدمج VIP_RULES + EXTRA_LEGENDS + Gokuu Son بدون أي تعارض)
  const STRICT_LEGENDS_RULES = [
    // SP (القمة المطلقة)
    { names: ["monkey d. luffy", "luffy monkey"], anime: "one piece", rarity: "SP" },
    { names: ["satoru gojo", "satoru gojou"], anime: "jujutsu", rarity: "SP" },
    { names: ["ryomen sukuna", "sukuna"], anime: "jujutsu", rarity: "SP" },
    { names: ["son goku", "goku son", "gokuu son", "son gokuu"], anime: "dragon ball", rarity: "SP" },
    { names: ["beerus"], anime: "dragon ball", story: /god of destruction|universe 7|whis/i, rarity: "SP" },
    { names: ["whis"], anime: "dragon ball", story: /angel|beerus|universe 7|grand minister/i, rarity: "SP" },
    { names: ["zeno", "zen-oh"], anime: "dragon ball", story: /omni-king|universe|multiverse|god/i, rarity: "SP" },
    { names: ["goku black", "gokuu black"], anime: "dragon ball", story: /zamasu|saiyan|zero mortals|time ring/i, rarity: "SP" },
    { names: ["broly", "jiren"], anime: "dragon ball", story: /saiyan|pride troopers|universe|power/i, rarity: "SP" },
    { names: ["guts"], anime: "berserk", rarity: "SP" },
    { names: ["sung jin-woo", "jin-u seong", "jinwoo sung"], anime: "solo leveling", rarity: "SP" },
    { names: ["sosuke aizen", "sousuke aizen"], anime: "bleach", rarity: "SP" },
    { names: ["yhwach", "genryuusai shigekuni yamamoto"], anime: "bleach", story: /quincy|soul society|gotei|zanpakuto|captain/i, rarity: "SP" },
    { names: ["madara uchiha", "uchiha madara"], anime: "naruto", rarity: "SP" },
    { names: ["hashirama senju", "kaguya otsutsuki", "kaguya ootsutsuki", "isshiki otsutsuki"], anime: "naruto", story: /hokage|chakra|otsutsuki|shinobi|konoha/i, rarity: "SP" },
    { names: ["levi", "levi ackerman"], anime: "titan", rarity: "SP" },
    { names: ["lelouch lamperouge", "lelouch vi britannia"], anime: "geass", rarity: "SP" },
    { names: ["shigeo kageyama"], anime: "mob psycho", rarity: "SP" },
    { names: ["rimuru tempest"], anime: "slime", rarity: "SP" },
    { names: ["saitama"], anime: "one punch", rarity: "SP" },
    { names: ["edward newgate", "newgate edward", "shanks", "kaido", "kaidou", "gol d. roger", "roger gol d."], anime: "one piece", rarity: "SP" },
    { names: ["isaac netero", "meruem"], anime: "hunter", rarity: "SP" },
    { names: ["yoriichi tsugikuni"], anime: "demon slayer", rarity: "SP" },
    { names: ["anos voldigoad"], anime: "demon king academy", rarity: "SP" },
    { names: ["gilgamesh"], anime: "fate", rarity: "SP" },
    { names: ["ainz ooal gown"], anime: "overlord", rarity: "SP" },
    { names: ["sinbad"], anime: "magi", rarity: "SP" },
    { names: ["alucard"], anime: "hellsing", story: /vampire|hellsing|integra|undead/i, rarity: "SP" },
    { names: ["reinhard van astrea"], anime: "re:zero", story: /sword saint|knight|astrea/i, rarity: "SP" },
    { names: ["simon"], anime: "gurren lagann", story: /drill|spiral|kamina|gunmen|lagann/i, rarity: "SP" },
    { names: ["mori jin", "jin mori"], anime: "god of high school", story: /taekwondo|monkey king|tournament/i, rarity: "SP" },

    // UR (النخبة والعباقرة)
    { names: ["naruto uzumaki", "sasuke uchiha", "itachi uchiha", "minato namikaze", "kakashi hatake", "pain", "nagato", "obito uchiha", "jiraiya"], anime: "naruto", rarity: "UR" },
    { names: ["roronoa zoro", "zoro roronoa", "sanji", "dracule mihawk", "mihawk dracule", "trafalgar law", "law trafalgar", "donquixote doflamingo", "portgas d. ace", "sabo", "monkey d. garp"], anime: "one piece", rarity: "UR" },
    { names: ["eren yeager", "eren jaeger", "mikasa ackerman", "erwin smith"], anime: "titan", rarity: "UR" },
    { names: ["ichigo kurosaki", "kisuke urahara", "kenpachi zaraki", "byakuya kuchiki", "ulquiorra cifer", "toushirou hitsugaya", "toshiro hitsugaya"], anime: "bleach", rarity: "UR" },
    { names: ["light yagami", "l lawliet", "ryuk"], anime: "death note", rarity: "UR" },
    { names: ["killua zoldyck", "hisoka morow", "gon freecss", "kurapika", "chrollo lucilfer", "zeno zoldyck", "silva zoldyck", "illumi zoldyck"], anime: "hunter", rarity: "UR" },
    { names: ["vegeta", "piccolo", "gohan son", "son gohan", "frieza", "freeza", "cell", "majin buu"], anime: "dragon ball", rarity: "UR" },
    { names: ["tanjirou kamado", "tanjiro kamado", "muzan kibutsuji", "kokushibo", "akaza", "kyoujurou rengoku", "kyojuro rengoku"], anime: "demon slayer", rarity: "UR" },
    { names: ["toji fushiguro", "suguru geto", "suguru getou", "yuuta okkotsu", "yuta okkotsu"], anime: "jujutsu", rarity: "UR" },
    { names: ["edward elric", "roy mustang"], anime: "fullmetal", rarity: "UR" },
    { names: ["dio brando", "jotaro kujo", "giorno giovanna"], anime: "jojo", rarity: "UR" },
    { names: ["dazai osamu", "osamu dazai", "chuuya nakahara"], anime: "bungo", rarity: "UR" },
    { names: ["gintoki sakata"], anime: "gintama", rarity: "UR" },
    { names: ["garou", "tatsumaki"], anime: "one punch", rarity: "UR" },
    { names: ["escanor", "meliodas", "ban"], anime: "seven deadly sins", rarity: "UR" },
    { names: ["all might", "toshinori yagi"], anime: "hero academia", rarity: "UR" },
    { names: ["griffith"], anime: "berserk", rarity: "UR" },
    { names: ["thorfinn"], anime: "vinland", rarity: "UR" },
    { names: ["saber", "artoria pendragon", "archer", "emiya"], anime: "fate", rarity: "UR" },
    { names: ["frieren"], anime: "frieren", rarity: "UR" },
    { names: ["makima", "denji"], anime: "chainsaw man", rarity: "UR" },
    { names: ["esdeath", "akame"], anime: "akame ga kill", rarity: "UR" },
    { names: ["yami sukehiro", "asta"], anime: "black clover", rarity: "UR" },
    { names: ["yuujirou hanma", "yujiro hanma", "baki hanma"], anime: "baki", rarity: "UR" },
    { names: ["musashi miyamoto"], anime: "vagabond", rarity: "UR" },
    { names: ["alucard"], anime: "castlevania", story: /dracula|dhampir|vampire|belmont/i, rarity: "UR" },

    // SSR (شخصيات قوية ومحبوبة)
    { names: ["sebastian michaelis"], anime: "black butler", rarity: "SSR" },
    { names: ["ken kaneki"], anime: "tokyo ghoul", rarity: "SSR" },
    { names: ["robin nico", "nico robin", "nami"], anime: "one piece", rarity: "SSR" },
    { names: ["senkuu ishigami"], anime: "dr. stone", rarity: "SSR" },
    { names: ["manjirou sano"], anime: "tokyo revengers", rarity: "SSR" },
    { names: ["megumi fushiguro"], anime: "jujutsu", rarity: "SSR" },
    { names: ["kusuo saiki"], anime: "saiki", rarity: "SSR" },
    { names: ["koro-sensei"], anime: "assassination", rarity: "SSR" },
    { names: ["keigo takami", "izuku midoriya", "katsuki bakugou", "shouto todoroki"], anime: "hero academia", rarity: "SSR" },
    { names: ["shinei nouzen"], anime: "86", rarity: "SSR" }
  ];

  const NON_COMBAT_ANIME_RE = /k-on|silent voice|koe no katachi|clannad|toradora|kaguya-sama|horimiya|bocchi|oregairu|fruits basket|your lie in april|hyouka|nichijou|lucky star|nisekoi|love live|kimi ni todoke|violet evergarden|anohana|angel beats|haruhi|dress-up|komi|bunny girl|rascal does not dream|oreimo|haikyuu|blue lock|kuroko|aikatsu|real girl|food wars|shokugeki|paradise kiss|tokyo mew mew|natsume|princess kaguya/i;
  const COMBAT_GENRES = ["Action", "Adventure", "Fantasy", "Supernatural", "Sci-Fi", "Mecha"];
  const COMBAT_STORY_RE = /\b(fight|battle|warrior|sword|demon|curse|magic|power|king|assassin|hero|villain|hunter|ninja|pirate|shinigami|sorcerer|saiyan|titan|alchemist|stand|quirk|strongest|army|vampire|mecha|martial|monster|knight)\b/i;

  function classifyStrictRarity(ch) {
    if (!ch) return "N";
    const name = String(ch.name || "").trim().toLowerCase();
    const anime = String(ch.anime || "").trim().toLowerCase();
    const story = String(ch.bioEn || "").toLowerCase();
    const favs = Number(ch.favorites || ch.favourites || 0);
    const genres = Array.isArray(ch.genres) ? ch.genres : [];

    for (let i = 0; i < STRICT_LEGENDS_RULES.length; i++) {
      const rule = STRICT_LEGENDS_RULES[i];
      if (rule.names.includes(name)) {
        const animeOk = !rule.anime || !anime || anime.includes(rule.anime) || story.includes(rule.anime);
        const storyOk = !rule.story || rule.story.test(story) || story.length < 30;
        if (animeOk && storyOk) return rule.rarity;
      }
    }

    const isBlockedAnime = NON_COMBAT_ANIME_RE.test(anime);
    const hasCombatGenre = genres.some((g) => COMBAT_GENRES.includes(g));
    const hasCombatStory = COMBAT_STORY_RE.test(story);
    const isCombat = !isBlockedAnime && (hasCombatGenre || hasCombatStory);

    if (isCombat) {
      if (favs >= 18000) return "SP";
      if (favs >= 9000) return "UR";
      if (favs >= 3500) return "SSR";
      if (favs >= 1800) return "SR";
      if (favs >= 800) return "R";
      if (favs >= 300) return "C";
      return "N";
    }

    if (favs >= 12000) return "SR";
    if (favs >= 3500) return "R";
    if (favs >= 900) return "C";
    return "N";
  }

  /* =========================================================
     4. قاموس الترجمة الكامل للغات الأربع (AR / EN / FR / JA)
  ========================================================= */
  const I18N = {
    ar: {
      app_title: "أساطير بطاقات الأنمي", app_subtitle: "اجمع النوادر • نافس أونلاين • انتزع العرش",
      start_play: "ابدأ اللعب", nav_arena: "الساحة", nav_online: "أونلاين", nav_shop: "المتجر", nav_cards: "بطاقاتي", nav_codex: "النوادر",
      solo_shuffle: "🎴 نزال الـ 6 بطاقات", solo_trivia: "🧠 ألغاز الأنمي", solo_pop: "🔥 تحدي الشعبية", solo_shadow: "👁️ تخمين الظل",
      shuffle_title: "نزال الذاكرة (6 بطاقات)", shuffle_ready: "اختر الصعوبة وابدأ",
      diff_normal: "عادي (+2 💎)", diff_hard: "صعب (+3 💎)", diff_legend: "أسطوري (+4 💎)",
      lbl_you: "أنت", lbl_opp: "الخصم", shuffle_hint: "احفظ مواقع البطاقات!", btn_start_duel: "⚡ ابدأ النزال",
      trivia_title: "ألغاز الشخصيات والقدرات", lbl_streak: "السلسلة",
      tmode_img: "🖼️ صورة", tmode_sil: "🗡️ سلاح / قدرة", tmode_lore: "📜 قصة / وصف",
      trivia_who: "من هي هذه الشخصية؟", trivia_clue: "تعرّف على الشخصية من سلاحها أو قدرتها!", trivia_lore: "من صاحب هذه القصة؟",
      btn_5050: "✂️ حذف إجابة (50 🪙)", btn_skip: "⏭️ سؤال جديد", pop_title: "أي شخصية أكثر شعبية؟",
      shadow_title: "👁️ تحدي الظل واللقطة المقربة", shadow_mode_sil: "🌑 ظل غامض", shadow_mode_zoom: "🔍 لقطة مقربة",
      shadow_q: "من صاحب هذا الظل قبل انتهاء الوقت؟", shadow_q_zoom: "من صاحب هذه اللقطة المقربة؟", shadow_timeout: "⏰ انتهى الوقت!",
      online_tab_arena: "⚔️ ساحة 1 ضد 1", online_tab_challenges: "📩 التحديات", online_tab_leaders: "🏆 المتصدرون",
      online_title: "نزال الـ 6 بطاقات المباشر", online_sub: "اختر نمط المواجهة وتحدّ خصمك بكود الغرفة المباشر",
      lbl_duel_mode: "اختر نوع المواجهة:", mode_safe_title: "نزال آمن", mode_safe_desc: "ذهب + جواهر + كؤوس بدون مخاطرة",
      mode_gems_title: "رهان الجواهر", mode_gems_desc: "30 / 100 / 1000 💎 بموافقة الطرفين",
      mode_card_title: "رهان بطاقة نادرة", mode_card_desc: "مواجهة مصيرية على بطاقات النوادر",
      lbl_pick_stake: "اضغط على بطاقتك النادرة للرهان:", btn_create_room: "➕ إنشاء غرفة نزال جديدة",
      btn_quick_match: "⚡ بحث تلقائي عن خصم (Quick Match)", btn_cancel_qm: "✖️ إلغاء البحث التلقائي...",
      ph_room_code: "كود من 4 أرقام", btn_join_room: "دخول", lbl_room_code: "الكود", btn_leave: "خروج",
      consent_warn: "⚠️ نزال رهان: يتطلب موافقة الطرفين قبل البدء", btn_agree: "✅ أوافق على الرهان", btn_cancel: "❌ إلغاء",
      ch_title: "📩 تحديات البطاقات النادرة", ch_desc: "تظهر هنا تحديات اللاعبين على بطاقاتك النادرة.",
      lead_title: "🏆 أبطال السيرفر (Top 50)", shop_title: "🛒 متجر الحزم الأسطورية",
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
      mythic_ssr_t: "👑 حزمة SSR الخرافية", mythic_ssr_d: "بطاقة SSR مضمونة + 15,000 🪙 ذهب فوري",
      mythic_ur_t: "🔥 حزمة UR الأسطورية", mythic_ur_d: "بطاقة UR مضمونة + 50,000 🪙 ذهب فوري",
      mythic_sp_t: "🌌 حزمة SP الكونية", mythic_sp_d: "بطاقة SP نادرة مضمونة + 100,000 🪙 ذهب فوري",
      mythic_badge_gur: "مضمون", mythic_buy: "شراء بـ",
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
      pop_round: "الجولة", pop_pot: "الجائزة", pop_time: "⏱️ الوقت",
      pop_cashout: "💰 سحب الأرباح", pop_double: "🔥 استمرار ×2",
      pop_lost: "💥 خسرت الرهان!", pop_timeout: "⏰ انتهى الوقت! خسرت الرهان", pop_cashed: "✅ تم سحب الأرباح بنجاح!",
      /* الميزات الاحترافية الجديدة */
      ch_cards_title: "⚔️ بطاقات التحدي", ch_cards_use: "تحدّي مالك الآن", ch_cards_empty: "لا تملك بطاقات تحدي من هذا المستوى.",
      ch_cards_no_targets: "لا يوجد ملاك آخرون متاحون حالياً.", ch_cards_converted: "⚔️ اكتمل حد السيرفر! حصلت على بطاقة تحدي:",
      ch_cards_sent: "⚔️ تم إرسال التحدي إلى المالك بنجاح!", ch_cards_refuse_pay: "رفض ودفع", ch_cards_paid: "💎 دفعت الغرامة وحميت بطاقتك.",
      ch_cards_forfeit: "⚠️ لا تملك جواهر كافية! خسرت البطاقة وعادت للمتجر.",
      bulk_title: "🛒 شراء حزم بالجملة", bulk_qty: "عدد الحزم:", bulk_total: "التكلفة:", bulk_buy: "شراء وفتح الكل ⚡",
      bulk_res: "🎉 نتائج فتح الحزم", bulk_ch_gained: "⚔️ بطاقات تحدي مكتسبة:", bulk_ok: "ممتاز ✓",
      pity_lbl: "✨ عدّاد الضمان: بطاقة نادرة مضمونة خلال", pity_pulls: "سحبة", pity_ready: "🔥 السحبة القادمة نادرة مضمونة!",
      dust_lbl: "✨ غبار البطاقات", dust_pack: "حزمة الغبار (100 ✨)", dust_no: "⚠️ تحتاج 100 غبار بطاقات!",
      sort_rarity: "الفرز: الأندر", sort_newest: "الفرز: الأحدث", sort_copies: "الفرز: الأكثر نسخاً", sort_pop: "الفرز: الشعبية", sort_anime: "الفرز: الأنمي",
      recycle_dups: "♻️ تدوير المكرر", recycle_done: "✨ تم تدوير النسخ الفائضة وحصلت على:", recycle_none: "لا توجد نسخ فائضة (N/C/R/SR) للتدوير.",
      hub_title: "👑 المركز الملكي", hub_daily: "📅 اليومي", hub_albums: "📚 الألبومات", hub_ranks: "🏅 الرتب", hub_inbox: "🔔 الوارد",
      daily_streak: "🔥 سلسلة الدخول (7 أيام)", daily_claim: "استلام", daily_claimed: "تم ✓",
      m_packs: "افتح 5 حزم في المتجر", m_duels: "اربح 3 نزالات ذاكرة", m_trivia: "أجب عن 5 ألغاز بنجاح", m_shadow: "اربح 3 جولات ظل/شعبية",
      rank_bronze: "برونزي", rank_silver: "فضي", rank_gold: "ذهبي", rank_platinum: "بلاتيني", rank_monarch: "ملكي",
      cloud_title: "☁️ نقل ومزامنة الحساب سحابياً", cloud_code: "كودك الشخصي:", cloud_save: "☁️ حفظ نسخة سحابية الآن",
      cloud_restore: "استرجاع", cloud_ph: "أدخل كود الاسترجاع (MNR-...)", profile_avatar: "🖼️ صورة البروفايل واللقب",
      tut_next: "التالي ←", tut_done: "انطلق للعب! 🚀",
      tut_1_t: "👑 بطاقات بنسخ عالمية محدودة", tut_1_d: "كل شخصية SP توجد منها نسخة واحدة فقط في السيرفر (#1/1)، و3 نسخ لـ UR، و10 نسخ لـ SSR!",
      tut_2_t: "⚔️ بطاقات التحدي والرهان", tut_2_d: "عند اكتمال حد السيرفر تحصل على بطاقة تحدي تتيح لك تحدي المالك: إما يقبل النزال أو يدفع الغرامة أو يخسر بطاقته!",
      tut_3_t: "🎁 المركز الملكي والأطوار", tut_3_d: "اضغط زر التاج 👑 لجمع مكافآت الدخول اليومي والمهام والألبومات، ونافس في الذاكرة والألغاز والظل وأونلاين 1v1."
    },
    en: {
      app_title: "Anime Card Legends", app_subtitle: "Collect Rares • Duel Online • Claim the Throne",
      start_play: "Start Game", nav_arena: "Arena", nav_online: "Online 1v1", nav_shop: "Shop", nav_cards: "My Cards", nav_codex: "Rare Codex",
      solo_shuffle: "🎴 6-Card Duel", solo_trivia: "🧠 Anime Trivia", solo_pop: "🔥 Popularity", solo_shadow: "👁️ Shadow Guess",
      shuffle_title: "Memory Duel (6 Cards)", shuffle_ready: "Choose difficulty & start",
      diff_normal: "Normal (+2 💎)", diff_hard: "Hard (+3 💎)", diff_legend: "Legendary (+4 💎)",
      lbl_you: "You", lbl_opp: "Opponent", shuffle_hint: "Memorize card positions!", btn_start_duel: "⚡ Start Duel",
      trivia_title: "Character & Ability Trivia", lbl_streak: "Streak",
      tmode_img: "🖼️ Image", tmode_sil: "🗡️ Weapon / Power", tmode_lore: "📜 Story / Lore",
      trivia_who: "Who is this character?", trivia_clue: "Guess by weapon or power!", trivia_lore: "Who does this story belong to?",
      btn_5050: "✂️ Remove 1 (50 🪙)", btn_skip: "⏭️ New Question", pop_title: "Which character is more popular?",
      shadow_title: "👁️ Shadow & Close-Up Challenge", shadow_mode_sil: "🌑 Silhouette", shadow_mode_zoom: "🔍 Close-Up",
      shadow_q: "Who is behind this shadow?", shadow_q_zoom: "Who is in this close-up?", shadow_timeout: "⏰ Time's up!",
      online_tab_arena: "⚔️ 1v1 Arena", online_tab_challenges: "📩 Challenges", online_tab_leaders: "🏆 Leaderboard",
      online_title: "Live 6-Card Duel", online_sub: "Pick your duel mode and battle live with a room code",
      lbl_duel_mode: "Select Duel Mode:", mode_safe_title: "Safe Duel", mode_safe_desc: "Gold + Gems + Trophies with zero risk",
      mode_gems_title: "Gem Wager", mode_gems_desc: "30 / 100 / 1000 💎 with mutual consent",
      mode_card_title: "Rare Card Stake", mode_card_desc: "High-stakes clash for rare limited cards",
      lbl_pick_stake: "Tap your rare card to stake:", btn_create_room: "➕ Create Duel Room",
      btn_quick_match: "⚡ Auto Matchmaking (Quick Match)", btn_cancel_qm: "✖️ Cancel Quick Match...",
      ph_room_code: "4-digit code", btn_join_room: "Join", lbl_room_code: "Code", btn_leave: "Leave",
      consent_warn: "⚠️ Wager Duel: Both players must agree before starting", btn_agree: "✅ Agree to Stake", btn_cancel: "❌ Cancel",
      ch_title: "📩 Rare Card Challenges", ch_desc: "Incoming challenges for your rare cards appear here.",
      lead_title: "🏆 Server Champions (Top 50)", shop_title: "🛒 Legendary Pack Shop",
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
      mythic_ssr_t: "👑 Mythic SSR Pack", mythic_ssr_d: "Guaranteed SSR + 15,000 🪙 Instant Gold",
      mythic_ur_t: "🔥 Legendary UR Pack", mythic_ur_d: "Guaranteed UR + 50,000 🪙 Instant Gold",
      mythic_sp_t: "🌌 Cosmic SP Pack", mythic_sp_d: "Guaranteed Rare SP + 100,000 🪙 Instant Gold",
      mythic_badge_gur: "Guaranteed", mythic_buy: "Buy for",
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
      pop_round: "Round", pop_pot: "Pot", pop_time: "⏱️ Time",
      pop_cashout: "💰 Cash Out", pop_double: "🔥 Double ×2",
      pop_lost: "💥 Wager lost!", pop_timeout: "⏰ Time's up!", pop_cashed: "✅ Prize collected!",
      ch_cards_title: "⚔️ Challenge Cards", ch_cards_use: "Challenge Owner", ch_cards_empty: "No challenge cards of this tier.",
      ch_cards_no_targets: "No other owners available right now.", ch_cards_converted: "⚔️ Server cap reached! Got Challenge Card:",
      ch_cards_sent: "⚔️ Challenge sent to owner!", ch_cards_refuse_pay: "Refuse & Pay", ch_cards_paid: "💎 Penalty paid. Card safe.",
      ch_cards_forfeit: "⚠️ Not enough gems! Card lost & returned to shop.",
      bulk_title: "🛒 Bulk Pack Purchase", bulk_qty: "Quantity:", bulk_total: "Total:", bulk_buy: "Buy & Open All ⚡",
      bulk_res: "🎉 Pack Results", bulk_ch_gained: "⚔️ Challenge Cards Gained:", bulk_ok: "Awesome ✓",
      pity_lbl: "✨ Pity Counter: Guaranteed rare in", pity_pulls: "pulls", pity_ready: "🔥 Next pull is a guaranteed rare!",
      dust_lbl: "✨ Card Dust", dust_pack: "Dust Pack (100 ✨)", dust_no: "⚠️ Requires 100 Card Dust!",
      sort_rarity: "Sort: Rarest", sort_newest: "Sort: Newest", sort_copies: "Sort: Most Copies", sort_pop: "Sort: Popularity", sort_anime: "Sort: Anime",
      recycle_dups: "♻️ Recycle Extras", recycle_done: "✨ Recycled extra copies for:", recycle_none: "No extra N/C/R/SR copies to recycle.",
      hub_title: "👑 Royal Hub", hub_daily: "📅 Daily", hub_albums: "📚 Albums", hub_ranks: "🏅 Ranks", hub_inbox: "🔔 Inbox",
      daily_streak: "🔥 7-Day Login Streak", daily_claim: "Claim", daily_claimed: "Done ✓",
      m_packs: "Open 5 Shop Packs", m_duels: "Win 3 Memory Duels", m_trivia: "Answer 5 Trivia Correctly", m_shadow: "Win 3 Shadow/Pop Rounds",
      rank_bronze: "Bronze", rank_silver: "Silver", rank_gold: "Gold", rank_platinum: "Platinum", rank_monarch: "Monarch",
      cloud_title: "☁️ Cloud Account Sync", cloud_code: "Your Sync Code:", cloud_save: "☁️ Save Cloud Backup",
      cloud_restore: "Restore", cloud_ph: "Enter Sync Code (MNR-...)", profile_avatar: "🖼️ Profile Avatar & Title",
      tut_next: "Next →", tut_done: "Let's Play! 🚀",
      tut_1_t: "👑 Globally Limited Rares", tut_1_d: "Only 1 SP copy exists server-wide (#1/1), 3 copies for UR, and 10 copies for SSR!",
      tut_2_t: "⚔️ Challenge Cards & Stakes", tut_2_d: "Pulling a capped rare grants a Challenge Card: challenge the owner to duel, pay gems, or forfeit the card!",
      tut_3_t: "🎁 Royal Hub & Modes", tut_3_d: "Tap the Crown 👑 for Daily Streaks, Missions, Albums & Inbox, and battle in Arena & Online 1v1."
    },
    fr: {
      app_title: "Légendes des Cartes Anime", app_subtitle: "Collectionne les Rares • Duel en Ligne",
      start_play: "Jouer", nav_arena: "Arène", nav_online: "En ligne", nav_shop: "Boutique", nav_cards: "Mes Cartes", nav_codex: "Raretés",
      solo_shuffle: "🎴 Duel 6 Cartes", solo_trivia: "🧠 Quiz Anime", solo_pop: "🔥 Popularité", solo_shadow: "👁️ Ombre",
      shuffle_title: "Duel Mémoire (6 Cartes)", shuffle_ready: "Choisis la difficulté",
      diff_normal: "Normal (+2 💎)", diff_hard: "Difficile (+3 💎)", diff_legend: "Légendaire (+4 💎)",
      lbl_you: "Toi", lbl_opp: "Adversaire", shuffle_hint: "Mémorise les cartes !", btn_start_duel: "⚡ Lancer le Duel",
      trivia_title: "Quiz Personnages", lbl_streak: "Série", tmode_img: "🖼️ Image", tmode_sil: "🗡️ Arme / Pouvoir", tmode_lore: "📜 Histoire",
      trivia_who: "Qui est ce personnage ?", trivia_clue: "Devine grâce au pouvoir !", trivia_lore: "À qui appartient cette histoire ?",
      btn_5050: "✂️ Retirer 1 (50 🪙)", btn_skip: "⏭️ Suivant", pop_title: "Quel personnage est le plus populaire ?",
      shadow_title: "👁️ Défi Ombre & Zoom", shadow_mode_sil: "🌑 Silhouette", shadow_mode_zoom: "🔍 Gros Plan",
      shadow_q: "Qui se cache derrière cette ombre ?", shadow_q_zoom: "Qui est sur ce gros plan ?", shadow_timeout: "⏰ Temps écoulé !",
      online_tab_arena: "⚔️ Arène 1v1", online_tab_challenges: "📩 Défis", online_tab_leaders: "🏆 Classement",
      online_title: "Duel Direct 6 Cartes", online_sub: "Affronte un joueur avec un code",
      lbl_duel_mode: "Mode de Duel :", mode_safe_title: "Duel Sûr", mode_safe_desc: "Or + Gemmes + Trophées sans risque",
      mode_gems_title: "Pari Gemmes", mode_gems_desc: "30 / 100 / 1000 💎 avec accord mutuel",
      mode_card_title: "Pari Carte Rare", mode_card_desc: "Duel décisif pour cartes rares",
      lbl_pick_stake: "Choisis ta carte rare :", btn_create_room: "➕ Créer une Salle",
      btn_quick_match: "⚡ Recherche Automatique (Quick Match)", btn_cancel_qm: "✖️ Annuler la recherche...",
      ph_room_code: "Code à 4 chiffres", btn_join_room: "Rejoindre", lbl_room_code: "Code", btn_leave: "Quitter",
      consent_warn: "⚠️ Accord des deux joueurs requis", btn_agree: "✅ Accepter", btn_cancel: "❌ Annuler",
      ch_title: "📩 Défis de Cartes Rares", ch_desc: "Les défis pour tes cartes rares s'affichent ici.",
      lead_title: "🏆 Top 50", shop_title: "🛒 Boutique de Packs", shop_sub: "Invoque les plus grands héros !",
      inv_title: "Mes Cartes", inv_unlimited: "∞ Stock Illimité", ph_search_cards: "🔍 Chercher...",
      filter_all: "Tout", btn_load_more: "Afficher plus ⬇️", codex_title: "👑 Codex des Légendes",
      codex_sub: "Clique sur une carte pour voir son dossier", ph_search_rare: "🔍 Chercher...", btn_claim: "Récupérer",
      set_title: "⚙️ Paramètres", set_name: "Nom :", btn_save: "Enregistrer", set_lang: "Langue :",
      set_bgm: "🎵 Musique", set_sfx: "🔔 Effets", set_uid: "ID", set_shield: "Bouclier", set_pool: "Personnages",
      pack_N: "Pack Débutant", pack_N_desc: "Invocation de base", pack_C: "Pack Aventurier", pack_C_desc: "Héros appréciés",
      pack_R: "Pack Élite", pack_R_desc: "Combattants célèbres", pack_SR: "Pack Capitaine", pack_SR_desc: "Héros puissants",
      pack_SSR: "Pack Mythique", pack_SSR_desc: "Éditions rares", pack_UR: "Pack Ultra", pack_UR_desc: "Chasseurs de rares",
      pack_SP: "Pack Royal", pack_SP_desc: "Invocation suprême",
      mythic_ssr_t: "👑 Pack SSR Mythique", mythic_ssr_d: "SSR garanti + 15 000 🪙 Or",
      mythic_ur_t: "🔥 Pack UR Légendaire", mythic_ur_d: "UR garanti + 50 000 🪙 Or",
      mythic_sp_t: "🌌 Pack SP Cosmique", mythic_sp_d: "SP rare garanti + 100 000 🪙 Or",
      mythic_badge_gur: "Garanti", mythic_buy: "Acheter",
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
      pop_round: "Manche", pop_pot: "Gains", pop_time: "⏱️ Temps",
      pop_cashout: "💰 Encaisser", pop_double: "🔥 Doubler ×2", pop_lost: "💥 Perdu !", pop_timeout: "⏰ Temps écoulé !", pop_cashed: "✅ Encaissé !",
      ch_cards_title: "⚔️ Cartes de Défi", ch_cards_use: "Défier", ch_cards_empty: "Aucune carte de défi de ce rang.",
      ch_cards_no_targets: "Aucun autre propriétaire disponible.", ch_cards_converted: "⚔️ Limite atteinte ! Carte de défi :",
      ch_cards_sent: "⚔️ Défi envoyé !", ch_cards_refuse_pay: "Refuser & Payer", ch_cards_paid: "💎 Pénalité payée. Carte protégée.",
      ch_cards_forfeit: "⚠️ Gemmes insuffisantes ! Carte retournée en boutique.",
      bulk_title: "🛒 Achat en Gros", bulk_qty: "Quantité :", bulk_total: "Total :", bulk_buy: "Acheter & Ouvrir ⚡",
      bulk_res: "🎉 Résultats", bulk_ch_gained: "⚔️ Cartes de défi :", bulk_ok: "Super ✓",
      pity_lbl: "✨ Garantie : Carte rare dans", pity_pulls: "tirages", pity_ready: "🔥 Prochain tirage rare garanti !",
      dust_lbl: "✨ Poussière", dust_pack: "Pack Poussière (100 ✨)", dust_no: "⚠️ 100 Poussières requises !",
      sort_rarity: "Tri : Rareté", sort_newest: "Tri : Récentes", sort_copies: "Tri : Copies", sort_pop: "Tri : Popularité", sort_anime: "Tri : Anime",
      recycle_dups: "♻️ Recycler Doublons", recycle_done: "✨ Doublons recyclés :", recycle_none: "Aucun doublon N/C/R/SR à recycler.",
      hub_title: "👑 Centre Royal", hub_daily: "📅 Quotidien", hub_albums: "📚 Albums", hub_ranks: "🏅 Rangs", hub_inbox: "🔔 Boîte",
      daily_streak: "🔥 Série de 7 Jours", daily_claim: "Réclamer", daily_claimed: "Fait ✓",
      m_packs: "Ouvrir 5 packs", m_duels: "Gagner 3 duels mémoire", m_trivia: "5 bonnes réponses quiz", m_shadow: "Gagner 3 manches Ombre/Pop",
      rank_bronze: "Bronze", rank_silver: "Argent", rank_gold: "Or", rank_platinum: "Platine", rank_monarch: "Monarque",
      cloud_title: "☁️ Sauvegarde Cloud", cloud_code: "Ton Code :", cloud_save: "☁️ Sauvegarder",
      cloud_restore: "Restaurer", cloud_ph: "Code (MNR-...)", profile_avatar: "🖼️ Avatar & Titre",
      tut_next: "Suivant →", tut_done: "C'est parti ! 🚀",
      tut_1_t: "👑 Cartes Rares Limitées", tut_1_d: "1 seule copie SP par serveur (#1/1), 3 copies UR et 10 copies SSR !",
      tut_2_t: "⚔️ Cartes de Défi", tut_2_d: "Les doublons au-delà de la limite deviennent des Cartes de Défi pour affronter les propriétaires !",
      tut_3_t: "🎁 Centre Royal & Modes", tut_3_d: "Clique sur la Couronne 👑 pour les missions quotidiennes, albums et défis."
    },
    ja: {
      app_title: "アニメカード・レジェンド", app_subtitle: "限定レア収集 • オンライン対戦",
      start_play: "ゲーム開始", nav_arena: "アリーナ", nav_online: "オンライン", nav_shop: "ショップ", nav_cards: "所持カード", nav_codex: "限定図鑑",
      solo_shuffle: "🎴 6枚決闘", solo_trivia: "🧠 クイズ", solo_pop: "🔥 人気対決", solo_shadow: "👁️ シルエット",
      shuffle_title: "記憶決闘 (6枚)", shuffle_ready: "難易度を選択",
      diff_normal: "普通 (+2 💎)", diff_hard: "難しい (+3 💎)", diff_legend: "伝説 (+4 💎)",
      lbl_you: "あなた", lbl_opp: "相手", shuffle_hint: "位置を記憶せよ！", btn_start_duel: "⚡ 決闘開始",
      trivia_title: "アニメクイズ", lbl_streak: "連勝", tmode_img: "🖼️ 画像", tmode_sil: "🗡️ 武器・能力", tmode_lore: "📜 ストーリー",
      trivia_who: "このキャラは誰？", trivia_clue: "ヒントから当てよう！", trivia_lore: "この物語の主人公は？",
      btn_5050: "✂️ 1択削除 (50 🪙)", btn_skip: "⏭️ 次の問題", pop_title: "より人気のあるキャラは？",
      shadow_title: "👁️ シルエット＆ズームクイズ", shadow_mode_sil: "🌑 シルエット", shadow_mode_zoom: "🔍 ズーム",
      shadow_q: "この影のキャラは誰？", shadow_q_zoom: "このアップは誰？", shadow_timeout: "⏰ 時間切れ！",
      online_tab_arena: "⚔️ 1対1対戦", online_tab_challenges: "📩 挑戦状", online_tab_leaders: "🏆 ランキング",
      online_title: "リアルタイム6枚決闘", online_sub: "ルームコードで対戦しよう",
      lbl_duel_mode: "モード選択：", mode_safe_title: "安全マッチ", mode_safe_desc: "リスクなしで報酬獲得",
      mode_gems_title: "ジェム賭け戦", mode_gems_desc: "30 / 100 / 1000 💎",
      mode_card_title: "限定カード争奪戦", mode_card_desc: "希少カードを懸けた勝負",
      lbl_pick_stake: "賭けるレアカードを選択：", btn_create_room: "➕ ルーム作成",
      btn_quick_match: "⚡ 自動マッチング (Quick Match)", btn_cancel_qm: "✖️ 検索をキャンセル...",
      ph_room_code: "4桁コード", btn_join_room: "参加", lbl_room_code: "コード", btn_leave: "退出",
      consent_warn: "⚠️ 双方の同意が必要です", btn_agree: "✅ 同意", btn_cancel: "❌ キャンセル",
      ch_title: "📩 挑戦状", ch_desc: "届いた挑戦状が表示されます。", lead_title: "🏆 トップ50",
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
      mythic_ssr_t: "👑 神話SSRパック", mythic_ssr_d: "SSR確定 + 15,000 🪙",
      mythic_ur_t: "🔥 伝説URパック", mythic_ur_d: "UR確定 + 50,000 🪙",
      mythic_sp_t: "🌌 宇宙SPパック", mythic_sp_d: "SP確定 + 100,000 🪙",
      mythic_badge_gur: "確定", mythic_buy: "購入",
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
      pop_round: "ラウンド", pop_pot: "賞金", pop_time: "⏱️ 時間",
      pop_cashout: "💰 獲得", pop_double: "🔥 2倍", pop_lost: "💥 没収！", pop_timeout: "⏰ 時間切れ！", pop_cashed: "✅ 獲得！",
      ch_cards_title: "⚔️ チャレンジカード", ch_cards_use: "所有者に挑戦", ch_cards_empty: "このランクのカードはありません。",
      ch_cards_no_targets: "現在挑戦できる所有者がいません。", ch_cards_converted: "⚔️ 上限到達！チャレンジカード獲得:",
      ch_cards_sent: "⚔️ 挑戦を送信しました！", ch_cards_refuse_pay: "拒否して支払う", ch_cards_paid: "💎 ペナルティ支払い完了。",
      ch_cards_forfeit: "⚠️ ジェム不足！カードを失いショップに戻りました。",
      bulk_title: "🛒 まとめ買い", bulk_qty: "パック数:", bulk_total: "合計:", bulk_buy: "購入して一括開封 ⚡",
      bulk_res: "🎉 開封結果", bulk_ch_gained: "⚔️ チャレンジカード:", bulk_ok: "OK ✓",
      pity_lbl: "✨ 天井カウント：レア確定まであと", pity_pulls: "回", pity_ready: "🔥 次回レア確定！",
      dust_lbl: "✨ カードダスト", dust_pack: "ダストパック (100 ✨)", dust_no: "⚠️ 100ダスト必要です！",
      sort_rarity: "並替: レア度", sort_newest: "並替: 新着", sort_copies: "並替: 所持数", sort_pop: "並替: 人気", sort_anime: "並替: 作品名",
      recycle_dups: "♻️ 重複分解", recycle_done: "✨ ダストを獲得:", recycle_none: "分解できる重複カードがありません。",
      hub_title: "👑 ロイヤルハブ", hub_daily: "📅 デイリー", hub_albums: "📚 アルバム", hub_ranks: "🏅 ランク", hub_inbox: "🔔 受信箱",
      daily_streak: "🔥 7日間ログイン連続", daily_claim: "受取", daily_claimed: "済 ✓",
      m_packs: "パックを5回開封", m_duels: "記憶決闘で3勝", m_trivia: "クイズに5問正解", m_shadow: "影/人気で3勝",
      rank_bronze: "ブロンズ", rank_silver: "シルバー", rank_gold: "ゴールド", rank_platinum: "プラチナ", rank_monarch: "モナーク",
      cloud_title: "☁️ クラウド同期", cloud_code: "同期コード:", cloud_save: "☁️ クラウド保存",
      cloud_restore: "復元", cloud_ph: "コード入力 (MNR-...)", profile_avatar: "🖼️ アバター＆称号",
      tut_next: "次へ →", tut_done: "プレイ開始！🚀",
      tut_1_t: "👑 サーバー限定レア", tut_1_d: "SPはサーバー全体で1枚(#1/1)、URは3枚、SSRは10枚限定！",
      tut_2_t: "⚔️ チャレンジカード", tut_2_d: "上限超えはチャレンジカードに変換。所有者に決闘を挑めます！",
      tut_3_t: "🎁 ロイヤルハブ＆対戦", tut_3_d: "王冠👑ボタンでデイリー報酬・アルバム・受信箱を確認できます。"
    }
  };

  function t(key) {
    return (I18N[state.lang] && I18N[state.lang][key]) || I18N.ar[key] || key;
  }
  /* === نهاية الجزء 1 من 8 (الصق الجزء 2 مباشرة هنا) === */
  /* =========================================================
     5. أدوات الأداء السريع، حالة اللاعب، الحفظ المدمج، ومنع التكرار
  ========================================================= */
  const STORAGE_KEY = "monarch_anime_legends_v3";
  const CACHE_CHARS_KEY = "monarch_anilist_cache_v5";
  const CACHE_TRANS_KEY = "monarch_trans_cache_v3";

  const generateUid = () => "usr_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  const generateSyncCode = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const seg = () => Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
    return `MNR-${seg()}-${seg()}`;
  };

  function fmtCompact(num) {
    const v = Number(num || 0);
    if (!Number.isFinite(v)) return "0";
    const a = Math.abs(v);
    if (a >= 1e15) return (v / 1e15).toFixed(1).replace(/\.0$/, "") + "Q";
    if (a >= 1e12) return (v / 1e12).toFixed(1).replace(/\.0$/, "") + "T";
    if (a >= 1e9) return (v / 1e9).toFixed(1).replace(/\.0$/, "") + "B";
    if (a >= 1e6) return (v / 1e6).toFixed(1).replace(/\.0$/, "") + "M";
    if (a >= 1e3) return (v / 1e3).toFixed(1).replace(/\.0$/, "") + "K";
    return String(Math.floor(v));
  }

  function vibrate(pattern) {
    try {
      if (!state.sfxEnabled) return;
      if (navigator.vibrate) navigator.vibrate(pattern || 15);
    } catch (_) {}
  }

  function getTodayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function getRankByTrophies(trophies) {
    const tr = Number(trophies || 0);
    let current = TROPHY_RANKS[0];
    for (let i = 0; i < TROPHY_RANKS.length; i++) {
      if (tr >= TROPHY_RANKS[i].min) current = TROPHY_RANKS[i];
    }
    return current;
  }

  let state = {
    uid: generateUid(),
    syncCode: generateSyncCode(),
    name: "البطل الملكي",
    lang: "ar",
    gold: 700,
    gems: 20,
    tickets: 0,
    trophies: 0,
    bgmEnabled: true,
    sfxEnabled: true,
    shieldUntil: 0,
    inventory: [],
    challengeCards: { SP: 0, UR: 0, SSR: 0 },
    pity: 0,
    dust: 0,
    avatar: "",
    title: "",
    unlockedTitles: [],
    daily: { lastStreakDate: "", streak: 0, missionDate: "", progress: {}, claimed: {} },
    albumsClaimed: {},
    ranksClaimed: {},
    achClaimed: {},
    stats: { packs: 0, duels: 0, trivia: 0, shadow: 0, pop: 0 },
    inboxHistory: [],
    tutorialDone: false
  };

  let characterCatalog = new Map();
  let limitedRegistry = {};
  let transCache = {};
  let codexPageCursor = 3;
  let cachedRarityPools = null;
  let cachedPoolSize = 0;

  function ensureStateIntegrity() {
    if (!Array.isArray(state.inventory)) state.inventory = [];
    if (!state.syncCode) state.syncCode = generateSyncCode();
    if (!state.challengeCards || typeof state.challengeCards !== "object") {
      state.challengeCards = { SP: 0, UR: 0, SSR: 0 };
    }
    state.challengeCards.SP = Math.max(0, Number(state.challengeCards.SP || 0));
    state.challengeCards.UR = Math.max(0, Number(state.challengeCards.UR || 0));
    state.challengeCards.SSR = Math.max(0, Number(state.challengeCards.SSR || 0));
    state.pity = Math.max(0, Number(state.pity || 0));
    state.dust = Math.max(0, Number(state.dust || 0));
    if (!Array.isArray(state.unlockedTitles)) state.unlockedTitles = [];
    if (!Array.isArray(state.inboxHistory)) state.inboxHistory = [];
    if (!state.daily || typeof state.daily !== "object") {
      state.daily = { lastStreakDate: "", streak: 0, missionDate: "", progress: {}, claimed: {} };
    }
    if (!state.daily.progress) state.daily.progress = {};
    if (!state.daily.claimed) state.daily.claimed = {};
    if (!state.albumsClaimed) state.albumsClaimed = {};
    if (!state.ranksClaimed) state.ranksClaimed = {};
    if (!state.achClaimed) state.achClaimed = {};
    if (!state.stats) state.stats = { packs: 0, duels: 0, trivia: 0, shadow: 0, pop: 0 };

    const today = getTodayKey();
    if (state.daily.missionDate !== today) {
      state.daily.missionDate = today;
      state.daily.progress = { packs: 0, duels: 0, trivia: 0, shadow: 0 };
      state.daily.claimed = {};
    }
  }

  function trackProgress(key, delta = 1) {
    ensureStateIntegrity();
    state.daily.progress[key] = Number(state.daily.progress[key] || 0) + delta;
    state.stats[key] = Number(state.stats[key] || 0) + delta;
    if (typeof refreshRoyalFabBadge === "function") refreshRoyalFabBadge();
  }

  // دمج المكررات + حماية الندرة من الانخفاض + تحويل فائض النوادر إلى بطاقات تحدي
  let isNormalizingInv = false;
  function normalizeAndDedupeInventory(notifyConversion = false) {
    if (isNormalizingInv) return { SP: 0, UR: 0, SSR: 0 };
    ensureStateIntegrity();
    const list = state.inventory;
    if (!list.length) return { SP: 0, UR: 0, SSR: 0 };

    isNormalizingInv = true;
    const gainedCh = { SP: 0, UR: 0, SSR: 0 };
    try {
      const catByName = new Map();
      characterCatalog.forEach((c) => {
        if (c && c.name) catByName.set(String(c.name).trim().toLowerCase(), c);
      });

      const merged = new Map();
      for (let i = 0; i < list.length; i++) {
        const item = list[i];
        if (!item || typeof item !== "object") continue;

        const normName = String(item.name || "").trim().toLowerCase();
        const cat = characterCatalog.get(Number(item.charId || item.id)) || catByName.get(normName) || null;
        const uniqueKey = normName || String(cat?.id || item.charId || item.id || "");
        if (!uniqueKey) continue;

        const strictR = classifyStrictRarity({
          name: cat?.name || item.name,
          anime: cat?.anime || item.anime || "",
          bioEn: cat?.bioEn || item.bioEn || "",
          favorites: cat?.favorites || item.favorites || 0,
          genres: cat?.genres || []
        });
        const oldR = item.rarity || "N";
        const bestR = (RANK_POWER[strictR] || 0) >= (RANK_POWER[oldR] || 0) ? strictR : oldR;
        const cnt = Math.max(1, Number(item.copies || item.count || 1));

        if (!merged.has(uniqueKey)) {
          const obj = {
            ...item,
            charId: cat?.id || item.charId || item.id,
            name: cat?.name || item.name,
            nativeName: cat?.nativeName || item.nativeName || "",
            anime: cat?.anime || item.anime || "Anime Legend",
            image: cat?.image || item.image || "",
            bioEn: cat?.bioEn || item.bioEn || "",
            favorites: Number(cat?.favorites || item.favorites || 0),
            rarity: bestR,
            copies: cnt,
            count: cnt,
            acquiredAt: item.acquiredAt || Date.now()
          };
          if (LIMITED_CAPS[bestR]) {
            obj.maxCopies = LIMITED_CAPS[bestR];
            obj.serial = obj.serial || 1;
          } else {
            obj.maxCopies = null;
            obj.serial = null;
          }
          merged.set(uniqueKey, obj);
        } else {
          const ex = merged.get(uniqueKey);
          if ((RANK_POWER[bestR] || 0) > (RANK_POWER[ex.rarity] || 0)) ex.rarity = bestR;
          ex.copies = Math.max(1, Number(ex.copies || 1)) + cnt;
          ex.count = ex.copies;
        }
      }

      const cleaned = [];
      merged.forEach((card) => {
        const cap = LIMITED_CAPS[card.rarity];
        if (cap && card.copies > cap) {
          gainedCh[card.rarity] += card.copies - cap;
          card.copies = cap;
          card.count = cap;
        }
        cleaned.push(card);
      });

      state.inventory = cleaned;
      const totalNewCh = gainedCh.SP + gainedCh.UR + gainedCh.SSR;
      if (totalNewCh > 0) {
        state.challengeCards.SP += gainedCh.SP;
        state.challengeCards.UR += gainedCh.UR;
        state.challengeCards.SSR += gainedCh.SSR;
        if (notifyConversion && typeof showToast === "function") {
          const parts = [];
          if (gainedCh.SP) parts.push(`+${gainedCh.SP} SP`);
          if (gainedCh.UR) parts.push(`+${gainedCh.UR} UR`);
          if (gainedCh.SSR) parts.push(`+${gainedCh.SSR} SSR`);
          showToast(`${t("ch_cards_converted")} (${parts.join(" | ")})`);
        }
      }
    } finally {
      isNormalizingInv = false;
    }
    return gainedCh;
  }

  function loadCaches() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
      if (saved && typeof saved === "object") {
        state = { ...state, ...saved };
      }
      const cachedChars = JSON.parse(localStorage.getItem(CACHE_CHARS_KEY) || "[]");
      if (Array.isArray(cachedChars)) cachedChars.forEach((c) => registerCharacter(c, false));
      transCache = JSON.parse(localStorage.getItem(CACHE_TRANS_KEY) || "{}");
    } catch (_) {}

    ensureStateIntegrity();
    normalizeAndDedupeInventory(false);
    flushSaveNow();
  }

  // حفظ مدمج وسريع (Debounce 200ms) لمنع أي تجمّد على الهواتف
  let saveDebounceTimer = null;
  let saveDirty = false;

  function flushSaveNow() {
    if (saveDebounceTimer) {
      clearTimeout(saveDebounceTimer);
      saveDebounceTimer = null;
    }
    saveDirty = false;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (_) {}
    if (typeof syncPlayerToCloud === "function") syncPlayerToCloud();
  }

  function saveState() {
    saveDirty = true;
    if (saveDebounceTimer) return;
    saveDebounceTimer = setTimeout(() => {
      saveDebounceTimer = null;
      if (saveDirty) flushSaveNow();
    }, 200);
  }

  window.addEventListener("pagehide", () => {
    if (saveDirty) flushSaveNow();
  });

  function saveCharCache() {
    try {
      const arr = Array.from(characterCatalog.values());
      localStorage.setItem(CACHE_CHARS_KEY, JSON.stringify(arr));
      localStorage.setItem("monarch_anilist_cursor_v1", String(codexPageCursor));
    } catch (_) {
      try {
        const compact = Array.from(characterCatalog.values()).map((c) => ({
          ...c, bioEn: c.bioEn ? c.bioEn.slice(0, 110) : ""
        }));
        localStorage.setItem(CACHE_CHARS_KEY, JSON.stringify(compact));
      } catch (__) {}
    }
    cachedRarityPools = null;
    const el = document.getElementById("settingsCatalogCount");
    if (el) el.textContent = characterCatalog.size;
  }

  function getCachedPoolsByRarity() {
    if (cachedRarityPools && cachedPoolSize === characterCatalog.size && characterCatalog.size > 0) {
      return cachedRarityPools;
    }
    const pools = { SP: [], UR: [], SSR: [], SR: [], R: [], C: [], N: [] };
    characterCatalog.forEach((c) => {
      if (c && pools[c.rarity]) pools[c.rarity].push(c);
    });
    cachedRarityPools = pools;
    cachedPoolSize = characterCatalog.size;
    return pools;
  }

  /* =========================================================
     6. جلب الشخصيات من AniList + التوسيع التلقائي بعد 4860 شخصية
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
      .slice(0, 400);
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
  async function fetchAniListPage(page, searchQuery = "", sortMode = "FAVOURITES_DESC") {
    const query = `
      query ($page: Int, $search: String) {
        Page(page: $page, perPage: 45) {
          characters(sort: ${sortMode}, search: $search) {
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
    const before = characterCatalog.size;
    list.forEach((item) => {
      const img = item.image?.large || "";
      if (!img || img.includes("default.jpg")) return;
      const node = item.media?.nodes?.[0];
      const animeTitle = node?.title?.english || node?.title?.romaji || "Anime Legend";
      registerCharacter({
        id: item.id,
        name: item.name?.full,
        nativeName: item.name?.native || "",
        anime: animeTitle,
        genres: node?.genres || [],
        favorites: item.favourites || 0,
        image: img,
        bioEn: cleanDescription(item.description) || `${item.name?.full} from ${animeTitle}.`
      }, false);
    });
    const added = characterCatalog.size - before;
    if (added > 0) saveCharCache();
    return added;
  }

  function getNextUnseenPage() {
    const saved = Number(localStorage.getItem("monarch_anilist_cursor_v1")) || 1;
    const bySize = Math.floor(characterCatalog.size / 45) + 1;
    return Math.max(codexPageCursor, saved, bySize);
  }

  async function loadNextCatalogBatch(showNotice = false) {
    if (isFetchingAniList || !navigator.onLine) return 0;
    isFetchingAniList = true;
    let added = 0;
    try {
      if (characterCatalog.size >= 4500) {
        const idPage = Number(localStorage.getItem("monarch_anilist_id_page_v1")) || 1;
        added = await fetchAniListPage(idPage, "", "ID_DESC");
        localStorage.setItem("monarch_anilist_id_page_v1", String(idPage + 1));
      } else {
        const targetPage = getNextUnseenPage();
        added = await fetchAniListPage(targetPage, "", "FAVOURITES_DESC");
        codexPageCursor = targetPage + 1;
        localStorage.setItem("monarch_anilist_cursor_v1", String(codexPageCursor));
      }
      if (added > 0) {
        if (typeof updateHud === "function") updateHud();
        if (typeof renderCodex === "function") renderCodex();
      }
      if (showNotice && typeof showToast === "function") {
        showToast(added > 0 ? `+${added} (${characterCatalog.size})` : "⏳ ...");
      }
    } catch (_) {} finally {
      isFetchingAniList = false;
    }
    return added;
  }

  async function ensureRichCatalog() {
    if (isFetchingAniList || !navigator.onLine) return;
    isFetchingAniList = true;
    try {
      const nextP = getNextUnseenPage();
      const pages = characterCatalog.size < 80 ? [1, 2, 12] : [nextP];
      for (const p of pages) {
        await fetchAniListPage(p);
        codexPageCursor = Math.max(codexPageCursor, p + 1);
        localStorage.setItem("monarch_anilist_cursor_v1", String(codexPageCursor));
      }
      saveCharCache();
      if (typeof initStartScreenBackground === "function") initStartScreenBackground();
      if (typeof updateHud === "function") updateHud();
      if (typeof renderCodex === "function") renderCodex();
    } catch (_) {} finally {
      isFetchingAniList = false;
    }
  }

  /* =========================================================
     7. الترجمة الفورية للسيرة والتلميحات
  ========================================================= */
  const INSTANT_BIO_DICT = {
    "satoru gojo": { ar: "أقوى ساحر جوجوتسو في عصره، يمتلك عيني الستة وتقنية اللامحدود وتوسع نطاق الفراغ اللامتناهي." },
    "satoru gojou": { ar: "أقوى ساحر جوجوتسو في عصره، يمتلك عيني الستة وتقنية اللامحدود وتوسع نطاق الفراغ اللامتناهي." },
    "ryomen sukuna": { ar: "ملك اللعنات الأسطوري، يُعرف بقوته التدميرية الهائلة ومهارته القتالية المطلقة." },
    "sung jin-woo": { ar: "ملك الظلال الذي ارتقى من أضعف صياد إلى قوة لا تُقهر قادر على إحياء جيش من الظلال." },
    "jin-u seong": { ar: "ملك الظلال الذي ارتقى من أضعف صياد إلى قوة لا تُقهر قادر على إحياء جيش من الظلال." },
    "son goku": { ar: "مقاتل سايان نشأ على الأرض ويعشق تحدي الأقوى باستمرار حتى وصوله للغريزة الفائقة." },
    "gokuu son": { ar: "مقاتل سايان نشأ على الأرض ويعشق تحدي الأقوى باستمرار حتى وصوله للغريزة الفائقة." },
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
  /* === نهاية الجزء 2 من 8 (الصق الجزء 3 مباشرة هنا) === */
  /* =========================================================
     8. الصوت، الاهتزاز، الإشعارات، اللغات، والمزامنة السحابية الكاملة
  ========================================================= */
  let toastTimer = null;
  let incomingChallengesCache = [];
  let leaderboardPlayersCache = [];

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
    if (type === "win") vibrate([20, 30, 35]);
    else if (type === "summon") vibrate([28, 35, 50]);
    else vibrate(10);

    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const now = ctx.currentTime;

      if (type === "summon") {
        [440, 554.37, 659.25, 880].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "triangle";
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          gain.gain.setValueAtTime(0.001, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.11, now + i * 0.06 + 0.02);
          gain.gain.exponentialRampToValueAtTime(0.0008, now + i * 0.06 + 0.32);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.35);
        });
      } else {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        if (type === "win") {
          osc.frequency.setValueAtTime(520, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.22);
          gain.gain.setValueAtTime(0.08, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
          osc.start(now);
          osc.stop(now + 0.25);
        } else {
          osc.frequency.setValueAtTime(440, now);
          gain.gain.setValueAtTime(0.04, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.start(now);
          osc.stop(now + 0.08);
        }
      }
      setTimeout(() => { try { ctx.close(); } catch (_) {} }, 800);
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
    if (typeof updateShadowTabText === "function") updateShadowTabText();
    if (typeof currentTriviaAnswer !== "undefined" && currentTriviaAnswer) refreshTriviaView();
  }

  function isValidOwner(ow) {
    return Boolean(
      ow && typeof ow === "object" && ow.uid &&
      typeof ow.name === "string" && ow.name.trim() &&
      ow.name.trim().toLowerCase() !== "undefined"
    );
  }

  function getCleanOwnersForChar(cid, maxCopies) {
    const map = new Map();
    const remote = limitedRegistry[cid]?.owners || {};
    const now = Date.now();
    const ch = characterCatalog.get(Number(cid));
    const maxIdleMs = (INACTIVITY_DAYS[ch?.rarity] || 30) * DAY_MS;

    Object.entries(remote).forEach(([slot, ow]) => {
      if (!isValidOwner(ow)) return;
      const slotNum = Number(slot);
      if (slotNum < 1 || slotNum > maxCopies) return;
      // تجاهل الملاك الخاملين بعد تجاوز مدة الحماية
      if (ow.lastActiveAt && ow.uid !== state.uid && now - ow.lastActiveAt > maxIdleMs) return;
      map.set(String(slotNum), ow);
    });

    state.inventory.forEach((c) => {
      if (Number(c.charId) === Number(cid) && LIMITED_CAPS[c.rarity]) {
        const already = Array.from(map.values()).some((o) => o.uid === state.uid);
        if (!already) {
          let s = Number(c.serial) || 1;
          while (map.has(String(s)) && s < maxCopies) s++;
          c.serial = s;
          c.maxCopies = maxCopies;
          map.set(String(s), {
            uid: state.uid,
            name: state.name,
            claimedAt: c.acquiredAt || now,
            lastActiveAt: now
          });
        }
      }
    });
    return map;
  }

  // المزامنة السحابية التلقائية للملف الشخصي والنوادر
  async function syncPlayerToCloud() {
    if (!db || !navigator.onLine) return;
    const now = Date.now();
    const rankObj = getRankByTrophies(state.trophies);
    const spCount = state.inventory.filter((c) => c.rarity === "SP").length;
    const rareCount = state.inventory.filter((c) => LIMITED_CAPS[c.rarity]).length;

    db.ref(`players/${state.uid}`).update({
      uid: state.uid,
      name: state.name,
      trophies: Number(state.trophies || 0),
      spCount,
      rareCount,
      totalCards: state.inventory.length,
      avatar: state.avatar || "",
      title: state.title || "",
      rankIcon: rankObj.icon,
      shieldUntil: state.shieldUntil || 0,
      lastActive: now
    }).catch(() => {});

    for (let i = 0; i < state.inventory.length; i++) {
      const card = state.inventory[i];
      const max = LIMITED_CAPS[card.rarity];
      if (!max || !card.charId) continue;
      const slot = card.serial || 1;
      db.ref(`limitedCards/${card.charId}/owners/${slot}`).set({
        uid: state.uid,
        name: state.name,
        claimedAt: card.acquiredAt || now,
        lastActiveAt: now
      }).catch(() => {});
    }
  }

  // حفظ واسترجاع كامل الحساب عبر كود المزامنة السحابية (MNR-XXXX-XXXX)
  async function backupAccountToCloud(showMessage = true) {
    if (!db || !navigator.onLine) {
      if (showMessage) showToast("⚠️ Offline!");
      return false;
    }
    ensureStateIntegrity();
    try {
      const cleanPayload = JSON.parse(JSON.stringify({
        ...state,
        backedUpAt: Date.now()
      }));
      await db.ref(`cloudBackups/${state.syncCode}`).set(cleanPayload);
      if (showMessage) showToast(`☁️ ${t("msg_saved")} (${state.syncCode})`);
      return true;
    } catch (_) {
      if (showMessage) showToast("⚠️ Backup error");
      return false;
    }
  }

  async function restoreAccountFromCloud(codeRaw) {
    const code = String(codeRaw || "").trim().toUpperCase();
    if (!/^MNR-[A-Z0-9]{4}-[A-Z0-9]{4}$/.test(code)) {
      return showToast("⚠️ MNR-XXXX-XXXX");
    }
    if (!db || !navigator.onLine) return showToast("⚠️ Offline!");
    try {
      const snap = await db.ref(`cloudBackups/${code}`).get();
      if (!snap.exists()) return showToast("❌ Code not found!");
      const data = snap.val();
      if (!data || typeof data !== "object") return showToast("❌ Invalid backup!");

      state = { ...state, ...data, syncCode: code };
      ensureStateIntegrity();
      normalizeAndDedupeInventory(false);
      flushSaveNow();
      applyLanguage(state.lang);
      updateHud();
      renderInventory(true);
      renderCodex();
      populateMyStakeCardsRow();
      showToast(`✅ ${t("msg_saved")}`);
    } catch (_) {
      showToast("⚠️ Restore failed!");
    }
  }

  // إضافة سجل لصندوق الوارد
  function pushInboxLog(text) {
    ensureStateIntegrity();
    state.inboxHistory.unshift({ text, at: Date.now() });
    if (state.inboxHistory.length > 20) state.inboxHistory.length = 20;
    saveState();
  }

  // إرسال تحدي باستخدام بطاقة التحدي (SP / UR / SSR) ضد مالك عشوائي أو محدد
  async function sendChallengeCardAttack(rarity, specificTarget = null) {
    ensureStateIntegrity();
    if (!db || !navigator.onLine) return showToast("⚠️ Offline!");
    if ((state.challengeCards[rarity] || 0) <= 0) return showToast(t("ch_cards_empty"));

    let target = specificTarget;
    if (!target) {
      const candidates = [];
      Object.entries(limitedRegistry).forEach(([cid, entry]) => {
        const ch = characterCatalog.get(Number(cid));
        if (!ch || ch.rarity !== rarity) return;
        const owners = entry?.owners || {};
        Object.entries(owners).forEach(([slot, ow]) => {
          if (isValidOwner(ow) && ow.uid !== state.uid) {
            candidates.push({ charId: Number(cid), charName: ch.name, rarity, slot: Number(slot), uid: ow.uid, name: ow.name });
          }
        });
      });
      if (!candidates.length) return showToast(t("ch_cards_no_targets"));
      target = candidates[Math.floor(Math.random() * candidates.length)];
    }

    if (characterCatalog.size < 6) await ensureRichCatalog();
    const roomCode = String(Math.floor(1000 + Math.random() * 9000));
    const boardCards = pickSixUniqueRarityCards().map((c) => ({
      id: c.id, name: c.name, image: c.image, rarity: c.rarity
    }));

    const challengeId = "chc_" + Date.now();
    await db.ref(`duels/${roomCode}`).set({
      code: roomCode,
      duelType: "challenge_card",
      challengeTier: rarity,
      targetCharId: target.charId,
      targetSlot: target.slot,
      goldStake: 0,
      gemsStake: 0,
      status: "waiting",
      turn: "p1",
      cards: boardCards,
      picked: ["", "", "", "", "", ""],
      p1: { uid: state.uid, name: state.name, consent: true, stakeCard: null },
      p2: null,
      createdAt: Date.now()
    });

    await db.ref(`challenges/${target.uid}/${challengeId}`).set({
      id: challengeId,
      kind: "challenge_card",
      fromUid: state.uid,
      fromName: state.name,
      charId: target.charId,
      charName: target.charName,
      rarity,
      slot: target.slot,
      penaltyGems: REFUSE_PENALTY[rarity] || 100,
      roomCode,
      status: "pending",
      createdAt: Date.now()
    });

    state.challengeCards[rarity] = Math.max(0, state.challengeCards[rarity] - 1);
    pushInboxLog(`⚔️ ${target.charName} (${rarity}) → ${target.name}`);
    flushSaveNow();
    updateHud();

    switchMainTab("viewOnline");
    switchOnlineSubTab("lobby");
    attachToRoom(roomCode, "p1");
    showToast(`${t("ch_cards_sent")} (${roomCode})`);
  }

  // رفض التحدي: دفع غرامة الجواهر لحماية البطاقة أو خسارتها وعودتها للمتجر
  async function handleChallengeDecline(ch) {
    if (!db) return;
    if (ch.kind === "challenge_card") {
      const penalty = Number(ch.penaltyGems || REFUSE_PENALTY[ch.rarity] || 100);
      if (state.gems >= penalty) {
        state.gems -= penalty;
        pushInboxLog(`💎 -${penalty} | ${ch.charName}`);
        showToast(`${t("ch_cards_paid")} (-${penalty} 💎)`);
      } else {
        // حذف البطاقة من مخزون اللاعب وإرجاعها حرة في السيرفر
        state.inventory = state.inventory.filter(
          (c) => !(Number(c.charId) === Number(ch.charId) && Number(c.serial || 1) === Number(ch.slot || 1))
        );
        await db.ref(`limitedCards/${ch.charId}/owners/${ch.slot}`).remove().catch(() => {});
        pushInboxLog(`💔 ${ch.charName} (${ch.rarity})`);
        showToast(t("ch_cards_forfeit"));
      }
      flushSaveNow();
      updateHud();
      renderInventory(true);
      renderCodex();
    }
    await db.ref(`challenges/${state.uid}/${ch.id}`).remove().catch(() => {});
  }

  function initFirebaseListeners() {
    if (!db) return;

    db.ref("limitedCards").on("value", (snap) => {
      limitedRegistry = snap.val() || {};
      renderCodex();
    });

    db.ref(`challenges/${state.uid}`).on("value", (snap) => {
      const list = Object.values(snap.val() || {}).filter((c) => c && c.status === "pending");
      incomingChallengesCache = list;
      const badge = document.getElementById("incomingBadge");
      const dot = document.getElementById("navOnlineDot");
      if (badge) {
        badge.textContent = list.length;
        badge.classList.toggle("hidden", list.length === 0);
      }
      if (dot) dot.classList.toggle("hidden", list.length === 0);
      renderIncomingChallenges(list);
      if (typeof refreshRoyalFabBadge === "function") refreshRoyalFabBadge();
    });

    // لوحة المتصدرين العالمية Top 50
    db.ref("players").orderByChild("trophies").limitToLast(50).on("value", (snap) => {
      const players = [];
      snap.forEach((child) => {
        const v = child.val();
        if (v && v.name) players.push(v);
      });
      leaderboardPlayersCache = players;
      renderLeaderboard(players);
    });
  }
  /* === نهاية الجزء 3 من 8 (الصق الجزء 4 مباشرة هنا) === */
  /* =========================================================
     9. الشريط العلوي المطور، نافذة بطاقات التحدي، المخزون (فرز + تدوير)، وملف البطاقة
  ========================================================= */
  let invRenderLimit = 30;
  let invFilterRarity = "ALL";
  let invSearchQuery = "";
  let invSortMode = "rarity";
  let leaderboardSortMode = "trophies";

  function updateHud() {
    ensureStateIntegrity();
    const setTxt = (id, v) => { const el = document.getElementById(id); if (el) el.textContent = v; };
    const rankObj = getRankByTrophies(state.trophies);
    const totalCh =
      Number(state.challengeCards.SP || 0) +
      Number(state.challengeCards.UR || 0) +
      Number(state.challengeCards.SSR || 0);

    // تحديث اسم اللاعب مع شارة الرتبة وصورة البروفايل إن وُجدت
    const hudNameEl = document.getElementById("hudPlayerName");
    if (hudNameEl) {
      const avHtml = state.avatar
        ? `<img class="hud-avatar-mini" src="${state.avatar}" alt="" />`
        : "";
      hudNameEl.innerHTML = `${avHtml}<span class="hud-rank-badge">${rankObj.icon}</span>${state.name}`;
    }

    setTxt("startPlayerName", `${rankObj.icon} ${state.name}`);
    setTxt("hudTrophies", fmtCompact(state.trophies));
    setTxt("goldCount", fmtCompact(state.gold));
    setTxt("gemCount", fmtCompact(state.gems));
    setTxt("ticketCount", fmtCompact(totalCh));
    setTxt("invTotalCount", state.inventory.length);
    setTxt("settingsUid", state.uid);
    setTxt("settingsCatalogCount", characterCatalog.size);

    // ربط النقر على عدّاد بطاقات التحدي في الشريط العلوي بنافذة بطاقات التحدي
    const ticketEl = document.getElementById("ticketCount");
    const ticketPill = ticketEl?.closest("button, div, span");
    if (ticketPill && !ticketPill.dataset.chModalBound) {
      ticketPill.dataset.chModalBound = "1";
      ticketPill.style.cursor = "pointer";
      ticketPill.addEventListener("click", (e) => {
        e.stopPropagation();
        openChallengeCardsModal();
      });
    }

    const inp = document.getElementById("inputPlayerName");
    if (inp && document.activeElement !== inp) inp.value = state.name;
    document.getElementById("netDot")?.classList.toggle("offline", !navigator.onLine);

    const shieldActive = state.shieldUntil && state.shieldUntil > Date.now();
    setTxt("settingsShield", shieldActive ? `${Math.ceil((state.shieldUntil - Date.now()) / 3600000)}h` : t("msg_shield_off"));
    if (typeof refreshRoyalFabBadge === "function") refreshRoyalFabBadge();
  }

  function openChallengeCardsModal() {
    ensureStateIntegrity();
    document.getElementById("chCardsModal")?.remove();

    const tiers = [
      { key: "SP", color: "#ec4899", bg: "rgba(236,72,153,0.16)", penalty: REFUSE_PENALTY.SP },
      { key: "UR", color: "#ef4444", bg: "rgba(239,68,68,0.16)", penalty: REFUSE_PENALTY.UR },
      { key: "SSR", color: "#f59e0b", bg: "rgba(245,158,11,0.16)", penalty: REFUSE_PENALTY.SSR }
    ];

    const overlay = document.createElement("div");
    overlay.id = "chCardsModal";
    overlay.className = "mpro-overlay";
    overlay.innerHTML = `
      <div class="mpro-box" style="max-width:360px;">
        <div class="mpro-head">
          <h3 style="margin:0;font-size:1rem;color:#fb7185;">${t("ch_cards_title")}</h3>
          <button type="button" class="mpro-close" id="btnCloseChCards">✕</button>
        </div>
        <div style="display:grid;grid-template-columns:1fr;gap:8px;margin-bottom:12px;">
          ${tiers.map((tr) => {
            const cnt = Number(state.challengeCards[tr.key] || 0);
            return `
              <div style="display:flex;align-items:center;justify-content:space-between;gap:8px;padding:10px 12px;border-radius:12px;background:${tr.bg};border:1px solid ${tr.color};">
                <div>
                  <div style="font-weight:900;color:${tr.color};font-size:0.95rem;">${tr.key} × ${cnt}</div>
                  <div style="font-size:0.72rem;color:#cbd5e1;">${t("ch_cards_refuse_pay")}: <b>${tr.penalty} 💎</b></div>
                </div>
                <button type="button" class="mpro-btn" data-use-ch="${tr.key}" ${cnt <= 0 ? "disabled" : ""}>⚔️ ${t("ch_cards_use")}</button>
              </div>
            `;
          }).join("")}
        </div>
        <button type="button" id="btnDoneChCards" class="secondary-btn full-w">${t("btn_cancel")}</button>
      </div>
    `;

    document.body.appendChild(overlay);
    overlay.querySelector("#btnCloseChCards").onclick = () => overlay.remove();
    overlay.querySelector("#btnDoneChCards").onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
    overlay.querySelectorAll("[data-use-ch]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tier = btn.dataset.useCh;
        overlay.remove();
        sendChallengeCardAttack(tier);
      });
    });
  }

  // شريط أدوات المخزون: الفرز المتعدد + زر تدوير النسخ الفائضة إلى غبار بطاقات
  function ensureInvToolsUi() {
    const grid = document.getElementById("invGrid");
    if (!grid || !grid.parentElement) return;
    let bar = document.getElementById("invProToolsBar");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "invProToolsBar";
      bar.className = "inv-tools-bar";
      grid.parentElement.insertBefore(bar, grid);
    }

    bar.innerHTML = `
      <select id="invSortSelect" class="inv-sort-select">
        <option value="rarity" ${invSortMode === "rarity" ? "selected" : ""}>${t("sort_rarity")}</option>
        <option value="newest" ${invSortMode === "newest" ? "selected" : ""}>${t("sort_newest")}</option>
        <option value="copies" ${invSortMode === "copies" ? "selected" : ""}>${t("sort_copies")}</option>
        <option value="pop" ${invSortMode === "pop" ? "selected" : ""}>${t("sort_pop")}</option>
        <option value="anime" ${invSortMode === "anime" ? "selected" : ""}>${t("sort_anime")}</option>
      </select>
      <button type="button" id="btnRecycleExtras" class="inv-recycle-btn">${t("recycle_dups")} (${fmtCompact(state.dust)} ✨)</button>
    `;

    bar.querySelector("#invSortSelect").addEventListener("change", (e) => {
      invSortMode = e.target.value;
      playSfx("click");
      renderInventory(true);
    });
    bar.querySelector("#btnRecycleExtras").addEventListener("click", recycleExtraDuplicates);
  }

  function recycleExtraDuplicates() {
    ensureStateIntegrity();
    let totalDust = 0;
    let totalGold = 0;
    let recycledCount = 0;

    state.inventory.forEach((c) => {
      if (LIMITED_CAPS[c.rarity]) return;
      const copies = Math.max(1, Number(c.copies || c.count || 1));
      if (copies > 1) {
        const extra = copies - 1;
        totalDust += extra * (RECYCLE_DUST_VALUE[c.rarity] || 5);
        totalGold += extra * Math.floor((DUP_GOLD_REWARD[c.rarity] || 30) * 0.5);
        c.copies = 1;
        c.count = 1;
        recycledCount += extra;
      }
    });

    if (recycledCount === 0) return showToast(t("recycle_none"));

    state.dust += totalDust;
    state.gold += totalGold;
    flushSaveNow();
    updateHud();
    renderInventory(false);
    renderShop();
    playSfx("win");
    showToast(`${t("recycle_done")} +${totalDust} ✨ | +${fmtCompact(totalGold)} 🪙`);
  }

  function renderInventory(resetLimit = false) {
    if (resetLimit) invRenderLimit = 30;
    const grid = document.getElementById("invGrid");
    const loadMoreBox = document.getElementById("invLoadMoreBox");
    if (!grid) return;

    ensureInvToolsUi();

    const sorted = [...state.inventory].sort((a, b) => {
      if (invSortMode === "newest") return Number(b.acquiredAt || 0) - Number(a.acquiredAt || 0);
      if (invSortMode === "copies") return Number(b.copies || 1) - Number(a.copies || 1);
      if (invSortMode === "pop") return Number(b.favorites || 0) - Number(a.favorites || 0);
      if (invSortMode === "anime") return String(a.anime || "").localeCompare(String(b.anime || ""));
      return (RANK_POWER[b.rarity] || 0) - (RANK_POWER[a.rarity] || 0) || (Number(b.favorites || 0) - Number(a.favorites || 0));
    });

    const q = invSearchQuery.trim().toLowerCase();
    const filtered = sorted.filter((c) => {
      const matchR = invFilterRarity === "ALL" || c.rarity === invFilterRarity;
      return matchR && (!q || String(c.name || "").toLowerCase().includes(q) || String(c.anime || "").toLowerCase().includes(q));
    });

    const slice = filtered.slice(0, invRenderLimit);
    grid.innerHTML = "";
    if (slice.length === 0) {
      grid.innerHTML = `<p class="muted-text" style="grid-column:1/-1;text-align:center;padding:24px;">${t("msg_no_cards")}</p>`;
      loadMoreBox?.classList.add("hidden");
      return;
    }

    const frag = document.createDocumentFragment();
    slice.forEach((card) => {
      const div = document.createElement("div");
      div.className = "inv-card";
      const serialHtml = card.serial ? `<span class="serial-tag">#${card.serial}/${card.maxCopies}</span>` : "";
      const copies = Math.max(1, Number(card.copies || card.count || 1));
      const copyHtml = !card.serial && copies > 1 ? `<span class="copy-count-badge">×${copies}</span>` : "";
      const fallback = makeFallbackSvg(card.name, card.rarity);
      div.innerHTML = `
        <img src="${card.image}" alt="${card.name}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${fallback}'" />
        <div class="inv-card-top">
          <span class="card-rarity-pill r-${card.rarity}">${card.rarity}</span>
          ${serialHtml}
        </div>
        ${copyHtml}
        <div class="inv-card-name">${card.name}</div>
      `;
      div.addEventListener("click", () => openCardDossierModal(card, true));
      frag.appendChild(div);
    });
    grid.appendChild(frag);
    loadMoreBox?.classList.toggle("hidden", filtered.length <= invRenderLimit);
  }

  async function openCardDossierModal(cardOrChar, isOwnedCard = false) {
    const modal = document.getElementById("cardModal");
    const body = document.getElementById("cardModalBody");
    if (!modal || !body) return;

    const cid = Number(cardOrChar.charId || cardOrChar.id);
    const catalogChar = characterCatalog.get(cid) || cardOrChar;
    const rarity = catalogChar.rarity || cardOrChar.rarity || "R";
    const isLimited = Boolean(LIMITED_CAPS[rarity]);
    const maxCopies = LIMITED_CAPS[rarity] || null;
    const fallback = makeFallbackSvg(catalogChar.name, rarity);

    document.getElementById("cardModalTitle").textContent = catalogChar.name;
    const serialDisplay = cardOrChar.serial
      ? `#${cardOrChar.serial}/${maxCopies}`
      : isLimited ? `${maxCopies}/${maxCopies}` : t("lbl_unlimited_copy");

    let ownersSectionHtml = "";
    if (isLimited) {
      const ownersMap = getCleanOwnersForChar(cid, maxCopies);
      const freeCount = Math.max(0, maxCopies - ownersMap.size);
      const hasChCard = Number(state.challengeCards?.[rarity] || 0) > 0;
      let rowsHtml = `<div class="dossier-owner-row"><span>🛒 ${t("lbl_free_slots")}</span><b dir="ltr" style="color:${freeCount > 0 ? "#4ade80" : "#fb7185"};">${freeCount} / ${maxCopies}</b></div>`;
      ownersMap.forEach((ow, slot) => {
        const isMe = ow.uid === state.uid;
        const btnHtml = !isMe
          ? `<div style="display:flex;gap:5px;">
              ${hasChCard ? `<button class="mpro-btn btn-dossier-chcard" data-cid="${cid}" data-slot="${slot}" data-ouid="${ow.uid}" data-oname="${ow.name}">🎟️ ${rarity}</button>` : ""}
              <button class="danger-btn-sm btn-dossier-ch" data-cid="${cid}" data-slot="${slot}" data-ouid="${ow.uid}" data-oname="${ow.name}">${t("btn_challenge")}</button>
            </div>`
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
    if (isOwnedCard) {
      footerActionHtml += `<button id="btnSetCardAvatar" class="secondary-btn full-w" style="margin-top:10px;border-color:rgba(245,197,66,0.45);">🖼️ ${t("profile_avatar")}</button>`;
    }
    if (isOwnedCard && !isLimited) {
      const sellVal = (RANK_POWER[rarity] || 1) * 18;
      const dustVal = RECYCLE_DUST_VALUE[rarity] || 5;
      footerActionHtml += `<button id="btnRecycleCard" class="secondary-btn full-w" style="margin-top:8px;">${t("btn_recycle")} ${sellVal} 🪙 + ${dustVal} ✨</button>`;
    } else if (isOwnedCard && isLimited) {
      footerActionHtml += `<p class="status-badge" style="display:block;text-align:center;margin-top:10px;">${t("msg_protected")}</p>`;
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

    body.querySelectorAll(".btn-dossier-chcard").forEach((btn) => {
      btn.addEventListener("click", () => {
        sendChallengeCardAttack(rarity, {
          charId: Number(btn.dataset.cid),
          charName: catalogChar.name,
          rarity,
          slot: Number(btn.dataset.slot),
          uid: btn.dataset.ouid,
          name: btn.dataset.oname
        });
        modal.classList.add("hidden");
      });
    });

    document.getElementById("btnSetCardAvatar")?.addEventListener("click", () => {
      state.avatar = catalogChar.image || "";
      flushSaveNow();
      updateHud();
      showToast(`🖼️ ${t("msg_saved")}`);
    });

    document.getElementById("btnRecycleCard")?.addEventListener("click", () => {
      const idx = state.inventory.findIndex((x) => x.uidCard === cardOrChar.uidCard || Number(x.charId) === cid);
      if (idx !== -1) {
        const sellVal = (RANK_POWER[rarity] || 1) * 18;
        const dustVal = RECYCLE_DUST_VALUE[rarity] || 5;
        const target = state.inventory[idx];
        const copies = Math.max(1, Number(target.copies || target.count || 1));
        if (copies > 1) {
          target.copies = copies - 1;
          target.count = target.copies;
        } else {
          state.inventory.splice(idx, 1);
        }
        state.gold += sellVal;
        state.dust += dustVal;
        flushSaveNow();
        updateHud();
        renderInventory(false);
        renderShop();
        modal.classList.add("hidden");
        showToast(`+${sellVal} 🪙 | +${dustVal} ✨`);
      }
    });

    modal.classList.remove("hidden");
    const translatedBio = await getTranslatedBio(catalogChar);
    const bioEl = document.getElementById("dossierBioText");
    if (bioEl) bioEl.textContent = translatedBio;
  }

  /* =========================================================
     10. سجل النوادر، التحديات المباشرة، ولوحة المتصدرين العالمية Top 50
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
    const filtered = allLegends.filter(
      (c) => (codexFilter === "ALL" || c.rarity === codexFilter) &&
        (!q || String(c.name || "").toLowerCase().includes(q) || String(c.anime || "").toLowerCase().includes(q))
    );

    grid.innerHTML = "";
    const frag = document.createDocumentFragment();
    filtered.forEach((ch) => {
      const max = LIMITED_CAPS[ch.rarity];
      const owners = getCleanOwnersForChar(ch.id, max);
      const freeCount = Math.max(0, max - owners.size);
      const fallback = makeFallbackSvg(ch.name, ch.rarity);
      const card = document.createElement("div");
      card.className = `codex-card tier-${ch.rarity}`;
      card.innerHTML = `
        <img class="codex-card-img" src="${ch.image}" alt="${ch.name}" loading="lazy" decoding="async" onerror="this.onerror=null;this.src='${fallback}'" />
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
      frag.appendChild(card);
    });
    grid.appendChild(frag);

    const moreWrap = document.createElement("div");
    moreWrap.className = "codex-load-more";
    moreWrap.innerHTML = `<button id="btnCodexMoreLive" class="secondary-btn full-w">${t("codex_more")}</button>`;
    grid.appendChild(moreWrap);

    document.getElementById("btnCodexMoreLive")?.addEventListener("click", async (e) => {
      e.target.disabled = true;
      e.target.textContent = t("codex_searching");
      await loadNextCatalogBatch(true);
      e.target.disabled = false;
      e.target.textContent = t("codex_more");
    });
  }

  async function sendDirectChallenge(charId, slot, targetUid, targetName) {
    if (!db || !navigator.onLine) return showToast("⚠️ Offline!");
    const ch = characterCatalog.get(charId);
    if (!ch) return;

    const myMatchingCard = state.inventory.find((c) => c.rarity === ch.rarity);
    if (!myMatchingCard) return showToast(`⚠️ ${ch.rarity} — ${t("msg_no_rares_stake")}`);

    if (characterCatalog.size < 6) await ensureRichCatalog();
    const roomCode = String(Math.floor(1000 + Math.random() * 9000));
    const boardCards = pickSixUniqueRarityCards().map((c) => ({
      id: c.id, name: c.name, image: c.image, rarity: c.rarity
    }));

    await db.ref(`duels/${roomCode}`).set({
      code: roomCode,
      duelType: "stake_card",
      goldStake: 0,
      gemsStake: 0,
      status: "waiting",
      turn: "p1",
      cards: boardCards,
      picked: ["", "", "", "", "", ""],
      p1: { uid: state.uid, name: state.name, consent: true, stakeCard: myMatchingCard },
      p2: null,
      createdAt: Date.now()
    });

    const challengeId = "ch_" + Date.now();
    await db.ref(`challenges/${targetUid}/${challengeId}`).set({
      id: challengeId,
      kind: "direct_stake",
      fromUid: state.uid,
      fromName: state.name,
      charId,
      charName: ch.name,
      rarity: ch.rarity,
      slot,
      roomCode,
      status: "pending",
      createdAt: Date.now()
    });

    pushInboxLog(`⚔️ ${ch.name} → ${targetName} (${roomCode})`);
    switchMainTab("viewOnline");
    switchOnlineSubTab("lobby");
    attachToRoom(roomCode, "p1");
    showToast(`📩 ${ch.name} → ${targetName} (${roomCode})`);
  }

  function renderIncomingChallenges(list) {
    const box = document.getElementById("challengesList");
    if (!box) return;
    if (!list.length) {
      box.innerHTML = `<p class="muted-text" style="text-align:center;padding:16px;">---</p>`;
      return;
    }
    box.innerHTML = "";
    list.forEach((ch) => {
      const div = document.createElement("div");
      div.className = "codex-item";
      const isChCard = ch.kind === "challenge_card";
      const penTxt = isChCard ? ` (${t("ch_cards_refuse_pay")}: ${ch.penaltyGems || REFUSE_PENALTY[ch.rarity] || 100} 💎)` : "";
      div.innerHTML = `
        <div class="codex-meta">
          <h4>⚔️ ${ch.fromName}</h4>
          <p class="muted-text"><b>${ch.charName} (${ch.rarity} #${ch.slot})</b>${penTxt}</p>
        </div>
        <div class="row-gap">
          <button class="primary-btn btn-accept-ch">${t("btn_accept")}</button>
          <button class="danger-btn-sm btn-reject-ch">${isChCard ? `💎 ${ch.penaltyGems || REFUSE_PENALTY[ch.rarity]}` : t("btn_reject")}</button>
        </div>
      `;
      div.querySelector(".btn-accept-ch").addEventListener("click", async () => {
        if (db) await db.ref(`challenges/${state.uid}/${ch.id}/status`).set("accepted").catch(() => {});
        const inp = document.getElementById("inputRoomCode");
        if (inp) inp.value = ch.roomCode;
        switchOnlineSubTab("lobby");
        joinOnlineRoom(ch.roomCode);
      });
      div.querySelector(".btn-reject-ch").addEventListener("click", () => handleChallengeDecline(ch));
      box.appendChild(div);
    });
  }

  function renderLeaderboard(players) {
    const box = document.getElementById("leaderboardList");
    if (!box) return;
    const list = [...(players || leaderboardPlayersCache || [])];

    const sortTabsHtml = `
      <div class="mpro-tabs" style="margin-bottom:10px;">
        <button type="button" class="mpro-tab${leaderboardSortMode === "trophies" ? " active" : ""}" data-lsort="trophies">🏆 Top 50</button>
        <button type="button" class="mpro-tab${leaderboardSortMode === "sp" ? " active" : ""}" data-lsort="sp">👑 SP</button>
        <button type="button" class="mpro-tab${leaderboardSortMode === "cards" ? " active" : ""}" data-lsort="cards">🎴 Codex</button>
      </div>
    `;

    list.sort((a, b) => {
      if (leaderboardSortMode === "sp") return (b.spCount || b.rareCount || 0) - (a.spCount || a.rareCount || 0);
      if (leaderboardSortMode === "cards") return (b.totalCards || 0) - (a.totalCards || 0);
      return (b.trophies || 0) - (a.trophies || 0);
    });

    if (!list.length) {
      box.innerHTML = sortTabsHtml + `<p class="muted-text" style="text-align:center;padding:16px;">---</p>`;
    } else {
      box.innerHTML =
        sortTabsHtml +
        list.slice(0, 50).map((p, idx) => {
          const rk = p.rankIcon || getRankByTrophies(p.trophies || 0).icon;
          const av = p.avatar ? `<img class="hud-avatar-mini" src="${p.avatar}" alt="" />` : "";
          const badgeVal =
            leaderboardSortMode === "sp"
              ? `👑 ${p.spCount || p.rareCount || 0} SP`
              : leaderboardSortMode === "cards"
              ? `🎴 ${p.totalCards || 0}`
              : `🏆 ${fmtCompact(p.trophies || 0)}`;
          return `
            <div class="codex-item">
              <b style="font-size:1rem;color:var(--gold);width:32px;">#${idx + 1}</b>
              <div class="codex-meta">
                <h4>${av}${rk} ${p.uid === state.uid ? "★ " + p.name : p.name}</h4>
                <p class="muted-text">${p.title ? `🏷️ ${p.title} • ` : ""}👑 ${p.rareCount || 0}</p>
              </div>
              <span class="status-badge">${badgeVal}</span>
            </div>
          `;
        }).join("");
    }

    box.querySelectorAll("[data-lsort]").forEach((btn) => {
      btn.addEventListener("click", () => {
        leaderboardSortMode = btn.dataset.lsort;
        renderLeaderboard(leaderboardPlayersCache);
      });
    });
  }
  /* === نهاية الجزء 4 من 8 (الصق الجزء 5 مباشرة هنا) === */
  /* =========================================================
     11. المتجر الكامل: عدّاد الضمان (Pity) + حزمة الغبار + الجملة السريعة + الحزم الخرافية
  ========================================================= */
  function rollRarity(rates) {
    const entries = Object.entries(rates);
    let rand = Math.random() * entries.reduce((s, [, w]) => s + w, 0);
    for (let i = 0; i < entries.length; i++) {
      rand -= entries[i][1];
      if (rand <= 0) return entries[i][0];
    }
    return entries[0][0];
  }

  function pickCharForRarity(targetRarity) {
    const pools = getCachedPoolsByRarity();
    let pool = pools[targetRarity];
    if (pool && pool.length) return pool[Math.floor(Math.random() * pool.length)];

    const fallbackOrder = ["SR", "R", "C", "N", "SSR", "UR", "SP"];
    for (let i = 0; i < fallbackOrder.length; i++) {
      const p = pools[fallbackOrder[i]];
      if (p && p.length) return p[Math.floor(Math.random() * p.length)];
    }
    const all = Array.from(characterCatalog.values());
    return all.length ? all[Math.floor(Math.random() * all.length)] : null;
  }

  // إضافة بطاقة واحدة للمخزون بدقة (تحفظ النسخ للتدوير للعادية، وتحوّل فائض النوادر لبطاقات تحدي)
  function grantPulledCharacter(chosen, forcedRarity = null) {
    ensureStateIntegrity();
    const rarity = forcedRarity || chosen.rarity || "N";
    const maxCopies = LIMITED_CAPS[rarity] || null;
    const normName = String(chosen.name || "").trim().toLowerCase();

    const existing = state.inventory.find(
      (c) => Number(c.charId) === Number(chosen.id) || String(c.name || "").trim().toLowerCase() === normName
    );

    // 1) إذا كانت بطاقة نادرة محدودة عالمياً (SP / UR / SSR)
    if (maxCopies) {
      if (existing) {
        const curCopies = Math.max(1, Number(existing.copies || existing.count || 1));
        if (curCopies >= maxCopies) {
          state.challengeCards[rarity] = Number(state.challengeCards[rarity] || 0) + 1;
          return { card: chosen, rarity, status: "challenge_card", serial: null, maxCopies };
        }
        existing.copies = curCopies + 1;
        existing.count = existing.copies;
        return { card: existing, rarity, status: "copy", serial: existing.serial || 1, maxCopies };
      }

      const owners = getCleanOwnersForChar(chosen.id, maxCopies);
      let freeSlot = null;
      for (let s = 1; s <= maxCopies; s++) {
        if (!owners.has(String(s))) { freeSlot = s; break; }
      }

      // اكتمال حد السيرفر -> تتحول تلقائياً إلى بطاقة تحدي
      if (!freeSlot) {
        state.challengeCards[rarity] = Number(state.challengeCards[rarity] || 0) + 1;
        return { card: chosen, rarity, status: "challenge_card", serial: null, maxCopies };
      }

      const newLimited = {
        uidCard: "c_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
        charId: chosen.id,
        name: chosen.name,
        nativeName: chosen.nativeName || "",
        anime: chosen.anime || "Anime Legend",
        image: chosen.image,
        bioEn: chosen.bioEn || "",
        favorites: Number(chosen.favorites || 0),
        rarity,
        serial: freeSlot,
        maxCopies,
        copies: 1,
        count: 1,
        acquiredAt: Date.now()
      };
      state.inventory.push(newLimited);
      return { card: newLimited, rarity, status: "new", serial: freeSlot, maxCopies };
    }

    // 2) البطاقات العادية (N / C / R / SR): تدمج النسخ للاستفادة من زر "تدوير المكرر" + ذهب فوري خفيف
    if (existing) {
      existing.copies = Math.max(1, Number(existing.copies || existing.count || 1)) + 1;
      existing.count = existing.copies;
      const smallGold = Math.floor((DUP_GOLD_REWARD[rarity] || 30) * 0.5);
      state.gold += smallGold;
      return { card: existing, rarity, status: "duplicate", bonusGold: smallGold };
    }

    const newRegular = {
      uidCard: "c_" + Date.now() + "_" + Math.random().toString(36).slice(2, 6),
      charId: chosen.id,
      name: chosen.name,
      nativeName: chosen.nativeName || "",
      anime: chosen.anime || "Anime Legend",
      image: chosen.image,
      bioEn: chosen.bioEn || "",
      favorites: Number(chosen.favorites || 0),
      rarity,
      serial: null,
      maxCopies: null,
      copies: 1,
      count: 1,
      acquiredAt: Date.now()
    };
    state.inventory.push(newRegular);
    return { card: newRegular, rarity, status: "new" };
  }

  // سحب بطاقة واحدة مع تفعيل عدّاد الضمان (Pity System)
  function rollAndGrantFromPack(pack) {
    state.pity = Number(state.pity || 0) + 1;
    let rolledRarity = rollRarity(pack.rates);

    // عند بلوغ حد الضمان (30 سحبة): بطاقة نادرة مضمونة (SSR / UR / SP)
    if (state.pity >= PITY_THRESHOLD) {
      const r = Math.random();
      rolledRarity = r < 0.12 ? "SP" : r < 0.38 ? "UR" : "SSR";
      state.pity = 0;
    } else if (LIMITED_CAPS[rolledRarity]) {
      state.pity = 0;
    }

    const chosen = pickCharForRarity(rolledRarity);
    if (!chosen) return null;
    return grantPulledCharacter(chosen, rolledRarity);
  }

  // واجهة اختيار عدد الحزم للشراء بالجملة (للحزم العادية فقط)
  function openBulkPackModal(pack, currency) {
    document.getElementById("bulkPackModal")?.remove();
    const unitPrice = currency === "gem" ? pack.gem : pack.gold;
    const icon = currency === "gem" ? "💎" : "🪙";
    let qty = 1;

    const modal = document.createElement("div");
    modal.id = "bulkPackModal";
    modal.className = "mpro-overlay";

    const draw = () => {
      const totalCost = unitPrice * qty;
      modal.innerHTML = `
        <div class="mpro-box" style="max-width:360px;">
          <div class="mpro-head">
            <h3 style="margin:0;font-size:1rem;color:#38bdf8;">
              <span class="card-rarity-pill r-${pack.rarity}" style="margin:0;">${pack.rarity}</span> ${t(pack.id)}
            </h3>
            <button type="button" class="mpro-close" id="bClose">✕</button>
          </div>
          <div style="font-size:0.82rem;color:#cbd5e1;margin-bottom:8px;">${t("bulk_qty")}</div>
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:10px;">
            <button type="button" id="bMinus" style="width:40px;height:40px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#fff;font-size:1.2rem;font-weight:800;cursor:pointer;">-</button>
            <input id="bQtyInp" type="number" min="1" max="50" value="${qty}" style="flex:1;height:40px;text-align:center;border-radius:10px;border:1px solid #38bdf8;background:#020617;color:#fff;font-size:1.05rem;font-weight:900;" />
            <button type="button" id="bPlus" style="width:40px;height:40px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#fff;font-size:1.2rem;font-weight:800;cursor:pointer;">+</button>
          </div>
          <div style="display:grid;grid-template-columns:repeat(5,1fr);gap:6px;margin-bottom:12px;">
            ${[1, 5, 10, 20, 50].map((n) => `
              <button type="button" data-q="${n}" style="padding:7px 4px;border-radius:8px;border:1px solid ${qty === n ? "#f59e0b" : "#334155"};background:${qty === n ? "rgba(245,158,11,0.22)" : "#1e293b"};color:#fff;font-weight:800;font-size:0.8rem;cursor:pointer;">×${n}</button>
            `).join("")}
          </div>
          <div style="display:flex;justify-content:space-between;align-items:center;padding:10px 12px;border-radius:10px;background:#1e293b;margin-bottom:12px;">
            <span style="font-size:0.84rem;color:#cbd5e1;">${t("bulk_total")}</span>
            <span style="font-size:1rem;font-weight:900;color:#fbbf24;direction:ltr;">${fmtCompact(totalCost)} ${icon}</span>
          </div>
          <div style="display:grid;grid-template-columns:1fr 2fr;gap:8px;">
            <button type="button" id="bCancel" style="padding:10px;border-radius:10px;border:1px solid #334155;background:#1e293b;color:#cbd5e1;font-weight:700;cursor:pointer;">${t("btn_cancel")}</button>
            <button type="button" id="bGo" style="padding:10px;border-radius:10px;border:none;background:linear-gradient(135deg,#f59e0b,#ef4444);color:#fff;font-weight:800;cursor:pointer;">${t("bulk_buy")}</button>
          </div>
        </div>
      `;

      modal.querySelector("#bClose").onclick = () => modal.remove();
      modal.querySelector("#bCancel").onclick = () => modal.remove();
      modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
      modal.querySelector("#bMinus").onclick = () => { qty = Math.max(1, qty - 1); draw(); };
      modal.querySelector("#bPlus").onclick = () => { qty = Math.min(50, qty + 1); draw(); };
      modal.querySelector("#bQtyInp").onchange = (ev) => {
        qty = Math.max(1, Math.min(50, Number(ev.target.value) || 1));
        draw();
      };
      modal.querySelectorAll("[data-q]").forEach((b) => {
        b.onclick = () => { qty = Number(b.dataset.q); draw(); };
      });
      modal.querySelector("#bGo").onclick = () => {
        modal.remove();
        executeRegularPackPurchase(pack.id, currency, qty);
      };
    };

    document.body.appendChild(modal);
    draw();
  }

  // تنفيذ شراء حزمة واحدة أو عدة حزم دفعة واحدة بسرعة فورية (بدون أي تأخير أو تكرار حفظ)
  async function executeRegularPackPurchase(packId, currency, qty = 1) {
    const pack = SHOP_PACKS.find((p) => p.id === packId);
    if (!pack) return;
    if (characterCatalog.size < 25) await ensureRichCatalog();
    if (!characterCatalog.size) return showToast("⏳ Loading heroes...");

    const unitCost = currency === "gem" ? pack.gem : pack.gold;
    const totalCost = unitCost * qty;

    if (currency === "gold") {
      if (state.gold < totalCost) return showToast(t("msg_no_gold"));
      state.gold -= totalCost;
    } else {
      if (state.gems < totalCost) return showToast(t("msg_no_gems"));
      state.gems -= totalCost;
    }

    const summaryMap = new Map();
    const chGained = { SP: 0, UR: 0, SSR: 0 };
    let bonusGoldTotal = 0;
    let lastSingleOutcome = null;

    for (let i = 0; i < qty; i++) {
      const res = rollAndGrantFromPack(pack);
      if (!res) continue;
      lastSingleOutcome = res;
      if (res.bonusGold) bonusGoldTotal += res.bonusGold;
      if (res.status === "challenge_card") chGained[res.rarity] += 1;

      const k = String(res.card.name || res.card.id).trim().toLowerCase();
      const entry = summaryMap.get(k);
      if (entry) {
        entry.count += 1;
        if (res.status === "challenge_card") entry.chCount += 1;
      } else {
        summaryMap.set(k, {
          card: res.card,
          rarity: res.rarity,
          count: 1,
          chCount: res.status === "challenge_card" ? 1 : 0
        });
      }
    }

    trackProgress("packs", qty);
    flushSaveNow();
    updateHud();
    renderShop();
    renderInventory(false);
    renderCodex();

    if (qty === 1 && lastSingleOutcome) {
      const o = lastSingleOutcome;
      if (o.status === "challenge_card") {
        playSfx("summon");
        showSummonReveal(o.card, `${t("ch_cards_converted")} +1 ${o.rarity}`);
      } else if (o.status === "duplicate") {
        playSfx("win");
        showSummonReveal(o.card, `${t("dup_converted")} +${o.bonusGold} 🪙 (×${o.card.copies})`);
      } else {
        showSummonReveal(o.card, o.serial ? `👑 #${o.serial}/${o.maxCopies}` : o.card.anime);
      }
      return;
    }

    playSfx("summon");
    showBulkResultsModal(Array.from(summaryMap.values()), chGained, bonusGoldTotal, qty);
  }

  function showBulkResultsModal(items, chGained, bonusGold, totalPacks) {
    document.getElementById("bulkResultsModal")?.remove();
    items.sort((a, b) => (RANK_POWER[b.rarity] || 0) - (RANK_POWER[a.rarity] || 0));

    const chParts = [];
    if (chGained.SP) chParts.push(`+${chGained.SP} SP`);
    if (chGained.UR) chParts.push(`+${chGained.UR} UR`);
    if (chGained.SSR) chParts.push(`+${chGained.SSR} SSR`);

    const modal = document.createElement("div");
    modal.id = "bulkResultsModal";
    modal.className = "mpro-overlay";
    modal.innerHTML = `
      <div class="mpro-box" style="border-color:rgba(251,191,36,0.5);">
        <div class="mpro-head">
          <h3 style="margin:0;font-size:1rem;color:#fbbf24;">${t("bulk_res")} (×${totalPacks})</h3>
          <button type="button" class="mpro-close" id="bResX">✕</button>
        </div>
        ${bonusGold > 0 ? `<div style="padding:6px 10px;border-radius:10px;background:rgba(251,191,36,0.16);color:#fde047;font-size:0.78rem;text-align:center;margin-bottom:6px;">🪙 +${fmtCompact(bonusGold)}</div>` : ""}
        ${chParts.length ? `<div style="padding:6px 10px;border-radius:10px;background:rgba(239,68,68,0.18);color:#fca5a5;font-size:0.8rem;text-align:center;margin-bottom:8px;">${t("bulk_ch_gained")} <b>${chParts.join(" | ")}</b></div>` : ""}
        <div class="mpro-scroll" style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;padding:4px 2px;">
          ${items.map((it) => {
            const col = RARITY_COLORS[it.rarity] || "#94a3b8";
            const fb = makeFallbackSvg(it.card.name, it.rarity);
            const leftBadge = it.chCount > 0
              ? `<span style="position:absolute;top:4px;left:4px;padding:2px 5px;border-radius:6px;background:rgba(239,68,68,0.92);color:#fff;font-size:0.62rem;font-weight:900;">⚔️×${it.chCount}</span>`
              : it.count > 1
              ? `<span style="position:absolute;top:4px;left:4px;padding:2px 5px;border-radius:6px;background:rgba(0,0,0,0.78);color:#fbbf24;font-size:0.65rem;font-weight:900;">×${it.count}</span>`
              : "";
            return `
              <div style="position:relative;border-radius:10px;overflow:hidden;border:1.5px solid ${col};background:#1e293b;">
                <span style="position:absolute;top:4px;right:4px;padding:2px 5px;border-radius:6px;background:${col};color:#fff;font-size:0.64rem;font-weight:900;">${it.rarity}</span>
                ${leftBadge}
                <img class="mpro-img" loading="lazy" decoding="async" src="${it.card.image || ""}" alt="${it.card.name || ""}" onerror="this.onerror=null;this.src='${fb}'" style="width:100%;height:92px;object-fit:cover;display:block;" />
                <div style="padding:4px;font-size:0.7rem;font-weight:700;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${it.card.name || ""}</div>
              </div>
            `;
          }).join("")}
        </div>
        <button type="button" id="bResOk" class="mpro-btn" style="margin-top:10px;width:100%;padding:10px;font-size:0.9rem;">${t("bulk_ok")}</button>
      </div>
    `;
    document.body.appendChild(modal);
    modal.querySelector("#bResX").onclick = () => modal.remove();
    modal.querySelector("#bResOk").onclick = () => modal.remove();
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };
  }

  // حزمة غبار البطاقات (100 ✨ -> سحب فوري عالي الندرة SR / SSR / UR / SP)
  async function openDustPack() {
    ensureStateIntegrity();
    if (state.dust < 100) return showToast(t("dust_no"));
    if (characterCatalog.size < 25) await ensureRichCatalog();

    state.dust -= 100;
    const rolled = rollRarity({ SR: 68, SSR: 20, UR: 9, SP: 3 });
    const chosen = pickCharForRarity(rolled);
    if (!chosen) return;

    const outcome = grantPulledCharacter(chosen, rolled);
    trackProgress("packs", 1);
    flushSaveNow();
    updateHud();
    renderShop();
    renderInventory(false);
    renderCodex();

    const note = outcome.status === "challenge_card"
      ? `${t("ch_cards_converted")} +1 ${rolled}`
      : outcome.serial ? `👑 #${outcome.serial}/${outcome.maxCopies}` : chosen.anime;
    showSummonReveal(outcome.card, note);
  }

  // الحزم الخرافية المضمونة (بدون نافذة جملة + كشف احترافي خفيف وسريع بدون تعليق)
  async function openMythicPack(pack) {
    if (state.gems < pack.gems) return showToast(`${t("msg_no_gems")} (${pack.gems} 💎)`);
    if (characterCatalog.size < 25) await ensureRichCatalog();

    const chosen = pickCharForRarity(pack.rarity);
    if (!chosen) return showToast("⏳ Loading heroes...");

    state.gems -= pack.gems;
    state.gold += pack.goldReward;
    const outcome = grantPulledCharacter(chosen, pack.rarity);
    trackProgress("packs", 1);

    flushSaveNow();
    updateHud();
    renderInventory(false);
    renderCodex();
    playSfx("summon");

    const titleTxt = t(pack.id + "_t");
    const col = RARITY_COLORS[pack.rarity] || "#f59e0b";
    const fb = makeFallbackSvg(outcome.card.name, pack.rarity);

    document.getElementById("mythicOpenOverlay")?.remove();
    const overlay = document.createElement("div");
    overlay.id = "mythicOpenOverlay";
    overlay.innerHTML = `<div class="pack-shaking">🎁</div><h2 style="color:#fff;margin-top:14px;font-size:1.1rem;">${titleTxt}</h2>`;
    document.body.appendChild(overlay);

    setTimeout(() => {
      if (!document.body.contains(overlay)) return;
      const badgeTxt = outcome.status === "challenge_card"
        ? `⚔️ +1 ${pack.rarity}`
        : `${pack.rarity} #${outcome.serial || 1}/${LIMITED_CAPS[pack.rarity] || 10}`;
      const subNote = outcome.status === "challenge_card"
        ? `<p style="color:#fca5a5;font-size:0.82rem;margin:4px 0;">${t("ch_cards_converted")} +1 ${pack.rarity}</p>`
        : "";

      overlay.innerHTML = `
        <div class="mythic-reveal-card" style="border:2px solid ${col};box-shadow:0 0 34px ${col}88;">
          <span class="mythic-badge" style="background:${col};margin-bottom:10px;">${badgeTxt}</span>
          <img class="mpro-img" src="${outcome.card.image}" alt="${outcome.card.name}" onerror="this.onerror=null;this.src='${fb}'" style="width:100%;height:240px;object-fit:cover;border-radius:12px;margin-bottom:10px;border:1px solid ${col}66;" />
          <h3 style="color:#fff;margin:6px 0;font-size:1.15rem;">${outcome.card.name}</h3>
          <p style="color:#94a3b8;font-size:0.8rem;margin:2px 0;">${outcome.card.anime || ""}</p>
          ${subNote}
          <p style="color:#fbbf24;font-weight:900;font-size:1rem;margin:8px 0;">+${pack.goldReward.toLocaleString()} 🪙</p>
          <button id="btnCloseMythicOverlay" class="primary-btn" style="width:100%;margin-top:8px;">${t("btn_claim")}</button>
        </div>
      `;
      document.getElementById("btnCloseMythicOverlay")?.addEventListener("click", () => overlay.remove());
    }, 750);
  }

  function renderShop() {
    const grid = document.getElementById("shopPacksGrid");
    if (!grid) return;
    ensureStateIntegrity();
    grid.innerHTML = "";

    // 1) شريط عدّاد الضمان (Pity System) + حزمة غبار البطاقات
    const pityCur = Math.min(PITY_THRESHOLD, Number(state.pity || 0));
    const pityLeft = Math.max(0, PITY_THRESHOLD - pityCur);
    const pityPct = Math.round((pityCur / PITY_THRESHOLD) * 100);

    const pityBox = document.createElement("div");
    pityBox.className = "pity-shop-box";
    pityBox.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;font-size:0.8rem;">
        <span style="color:#e0f2fe;font-weight:800;">
          ${pityLeft <= 1 ? t("pity_ready") : `${t("pity_lbl")} <b style="color:#fbbf24;">${pityLeft}</b> ${t("pity_pulls")}`}
        </span>
        <span style="color:#94a3b8;font-weight:800;direction:ltr;">${pityCur}/${PITY_THRESHOLD}</span>
      </div>
      <div class="mpro-bar-track"><div class="mpro-bar-fill" style="width:${pityPct}%;"></div></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;gap:8px;">
        <span style="font-size:0.8rem;color:#7dd3fc;font-weight:800;">${t("dust_lbl")}: <b>${fmtCompact(state.dust)} ✨</b></span>
        <button type="button" id="btnBuyDustPack" class="mpro-btn" ${state.dust < 100 ? "disabled" : ""}>${t("dust_pack")}</button>
      </div>
    `;
    grid.appendChild(pityBox);
    pityBox.querySelector("#btnBuyDustPack")?.addEventListener("click", openDustPack);

    // 2) الحزم الأساسية السبع (تدعم الشراء بالجملة السريع)
    SHOP_PACKS.forEach((pack) => {
      const card = document.createElement("div");
      card.className = "pack-card";
      card.innerHTML = `
        <div class="pack-info">
          <h3><span class="card-rarity-pill r-${pack.rarity}" style="margin:0;">${pack.rarity}</span> ${t(pack.id)}</h3>
          <div class="pack-desc">${t(pack.id + "_desc")}</div>
        </div>
        <div class="pack-btns">
          ${pack.gold > 0 ? `<button type="button" class="buy-btn gold" data-pack="${pack.id}" data-curr="gold">${pack.gold} 🪙</button>` : ""}
          ${pack.gem > 0 ? `<button type="button" class="buy-btn gem" data-pack="${pack.id}" data-curr="gem">${pack.gem} 💎</button>` : ""}
        </div>
      `;
      card.querySelectorAll(".buy-btn").forEach((btn) => {
        btn.addEventListener("click", () => openBulkPackModal(pack, btn.dataset.curr));
      });
      grid.appendChild(card);
    });

    // 3) الحزم الخرافية المضمونة الثلاث (شراء مباشر بضغطة واحدة)
    MYTHIC_PACKS.forEach((pack) => {
      const card = document.createElement("div");
      card.className = `mythic-pack-card ${pack.cls}`;
      card.innerHTML = `
        <div>
          <span class="mythic-badge">${pack.rarity} ${t("mythic_badge_gur")}</span>
          <h3 style="color:#fff;margin:8px 0 4px;">${t(pack.id + "_t")}</h3>
          <p style="color:#cbd5e1;font-size:13px;margin:0;">${t(pack.id + "_d")}</p>
        </div>
        <button type="button" class="primary-btn" style="width:100%;margin-top:8px;">${t("mythic_buy")} ${pack.gems.toLocaleString()} 💎</button>
      `;
      card.querySelector("button").addEventListener("click", () => openMythicPack(pack));
      grid.appendChild(card);
    });
  }

  function showSummonReveal(card, noteText) {
    playSfx("summon");
    const modal = document.getElementById("summonModal");
    const stage = document.getElementById("summonCardStage");
    if (!modal || !stage) return;
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
  /* === نهاية الجزء 5 من 8 (الصق الجزء 6 مباشرة هنا) === */
  /* =========================================================
     12. الأطوار الفردية: نزال الـ 6 بطاقات + الألغاز + الشعبية + تخمين الظل واللقطة المقربة
  ========================================================= */
  let soloDiff = "normal";
  let soloState = { active: false, phase: "idle", cards: [], picked: [], turn: "player" };
  let soloRunId = 0;

  // اختيار 6 بطاقات بندرات مختلفة بسرعة فائقة من الفهرس المخزّن مسبقاً
  function pickSixUniqueRarityCards() {
    const pools = getCachedPoolsByRarity();
    const rarities = ["N", "C", "R", "SR", "SSR", "UR", "SP"].sort(() => Math.random() - 0.5);
    const chosen = [];
    for (let i = 0; i < rarities.length; i++) {
      if (chosen.length === 6) break;
      const bucket = pools[rarities[i]];
      if (bucket && bucket.length) {
        chosen.push(bucket[Math.floor(Math.random() * bucket.length)]);
      }
    }
    if (chosen.length < 6 && characterCatalog.size >= 6) {
      const all = Array.from(characterCatalog.values());
      const usedIds = new Set(chosen.map((c) => c.id));
      while (chosen.length < 6) {
        const pick = all[Math.floor(Math.random() * all.length)];
        if (pick && !usedIds.has(pick.id)) {
          usedIds.add(pick.id);
          chosen.push(pick);
        }
      }
    }
    return chosen.sort(() => Math.random() - 0.5);
  }

  async function animateRealCardSwap(idxA, idxB, durationMs) {
    const board = document.getElementById("soloBoard");
    const slots = board?.querySelectorAll(".duel-slot");
    const elA = slots?.[idxA];
    const elB = slots?.[idxB];
    if (!elA || !elB) return;

    const rA = elA.getBoundingClientRect();
    const rB = elB.getBoundingClientRect();
    const dx = rB.left - rA.left;
    const dy = rB.top - rA.top;

    elA.classList.add("moving-card");
    elB.classList.add("moving-card");
    elA.style.transition = `transform ${durationMs}ms ease`;
    elB.style.transition = `transform ${durationMs}ms ease`;
    elA.style.transform = `translate(${dx}px, ${dy}px) scale(1.03)`;
    elB.style.transform = `translate(${-dx}px, ${-dy}px) scale(1.03)`;
    playSfx("click");
    await new Promise((r) => setTimeout(r, durationMs + 25));

    [soloState.cards[idxA], soloState.cards[idxB]] = [soloState.cards[idxB], soloState.cards[idxA]];
    elA.style.transition = "none";
    elB.style.transition = "none";
    elA.style.transform = "";
    elB.style.transform = "";
    elA.classList.remove("moving-card");
    elB.classList.remove("moving-card");
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

    const statusEl = document.getElementById("soloShuffleStatus");
    if (statusEl) statusEl.textContent = t("msg_memorize");
    renderSoloBoard(true);
    await new Promise((r) => setTimeout(r, cfg.preview));
    if (runId !== soloRunId) return;

    soloState.phase = "shuffling";
    if (statusEl) statusEl.textContent = t("msg_shuffling");
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
    if (statusEl) statusEl.textContent = t("msg_your_turn");
    renderSoloBoard(false);
  }

  function renderSoloBoard(revealAll) {
    const board = document.getElementById("soloBoard");
    if (!board) return;
    board.innerHTML = "";

    const pEl = document.getElementById("soloPlayerPicks");
    const bEl = document.getElementById("soloBotPicks");
    if (pEl) pEl.textContent = `${soloState.picked.filter((x) => x === "player").length}/3`;
    if (bEl) bEl.textContent = `${soloState.picked.filter((x) => x === "bot").length}/3`;

    const frag = document.createDocumentFragment();
    soloState.cards.forEach((card, idx) => {
      const owner = soloState.picked[idx];
      const showFace = revealAll || owner !== null || soloState.phase === "result";
      const slot = document.createElement("div");
      slot.className = "duel-slot";
      const borderCls = owner === "player" ? " picked-me" : owner === "bot" ? " picked-opp" : "";
      const fallback = makeFallbackSvg(card.name, card.rarity);
      slot.innerHTML = showFace
        ? `<div class="duel-card-inner${borderCls}"><img src="${card.image}" alt="${card.name}" decoding="async" onerror="this.onerror=null;this.src='${fallback}'" /><span class="card-rarity-pill r-${card.rarity}">${card.rarity}</span><div class="card-bottom-label">${card.name}</div></div>`
        : `<div class="duel-card-inner face-down"></div>`;
      slot.addEventListener("click", () => handleSoloCardClick(idx));
      frag.appendChild(slot);
    });
    board.appendChild(frag);
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
    const statusEl = document.getElementById("soloShuffleStatus");
    if (statusEl) statusEl.textContent = t("msg_opp_turn");
    let left = count;
    const step = () => {
      const free = soloState.picked.map((v, i) => (v === null ? i : -1)).filter((i) => i !== -1);
      if (!free.length || left <= 0) {
        if (soloState.picked.filter((x) => x !== null).length === 6) return finishSoloShuffleDuel();
        soloState.turn = "player";
        if (statusEl) statusEl.textContent = t("msg_your_turn");
        return;
      }
      soloState.picked[free[Math.floor(Math.random() * free.length)]] = "bot";
      left--;
      renderSoloBoard(false);
      setTimeout(step, 400);
    };
    setTimeout(step, 400);
  }

  function finishSoloShuffleDuel() {
    soloState.phase = "result";
    renderSoloBoard(true);
    let pScore = 0;
    let bScore = 0;
    soloState.cards.forEach((c, i) => {
      const pwr = RANK_POWER[c.rarity] || 1;
      if (soloState.picked[i] === "player") pScore += pwr;
      else bScore += pwr;
    });

    const gemReward = soloDiff === "legendary" ? 4 : soloDiff === "hard" ? 3 : 2;
    const goldReward = soloDiff === "legendary" ? 350 : soloDiff === "hard" ? 220 : 150;
    const statusEl = document.getElementById("soloShuffleStatus");

    if (pScore >= bScore) {
      state.gold += goldReward;
      state.gems += gemReward;
      trackProgress("duels", 1);
      saveState();
      updateHud();
      playSfx("win");
      if (statusEl) statusEl.textContent = `${t("msg_win")} (${pScore} - ${bScore})`;
      showToast(`${t("msg_win")} +${goldReward} 🪙 | +${gemReward} 💎`);
    } else {
      if (statusEl) statusEl.textContent = `${t("msg_lose")} (${pScore} - ${bScore})`;
      showToast(t("msg_lose"));
    }
  }

  /* --- ألغاز الأنمي (حذف تدريجي 50 -> 100 -> 150 ذهب بدون حذف الصحيح أبداً) --- */
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
      btn.textContent = "✂️ 0";
    } else {
      btn.disabled = false;
      btn.textContent = `✂️ (${HINT_COSTS[triviaHintCount]} 🪙)`;
    }
  }

  function useTriviaHint() {
    if (!currentTriviaAnswer || triviaHintCount >= HINT_COSTS.length) return;
    const cost = HINT_COSTS[triviaHintCount];
    if (state.gold < cost) return showToast(`${t("msg_no_gold")} (${cost} 🪙)`);

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
    saveState();
    updateHud();
    playSfx("click");
    updateTriviaHintBtn();
  }

  async function refreshTriviaView() {
    if (!currentTriviaAnswer) return;
    const mediaBox = document.getElementById("triviaMediaBox");
    const promptEl = document.getElementById("triviaPrompt");
    if (!mediaBox || !promptEl) return;

    const fb = makeFallbackSvg(currentTriviaAnswer.name, currentTriviaAnswer.rarity);
    if (triviaMode === "image") {
      promptEl.textContent = t("trivia_who");
      mediaBox.innerHTML = `<img id="triviaImg" src="${currentTriviaAnswer.image}" alt="Quiz" decoding="async" onerror="this.onerror=null;this.src='${fb}'" />`;
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
      const masked = first.length > 2
        ? bio.replace(new RegExp(first.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "???")
        : bio;
      const loreEl = document.getElementById("triviaLoreText");
      if (loreEl) loreEl.textContent = `« ${masked} »`;
    }
  }

  function pickRandomDistinctChars(count, minFav = 0) {
    const all = Array.from(characterCatalog.values());
    if (all.length < count) return [];
    const chosen = [];
    const used = new Set();
    let tries = 0;
    while (chosen.length < count && tries < 250) {
      tries++;
      const c = all[Math.floor(Math.random() * all.length)];
      if (!c || used.has(c.id)) continue;
      if (minFav > 0 && Number(c.favorites || 0) < minFav && tries < 120) continue;
      used.add(c.id);
      chosen.push(c);
    }
    return chosen;
  }

  async function loadNextTriviaQuestion() {
    if (characterCatalog.size < 4) {
      await ensureRichCatalog();
      if (characterCatalog.size < 4) return;
    }
    const choices = pickRandomDistinctChars(4, 0);
    if (choices.length < 4) return;

    currentTriviaAnswer = choices[0];
    triviaHintCount = 0;
    updateTriviaHintBtn();

    const options = [...choices].sort(() => Math.random() - 0.5);
    const optBox = document.getElementById("triviaOptions");
    if (!optBox) return;
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
      trackProgress("trivia", 1);
      saveState();
      updateHud();
      playSfx("win");
      showToast("✅ +120 🪙" + (triviaStreak % 3 === 0 ? " | +1 💎" : ""));
    } else {
      btn.classList.add("wrong");
      triviaStreak = 0;
      showToast(`❌ ${currentTriviaAnswer.name}`);
    }
    const streakEl = document.getElementById("triviaStreak");
    if (streakEl) streakEl.textContent = triviaStreak;
    setTimeout(loadNextTriviaQuestion, 1250);
  }

  /* --- تحدي الشعبية (سريع بدون فرز كامل الكتالوج) --- */
  let popBetState = { phase: "bet", baseBet: 0, pot: 0, round: 0, pair: [] };
  let popTimerInterval = null;

  function stopPopTimer() {
    if (popTimerInterval) {
      clearInterval(popTimerInterval);
      popTimerInterval = null;
    }
  }

  function startPopTimer() {
    stopPopTimer();
    const startedAt = Date.now();
    popTimerInterval = setInterval(() => {
      if (popBetState.phase !== "playing") return stopPopTimer();
      const left = Math.max(0, 6000 - (Date.now() - startedAt));
      const fill = document.getElementById("popTimerFill");
      const txt = document.getElementById("popTimerText");
      const head = document.getElementById("popTimerHead");
      if (fill) {
        fill.style.width = (left / 6000) * 100 + "%";
        fill.classList.toggle("danger", left <= 2000);
      }
      if (head) head.classList.toggle("danger", left <= 2000);
      if (txt) txt.textContent = (left / 1000).toFixed(1) + "s";
      if (left <= 0) {
        stopPopTimer();
        popBetState.phase = "lost";
        showToast(t("pop_timeout"));
        renderPopularityGame();
        setTimeout(() => {
          popBetState.phase = "bet";
          renderPopularityGame();
        }, 1500);
      }
    }, 100);
  }

  function pickDifficultyScaledPair(round) {
    const sample = pickRandomDistinctChars(40, 1);
    if (sample.length < 2) return [];
    const maxRatio = round <= 1 ? 4.5 : round === 2 ? 2.1 : 1.4;
    const minRatio = round <= 1 ? 1.7 : 1.05;

    for (let i = 0; i < 60; i++) {
      const a = sample[Math.floor(Math.random() * sample.length)];
      const b = sample[Math.floor(Math.random() * sample.length)];
      if (!a || !b || a.id === b.id || a.favorites === b.favorites) continue;
      const ratio = Math.max(a.favorites, b.favorites) / Math.max(1, Math.min(a.favorites, b.favorites));
      if (ratio >= minRatio && ratio <= maxRatio) return Math.random() < 0.5 ? [a, b] : [b, a];
    }
    return sample.slice(0, 2);
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
          state.gold -= bet;
          saveState();
          updateHud();
          popBetState = { phase: "playing", baseBet: bet, pot: bet * 2, round: 1, pair: pickDifficultyScaledPair(1) };
          playSfx("click");
          renderPopularityGame();
          startPopTimer();
        });
      });
      return;
    }

    const hud = document.createElement("div");
    hud.className = "pop-hud-bar";
    hud.style.gridColumn = "1 / -1";
    hud.innerHTML = `<span>${t("pop_round")}: <b>#${popBetState.round}</b></span><span>${t("pop_pot")}: <b style="color:var(--gold);">${fmtCompact(popBetState.pot)} 🪙</b></span>`;
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
      card.innerHTML = `${reveal ? `<div class="pop-fav-badge">❤️ ${ch.favorites.toLocaleString()}</div>` : ""}<img src="${ch.image}" alt="${ch.name}" decoding="async" onerror="this.onerror=null;this.src='${fallback}'" /><div class="pop-card-info"><h4>${ch.name}</h4><p class="muted-text">${ch.anime}</p></div>`;
      if (popBetState.phase === "playing") {
        card.addEventListener("click", () => {
          stopPopTimer();
          if (ch.favorites >= other.favorites) {
            popBetState.phase = "decision";
            trackProgress("shadow", 1);
            state.stats.pop = Number(state.stats.pop || 0) + 1;
            playSfx("win");
            renderPopularityGame();
          } else {
            popBetState.phase = "lost";
            showToast(t("pop_lost"));
            renderPopularityGame();
            setTimeout(() => {
              popBetState.phase = "bet";
              renderPopularityGame();
            }, 1500);
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
      dec.innerHTML = `<button id="btnPopCashout" class="btn-cashout">${t("pop_cashout")} (+${fmtCompact(popBetState.pot)} 🪙)</button><button id="btnPopDouble" class="btn-double">${t("pop_double")} (${fmtCompact(popBetState.pot * 2)} 🪙)</button>`;
      box.appendChild(dec);

      document.getElementById("btnPopCashout").addEventListener("click", () => {
        state.gold += popBetState.pot;
        if (bonusGems > 0) state.gems += bonusGems;
        saveState();
        updateHud();
        playSfx("win");
        showToast(t("pop_cashed"));
        popBetState.phase = "bet";
        renderPopularityGame();
      });

      document.getElementById("btnPopDouble").addEventListener("click", () => {
        popBetState.round++;
        popBetState.pot *= 2;
        popBetState.phase = "playing";
        popBetState.pair = pickDifficultyScaledPair(popBetState.round);
        playSfx("click");
        renderPopularityGame();
        startPopTimer();
      });
    }
  }

  /* --- طور المهارة البصري الجديد: تخمين الشخصية من الظل أو اللقطة المقربة بمؤقت 8 ثوانٍ --- */
  let shadowMode = "silhouette";
  let shadowStreak = 0;
  let currentShadowAnswer = null;
  let shadowTimerInterval = null;
  let shadowLocked = false;

  function stopShadowTimer() {
    if (shadowTimerInterval) {
      clearInterval(shadowTimerInterval);
      shadowTimerInterval = null;
    }
  }

  function updateShadowTabText() {
    const btn = document.getElementById("btnSubTabShadow");
    if (btn) btn.textContent = t("solo_shadow");
    const h = document.getElementById("shadowTitleTxt");
    if (h) h.textContent = t("shadow_title");
    const bSil = document.getElementById("btnShadowSil");
    if (bSil) bSil.textContent = t("shadow_mode_sil");
    const bZoom = document.getElementById("btnShadowZoom");
    if (bZoom) bZoom.textContent = t("shadow_mode_zoom");
    const q = document.getElementById("shadowPromptTxt");
    if (q) q.textContent = shadowMode === "zoom" ? t("shadow_q_zoom") : t("shadow_q");
  }

  function injectShadowModeUi() {
    const arena = document.getElementById("viewArena");
    if (!arena) return;

    const firstSubTab = arena.querySelector(".sub-tab");
    if (firstSubTab && !document.getElementById("btnSubTabShadow")) {
      const btn = document.createElement("button");
      btn.id = "btnSubTabShadow";
      btn.type = "button";
      btn.className = "sub-tab";
      btn.dataset.solo = "shadow";
      btn.textContent = t("solo_shadow");
      firstSubTab.parentElement.appendChild(btn);
    }

    const popPane = document.getElementById("soloPopPane");
    if (popPane && !document.getElementById("soloShadowPane")) {
      const pane = document.createElement("div");
      pane.id = "soloShadowPane";
      pane.className = "solo-pane panel-card";
      pane.innerHTML = `
        <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;margin-bottom:8px;">
          <h3 id="shadowTitleTxt" style="margin:0;font-size:1rem;">${t("shadow_title")}</h3>
          <span class="status-badge">🔥 <span id="shadowStreakVal">0</span></span>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:10px;">
          <button type="button" id="btnShadowSil" class="mpro-tab active" style="text-align:center;">${t("shadow_mode_sil")}</button>
          <button type="button" id="btnShadowZoom" class="mpro-tab" style="text-align:center;">${t("shadow_mode_zoom")}</button>
        </div>
        <div class="pop-timer-wrap" style="margin-bottom:8px;">
          <div id="shadowTimerHead" class="pop-timer-head"><span>${t("pop_time")}</span><span id="shadowTimerText">8.0s</span></div>
          <div class="pop-timer-track"><div id="shadowTimerFill" class="pop-timer-fill"></div></div>
        </div>
        <p id="shadowPromptTxt" class="muted-text" style="text-align:center;margin:4px 0 6px;">${t("shadow_q")}</p>
        <div class="shadow-stage"><img id="shadowStageImg" class="shadow-img masked" src="" alt="Shadow" /></div>
        <div id="shadowOptions" class="options-grid" style="display:grid;grid-template-columns:1fr 1fr;gap:8px;"></div>
      `;
      popPane.insertAdjacentElement("afterend", pane);

      pane.querySelector("#btnShadowSil").addEventListener("click", () => {
        shadowMode = "silhouette";
        pane.querySelector("#btnShadowSil").classList.add("active");
        pane.querySelector("#btnShadowZoom").classList.remove("active");
        loadNextShadowQuestion();
      });
      pane.querySelector("#btnShadowZoom").addEventListener("click", () => {
        shadowMode = "zoom";
        pane.querySelector("#btnShadowZoom").classList.add("active");
        pane.querySelector("#btnShadowSil").classList.remove("active");
        loadNextShadowQuestion();
      });
    }
  }

  function startShadowTimer() {
    stopShadowTimer();
    const startedAt = Date.now();
    shadowTimerInterval = setInterval(() => {
      if (shadowLocked) return stopShadowTimer();
      const left = Math.max(0, 8000 - (Date.now() - startedAt));
      const fill = document.getElementById("shadowTimerFill");
      const txt = document.getElementById("shadowTimerText");
      const head = document.getElementById("shadowTimerHead");
      if (fill) {
        fill.style.width = (left / 8000) * 100 + "%";
        fill.classList.toggle("danger", left <= 2500);
      }
      if (head) head.classList.toggle("danger", left <= 2500);
      if (txt) txt.textContent = (left / 1000).toFixed(1) + "s";

      if (left <= 0) {
        stopShadowTimer();
        shadowLocked = true;
        shadowStreak = 0;
        const img = document.getElementById("shadowStageImg");
        if (img) img.classList.remove("masked", "zoomed");
        document.querySelectorAll("#shadowOptions .opt-btn").forEach((b) => {
          b.disabled = true;
          if (currentShadowAnswer && Number(b.dataset.id) === currentShadowAnswer.id) b.classList.add("correct");
        });
        const sv = document.getElementById("shadowStreakVal");
        if (sv) sv.textContent = "0";
        showToast(`${t("shadow_timeout")} (${currentShadowAnswer?.name || ""})`);
        setTimeout(() => {
          if (document.getElementById("soloShadowPane")?.classList.contains("active")) {
            loadNextShadowQuestion();
          }
        }, 1450);
      }
    }, 100);
  }

  async function loadNextShadowQuestion() {
    stopShadowTimer();
    if (characterCatalog.size < 4) {
      await ensureRichCatalog();
      if (characterCatalog.size < 4) return;
    }
    const choices = pickRandomDistinctChars(4, 1500);
    if (choices.length < 4) return;

    currentShadowAnswer = choices[0];
    shadowLocked = false;
    updateShadowTabText();

    const img = document.getElementById("shadowStageImg");
    const optBox = document.getElementById("shadowOptions");
    if (!img || !optBox) return;

    const fb = makeFallbackSvg(currentShadowAnswer.name, currentShadowAnswer.rarity);
    img.className = "shadow-img " + (shadowMode === "zoom" ? "zoomed" : "masked");
    img.onerror = () => { img.onerror = null; img.src = fb; };
    img.src = currentShadowAnswer.image;

    const options = [...choices].sort(() => Math.random() - 0.5);
    optBox.innerHTML = "";
    options.forEach((opt) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "opt-btn";
      b.textContent = opt.name;
      b.dataset.id = opt.id;
      b.addEventListener("click", () => handleShadowPick(b, opt.id === currentShadowAnswer.id));
      optBox.appendChild(b);
    });

    startShadowTimer();
  }

  function handleShadowPick(btn, isCorrect) {
    if (shadowLocked) return;
    shadowLocked = true;
    stopShadowTimer();

    const img = document.getElementById("shadowStageImg");
    if (img) img.classList.remove("masked", "zoomed");

    document.querySelectorAll("#shadowOptions .opt-btn").forEach((b) => {
      b.disabled = true;
      if (Number(b.dataset.id) === currentShadowAnswer.id) b.classList.add("correct");
    });

    if (isCorrect) {
      shadowStreak++;
      const goldWin = 140;
      state.gold += goldWin;
      const bonusGem = shadowStreak % 3 === 0 ? 1 : 0;
      if (bonusGem) state.gems += bonusGem;
      trackProgress("shadow", 1);
      saveState();
      updateHud();
      playSfx("win");
      showToast(`✅ +${goldWin} 🪙${bonusGem ? " | +1 💎" : ""}`);
    } else {
      btn.classList.add("wrong");
      shadowStreak = 0;
      showToast(`❌ ${currentShadowAnswer.name}`);
    }

    const sv = document.getElementById("shadowStreakVal");
    if (sv) sv.textContent = String(shadowStreak);

    setTimeout(() => {
      if (document.getElementById("soloShadowPane")?.classList.contains("active")) {
        loadNextShadowQuestion();
      }
    }, 1350);
  }
  /* === نهاية الجزء 6 من 8 (الصق الجزء 7 مباشرة هنا) === */
  /* =========================================================
     13. النزالات أونلاين 1v1 + نقل الملكية في Firebase + البحث التلقائي (Quick Match)
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
  let ensureFaceUpInterval = null;
  let rewardedRooms = new Set();

  let quickMatchTimer = null;
  let quickMatchQueueCode = null;
  let quickMatchPollRef = null;

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
      item.innerHTML = `<img src="${c.image}" alt="${c.name}" decoding="async" /><span>${c.rarity} #${c.serial || 1}</span><span>${c.name}</span>`;
      item.addEventListener("click", () => {
        selectedStakeCardUid = c.uidCard;
        playSfx("click");
        populateMyStakeCardsRow();
      });
      row.appendChild(item);
    });
  }

  function openManualStakePicker(reqRarity, onSelect) {
    document.getElementById("manualStakeOverlay")?.remove();
    const matching = state.inventory.filter((c) => c.rarity === reqRarity);
    if (!matching.length) return showToast(`⚠️ ${reqRarity} — ${t("msg_no_rares_stake")}`);

    const overlay = document.createElement("div");
    overlay.id = "manualStakeOverlay";
    overlay.className = "mpro-overlay";
    overlay.innerHTML = `
      <div class="mpro-box" style="max-width:360px;border-color:#f59e0b;">
        <div class="mpro-head">
          <h3 style="margin:0;font-size:1rem;color:#fbbf24;">🔥 ${t("lbl_pick_stake")} (${reqRarity})</h3>
          <button type="button" class="mpro-close" id="btnCancelManualStakeX">✕</button>
        </div>
        <div id="manualStakeGrid" class="mpro-scroll" style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;padding:4px 0;"></div>
        <button id="btnCancelManualStake" type="button" class="secondary-btn full-w" style="margin-top:10px;">${t("btn_cancel")}</button>
      </div>
    `;
    document.body.appendChild(overlay);

    const grid = overlay.querySelector("#manualStakeGrid");
    matching.forEach((card) => {
      const el = document.createElement("div");
      el.style.cssText = "background:#1e293b;border:1px solid #334155;border-radius:12px;padding:8px;text-align:center;cursor:pointer;";
      el.innerHTML = `
        <img class="mpro-img" src="${card.image}" alt="${card.name}" style="width:100%;height:115px;object-fit:cover;border-radius:8px;" />
        <div style="color:#fff;font-size:0.78rem;font-weight:800;margin-top:6px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${card.name}</div>
        <div style="color:#fbbf24;font-size:0.72rem;">#${card.serial || 1}</div>
      `;
      el.addEventListener("click", () => {
        overlay.remove();
        onSelect(card);
      });
      grid.appendChild(el);
    });

    overlay.querySelector("#btnCancelManualStake").onclick = () => overlay.remove();
    overlay.querySelector("#btnCancelManualStakeX").onclick = () => overlay.remove();
    overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
  }

  async function createOnlineRoom() {
    if (!db || !navigator.onLine) return showToast("⚠️ Offline!");
    if (characterCatalog.size < 6) await ensureRichCatalog();

    const duelType = selectedDuelMode;
    const goldStake = duelType === "safe"
      ? Math.max(0, Math.floor(Number(document.getElementById("inputGoldStake")?.value) || 0))
      : 0;
    const gemsStake = duelType === "stake_gems" ? selectedGemsStake : 0;
    let stakeCard = null;

    if (duelType === "safe" && goldStake > 0 && state.gold < goldStake) return showToast(t("msg_no_gold"));
    if (duelType === "stake_gems" && state.gems < gemsStake) return showToast(t("msg_no_gems"));
    if (duelType === "stake_card") {
      stakeCard = state.inventory.find((c) => c.uidCard === selectedStakeCardUid) || null;
      if (!stakeCard) return showToast(t("msg_no_rares_stake"));
    }

    const code = String(Math.floor(1000 + Math.random() * 9000));
    const boardCards = pickSixUniqueRarityCards().map((c) => ({
      id: c.id, name: c.name, image: c.image, rarity: c.rarity
    }));

    await db.ref(`duels/${code}`).set({
      code,
      duelType,
      goldStake,
      gemsStake,
      status: "waiting",
      turn: "p1",
      cards: boardCards,
      picked: ["", "", "", "", "", ""],
      p1: { uid: state.uid, name: state.name, consent: false, stakeCard },
      p2: null,
      createdAt: Date.now()
    });
    attachToRoom(code, "p1");
    showToast(`✅ ${t("lbl_room_code")}: ${code}`);
  }

  async function joinOnlineRoom(codeInput) {
    const code = String(codeInput || document.getElementById("inputRoomCode")?.value || "").trim();
    if (!/^\d{4}$/.test(code)) return showToast("⚠️ 4-digit code!");
    if (!db || !navigator.onLine) return showToast("⚠️ Offline!");

    const snap = await db.ref(`duels/${code}`).get();
    if (!snap.exists()) return showToast("❌ Room not found!");
    const room = snap.val();
    if (room.p1?.uid === state.uid) { attachToRoom(code, "p1"); return; }
    if (room.p2 && room.p2.uid !== state.uid) return showToast("⚠️ Room full!");

    const reqGold = Number(room.goldStake) || 0;
    const reqGems = Number(room.gemsStake) || 30;
    if (room.duelType === "safe" && reqGold > 0 && state.gold < reqGold) return showToast(t("msg_no_gold"));
    if (room.duelType === "stake_gems" && state.gems < reqGems) return showToast(t("msg_no_gems"));

    const proceedJoin = async (p2StakeCard, forceStartPreview = false) => {
      const needsConsent = !forceStartPreview && (room.duelType !== "safe" || reqGold > 0);
      await db.ref(`duels/${code}`).update({
        status: needsConsent ? "consent" : "preview",
        p2: { uid: state.uid, name: state.name, consent: !needsConsent, stakeCard: p2StakeCard }
      });
      attachToRoom(code, "p2");
    };

    // نزال بطاقة التحدي: المدافع يراهن تلقائياً ببطاقته المستهدفة ويدخل مباشرة للمعاينة
    if (room.duelType === "challenge_card") {
      const defendedCard =
        state.inventory.find(
          (c) => Number(c.charId) === Number(room.targetCharId) && Number(c.serial || 1) === Number(room.targetSlot || 1)
        ) ||
        state.inventory.find((c) => Number(c.charId) === Number(room.targetCharId)) ||
        null;
      await proceedJoin(defendedCard, true);
      return;
    }

    if (room.duelType === "stake_card") {
      const reqR = room.p1?.stakeCard?.rarity || "SSR";
      openManualStakePicker(reqR, (chosenCard) => proceedJoin(chosenCard, false));
    } else {
      await proceedJoin(null, false);
    }
  }

  function attachToRoom(code, role) {
    leaveCurrentRoom(false);
    currentRoomCode = code;
    currentRole = role;
    onlinePreviewStartedFor = null;
    document.getElementById("roomSetupBox")?.classList.add("hidden");
    document.getElementById("activeDuelBox")?.classList.remove("hidden");
    const codeEl = document.getElementById("activeRoomCode");
    if (codeEl) codeEl.textContent = code;

    roomListenerRef = db.ref(`duels/${code}`);
    roomListenerRef.on("value", (snap) => {
      if (!snap.exists()) { leaveCurrentRoom(false); return; }
      renderOnlineRoomState(snap.val());
    });
  }

  function leaveCurrentRoom(removeFromDb = true) {
    stopQuickMatchSearch(false);
    if (activePreviewTimer) { clearInterval(activePreviewTimer); activePreviewTimer = null; }
    if (activeShuffleInterval) { clearInterval(activeShuffleInterval); activeShuffleInterval = null; }
    if (ensureFaceUpInterval) { clearInterval(ensureFaceUpInterval); ensureFaceUpInterval = null; }
    if (roomListenerRef) { roomListenerRef.off(); roomListenerRef = null; }
    if (removeFromDb && currentRoomCode && db) db.ref(`duels/${currentRoomCode}`).remove().catch(() => {});
    currentRoomCode = null;
    currentRole = null;
    onlinePreviewStartedFor = null;
    document.getElementById("activeDuelBox")?.classList.add("hidden");
    document.getElementById("roomSetupBox")?.classList.remove("hidden");
  }

  function startOnlineVisibleShuffle(room) {
    if (onlinePreviewStartedFor === room.code) return;
    onlinePreviewStartedFor = room.code;
    if (activePreviewTimer) clearInterval(activePreviewTimer);
    if (activeShuffleInterval) clearInterval(activeShuffleInterval);
    if (ensureFaceUpInterval) clearInterval(ensureFaceUpInterval);

    const statusBanner = document.getElementById("onlineDuelStatus");
    renderOnlineBoard(room, true);
    let previewLeft = 10;
    if (statusBanner) statusBanner.textContent = `👀 ${t("msg_memorize")} (${previewLeft}s)`;

    // ضمان بقاء البطاقات مكشوفة طوال الـ 10 ثوانٍ للمضيف والضيف معاً
    ensureFaceUpInterval = setInterval(() => {
      if (previewLeft <= 0 || currentRoomCode !== room.code) {
        clearInterval(ensureFaceUpInterval);
        ensureFaceUpInterval = null;
        return;
      }
      if (document.querySelector("#onlineBoard .face-down")) {
        renderOnlineBoard(room, true);
      }
    }, 450);

    activePreviewTimer = setInterval(() => {
      previewLeft--;
      if (previewLeft > 0) {
        if (statusBanner) statusBanner.textContent = `👀 ${t("msg_memorize")} (${previewLeft}s)`;
      } else {
        clearInterval(activePreviewTimer);
        activePreviewTimer = null;
        if (ensureFaceUpInterval) { clearInterval(ensureFaceUpInterval); ensureFaceUpInterval = null; }
        renderOnlineBoard(room, false);

        let secondsLeft = 15;
        let cardsOrder = [...(room.cards || [])];
        let seed = Number(room.code) || 1234;
        const nextRand = () => {
          seed = (seed * 9301 + 49297) % 233280;
          return seed / 233280;
        };

        const doFastSwap = () => {
          const board = document.getElementById("onlineBoard");
          if (!board || board.children.length < 6) return;
          const i = Math.floor(nextRand() * 6);
          let j = Math.floor(nextRand() * 6);
          if (i === j) j = (i + 1) % 6;
          [cardsOrder[i], cardsOrder[j]] = [cardsOrder[j], cardsOrder[i]];

          const elA = board.children[i];
          const elB = board.children[j];
          const rA = elA.getBoundingClientRect();
          const rB = elB.getBoundingClientRect();
          const dx = rB.left - rA.left;
          const dy = rB.top - rA.top;

          elA.style.transition = "transform 0.15s ease";
          elB.style.transition = "transform 0.15s ease";
          elA.style.transform = `translate(${dx}px, ${dy}px)`;
          elB.style.transform = `translate(${-dx}px, ${-dy}px)`;
          setTimeout(() => {
            elA.style.transition = "none";
            elB.style.transition = "none";
            elA.style.transform = "";
            elB.style.transform = "";
          }, 160);
        };

        if (statusBanner) statusBanner.textContent = `⚡ ${t("msg_shuffling")} (${secondsLeft}s)`;
        let tick = 0;
        activeShuffleInterval = setInterval(async () => {
          tick++;
          doFastSwap();
          if (tick % 5 === 0) {
            secondsLeft--;
            if (statusBanner) statusBanner.textContent = `⚡ ${t("msg_shuffling")} (${secondsLeft}s)`;
          }
          if (secondsLeft <= 0) {
            clearInterval(activeShuffleInterval);
            activeShuffleInterval = null;
            if (currentRole === "p1" && db) {
              await db.ref(`duels/${room.code}`).update({ cards: cardsOrder, status: "playing", turn: "p1" });
            }
          }
        }, 200);
      }
    }, 1000);
  }

  function renderOnlineRoomState(room) {
    const p1Lbl = document.getElementById("p1NameLabel");
    const p2Lbl = document.getElementById("p2NameLabel");
    if (p1Lbl) p1Lbl.textContent = room.p1?.name || "P1";
    if (p2Lbl) p2Lbl.textContent = room.p2?.name || t("msg_waiting_opp");

    const modeTags = {
      safe: "🛡️ " + t("mode_safe_title"),
      stake_gems: "💎 " + t("mode_gems_title"),
      stake_card: "🔥 " + t("mode_card_title"),
      challenge_card: `🎟️ ${t("ch_cards_title")} (${room.challengeTier || ""})`
    };
    const tagEl = document.getElementById("activeDuelModeTag");
    if (tagEl) tagEl.textContent = modeTags[room.duelType] || "⚔️";

    const stakeText =
      room.duelType === "stake_gems"
        ? `${room.gemsStake || 30} 💎`
        : room.duelType === "safe" && room.goldStake > 0
        ? `${fmtCompact(room.goldStake)} 🪙`
        : room.duelType === "challenge_card"
        ? `🎟️ ${room.challengeTier || ""}`
        : "✓";

    const p1S = document.getElementById("p1StakeLabel");
    const p2S = document.getElementById("p2StakeLabel");
    if (p1S) p1S.textContent = room.p1?.stakeCard ? `${room.p1.stakeCard.name} (${room.p1.stakeCard.rarity})` : stakeText;
    if (p2S) p2S.textContent = room.p2 ? (room.p2.stakeCard ? `${room.p2.stakeCard.name} (${room.p2.stakeCard.rarity})` : stakeText) : "---";

    const consentBar = document.getElementById("mutualConsentBar");
    const statusBanner = document.getElementById("onlineDuelStatus");

    if (room.status === "waiting") {
      onlinePreviewStartedFor = null;
      consentBar?.classList.add("hidden");
      if (statusBanner) statusBanner.textContent = `${t("lbl_room_code")}: ${room.code} — ${t("msg_waiting_opp")}`;
      renderOnlineBoard(room, false);
      return;
    }

    if (room.status === "consent") {
      onlinePreviewStartedFor = null;
      consentBar?.classList.remove("hidden");
      if (statusBanner) statusBanner.textContent = t("consent_warn");
      if (room.p1?.consent && room.p2?.consent && currentRole === "p1" && db) {
        db.ref(`duels/${room.code}/status`).set("preview");
      }
      renderOnlineBoard(room, false);
      return;
    }

    consentBar?.classList.add("hidden");
    if (room.status === "preview") {
      startOnlineVisibleShuffle(room);
      return;
    }
    if (room.status === "playing") {
      if (statusBanner) statusBanner.textContent = room.turn === currentRole ? t("msg_your_turn") : t("msg_opp_turn");
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
    const frag = document.createDocumentFragment();

    (room.cards || []).forEach((card, idx) => {
      const owner = pickedArr[idx] || "";
      const showFace = revealAll || owner !== "";
      const slot = document.createElement("div");
      slot.className = "duel-slot";
      const borderCls = owner === currentRole ? " picked-me" : owner !== "" ? " picked-opp" : "";
      const fallback = makeFallbackSvg(card.name, card.rarity);
      slot.innerHTML = showFace
        ? `<div class="duel-card-inner${borderCls}"><img src="${card.image}" alt="${card.name}" decoding="async" onerror="this.onerror=null;this.src='${fallback}'" /><span class="card-rarity-pill r-${card.rarity}">${card.rarity}</span><div class="card-bottom-label">${card.name}</div></div>`
        : `<div class="duel-card-inner face-down"></div>`;
      slot.addEventListener("click", () => handleOnlineCardPick(room, idx));
      frag.appendChild(slot);
    });
    board.appendChild(frag);
  }

  async function handleOnlineCardPick(room, idx) {
    if (room.status !== "playing" || room.turn !== currentRole || !db) return;
    const picked = [...(room.picked || ["", "", "", "", "", ""])];
    if (picked[idx]) return;
    playSfx("click");
    picked[idx] = currentRole;

    const p1c = picked.filter((x) => x === "p1").length;
    const p2c = picked.filter((x) => x === "p2").length;
    if (p1c + p2c === 6) {
      await db.ref(`duels/${room.code}`).update({ picked, status: "finished" });
      return;
    }

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
    let p1Score = 0;
    let p2Score = 0;
    (room.cards || []).forEach((c, i) => {
      const p = RANK_POWER[c.rarity] || 1;
      if (picked[i] === "p1") p1Score += p;
      else if (picked[i] === "p2") p2Score += p;
    });

    const winnerRole = p1Score >= p2Score ? "p1" : "p2";
    const iWon = winnerRole === currentRole;
    const statusBanner = document.getElementById("onlineDuelStatus");
    const gStake = Number(room.goldStake) || 0;
    const gemStake = Number(room.gemsStake) || 30;
    const oppName = currentRole === "p1" ? room.p2?.name || "P2" : room.p1?.name || "P1";

    if (iWon) {
      state.trophies += 25;
      state.gold += 300 + (room.duelType === "safe" ? gStake : 0);
      state.gems += 5;
      trackProgress("duels", 1);

      if (room.duelType === "stake_gems") {
        state.gems += gemStake;
      } else if (room.duelType === "stake_card" || (room.duelType === "challenge_card" && currentRole === "p1")) {
        const wonCard = currentRole === "p1" ? room.p2?.stakeCard : room.p1?.stakeCard;
        if (wonCard) {
          wonCard.acquiredAt = Date.now();
          state.inventory.push(wonCard);
          state.shieldUntil = Date.now() + DAY_MS;
          if (db && navigator.onLine && wonCard.charId && wonCard.serial) {
            await db.ref(`limitedCards/${wonCard.charId}/owners/${wonCard.serial}`).set({
              uid: state.uid,
              name: state.name,
              claimedAt: Date.now(),
              lastActiveAt: Date.now()
            }).catch(() => {});
          }
          showToast(`👑 +${wonCard.name}`);
        }
      } else if (room.duelType === "challenge_card" && currentRole === "p2") {
        // المدافع نجح في حماية بطاقته النادرة
        state.gems += 20;
        state.shieldUntil = Date.now() + DAY_MS;
      }

      pushInboxLog(`🏆 ${t("msg_win")} vs ${oppName} (${p1Score}-${p2Score})`);
      playSfx("win");
      if (statusBanner) statusBanner.textContent = `${t("msg_win")} (${p1Score} - ${p2Score}) +25 🏆`;
    } else {
      state.trophies = Math.max(0, state.trophies - 10);
      if (room.duelType === "safe" && gStake > 0) {
        state.gold = Math.max(0, state.gold - gStake);
      } else if (room.duelType === "stake_gems") {
        state.gems = Math.max(0, state.gems - gemStake);
      } else if (room.duelType === "stake_card" || (room.duelType === "challenge_card" && currentRole === "p2")) {
        const lostCard = currentRole === "p1" ? room.p1?.stakeCard : room.p2?.stakeCard;
        if (lostCard) {
          state.inventory = state.inventory.filter(
            (c) => c.uidCard !== lostCard.uidCard && !(Number(c.charId) === Number(lostCard.charId) && Number(c.serial || 1) === Number(lostCard.serial || 1))
          );
          if (db && navigator.onLine && lostCard.charId && lostCard.serial) {
            const snap = await db.ref(`limitedCards/${lostCard.charId}/owners/${lostCard.serial}`).get();
            if (snap.exists() && snap.val()?.uid === state.uid) {
              await db.ref(`limitedCards/${lostCard.charId}/owners/${lostCard.serial}`).remove().catch(() => {});
            }
          }
        }
      }
      pushInboxLog(`❌ ${t("msg_lose")} vs ${oppName} (${p1Score}-${p2Score})`);
      if (statusBanner) statusBanner.textContent = `${t("msg_lose")} (${p1Score} - ${p2Score})`;
    }

    normalizeAndDedupeInventory(false);
    flushSaveNow();
    updateHud();
    renderInventory(true);
    renderCodex();
    populateMyStakeCardsRow();
  }

  /* --- البحث التلقائي السريع (Quick Match) بمهلة 35 ثانية --- */
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
    btn.setAttribute("data-i18n", "btn_quick_match");
    btn.style.cssText = "border-color:rgba(56,189,248,0.55);background:linear-gradient(135deg,#0f2942,#163859);color:#e0f2fe;font-weight:800;";
    btn.textContent = t("btn_quick_match");

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
    if (quickMatchTimer) { clearTimeout(quickMatchTimer); quickMatchTimer = null; }
    if (quickMatchPollRef) { quickMatchPollRef.off(); quickMatchPollRef = null; }
    if (removeQueueRoom && quickMatchQueueCode && db) {
      db.ref(`duels/${quickMatchQueueCode}`).remove().catch(() => {});
    }
    quickMatchQueueCode = null;

    const btn = document.getElementById("btnQuickMatch");
    const statusEl = document.getElementById("quickMatchStatus");
    if (btn) btn.textContent = t("btn_quick_match");
    if (statusEl) {
      statusEl.classList.add("hidden");
      statusEl.textContent = "";
    }
  }

  async function startOrCancelQuickMatch() {
    if (quickMatchQueueCode) {
      stopQuickMatchSearch(true);
      showToast("✖️");
      return;
    }

    if (!db || !navigator.onLine) return showToast("⚠️ Offline!");
    if (characterCatalog.size < 6) {
      await ensureRichCatalog();
      if (characterCatalog.size < 6) return showToast("⏳ Loading heroes...");
    }

    const mode = selectedDuelMode || "safe";
    const goldStake = mode === "safe"
      ? Math.max(0, Math.floor(Number(document.getElementById("inputGoldStake")?.value) || 0))
      : 0;
    const gemsStake = mode === "stake_gems" ? (selectedGemsStake || 30) : 0;

    if (mode === "safe" && goldStake > 0 && state.gold < goldStake) return showToast(t("msg_no_gold"));
    if (mode === "stake_gems" && state.gems < gemsStake) return showToast(t("msg_no_gems"));

    const btn = document.getElementById("btnQuickMatch");
    const statusEl = document.getElementById("quickMatchStatus");
    if (btn) btn.textContent = t("btn_cancel_qm");
    if (statusEl) {
      statusEl.classList.remove("hidden");
      statusEl.textContent = `🔎 ${t("msg_waiting_opp")}`;
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
          if (isOpen && sameMode && sameGold && sameGems) matchedRoom = r;
        });
      }

      if (matchedRoom) {
        stopQuickMatchSearch(false);
        const inp = document.getElementById("inputRoomCode");
        if (inp) inp.value = matchedRoom.code;
        await joinOnlineRoom(matchedRoom.code);
        return;
      }

      const code = String(Math.floor(1000 + Math.random() * 9000));
      const boardCards = pickSixUniqueRarityCards().map((c) => ({
        id: c.id, name: c.name, image: c.image, rarity: c.rarity
      }));
      const stakeCard = mode === "stake_card"
        ? (state.inventory.find((c) => c.uidCard === selectedStakeCardUid) || null)
        : null;
      if (mode === "stake_card" && !stakeCard) {
        stopQuickMatchSearch(false);
        return showToast(t("msg_no_rares_stake"));
      }

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
        p1: { uid: state.uid, name: state.name, consent: false, stakeCard },
        p2: null,
        createdAt: Date.now()
      });

      quickMatchQueueCode = code;
      if (statusEl) statusEl.textContent = `⏳ ${t("lbl_room_code")}: ${code} — ${t("msg_waiting_opp")}`;

      quickMatchPollRef = db.ref(`duels/${code}/p2`);
      quickMatchPollRef.on("value", (p2Snap) => {
        if (!quickMatchQueueCode || code !== quickMatchQueueCode) return;
        if (p2Snap.exists() && p2Snap.val()?.uid) {
          const joinedCode = quickMatchQueueCode;
          stopQuickMatchSearch(false);
          attachToRoom(joinedCode, "p1");
        }
      });

      quickMatchTimer = setTimeout(() => {
        if (quickMatchQueueCode === code) {
          stopQuickMatchSearch(true);
          showToast("⌛ 35s — " + t("msg_waiting_opp"));
        }
      }, 35000);
    } catch (_) {
      stopQuickMatchSearch(true);
      showToast("⚠️ Quick Match error");
    }
  }
  /* === نهاية الجزء 7 من 8 (الصق الجزء 8 مباشرة هنا) === */
  /* =========================================================
     14. المركز الملكي (المهام اليومية + الألبومات + الرتب والإنجازات + صندوق الوارد)
  ========================================================= */
  const DAILY_STREAK_REWARDS = [
    { day: 1, gold: 250, gems: 5, dust: 15 },
    { day: 2, gold: 400, gems: 8, dust: 20 },
    { day: 3, gold: 650, gems: 12, dust: 25 },
    { day: 4, gold: 900, gems: 18, dust: 35 },
    { day: 5, gold: 1300, gems: 25, dust: 45 },
    { day: 6, gold: 1800, gems: 35, dust: 60 },
    { day: 7, gold: 3500, gems: 75, dust: 120, chCard: "SSR" }
  ];

  const DAILY_MISSIONS = [
    { id: "m_packs", stat: "packs", target: 5, gold: 400, gems: 10, dust: 20 },
    { id: "m_duels", stat: "duels", target: 3, gold: 500, gems: 15, dust: 25 },
    { id: "m_trivia", stat: "trivia", target: 5, gold: 450, gems: 12, dust: 20 },
    { id: "m_shadow", stat: "shadow", target: 3, gold: 450, gems: 12, dust: 20 }
  ];

  const COLLECTION_MILESTONES = [
    { id: "col_25", target: 25, gems: 25, gold: 500, title: "Hunter" },
    { id: "col_50", target: 50, gems: 60, gold: 1200, title: "Collector" },
    { id: "col_100", target: 100, gems: 140, gold: 3000, title: "Grandmaster" },
    { id: "col_250", target: 250, gems: 320, gold: 8000, title: "Legend" },
    { id: "col_500", target: 500, gems: 700, gold: 20000, title: "Monarch" }
  ];

  function unlockTitle(titleName) {
    if (!titleName) return;
    ensureStateIntegrity();
    if (!state.unlockedTitles.includes(titleName)) {
      state.unlockedTitles.push(titleName);
    }
  }

  function buildAnimeAlbumsList() {
    const ownedIds = new Set(state.inventory.map((c) => Number(c.charId || c.id)));
    const byAnime = new Map();

    characterCatalog.forEach((ch) => {
      const anime = String(ch.anime || "").trim();
      if (!anime || anime === "Anime Legend") return;
      let entry = byAnime.get(anime);
      if (!entry) {
        entry = { anime, total: 0, owned: 0, topFav: 0, cover: ch.image || "" };
        byAnime.set(anime, entry);
      }
      entry.total += 1;
      if (ownedIds.has(Number(ch.id))) entry.owned += 1;
      if (Number(ch.favorites || 0) > entry.topFav) {
        entry.topFav = Number(ch.favorites || 0);
        entry.cover = ch.image || entry.cover;
      }
    });

    return Array.from(byAnime.values())
      .filter((a) => a.total >= 4)
      .sort((a, b) => (b.owned / b.total - a.owned / a.total) || (b.topFav - a.topFav))
      .slice(0, 20);
  }

  function countHubNotifications() {
    ensureStateIntegrity();
    let count = 0;
    const today = getTodayKey();

    if (state.daily.lastStreakDate !== today) count++;
    DAILY_MISSIONS.forEach((m) => {
      const val = Number(state.daily.progress[m.stat] || 0);
      if (val >= m.target && !state.daily.claimed[m.id]) count++;
    });
    TROPHY_RANKS.forEach((rk) => {
      if (rk.rewardGems > 0 && state.trophies >= rk.min && !state.ranksClaimed[rk.id]) count++;
    });
    COLLECTION_MILESTONES.forEach((cm) => {
      if (state.inventory.length >= cm.target && !state.achClaimed[cm.id]) count++;
    });
    count += incomingChallengesCache.length;
    return count;
  }

  function refreshRoyalFabBadge() {
    const dot = document.getElementById("royalFabDot");
    if (!dot) return;
    const n = countHubNotifications();
    dot.textContent = n > 99 ? "99+" : String(n);
    dot.style.display = n > 0 ? "flex" : "none";
  }

  function injectRoyalHubFab() {
    if (document.getElementById("royalFabBtn")) return;
    const btn = document.createElement("button");
    btn.id = "royalFabBtn";
    btn.type = "button";
    btn.className = "mpro-fab";
    btn.innerHTML = `<span>👑</span><span id="royalFabDot" class="mpro-fab-dot" style="display:none;">0</span>`;
    btn.addEventListener("click", () => {
      playSfx("click");
      openRoyalHubModal("daily");
    });
    document.body.appendChild(btn);
    refreshRoyalFabBadge();
  }

  function openRoyalHubModal(initialTab = "daily") {
    ensureStateIntegrity();
    document.getElementById("royalHubModal")?.remove();
    let activeTab = initialTab;

    const overlay = document.createElement("div");
    overlay.id = "royalHubModal";
    overlay.className = "mpro-overlay";
    document.body.appendChild(overlay);

    const draw = () => {
      const inboxCount = incomingChallengesCache.length;
      overlay.innerHTML = `
        <div class="mpro-box">
          <div class="mpro-head">
            <h3 style="margin:0;font-size:1rem;color:#fbbf24;">${t("hub_title")}</h3>
            <button type="button" class="mpro-close" id="btnCloseRoyalHub">✕</button>
          </div>
          <div class="mpro-tabs">
            <button type="button" class="mpro-tab${activeTab === "daily" ? " active" : ""}" data-htab="daily">${t("hub_daily")}</button>
            <button type="button" class="mpro-tab${activeTab === "albums" ? " active" : ""}" data-htab="albums">${t("hub_albums")}</button>
            <button type="button" class="mpro-tab${activeTab === "ranks" ? " active" : ""}" data-htab="ranks">${t("hub_ranks")}</button>
            <button type="button" class="mpro-tab${activeTab === "inbox" ? " active" : ""}" data-htab="inbox">${t("hub_inbox")}${inboxCount ? ` (${inboxCount})` : ""}</button>
          </div>
          <div class="mpro-scroll" id="royalHubBody"></div>
        </div>
      `;

      overlay.querySelector("#btnCloseRoyalHub").onclick = () => overlay.remove();
      overlay.onclick = (e) => { if (e.target === overlay) overlay.remove(); };
      overlay.querySelectorAll("[data-htab]").forEach((b) => {
        b.onclick = () => { activeTab = b.dataset.htab; draw(); };
      });

      const body = overlay.querySelector("#royalHubBody");
      if (activeTab === "daily") renderHubDaily(body, draw);
      else if (activeTab === "albums") renderHubAlbums(body, draw);
      else if (activeTab === "ranks") renderHubRanks(body, draw);
      else renderHubInbox(body, draw);
      refreshRoyalFabBadge();
    };

    draw();
  }

  function renderHubDaily(body, redraw) {
    const today = getTodayKey();
    const canClaimToday = state.daily.lastStreakDate !== today;
    const currentDay = Math.min(7, (Number(state.daily.streak || 0) % 7) + (canClaimToday ? 1 : 0)) || 1;
    const claimedDays = canClaimToday ? (Number(state.daily.streak || 0) % 7) : ((Number(state.daily.streak || 0) - 1) % 7) + 1;

    const streakHtml = `
      <div class="mpro-card" style="border-color:rgba(245,158,11,0.4);">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
          <b style="color:#fbbf24;font-size:0.88rem;">${t("daily_streak")}</b>
          <button type="button" id="btnClaimDailyStreak" class="mpro-btn" ${canClaimToday ? "" : "disabled"}>
            ${canClaimToday ? `${t("daily_claim")} (D${currentDay})` : t("daily_claimed")}
          </button>
        </div>
        <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:4px;">
          ${DAILY_STREAK_REWARDS.map((r) => {
            const done = r.day <= claimedDays;
            const isNext = canClaimToday && r.day === currentDay;
            return `
              <div style="text-align:center;padding:5px 2px;border-radius:8px;font-size:0.66rem;border:1px solid ${isNext ? "#fbbf24" : done ? "#22c55e" : "#334155"};background:${done ? "rgba(34,197,94,0.18)" : isNext ? "rgba(245,158,11,0.22)" : "#0f172a"};">
                <div style="font-weight:900;color:${done ? "#4ade80" : "#fff"};">D${r.day}</div>
                <div style="color:#38bdf8;">${r.gems}💎</div>
                ${r.chCard ? `<div style="color:#f472b6;">⚔️</div>` : `<div style="color:#fbbf24;">${fmtCompact(r.gold)}</div>`}
              </div>
            `;
          }).join("")}
        </div>
      </div>
    `;

    const missionsHtml = DAILY_MISSIONS.map((m) => {
      const cur = Math.min(m.target, Number(state.daily.progress[m.stat] || 0));
      const pct = Math.round((cur / m.target) * 100);
      const claimed = Boolean(state.daily.claimed[m.id]);
      const ready = cur >= m.target && !claimed;
      return `
        <div class="mpro-card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
            <div>
              <div style="font-weight:800;font-size:0.84rem;">${t(m.id)}</div>
              <div style="font-size:0.72rem;color:#94a3b8;margin-top:2px;">
                +${m.gold} 🪙 | +${m.gems} 💎 | +${m.dust} ✨ (${cur}/${m.target})
              </div>
            </div>
            <button type="button" class="mpro-btn" data-mclaim="${m.id}" ${ready ? "" : "disabled"}>
              ${claimed ? t("daily_claimed") : t("daily_claim")}
            </button>
          </div>
          <div class="mpro-bar-track"><div class="mpro-bar-fill" style="width:${pct}%;"></div></div>
        </div>
      `;
    }).join("");

    body.innerHTML = streakHtml + missionsHtml;

    body.querySelector("#btnClaimDailyStreak")?.addEventListener("click", () => {
      if (state.daily.lastStreakDate === today) return;
      const rw = DAILY_STREAK_REWARDS[currentDay - 1] || DAILY_STREAK_REWARDS[0];
      state.daily.lastStreakDate = today;
      state.daily.streak = Number(state.daily.streak || 0) + 1;
      state.gold += rw.gold;
      state.gems += rw.gems;
      state.dust += rw.dust;
      if (rw.chCard) state.challengeCards[rw.chCard] = Number(state.challengeCards[rw.chCard] || 0) + 1;
      flushSaveNow();
      updateHud();
      renderShop();
      playSfx("win");
      showToast(`🎁 +${rw.gold} 🪙 | +${rw.gems} 💎${rw.chCard ? ` | +1 ${rw.chCard} ⚔️` : ""}`);
      redraw();
    });

    body.querySelectorAll("[data-mclaim]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const m = DAILY_MISSIONS.find((x) => x.id === btn.dataset.mclaim);
        if (!m || state.daily.claimed[m.id]) return;
        if (Number(state.daily.progress[m.stat] || 0) < m.target) return;
        state.daily.claimed[m.id] = true;
        state.gold += m.gold;
        state.gems += m.gems;
        state.dust += m.dust;
        flushSaveNow();
        updateHud();
        renderShop();
        playSfx("win");
        showToast(`✅ +${m.gold} 🪙 | +${m.gems} 💎 | +${m.dust} ✨`);
        redraw();
      });
    });
  }

  function renderHubAlbums(body, redraw) {
    const albums = buildAnimeAlbumsList();
    if (!albums.length) {
      body.innerHTML = `<p class="muted-text" style="text-align:center;padding:24px;">⏳ Loading...</p>`;
      return;
    }

    body.innerHTML = albums.map((al) => {
      const pct = Math.round((al.owned / al.total) * 100);
      const claimed = Boolean(state.albumsClaimed[al.anime]);
      const rewardGems = Math.min(200, Math.max(25, al.total * 6));
      const ready = al.owned >= al.total && !claimed;
      const fb = makeFallbackSvg(al.anime, "SR");
      return `
        <div class="mpro-card" style="display:flex;align-items:center;gap:10px;">
          <img class="mpro-img" src="${al.cover}" alt="" onerror="this.onerror=null;this.src='${fb}'" style="width:46px;height:56px;object-fit:cover;border-radius:8px;flex-shrink:0;" />
          <div style="flex:1;min-width:0;">
            <div style="font-weight:800;font-size:0.83rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${al.anime}</div>
            <div style="font-size:0.72rem;color:#94a3b8;">${al.owned}/${al.total} (${pct}%) • 💎 +${rewardGems}</div>
            <div class="mpro-bar-track"><div class="mpro-bar-fill" style="width:${pct}%;"></div></div>
          </div>
          <button type="button" class="mpro-btn" data-alclaim="${encodeURIComponent(al.anime)}" data-algems="${rewardGems}" ${ready ? "" : "disabled"}>
            ${claimed ? t("daily_claimed") : t("daily_claim")}
          </button>
        </div>
      `;
    }).join("");

    body.querySelectorAll("[data-alclaim]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const animeName = decodeURIComponent(btn.dataset.alclaim);
        const gems = Number(btn.dataset.algems || 30);
        if (state.albumsClaimed[animeName]) return;
        state.albumsClaimed[animeName] = true;
        state.gems += gems;
        unlockTitle(`${animeName.slice(0, 14)} Fan`);
        flushSaveNow();
        updateHud();
        playSfx("win");
        showToast(`📚 +${gems} 💎`);
        redraw();
      });
    });
  }

  function renderHubRanks(body, redraw) {
    const curRank = getRankByTrophies(state.trophies);
    const rankCards = TROPHY_RANKS.map((rk) => {
      const unlocked = state.trophies >= rk.min;
      const claimed = Boolean(state.ranksClaimed[rk.id]);
      const ready = unlocked && rk.rewardGems > 0 && !claimed;
      return `
        <div class="mpro-card" style="display:flex;justify-content:space-between;align-items:center;gap:8px;border-color:${curRank.id === rk.id ? "#fbbf24" : "rgba(148,163,184,0.22)"};">
          <div>
            <div style="font-weight:900;font-size:0.88rem;">${rk.icon} ${t("rank_" + rk.id)}</div>
            <div style="font-size:0.73rem;color:#94a3b8;">🏆 ${rk.min}+ ${rk.rewardGems ? `• 💎 +${rk.rewardGems}` : ""}</div>
          </div>
          ${
            rk.rewardGems > 0
              ? `<button type="button" class="mpro-btn" data-rkclaim="${rk.id}" ${ready ? "" : "disabled"}>${claimed ? t("daily_claimed") : t("daily_claim")}</button>`
              : `<span class="status-badge">✓</span>`
          }
        </div>
      `;
    }).join("");

    const achCards = COLLECTION_MILESTONES.map((cm) => {
      const cur = Math.min(cm.target, state.inventory.length);
      const pct = Math.round((cur / cm.target) * 100);
      const claimed = Boolean(state.achClaimed[cm.id]);
      const ready = state.inventory.length >= cm.target && !claimed;
      return `
        <div class="mpro-card">
          <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
            <div>
              <div style="font-weight:800;font-size:0.84rem;">🎴 ${cm.target} Cards — 🏷️ ${cm.title}</div>
              <div style="font-size:0.72rem;color:#94a3b8;">+${cm.gems} 💎 | +${fmtCompact(cm.gold)} 🪙 (${cur}/${cm.target})</div>
            </div>
            <button type="button" class="mpro-btn" data-achclaim="${cm.id}" ${ready ? "" : "disabled"}>
              ${claimed ? t("daily_claimed") : t("daily_claim")}
            </button>
          </div>
          <div class="mpro-bar-track"><div class="mpro-bar-fill" style="width:${pct}%;"></div></div>
        </div>
      `;
    }).join("");

    body.innerHTML = rankCards + achCards;

    body.querySelectorAll("[data-rkclaim]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const rk = TROPHY_RANKS.find((x) => x.id === btn.dataset.rkclaim);
        if (!rk || state.trophies < rk.min || state.ranksClaimed[rk.id]) return;
        state.ranksClaimed[rk.id] = true;
        state.gems += rk.rewardGems;
        unlockTitle(t("rank_" + rk.id));
        flushSaveNow();
        updateHud();
        playSfx("win");
        showToast(`${rk.icon} +${rk.rewardGems} 💎`);
        redraw();
      });
    });

    body.querySelectorAll("[data-achclaim]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const cm = COLLECTION_MILESTONES.find((x) => x.id === btn.dataset.achclaim);
        if (!cm || state.inventory.length < cm.target || state.achClaimed[cm.id]) return;
        state.achClaimed[cm.id] = true;
        state.gems += cm.gems;
        state.gold += cm.gold;
        unlockTitle(cm.title);
        flushSaveNow();
        updateHud();
        playSfx("win");
        showToast(`🏅 +${cm.gems} 💎 | +${fmtCompact(cm.gold)} 🪙`);
        redraw();
      });
    });
  }

  function renderHubInbox(body, redraw) {
    const pendingHtml = incomingChallengesCache.length
      ? incomingChallengesCache.map((ch, idx) => {
          const isChCard = ch.kind === "challenge_card";
          const pen = ch.penaltyGems || REFUSE_PENALTY[ch.rarity] || 100;
          return `
            <div class="mpro-card" style="border-color:rgba(239,68,68,0.5);">
              <div style="font-weight:800;font-size:0.86rem;color:#fca5a5;">⚔️ ${ch.fromName}</div>
              <div style="font-size:0.78rem;color:#fff;margin:4px 0;">${ch.charName} (${ch.rarity} #${ch.slot})</div>
              <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:8px;">
                <button type="button" class="mpro-btn" data-inb-acc="${idx}">${t("btn_accept")}</button>
                <button type="button" class="danger-btn-sm" data-inb-dec="${idx}">${isChCard ? `${t("ch_cards_refuse_pay")} ${pen}💎` : t("btn_reject")}</button>
              </div>
            </div>
          `;
        }).join("")
      : `<div class="mpro-card" style="text-align:center;color:#94a3b8;font-size:0.82rem;">🔔 0</div>`;

    const historyHtml = (state.inboxHistory || []).slice(0, 12).map((h) => `
      <div class="mpro-card" style="padding:8px 10px;font-size:0.76rem;display:flex;justify-content:space-between;gap:8px;">
        <span>${h.text}</span>
        <span style="color:#64748b;white-space:nowrap;">${new Date(h.at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
      </div>
    `).join("");

    body.innerHTML = pendingHtml + historyHtml;

    body.querySelectorAll("[data-inb-acc]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const ch = incomingChallengesCache[Number(btn.dataset.inbAcc)];
        if (!ch) return;
        document.getElementById("royalHubModal")?.remove();
        if (db) await db.ref(`challenges/${state.uid}/${ch.id}/status`).set("accepted").catch(() => {});
        switchMainTab("viewOnline");
        switchOnlineSubTab("lobby");
        joinOnlineRoom(ch.roomCode);
      });
    });

    body.querySelectorAll("[data-inb-dec]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const ch = incomingChallengesCache[Number(btn.dataset.inbDec)];
        if (!ch) return;
        await handleChallengeDecline(ch);
        redraw();
      });
    });
  }

  /* =========================================================
     15. لوحة المزامنة السحابية والبروفايل داخل الإعدادات + الجولة التعريفية السريعة
  ========================================================= */
  function renderSettingsProPanel() {
    const modal = document.getElementById("settingsModal");
    if (!modal) return;
    const container = modal.querySelector(".modal-body, .modal-card, .modal-content") || modal.firstElementChild;
    if (!container) return;

    let panel = document.getElementById("settingsCloudProfilePanel");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "settingsCloudProfilePanel";
      panel.style.cssText = "margin-top:14px;padding-top:12px;border-top:1px solid rgba(148,163,184,0.25);display:flex;flex-direction:column;gap:10px;";
      container.appendChild(panel);
    }

    const titles = ["", ...(state.unlockedTitles || [])];
    const ownedSample = state.inventory.slice(0, 12);

    panel.innerHTML = `
      <div class="mpro-card" style="margin:0;">
        <div style="font-weight:800;font-size:0.86rem;color:#38bdf8;margin-bottom:6px;">${t("cloud_title")}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:6px;background:#020617;padding:7px 10px;border-radius:8px;margin-bottom:8px;">
          <span style="font-size:0.74rem;color:#94a3b8;">${t("cloud_code")}</span>
          <b id="cloudCodeVal" style="color:#fbbf24;font-size:0.82rem;direction:ltr;">${state.syncCode}</b>
        </div>
        <button type="button" id="btnCloudBackupNow" class="mpro-btn" style="width:100%;margin-bottom:8px;">${t("cloud_save")}</button>
        <div style="display:flex;gap:6px;">
          <input id="inpCloudRestoreCode" type="text" placeholder="${t("cloud_ph")}" style="flex:1;padding:7px 9px;border-radius:8px;border:1px solid #334155;background:#020617;color:#fff;font-size:0.78rem;direction:ltr;" />
          <button type="button" id="btnCloudRestoreNow" class="secondary-btn" style="padding:7px 11px;font-size:0.78rem;">${t("cloud_restore")}</button>
        </div>
      </div>

      <div class="mpro-card" style="margin:0;">
        <div style="font-weight:800;font-size:0.86rem;color:#fbbf24;margin-bottom:6px;">${t("profile_avatar")}</div>
        <select id="selProfileTitle" class="inv-sort-select" style="width:100%;margin-bottom:8px;">
          ${titles.map((tl) => `<option value="${tl}" ${state.title === tl ? "selected" : ""}>${tl ? "🏷️ " + tl : "---"}</option>`).join("")}
        </select>
        ${
          ownedSample.length
            ? `<div style="display:flex;gap:6px;overflow-x:auto;padding-bottom:4px;">
                ${ownedSample.map((c) => `
                  <img src="${c.image}" data-pick-av="${c.image}" alt="" style="width:42px;height:42px;border-radius:50%;object-fit:cover;flex-shrink:0;cursor:pointer;border:2px solid ${state.avatar === c.image ? "#fbbf24" : "#334155"};" />
                `).join("")}
              </div>`
            : ""
        }
      </div>
    `;

    panel.querySelector("#cloudCodeVal").onclick = () => {
      try { navigator.clipboard?.writeText(state.syncCode); } catch (_) {}
      showToast(`📋 ${state.syncCode}`);
    };
    panel.querySelector("#btnCloudBackupNow").onclick = () => backupAccountToCloud(true);
    panel.querySelector("#btnCloudRestoreNow").onclick = () => {
      const val = panel.querySelector("#inpCloudRestoreCode").value;
      restoreAccountFromCloud(val);
    };
    panel.querySelector("#selProfileTitle").onchange = (e) => {
      state.title = e.target.value;
      flushSaveNow();
      updateHud();
      showToast(t("msg_saved"));
    };
    panel.querySelectorAll("[data-pick-av]").forEach((img) => {
      img.onclick = () => {
        state.avatar = img.dataset.pickAv;
        flushSaveNow();
        updateHud();
        renderSettingsProPanel();
        showToast(`🖼️ ${t("msg_saved")}`);
      };
    });
  }

  function showQuickOnboardingIfFirstTime() {
    ensureStateIntegrity();
    if (state.tutorialDone) return;
    document.getElementById("monarchTutModal")?.remove();

    const slides = [
      { icon: "👑", title: t("tut_1_t"), desc: t("tut_1_d") },
      { icon: "⚔️", title: t("tut_2_t"), desc: t("tut_2_d") },
      { icon: "🎁", title: t("tut_3_t"), desc: t("tut_3_d") }
    ];
    let step = 0;

    const overlay = document.createElement("div");
    overlay.id = "monarchTutModal";
    overlay.className = "mpro-overlay";
    document.body.appendChild(overlay);

    const draw = () => {
      const s = slides[step];
      const isLast = step === slides.length - 1;
      overlay.innerHTML = `
        <div class="mpro-box" style="max-width:340px;text-align:center;border-color:#fbbf24;">
          <div style="font-size:2.6rem;margin-bottom:8px;">${s.icon}</div>
          <h3 style="margin:0 0 8px;color:#fbbf24;font-size:1.05rem;">${s.title}</h3>
          <p style="margin:0 0 14px;color:#cbd5e1;font-size:0.84rem;line-height:1.5;">${s.desc}</p>
          <div style="display:flex;justify-content:center;gap:6px;margin-bottom:14px;">
            ${slides.map((_, i) => `<span style="width:8px;height:8px;border-radius:50%;background:${i === step ? "#fbbf24" : "#334155"};"></span>`).join("")}
          </div>
          <button type="button" id="btnTutNext" class="primary-btn" style="width:100%;">
            ${isLast ? t("tut_done") : t("tut_next")}
          </button>
        </div>
      `;
      overlay.querySelector("#btnTutNext").onclick = () => {
        playSfx("click");
        if (isLast) {
          state.tutorialDone = true;
          saveState();
          overlay.remove();
        } else {
          step++;
          draw();
        }
      };
    };

    draw();
  }

  /* =========================================================
     16. التنقل، ربط جميع الأحداث، والتشغيل النهائي
  ========================================================= */
  function switchMainTab(tabId) {
    stopPopTimer();
    stopShadowTimer();
    document.querySelectorAll(".tab-view").forEach((v) => v.classList.remove("active"));
    document.querySelectorAll(".nav-btn").forEach((b) => b.classList.remove("active"));
    document.getElementById(tabId)?.classList.add("active");
    document.querySelector(`.nav-btn[data-tab="${tabId}"]`)?.classList.add("active");

    if (tabId === "viewCards") renderInventory(false);
    if (tabId === "viewCodex") renderCodex();
    if (tabId === "viewShop") renderShop();
    if (tabId === "viewOnline") populateMyStakeCardsRow();
    if (tabId === "viewArena") {
      if (document.getElementById("soloPopPane")?.classList.contains("active")) renderPopularityGame();
      if (document.getElementById("soloShadowPane")?.classList.contains("active")) loadNextShadowQuestion();
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
    if (topChars.length) bg.innerHTML = topChars.map((c) => `<img src="${c.image}" alt="" decoding="async" />`).join("");
  }

  function bindAllEvents() {
    document.getElementById("btnStartGame")?.addEventListener("click", () => {
      document.getElementById("startScreen")?.classList.add("hidden");
      document.getElementById("appShell")?.classList.remove("hidden");
      updateBgmPlayback();
      syncPlayerToCloud();
      ensureRichCatalog();
      setTimeout(showQuickOnboardingIfFirstTime, 450);
    });

    document.querySelectorAll(".lang-chip").forEach((c) => {
      c.addEventListener("click", () => applyLanguage(c.dataset.lang));
    });
    document.querySelectorAll(".nav-btn").forEach((b) => {
      b.addEventListener("click", () => switchMainTab(b.dataset.tab));
    });

    document.querySelectorAll("#viewArena .sub-tab").forEach((btn) => {
      btn.addEventListener("click", () => {
        stopPopTimer();
        stopShadowTimer();
        document.querySelectorAll("#viewArena .sub-tab").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        document.querySelectorAll(".solo-pane").forEach((p) => p.classList.remove("active"));
        const map = {
          shuffle: "soloShufflePane",
          trivia: "soloTriviaPane",
          pop: "soloPopPane",
          shadow: "soloShadowPane"
        };
        document.getElementById(map[btn.dataset.solo])?.classList.add("active");
        if (btn.dataset.solo === "trivia") loadNextTriviaQuestion();
        if (btn.dataset.solo === "pop") { popBetState.phase = "bet"; renderPopularityGame(); }
        if (btn.dataset.solo === "shadow") loadNextShadowQuestion();
      });
    });

    document.querySelectorAll(".diff-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".diff-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        soloDiff = btn.dataset.diff;
      });
    });
    document.getElementById("btnStartSoloShuffle")?.addEventListener("click", startSoloShuffleDuel);

    document.querySelectorAll(".trivia-mode-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        document.querySelectorAll(".trivia-mode-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        triviaMode = btn.dataset.tmode;
        loadNextTriviaQuestion();
      });
    });
    document.getElementById("btnTrivia5050")?.addEventListener("click", useTriviaHint);
    document.getElementById("btnTriviaSkip")?.addEventListener("click", loadNextTriviaQuestion);

    document.querySelectorAll("#viewOnline .sub-tab").forEach((b) => {
      b.addEventListener("click", () => switchOnlineSubTab(b.dataset.online));
    });
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
      if (db && currentRoomCode && currentRole) {
        db.ref(`duels/${currentRoomCode}/${currentRole}/consent`).set(true);
        showToast("✅");
      }
    });
    document.getElementById("btnDeclineConsent")?.addEventListener("click", () => leaveCurrentRoom(true));

    document.getElementById("invSearch")?.addEventListener("input", (e) => {
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
    document.getElementById("btnLoadMoreInv")?.addEventListener("click", () => {
      invRenderLimit += 30;
      renderInventory(false);
    });

    let codexSearchTimer = null;
    document.getElementById("codexSearch")?.addEventListener("input", (e) => {
      codexSearch = e.target.value;
      renderCodex();
      clearTimeout(codexSearchTimer);
      if (codexSearch.trim().length >= 2 && navigator.onLine) {
        codexSearchTimer = setTimeout(async () => {
          await fetchAniListPage(1, codexSearch.trim());
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

    document.getElementById("btnCloseSummon")?.addEventListener("click", () => {
      document.getElementById("summonModal")?.classList.add("hidden");
    });
    document.getElementById("btnCloseCardModal")?.addEventListener("click", () => {
      document.getElementById("cardModal")?.classList.add("hidden");
    });

    const openSettings = () => {
      updateHud();
      renderSettingsProPanel();
      document.getElementById("settingsModal")?.classList.remove("hidden");
    };
    document.getElementById("btnSettings")?.addEventListener("click", openSettings);
    document.getElementById("btnProfileHud")?.addEventListener("click", openSettings);
    document.getElementById("btnCloseSettings")?.addEventListener("click", () => {
      document.getElementById("settingsModal")?.classList.add("hidden");
    });

    document.getElementById("btnSavePlayerName")?.addEventListener("click", () => {
      const val = document.getElementById("inputPlayerName")?.value.trim() || "";
      if (val.length >= 2) {
        state.name = val;
        flushSaveNow();
        updateHud();
        showToast(t("msg_saved"));
      }
    });

    document.getElementById("btnAudioToggle")?.addEventListener("click", () => {
      state.bgmEnabled = !state.bgmEnabled;
      const chk = document.getElementById("chkBgm");
      if (chk) chk.checked = state.bgmEnabled;
      saveState();
      updateBgmPlayback();
    });
    document.getElementById("chkBgm")?.addEventListener("change", (e) => {
      state.bgmEnabled = e.target.checked;
      saveState();
      updateBgmPlayback();
    });
    document.getElementById("chkSfx")?.addEventListener("change", (e) => {
      state.sfxEnabled = e.target.checked;
      saveState();
    });

    window.addEventListener("online", () => { updateHud(); ensureRichCatalog(); });
    window.addEventListener("offline", updateHud);
  }

  /* =========================================================
     17. التشغيل الأولي + التوسيع التلقائي الهادئ للكتالوج
  ========================================================= */
  loadCaches();
  injectShadowModeUi();
  injectQuickMatchUi();
  injectRoyalHubFab();
  initStartScreenBackground();
  applyLanguage(state.lang);
  bindAllEvents();
  initFirebaseListeners();
  ensureRichCatalog();

  // توسيع هادئ للكتالوج في الخلفية كل 25 ثانية بدون إرهاق الهاتف
  setTimeout(() => loadNextCatalogBatch(false), 6000);
  setInterval(() => loadNextCatalogBatch(false), 25000);
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
