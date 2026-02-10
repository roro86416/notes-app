# Notes App 專案開發文件

本專案是一個具備會員系統、資料夾分類功能的雲端筆記應用程式。

## 🛠 技術棧 (Tech Stack)

### 後端 (Server)
- **Runtime**: Node.js (TypeScript)
- **Framework**: Express (v5.1.0)
- **ORM**: Prisma (MySQL)
- **Security**: Bcrypt (密碼雜湊), JWT (身份驗證)
- **Validation**: Zod
- **Logging**: Morgan

### 前端 (Web)
- **Framework**: Vue 3 (Composition API)
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Utilities**: VueUse

---

## 🗄 資料庫模型 (Database Schema)

根據 `schema.prisma` 定義，專案包含三個核心模型：

1. **User (使用者)**:
   - 儲存基本資料與經過雜湊的密碼。 [cite: uploaded:notes_app/server/prisma/schema.prisma]
   - 與 Folder 和 Note 為一對多關係。 [cite: uploaded:notes_app/server/prisma/schema.prisma]
2. **Folder (資料夾)**:
   - 用於分類筆記。 [cite: uploaded:notes_app/server/prisma/schema.prisma]
   - 具備 `onDelete: Cascade` 機制，使用者刪除時會同步清理。 [cite: uploaded:notes_app/server/prisma/schema.prisma]
3. **Note (筆記)**:
   - 核心內容儲存。 [cite: uploaded:notes_app/server/prisma/schema.prisma]
   - 可關聯至特定資料夾，或設為未分類 (`folderId` 為可選)。 [cite: uploaded:notes_app/server/prisma/schema.prisma]

---

## 🚦 API 路由結構

後端入口點位於 `src/index.ts`，主要路由模組包含：

- `/api/health`: 伺服器健康檢查。 [cite: uploaded:notes_app/server/src/index.ts]
- `/api/auth`: 處理登入、註冊與身份驗證。 [cite: uploaded:notes_app/server/src/index.ts]
- `/api/notes`: 筆記與資料夾的 CRUD 操作。 [cite: uploaded:notes_app/server/src/index.ts]

**全域中介軟體**:
- `corsMiddleware`: 處理跨域請求。 [cite: uploaded:notes_app/server/src/index.ts]
- `parseJwt`: 解析標頭中的 JWT Token。 [cite: uploaded:notes_app/server/src/index.ts]
- `errorHandler`: 統一錯誤處理機制。 [cite: uploaded:notes_app/server/src/index.ts]

---

## 🔐 身份驗證與路由守衛

前端透過 `Vue Router` 實作導航守衛：
- **Token 檢查**: 頁面跳轉前檢查 `localStorage` 是否有 Token，若有則呼叫 `auth.me()` 恢復登入狀態。 [cite: uploaded:notes_app/web/src/router/router.ts]
- **權限保護**: 標記為 `meta: { auth: true }` 的路由（如 Workspace）若未登入將被強制重導向至 `/login`。 [cite: uploaded:notes_app/web/src/router/router.ts]

---

## 🏃 開發指令

### 後端指令 (Server)
- `npm run dev`: 啟動開發伺服器 (tsx watch)。 [cite: uploaded:notes_app/server/package.json]
- `npm run build`: 編譯 TypeScript。 [cite: uploaded:notes_app/server/package.json]
- `npm run prisma:studio`: 開啟 Prisma 資料庫管理介面。 [cite: uploaded:notes_app/server/package.json]

### 前端指令 (Web)
- `npm run dev`: 啟動 Vite 開發環境。 [cite: uploaded:notes_app/web/package.json]
- `npm run build`: 執行生產環境編譯。 [cite: uploaded:notes_app/web/package.json]
