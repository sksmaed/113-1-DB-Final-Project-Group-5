const db = require("../models");
const Exhibition = db.exhibition;
const Room = db.room;
const Host = db.host;
const Staff = db.staff;
const Ticket = db.ticket;
const TicketAvail = db.ticketAvail;
const VolunteerWork = db.exhVolunteer;
const ExhSponsor = db.exhSponsor;
const ExhStaffDuty = db.exhStaffDuty;

const updateExhibition = (req, res) => {
    const { exh_id } = req.params; // 展覽 ID
    const { exhName, start_date, end_date, rname, host } = req.body;

    try {
        // 確認展覽是否存在
        const exhibition = Exhibition.findByPk(exh_id);
        if (!exhibition) {
            return res.status(404).json({ message: "Exhibition not found" });
        }
        
        // 更新展覽基本資料
        Exhibition.update(
            {
                exhName,
                start_date,
                end_date,
            },
            { where: { exh_id } }
        )
            
        // 更新展廳 (多對多關係)
        if (rname && Array.isArray(rname)) {
            const rooms = Room.findAll({ where: { room_id: rname } });
            if (rooms.length) {
              exhibition.setRooms(rooms);
            }
        }

        // 更新舉辦單位 (一對多關係)
        if (host) {
            const hostInstance = Host.findByPk(host);
            if (!hostInstance) {
                return res.status(404).json({ message: "Host not found" });
            }
            exhibition.setHost(hostInstance);
        }

        // 成功回應
        return res.status(200).json({ message: "Exhibition updated successfully" });
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            return res.status(500).json({ message: "Error updating exhibition", error: error.message });
        }
    }
};

const updateVolunteer = (req, res) => {
  const { exh_id } = req.params;
  const { volunteerId, startTime, record } = req.body;
  const utcStartTime = new Date(startTime).toISOString();

  VolunteerWork.update(
    {
      start_time: utcStartTime,
      end_time: record.end_time,
      duty: record.duty,
    },
    {
      where: {
        v_id: volunteerId,
        exh_id,
        start_time: utcStartTime, // 使用開始時間作為條件
      },
    }
  )
    .then((updated) => {
      if (updated[0] === 0) {
        return res.status(404).json({ error: '工作紀錄未找到或未更新' });
      }
      res.json({ message: '工作紀錄更新成功' });
    })
    .catch((error) => {
      console.error('更新失敗:', error);
      res.status(500).json({ error: '伺服器錯誤' });
    });
};

const updateSponsor = (req, res) => {
  const { exh_id } = req.params;
  const { sponName, record } = req.body;

  ExhSponsor.update(
  {
    amount: record.amount,
  },
  {
    where: {
      spon_name: sponName,
      exh_id,
    },
  }
)
  .then((updated) => {
    if (updated[0] === 0) {
      return res.status(404).json({ error: '工作紀錄未找到或未更新' });
    }
    res.json({ message: '工作紀錄更新成功' });
  })
  .catch((error) => {
    console.error('更新失敗:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  });
};

const updateStaffDuty = (req, res) => {
  const { exh_id } = req.params;
  const { s_id, record } = req.body;
  
  ExhStaffDuty.update(
  {
    duty: record.duty,
  },
  {
    where: {
      s_id: s_id,
      exh_id,
    },
  }
)
  .then((updated) => {
    if (updated[0] === 0) {
      return res.status(404).json({ error: '工作紀錄未找到或未更新' });
    }
    res.json({ message: '工作紀錄更新成功' });
  })
  .catch((error) => {
    console.error('更新失敗:', error);
    res.status(500).json({ error: '伺服器錯誤' });
  });
};

const updateStaff = (req, res) => {
  const { s_id } = req.params;  // 從路徑參數中取得職員ID
  const { s_name, position, contract_start_date } = req.body;  // 從請求體中取得要更新的資料
  console.log(s_id, s_name);

  // 查詢職員資料
  Staff.findOne({
    where: { s_id }  // 根據 s_id 查詢職員
  })
  .then(staff => {
    if (!staff) {
      return res.status(404).json({ message: '職員未找到' });
    }

    // 更新職員資料
    staff.s_name = s_name || staff.s_name;
    staff.position = position || staff.position;
    staff.contract_start_date = contract_start_date || staff.contract_start_date;

    // 保存更新後的職員資料
    staff.save()
      .then(updatedStaff => {
        res.status(200).json(updatedStaff);  // 回傳更新後的職員資料
      })
      .catch(error => {
        console.error(error);
        res.status(500).json({ message: '無法更新職員資料', error: error.message });
      });
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({ message: '無法取得職員資料', error: error.message });
  });
};

const updateTicket = (req, res) => {
  const { t_id } = req.params;
  let { t_name, price, sale_start_date, sale_end_date, valid_time_span, iden_name, rooms } = req.body;
  sale_start_date = new Date(sale_start_date).toISOString();
  sale_end_date = new Date(sale_start_date).toISOString();
  
  // 查詢門票資料
  Ticket.findOne({ where: { t_id } })
  .then((ticket) => {
    if (!ticket) {
      return res.status(404).json({ message: '門票未找到' });
    }
    
    // 更新門票資料
    ticket.t_name = t_name || ticket.t_name;
    ticket.price = price || ticket.price;
    ticket.sale_start_date = sale_start_date || ticket.sale_start_date;
    ticket.sale_end_date = sale_end_date || ticket.sale_end_date;
    ticket.valid_time_span = valid_time_span || ticket.valid_time_span;
    ticket.iden_name = iden_name || ticket.iden_name;

      // 保存更新後的門票資料
      return ticket.save();
    })
    .then((updatedTicket) => {
      if (rooms && Array.isArray(rooms)) {
        // 刪除原本的紀錄
        return TicketAvail.destroy({ where: { t_id } })
          .then(() => {
            // 插入新的紀錄
            const newRecords = rooms.map((room) => ({ t_id, r_id: room.r_id }));
            return TicketAvail.bulkCreate(newRecords);
          })
          .then(() => updatedTicket); // 返回更新後的門票
      }
      return updatedTicket; // 如果沒有 rooms，只返回更新後的門票
    })
    .then((updatedTicket) => {
      res.status(200).json({ message: '門票與展廳更新成功', ticket: updatedTicket });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: '無法更新門票資料', error: error.message });
    });
};

module.exports = { updateExhibition, updateVolunteer, updateSponsor, updateStaffDuty, updateStaff, updateTicket };
