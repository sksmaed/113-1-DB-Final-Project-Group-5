module.exports = {
    HOST: "localhost",    // Host Name
    USER: "postgres",     // User Name
    PASSWORD: "1231123booboo",    // Password
    DB: "Museum",         // Database Name
    dialect: "postgres",  // 資料庫類別
    pool: {
      max: 10,             //　連結池中最大的 connection 數
      min: 0,
      acquire: 30000,     //　連結 Timeout 時間(毫秒)
      idle: 10000         //　連結被釋放的 idle 時間(毫秒)
    }
  };