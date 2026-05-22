# API 路由說明文件 (API Routes Documentation)

本文件盤點了目前 API 伺服器 (apiserver) 中所設定的所有路徑 (Routes)。根據其用途，主要分為「執行特定功能」與「單純提供資料」兩大類。

---

## ⚙️ 執行特定功能的路徑 (Functional Routes)

這些路徑對應到後端特定的業務邏輯功能，會執行特定的程式運算或外部服務互動。

### 1. 圖片上傳功能
* **路徑 (Path):** `POST /api/upload`
* **對應功能 (Function):** `handleUpload` (位於 `src/controllers/upload.controller.js`)
* **功能說明:** 
  負責處理客戶端上傳圖片的功能。會驗證檔案格式（僅限圖片）及大小限制（小於 10MB），並將檔案上傳至 Google Cloud Storage (GCS)。完成後會回傳上傳成功的資訊與圖片網址。

### 2. 伺服器健康狀態檢查
* **路徑 (Path):** `GET /` 或 `GET /health`
* **對應功能 (Function):** `getHealth` (位於 `src/controllers/api.controller.js`)
* **功能說明:** 
  用來檢查 API 伺服器是否正常運行。除了回傳 `status: "ok"` 之外，還會動態去撈取目前資料庫的連線狀態以及所有可用的 API 列表清單（包含上傳路徑及所有的資料表路徑）。

### 3. 取得 API 路由說明文件
* **路徑 (Path):** `GET /api/doc`
* **對應功能 (Function):** `getDoc` (位於 `src/controllers/api.controller.js`)
* **功能說明:** 
  讀取並回傳這份 API 路由說明文件（即 `api/doc.md`）的內容，供開發者快速查閱所有的 API 端點及用途。

---

## 🗄️ 單純存放 / 提供資料的路徑 (Data Routes)

這些路徑沒有複雜的邏輯，單純用於將資料庫內的資料撈出來並回傳給客戶端。

### 1. 動態取得資料表內容
* **路徑 (Path):** `GET /api/:tableName`
* **對應功能 (Function):** `getTableData` (位於 `src/controllers/api.controller.js`)
* **存放資料說明:** 
  這是一組**動態路由**。路徑中的 `:tableName` 會直接對應到資料庫中的實際資料表名稱。當前端請求這些路徑時，伺服器只負責將該資料表（Table）內的所有資料撈出來，並以 JSON 格式提供給客戶端，用來**單純存放與展示該資料表的內容**。

  **目前資料庫中實際可用的資料路徑範例如下：**
  * `/api/categories`：存放分類相關資料。
  * `/api/comments`：存放留言相關資料。
  * `/api/report_images`：存放回報圖片的連結與關聯資料。
  * `/api/reports`：存放回報的主資料。
  * `/api/roles`：存放使用者角色相關資料。
