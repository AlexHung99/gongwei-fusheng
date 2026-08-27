# 宮闈浮生管理後台前端交接規格 v1.1

> 文件版本：1.1.0<br>
> 更新日期：2026-08-27<br>
> 技術：ASP.NET Core 10 MVC／Razor、IIS<br>
> 正式網址：`https://gongwei-admin.miglow.vip/`<br>
> 最新程式碼：<https://github.com/AlexHung99/gongwei-fusheng/tree/main/src/GongWei.Admin>

本文件是 `GongWei.Admin` 前端程式碼的實作交接規格。資料表、Application transaction、LINE Login 與 HTTP API 的權威規則仍分別以 `schema_v1.2.sql`、`implementation_bootstrap_v1.2.md`、`line_login_v1.2.md`、`api_v1_v1.2.md` 為準。

## 1. 架構邊界

```text
Browser
  └─ HTTPS → GongWei.Admin (MVC Controller + Razor + Admin Cookie + AntiForgery)
                  └─ GongWei.Application Command / Query
                               └─ GongWei.Infrastructure → PostgreSQL / Outbox / Media
```

- Admin 是 IIS 上的獨立 ASP.NET Core Host，不放在 GitHub Pages。
- Admin 直接呼叫 Application Use Case，禁止透過 HTTP 回呼 `GongWei.Api`。
- MVC Controller 只做 Model Binding、授權、驗證與 View Mapping，不可放業務規則或直接操作 DbContext。
- 目前 UI 以 `IAdminUiApplication` 隔離後端；`PreviewAdminUiApplication` 只供 Development 畫面預覽，所有 mutation 僅在記憶體。
- Production 開工第一步是以正式 Application adapter 取代 preview DI registration。

## 2. 程式碼位置與取得方式

| 項目 | URL／路徑 |
|---|---|
| 最新後台程式碼 | <https://github.com/AlexHung99/gongwei-fusheng/tree/main/src/GongWei.Admin> |
| 本交接規格 | <https://github.com/AlexHung99/gongwei-fusheng/blob/main/backend-spec/admin_frontend_v1.0.md> |
| Application 開工規格 | <https://github.com/AlexHung99/gongwei-fusheng/blob/main/backend-spec/implementation_bootstrap_v1.2.md> |
| API Contract | <https://github.com/AlexHung99/gongwei-fusheng/blob/main/backend-spec/api_v1_v1.2.md> |
| DB Schema | <https://github.com/AlexHung99/gongwei-fusheng/blob/main/backend-spec/schema_v1.2.sql> |
| LINE Login | <https://github.com/AlexHung99/gongwei-fusheng/blob/main/backend-spec/line_login_v1.2.md> |

後端開發者應直接 pull／merge Repository 中的 `src/GongWei.Admin`，不可從已部署網站複製編譯後 HTML。

## 3. 已完成頁面

| Route | 畫面 | 需要 Policy | 本版狀態 |
|---|---|---|---|
| `/` | 今日宮務、數量卡、隊列、近期 Audit | `AnyManager` | UI、Query 介面完成 |
| `/Applications` | 建角申請列表與搜尋 | `CharacterReviewer` | UI、Query 介面完成；Approve／Return 待接 Command |
| `/Ranks` | 嬪妃／皇子／帝姬位號與建角初始能力 | `SystemConfigManager` | 標準 CRUD UI 與介面完成 |
| `/SceneActivities` | 4 個場所／6 個活動與籤池摘要 | `ContentEditor` | UI、Query 完成 |
| `/SceneActivities/Edit/{id}` | 場景資料、44 支籤、多重效果 | `ContentEditor` | UI、Query／Update／Publish 介面完成 |
| `/Npcs` | NPC 內容版本列表 | `ContentEditor` | UI、Query 介面完成；Editor 待接 CMS Commands |
| `/Settings` | 生育、贊助等正式參數摘要 | `SystemConfigManager` | UI、Query 介面完成；Update 待接 Command |
| `/Audit` | 永久 Audit Log 與搜尋 | `Auditor` | UI、Query 介面完成 |
| `/Account/AccessDenied` | 未登入／無權限說明 | Anonymous | 完成 |

「介面完成」代表 Controller、Razor、ViewModel 與 Application Port 已存在；不代表 Preview adapter 可以取代 PostgreSQL 正式實作。

## 4. 權限與登入

獨立 Admin Cookie 名稱為 `gw_admin_session`，必須設為 `Secure`、`HttpOnly`、`SameSite=Lax`，不得與玩家 API Session Cookie 共用。Production Data Protection Key Ring 必須持久化並限制 ACL。

後台登入流程：

1. 使用現有 LINE Login/OIDC 流程識別使用者，不在 Admin 保存 Channel Secret 到前端或 Cookie。
2. Callback 完成後，由 Application 查詢 active `admin_role_assignments`。
3. 無有效管理角色時不得簽發 Admin Cookie，導向 `/Account/AccessDenied`。
4. 有角色時建立獨立 Admin ClaimsPrincipal；角色 claim key 固定為 `gongwei_admin_role`。
5. 登入、登出、權限拒絕與角色異動都寫 Audit；角色撤銷後既有 Session 必須失效或於每次敏感命令重新檢查。

