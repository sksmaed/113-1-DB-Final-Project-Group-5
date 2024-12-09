module.exports = (sequelize, Sequelize) => {
    const Identity = sequelize.define("identity", {
      iden_name: {
        type: Sequelize.INTEGER,
        primaryKey: true
      },
      info: {
        type: Sequelize.STRING
      },
    },
    {
      tableName: "identity",
      timestamps: false,
    });
    return Identity;
};
  