const db = require("../models");
const Exhibtion = db.exhibition;
const Room = db.room;
const Host = db.host;

const search = (req, res) => {
    Exhibtion.findAll({ 
        attributes: ['exh_id', 'exhName', 'start_date', 'end_date'],
        include: [
            {
                model: Host,
                attributes: ['host_name'],
            },
            {
                model: Room,
                attributes: ['rName'],
            },
        ], 
    }).then(exh => {
        res.json(exh);
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

module.exports = { search };