| Policy | 允許角色 |
|---|---|
| `AnyManager` | 任一有效管理角色 |
| `ContentEditor` | `content_editor`, `game_master`, `super_admin` |
| `CharacterReviewer` | `character_reviewer`, `game_master`, `super_admin` |
| `SystemConfigManager` | `system_config_manager`, `game_master`, `super_admin` |
| `Auditor` | `auditor`, `game_master`, `super_admin` |

所有非 GET MVC Action 套用 AntiForgery。Production 不得啟用 Development Preview User。

## 5. 場景與抽籤後台

本版內建下列管理畫面資料，用來驗證 UI 與正式 Seed 的對應。後台場所清單以 `locations` 分組，因此觀仙台只顯示一張場所卡；太液池、御花園、上林苑是卡內三個可分別編輯的活動／籤池，不得誤呈現為三個觀仙台：

| 場景 | 引導者 | 籤數 | 最低已核准戲文 |
|---|---:|---:|---:|
| 太醫院 | 大夫 | 9 | 0 |
| 閱書院 | 先生 | 10 | 0 |
| 奉天樓 | 仙者 | 10 | 0 |
| 觀仙台・太液池 | 宮女 | 5 | 100 字 |
| 觀仙台・御花園 | 籤使 | 5 | 300 字 |
| 觀仙台・上林苑 | 籤使 | 5 | 500 字 |

合計 4 個場所、6 個場景活動、44 支啟用籤。玩家主動指定一個籤名，但在結算前不得知道或由任何 Player DTO 推導籤的效果、數值與道具。

### 5.1 場景編輯欄位

- `Id`：不可變識別碼。
- `DisplayName`：玩家畫面活動名稱。
- `AttendantLabel`：大夫／先生／仙者／宮女／籤使。
- `IntroMarkdown`：進入場景文案。
- `MinimumApprovedWords`：抽籤前需累積的已核准戲文字數。
- `RewardPreview`：可對玩家公開的模糊獎勵範圍；不得包含指定籤的確切結果。
- `DailyLimit`：空值代表不限制，若設定則由 Application 依 Asia/Taipei 日界線判定。
- `Version`：樂觀鎖定版本。
- `ChangeReason`：每次儲存與發布必填，最少 3 字並寫入 Audit。

### 5.2 籤編輯欄位

- `DisplayName`：玩家可見且可指定的籤名。
- `ResultRevealText`：交易成功後才可回傳的結果文字。
- `Effects[]`：一支籤可有多個效果。後台一律顯示中文名稱，提交與儲存仍使用固定英文 code。
  - `type=stat`：`vitality → 體質`、`appearance → 容貌`、`strategy → 心計`、`luck → 福氣`、`prestige → 威望`。
  - `type=inventory`：道具 code，例如 `coupon → 優惠券`。
  - `Amount`：正整數；百分比／點數語意以權威規則與資料欄位為準，不由 UI 猜測。
- `SortOrder`、`IsEnabled`、`Version`、`ChangeReason`。

### 5.3 正式 Command 驗收

更新場景或籤時必須：

1. 以 DB RBAC 再授權，不只信任 Cookie Claim。
2. 驗證 submitted version；衝突時回傳可辨識的 concurrency error，UI 顯示重新載入提示。
3. 驗證 code、數量範圍、效果組合與外鍵。
4. 同一交易寫 revision、published pointer（若發布）、Audit 與 Outbox。
5. `ChangeReason` 不得為空，Audit 保存 before／after、actor、target、reason、request ID、occurred_at。
6. 玩家抽籤交易成功後才寫 result、Ledger、Stats、Chronicle、Audit／Outbox；任一步失敗全數 rollback。
7. Player list/detail endpoints 結算前只回 option `id/code/display_name`，不得序列化 `effects` 或 `result_reveal_text`。

### 5.4 位號 CRUD 管理

`/Ranks` 必須讀取正式 `game.ranks`，讓具 `SystemConfigManager` 權限的管理員使用標準 CRUD 流程管理：

- 清單可依角色身份篩選：全部、嬪妃 `consort`、皇子 `prince`、帝姬 `princess`；身份篩選可與品級／位號文字搜尋同時使用。
- Create：從清單右上「新增位號」進入獨立新增頁。
- Read：清單顯示身份、品級、位號、初始能力、建角可選狀態、啟用狀態與版本；可進入單筆詳細頁。
- Update：在獨立編輯頁修改品級、位號名稱、排序、威望門檻、月俸／原始年俸、名額、主位、初始能力、啟用狀態與建角可選狀態。代碼與身份建立後只讀。
- Delete：由編輯頁的危險操作區執行，需再次確認並填寫理由。系統僅邏輯刪除，將 `is_active=false` 與 `is_application_option=false`，永久保留已被參照的歷史資料。
- 位號名稱 `display_name`。
- 是否可作為建角起始位號 `is_application_option`。
- `initial_stats` 中的 `vitality`、`appearance`、`strategy`、`luck`，每項範圍 0～1000。
- `applies_to_role` 與 `code` 在新增時建立，建立後只讀；`grade_code` 與啟用狀態可於編輯頁修改。
- 威望、恩寵、銀兩固定為 0，不得由本畫面修改。
- 停用位號不可勾選為建角起始位號。

