import {
  AlertCircle,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleUserRound,
  ClipboardList,
  Coffee,
  Coins,
  Crown,
  Eye,
  Feather,
  FilePenLine,
  Gem,
  HeartHandshake,
  History,
  Home,
  ImageIcon,
  Landmark,
  LockKeyhole,
  Map,
  Menu,
  MessageCircleMore,
  PackageOpen,
  Plus,
  Save,
  ScrollText,
  Search,
  Send,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  SlidersHorizontal,
  Sprout,
  Star,
  Tags,
  UploadCloud,
  Users,
  X,
  ZoomIn,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { chronicle, events, mapPlaces, marketItems, npcs, palaceActivities, playerProfiles, portraits, staffMembers, type NpcProfile, type PortraitOption, type RouteKey } from "./data";

const navItems: { id: RouteKey; label: string; icon: typeof Home }[] = [
  { id: "home", label: "今日", icon: Home },
  { id: "map", label: "宮城", icon: Map },
  { id: "events", label: "事件", icon: MessageCircleMore },
  { id: "players", label: "玩家名冊", icon: Users },
  { id: "character", label: "我的人物", icon: CircleUserRound },
  { id: "more", label: "更多", icon: Menu },
];

const supportUrl = (import.meta.env.VITE_BUY_ME_A_COFFEE_URL ?? "").trim();
const supportConfigured = /^https:\/\/buymeacoffee\.com\/[A-Za-z0-9._-]+\/?$/.test(supportUrl);

const routeFromHash = (): RouteKey => {
  const value = window.location.hash.replace("#/", "") as RouteKey;
  return ["home", "map", "events", "players", "character", "market", "more", "admin"].includes(value) ? value : "home";
};

const abilityLabel = (name: string, value: number) => {
  if (value <= 0) return name === "體質" ? "逝世" : "未定";
  const labels: Record<string, string[]> = {
    體質: ["病態", "嬌弱", "無恙", "康健", "強健", "強韌"],
    心計: ["單純", "直率", "世故", "善謀", "高深", "莫測"],
    容貌: ["醜儀", "清秀", "端美", "花顏", "國色", "絕世"],
    福氣: ["霉運", "如願", "如意", "福澤", "祥瑞", "鴻運"],
  };
  const index = value >= 800 ? 5 : value >= 600 ? 4 : value >= 400 ? 3 : value >= 200 ? 2 : value >= 100 ? 1 : 0;
  return labels[name]?.[index] ?? "—";
};

function App() {
  const [route, setRouteState] = useState<RouteKey>(routeFromHash);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [portraitPickerOpen, setPortraitPickerOpen] = useState(false);
  const [selectedPortrait, setSelectedPortrait] = useState<PortraitOption>(portraits[0]);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const onHashChange = () => setRouteState(routeFromHash());
    window.addEventListener("hashchange", onHashChange);
    if (!window.location.hash) window.location.hash = "#/home";
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const navigate = (next: RouteKey) => {
    window.location.hash = `#/${next}`;
    setRouteState(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => navigate("home")} aria-label="返回首頁">
          <span className="brand-seal">宮</span>
          <span><strong>宮闈浮生</strong><small>一念入局・半生浮沉</small></span>
        </button>

        <nav className="side-nav" aria-label="主要導覽">
          <p className="nav-eyebrow">宮中行止</p>
          {navItems.map(({ id, label, icon: Icon }) => (
            <button key={id} className={route === id ? "active" : ""} onClick={() => navigate(id)}>
              <Icon size={19} strokeWidth={1.8} />
              <span>{label}</span>
              {id === "events" && <em>{palaceActivities.length}</em>}
            </button>
          ))}
          <p className="nav-eyebrow nav-eyebrow-spaced">內廷執事</p>
          <button className={route === "admin" ? "active" : ""} onClick={() => navigate("admin")}>
            <ShieldCheck size={19} strokeWidth={1.8} />
            <span>管理院</span>
          </button>
        </nav>

        <section className="sidebar-profile" aria-label="自己的帳號與角色狀態">
          <button className="sidebar-profile-main" onClick={() => navigate("character")}>
            <img src={selectedPortrait.src} alt={`${selectedPortrait.name}人物立繪`} />
            <span><small>自己的帳號</small><strong>{selectedPortrait.name}</strong><em>{selectedPortrait.note}・安好</em></span>
            <Settings size={15} />
          </button>
          <div className="sidebar-self-stats"><span>體質<strong>570</strong><em>康健</em></span><span>心計<strong>640</strong><em>高深</em></span><span>容貌<strong>820</strong><em>絕世</em></span><span>福氣<strong>380</strong><em>如意</em></span></div>
          <button className="sidebar-history-link" onClick={() => navigate("character")}><History size={13} />查看狀態與數值歷史</button>
        </section>
      </aside>

      <div className="main-column">
        <header className="topbar">
          <div className="date-chip"><CalendarDays size={16} /><span>永熙七年・春三月初七</span></div>
          <div className="top-actions">
            <button className="search-button" aria-label="搜尋"><Search size={18} /><span>搜尋宮中人事</span></button>
            <button className="top-coffee-button" onClick={() => setSupportOpen(true)} aria-label="請我們喝杯咖啡"><Coffee size={17} /><span>請喝咖啡</span></button>
            <button className="icon-button notification-button" onClick={() => setNotificationsOpen(!notificationsOpen)} aria-label="通知">
              <Bell size={19} /><i>3</i>
            </button>
          </div>
        </header>

        {notificationsOpen && <NotificationPanel onClose={() => setNotificationsOpen(false)} />}
        {supportOpen && <SupportModal onClose={() => setSupportOpen(false)} />}

        <main className="page-content">
          {route === "home" && <HomeView navigate={navigate} onToast={setToast} />}
          {route === "map" && <MapView navigate={navigate} onToast={setToast} />}
          {route === "events" && <EventsView onToast={setToast} />}
          {route === "players" && <PlayerDirectoryView />}
          {route === "character" && <CharacterView portrait={selectedPortrait} openPicker={() => setPortraitPickerOpen(true)} />}
          {route === "market" && <MarketView onToast={setToast} />}
          {route === "more" && <MoreView navigate={navigate} onToast={setToast} />}
          {route === "admin" && <AdminView onToast={setToast} />}
        </main>
      </div>

      <nav className="mobile-nav" aria-label="手機主要導覽">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button key={id} className={route === id ? "active" : ""} onClick={() => navigate(id)}>
            <Icon size={21} strokeWidth={1.8} /><span>{label}</span>
          </button>
        ))}
      </nav>

      {portraitPickerOpen && (
        <PortraitPicker
          selected={selectedPortrait.id}
          onClose={() => setPortraitPickerOpen(false)}
          onSelect={(portrait) => {
            setSelectedPortrait(portrait);
            setPortraitPickerOpen(false);
            setToast(portrait.source === "upload" ? "圖片已送出，審核通過後會正式套用" : `已切換為「${portrait.name}」官方立繪`);
          }}
        />
      )}
      {toast && <div className="toast"><Sparkles size={17} />{toast}</div>}
    </div>
  );
}

function PageHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return <header className="page-heading"><span>{eyebrow}</span><h1>{title}</h1><p>{description}</p></header>;
}

function HomeView({ navigate, onToast }: { navigate: (route: RouteKey) => void; onToast: (message: string) => void }) {
  return (
    <div className="home-view">
      <section className="hero-card">
        <img src="./assets/palace-hero.webp" alt="晨霧中的宮苑與蓮池" />
        <div className="hero-shade" />
        <div className="hero-copy">
          <div className="season-pill"><Sprout size={14} />春章・花信</div>
          <p className="hero-kicker">今日宮聞</p>
          <h1>奉天春祭將啟，<br />一支舊籤暗藏風波。</h1>
          <p>太后傳旨，酉時於奉天樓行祈福禮；主線內容已由管理員發布。</p>
          <div className="hero-actions">
            <button className="primary-button" onClick={() => navigate("events")}>前往春宴 <ChevronRight size={17} /></button>
            <button className="ghost-button" onClick={() => navigate("map")}>查看宮城</button>
          </div>
        </div>
        <div className="hero-time"><span>距開宴尚餘</span><strong>03 : 42 : 18</strong></div>
      </section>

      <section className="dashboard-grid">
        <div className="section-card daily-card">
          <div className="section-title"><div><span>DAILY ACTIONS</span><h2>今日行止</h2></div><small>行動不限次數</small></div>
          <div className="action-list">
            <button onClick={() => onToast("已前往奉天樓；正式版由後端結算祈福結果")}> <i className="jade"><Feather /></i><span><strong>祈福</strong><small>奉天樓・每日一次</small></span><ChevronRight /></button>
            <button onClick={() => onToast("已前往閱書院研讀四書五經")}> <i className="red"><BookOpen /></i><span><strong>研讀</strong><small>閱書院・每日兩次</small></span><ChevronRight /></button>
            <button onClick={() => onToast("已前往太醫院請平安脈")}> <i className="gold"><Gem /></i><span><strong>平安脈</strong><small>太醫院・每日一次</small></span><ChevronRight /></button>
          </div>
        </div>

        <div className="section-card status-card">
          <div className="section-title"><div><span>YOUR STANDING</span><h2>宮中近況</h2></div><button onClick={() => navigate("character")}>完整人物</button></div>
          <div className="standing-rank"><Crown /><div><span>目前位階</span><strong>從六品・婕妤</strong></div><em>晉位 68%</em></div>
          <div className="progress"><i style={{ width: "68%" }} /></div>
          <div className="resource-row">
            <div><Star /><span>威望<strong>286</strong></span></div>
            <div><Coins /><span>銀兩<strong>1,840</strong></span></div>
            <div><HeartHandshake /><span>恩寵<strong>72</strong></span></div>
          </div>
        </div>
      </section>

      <section className="lower-grid">
        <div className="section-card event-preview">
          <div className="section-title"><div><span>ONGOING STORIES</span><h2>進行中的篇章</h2></div><button onClick={() => navigate("events")}>查看全部</button></div>
          {events.slice(0, 2).map((event) => <EventRow key={event.id} event={event} onClick={() => navigate("events")} />)}
        </div>
        <div className="section-card notice-card">
          <div className="section-title"><div><span>PALACE NOTICE</span><h2>宮務告示</h2></div></div>
          <div className="notice-item"><span>內務府</span><p>本月俸銀已發放，可至庫存查看明細。</p><small>一個時辰前</small></div>
          <div className="notice-item"><span>觀仙台</span><p>今日三處籤池已開放，合計最多抽取三次。</p><small>昨日</small></div>
        </div>
      </section>
    </div>
  );
}

function EventRow({ event, onClick }: { event: typeof events[number]; onClick: () => void }) {
  return <button className="event-row" onClick={onClick}><i className={event.tone}><ScrollText /></i><span><em>{event.label}</em><strong>{event.title}</strong><small>{event.place}・{event.participants} 人參與</small></span><div><small>{event.deadline}</small><ChevronRight /></div></button>;
}

