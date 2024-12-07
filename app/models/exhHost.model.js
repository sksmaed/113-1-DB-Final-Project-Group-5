module.exports = (sequelize, Sequelize) => {
    const exhHost = sequelize.define("host_exhibition", {
      exh_id: {
        type: Sequelize.STRING
      },
      host_name: {
        type: Sequelize.STRING
      }
    },
    {
      tableName: "host_exhibition",
      timestamps: false
    });
    return exhHost;
  };
  