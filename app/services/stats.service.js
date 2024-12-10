const { Op, fn, col, literal } = require("sequelize");
const db = require("../models");
const Transaction = db.transaction
const Ticket = db.ticket;
const Identity = db.identity;

const getTransStats = (req, res) => {
    const { date, identity, validTimeSpan } = req.query;
    console.log(date, identity, validTimeSpan);
    const queryConditions = {};
    if (date && date !== 'null') queryConditions.date = { [Op.eq]: new Date(date) };
    if (identity && identity !== 'null') queryConditions.identity = identity;
    if (validTimeSpan && validTimeSpan !== 'null') queryConditions.valid_time_span = validTimeSpan;
  
    Transaction.findAll({
        where: queryConditions,
        attributes: [
          [fn("COUNT", col("tran_id")), "transactionCount"],
          [fn("SUM", col("amount")), "totalTicketsSold"],
          // 使用計算的 totalRevenue = price * amount
          [literal("SUM(amount * (SELECT price FROM ticket WHERE ticket.t_id = transaction.t_id))"), "totalRevenue"]
        ]
      })
        .then((totalStats) => {
          // 票券類型數據
          Transaction.findAll({
            where: queryConditions,
            attributes: [
                [fn("SUM", col("amount")), "amount"],
                // 計算每個票券類型的收入 = price * amount
                [literal("SUM(amount * (SELECT price FROM ticket WHERE ticket.t_id = transaction.t_id))"), "totalRevenue"]
            ],
            include: [
              {
                model: Ticket,
                attributes: ["t_id", "t_name"]
              }
            ],
            group: ["ticket.t_id"]
          })
            .then((ticketStats) => {
              const totalData = totalStats[0].dataValues; // 總數據
              const ticketData = ticketStats.map((item) => ({
                t_id: item.ticket.t_id,
                t_name: item.ticket.t_name,
                amount: item.dataValues.amount,
                revenue: item.dataValues.revenue
              }));
    
              res.status(200).json({
                transactionCount: totalData.transactionCount || 0,
                totalTicketsSold: totalData.totalTicketsSold || 0,
                totalRevenue: totalData.totalRevenue || 0,
                ticketTypes: ticketData
              });
            })
            .catch((error) => {
              console.error("票券數據查詢錯誤:", error);
              res.status(500).json({ message: "無法取得票券統計資料", error: error.message });
            });
        })
        .catch((error) => {
          console.error("總數據查詢錯誤:", error);
          res.status(500).json({ message: "無法取得統計資料", error: error.message });
        });
};
  
module.exports = { getTransStats };