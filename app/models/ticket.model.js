module.exports = (sequelize, Sequelize) => {
    const Ticket = sequelize.define("ticket", {
      t_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      t_name: {
        type: Sequelize.STRING
      },
      price: {
        type: Sequelize.INTEGER
      },
      sale_start_date: {
        type: Sequelize.DATE
      },
      sale_end_date: {
        type: Sequelize.DATE
      },
      valid_time_span: {
        type: Sequelize.INTEGER
      },
      iden_name: {
        type: Sequelize.STRING
      },
    },
    {
      tableName: "ticket",
      timestamps: false
    });
    return Ticket;
};