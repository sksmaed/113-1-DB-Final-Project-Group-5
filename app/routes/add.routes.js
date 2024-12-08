const router = require("express").Router();
const { addVolunteerRecord, addSponsorRecord, addStaffDutyRecord } = require("../services/add.service");

router.post('/add-vol', addVolunteerRecord);
router.post('/add-spon', addSponsorRecord);
router.post('/add-staff-duty', addStaffDutyRecord);

module.exports = router;