const db = require("../models");
const Exhibtion = db.exhibition;

const search = (req, res) => {
    Exhibtion.findAll({ attributes: ['exhName', 'start_date', 'end_date'] }).then(exh => {
        res.json(exh);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

module.exports = { search };