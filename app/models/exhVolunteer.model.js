module.exports = (sequelize, Sequelize) => {
    const exhVolunteer = sequelize.define("volunteer_work", {
      exh_id: {
        type: Sequelize.STRING
      },
      v_id: {
        type: Sequelize.STRING
      },
      start_time: {
        type: Sequelize.DATE,
      },
      end_time: {
        type: Sequelize.DATE,
      },
      duty: {
        type: Sequelize.STRING,
      },
    },
    {
      tableName: "volunteer_work",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["exh_id", "v_id"], // 複合主鍵
        }
      ]
    });
    return exhVolunteer;
  };
  