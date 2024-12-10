const router = require("express").Router();
const { addVolunteerRecord, addSponsorRecord, addStaffDutyRecord, addExhibition, addTransaction, addTicket } = require("../services/add.service");

router.post('/add-exh', addExhibition);
router.post('/add-vol', addVolunteerRecord);
router.post('/add-spon', addSponsorRecord);
router.post('/add-staff-duty', addStaffDutyRecord);
router.post('/add-tran', addTransaction);
router.post('/add-ticket', addTicket);

module.exports = router;