module.exports = (sequelize, Sequelize) => {
    const Host = sequelize.define("host", {
      host_name: {
        type: Sequelize.STRING,
        primaryKey: true,
      }
    },
    {
      tableName: "host",
      timestamps: false,
      id: false,
    });
    return Host;
  };
  