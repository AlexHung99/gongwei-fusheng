export type RouteKey = "home" | "map" | "events" | "players" | "character" | "market" | "more" | "admin";

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
  story: string[];
  stats?: { constitution: number; strategy: number; fortune: number; appearance: number };
};

export type ChronicleEntry = {
  date: string;
  title: string;
  detail: string;
  source: string;
  period: "today" | "history";
  place: string;
  changes: { label: string; delta: number; before: number; after: number }[];
};

export type PalaceActivity = {
  id: string;
  time: string;
  place: string;
  player: string;
  playerTitle: string;
  action: string;
  detail: string;
  cost: string;
  results: string[];
  tone: string;
};

export type PlayerProfile = {
  id: string;
  name: string;
  title: string;
  image: string;
  onlineMinutes: number;
  onlineLabel: string;
  status: string;
  stats: { constitution: number; strategy: number; appearance: number; fortune: number };
  activities: PalaceActivity[];
};

export type MarketItem = {
  name: string;
  category: "媚" | "輔" | "欺" | "毒" | "解" | "其";
  price: number;
  effect: string;
  risk?: "moderated" | "danger";
};

export const events = [
  {
    id: "spring-banquet",
    label: "主線事件",
    title: "奉天祈福",
    description: "奉天樓將行春祭，太后命六宮依序祈福；主線內容由管理員發布後開放參與。",
    place: "奉天樓",
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
  { id: "neiwufu", name: "內務府", category: "管理區", note: "管理人員名冊", description: "玩家可查看目前管理團隊、負責職務與上線狀態；實際管理功能仍只對具權限帳號開放。", action: "查看管理人員", limit: "所有玩家可查看", access: "all", image: "./assets/map-v2/place-neiwufu-v2.webp", x: 50, y: 12, status: "共十位執事" },
  { id: "fengtian", name: "奉天樓", category: "數值提升", note: "祈福之地", description: "玩家可在奉天樓祈福，依規則獲得不定量福氣。", action: "祈福", limit: "每日一次", access: "all", image: "./assets/map-v2/place-fengtian-v2.webp", x: 76, y: 30, status: "今日可祈福" },
  { id: "yueshu", name: "閱書院", category: "數值提升", note: "研讀四書五經", description: "研讀四書五經以提升心計，實際增加值由正式規則與後端結果決定。", action: "研讀經書", limit: "每日兩次", access: "all", image: "./assets/map-v2/place-yueshu-v2.webp", x: 25, y: 34, status: "尚可研讀兩次" },
  { id: "taiyi", name: "太醫院", category: "數值提升", note: "請平安脈", description: "前往太醫院請平安脈，可依結果獲得不定量體質。", action: "請平安脈", limit: "每日一次", access: "all", image: "./assets/map-v2/place-taiyi-v3.webp", x: 18, y: 66, status: "今日尚未問診" },
  { id: "guanxian", name: "觀仙台", category: "數值提升", note: "特殊抽籤", description: "於太液池、御花園或上林苑進行抽取；三地合計而非各自計次。", action: "前往抽籤", limit: "全地點合計每日三次", access: "all", image: "./assets/map-v2/place-guanxian-v2.webp", x: 52, y: 50, status: "尚餘三次", subplaces: ["太液池：優惠券／威望 50～100", "御花園：150 銀兩／體質、容貌或威望", "上林苑：250 銀兩／四項能力或威望"] },
  { id: "cangshu", name: "藏書閣", category: "宮中各地", note: "抽取自戲題目", description: "抽取自戲題目後完成投稿；同一篇自戲不可重複用於數值提升。", action: "抽自戲題目", limit: "依投稿與審核規則", access: "all", image: "./assets/map-v2/place-cangshu-v2.webp", x: 80, y: 67, status: "題庫開放" },
  { id: "market", name: "宮市", category: "宮中各地", note: "服儀、香藥與器物", description: "使用自己的俸祿／銀兩購買宮市道具；價格與效果依《遊戲規則／宮市》呈現。", action: "前往宮市", limit: "依持有俸祿與道具限制", access: "all", image: "./assets/map-v2/place-market-v1.webp", x: 32, y: 83, status: "六類商品開放" },
  { id: "npc-archive", name: "宮中人物", category: "宮中各地", note: "查閱官方 NPC", description: "查看宮中 NPC 的人物資料、能力、位階經歷與個人故事。此處只提供角色設定，不顯示玩家關係數值。", action: "查看 NPC 名冊", limit: "不限次數", access: "all", image: "./assets/npc-redrawn/lan-ronghua-v4.webp", x: 50, y: 89, status: "共八位人物" },
];

export const npcs: NpcProfile[] = [
  {
    id: "yuzhao-emperor", name: "蕭漌辞", title: "渝昭帝", courtesy: "靖潯", image: "./assets/npc-redrawn/yuzhao-emperor-v2.webp",
    personality: "溫潤如玉、心思深沉", skilled: "謀略、詩詞", unskilled: "書法", likes: "溫順謙和", dislikes: "束縛", history: "二皇子 → 渝昭帝",
    summary: "先帝崩逝後以謀略平定朝局、登基為帝；外示仁和，內心深沉，對錦歸情意尤深。",
    story: ["先帝崩逝而儲位未定，諸皇子相爭，朝局動盪。漌辞尚未弱冠便懂得避鋒藏智，聯合朝臣與宗室平定亂局，先立太子，後登帝位。", "幼年宮禁森嚴，使他對自由懷有近乎執著的嚮往。微服時遇見不拘禮俗的唐錦歸，彷彿看見自己從未擁有的人生，遂將她迎入東宮。", "即位後，他以仁政安天下、以恩賞收攝政之權；表面溫潤，決斷卻從不遲疑。後宮諸人之中，錦歸仍是最能使他暫忘帝王束縛的人。"],
  },
  {
    id: "chengzhao-empress-dowager", name: "梁怜卿", title: "珹昭皇太后", courtesy: "知微", image: "./assets/npc-redrawn/chengzhao-empress-dowager-v2.webp",
    personality: "位高權重、心機深沉", skilled: "擅權、偽裝", unskilled: "詩書", likes: "財權、丹青", dislikes: "目無尊卑者", history: "太子妃 → 皇后 → 皇太后",
    summary: "曾與帝王恩愛甚篤，痛失皇嗣後轉而追求權勢，以縝密謀略掌握後宮。",
    story: ["怜卿由太子妃正位中宮，早年與帝王相敬如賓。新人漸多後，恩情日薄；沅誠六年，她唯一的嫡子又因寵妃設計而未能保住。", "喪子使她徹底不再相信情誼。她開始收攬人心、衡量利害，把所有能用之人納入棋局，最終在後宮建立足以與帝王分庭抗禮的權勢。", "她常說唯有權力能夠自保，卻也因此再無可以共語之人。夜深獨坐時，她仍會想起那個原本無意爭權的自己。"],
  },
  {
    id: "jinhui-taifei", name: "君疏鳶", title: "瑾惠太妃", courtesy: "映嫿", image: "./assets/npc-redrawn/jinhui-taifei-v5.webp",
    personality: "溫柔婉約、不問世事", skilled: "琴藝、詩書", unskilled: "騎射、冷嘲熱諷", likes: "蒔花", dislikes: "踰矩", history: "琦貴嬪 → 琦妃 → 君昭容 → 儀御妃 → 瑾惠太妃",
    summary: "早年因盛寵而驕，歷經貶位與禁足後性情漸斂，晚年將心思寄於琴棋書畫。",
    story: ["疏鳶以顯赫家世與絕世姿容入宮，初封貴嬪，很快因盛寵晉為妃。恩寵使她目中無人，甚至為嫉妒設計傷害皇后的皇嗣。", "事情敗露後，皇帝念舊只褫奪封號、降為昭容並禁足三月。漫長禁足讓她第一次看清，自己雖握有高位，卻已失盡人心。", "復封御妃後，她不再像從前般爭鋒。帝寵漸淡，她反而在琴聲、詩書與花木之間得到安穩；成為太妃後，她把昔日榮辱都收進沉默，只留下旁人對美貌、謀略與自毀的不同評說。"],
  },
  {
    id: "jia-fei", name: "虞綰今", title: "嘉妃", courtesy: "歸意", image: "./assets/npc-redrawn/jia-fei-v2.webp",
    personality: "進退有度、平易近人", skilled: "琵琶、舞藝", unskilled: "書法、笛", likes: "荷花、音律", dislikes: "虛情假意", history: "側福晉 → 嘉妃",
    summary: "家世顯赫且行止端方，曾深受太子寵愛；錦歸入宮後逐漸失寵，表面淡然，野心仍未泯滅。",
    story: ["綰今出身高門，以側福晉身份進入東宮，最初與太子恩愛有加，被視為端方賢淑的良配。", "唐錦歸入宮後，太子的心逐漸偏向新人。綰今曾試圖挽回，卻發現家世與禮法都敵不過君王的一念。", "漌辞登基後，她被封嘉妃，也學會以詩書自遣。旁人以為她已放下，她卻只說自己的野心從未消失，只是時機尚未到來。"],
    stats: { constitution: 810, strategy: 481, fortune: 584, appearance: 463 },
  },
  {
    id: "yi-fei", name: "南司韞", title: "禕妃", courtesy: "袼姝", image: "./assets/npc-redrawn/yi-fei-v2.webp",
    personality: "清冷孤傲、高貴自信", skilled: "撫琴", unskilled: "飲酒", likes: "吟詩、遊玩", dislikes: "無理取鬧者、甜食", history: "側福晉 → 禕妃",
    summary: "出身百年簪纓世族，禮儀無懈可擊；因昔日婚事與馥錦決裂，入宮後孤高自持。",
    story: ["司韞出身百年簪纓世族，自幼與陸馥錦同窗，情同手足。及笄時，她原將嫁給青梅竹馬靳氏，婚事卻被馥錦暗中破壞。", "不知靳家真實圖謀的司韞，只認定摯友背叛了自己。兩人一同入東宮後，她以冷言與欺辱報復，拒絕馥錦所有修好的可能。", "太子即位後，她憑家世封妃，既不爭寵，也不親近旁人。她像一座不可攀的孤峰，以詩書自娛，卻始終放不下那場失去婚姻與摯友的舊恨。"],
    stats: { constitution: 399, strategy: 756, fortune: 621, appearance: 560 },
  },
  {
    id: "jinsheng-deyu", name: "唐錦歸", title: "錦笙德妤", courtesy: "嶠兮", image: "./assets/npc-redrawn/jinsheng-deyu-v2.webp",
    personality: "嬌矜嫵媚、城府深沉", skilled: "調香、釀酒", unskilled: "鑑玉", likes: "書法、冰嬉", dislikes: "烹飪", history: "格格 → 錦笙御貴嬪 → 錦笙德妤",
    summary: "出身寒微而姿容出眾，深得渝昭帝寵愛；在宮中積極鞏固母家與自身地位。",
    story: ["錦歸在郊外偶遇微服的太子，以不受宮規束縛的靈動吸引了他。進入東宮後，她很快明白恩寵就是立足之本，遂與原本得寵的虞綰今暗中相爭。", "漌辞登基後本想封她為貴妃，卻因她家世寒微遭群臣反對，只能先抬舉唐氏母家。", "黎氏叛亂時，唐家領兵平亂有功，她終於名正言順晉為德妤。地位雖穩，她對出身的不足仍耿耿於懷，持續扶持宗族，為自己打造更牢固的根基。"],
    stats: { constitution: 380, strategy: 700, fortune: 300, appearance: 850 },
  },
  {
    id: "lan-ronghua", name: "陸馥錦", title: "嵐容華", courtesy: "卿弦", image: "./assets/npc-redrawn/lan-ronghua-v4.webp",
    personality: "溫婉沉靜、獨立自強", skilled: "唱戲、蒔花", unskilled: "謀略", likes: "清淨", dislikes: "張揚跋扈、表裡不一", history: "侍妾 → 嵐容華",
    summary: "為保護摯友而暗中破壞一場危險婚事，卻因此被南司韞視為仇敵；入宮後承受誤解，始終沒有說出真相。",
    story: ["馥錦與南司韞自幼相交，被稱為佳友雙璧。司韞將嫁靳氏時，馥錦意外得知靳家只圖南家嫁妝，事後還準備以惡名休妻。", "她不願摯友受辱，便暗中設局阻斷婚事，卻沒有把真相說出口。司韞因此認定她毀去良緣；兩人又同時被選入東宮，昔日情誼自此變成冷眼與報復。", "馥錦默默承受司韞的怨恨，也逐漸明白沉默同樣會傷人。她不爭寵、不示弱，把未能說出的歉意藏在戲曲與花木之中；嵐容華的溫婉，並非軟弱，而是在兩難之後仍選擇保有善意。"],
    stats: { constitution: 658, strategy: 369, fortune: 452, appearance: 580 },
  },
  {
    id: "li-liangren", name: "黎栖璇", title: "黎良人", courtesy: "碧禾", image: "./assets/npc-redrawn/li-liangren-v4.webp",
    personality: "清醒通透、機敏聰慧", skilled: "畫技、女紅", unskilled: "馬術", likes: "知恩圖報", dislikes: "卑鄙小人", history: "侍妾 → 穎淑容 → 黎良人",
    summary: "入東宮後始終隱忍自守；母家叛亂使其遭貶與禁足，此後在失勢與孤寂中求存。",
    story: ["栖璇與虞綰今同入東宮，自知家世與容貌都難在眾人中占先，便選擇退讓，不爭不搶地保存自己。", "漌辞即位後，她因多年相伴封為淑容。嘉珹二年黎氏叛亂，母家之罪使她被褫奪位號、降為良人並禁足一年。", "禁足期滿，她已失去恩寵與倚仗，昔日相識也多半疏遠。她仍以畫與女紅維持清醒，明白後宮無權者如卒，卻不願用卑劣手段換回位置。"],
    stats: { constitution: 599, strategy: 564, fortune: 721, appearance: 700 },
  },
];

export const portraits: PortraitOption[] = [
  { id: "consort", title: "嬪妃", name: "沈知微", src: "./assets/portrait-consort.webp", note: "從六品・婕妤", source: "official" },
  { id: "prince", title: "皇子", name: "蕭景珩", src: "./assets/portrait-prince.webp", note: "待生皇嗣", source: "official" },
  { id: "princess", title: "帝姬", name: "蕭令儀", src: "./assets/portrait-princess.webp", note: "待生皇嗣", source: "official" },
];

export const chronicle: ChronicleEntry[] = [
  { date: "今日 16:20", title: "奉天樓祈福", detail: "祈福結果獲得祥瑞籤，福氣由 374 提升至 380。", source: "每日行動・奉天樓", period: "today", place: "奉天樓", changes: [{ label: "福氣", delta: 6, before: 374, after: 380 }] },
  { date: "今日 14:05", title: "閱書院研讀", detail: "完成四書五經研讀，心計由 635 提升至 640。", source: "每日行動・閱書院", period: "today", place: "閱書院", changes: [{ label: "心計", delta: 5, before: 635, after: 640 }] },
  { date: "今日 11:32", title: "太醫院問診", detail: "調養方奏效，體質由 558 提升至 570；扣除診金 40 銀兩。", source: "每日行動・太醫院", period: "today", place: "太醫院", changes: [{ label: "體質", delta: 12, before: 558, after: 570 }, { label: "銀兩", delta: -40, before: 1880, after: 1840 }] },
  { date: "春三月・初六", title: "春宴失儀", detail: "事件審核結算：應對失當，威望由 294 降為 286。", source: "事件 E-021・奉天樓", period: "history", place: "奉天樓", changes: [{ label: "威望", delta: -8, before: 294, after: 286 }] },
  { date: "春二月・廿八", title: "晉為婕妤", detail: "內務府完成晉位，發放當月俸銀並更新可用服儀。", source: "位階異動・內務府", period: "history", place: "內務府", changes: [{ label: "銀兩", delta: 33, before: 1847, after: 1880 }] },
];

export const palaceActivities: PalaceActivity[] = [
  { id: "act-1008", time: "今日 16:20", place: "奉天樓", player: "沈知微", playerTitle: "婕妤", action: "今日祈福", detail: "抽得祥瑞籤，完成本日一次祈福。", cost: "無消耗", results: ["福氣 +6"], tone: "gold" },
  { id: "act-1007", time: "今日 16:03", place: "奉天樓", player: "蘇明徽", playerTitle: "婕妤", action: "今日祈福", detail: "春祭前於奉天樓祈福，獲得雙項增益。", cost: "俸祿 80", results: ["容貌 +1%", "體質 +1%"], tone: "gold" },
  { id: "act-1006", time: "今日 15:18", place: "觀仙台", player: "顧清和", playerTitle: "良人", action: "御花園抽籤", detail: "使用今日三次共享抽籤額度之一。", cost: "俸祿 150", results: ["容貌 +8", "威望 +20"], tone: "jade" },
  { id: "act-1005", time: "今日 14:05", place: "閱書院", player: "沈知微", playerTitle: "婕妤", action: "研讀經書", detail: "完成今日第一次研讀。", cost: "無消耗", results: ["心計 +5"], tone: "jade" },
  { id: "act-1004", time: "今日 13:42", place: "宮市", player: "林照月", playerTitle: "美人", action: "購買月華", detail: "購得可增加體質的宮市道具。", cost: "俸祿 600", results: ["月華 +1"], tone: "red" },
  { id: "act-1003", time: "今日 11:32", place: "太醫院", player: "沈知微", playerTitle: "婕妤", action: "請平安脈", detail: "調養方奏效，完成本日問診。", cost: "俸祿 40", results: ["體質 +12"], tone: "ink" },
  { id: "act-1002", time: "今日 10:48", place: "藏書閣", player: "蘇明徽", playerTitle: "婕妤", action: "抽取自戲題目", detail: "抽得題目〈雨夜宮燈〉，尚待投稿。", cost: "無消耗", results: ["題籤 +1"], tone: "ink" },
  { id: "act-1001", time: "昨日 21:10", place: "觀仙台", player: "陸晚晴", playerTitle: "才人", action: "太液池抽籤", detail: "抽得威望獎勵。", cost: "無消耗", results: ["威望 +80"], tone: "jade" },
];

export const staffMembers = [
  { name: "Max", role: "主系統／服主", duty: "伺服器、規則與最終裁決", online: "在線" },
  { name: "顧和", role: "掌事", duty: "人設審核與新人引導", online: "5 分鐘前" },
  { name: "林月", role: "司庫", duty: "俸祿、宮市與道具", online: "12 分鐘前" },
  { name: "楚安", role: "典儀", duty: "位階、封號與服儀", online: "18 分鐘前" },
  { name: "江停雲", role: "司簿", duty: "事件、投稿與歷程覆核", online: "26 分鐘前" },
  { name: "柳如晦", role: "主線執事", duty: "故事與活動內容", online: "39 分鐘前" },
  { name: "許令儀", role: "秩序執事", duty: "玩家秩序與申訴", online: "1 小時前" },
  { name: "裴知白", role: "皇嗣執事", duty: "侍寢、待生與出生", online: "2 小時前" },
  { name: "陸青禾", role: "美術執事", duty: "圖片與立繪審核", online: "今日 09:12" },
  { name: "沈硯", role: "技術執事", duty: "網站與資料維運", online: "昨日 23:48" },
];

export const playerProfiles: PlayerProfile[] = [
  { id: "P-0186", name: "沈知微", title: "從六品・婕妤", image: portraits[0].src, onlineMinutes: 0, onlineLabel: "在線", status: "安好", stats: { constitution: 570, strategy: 640, appearance: 820, fortune: 380 }, activities: palaceActivities.filter((x) => x.player === "沈知微") },
  { id: "P-0142", name: "蘇明徽", title: "從六品・婕妤", image: portraits[0].src, onlineMinutes: 3, onlineLabel: "3 分鐘前", status: "安好", stats: { constitution: 612, strategy: 582, appearance: 736, fortune: 668 }, activities: palaceActivities.filter((x) => x.player === "蘇明徽") },
  { id: "P-0201", name: "顧清和", title: "正七品・良人", image: portraits[0].src, onlineMinutes: 8, onlineLabel: "8 分鐘前", status: "安好", stats: { constitution: 430, strategy: 715, appearance: 590, fortune: 426 }, activities: palaceActivities.filter((x) => x.player === "顧清和") },
  { id: "P-0197", name: "林照月", title: "正六品・美人", image: portraits[0].src, onlineMinutes: 14, onlineLabel: "14 分鐘前", status: "調養中", stats: { constitution: 388, strategy: 528, appearance: 812, fortune: 344 }, activities: palaceActivities.filter((x) => x.player === "林照月") },
  { id: "P-0178", name: "陸晚晴", title: "從七品・才人", image: portraits[0].src, onlineMinutes: 27, onlineLabel: "27 分鐘前", status: "安好", stats: { constitution: 685, strategy: 447, appearance: 625, fortune: 533 }, activities: palaceActivities.filter((x) => x.player === "陸晚晴") },
  { id: "P-0210", name: "蕭景珩", title: "皇子・待生", image: portraits[1].src, onlineMinutes: 42, onlineLabel: "42 分鐘前", status: "待生", stats: { constitution: 0, strategy: 0, appearance: 0, fortune: 0 }, activities: [] },
  { id: "P-0208", name: "蕭令儀", title: "帝姬・待生", image: portraits[2].src, onlineMinutes: 65, onlineLabel: "1 小時前", status: "待生", stats: { constitution: 0, strategy: 0, appearance: 0, fortune: 0 }, activities: [] },
  { id: "P-0135", name: "程含章", title: "正五品・昭儀", image: portraits[0].src, onlineMinutes: 96, onlineLabel: "1 小時前", status: "禁足中", stats: { constitution: 522, strategy: 803, appearance: 654, fortune: 272 }, activities: [] },
  { id: "P-0128", name: "阮明珠", title: "從五品・修儀", image: portraits[0].src, onlineMinutes: 180, onlineLabel: "3 小時前", status: "安好", stats: { constitution: 744, strategy: 601, appearance: 781, fortune: 612 }, activities: [] },
  { id: "P-0116", name: "周令嫻", title: "正四品・婉儀", image: portraits[0].src, onlineMinutes: 325, onlineLabel: "5 小時前", status: "染恙", stats: { constitution: 176, strategy: 690, appearance: 705, fortune: 411 }, activities: [] },
  { id: "P-0102", name: "謝蘭因", title: "從四品・容華", image: portraits[0].src, onlineMinutes: 480, onlineLabel: "8 小時前", status: "安好", stats: { constitution: 809, strategy: 765, appearance: 844, fortune: 702 }, activities: [] },
  { id: "P-0094", name: "溫如玉", title: "正三品・貴嬪", image: portraits[0].src, onlineMinutes: 1440, onlineLabel: "昨日", status: "請假", stats: { constitution: 460, strategy: 882, appearance: 792, fortune: 590 }, activities: [] },
];

export const marketItems: MarketItem[] = [
  { category: "媚", name: "流彩暗花雲錦裙", price: 500, effect: "侍寢自戲達 300 字並於兩日內交件，可晉升一位。", risk: "moderated" },
  { category: "媚", name: "縷金挑線紗裙", price: 500, effect: "侍膳自戲達 300 字並於兩日內交件，可晉升一階。", risk: "moderated" },
  { category: "媚", name: "銀紋繡百蝶度花裙", price: 100, effect: "抵銷一次侍寢抽籤的不良結果。" },
  { category: "媚", name: "雲紋縐紗袍", price: 150, effect: "抵銷一次侍膳抽籤的不良結果。" },
  { category: "媚", name: "紫綃翠紋裙", price: 400, effect: "侍膳／侍寢抽得好籤時，使獎勵翻倍。", risk: "moderated" },
  { category: "輔", name: "雲近香髻", price: 1000, effect: "邀請一名新玩家後可晉升二階；限從三品以下。", risk: "moderated" },
  { category: "輔", name: "涵煙芙蓉髻", price: 200, effect: "當日可獲皇帝點選侍寢一次。", risk: "moderated" },
  { category: "輔", name: "朝陽五鳳髻", price: 200, effect: "當日可獲 NPC 點選侍膳一次。", risk: "moderated" },
  { category: "欺", name: "金鑲珠石雲蝠簪", price: 600, effect: "侍寢滿一次即可抽取孕籤。", risk: "moderated" },
  { category: "欺", name: "嵌寶石白玉扁方", price: 800, effect: "嘗試偷取其他玩家一件道具。", risk: "danger" },
  { category: "欺", name: "翠鑲碧璽花扁方", price: 800, effect: "取得五日二字封號，期間增加 300 威望。", risk: "moderated" },
  { category: "欺", name: "鐧鍍金鳳簪", price: 400, effect: "忽略第一次抽籤內容並重抽一次。", risk: "moderated" },
  { category: "毒", name: "鬼鶴一品紅", price: 2000, effect: "原規則為致死毒物；正式版必須由管理員裁決。", risk: "danger" },
  { category: "毒", name: "鶴頂紅", price: 1500, effect: "沒收目標道具；無道具則降二階。", risk: "danger" },
  { category: "毒", name: "紅塵粉", price: 1500, effect: "清空目標威望；無威望則降三階。", risk: "danger" },
  { category: "毒", name: "紅花", price: 1000, effect: "原規則為奪取皇嗣；正式版必須由管理員裁決。", risk: "danger" },
  { category: "毒", name: "苦杏仁", price: 500, effect: "使目標三日內無法侍膳。", risk: "danger" },
  { category: "毒", name: "曼陀羅", price: 800, effect: "使目標三日內無法侍寢。", risk: "danger" },
  { category: "毒", name: "牽機藥", price: 800, effect: "使目標七日內無法使用道具。", risk: "danger" },
  { category: "毒", name: "七星海棠", price: 950, effect: "褫奪目標封號並套用威望懲罰。", risk: "danger" },
  { category: "毒", name: "鴆酒", price: 1300, effect: "使目標降四階。", risk: "danger" },
  { category: "毒", name: "斷腸草", price: 400, effect: "使目標三日內不可晉升。", risk: "danger" },
  { category: "解", name: "白蔻", price: 1600, effect: "解除鬼鶴一品紅。" },
  { category: "解", name: "沉香", price: 1000, effect: "解除鶴頂紅或鴆酒。" },
  { category: "解", name: "崖香", price: 1000, effect: "解除紅塵粉。" },
  { category: "解", name: "雪見", price: 1100, effect: "解除紅花。" },
  { category: "解", name: "蔓菁", price: 800, effect: "解除苦杏仁。" },
  { category: "解", name: "青黛", price: 1000, effect: "解除曼陀羅或斷腸草。" },
  { category: "解", name: "凌霄", price: 1100, effect: "解除牽機藥。" },
  { category: "解", name: "箬蘭", price: 800, effect: "解除七星海棠。" },
  { category: "解", name: "澤蘭", price: 1500, effect: "解除鬼鶴一品紅以外的任何毒藥。" },
  { category: "其", name: "相思囊", price: 950, effect: "遭鬼鶴一品紅時保留積分與道具。" },
  { category: "其", name: "若隱若現", price: 600, effect: "三日內免受其他玩家下毒。" },
  { category: "其", name: "藍月景明簪", price: 360, effect: "待生皇嗣可依使用順序優先出生。", risk: "moderated" },
  { category: "其", name: "月華", price: 600, effect: "體質增加 8 點。" },
  { category: "其", name: "皎儀", price: 800, effect: "心計增加 8 點。" },
  { category: "其", name: "跦憶", price: 700, effect: "容貌增加 6 點。" },
  { category: "其", name: "淚錦", price: 700, effect: "福氣增加 5 點。" },
  { category: "其", name: "靖年", price: 600, effect: "由五名嫌疑人中找尋下毒者。", risk: "moderated" },
  { category: "其", name: "靖落", price: 800, effect: "由四名嫌疑人中找尋下毒者。", risk: "moderated" },
  { category: "其", name: "靖華", price: 1000, effect: "由三名嫌疑人中找尋下毒者。", risk: "moderated" },
];
