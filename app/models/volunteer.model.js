module.exports = (sequelize, Sequelize) => {
    const Volunteer = sequelize.define("volunteer", {
      v_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      v_name: {
        type: Sequelize.STRING
      },
    },
    {
      tableName: "volunteer",
      timestamps: false
    });
    return Volunteer;
};