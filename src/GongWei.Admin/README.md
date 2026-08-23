# GongWei.Admin

宮闈浮生管理後台的 ASP.NET Core 10 MVC／Razor 前端。正式站台預定為 `https://gongwei-admin.miglow.vip/`，部署於 IIS，與公開玩家前端完全分離。

## 目前交付

- 管理總覽：待審數量、工作隊列、近期 Audit。
- 建角審核列表。
- 場景與籤池：6 個場景、44 支籤的完整管理介面。
- 場景設定：顯示名稱、引導者稱呼、戲文字數門檻、玩家可見獎勵概述、文案、每日限制。
- 籤設定：玩家可見籤名、結算揭露文字、多重隱藏效果、排序、啟停、版本與異動理由。
- NPC 列表、遊戲設定摘要、永久 Audit Log。
- Cookie Authentication、Policy-based RBAC、全域 AntiForgery、樂觀鎖定欄位與異動理由欄位。
- RWD 管理介面，不使用外部 CDN。

## 本機預覽

```powershell
dotnet run --project src/GongWei.Admin/GongWei.Admin.csproj
```

Development 的 `AdminUi:EnablePreviewUser=true` 會建立本機 `super_admin` 預覽身分；`PreviewAdminUiApplication` 的資料只存在記憶體。Production 不得以此類別作為正式資料來源。

## 後端整合點

`IAdminUiApplication` 是 UI 與正式 Application Layer 的界面。後端開發者必須：

1. 讓 `GongWei.Admin` 參考 `GongWei.Application` 與 `GongWei.Infrastructure`。
2. 建立正式 adapter／facade，呼叫 Application Commands／Queries。
3. 將 `Program.cs` 的 `PreviewAdminUiApplication` DI 註冊換成正式實作。
4. 接入 LINE 管理員登入後，簽發獨立的 `gw_admin_session` Cookie，並加入 `gongwei_admin_role` claims。
5. Production 關閉 `AdminUi:EnablePreviewUser`，不得以 Loopback HTTP 呼叫 `GongWei.Api`。
6. 保持 Application transaction boundary：能力／銀兩結果、Ledger、Stats、Chronicle、Audit／Outbox 必須同交易完成。

完整交接規格：[admin_frontend_v1.0.md](../../backend-spec/admin_frontend_v1.0.md)。

## 建置驗證

```powershell
dotnet build src/GongWei.Admin/GongWei.Admin.csproj --nologo --warnaserror
```

目前版本已在 .NET SDK 10.0.302 驗證：0 warnings、0 errors。