建角審核頁的起始位號下拉選單只查詢 `is_active = true AND is_application_option = true AND applies_to_role = 申請角色`。修改設定不追溯更動既有角色；新的核准交易才採用最新值。

每次新增、修改或刪除必須驗證管理員 DB RBAC；修改與刪除另驗證 submitted version。後端必須檢查代碼全局唯一、同角色位號名稱唯一、身份白名單與能力範圍，並在同一個 `ReadCommitted` 交易中寫入 Rank、Audit Log 及 Outbox。異動理由至少 3 字，Audit 保存 before／after、actor、reason、request ID 與 occurred_at。現有 schema 已包含 `is_active`、`is_application_option`、`initial_stats` 與 `version`，邏輯刪除不需要新增資料表或 Migration。

## 6. `IAdminUiApplication` 對接清單

| UI Method | 正式 Query／Command 責任 |
|---|---|
| `GetDashboardAsync` | 聚合待審建角、待審戲文、已發布活動及今日 Audit 數量 |
| `GetSceneActivitiesAsync` | 讀取後台場景摘要，包含草稿與停用數 |
| `GetSceneActivityAsync` | 讀取場景 draft、options、effects、versions |
| `UpdateSceneActivityAsync` | 儲存場景草稿並 Audit |
| `UpdateSceneOptionAsync` | 儲存單支籤及完整 effects 並 Audit |
| `PublishSceneActivityAsync` | 驗證整個籤池後原子發布 revision |
| `GetCharacterApplicationsAsync` | 管理員申請列表，含 revision 與 review note |
| `GetRankApplicationOptionsAsync` | 讀取全部位號及其建角選項、初始能力與版本 |
| `GetRankAsync` | 讀取單筆位號詳細資料 |
| `CreateRankAsync` | 新增位號；同交易 Audit／Outbox |
| `UpdateRankApplicationOptionAsync` | 更新位號名稱、建角選項與四項初始能力；同交易 Audit／Outbox |
| `DeleteRankAsync` | 邏輯刪除位號並移出建角選單；同交易 Audit／Outbox |
| `GetNpcsAsync` | NPC draft／published 摘要與版本 |
| `GetAuditAsync` | 分頁、篩選、不可變 Audit 查詢 |
| `GetGameSettingsAsync` | 目前生效的可管理設定 |

後端可保留此 interface 或以 Application DTO 取代，但 Controller 不得退回直接 SQL、DbContext 或 HTTP API 呼叫。

## 7. 尚需後端接入的功能

- 真實 LINE 管理登入、登出、Session renewal／revocation。
- Application／Infrastructure DI 與 PostgreSQL queries／commands。
- 建角 Approve、Return、補件歷程與立繪檢視。
- 位號正式 Query／Create／Update／Delete adapter；審核下拉選單須即時讀取已啟用的建角位號。
- NPC 新增、草稿、預覽、發布、回復 Revision、立繪上傳。
- 遊戲設定 Update Command。
- Audit 的伺服器端分頁、條件篩選與詳細頁。
- 正式錯誤碼到中文訊息的 mapping、媒體上傳掃描與大小／格式限制。

## 8. 建置、測試與 IIS

```powershell
dotnet build src/GongWei.Admin/GongWei.Admin.csproj --nologo --warnaserror
dotnet test --no-build
dotnet publish src/GongWei.Admin/GongWei.Admin.csproj -c Release -o artifacts/GongWei.Admin
```

本版已以 .NET SDK 10.0.302 建置通過，0 warnings、0 errors，並對 `/`、`/Applications`、`/SceneActivities`、場景編輯、`/Npcs`、`/Settings`、`/Audit` 執行 HTTP 200 smoke test。

IIS 必須配置：

- 專屬 App Pool 與最低權限 Service Identity。
- HTTPS only、HSTS、反向代理正確 forwarded headers、Request Body 限制。
- 環境變數／Secret Store 提供 DB 與 LINE Secret，不放進 Git。
- 持久化 Data Protection Key Ring 與媒體目錄；兩者 ACL 分離。
- `ASPNETCORE_ENVIRONMENT=Production`，且 `AdminUi__EnablePreviewUser=false`。
- health check 不輸出 Secret、個資或資料庫細節。

## 9. Definition of Done

- 所有 Route 在未登入、權限不足與正確角色下均有 integration test。
- 所有 POST 有 AntiForgery test；敏感 Command 有 DB RBAC test。
- 44 支籤與 6 個場景的 Seed／UI／DB code 一致。
- 玩家 API 在抽籤前無法取得任何隱藏效果；以 serialization snapshot test 固定。
- 發布、角色審核、能力／銀兩異動具 transaction rollback test 與 Audit assertion。
- concurrency conflict 不覆蓋他人修改。
- Production 不含 preview admin、不含 hard-coded credential、不呼叫 loopback API。
- Release 記錄 Git commit、Migration ID、執行者與回復步驟。
