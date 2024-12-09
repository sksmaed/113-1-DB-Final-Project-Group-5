const { Op } = require("sequelize");
const db = require("../models");
const Exhibition = db.exhibition;
const Building = db.building;
const Room = db.room;
const Host = db.host;
const Volunteer = db.volunteer;
const Sponsor = db.sponsor;
const Staff = db.staff;
const Ticket = db.ticket;
const Identity = db.identity;
const ExhRoom = db.exhRoom;
const ExhHost = db.exhHost;

const findAll = (req, res) => {
  Exhibition.findAll({
    attributes: ['exhName', 'start_date', 'end_date'], // 僅選取必要欄位
    include: [
      {
        model: ExhRoom,
        attributes: [], // 不需要中間表的資料
        include: [
          {
            model: Room,
            attributes: ['rName'], // 選取展廳名稱
            include: [
              {
                model: Building,
                attributes: ['b_name'], // 選取展館名稱
              },
            ],
          },
        ],
      },
      {
        model: ExhHost,
        attributes: ['host_name'], // 選取主辦方名稱
      },
    ],
    raw: true, // 原始查詢結果
    nest: true, // 自動組織巢狀資料
  })
    .then((exhibitions) => {
      // 將查詢結果整理為所需格式
      console.log(exhibitions);
      const result = exhibitions.map((exhibition) => ({
        exhName: exhibition.exhName,
        start_date: exhibition.start_date,
        end_date: exhibition.end_date,
        rName: exhibition['exhibition_room.room.rName'],
        b_name: exhibition['exhibition_room.room.building.b_name'],
        host_name: exhibition['host.host_name'],
      }));
      res.status(200).json(result);
    })
    .catch((error) => {
      console.error('Error retrieving exhibitions:', error);
      res.status(500).json({ message: 'Failed to retrieve exhibitions', error: error.message });
    });
};

const searchExhUser = (req, res) => {
  const { isActive, usage, date, exhName, building } = req.query;
  console.log(req.query);

  // 條件初始化
  const whereExhibition = {};
  const whereRoom = {};
  const includeConditions = [];

  // 展出狀態條件
  if (isActive === "true") {
    const currentDate = new Date();
    whereExhibition[Op.and] = [
      { start_date: { [Op.lte]: currentDate } }, // 已經開始
      { end_date: { [Op.gte]: currentDate } }   // 尚未結束
    ];
  }

  // 展覽類別條件
  if (usage && usage !== 'null') {
    whereRoom.usage = type; // 'O' 或 'S'
  }

  // 展覽日期條件
  if (date && date !== 'null') {
    const specifiedDate = new Date(date);
    whereExhibition[Op.and] = whereExhibition[Op.and] || [];
    whereExhibition[Op.and].push({
      [Op.and]: [
        { start_date: { [Op.lte]: specifiedDate } }, // 已經開始
        { end_date: { [Op.gte]: specifiedDate } }    // 尚未結束
      ]
    });
  }

  // 展覽名稱條件
  if (exhName && exhName !== 'null') {
    whereExhibition.exhName = {
      [Op.like]: `%${exhName}%`
    };
  }

  //加入展館條件
  if (building && building !== "null") {
    includeConditions.push({
      model: Room,
      include: [
        {
          model: Building,
          attributes: ["b_name"], // 僅選取展館名稱
          where: {
            b_name: {
              [Op.like]: `%${building}%`,
            },
          },
        },
      ],
    });
  } else {
    includeConditions.push({
      model: Room,
      include: [
        {
          model: Building,
          attributes: ["b_name"], // 僅選取展館名稱
        },
      ],
    });
  }

  // 加入展廳資訊
  includeConditions.push({
    model: Room,
    through: ExhRoom,
    attributes: ["rName"]
  });

  // 加入主辦方資訊
  includeConditions.push({
    model: Host,
    through: ExhHost
  });

  // 查詢資料庫
  Exhibition.findAll({
    where: whereExhibition,
    include: includeConditions,
    attributes: ["exhName", "start_date", "end_date"],
  })
    .then((exhibitions) => {
      res.status(200).json(exhibitions);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "無法取得展覽資料", error: error.message });
    });
};

