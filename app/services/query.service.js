const { Op } = require("sequelize");
const db = require("../models");
const Exhibtion = db.exhibition;
const Room = db.room;
const Host = db.host;
const Exhibition = db.exhibition;

const search = (req, res) => {
    Exhibtion.findAll({ 
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
    console.log(req);
  
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

module.exports = { search, filterExhibitions };