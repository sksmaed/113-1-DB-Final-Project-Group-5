const { Op } = require("sequelize");
const db = require("../models");
const Exhibition = db.exhibition;
const Room = db.room;
const Host = db.host;
const Volunteer = db.volunteer;
const Sponsor = db.sponsor;
const Staff = db.staff;
const VolunteerWork = db.exhVolunteer;
const ExhSponsor = db.exhSponsor;
const ExhStaffDuty = db.exhStaffDuty;

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

module.exports = { addVolunteerRecord, addSponsorRecord, addStaffDutyRecord };
