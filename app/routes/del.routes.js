const router = require("express").Router();
const { delExhibition, delVolunteer, delSponsor, delStaffDuty } = require("../services/del.service");

router.delete('/del-exh/:exh_id', delExhibition);
router.delete('/del-vol/:exh_id', delVolunteer);
router.delete('/del-spon/:exh_id', delSponsor);
router.delete('/del-staff-duty/:exh_id', delStaffDuty);

module.exports = router;