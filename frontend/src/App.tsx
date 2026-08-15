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
import { chronicle, events, mapPlaces, portraits, type PortraitOption, type RouteKey } from "./data";

const navItems: { id: RouteKey; label: string; icon: typeof Home }[] = [
  { id: "home", label: "今日", icon: Home },
  { id: "map", label: "宮城", icon: Map },
  { id: "events", label: "事件", icon: MessageCircleMore },
  { id: "character", label: "人物", icon: CircleUserRound },
  { id: "more", label: "更多", icon: Menu },
];

const supportUrl = (import.meta.env.VITE_BUY_ME_A_COFFEE_URL ?? "").trim();
const supportConfigured = /^https:\/\/buymeacoffee\.com\/[A-Za-z0-9._-]+\/?$/.test(supportUrl);

const routeFromHash = (): RouteKey => {
  const value = window.location.hash.replace("#/", "") as RouteKey;
  return ["home", "map", "events", "character", "more", "admin"].includes(value) ? value : "home";
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
              {id === "events" && <em>3</em>}
            </button>
          ))}
          <p className="nav-eyebrow nav-eyebrow-spaced">內廷執事</p>
          <button className={route === "admin" ? "active" : ""} onClick={() => navigate("admin")}>
            <ShieldCheck size={19} strokeWidth={1.8} />
            <span>管理院</span>
          </button>
        </nav>

        <div className="sidebar-profile">
          <img src={selectedPortrait.src} alt={`${selectedPortrait.name}人物立繪`} />
          <span><strong>{selectedPortrait.name}</strong><small>{selectedPortrait.note}</small></span>
          <button aria-label="人物設定" onClick={() => navigate("character")}><Settings size={16} /></button>
        </div>
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
          {route === "map" && <MapView onToast={setToast} />}
          {route === "events" && <EventsView onToast={setToast} />}
          {route === "character" && <CharacterView portrait={selectedPortrait} openPicker={() => setPortraitPickerOpen(true)} />}
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
          <h1>春宴將啟，<br />一紙宮箋暗藏風波。</h1>
          <p>太后傳旨，酉時於蓬萊池設宴。赴宴者須以「清雅」為題選擇服儀。</p>
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
            <button onClick={() => onToast("已前往御花園，新的邂逅正在展開")}> <i className="jade"><Feather /></i><span><strong>遊園</strong><small>可能觸發邂逅・不限行動點</small></span><ChevronRight /></button>
            <button onClick={() => onToast("已安排研讀《女誡新註》")}> <i className="red"><BookOpen /></i><span><strong>研讀</strong><small>心計 +2・不限行動點</small></span><ChevronRight /></button>
            <button onClick={() => onToast("服儀頁將在完整後端串接後開放")}> <i className="gold"><Gem /></i><span><strong>整裝</strong><small>為上巳春宴選擇服儀</small></span><ChevronRight /></button>
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
          <div className="notice-item"><span>尚宮局</span><p>春季服儀新增三套，現已開放預覽。</p><small>昨日</small></div>
        </div>
      </section>
    </div>
  );
}

function EventRow({ event, onClick }: { event: typeof events[number]; onClick: () => void }) {
  return <button className="event-row" onClick={onClick}><i className={event.tone}><ScrollText /></i><span><em>{event.label}</em><strong>{event.title}</strong><small>{event.place}・{event.participants} 人參與</small></span><div><small>{event.deadline}</small><ChevronRight /></div></button>;
}

function MapView({ onToast }: { onToast: (message: string) => void }) {
  const [activePlace, setActivePlace] = useState(mapPlaces[2]);
  return (
    <div>
      <PageHeading eyebrow="PALACE MAP" title="宮城輿圖" description="循著朱牆與水榭前行，每處宮苑都有正在發生的故事。" />
      <div className="map-layout">
        <div className="map-main">
          <section className="palace-map">
            <img src="./assets/palace-hero.webp" alt="宮城地圖場景" />
            <div className="map-vignette" />
            {mapPlaces.map((place) => (
              <button
                key={place.id}
                className={`map-pin ${activePlace.id === place.id ? "active" : ""}`}
                style={{ left: `${place.x}%`, top: `${place.y}%` }}
                onClick={() => setActivePlace(place)}
              ><i><Landmark size={17} /></i><span>{place.name}</span></button>
            ))}
            <div className="map-legend"><span><i className="dot active" />事件進行中</span><span><i className="dot" />一般地點</span></div>
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
          <div className="place-illustration"><img src={activePlace.image} alt={`${activePlace.name}場景`} /><span>{activePlace.status}</span></div>
          <p className="eyebrow">SELECTED PLACE</p>
          <h2>{activePlace.name}</h2>
          <p>{activePlace.description}</p>
          <div className="place-details"><span>開放時辰<strong>辰時至亥時</strong></span><span>目前人物<strong>{activePlace.id === "penglai" ? "24 人" : "6 人"}</strong></span></div>
          <button className="primary-button full" onClick={() => onToast(`已進入${activePlace.name}`)}>進入此處 <ChevronRight size={17} /></button>
        </aside>
      </div>
    </div>
  );
}

