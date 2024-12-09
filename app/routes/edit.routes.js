const router = require("express").Router();
const { updateExhibition, updateVolunteer, updateSponsor, updateStaffDuty, updateStaff } = require("../services/edit.service");

router.put('/update-exh/:exh_id', updateExhibition);
router.put('/update-vol/:exh_id', updateVolunteer);
router.put('/update-spon/:exh_id', updateSponsor);
router.put('/update-staff-duty/:exh_id', updateStaffDuty);
router.put('/update-staff/:s_id', updateStaff);

module.exports = router;