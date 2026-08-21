# 宮闈浮生 Web 前端

依據 `前端規格書_v1.0.md` 製作的 GitHub Pages 前端，正式站位於 `https://miglow.vip/gongwei/`。

## 本機啟動

```bash
pnpm install
pnpm dev
```

正式建置：

```bash
pnpm build
```

## 目前內容

- 今日首頁、行動與宮務通知。
- 互動式宮城地圖。
- LINE Login、Cookie Session、CSRF 與登出流程。
- 正式人物、能力、銀兩、歷程、玩家名冊、NPC、事件與宮廷日曆讀取。
- 宮市購買、庫存使用與人物立繪上傳。
- 人物卷宗、能力、生涯與官方立繪切換。
- 宮市／庫存與皇嗣等模組入口。
- 獨立 ASP.NET Core 管理後台入口。
- 手機底部導覽與桌面側邊導覽。

`src/api/client.ts` 預設連線至 `https://gongwei-api.miglow.vip/api/v1`。讀取端點尚未部署或訪客未登入時，介面會明確標示並使用美術示範資料；所有寫入操作只以正式 API 回應為成功依據，不會在前端偽造扣款、庫存或數值結果。

## GitHub Pages

本專案採 Hash Router，重新整理深層頁面不需要額外的 `404.html` 回退。根目錄的 GitHub Actions Workflow 會建置 `frontend` 並發布 `frontend/dist`。

## 生成美術素材

- `public/assets/palace-hero.webp`：宮苑首頁與地圖背景。
- `public/assets/portrait-consort.webp`：官方嬪妃立繪。
- `public/assets/portrait-prince.webp`：官方皇子立繪。
- `public/assets/portrait-princess.webp`：官方帝姬立繪。

可選環境變數：

- `VITE_API_BASE_URL`：ASP.NET Core API Base URL。
- `VITE_BUY_ME_A_COFFEE_URL`：Buy Me a Coffee Creator URL，例如 `https://buymeacoffee.com/yourname`。正式版仍以後端 `/public-settings/support` 回傳值為準；未設定 Creator 前右上說明按鈕仍可顯示，但 Modal 的外部贊助 CTA 停用。

素材由內建圖片生成工具製作，再以 WebP 壓縮供網站使用；圖片不含文字，介面文案皆由 HTML 呈現。
