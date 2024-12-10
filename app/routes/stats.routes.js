const router = require("express").Router();
const { getTransStats } = require("../services/stats.service");

router.get("/get-tran-stats", getTransStats);

module.exports = router;