module.exports = (sequelize, Sequelize) => {
    const exhRoom = sequelize.define("exhibition_room", {
      exh_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      r_id: {
        type: Sequelize.STRING,
        primaryKey: true
      }
    },
    {
      tableName: "exhibition_room",
      timestamps: false,
    });
    return exhRoom;
  };
  