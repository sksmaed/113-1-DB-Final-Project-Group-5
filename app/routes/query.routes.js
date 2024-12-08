const router = require("express").Router();
const { search, filterExhibitions, getVolunteersByExhId, getSponsorsByExhId, getStaffsByExhId, getStaffById } = require("../services/query.service");

router.get("/findall", search);
router.get("/filter-exh", filterExhibitions);
router.get("/find-vol/:exh_id", getVolunteersByExhId);
router.get("/find-spon/:exh_id", getSponsorsByExhId);
router.get("/find-staff-exh/:exh_id", getStaffsByExhId);
router.get("/find-staff/:s_id", getStaffById);

module.exports = router;