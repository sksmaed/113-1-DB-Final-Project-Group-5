const { Op } = require("sequelize");
const db = require("../models");
const Exhibition = db.exhibition;
const Room = db.room;
const Host = db.host;
const ExhRoom = db.exhRoom;
const exhHost= db.exhHost;
const Volunteer = db.volunteer;
const Sponsor = db.sponsor;
const Staff = db.staff;
const Ticket = db.ticket;
const TicketAvail = db.ticketAvail;
const Transaction = db.transaction;
const VolunteerWork = db.exhVolunteer;
const ExhSponsor = db.exhSponsor;
const ExhStaffDuty = db.exhStaffDuty;

const generateId = (prefix) => {
  const timestampPart = Date.now().toString().slice(-4); // 獲取時間戳的最後 5 位數
  const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase(); // 生成 5 位隨機字母數字
  return `${prefix}${timestampPart}${randomPart}`; // 總共 10 個字元
};

const addExhibition = (req, res) => {
  const { exhName, start_date, end_date, rooms, hosts } = req.body;

  // Generate a unique exhibition ID
  const exh_id = generateId('EX');

  // Step 1: Check if rooms exist in the database
  const checkRoomsExist = rooms.map((roomId) => {
    return Room.findOne({ where: { r_id: roomId } });
  });

  Promise.all(checkRoomsExist)
    .then((roomResults) => {
      // Verify that all rooms exist
      if (roomResults.includes(null)) {
        return res.status(400).json({
          message: 'One or more rooms do not exist in the system.',
        });
      }

      // Step 2: Check if hosts exist in the database
      const checkHostsExist = hosts.map((host) => {
        return Host.findOne({ where: { host_name: host } });
      });

      return Promise.all(checkHostsExist).then((hostResults) => {
        return { roomResults, hostResults };
      });
    })
    .then(({ roomResults, hostResults }) => {
      // Step 3: Create the exhibition entry
      return Exhibition.create({
        exh_id,
        exhName,
        start_date,
        end_date,
      }).then((newExhibition) => {
        // Step 4: Add rooms to the exhibition_room table
        const roomPromises = rooms.map((roomId) => {
          return ExhRoom.create({
            exh_id,
            r_id: roomId,
          });
        });

        // Step 5: Add hosts to the host_exhibition table
        const hostPromises = hosts.map((host, index) => {
          if (hostResults[index] === null) {
            // Host does not exist, create it
            return Host.create({ host_name: host }).then((newHost) => {
              return exhHost.create({
                exh_id,
                host_name: newHost.host_name,
              });
            });
          } else {
            // Host exists, create the association
            return exhHost.create({
              exh_id,
              host_name: hostResults[index].host_name,
            });
          }
        });

        return Promise.all([...roomPromises, ...hostPromises]).then(() => newExhibition);
      });
    })
    .then((newExhibition) => {
      // Success response
      res.status(201).json({
        message: 'Exhibition created successfully!',
        exhibition: newExhibition,
      });
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({
        message: 'An error occurred while creating the exhibition.',
        error: error.message,
      });
    });
};

// 新增志工紀錄
const addVolunteerRecord = (req, res) => {
  const { exh_id, v_id, v_name, start_time, end_time, duty } = req.body;  

  if (!exh_id || !v_id || !v_name || !start_time || !end_time || !duty) {
    return res.status(400).send({ message: "請提供所有必要的參數 (exh_id, v_id, v_name, start_time, end_time, duty)" });
  } 

  Volunteer.findOne({
    where: { v_id }
  }).then((volunteer) => {
    // 2. 若無此志工，則新增志工資料
    if (!volunteer) {
      return Volunteer.create({
        v_id,
        v_name,
      });
    }
    return volunteer; // 如果志工已存在，返回志工資料
  }).then(( ) => {
    // 3. 新增志工的工作紀錄到 volunteer_work 表格
    return VolunteerWork.create({
      exh_id,
      v_id,
      start_time,
      end_time,
      duty,
    });
  }).then((volunteerWork) => {
    // 回傳成功訊息和新增的資料
    res.status(201).send({
      message: "志工紀錄已成功新增",
      volunteerWork,
    });
  }).catch((err) => {
    console.error(err);
    res.status(500).send({
      message: "伺服器錯誤，無法新增志工紀錄",
    });
  });
};

