# 首爾口袋筆記

給 2026/10/9 晚間至 10/13 早上旅行使用的繁體中文靜態網站。整理 60 個指定連結，提供 29 則旅遊筆記、19 項可勾選採買清單、已納入航班及診所的行程、機場流程與來源閱讀紀錄。

## 直接開啟

下載或解壓縮整個專案，用瀏覽器開啟 `index.html` 即可。不需要 npm、API 金鑰或後端。清單、路線與来源資料都在本機；照片、地圖、原文與官方即時資料需要網路。這不是離線 PWA，請勿假設只開過一次網址就能離線使用。

也可在此資料夾執行 `python -m http.server 8765`，再開啟 `http://localhost:8765/`。

## 放上 GitHub Pages

1. 在 GitHub 建立 repository，例如 `seoul-pocket-guide`。一般免費方案可使用公開 repository。
2. 將此資料夾內的檔案上傳至 repository 根目錄，確保 `index.html` 在第一層，不要只上傳 ZIP 或再包一層資料夾。
3. 前往 **Settings → Pages → Build and deployment**。
4. Source 選 **Deploy from a branch**，Branch 選 **main**，資料夾選 **/(root)**，按 Save。
5. 等待 Pages 顯示部署完成後，開啟該頁提供的網址。專案網址通常為 `https://你的帳號.github.io/seoul-pocket-guide/`。

目前只提供可部署檔案，未替你建立 GitHub repository 或實際發布。以上設定參考 [GitHub 官方文件](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

## 使用與維護

- 搜尋店名、商品或韓文地址，搭配地區與內容類型篩選。
- 星號收藏保留在目前瀏覽器的 localStorage；不同手機、網域或本機檔案不會同步。無法儲存時會顯示提示。
- NAVER 按鈕是店名／地址搜尋，不是假造的精準商家 ID；請核對分店後導航。
- `data.js` 保存全部內容。`research/source-audit.json` 是 60 則來源的可攜式閱讀紀錄；修改來源資料時需同步。
- 價格均標示為貼文歷史案例，未核實的快閃、時段與商品型號明確保留不確定性。按讚與留言數不轉成評分。
- 航班、住宿地址、10/11 11:00 診所預約已由使用者確認；台灣去程起飛 17:30 為台灣時間，其餘行程為韓國時間。交通班次、預算、商品色號與庫存尚未確認。

## 檢查

有 Node.js 時，在此目錄執行：

```sh
node scripts/check.mjs
node --check app.js
```

檢查來源數量與 ID、卡片引用、地區篩選、旅行日期、外連協定及來源紀錄一致性；並對搜尋、收藏篩選、HTML 跳脫與儲存失敗路徑做少量斷言。瀏覽器人工驗證另涵蓋版面與操作。

## 來源與圖片

資料核對日：2026/10/08。所有 60 個原始網址皆有嘗試開啟；52 則取得部分或完整內容，8 則失效或無法取得。不宣稱讀完每一篇的所有圖像、影片及全部留言，實際範圍逐筆列在來源頁。

本專案只有整理摘要與原文連結，未附社群貼文全文或複製其圖片。原筆記的 DUO 卸妝膏與免稅店樓層表未附來源，未當作已核實資訊。

景福宮照片：[Basile Morin / Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Front_view_of_the_Imperial_Throne_Hall_Geunjeongjeon_at_Gyeongbokgung_Palace_with_blue_sky_in_Seoul.jpg)，[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)，以 CSS 裁切顯示。網頁直接連結 Wikimedia 圖片；若該服務無法載入，文字指南仍可使用。
"# seoul-pocket-guide" 
"# seoul-pocket-guide" 

## 10/09 個人行程更新

已加入 LJ738 台中出發、LJ735 07:55 回程、Vinetree 新林三晚、ODE 預約及 10/12 機場過夜計畫。初版 60 則來源核對日仍為 10/08；新連結與個人安排核對日為 10/09，未假稱全部舊資料重新驗證。

19 項採買勾選與收藏共用現有瀏覽器儲存，不上傳伺服器。網站檔案本身包含住宿、航班及醫美意向，公開 GitHub Pages 也會公開這些資料；需要私用時可直接在本機開啟，或先刪除敏感行程再發布。

療程僅是諮詢清單，不提供劑量、能量或同日組合醫囑；美容醫療退稅依現行韓國法條核對，不能與一般購物退稅混用。
