module.exports = (sequelize, Sequelize) => {
    const Staff = sequelize.define("staff", {
      s_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      s_name: {
        type: Sequelize.STRING
      },
      position: {
        type: Sequelize.STRING
      },
      contract_start_date: {
        type: Sequelize.DATE
      },
    },
    {
      tableName: "staff",
      timestamps: false
    });
    return Staff;
};