module.exports = (sequelize, Sequelize) => {
    const exhVolunteer = sequelize.define("volunteer_work", {
      exh_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      v_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      start_time: {
        type: Sequelize.DATE,
        primaryKey: true
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
    });
    return exhVolunteer;
  };
  