const filterExhibitions = (req, res) => {
  const { year, month, exhName , building, host } = req.query;
  const whereConditions = {};
  console.log(year, month);
  if (year && year !== 'null') {
    const startYear = new Date(`${year}-01-01`);
    const endYear = new Date(`${year}-12-31`);

    if (month && month !== 'null') {
      // 若指定月份，計算月份的開始與結束時間
      const startMonth = new Date(`${year}-${String(month).padStart(2, "0")}-01`);
      const endMonth = new Date(startMonth);
      endMonth.setMonth(endMonth.getMonth() + 1); // 下一個月的第一天

      // 加入範圍條件，檢查展覽是否與該月份有交集
      whereConditions[Op.and] = [
        {
          start_date: { [Op.lt]: endMonth }, // 開始時間早於該月結束
        },
        {
          end_date: { [Op.gte]: startMonth }, // 結束時間晚於該月開始
        },
      ];
    } else {
      // 若僅指定年份，檢查展覽是否與該年份有交集
      whereConditions[Op.and] = [
        {
          start_date: { [Op.lte]: endYear }, // 開始時間早於該年結束
        },
        {
          end_date: { [Op.gte]: startYear }, // 結束時間晚於該年開始
        },
      ];
    }
  }

  // 展覽名稱條件
  if (exhName && exhName !== 'null') {
    whereConditions.exhName = {
      [Op.like]: `%${exhName}%`
    };
  }

  const includeConditions = [];
  //加入展館條件
  if (building && building !== "null") {
    includeConditions.push({
      model: Room,
      include: [
        {
          model: Building,
          attributes: ["b_name"], // 僅選取展館名稱
          where: {
            b_name: {
              [Op.like]: `%${building}%`,
            },
          },
        },
      ],
    });
  } else {
    includeConditions.push({
      model: Room,
      include: [
        {
          model: Building,
          attributes: ["b_name"], // 僅選取展館名稱
        },
      ],
    });
  }
  
  if (host && host !== 'null') {
    includeConditions.push({
      model: Host,
      where: {
        host_name: {
          [Op.like]: `%${host}%`,
        },
      },
    });
  }

  // 加入展廳資訊
  includeConditions.push({
    model: Room,
    through: ExhRoom,
    attributes: ["rName"]
  });

  // 加入主辦方資訊
  includeConditions.push({
    model: Host,
    through: ExhHost
  });

  // 查詢資料庫
  Exhibition.findAll({
    where: whereConditions,
    include: includeConditions,
  })
    .then((exhibitions) => {
      res.status(200).json(exhibitions);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: "Error retrieving exhibitions", error: error.message });
    });
};

const getVolunteersByExhId = (req, res) => {
  const { exh_id } = req.params;

  // 驗證 exh_id 是否存在
  if (!exh_id) {
    return res.status(400).send({ message: "展覽 ID 未提供" });
  }

  Exhibition.findAll({
    where: { exh_id },
    attributes: ['exh_id', 'exhName'],
    include: [
      {
        model: Volunteer,
        attributes: ['v_id', 'v_name'],
        through: {
          attributes: ['start_time', 'end_time', 'duty'],
        },
      },
    ],
    raw: true, // 返回原始資料
  })
    .then((rawData) => {
      if (!rawData || rawData.length === 0) {
        return res.status(404).send({ message: "未找到相關展覽或志工資料" });
      }

      // 重組資料
      const result = rawData.reduce((acc, record) => {
        let exhibition = acc.find((exh) => exh.exh_id === record.exh_id);

        if (!exhibition) {
          exhibition = {
            exh_id: record.exh_id,
            exhName: record.exhName,
            volunteers: [],
          };
          acc.push(exhibition);
        }

        // 查找志工
        let volunteer = exhibition.volunteers.find((vol) => vol.v_id === record['volunteers.v_id']);
        if (!volunteer) {
          volunteer = {
            v_id: record['volunteers.v_id'],
            v_name: record['volunteers.v_name'],
            records: [],
          };
          exhibition.volunteers.push(volunteer);
        }

        volunteer.records.push({
          start_time: record['volunteers.volunteer_work.start_time'],
          end_time: record['volunteers.volunteer_work.end_time'],
          duty: record['volunteers.volunteer_work.duty'],
        });

        return acc;
      }, []);

      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "伺服器內部錯誤" });
    });
};

const getSponsorsByExhId = (req, res) => {
  const { exh_id } = req.params;

  // 驗證 exh_id 是否存在
  if (!exh_id) {
    return res.status(400).send({ message: "展覽 ID 未提供" });
  }

  Exhibition.findAll({
    where: { exh_id },
    attributes: ['exh_id', 'exhName'],
    include: [
      {
        model: Sponsor, // 多對多關聯的贊助商
        attributes: ['spon_name'],
        through: {
          attributes: ['date', 'amount'],
        },
      },
    ],
    raw: true, // 返回原始資料
  })
    .then((rawData) => {
      if (!rawData || rawData.length === 0) {
        return res.status(404).send({ message: "未找到相關展覽或贊助商資料" });
      }

      // 重組資料
      const result = rawData.reduce((acc, record) => {
        let exhibition = acc.find((exh) => exh.exh_id === record.exh_id);

        if (!exhibition) {
          exhibition = {
            exh_id: record.exh_id,
            exhName: record.exhName,
            sponsors: [],
          };
          acc.push(exhibition);
        }

        let sponsor = exhibition.sponsors.find((spon) => spon.spon_name === record['sponsors.spon_name']);
        if (!sponsor) {
          sponsor = {
            spon_name: record['sponsors.spon_name'],
            records: [],
          };
          exhibition.sponsors.push(sponsor);
        }

        sponsor.records.push({
          date: record['sponsors.sponsor_exh.date'],
          amount: record['sponsors.sponsor_exh.amount'],
        });

        return acc;
      }, []);

      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "伺服器內部錯誤" });
    });
};

