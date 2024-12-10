module.exports = (sequelize, Sequelize) => {
    const exhSponsor = sequelize.define("sponsor_exh", {
      exh_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      spon_name: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      amount: {
        type: Sequelize.STRING,
      },
    },
    {
      tableName: "sponsor_exh",
      timestamps: false,
    });
    return exhSponsor;
  };
  