function EventsView({ onToast }: { onToast: (message: string) => void }) {
  const [activeId, setActiveId] = useState(events[0].id);
  const [message, setMessage] = useState("");
  const [draftStatus, setDraftStatus] = useState<"editing" | "submitted">("editing");
  const [lastSaved, setLastSaved] = useState("尚未儲存");
  const activeEvent = events.find((item) => item.id === activeId)!;
  const activeScene = mapPlaces.find((place) => place.name === activeEvent.place)?.image ?? "./assets/palace-hero.webp";
  const [posts] = useState([
    { name: "蘇婕妤", time: "14:28", text: "池畔新柳正好，我命人備了幾枝白玉蘭。若諸位不嫌，便以此作今日雅題。", avatar: "蘇" },
    { name: "沈知微", time: "14:35", text: "玉蘭素淨，倒與今日的天色相襯。只是方才經過水榭，似聽見有人提起那封宮箋。", avatar: "沈" },
  ]);

  const saveDraft = () => {
    setLastSaved("方才已儲存");
    onToast("事件草稿已儲存，尚未公開");
  };

  const submit = () => {
    if (!message.trim()) return;
    setDraftStatus("submitted");
    setLastSaved("已送出審核");
    onToast("投稿已送出，管理員核准後才會公開");
  };

  return (
    <div>
      <PageHeading eyebrow="STORY ROOMS" title="宮中事件" description="以自己的步調參與篇章；正式結果與截止時間皆以此處為準。" />
      <div className="events-layout">
        <aside className="event-list section-card">
          <div className="event-filter"><button className="active">進行中 <span>3</span></button><button>已結束</button></div>
          {events.map((event) => (
            <button key={event.id} className={activeId === event.id ? "active" : ""} onClick={() => setActiveId(event.id)}>
              <i className={event.tone}><ScrollText size={18} /></i>
              <span><small>{event.label}</small><strong>{event.title}</strong><em>{event.deadline}</em></span>
            </button>
          ))}
        </aside>

        <section className="thread section-card">
          <div className="event-scene-banner"><img src={activeScene} alt={`${activeEvent.place}事件場景`} /><span>{activeEvent.place}</span></div>
          <header className="thread-header">
            <div><span>{activeEvent.label}・{activeEvent.place}</span><h2>{activeEvent.title}</h2><p>{activeEvent.description}</p></div>
            <div className="participant-stack"><i>蘇</i><i>沈</i><i>顧</i><span>+{activeEvent.participants - 3}</span></div>
          </header>
          <div className="deadline-banner"><CalendarDays size={17} /><span>本回合截止：<strong>{activeEvent.deadline}</strong></span><em>尚可投稿</em></div>
          <div className="posts">
            <div className="narrator-post"><span>司簿</span><p>春水初生，蓬萊池畔已設曲水席。眾人依次入座時，一名小宮女匆匆經過，袖中似有紙角落下。</p></div>
            {posts.map((post, index) => <article className="player-post" key={`${post.time}-${index}`}><div className="post-avatar">{post.avatar}</div><div><header><strong>{post.name}</strong><span>{post.time}</span></header><p>{post.text}</p></div></article>)}
          </div>
          <footer className={`composer ${draftStatus === "submitted" ? "submitted" : ""}`}>
            <div><span className="composer-avatar">沈</span><textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="以沈知微的身份寫下回應……" disabled={draftStatus === "submitted"} /></div>
            <div className="composer-meta"><span>{draftStatus === "submitted" ? "等待管理員審核；退修後才可再編輯" : `${lastSaved}・${message.length} 字`}</span><div><button className="draft-button" onClick={saveDraft} disabled={draftStatus === "submitted"}><Save size={15} />儲存草稿</button><button onClick={submit} disabled={!message.trim() || draftStatus === "submitted"}>{draftStatus === "submitted" ? "審核中" : "送出審核"} <Send size={16} /></button></div></div>
          </footer>
        </section>
      </div>
    </div>
  );
}

