const db = require("../models");
const { sequelize } = require('../models');
const Exhibition = db.exhibition;
const Room = db.room;
const Host = db.host;
const Staff = db.staff;
const Ticket = db.ticket;
const TicketAvail = db.ticketAvail;
const VolunteerWork = db.exhVolunteer;
const ExhSponsor = db.exhSponsor;
const ExhStaffDuty = db.exhStaffDuty;


const updateExhibition = async (req, res) => {
    const { exh_id } = req.params; // 展覽 ID
    const { exhName, start_date, end_date, rname, host } = req.body;

    const transaction = await sequelize.transaction(); // 啟動交易
    try {
        // 確認展覽是否存在並加行鎖 (FOR UPDATE)
        const exhibition = await Exhibition.findByPk(exh_id, { 
            lock: transaction.LOCK.UPDATE, 
            transaction 
        });

        if (!exhibition) {
            await transaction.rollback();
            return res.status(404).json({ message: "Exhibition not found" });
        }

        // 更新展覽基本資料
        await exhibition.update(
            {
                exhName,
                start_date,
                end_date,
            },
            { transaction }
        );

        // 更新展廳 (多對多關係)
        if (rname && Array.isArray(rname)) {
            const rooms = await Room.findAll({ 
                where: { room_id: rname },
                transaction 
            });
            if (rooms.length) {
                await exhibition.setRooms(rooms, { transaction });
            }
        }

        // 更新舉辦單位 (一對多關係)
        if (host) {
            const hostInstance = await Host.findByPk(host, { transaction });
            if (!hostInstance) {
                await transaction.rollback();
                return res.status(404).json({ message: "Host not found" });
            }
            await exhibition.setHost(hostInstance, { transaction });
        }

        // 提交交易
        await transaction.commit();
        return res.status(200).json({ message: "Exhibition updated successfully" });
    } catch (error) {
        console.error(error);

        // 回滾交易
        if (!transaction.finished) {
            await transaction.rollback();
        }

        if (!res.headersSent) {
            return res.status(500).json({ message: "Error updating exhibition", error: error.message });
        }
    }
};

// 更新志工工作紀錄
const updateVolunteer = async (req, res) => {
  const { exh_id } = req.params;
  const { volunteerId, startTime, record } = req.body;
  const utcStartTime = new Date(startTime).toISOString();

  const transaction = await sequelize.transaction();
  try {
    const volunteerWork = await VolunteerWork.findOne({
      where: {
        v_id: volunteerId,
        exh_id,
        start_time: utcStartTime,
      },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!volunteerWork) {
      await transaction.rollback();
      return res.status(404).json({ error: '工作紀錄未找到' });
    }

    await volunteerWork.update(
      {
        start_time: utcStartTime,
        end_time: record.end_time,
        duty: record.duty,
      },
      { transaction }
    );

    await transaction.commit();
    res.json({ message: '工作紀錄更新成功' });
  } catch (error) {
    console.error('更新失敗:', error);
    await transaction.rollback();
    res.status(500).json({ error: '伺服器錯誤' });
  }
};

// 更新贊助者資料
const updateSponsor = async (req, res) => {
  const { exh_id } = req.params;
  const { sponName, record } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const sponsor = await ExhSponsor.findOne({
      where: {
        spon_name: sponName,
        exh_id,
      },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!sponsor) {
      await transaction.rollback();
      return res.status(404).json({ error: '贊助紀錄未找到' });
    }

    await sponsor.update({ amount: record.amount }, { transaction });

    await transaction.commit();
    res.json({ message: '贊助紀錄更新成功' });
  } catch (error) {
    console.error('更新失敗:', error);
    await transaction.rollback();
    res.status(500).json({ error: '伺服器錯誤' });
  }
};

// 更新職員職責
const updateStaffDuty = async (req, res) => {
  const { exh_id } = req.params;
  const { s_id, record } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const staffDuty = await ExhStaffDuty.findOne({
      where: {
        s_id,
        exh_id,
      },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!staffDuty) {
      await transaction.rollback();
      return res.status(404).json({ error: '職責紀錄未找到' });
    }

    await staffDuty.update({ duty: record.duty }, { transaction });

    await transaction.commit();
    res.json({ message: '職責紀錄更新成功' });
  } catch (error) {
    console.error('更新失敗:', error);
    await transaction.rollback();
    res.status(500).json({ error: '伺服器錯誤' });
  }
};

// 更新職員資料
const updateStaff = async (req, res) => {
  const { s_id } = req.params;
  const { s_name, position, contract_start_date } = req.body;

  const transaction = await sequelize.transaction();
  try {
    const staff = await Staff.findOne({
      where: { s_id },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!staff) {
      await transaction.rollback();
      return res.status(404).json({ message: '職員未找到' });
    }

    staff.s_name = s_name || staff.s_name;
    staff.position = position || staff.position;
    staff.contract_start_date = contract_start_date || staff.contract_start_date;

    await staff.save({ transaction });

    await transaction.commit();
    res.status(200).json(staff);
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    res.status(500).json({ message: '無法更新職員資料', error: error.message });
  }
};

// 更新門票資料
const updateTicket = async (req, res) => {
  const { t_id } = req.params;
  let { t_name, price, sale_start_date, sale_end_date, valid_time_span, iden_name, rooms } = req.body;
  sale_start_date = new Date(sale_start_date).toISOString();
  sale_end_date = new Date(sale_end_date).toISOString();

  const transaction = await sequelize.transaction();
  try {
    const ticket = await Ticket.findOne({
      where: { t_id },
      lock: transaction.LOCK.UPDATE,
      transaction,
    });

    if (!ticket) {
      await transaction.rollback();
      return res.status(404).json({ message: '門票未找到' });
    }

    ticket.t_name = t_name || ticket.t_name;
    ticket.price = price || ticket.price;
    ticket.sale_start_date = sale_start_date || ticket.sale_start_date;
    ticket.sale_end_date = sale_end_date || ticket.sale_end_date;
    ticket.valid_time_span = valid_time_span || ticket.valid_time_span;
    ticket.iden_name = iden_name || ticket.iden_name;

    await ticket.save({ transaction });

    if (rooms && Array.isArray(rooms)) {
      await TicketAvail.destroy({ where: { t_id }, transaction });
      const newRecords = rooms.map((room) => ({ t_id, r_id: room.r_id }));
      await TicketAvail.bulkCreate(newRecords, { transaction });
    }

    await transaction.commit();
    res.status(200).json({ message: '門票與展廳更新成功', ticket });
  } catch (error) {
    console.error(error);
    await transaction.rollback();
    res.status(500).json({ message: '無法更新門票資料', error: error.message });
  }
};

module.exports = { updateExhibition, updateVolunteer, updateSponsor, updateStaffDuty, updateStaff, updateTicket };
