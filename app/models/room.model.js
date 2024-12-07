module.exports = (sequelize, Sequelize) => {
    const Room = sequelize.define("room", {
      r_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      rname: {
        type: Sequelize.STRING
      },
      usage: {
        type: Sequelize.CHAR
      },
      floor: {
        type: Sequelize.INTEGER
      },
      area: {
        type: Sequelize.INTEGER
      },
      height: {
        type: Sequelize.INTEGER
      },
      b_id: {
        type: Sequelize.STRING
      },
      rent_cost: {
        type: Sequelize.INTEGER
      },
    },
    {
      tableName: "room",
      timestamps: false
    });
    return Room;
};