function CharacterView({ portrait, openPicker }: { portrait: PortraitOption; openPicker: () => void }) {
  const stats = [
    { name: "體質", value: 570, color: "#64726e" },
    { name: "容貌", value: 820, color: "#b18a49" },
    { name: "心計", value: 640, color: "#385e5a" },
    { name: "福氣", value: 380, color: "#a4534b" },
  ];
  return (
    <div>
      <PageHeading eyebrow="CHARACTER ARCHIVE" title="人物卷宗" description="你在宮中的每一步，都將留在這卷未完的生涯之中。" />
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
          <div className="profile-tags"><span>承露宮</span><span>清雅</span><span>沈氏</span></div>
          <dl><div><dt>入宮</dt><dd>永熙七年・春</dd></div><div><dt>生辰</dt><dd>八月初九</dd></div><div><dt>當前狀態</dt><dd className="safe">安好</dd></div></dl>
        </div>
        <div className="profile-resources"><div><Star /><span>威望</span><strong>286</strong><small>距晉位尚需 134</small></div><div><Coins /><span>銀兩</span><strong>1,840</strong><small>本月俸銀已領</small></div><div><HeartHandshake /><span>恩寵</span><strong>72</strong><small>近七日 +8</small></div></div>
      </section>

      <div className="character-grid">
        <section className="section-card stats-card">
          <div className="section-title"><div><span>ABILITIES</span><h2>人物能力</h2></div></div>
          {stats.map((stat) => <div className="stat-line" key={stat.name}><span>{stat.name}</span><div><i style={{ width: `${stat.value / 10}%`, background: stat.color }} /></div><strong>{stat.value}</strong></div>)}
        </section>
        <section className="section-card chronicle-card">
          <div className="section-title"><div><span>CHRONICLE</span><h2>近日生涯</h2></div><button>完整紀錄</button></div>
          <div className="timeline">{chronicle.map((item) => <div key={item.title}><i /><span><small>{item.date}</small><strong>{item.title}</strong><p>{item.detail}</p></span></div>)}</div>
        </section>
      </div>
    </div>
  );
}

function MoreView({ navigate, onToast }: { navigate: (route: RouteKey) => void; onToast: (message: string) => void }) {
  const items = [
    { icon: ShoppingBag, title: "宮市", text: "服儀、香藥與宮中器物", badge: "新貨" },
    { icon: PackageOpen, title: "庫存", text: "查看持有道具與使用紀錄", badge: "12" },
    { icon: HeartHandshake, title: "人物關係", text: "NPC 與真人玩家關係摘要", badge: "" },
    { icon: Crown, title: "皇嗣紀錄", text: "生育狀態、待生池與子女", badge: "" },
    { icon: ScrollText, title: "生涯紀錄", text: "事件、晉位、獎懲與宮中歲月", badge: "" },
    { icon: BookOpen, title: "玩法規則", text: "宮規、身份與社群互動原則", badge: "" },
  ];
  return <div><PageHeading eyebrow="PALACE SERVICES" title="宮務與藏冊" description="管理道具、關係與生涯紀錄，亦可查閱最新宮規。" /><div className="service-grid">{items.map(({ icon: Icon, title, text, badge }) => <button className="service-card section-card" key={title} onClick={() => onToast(`${title}模組已建立，待後端 API 串接`) }><i><Icon /></i><span><strong>{title}</strong><small>{text}</small></span>{badge && <em>{badge}</em>}<ChevronRight /></button>)}</div><section className="admin-entry"><div><ShieldCheck /><span><strong>內廷管理人員</strong><small>此處為介面原型；正式管理後台部署於 ASP.NET Core／IIS</small></span></div><button onClick={() => navigate("admin")}>查看後台原型</button></section></div>;
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
  const [summary, setSummary] = useState("子時將近，西六宮傳來不應出現的銀鈴聲。此章將開啟御花園與承露宮兩條調查線。");
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
  return <aside className="notification-panel"><header><div><span>NOTIFICATIONS</span><h2>宮中傳報</h2></div><button onClick={onClose} aria-label="關閉通知"><X /></button></header><div className="notification-item unread"><i><ScrollText /></i><span><strong>上巳春宴即將開始</strong><p>請於酉時前選妥服儀並進入事件房。</p><small>12 分鐘前</small></span></div><div className="notification-item unread"><i><Coins /></i><span><strong>本月俸銀已入帳</strong><p>獲得銀兩 420，可至帳本查看。</p><small>1 小時前</small></span></div><div className="notification-item unread"><i><HeartHandshake /></i><span><strong>關係有所變化</strong><p>蘇婕妤對你的印象似乎改變了。</p><small>昨日</small></span></div><button className="all-notifications">查看所有傳報</button></aside>;
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
