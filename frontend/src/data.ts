export type RouteKey = "home" | "map" | "events" | "character" | "more" | "admin";

export type PortraitOption = {
  id: string;
  title: string;
  name: string;
  src: string;
  note: string;
  source: "official" | "upload";
  moderationStatus?: "pending" | "approved" | "rejected";
};

export type MapPlace = {
  id: string;
  name: string;
  category: "管理區" | "數值提升" | "宮中各地";
  note: string;
  description: string;
  action: string;
  limit: string;
  access: "all" | "admin" | "invited";
  image: string;
  x: number;
  y: number;
  status: string;
  subplaces?: string[];
};

export type NpcProfile = {
  id: string;
  name: string;
  title: string;
  courtesy: string;
  image: string;
  personality: string;
  skilled: string;
  unskilled: string;
  likes: string;
  dislikes: string;
  history: string;
  summary: string;
  stats?: { constitution: number; strategy: number; fortune: number; appearance: number };
};

export const events = [
  {
    id: "spring-banquet",
    label: "主線事件",
    title: "奉天祈福",
    description: "奉天樓將行春祭，太后命六宮依序祈福；主線內容由管理員發布後開放參與。",
    place: "主線劇情",
    deadline: "今夜 22:00",
    participants: 24,
    tone: "gold",
  },
  {
    id: "lost-letter",
    label: "調查事件",
    title: "遺落的宮箋",
    description: "藏書閣抽出的自戲題目裡，夾著一頁不屬於題籤的燒毀宮箋。",
    place: "藏書閣",
    deadline: "明日 18:00",
    participants: 11,
    tone: "jade",
  },
  {
    id: "night-watch",
    label: "限時事件",
    title: "仙台異籤",
    description: "觀仙台今日出現一支未列入籤冊的舊籤，籤文似乎指向宮中故人。",
    place: "觀仙台",
    deadline: "二日後",
    participants: 8,
    tone: "ink",
  },
];

export const mapPlaces: MapPlace[] = [
  { id: "neiwufu", name: "內務府", category: "管理區", note: "管理員辦公", description: "管理人員處理群務、系統、宮市、新人引導與紛爭的地方，普通玩家非請勿入。", action: "進入管理院", limit: "管理員限定", access: "admin", image: "./assets/scene-taihe.webp", x: 50, y: 12, status: "非請勿入" },
  { id: "fengtian", name: "奉天樓", category: "數值提升", note: "祈福之地", description: "玩家可在奉天樓祈福，依規則獲得不定量福氣。", action: "祈福", limit: "每日一次", access: "all", image: "./assets/scene-taihe.webp", x: 76, y: 30, status: "今日可祈福" },
  { id: "yueshu", name: "閱書院", category: "數值提升", note: "研讀四書五經", description: "研讀四書五經以提升心計，實際增加值由正式規則與後端結果決定。", action: "研讀經書", limit: "每日兩次", access: "all", image: "./assets/scene-chenglu.webp", x: 25, y: 34, status: "尚可研讀兩次" },
  { id: "taiyi", name: "太醫院", category: "數值提升", note: "請平安脈", description: "前往太醫院請平安脈，可依結果獲得不定量體質。", action: "請平安脈", limit: "每日一次", access: "all", image: "./assets/scene-market.webp", x: 18, y: 66, status: "今日尚未問診" },
  { id: "guanxian", name: "觀仙台", category: "數值提升", note: "特殊抽籤", description: "於太液池、御花園或上林苑進行抽取；三地合計而非各自計次。", action: "前往抽籤", limit: "全地點合計每日三次", access: "all", image: "./assets/scene-penglai.webp", x: 52, y: 58, status: "尚餘三次", subplaces: ["太液池：優惠券／威望 50～100", "御花園：150 銀兩／體質、容貌或威望", "上林苑：250 銀兩／四項能力或威望"] },
  { id: "cangshu", name: "藏書閣", category: "宮中各地", note: "抽取自戲題目", description: "抽取自戲題目後完成投稿；同一篇自戲不可重複用於數值提升。", action: "抽自戲題目", limit: "依投稿與審核規則", access: "all", image: "./assets/scene-chenglu.webp", x: 80, y: 67, status: "題庫開放" },
  { id: "main-story", name: "主線劇情", category: "宮中各地", note: "管理員發布主線", description: "主線由管理人員建立與發布；玩家依事件邀請、身份及開放條件參與。", action: "查看主線事件", limit: "依各章截止時間", access: "invited", image: "./assets/palace-hero.webp", x: 50, y: 87, status: "新章開放" },
];

