const router = require("express").Router();
const { searchExhUser, filterExhibitions, getVolunteersByExhId, getSponsorsByExhId, 
    getStaffsByExhId, getStaffById, findAll, getTicket, getTicketAdmin } = require("../services/query.service");

router.get("/find-all", findAll);
router.get("/find-exh-user", searchExhUser);
router.get("/filter-exh", filterExhibitions);
router.get("/find-vol/:exh_id", getVolunteersByExhId);
router.get("/find-spon/:exh_id", getSponsorsByExhId);
router.get("/find-staff-exh/:exh_id", getStaffsByExhId);
router.get("/find-staff/:s_id", getStaffById);
router.get("/find-ticket", getTicket);
router.get("/find-ticket-admin", getTicketAdmin);

module.exports = router;