function MapView({ navigate, onToast }: { navigate: (route: RouteKey) => void; onToast: (message: string) => void }) {
  const [activePlace, setActivePlace] = useState(mapPlaces[1]);
  const enterPlace = () => {
    if (activePlace.id === "npc-archive") {
      document.getElementById("npc-directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (activePlace.id === "neiwufu") {
      document.getElementById("staff-directory")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    if (activePlace.id === "market") {
      navigate("market");
      return;
    }
    onToast(`已前往${activePlace.name}：${activePlace.action}`);
  };
  return (
    <div>
      <PageHeading eyebrow="PALACE MAP" title="宮城輿圖" description="地點與用途依《遊戲規則／地圖介紹》呈現；數值結果仍由正式後端結算。" />
      <div className="map-layout">
        <div className="map-main">
          <section className="palace-map">
            <img src="./assets/map-v2/palace-map-v2.webp" alt="宮城行動地點、宮市與人物名冊入口鳥瞰圖" />
            <div className="map-vignette" />
            <div className="map-axis axis-north">北・內廷管理</div>
            <div className="map-axis axis-center">數值提升點</div>
            <div className="map-axis axis-south">宮中各地</div>
            {mapPlaces.map((place) => (
              <button
                key={place.id}
                className={`map-pin ${place.access} ${activePlace.id === place.id ? "active" : ""}`}
                style={{ left: `${place.x}%`, top: `${place.y}%` }}
                onClick={() => setActivePlace(place)}
              ><i><Landmark size={17} /></i><span>{place.name}</span></button>
            ))}
            <div className="map-legend"><span><i className="dot active" />目前選取</span><span><i className="dot" />行動地點</span><span><i className="dot restricted" />資訊入口</span></div>
          </section>
          <div className="scene-strip" aria-label="宮廷場景選擇">
            {mapPlaces.map((place) => (
              <button key={place.id} className={activePlace.id === place.id ? "active" : ""} onClick={() => setActivePlace(place)}>
                <img src={place.image} alt="" />
                <span>{place.name}</span>
              </button>
            ))}
          </div>
        </div>
        <aside className="place-panel section-card">
          <div className="place-illustration"><img key={activePlace.id} src={activePlace.image} alt={`${activePlace.name}地點場景`} /><em>地點場景</em><span>{activePlace.status}</span></div>
          <p className="eyebrow">{activePlace.category}・SELECTED PLACE</p>
          <h2>{activePlace.name}</h2>
          <strong className="place-note">{activePlace.note}</strong>
          <p>{activePlace.description}</p>
          <div className="place-details"><span>主要行動<strong>{activePlace.action}</strong></span><span>次數／權限<strong>{activePlace.limit}</strong></span></div>
          {activePlace.subplaces && <ul className="subplace-list">{activePlace.subplaces.map((subplace) => <li key={subplace}>{subplace}</li>)}</ul>}
          <button className="primary-button full" onClick={enterPlace}>{activePlace.action} <ChevronRight size={17} /></button>
        </aside>
      </div>
      {activePlace.id === "neiwufu" && <StaffDirectory />}
      {activePlace.id === "npc-archive" && <NpcDirectory />}
    </div>
  );
}

function EventsView({ onToast }: { onToast: (message: string) => void }) {
  const [placeFilter, setPlaceFilter] = useState("全部地點");
  const [playerFilter, setPlayerFilter] = useState("全部玩家");
  const [activeId, setActiveId] = useState(palaceActivities[0].id);
  const places = ["全部地點", ...Array.from(new Set(palaceActivities.map((item) => item.place)))];
  const players = ["全部玩家", ...Array.from(new Set(palaceActivities.map((item) => item.player)))];
  const filteredActivities = palaceActivities.filter((item) => (placeFilter === "全部地點" || item.place === placeFilter) && (playerFilter === "全部玩家" || item.player === playerFilter));
  const activeActivity = filteredActivities.find((item) => item.id === activeId) ?? filteredActivities[0];
  const activePlayer = playerProfiles.find((player) => player.name === activeActivity?.player);
  const activeScene = mapPlaces.find((place) => place.name === activeActivity?.place)?.image ?? "./assets/palace-hero.webp";

  return (
    <div>
      <PageHeading eyebrow="PALACE ACTIVITY" title="宮中事件" description="依地圖地點或玩家篩選公開歷程，查看行動消耗、數值結果與發生時間。" />
      <div className="activity-toolbar section-card">
        <label><span>地圖分類</span><select value={placeFilter} onChange={(event) => setPlaceFilter(event.target.value)}>{places.map((place) => <option key={place}>{place}</option>)}</select></label>
        <label><span>玩家篩選</span><select value={playerFilter} onChange={(event) => setPlayerFilter(event.target.value)}>{players.map((player) => <option key={player}>{player}</option>)}</select></label>
        <div><SlidersHorizontal size={17} /><span>共 <strong>{filteredActivities.length}</strong> 筆公開歷程</span></div>
      </div>
      <div className="activity-layout">
        <aside className="activity-list section-card">
          {filteredActivities.map((activity) => (
            <button key={activity.id} className={activeActivity?.id === activity.id ? "active" : ""} onClick={() => setActiveId(activity.id)}>
              <i className={activity.tone}><Landmark size={17} /></i>
              <span><small>{activity.place}・{activity.time}</small><strong>{activity.player}｜{activity.action}</strong><em>{activity.results.join("・")}</em></span>
              <ChevronRight size={15} />
            </button>
          ))}
          {filteredActivities.length === 0 && <p className="empty-state">目前沒有符合條件的公開歷程。</p>}
        </aside>
        {activeActivity && <section className="activity-detail section-card">
          <div className="event-scene-banner"><img src={activeScene} alt={`${activeActivity.place}事件場景`} /><span>{activeActivity.place}</span></div>
          <header><span>{activeActivity.time}・{activeActivity.id}</span><h2>{activeActivity.player}｜{activeActivity.action}</h2><p>{activeActivity.detail}</p></header>
          <div className="activity-ledger"><div><small>消耗</small><strong>{activeActivity.cost}</strong></div><div><small>取得／變化</small><strong>{activeActivity.results.join("、")}</strong></div></div>
          {activePlayer && <div className="event-player-card"><img src={activePlayer.image} alt={`${activePlayer.name}人物圖片`} /><span><small>{activePlayer.id}</small><strong>{activePlayer.name}</strong><em>{activePlayer.title}・{activePlayer.status}</em></span><div>{Object.entries({ 體質: activePlayer.stats.constitution, 心計: activePlayer.stats.strategy, 容貌: activePlayer.stats.appearance, 福氣: activePlayer.stats.fortune }).map(([name, value]) => <b key={name}><small>{name}</small>{value}<em>{abilityLabel(name, value)}</em></b>)}</div></div>}
          <button className="primary-button full" onClick={() => { setPlayerFilter(activeActivity.player); onToast(`已篩選 ${activeActivity.player} 的公開歷程`); }}>只看此玩家的歷程 <ChevronRight size={16} /></button>
        </section>}
      </div>
    </div>
  );
}

function CharacterView({ portrait, openPicker }: { portrait: PortraitOption; openPicker: () => void }) {
  const [historyScope, setHistoryScope] = useState<"today" | "all">("today");
  const stats = [
    { name: "體質", value: 570, color: "#64726e", label: abilityLabel("體質", 570) },
    { name: "容貌", value: 820, color: "#b18a49", label: abilityLabel("容貌", 820) },
    { name: "心計", value: 640, color: "#385e5a", label: abilityLabel("心計", 640) },
    { name: "福氣", value: 380, color: "#a4534b", label: abilityLabel("福氣", 380) },
  ];
  const visibleChronicle = historyScope === "today" ? chronicle.filter((item) => item.period === "today") : chronicle;
  return (
    <div>
      <PageHeading eyebrow="MY CHARACTER" title="我的人物" description="只顯示玩家自己的角色狀態、能力、資源，以及每次事件造成的數值異動。" />
      <section className="profile-hero section-card">
        <div className="profile-art">
          <img src={portrait.src} alt={`${portrait.name}人物圖片`} />
          {portrait.source === "upload" && <span className="portrait-review-badge"><AlertCircle size={13} />圖片審核中</span>}
          <button onClick={openPicker}><ImageIcon size={15} />更換人物圖片</button>
        </div>
        <div className="profile-copy">
          <span className="rank-ribbon">{portrait.title === "嬪妃" ? "從六品・婕妤" : "皇室・待生"}</span>
          <p className="eyebrow">CHARACTER NO. 0186</p>
          <h1>{portrait.name}</h1>
          <p className="profile-quote">「花開有時，人心卻未必肯依時節。」</p>
          <div className="profile-tags"><span>關雎宮</span><span>清雅</span><span>沈氏</span></div>
          <dl><div><dt>入宮</dt><dd>永熙七年・春</dd></div><div><dt>生辰</dt><dd>八月初九</dd></div><div><dt>當前狀態</dt><dd className="safe">安好</dd></div></dl>
        </div>
        <div className="profile-resources"><div><Star /><span>威望</span><strong>286</strong><small>距晉位尚需 134</small></div><div><Coins /><span>銀兩</span><strong>1,840</strong><small>本月俸銀已領</small></div><div><HeartHandshake /><span>恩寵</span><strong>72</strong><small>近七日 +8</small></div></div>
      </section>

      <div className="character-grid">
        <section className="section-card stats-card">
          <div className="section-title"><div><span>ABILITIES</span><h2>人物能力</h2></div></div>
          {stats.map((stat) => <div className="stat-line" key={stat.name}><span>{stat.name}<em>{stat.label}</em></span><div><i style={{ width: `${stat.value / 10}%`, background: stat.color }} /></div><strong>{stat.value}</strong></div>)}
        </section>
        <section className="section-card chronicle-card">
          <div className="section-title"><div><span>VALUE HISTORY</span><h2>遊玩歷程</h2></div><div className="history-scope"><button className={historyScope === "today" ? "active" : ""} onClick={() => setHistoryScope("today")}>今日</button><button className={historyScope === "all" ? "active" : ""} onClick={() => setHistoryScope("all")}>歷史</button></div></div>
          <div className="history-query"><CalendarDays size={15} /><span>{historyScope === "today" ? "永熙七年・春三月初七的全部歷程" : "全部歷史紀錄；正式版可依日期區間查詢"}</span><input type="date" aria-label="查詢歷程日期" /></div>
          <div className="timeline">{visibleChronicle.map((item) => <div key={`${item.date}-${item.title}`}><i /><span><small>{item.date}<em>{item.source}</em></small><strong>{item.title}</strong><p>{item.detail}</p><div className="value-changes">{item.changes.map((change) => <b className={change.delta >= 0 ? "up" : "down"} key={`${item.title}-${change.label}`}>{change.label} {change.delta >= 0 ? "+" : ""}{change.delta}<small>{change.before} → {change.after}</small></b>)}</div></span></div>)}</div>
        </section>
      </div>
    </div>
  );
}

function NpcDirectory() {
  const [selectedNpc, setSelectedNpc] = useState<NpcProfile>(npcs[0]);
  const npcStats = selectedNpc.stats ? [
    ["體質", selectedNpc.stats.constitution],
    ["心計", selectedNpc.stats.strategy],
    ["福氣", selectedNpc.stats.fortune],
    ["容貌", selectedNpc.stats.appearance],
  ] : [];
  return (
    <section className="npc-archive" id="npc-directory">
      <div className="section-title npc-title"><div><span>OFFICIAL NPC ARCHIVE</span><h2>宮中人物名冊</h2><p>從宮城輿圖查閱官方 NPC 的人物設定、能力、經歷與個人故事。</p></div><small>共 {npcs.length} 人</small></div>
      <div className="npc-layout">
        <div className="npc-grid" aria-label="NPC 人物列表">
          {npcs.map((npc) => (
            <button key={npc.id} className={selectedNpc.id === npc.id ? "active" : ""} onClick={() => setSelectedNpc(npc)}>
              <img src={npc.image} alt={`${npc.name}・${npc.title}`} loading="lazy" />
              <span><small>{npc.title}</small><strong>{npc.name}</strong><em>{npc.personality}</em></span>
            </button>
          ))}
        </div>
        <article className="npc-detail section-card">
          <div className="npc-detail-image"><img src={selectedNpc.image} alt={`${selectedNpc.name}人物立繪`} /><span>官方 NPC</span></div>
          <div className="npc-detail-copy">
            <p className="eyebrow">NPC PROFILE・字 {selectedNpc.courtesy}</p>
            <h2>{selectedNpc.name}<small>{selectedNpc.title}</small></h2>
            <p className="npc-summary">{selectedNpc.summary}</p>
            <dl>
              <div><dt>性格</dt><dd>{selectedNpc.personality}</dd></div>
              <div><dt>擅長</dt><dd>{selectedNpc.skilled}</dd></div>
              <div><dt>不擅</dt><dd>{selectedNpc.unskilled}</dd></div>
              <div><dt>喜歡</dt><dd>{selectedNpc.likes}</dd></div>
              <div><dt>不喜</dt><dd>{selectedNpc.dislikes}</dd></div>
              <div className="npc-history"><dt>經歷</dt><dd>{selectedNpc.history}</dd></div>
            </dl>
            {npcStats.length > 0 ? <div className="npc-stats">{npcStats.map(([label, value]) => <span key={label}><small>{label}</small><strong>{value}</strong><em>{abilityLabel(String(label), Number(value))}</em></span>)}</div> : <p className="npc-no-stats">原始介紹未提供四項數值</p>}
            <section className="npc-story"><span>人物故事</span>{selectedNpc.story.map((paragraph, index) => <p key={`${selectedNpc.id}-story-${index}`}>{paragraph}</p>)}</section>
          </div>
        </article>
      </div>
    </section>
  );
}

function StaffDirectory() {
  return <section className="staff-directory" id="staff-directory"><div className="section-title npc-title"><div><span>IMPERIAL HOUSEHOLD STAFF</span><h2>內務府管理名單</h2><p>玩家可查看執事分工與最近上線時間；管理後台權限不會因此公開。</p></div><small>共 {staffMembers.length} 人</small></div><div className="staff-grid">{staffMembers.map((member, index) => <article className="section-card" key={member.name}><i>{String(index + 1).padStart(2, "0")}</i><span><small>{member.role}</small><strong>{member.name}</strong><p>{member.duty}</p></span><em className={member.online === "在線" ? "online" : ""}>{member.online}</em></article>)}</div></section>;
}

function PlayerDirectoryView() {
  const pageSize = 5;
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedPlayer, setSelectedPlayer] = useState(playerProfiles[0]);
  const [scope, setScope] = useState<"today" | "all">("today");
  const sortedPlayers = [...playerProfiles].sort((a, b) => a.onlineMinutes - b.onlineMinutes).filter((player) => `${player.name}${player.title}${player.status}`.includes(query.trim()));
  const pageCount = Math.max(1, Math.ceil(sortedPlayers.length / pageSize));
  const visiblePlayers = sortedPlayers.slice((page - 1) * pageSize, page * pageSize);
  const playerActivities = scope === "today" ? selectedPlayer.activities.filter((item) => item.time.startsWith("今日")) : selectedPlayer.activities;
  const statEntries = [
    ["體質", selectedPlayer.stats.constitution],
    ["心計", selectedPlayer.stats.strategy],
    ["容貌", selectedPlayer.stats.appearance],
    ["福氣", selectedPlayer.stats.fortune],
  ] as const;
  const changePage = (nextPage: number) => {
    setPage(nextPage);
    const firstOnPage = sortedPlayers[(nextPage - 1) * pageSize];
    if (firstOnPage) setSelectedPlayer(firstOnPage);
  };
  return <div><PageHeading eyebrow="PLAYER DIRECTORY" title="玩家名冊" description="依最近上線時間排序；可查看玩家當前公開狀態、今日歷程與歷史歷程。" /><div className="player-directory-layout"><aside className="player-list-panel section-card"><div className="player-search"><Search size={16} /><input value={query} onChange={(event) => { setQuery(event.target.value); setPage(1); }} placeholder="搜尋姓名、位階或狀態" /></div><div className="player-sort-note"><Users size={15} />最近上線優先・共 {sortedPlayers.length} 人</div><div className="player-list">{visiblePlayers.map((player) => <button key={player.id} className={selectedPlayer.id === player.id ? "active" : ""} onClick={() => setSelectedPlayer(player)}><img src={player.image} alt="" /><span><small>{player.title}</small><strong>{player.name}</strong><em>{player.status}</em></span><b className={player.onlineMinutes === 0 ? "online" : ""}>{player.onlineLabel}</b></button>)}</div><div className="pagination"><button disabled={page === 1} onClick={() => changePage(page - 1)}>上一頁</button><span>{page} / {pageCount}</span><button disabled={page === pageCount} onClick={() => changePage(page + 1)}>下一頁</button></div></aside><section className="player-public-profile section-card"><header><img src={selectedPlayer.image} alt={`${selectedPlayer.name}人物圖片`} /><span><small>{selectedPlayer.id}</small><h2>{selectedPlayer.name}</h2><p>{selectedPlayer.title}・{selectedPlayer.status}</p></span><em>{selectedPlayer.onlineLabel}</em></header><div className="public-stat-grid">{statEntries.map(([name, value]) => <div key={name}><small>{name}</small><strong>{value}</strong><em>{abilityLabel(name, value)}</em></div>)}</div><div className="public-history-head"><div><span>PUBLIC ACTIVITY</span><h3>公開遊玩歷程</h3></div><div className="history-scope"><button className={scope === "today" ? "active" : ""} onClick={() => setScope("today")}>今日</button><button className={scope === "all" ? "active" : ""} onClick={() => setScope("all")}>歷史</button></div></div><div className="public-activity-list">{playerActivities.map((activity) => <article key={activity.id}><i><Landmark size={15} /></i><span><small>{activity.time}・{activity.place}</small><strong>{activity.action}</strong><p>{activity.detail}</p><em>{activity.cost}｜{activity.results.join("、")}</em></span></article>)}{playerActivities.length === 0 && <p className="empty-state">目前沒有可公開的{scope === "today" ? "今日" : "歷史"}歷程。</p>}</div></section></div></div>;
}

function MarketView({ onToast }: { onToast: (message: string) => void }) {
  const balance = 1840;
  const categories = ["全部", "媚", "輔", "欺", "毒", "解", "其"] as const;
  const [category, setCategory] = useState<(typeof categories)[number]>("全部");
  const [query, setQuery] = useState("");
  const visibleItems = marketItems.filter((item) => (category === "全部" || item.category === category) && `${item.name}${item.effect}`.includes(query.trim()));
  return <div><PageHeading eyebrow="PALACE MARKET" title="宮市" description="依《遊戲規則／宮市》呈現六類道具；使用自己的俸祿／銀兩購買，高風險效果需管理員確認。" /><section className="market-hero section-card"><img src="./assets/map-v2/place-market-v1.webp" alt="宮市內部場景" /><div><span>AVAILABLE BALANCE</span><h2>目前俸祿／銀兩</h2><strong><Coins size={21} />{balance.toLocaleString()}</strong><p>購買與使用會分別留下永久歷程；被下毒後依原規則有一小時可購買解藥。</p></div></section><div className="market-toolbar section-card"><div className="market-categories">{categories.map((item) => <button key={item} className={category === item ? "active" : ""} onClick={() => setCategory(item)}>{item}</button>)}</div><label><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="搜尋道具或效果" /></label></div><div className="market-grid">{visibleItems.map((item) => { const affordable = item.price <= balance; return <article className={`market-item section-card ${item.risk ?? ""}`} key={`${item.category}-${item.name}`}><header><span>{item.category}</span>{item.risk === "danger" ? <em>高風險・需裁決</em> : item.risk === "moderated" ? <em>需管理員確認</em> : <em>一般道具</em>}</header><h3>{item.name}</h3><p>{item.effect}</p><footer><strong><Coins size={15} />{item.price.toLocaleString()}</strong><button disabled={!affordable} onClick={() => onToast(item.risk ? `「${item.name}」已加入購買確認，需管理員核准後結算` : `已開啟「${item.name}」購買確認；目前不會直接扣款`)}>{affordable ? "購買" : "俸祿不足"}</button></footer></article>; })}</div></div>;
}

function MoreView({ navigate, onToast }: { navigate: (route: RouteKey) => void; onToast: (message: string) => void }) {
  const items = [
    { icon: ShoppingBag, title: "宮市", text: "服儀、香藥與宮中器物", badge: "新貨" },
    { icon: PackageOpen, title: "庫存", text: "查看持有道具與使用紀錄", badge: "12" },
    { icon: Crown, title: "皇嗣紀錄", text: "生育狀態、待生池與子女", badge: "" },
    { icon: ScrollText, title: "數值紀錄", text: "事件造成的能力、資源與狀態異動", badge: "" },
    { icon: BookOpen, title: "玩法規則", text: "宮規、身份與社群互動原則", badge: "" },
  ];
  return <div><PageHeading eyebrow="PALACE SERVICES" title="宮務與藏冊" description="管理自己的道具、皇嗣與數值異動，亦可查閱最新宮規。NPC 資訊請由宮城輿圖進入。" /><div className="service-grid">{items.map(({ icon: Icon, title, text, badge }) => <button className="service-card section-card" key={title} onClick={() => title === "數值紀錄" ? navigate("character") : title === "宮市" ? navigate("market") : onToast(`${title}模組已建立，待後端 API 串接`) }><i><Icon /></i><span><strong>{title}</strong><small>{text}</small></span>{badge && <em>{badge}</em>}<ChevronRight /></button>)}</div><section className="admin-entry"><div><ShieldCheck /><span><strong>內廷管理人員</strong><small>玩家可在宮城的內務府查看管理名單；正式後台仍部署於 ASP.NET Core／IIS</small></span></div><button onClick={() => navigate("map")}>查看管理名單</button></section></div>;
}

function AdminView({ onToast }: { onToast: (message: string) => void }) {
  const [activeTab, setActiveTab] = useState<"review" | "story" | "titles" | "settings" | "audit">("review");
  const [reviewed, setReviewed] = useState<string[]>([]);
  const applications = [
    { id: "A-0214", name: "蕭景珩", role: "皇子・待生", age: "12 分鐘前", portrait: portraits[1].src },
    { id: "A-0213", name: "林照月", role: "嬪妃・良女", age: "38 分鐘前", portrait: portraits[0].src },
    { id: "A-0212", name: "蕭令儀", role: "帝姬・待生", age: "1 小時前", portrait: portraits[2].src },
  ];
  const approve = (id: string, name: string) => {
    setReviewed([...reviewed, id]);
    onToast(`已將 ${name} 標記為核准示範；正式版將寫入稽核紀錄`);
  };
  const tabs = [
    { id: "review" as const, label: "角色審核", icon: Users, policy: "CHARACTER_REVIEWER" },
    { id: "story" as const, label: "故事編輯", icon: FilePenLine, policy: "CONTENT_EDITOR" },
    { id: "titles" as const, label: "稱號管理", icon: Tags, policy: "CHARACTER_MANAGER" },
    { id: "settings" as const, label: "遊戲設定", icon: SlidersHorizontal, policy: "CONFIG_MANAGER" },
    { id: "audit" as const, label: "稽核紀錄", icon: ClipboardList, policy: "ALL_MANAGERS" },
  ];

  return (
    <div>
      <PageHeading eyebrow="ADMIN UI PROTOTYPE" title="內廷管理院" description="本頁是操作與版面原型；正式管理後台將由 ASP.NET Core MVC／Razor Pages 部署於 IIS。" />
      <div className="admin-metrics"><div><Users /><span>待審角色<strong>8</strong><small>今日新增 3</small></span></div><div><Crown /><span>待生皇嗣<strong>14</strong><small>已保留名額 2</small></span></div><div><MessageCircleMore /><span>故事草稿<strong>4</strong><small>1 篇待發布</small></span></div><div><LockKeyhole /><span>待覆核操作<strong>1</strong><small>高風險異動</small></span></div></div>
      <nav className="admin-tabs" aria-label="管理功能">
        {tabs.map(({ id, label, icon: Icon, policy }) => <button key={id} className={activeTab === id ? "active" : ""} onClick={() => setActiveTab(id)}><Icon size={17} /><span><strong>{label}</strong><small>{policy}</small></span></button>)}
      </nav>

      {activeTab === "review" && <CharacterReviewPanel applications={applications} reviewed={reviewed} approve={approve} onToast={onToast} />}
      {activeTab === "story" && <StoryEditorPanel onToast={onToast} />}
      {activeTab === "titles" && <TitleManagerPanel onToast={onToast} />}
      {activeTab === "settings" && <GameSettingsPanel onToast={onToast} />}
      {activeTab === "audit" && <AuditLogPanel onToast={onToast} />}
    </div>
  );
}

function CharacterReviewPanel({ applications, reviewed, approve, onToast }: { applications: { id: string; name: string; role: string; age: string; portrait: string }[]; reviewed: string[]; approve: (id: string, name: string) => void; onToast: (message: string) => void }) {
  return <section className="section-card review-table"><div className="section-title"><div><span>CHARACTER REVIEW</span><h2>最新角色申請</h2></div><button>查看全部</button></div><div className="review-head"><span>申請人物</span><span>身份</span><span>送出時間</span><span>處理</span></div>{applications.map((app) => <div className={`review-row ${reviewed.includes(app.id) ? "done" : ""}`} key={app.id}><span><img src={app.portrait} alt="" /><i><strong>{app.name}</strong><small>{app.id}</small></i></span><span>{app.role}</span><span>{app.age}</span><span>{reviewed.includes(app.id) ? <em><ShieldCheck size={15} />已核准</em> : <><button onClick={() => onToast(`已開啟 ${app.name} 的完整申請資料`)}>檢視</button><button className="approve" onClick={() => approve(app.id, app.name)}>核准</button></>}</span></div>)}</section>;
}

function StoryEditorPanel({ onToast }: { onToast: (message: string) => void }) {
  const chapters = [
    { id: "ch-01", no: "第一章", title: "春宴暗箋", status: "已發布", tone: "published" },
    { id: "ch-02", no: "第二章", title: "長夜聞鈴", status: "草稿", tone: "draft" },
    { id: "ch-03", no: "第三章", title: "玉階風露", status: "未開始", tone: "idle" },
  ];
  const [selected, setSelected] = useState(chapters[1]);
  const [title, setTitle] = useState(chapters[1].title);
  const [summary, setSummary] = useState("奉天樓春祭將近，觀仙台出現一支不在籤冊中的舊籤；此章將串連藏書閣與主線劇情兩條調查線。");
  const [body, setBody] = useState("## 開場\n\n宮門落鎖後，銀鈴聲自西側迴廊傳來。玩家可選擇循聲查探，或先回宮尋找證人。\n\n### 分支條件\n- 心計 ≥ 600：發現鈴舌上的藥香\n- 與蘇婕妤關係 ≥ 20：取得額外證詞");

  const selectChapter = (chapter: typeof chapters[number]) => {
    setSelected(chapter);
    setTitle(chapter.title);
  };

  return <section className="admin-editor-layout"><aside className="section-card content-list"><header><div><span>STORY CHAPTERS</span><h2>故事章節</h2></div><button onClick={() => onToast("已建立新的故事草稿")}><Plus size={15} />新增</button></header>{chapters.map((chapter) => <button key={chapter.id} className={selected.id === chapter.id ? "active" : ""} onClick={() => selectChapter(chapter)}><span><small>{chapter.no}</small><strong>{chapter.title}</strong></span><em className={chapter.tone}>{chapter.status}</em></button>)}</aside><div className="section-card content-editor"><header><div><span>STORY EDITOR・{selected.no}</span><h2>編輯故事內容</h2></div><div><button onClick={() => onToast("已開啟玩家視角預覽")}><Eye size={15} />預覽</button><button className="publish" onClick={() => onToast(`「${title}」已送出發布；正式版會建立不可變版本快照`)}>發布</button></div></header><div className="editor-status"><span><i />自動儲存草稿</span><button onClick={() => onToast("已開啟版本歷程，可比較或回復舊版")}><History size={14} />版本歷程</button></div><label><span>章節名稱</span><input value={title} onChange={(event) => setTitle(event.target.value)} /></label><label><span>故事摘要</span><textarea className="summary-input" value={summary} onChange={(event) => setSummary(event.target.value)} /></label><label><span>故事正文與分支設定（Markdown）</span><textarea className="story-body-input" value={body} onChange={(event) => setBody(event.target.value)} /></label><footer><small>只有 CONTENT_EDITOR 或 SUPER_ADMIN 可以發布；所有發布與回復均寫入 Audit Log。</small><button className="primary-button" onClick={() => onToast("故事草稿已儲存，版本號 +1")}><Save size={15} />儲存草稿</button></footer></div></section>;
}

function TitleManagerPanel({ onToast }: { onToast: (message: string) => void }) {
  const titleRows = [
    { title: "蘭心才人", category: "位階衍生", owner: "沈知微", visibility: "公開", status: "使用中" },
    { title: "蓬萊雅客", category: "事件成就", owner: "蘇婕妤等 6 人", visibility: "公開", status: "使用中" },
    { title: "掌燈人", category: "秘密劇情", owner: "未授予", visibility: "本人可見", status: "草稿" },
  ];
  return <section className="section-card admin-data-panel"><header><div><span>CHARACTER TITLES</span><h2>人物稱號管理</h2><p>建立稱號定義、限制適用身份，並授予或撤回玩家稱號。</p></div><button className="primary-button" onClick={() => onToast("已開啟新增稱號表單")}><Plus size={15} />新增稱號</button></header><div className="title-toolbar"><input placeholder="搜尋稱號或人物" /><select defaultValue="all"><option value="all">全部分類</option><option>位階衍生</option><option>事件成就</option><option>秘密劇情</option></select></div><div className="title-table"><div className="title-table-head"><span>稱號</span><span>分類</span><span>目前持有人</span><span>可見性</span><span>狀態／操作</span></div>{titleRows.map((row) => <div className="title-table-row" key={row.title}><span><strong>{row.title}</strong><small>可設定色彩與顯示排序</small></span><span>{row.category}</span><span>{row.owner}</span><span>{row.visibility}</span><span><em>{row.status}</em><button onClick={() => onToast(`已開啟「${row.title}」詳細設定`)}>編輯</button><button onClick={() => onToast(`已開啟「${row.title}」授予人物視窗`)}>授予</button></span></div>)}</div></section>;
}

function GameSettingsPanel({ onToast }: { onToast: (message: string) => void }) {
  const [postLimit, setPostLimit] = useState(10000);
  const [reproductionOpen, setReproductionOpen] = useState(true);
  const [conceptionRate, setConceptionRate] = useState(100);
  const [pregnancyDays, setPregnancyDays] = useState(10);
  const [miscarriageMode, setMiscarriageMode] = useState("event_only");
  const [coffeeEnabled, setCoffeeEnabled] = useState(true);
  const [coffeeUrl, setCoffeeUrl] = useState(supportUrl);
  return <section className="section-card settings-panel"><header><div><span>GAME CONFIGURATION</span><h2>遊戲詳細設定</h2><p>設定會先儲存為草稿；發布時依風險決定直接生效或進入雙人覆核。</p></div><button onClick={() => onToast("已開啟設定變更歷程")}><History size={15} />變更歷程</button></header><div className="settings-grid"><label><span>玩家行動<small>全域行動點已取消</small></span><strong className="setting-value">不限次數</strong></label><label><span>事件投稿字數上限<small>單篇 Markdown 文字長度</small></span><input type="number" min="500" max="30000" step="500" value={postLimit} onChange={(event) => setPostLimit(Number(event.target.value))} /></label><label><span>宮廷日曆<small>現實一日等於宮廷一日</small></span><strong className="setting-value">Asia/Taipei・1:1</strong></label><label className="setting-switch"><span>開放侍寢申請<small>待生池無名額時仍由系統強制關閉</small></span><input type="checkbox" checked={reproductionOpen} onChange={(event) => setReproductionOpen(event.target.checked)} /></label><label><span>侍寢受孕率<small>核准侍寢後成立 Pregnancy 的機率</small></span><span className="number-suffix"><input type="number" min="0" max="100" value={conceptionRate} onChange={(event) => setConceptionRate(Number(event.target.value))} /><em>%</em></span></label><label><span>Pregnancy 時長<small>只影響設定發布後的新胎次</small></span><span className="number-suffix"><input type="number" min="1" max="365" value={pregnancyDays} onChange={(event) => setPregnancyDays(Number(event.target.value))} /><em>天</em></span></label><label><span>流產模式<small>預設不進行每日隨機判定</small></span><select value={miscarriageMode} onChange={(event) => setMiscarriageMode(event.target.value)}><option value="event_only">事件觸發（建議）</option><option value="threshold">數值門檻</option><option value="daily_probability">每日機率</option><option value="disabled">完全停用</option></select></label><label className="setting-switch"><span>顯示咖啡贊助<small>右上按鈕與說明彈窗；不發遊戲獎勵</small></span><input type="checkbox" checked={coffeeEnabled} onChange={(event) => setCoffeeEnabled(event.target.checked)} /></label><label><span>Buy Me a Coffee URL<small>正式版需填 Creator 專屬網址</small></span><input className="setting-url" type="url" value={coffeeUrl} onChange={(event) => setCoffeeUrl(event.target.value)} /></label></div><div className="danger-settings"><LockKeyhole size={19} /><span><strong>高風險設定</strong><small>受孕率、Pregnancy 天數、流產模式、出生抽取、永久死亡及管理權限須另一名管理員覆核；既有 Pregnancy 不追溯。銀兩調整與道具發放仍是單人執行並永久 Audit。</small></span></div><footer><button className="ghost-button" onClick={() => onToast("已放棄尚未保存的設定變更")}>放棄變更</button><button className="primary-button" onClick={() => onToast("設定草稿已儲存；發布後才會影響遊戲")}><Save size={15} />儲存設定草稿</button></footer></section>;
}

function AuditLogPanel({ onToast }: { onToast: (message: string) => void }) {
  const rows = [
    { time: "今日 15:42", actor: "司庫・林月", action: "銀兩調整", target: "沈知微", change: "1,540 → 1,840", reason: "事件 E-102 結算漏發補償", request: "req_8C2F" },
    { time: "今日 14:18", actor: "掌事・顧和", action: "道具發放", target: "蘇婕妤", change: "白玉蘭簪 +1", reason: "上巳春宴主持獎勵", request: "req_73AD" },
    { time: "昨日 21:06", actor: "服主・Max", action: "故事發布", target: "第二章・長夜聞鈴", change: "Draft v6 → Published v7", reason: "第二章內容校訂完成", request: "req_65B1" },
  ];
  return <section className="section-card admin-data-panel audit-panel"><header><div><span>AUDIT LOG</span><h2>永久稽核紀錄</h2><p>顯示操作者、理由與前後值；本頁唯讀，紀錄不可修改或刪除。</p></div><button onClick={() => onToast("已匯出目前篩選結果的稽核報表")}>匯出篩選結果</button></header><div className="audit-toolbar"><input placeholder="搜尋操作者、目標或 Request ID" /><select defaultValue="all"><option value="all">全部動作</option><option>銀兩調整</option><option>道具發放</option><option>故事發布</option></select><input type="date" aria-label="開始日期" /></div><div className="audit-table"><div className="audit-row audit-head"><span>時間／操作者</span><span>動作／目標</span><span>前後值</span><span>調整理由</span><span>Request</span></div>{rows.map((row) => <button className="audit-row" key={row.request} onClick={() => onToast(`已開啟 ${row.request} 的完整 Before / After 與來源資訊`)}><span><strong>{row.time}</strong><small>{row.actor}</small></span><span><strong>{row.action}</strong><small>{row.target}</small></span><span>{row.change}</span><span>{row.reason}</span><span><code>{row.request}</code><ChevronRight size={14} /></span></button>)}</div></section>;
}

function SupportModal({ onClose }: { onClose: () => void }) {
  return <div className="modal-backdrop support-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="support-modal" role="dialog" aria-modal="true" aria-labelledby="support-title"><button className="support-close" onClick={onClose} aria-label="關閉贊助視窗"><X size={19} /></button><div className="coffee-mark"><Coffee size={32} /></div><span className="support-eyebrow">BUY ME A COFFEE</span><h2 id="support-title">請我們喝杯咖啡</h2><p>如果你喜歡這個宮廷世界，可以自願支持網站的伺服器、美術與日常維護。</p><div className="support-neutral"><ShieldCheck size={18} /><span><strong>贊助與遊戲完全無關</strong><small>不會獲得銀兩、道具、能力、位階、抽選優勢或審核優待。</small></span></div>{supportConfigured ? <a href={supportUrl} target="_blank" rel="noopener noreferrer">前往 Buy Me a Coffee <ChevronRight size={17} /></a> : <button className="support-disabled" disabled>贊助頁準備中</button>}<button className="support-later" onClick={onClose}>稍後再說</button></section></div>;
}

function NotificationPanel({ onClose }: { onClose: () => void }) {
  return <aside className="notification-panel"><header><div><span>NOTIFICATIONS</span><h2>宮中傳報</h2></div><button onClick={onClose} aria-label="關閉通知"><X /></button></header><div className="notification-item unread"><i><ScrollText /></i><span><strong>上巳春宴即將開始</strong><p>請於酉時前選妥服儀並進入事件房。</p><small>12 分鐘前</small></span></div><div className="notification-item unread"><i><Coins /></i><span><strong>本月俸銀已入帳</strong><p>獲得銀兩 420，可至帳本查看。</p><small>1 小時前</small></span></div><div className="notification-item unread"><i><History /></i><span><strong>今日歷程已更新</strong><p>太醫院問診與數值前後值已寫入人物歷程。</p><small>昨日</small></span></div><button className="all-notifications">查看所有傳報</button></aside>;
}

function PortraitPicker({ selected, onClose, onSelect }: { selected: string; onClose: () => void; onSelect: (portrait: PortraitOption) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [mode, setMode] = useState<"official" | "upload">("official");
  const [previewUrl, setPreviewUrl] = useState("");
  const [fileName, setFileName] = useState("");
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(1);
  const [positionY, setPositionY] = useState(35);

  const acceptFile = (file?: File) => {
    setError("");
    if (!file) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("只接受 JPEG、PNG 或 WebP 圖片。");
      return;
    }
    if (file.size > 8 * 1024 * 1024) {
      setError("圖片不可超過 8 MB。");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const source = String(reader.result ?? "");
      const image = new Image();
      image.onload = () => {
        if (image.width < 600 || image.height < 800) {
          setError("圖片至少需要 600 × 800 px，才能保留人物細節。");
          return;
        }
        setPreviewUrl(source);
        setFileName(file.name);
        setZoom(1);
        setPositionY(35);
      };
      image.onerror = () => setError("無法讀取這張圖片，請改用其他檔案。");
      image.src = source;
    };
    reader.onerror = () => setError("圖片讀取失敗，請再試一次。");
    reader.readAsDataURL(file);
  };

  const submitUpload = () => {
    if (!previewUrl) {
      setError("請先選擇一張人物圖片。");
      return;
    }
    onSelect({
      id: `upload-${Date.now()}`,
      title: "自訂人物",
      name: "沈知微",
      src: previewUrl,
      note: "圖片審核中",
      source: "upload",
      moderationStatus: "pending",
    });
  };

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <section className="portrait-modal" role="dialog" aria-modal="true" aria-labelledby="portrait-title">
        <header>
          <div><span>CHARACTER PORTRAIT</span><h2 id="portrait-title">選擇人物圖片</h2><p>可使用官方立繪，或上傳自己的角色圖片送交管理員審核。</p></div>
          <button onClick={onClose} aria-label="關閉"><X /></button>
        </header>
        <div className="portrait-mode-tabs" role="tablist">
          <button className={mode === "official" ? "active" : ""} onClick={() => setMode("official")}><Sparkles size={15} />官方立繪</button>
          <button className={mode === "upload" ? "active" : ""} onClick={() => setMode("upload")}><UploadCloud size={15} />自行上傳</button>
        </div>

        {mode === "official" ? (
          <div className="portrait-grid">{portraits.map((portrait) => <button key={portrait.id} className={selected === portrait.id ? "selected" : ""} onClick={() => onSelect(portrait)}><div><img src={portrait.src} alt={`${portrait.title}官方立繪`} />{selected === portrait.id && <span><ShieldCheck size={16} />使用中</span>}</div><small>{portrait.title}</small><strong>{portrait.name}</strong><em>{portrait.note}</em></button>)}</div>
        ) : (
          <div className="portrait-upload-panel">
            <input ref={inputRef} type="file" hidden accept="image/jpeg,image/png,image/webp" onChange={(event) => acceptFile(event.target.files?.[0])} />
            {!previewUrl ? (
              <button className="upload-dropzone" onClick={() => inputRef.current?.click()} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); acceptFile(event.dataTransfer.files?.[0]); }}>
                <UploadCloud size={31} /><strong>選擇圖片或拖曳至此</strong><span>JPEG、PNG、WebP・最大 8 MB</span>
              </button>
            ) : (
              <div className="upload-preview-layout">
                <div className="upload-crop-preview"><img src={previewUrl} alt="上傳人物圖片預覽" style={{ transform: `scale(${zoom})`, objectPosition: `center ${positionY}%` }} /><span>人物卡預覽</span></div>
                <div className="crop-controls">
                  <p><CheckCircle2 size={16} />{fileName}</p>
                  <label><span><ZoomIn size={15} />縮放</span><input type="range" min="1" max="1.8" step="0.05" value={zoom} onChange={(event) => setZoom(Number(event.target.value))} /></label>
                  <label><span>垂直位置</span><input type="range" min="0" max="100" value={positionY} onChange={(event) => setPositionY(Number(event.target.value))} /></label>
                  <button className="replace-upload" onClick={() => inputRef.current?.click()}>重新選擇圖片</button>
                </div>
              </div>
            )}
            {error && <p className="upload-error"><AlertCircle size={15} />{error}</p>}
            <div className="upload-rules"><ImageIcon size={18} /><p><strong>上傳規範</strong><span>建議直式半身或全身圖；請勿含真人照片、侵權素材、裸露、仇恨或聯絡資訊。系統會移除 EXIF，審核通過前顯示「審核中」。</span></p></div>
            <div className="upload-submit"><button className="ghost-button" onClick={onClose}>取消</button><button className="primary-button" onClick={submitUpload} disabled={!previewUrl}>送出審核 <ChevronRight size={16} /></button></div>
          </div>
        )}
      </section>
    </div>
  );
}

export default App;
