const router = require("express").Router();
const { updateExhibition, updateVolunteer, updateSponsor, updateStaffDuty, updateStaff, updateTicket } = require("../services/edit.service");

router.put('/update-exh/:exh_id', updateExhibition);
router.put('/update-vol/:exh_id', updateVolunteer);
router.put('/update-spon/:exh_id', updateSponsor);
router.put('/update-staff-duty/:exh_id', updateStaffDuty);
router.put('/update-staff/:s_id', updateStaff);
router.put('/update-ticket/:t_id', updateTicket);

module.exports = router;