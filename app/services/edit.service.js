const db = require("../models");
const Exhibition = db.exhibition;
const Room = db.room;
const Host = db.host;

const updateExhibition = (req, res) => {
    const { exh_id } = req.params; // 展覽 ID
    const { exhName, start_date, end_date, rname, host } = req.body;

    // 確認展覽是否存在
    Exhibition.findByPk(exh_id)
        .then((exhibition) => {
            if (!exhibition) {
                return res.status(404).json({ message: "Exhibition not found" });
            }

            // 更新展覽基本資料
            return exhibition
                .update({
                    exhName,
                    start_date,
                    end_date,
                })
                .then(() => {
                    // 更新展廳 (多對多關係)
                    if (rname && Array.isArray(rname)) {
                        return Room.findAll({ where: { room_id: rname } }).then((rooms) =>
                            exhibition.setRooms(rooms)
                        );
                    }
                })
                .then(() => {
                    // 更新舉辦單位 (一對多關係)
                    if (host) {
                        return Host.findByPk(host).then((organizer) => {
                            if (!organizer) {
                                return res.status(404).json({ message: "Organizer not found" });
                            }
                            return exhibition.setOrganizer(organizer);
                        });
                    }
                })
                .then(() => {
                    res.status(200).json({ message: "Exhibition updated successfully" });
                });
        })
        .catch((error) => {
            console.error(error);
            res.status(500).json({ message: "Error updating exhibition", error: error.message });
        });
};

module.exports = { updateExhibition };
