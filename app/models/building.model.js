module.exports = (sequelize, Sequelize) => {
    const Building = sequelize.define("building", {
      b_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      b_name: {
        type: Sequelize.STRING
      },
      address: {
        type: Sequelize.STRING
      },
    },
    {
      tableName: "building",
      timestamps: false
    });
    return Building;
};