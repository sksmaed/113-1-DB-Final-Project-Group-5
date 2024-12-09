module.exports = (sequelize, Sequelize) => {
    const Exhibition = sequelize.define("exhibition", {
      exh_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      exhName: {
        type: Sequelize.STRING
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      }
    },
    {
      tableName: "exhibition",
      timestamps: false
    });
    return Exhibition;
};