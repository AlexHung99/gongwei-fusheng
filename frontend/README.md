# 宮闈浮生 Web 前端

依據 `前端規格書_v1.0.md` 製作的 GitHub Pages 靜態前端 MVP。

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
- 非同步事件房與投稿示範。
- 人物卷宗、能力、生涯與官方立繪切換。
- 宮市／庫存／關係／皇嗣等模組入口。
- 角色審核與營運管理院示範。
- 手機底部導覽與桌面側邊導覽。

目前使用 Mock Data 展示互動。`src/api/client.ts` 已保留正式 API Client；後端完成後，把 `.env.example` 複製為 `.env` 並設定 `VITE_API_BASE_URL`，再逐模組替換 Mock Data。

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
