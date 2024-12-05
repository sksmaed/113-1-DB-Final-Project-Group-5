const express = require("express");
const app =  express();
const dotenv = require("dotenv");
const cors = require("cors");
const userRoute = require("./app/routes/user.routes");
const authRoute = require("./app/routes/auth.routes");

dotenv.config();
var corsOptions = {
    origin: "http://localhost:4200"
};
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/users", userRoute);
app.use("/api/auth", authRoute);

const PORT = process.env.PORT || 5000;  // port 預設為 5000 ，並可以在 .env 檔案中進行客製化 （如：PORT＝5001）
app.listen(PORT, () => {
    console.log(`Backend server is running on port ${PORT}`);
})

const db = require("./app/models");     // 引入 app/models/index.js 匯出的程式碼(即 sequelize model 定義檔)
const Role = db.role;

// 呼叫 sync function 將會依 model 定義內容産生資料表，force 參數值為 true 將會重建已存在的資料表
/*db.sequelize.sync({ force: false }).then(() => {
    console.log('Drop and Resync Database with { force: false }');
    //initial();  // 産生資料表後，呼叫 initial function 為 roles table 新增三筆初始資料
}).catch((err) => {
    console.log(err);
});

// 為 roles table 新增三筆初始資料
function initial() {
    Role.create({
        id: 1,
        name: "user"
    });

    Role.create({
        id: 2,
        name: "admin"
    });
}*/