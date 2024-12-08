module.exports = (sequelize, Sequelize) => {
    const exhSponsor = sequelize.define("sponsor_exh", {
      exh_id: {
        type: Sequelize.STRING
      },
      spon_name: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE,
      },
      amount: {
        type: Sequelize.STRING,
      },
    },
    {
      tableName: "sponsor_exh",
      timestamps: false,
      indexes: [
        {
          unique: true,
          fields: ["exh_id", "spon_name", "date"],
        }
      ]
    });
    return exhSponsor;
  };
  