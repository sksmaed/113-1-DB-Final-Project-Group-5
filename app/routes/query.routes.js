const router = require("express").Router();
const queryService = require("../services/query.service");

router.get("/findall", queryService.search);
router.get("/filter-exh", queryService.filterExhibitions);
router.get("/find-vol/:exh_id", queryService.getVolunteersByExhId);
router.get("/find-spon/:exh_id", queryService.getSponsorsByExhId);
router.get("/find-staff/:exh_id", queryService.getStaffsByExhId);

module.exports = router;