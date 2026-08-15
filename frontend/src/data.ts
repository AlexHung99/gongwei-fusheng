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

export const events = [
  {
    id: "spring-banquet",
    label: "主線事件",
    title: "上巳春宴",
    description: "曲水流觴，眾人各懷心事。太后將在席間宣布一樁攸關六宮的決定。",
    place: "蓬萊池",
    deadline: "今夜 22:00",
    participants: 24,
    tone: "gold",
  },
  {
    id: "lost-letter",
    label: "調查事件",
    title: "遺落的宮箋",
    description: "御花園石徑旁發現一頁燒毀的信箋，墨跡似乎與近日流言有關。",
    place: "御花園",
    deadline: "明日 18:00",
    participants: 11,
    tone: "jade",
  },
  {
    id: "night-watch",
    label: "限時事件",
    title: "長夜聞鈴",
    description: "子時將近，西六宮卻傳來不應出現的銀鈴聲。誰會循聲而去？",
    place: "承露宮",
    deadline: "二日後",
    participants: 8,
    tone: "ink",
  },
];

export const mapPlaces = [
  { id: "taihe", name: "太和殿", note: "朝會與冊封", description: "重簷之下禮序森嚴，冊封、朝會與重大宮務皆在此宣示。", image: "./assets/scene-taihe.webp", x: 50, y: 18, status: "今日開放" },
  { id: "garden", name: "御花園", note: "交遊與探查", description: "花徑、竹影與假山交錯，是偶遇知交，也是暗中查訪的好地方。", image: "./assets/scene-garden.webp", x: 23, y: 49, status: "有新事件" },
  { id: "penglai", name: "蓬萊池", note: "上巳春宴", description: "春水映著宮闕，今日水榭設宴，席間似乎藏著一封來歷不明的宮箋。", image: "./assets/scene-penglai.webp", x: 70, y: 49, status: "24 人參與" },
  { id: "chenglu", name: "承露宮", note: "你的居所", description: "燈影柔和的私人居所，可休憩、整裝、研讀並處理自己的宮中事務。", image: "./assets/scene-chenglu.webp", x: 44, y: 73, status: "可休憩" },
  { id: "market", name: "尚宮局", note: "宮市與服儀", description: "絲帛、首飾、香藥與宮中器物陳列井然，可在此添置日常所需。", image: "./assets/scene-market.webp", x: 79, y: 76, status: "新貨入庫" },
];

export const portraits: PortraitOption[] = [
  { id: "consort", title: "嬪妃", name: "沈知微", src: "./assets/portrait-consort.webp", note: "從六品・婕妤", source: "official" },
  { id: "prince", title: "皇子", name: "蕭景珩", src: "./assets/portrait-prince.webp", note: "待生皇嗣", source: "official" },
  { id: "princess", title: "帝姬", name: "蕭令儀", src: "./assets/portrait-princess.webp", note: "待生皇嗣", source: "official" },
];

export const chronicle = [
  { date: "春三月・初七", title: "受邀赴上巳春宴", detail: "蓬萊池設宴，衣著需合「清雅」之題。" },
  { date: "春三月・初五", title: "遷居承露宮", detail: "獲賜新居，威望增加 12。" },
  { date: "春二月・廿八", title: "晉為婕妤", detail: "內務府已更新月俸與可用服儀。" },
];
