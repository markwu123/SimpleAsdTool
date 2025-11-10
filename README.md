✳️ 功能說明

可透過 data.json 自訂義按鍵名稱。

支援 人稱／動詞／名詞 三種結構。

可切換 整句／單字 模式。

可離線使用（支援 PWA）。

🧩 使用方式
✅ 共通

使用瀏覽器開啟：
👉 https://markwu123.github.io/SimpleAsdTool/

📱 PWA APP

在 Safari 或 Google Chrome 中：
按下「分享」 → 「加入主畫面」
即可像 APP 一樣使用。

🛠️ 自行客製化

你可以下載整個專案並放到自己的網頁空間，
只要修改 data.json，即可自訂按鍵與對話內容。

⚖️ 授權說明

本專案開放於 教育與學習用途自由使用、修改與分享。

如轉載或再發佈，請保留原作者註記：

© 2025 MarkWu123

🧩 data.json 編輯說明
<details>
data.json 是用來設定溝通按鈕內容的檔案。
每個按鈕包含文字、圖片、（可選）音訊檔，依照「群組」分類。

📁 檔案結構範例
``` 
{
  "groups": [
    {
      "group": "人稱",
      "isshow": "Y",
      "data": [
        { "name": "我", "text": "我", "image": "https://cdn-icons-png.flaticon.com/512/163/163847.png", "audio": "" },
        { "name": "爸爸", "text": "爸爸", "image": "https://cdn-icons-png.flaticon.com/512/3048/3048150.png" }
      ]
    }
  ]
}
``` 
🧱 欄位說明
欄位名稱	說明	範例
group	群組名稱，例如「人稱」「動詞」「名詞」	"group": "動詞"
isshow	是否顯示該群組（Y：顯示，N：隱藏）	"isshow": "Y"
name	按鈕上顯示的文字（名稱）	"name": "要吃"
text	點擊時會念出的文字（或加入句子的文字）	"text": "要吃"
image	圖片網址（建議使用 PNG 圖示）	"image": "https://cdn-icons-png.flaticon.com/512/562/562678.png"
audio (選填)	自行錄製的 mp3 音訊網址。若留空，會用文字轉語音	"audio": "audio/eat.mp3"
🎨 新增群組

複製一整段群組區塊，修改 "group" 名稱即可。
``` 
{
  "group": "情緒",
  "isshow": "Y",
  "data": [
    { "name": "開心", "text": "我很開心", "image": "https://..." },
    { "name": "生氣", "text": "我生氣了", "image": "https://..." }
  ]
}
``` 
🔈 新增自錄音檔

錄製 mp3 檔（建議短句，例如「我要喝水」）。

放進網站的 audio/ 資料夾。

在 data.json 中指定音訊路徑：
``` 
{ "name": "喝水", "text": "我要喝水", "image": "https://...", "audio": "audio/drink.mp3" }
``` 
✅ 小提醒

圖片網址可以用 Flaticon
 找免費圖示。

若用手機無法播放音訊，請確認檔案路徑正確且有上傳。

修改後要重新整理網頁（或重新安裝 PWA app）才會看到最新內容。
</details>
更新日誌
<details>
2025/11/11 加入支援人聲，各畫面顯示與否

2025/11/10 update icon
</details>

2025/11/09 Create Project

