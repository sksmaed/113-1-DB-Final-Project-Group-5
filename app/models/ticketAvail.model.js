module.exports = (sequelize, Sequelize) => {
    const ticketAvail = sequelize.define("ticket_avail", {
      t_id: {
        type: Sequelize.STRING,
        primaryKey: true
      },
      r_id: {
        type: Sequelize.STRING,
        primaryKey: true
      }
    },
    {
      tableName: "ticket_avail",
      timestamps: false,
    });
    return ticketAvail;
  };
  