export const npcs: NpcProfile[] = [
  { id: "yuzhao-emperor", name: "蕭漌辞", title: "渝昭帝", courtesy: "靖潯", image: "./assets/npc-redrawn/yuzhao-emperor-v2.webp", personality: "溫潤如玉、心思深沉", skilled: "謀略、詩詞", unskilled: "書法", likes: "溫順謙和", dislikes: "束縛", history: "二皇子 → 渝昭帝", summary: "先帝崩逝後以謀略平定朝局、登基為帝；外示仁和，內心深沉，對錦歸情意尤深。" },
  { id: "chengzhao-empress-dowager", name: "梁怜卿", title: "珹昭皇太后", courtesy: "知微", image: "./assets/npc-redrawn/chengzhao-empress-dowager-v2.webp", personality: "位高權重、心機深沉", skilled: "擅權、偽裝", unskilled: "詩書", likes: "財權、丹青", dislikes: "目無尊卑者", history: "太子妃 → 皇后 → 皇太后", summary: "曾與帝王恩愛甚篤，痛失皇嗣後轉而追求權勢，以縝密謀略掌握後宮。" },
  { id: "jinhui-taifei", name: "君疏鳶", title: "瑾惠太妃", courtesy: "映嫿", image: "./assets/npc-redrawn/jinhui-taifei-v2.webp", personality: "溫柔婉約、不問世事", skilled: "琴藝、詩書", unskilled: "騎射、冷嘲熱諷", likes: "蒔花", dislikes: "踰矩", history: "琦貴嬪 → 琦妃 → 君昭容 → 儀御妃 → 瑾惠太妃", summary: "早年因盛寵而驕，歷經貶位與禁足後性情漸斂，晚年將心思寄於琴棋書畫。" },
  { id: "jia-fei", name: "虞綰今", title: "嘉妃", courtesy: "歸意", image: "./assets/npc-redrawn/jia-fei-v2.webp", personality: "進退有度、平易近人", skilled: "琵琶、舞藝", unskilled: "書法、笛", likes: "荷花、音律", dislikes: "虛情假意", history: "側福晉 → 嘉妃", summary: "家世顯赫且行止端方，曾深受太子寵愛；錦歸入宮後逐漸失寵，表面淡然，野心仍未泯滅。", stats: { constitution: 810, strategy: 481, fortune: 584, appearance: 463 } },
  { id: "yi-fei", name: "南司韞", title: "禕妃", courtesy: "袼姝", image: "./assets/npc-redrawn/yi-fei-v2.webp", personality: "清冷孤傲、高貴自信", skilled: "撫琴", unskilled: "飲酒", likes: "吟詩、遊玩", dislikes: "無理取鬧者、甜食", history: "側福晉 → 禕妃", summary: "出身百年簪纓世族，禮儀無懈可擊；因昔日婚事與馥錦決裂，入宮後孤高自持。", stats: { constitution: 399, strategy: 756, fortune: 621, appearance: 560 } },
  { id: "jinsheng-deyu", name: "唐錦歸", title: "錦笙德妤", courtesy: "嶠兮", image: "./assets/npc-redrawn/jinsheng-deyu-v2.webp", personality: "嬌矜嫵媚、城府深沉", skilled: "調香、釀酒", unskilled: "鑑玉", likes: "書法、冰嬉", dislikes: "烹飪", history: "格格 → 錦笙御貴嬪 → 錦笙德妤", summary: "出身寒微而姿容出眾，深得渝昭帝寵愛；在宮中積極鞏固母家與自身地位。", stats: { constitution: 380, strategy: 700, fortune: 300, appearance: 850 } },
  { id: "li-liangren", name: "黎栖璇", title: "黎良人", courtesy: "碧禾", image: "./assets/npc-redrawn/li-liangren-v2.webp", personality: "清醒通透、機敏聰慧", skilled: "畫技、女紅", unskilled: "馬術", likes: "知恩圖報", dislikes: "卑鄙小人", history: "侍妾 → 穎淑容 → 黎良人", summary: "入東宮後始終隱忍自守；母家叛亂使其遭貶與禁足，此後在失勢與孤寂中求存。", stats: { constitution: 599, strategy: 564, fortune: 721, appearance: 700 } },
];

export const portraits: PortraitOption[] = [
  { id: "consort", title: "嬪妃", name: "沈知微", src: "./assets/portrait-consort.webp", note: "從六品・婕妤", source: "official" },
  { id: "prince", title: "皇子", name: "蕭景珩", src: "./assets/portrait-prince.webp", note: "待生皇嗣", source: "official" },
  { id: "princess", title: "帝姬", name: "蕭令儀", src: "./assets/portrait-princess.webp", note: "待生皇嗣", source: "official" },
];

export const chronicle = [
  { date: "春三月・初七", title: "受邀參與奉天祈福", detail: "主線劇情已開放，截止前可完成投稿。" },
  { date: "春三月・初五", title: "閱書院研讀", detail: "完成四書五經研讀，心計獲得提升。" },
  { date: "春二月・廿八", title: "晉為婕妤", detail: "內務府已更新月俸與可用服儀。" },
];