const getStaffsByExhId = (req, res) => {
  const { exh_id } = req.params;

  // 驗證 exh_id 是否存在
  if (!exh_id) {
    return res.status(400).send({ message: "展覽 ID 未提供" });
  }

  Exhibition.findAll({
    where: { exh_id },
    attributes: ['exh_id', 'exhName'],
    include: [
      {
        model: Staff,
        attributes: ['s_name'],
        through: {
          attributes: ['duty'],
        },
      },
    ],
    raw: true, // 返回原始資料
  })
    .then((rawData) => {
      if (!rawData || rawData.length === 0) {
        return res.status(404).send({ message: "未找到相關展覽或職員資料" });
      }

      // 重組資料
      const result = rawData.reduce((acc, record) => {
        let exhibition = acc.find((exh) => exh.exh_id === record.exh_id);

        if (!exhibition) {
          exhibition = {
            exh_id: record.exh_id,
            exhName: record.exhName,
            staffs: [],
          };
          acc.push(exhibition);
        }

        let staff = exhibition.staffs.find((s) => s.s_id === record['staffs.staff_work.s_id']);
        if (!staff) {
          staff = {
            s_id: record['staffs.staff_work.s_id'],
            s_name: record['staffs.s_name'],
            records: [],
          };
          exhibition.staffs.push(staff);
        }

        staff.records.push({
          duty: record['staffs.staff_work.duty'],
        });

        return acc;
      }, []);

      res.json(result);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send({ message: "伺服器內部錯誤" });
    });
};

const getStaffById = (req, res) => {
  const { s_id } = req.params;

  Staff.findOne({
    where: { s_id }  // 根據 s_id 查詢職員
  })
  .then(staff => {
    if (!staff) {
      return res.status(404).json({ message: '職員未找到' });
    }

    res.status(200).json(staff);
  })
  .catch(error => {
    console.error(error);
    res.status(500).json({ message: '無法取得職員資料', error: error.message });
  });
};

const getTicket = (req, res) => {
  const { valid_time_span, exhName, building, identity } = req.query;
  console.log(req.query);
  const whereConditions = {};
  const currentDate = new Date().toISOString();

  // 根據 valid_time_span 進行過濾
  if (valid_time_span && valid_time_span !== 'null') {
    whereConditions.valid_time_span = valid_time_span;
  }

  // 根據身份過濾
  if (identity && identity !== 'null') {
    whereConditions.iden_name = identity;
  }

  // 查詢門票
  Ticket.findAll({
    where: whereConditions,
    include: [
      // 查詢可參觀的展覽
      {
        model: Room,
        attributes: ['rName'],
        include: [
          {
            model: Exhibition,
            attributes: ['exhName', 'start_date', 'end_date'],
            through: { attributes: [] }, // 隱藏聯結表屬性
            where: (exhName && exhName !== 'null') ? { 
              exhName: { [Op.like]: `%${exhName}%` },
              start_date: { [Op.lte]: currentDate }, // 展覽開始日期 <= 當前日期
              end_date: { [Op.gte]: currentDate }, // 展覽結束日期 >= 當前日期
            } : undefined
          },
          {
            model: Building,
            attributes: ['b_name'],
            where: (building && building !== 'null') ? { b_name: { [Op.like]: `%${building}%` } } : undefined,
          }
        ],
      },
      // 查詢身份類型
      {
        model: Identity,
        attributes: ['iden_name'],
        where: (identity && identity !== 'null') ? { iden_name: { [Op.like]: `%${identity}%` } } : undefined,
      }
    ]
  })
  .then((tickets) => {
    // 將結果格式化
    const result = tickets.map(ticket => ({
      t_id: ticket.t_id,
      t_name: ticket.t_name,       // 門票名稱
      price: ticket.price,         // 價格
      identity: ticket.iden_name,  // 適用身份
    
      exhibitions: ticket.rooms.map(room => 
        room.exhibitions.map(exh => ({
          exhName: exh.exhName,  // 展覽名稱
          start_date: exh.start_date,  // 開始日期
          end_date: exh.end_date,      // 結束日期
          building: room.building ? room.building.b_name : null,  // 展館名稱
          rName: room.rName,        // 展廳名稱
        }))
      ).flat()
    }));

    // 返回結果
    res.status(200).json(result);
  })
  .catch((error) => {
    console.error("Error retrieving tickets:", error);
    res.status(500).json({ message: "無法取得門票資料", error: error.message });
  });
};

module.exports = { findAll, searchExhUser, filterExhibitions, getVolunteersByExhId, getSponsorsByExhId, 
  getStaffsByExhId, getStaffById, getTicket };