const router = require("express").Router();
const queryService = require("../services/query.service");

router.get("/findall", queryService.search);

module.exports = router;