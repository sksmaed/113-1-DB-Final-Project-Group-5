const config = require("../config/db.config.js");   // 引入資料庫連結設定檔
const Sequelize = require("sequelize");
const sequelize = new Sequelize(                    // 由資料庫連結設定檔的設定值來備置 Sequelize
  config.DB,
  config.USER,
  config.PASSWORD,
  {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,
    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);
const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.user = require("../models/user.model.js")(sequelize, Sequelize);
db.role = require("../models/role.model.js")(sequelize, Sequelize);
// 設定兩資料表的對應關係（多對多，所以會多出一個新的表 user_roles）
// 一個使用者可能有多個角色
// 一個角色也可能有多個使用者
db.role.belongsToMany(db.user, {
  through: "user_roles",
  foreignKey: "roleId",
  otherKey: "userId"
});
db.user.belongsToMany(db.role, {
  through: "user_roles",
  foreignKey: "userId",
  otherKey: "roleId"
});
db.ROLES = ["user", "admin"];
module.exports = db;