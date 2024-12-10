// auth.service.js
const db = require("../models");
const sequelize = db.sequelize;
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const Staff = db.staff;
const StaffAccount = db.staffAccount;

const Op = db.Sequelize.Op;

const signup = (req, res) => {
    const { s_id, s_name, position, contract_start_date, password } = req.body;

    // 檢查必要欄位
    if (!s_id || !password || !s_name || !position || !contract_start_date) {
        return res.status(400).send({ message: "Missing required fields." });
    }

    // 加密密碼
    const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.PASS_SEC).toString();

    // 使用事務處理
    sequelize.transaction((t) => {
        // 新增到 staff 表
        return Staff.create(
            { s_id, s_name, position, contract_start_date },
            { transaction: t }
        )
            .then(() => {
                // 新增到 staff_account 表
                return StaffAccount.create(
                    { s_id, password: encryptedPassword },
                    { transaction: t }
                );
            });
    })
        .then(() => {
            res.status(201).send({ message: "Staff registered successfully!" });
        })
        .catch((err) => {
            console.error("Error during staff registration:", err);
            res.status(500).send({ message: "Failed to register staff.", error: err.message });
        });
};

const signin = (req, res) => {
    StaffAccount.findOne({
        where: {
            s_id: req.body.s_id
        }
    })
        .then(staff => {
            if (!staff) {
                return res.status(404).send({ message: "Wrong Credentials." });
            }

            // 解密並檢查密碼
            const hashedPassword = CryptoJS.AES.decrypt(staff.password, process.env.PASS_SEC);
            const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

            if (originalPassword !== req.body.password) {
                return res.status(401).send({ message: "Wrong Credentials." });
            }

            // 生成 JWT Token
            const accessToken = jwt.sign(
                { s_id: staff.s_id }, // 用員工 ID 作為 Token Payload
                process.env.JWT_SEC, // JWT Secret Key
            );

            // 返回成功響應
            res.status(200).send({
                s_id: staff.s_id,
                accessToken: accessToken
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

module.exports = { signup, signin };
