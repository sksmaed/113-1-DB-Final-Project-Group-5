const router = require("express").Router();
const { updateExhibition } = require("../services/edit.service");

router.put('/update-exh/:exh_id', updateExhibition);

module.exports = router;