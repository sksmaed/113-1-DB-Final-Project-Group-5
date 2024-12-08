const { Op } = require("sequelize");
const db = require("../models");
const Exhibition = db.exhibition;
const Room = db.room;
const Host = db.host;
const Volunteer = db.volunteer;
const Sponsor = db.sponsor;
const Staff = db.staff;

const search = (req, res) => {
    Exhibition.findAll({ 
        attributes: ['exh_id', 'exhName', 'start_date', 'end_date'],
        include: [
            {
                model: Host,
                attributes: ['host_name'],
            },
            {
                model: Room,
                attributes: ['rName'],
            },
        ], 
    }).then(exh => {
        res.json(exh);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

const filterExhibitions = (req, res) => {
  const { year, month, room, host } = req.query;

  // 建立篩選條件
  const whereConditions = {};
  if (year) {
    whereConditions.start_date = {
      [Op.gte]: new Date(`${year}-01-01`),
      [Op.lte]: new Date(`${year}-12-31`),
    };
  }
  if (month) {
    const startMonth = `${year}-${String(month).padStart(2, "0")}-01`;
    const endMonth = new Date(startMonth);
    endMonth.setMonth(endMonth.getMonth() + 1); // 下一個月的第一天
    whereConditions.start_date = {
      [Op.gte]: new Date(startMonth),
      [Op.lt]: endMonth,
    };
  }

  // 加入展廳和舉辦單位的條件
  const includeConditions = [];
  if (room) {
    includeConditions.push({
      model: Room,
      where: {
        rname: {
          [Op.like]: `%${room}%`,
        },
      },
    });
  }
  if (host) {
    includeConditions.push({
      model: Host,
      where: {
        host_name: {
          [Op.like]: `%${host}%`,
        },
      },
    });
  }

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


module.exports = { search, filterExhibitions, getVolunteersByExhId, getSponsorsByExhId, getStaffsByExhId };