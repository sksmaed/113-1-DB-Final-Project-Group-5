module.exports = (sequelize, Sequelize) => {
    const exhRoom = sequelize.define("exhibition_room", {
      exh_id: {
        type: Sequelize.STRING
      },
      r_id: {
        type: Sequelize.STRING
      }
    },
    {
      tableName: "exhibition_room",
      timestamps: false
    });
    return exhRoom;
  };
  