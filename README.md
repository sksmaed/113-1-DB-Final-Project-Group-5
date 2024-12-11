# 113-1-DB-Final-Project-Group-5
一個簡易博物館展覽與購票系統

## 執行方式
1. 開啟 pdAdmin 4 匯入指定的 Museum.backup 檔。
2. 變更 pgAdmin 密碼（非必要，若無法執行可以嘗試）：在 pgAdmin 輸入 ```ALTER USER postgre WITH PASSWORD '<postgre_password>';``` ，password 在 .env 檔。
3. 在專案跟目錄下開啟終端機，輸入以下指令：
<pre>node server.js # 啟動後端伺服器 
cd museum-webpage # 切換到放置前端框架的資料夾 
ng serve -o # 啟動網頁</pre>
4. 在網址最後面輸入```home```。

## 其他事項說明
1. 要註冊管理員可以變更網址至```/register```，否則不會顯示管理者面板。
2. 交易紀錄分析的長條圖若非常小可以透過重新載入頁面解決。
