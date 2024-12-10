export default (sequelize, Sequelize) => {
    const staffAccount = sequelize.define("staff_account", {
      s_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      password: {
        type: Sequelize.STRING
      }
    },
    {
      tableName: "staff_account",
      timestamps: false
    });
    return staffAccount;
  };
  