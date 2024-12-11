module.exports = (sequelize, Sequelize) => {
    const exhHost = sequelize.define("host_exhibition", {
      host_name: {
        type: Sequelize.STRING
      },
      exh_id: {
        type: Sequelize.STRING
      },
    },
    {
      tableName: "host_exhibition",
      timestamps: false
    });
    return exhHost;
  };
  