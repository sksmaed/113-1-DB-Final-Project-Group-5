module.exports = (sequelize, Sequelize) => {
    const roomState = sequelize.define("room_state", {
      r_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      state_name: {
        type: Sequelize.CHAR,
        primaryKey: true
      },
      start_date: {
        type: Sequelize.DATE,
        primaryKey: true
      },
      end_date: {
        type: Sequelize.DATE
      },
    },
    {
      tableName: "room_state",
      timestamps: false,
    });
    return roomState;
};