const addSponsorRecord = (req, res) => {
  const { exh_id, spon_name, date, amount } = req.body;  

  if (!exh_id || !spon_name || !date || !amount) {
    return res.status(400).send({ message: "請提供所有必要的參數 (exh_id, spon_name, date, amount)" });
  } 

  Sponsor.findOne({
    where: { spon_name }
  }).then((sponsor) => {
    if (!sponsor) {
      return Sponsor.create({
        spon_name,
      });
    }
    return sponsor;
  }).then(( ) => {
    return ExhSponsor.create({
      exh_id,
      spon_name,
      date,
      amount,
    });
  }).then((exhSponsor) => {
    // 回傳成功訊息和新增的資料
    res.status(201).send({
      message: "贊助紀錄已成功新增",
      exhSponsor,
    });
  }).catch((err) => {
    console.error(err);
    res.status(500).send({
      message: "伺服器錯誤，無法新增贊助商紀錄",
    });
  });
};

const addStaffDutyRecord = (req, res) => {
  const { exh_id, s_id, duty } = req.body;  

  if (!exh_id || !s_id || !duty ) {
    return res.status(400).send({ message: "請提供所有必要的參數 (exh_id, s_id, duty)" });
  } 

  Staff.findOne({
    where: { s_id }
  }).then((staff) => {
    if (!staff) {
      res.status(404).send({
        message: "該職員編號不存在！",
      });
    }
    return staff;
  }).then(( ) => {
    return ExhStaffDuty.create({
      exh_id,
      s_id,
      duty,
    });
  }).then((exhSponsor) => {
    // 回傳成功訊息和新增的資料
    res.status(201).send({
      message: "職員工作任務紀錄已成功新增",
      exhSponsor,
    });
  }).catch((err) => {
    console.error(err);
    res.status(500).send({
      message: "伺服器錯誤，無法新增職員工作任務紀錄",
    });
  });
};

const addTransaction = (req, res) => {
  const { t_id, c_phone, payment_method, amount } = req.body;  

  if (!t_id || !c_phone || !payment_method || !amount ) {
    return res.status(400).send({ message: "請提供所有必要的參數 (t_id, c_phone, payment_method, amount)" });
  } 

  const tran_id = generateId('TR');
  const date = new Date().toISOString();

  Transaction.create({
      tran_id,
      c_phone,
      date,
      payment_method,
      t_id,
      amount
  })
  .then((response) => {
    // 回傳成功訊息和新增的資料
    res.status(201).send({
      message: "職員工作任務紀錄已成功新增",
      response,
    });
  }).catch((err) => {
    console.error(err);
    res.status(500).send({
      message: "伺服器錯誤，無法新增職員工作任務紀錄",
    });
  });
};

const addTicket = (req, res) => {
  let { t_name, price, sale_start_date, sale_end_date, valid_time_span, iden_name, rooms } = req.body;
  sale_start_date = new Date(sale_start_date).toISOString();
  sale_end_date = new Date(sale_start_date).toISOString();
  const t_id = generateId('TK');

  if (!t_name || !price || !sale_start_date || !sale_end_date || !valid_time_span || !iden_name ) {
    return res.status(400).send({ message: "請提供所有必要的參數 (t_name, price, sale_start_date, sale_end_date, valid_time_span, iden_name, rooms)" });
  } 

  Ticket.create({
    t_id, t_name, price, sale_start_date, sale_end_date, valid_time_span, iden_name,
  })
  .then((response) => {
    // 回傳成功訊息和新增的資料
    if (rooms && Array.isArray(rooms)) {
      const ticketAvailRecords = rooms.map(room => ({
        t_id,        // 使用新創建的 t_id
        r_id: room,  // room.r_id 是每個房間的 ID
      }));
      console.log(ticketAvailRecords);

      // 使用 bulkCreate 一次插入所有房間的資料
      return TicketAvail.bulkCreate(ticketAvailRecords)
        .then(() => {
          res.status(201).send({
            message: "票券更新成功",
            response,
          });
        });
    } else {
      // 如果沒有房間資料，僅返回 Ticket 創建的結果
      res.status(404).send({
        message: "未輸入展聽",
        response,
      });
    }
  }).catch((err) => {
    console.error(err);
    res.status(500).send({
      message: "伺服器錯誤，無法新增票券",
    });
  });
};

module.exports = { addExhibition, addVolunteerRecord, addSponsorRecord, addStaffDutyRecord, addTransaction, addTicket };
