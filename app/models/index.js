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
    timezone: '+08:00', // 設定為台北時區
    dialectOptions: {
      timezone: 'local' // 確保使用本地時間
    },
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
db.user = require("../models/user.model.js").default(sequelize, Sequelize);
db.role = require("../models/role.model.js").default(sequelize, Sequelize);
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

db.identity = require("../models/identity.model.js")(sequelize, Sequelize);

db.ticket = require("../models/ticket.model.js")(sequelize, Sequelize);
db.ticket.belongsTo(db.identity, { foreignKey: "iden_name" });
db.identity.hasMany(db.ticket, { foreignKey: 'iden_name' });

db.transaction = require("../models/transaction.model.js")(sequelize, Sequelize);
db.transaction.belongsTo(db.ticket, { foreignKey: "t_id" });
db.ticket.hasMany(db.transaction, { foreignKey: 't_id' });

db.building = require("../models/building.model.js")(sequelize, Sequelize);

db.exhibition = require("../models/exhibition.model.js")(sequelize, Sequelize);
db.room = require("../models/room.model.js")(sequelize, Sequelize);
db.exhRoom = require("../models/exhRoom.model.js")(sequelize, Sequelize);
db.exhibition.belongsToMany(db.room, { through: db.exhRoom, foreignKey: "exh_id" });
db.room.belongsToMany(db.exhibition, { through: db.exhRoom, foreignKey: "r_id" });

db.ticketAvail = require("../models/ticketAvail.model.js")(sequelize, Sequelize);
db.ticket.belongsToMany(db.room, { through: db.ticketAvail, foreignKey: "t_id" });
db.room.belongsToMany(db.ticket, { through: db.ticketAvail, foreignKey: "r_id" });

db.room.belongsTo(db.building, { foreignKey: "b_id" });
db.building.hasMany(db.room, { foreignKey: 'b_id' });

db.roomState = require("../models/roomState.model.js")(sequelize, Sequelize);
db.roomState.belongsTo(db.room, { foreignKey: "r_id" });

db.host = require("../models/host.model.js")(sequelize, Sequelize);
db.exhHost = require("../models/exhHost.model.js")(sequelize, Sequelize);
db.exhibition.belongsToMany(db.host, { through: db.exhHost, foreignKey: "exh_id" });
db.host.belongsToMany(db.exhibition, { through: db.exhHost, foreignKey: "host_name" });

db.volunteer = require("../models/volunteer.model.js")(sequelize, Sequelize);
db.exhVolunteer = require("../models/exhVolunteer.model.js")(sequelize, Sequelize);
db.exhibition.belongsToMany(db.volunteer, { through: db.exhVolunteer, foreignKey: "exh_id" });
db.volunteer.belongsToMany(db.exhibition, { through: db.exhVolunteer, foreignKey: "v_id" });
db.exhVolunteer.belongsTo(db.exhibition, { foreignKey: "exh_id" });
db.exhVolunteer.belongsTo(db.volunteer, { foreignKey: "v_id" });

db.sponsor = require("../models/sponsor.model.js")(sequelize, Sequelize);
db.exhSponsor = require("../models/exhSponsor.model.js")(sequelize, Sequelize);
db.exhibition.belongsToMany(db.sponsor, { through: db.exhSponsor, foreignKey: "exh_id" });
db.sponsor.belongsToMany(db.exhibition, { through: db.exhSponsor, foreignKey: "spon_name" });
db.exhSponsor.belongsTo(db.exhibition, { foreignKey: "exh_id" });
db.exhSponsor.belongsTo(db.sponsor, { foreignKey: "spon_name" });

db.staff = require("../models/staff.model.js")(sequelize, Sequelize);
db.exhStaffDuty = require("./exhStaffDuty.model.js")(sequelize, Sequelize);
db.exhibition.belongsToMany(db.staff, { through: db.exhStaffDuty, foreignKey: "exh_id" });
db.staff.belongsToMany(db.exhibition, { through: db.exhStaffDuty, foreignKey: "s_id" });
db.exhStaffDuty.belongsTo(db.exhibition, { foreignKey: "exh_id" });
db.exhStaffDuty.belongsTo(db.staff, { foreignKey: "s_id" });

module.exports = db;