const router = require("express").Router();
const queryService = require("../services/query.service");

router.get("/findall", queryService.search);
router.get("/filter-exh", queryService.filterExhibitions);

module.exports = router;