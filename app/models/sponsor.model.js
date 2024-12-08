module.exports = (sequelize, Sequelize) => {
    const Sponsor = sequelize.define("sponsor", {
        spon_name: {
            type: Sequelize.STRING,
            primaryKey: true
        },
    },
    {
      tableName: "sponsor",
      timestamps: false
    });
    return Sponsor;
};