module.exports = (sequelize, Sequelize) => {
    const exhStaffDuty = sequelize.define("staff_work", {
      exh_id: {
        type: Sequelize.STRING
      },
      s_id: {
        type: Sequelize.STRING
      },
      duty: {
        type: Sequelize.STRING,
      },
    },
    {
      tableName: "staff_work",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["exh_id", "s_id"],
        }
      ]
    });
    return exhStaffDuty;
  };
  