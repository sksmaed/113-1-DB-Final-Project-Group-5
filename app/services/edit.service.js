const db = require("../models");
const Exhibition = db.exhibition;
const Room = db.room;
const Host = db.host;

const updateExhibition = async (req, res) => {
    const { exh_id } = req.params; // 展覽 ID
    const { exhName, start_date, end_date, rname, host } = req.body;

    try {
        // 確認展覽是否存在
        const exhibition = await Exhibition.findByPk(exh_id);
        if (!exhibition) {
            return res.status(404).json({ message: "Exhibition not found" });
        }
        
        // 更新展覽基本資料
        Exhibition.update(
            {
                exhName,
                start_date,
                end_date,
            },
            { where: { exh_id } }
        )
        console.log(exhibition);
            
        // 更新展廳 (多對多關係)
        if (rname && Array.isArray(rname)) {
            const rooms = await Room.findAll({ where: { room_id: rname } });
            if (rooms.length) {
                await exhibition.setRooms(rooms);
            }
        }

        // 更新舉辦單位 (一對多關係)
        if (host) {
            const hostInstance = await Host.findByPk(host);
            if (!hostInstance) {
                return res.status(404).json({ message: "Host not found" });
            }
            await exhibition.setHost(hostInstance);
        }

        // 成功回應
        return res.status(200).json({ message: "Exhibition updated successfully" });
    } catch (error) {
        console.error(error);
        if (!res.headersSent) {
            return res.status(500).json({ message: "Error updating exhibition", error: error.message });
        }
    }
};

module.exports = { updateExhibition };
