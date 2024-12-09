module.exports = (sequelize, Sequelize) => {
    const Transaction = sequelize.define("transaction", {
      tran_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      c_phone: {
        type: Sequelize.STRING
      },
      date: {
        type: Sequelize.DATE
      },
      payment_method: {
        type: Sequelize.STRING
      },
      t_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      amount: {
        type: Sequelize.INTEGER 
      },
    },
    {
      tableName: "transaction",
      timestamps: false
    });
    return Transaction;
};