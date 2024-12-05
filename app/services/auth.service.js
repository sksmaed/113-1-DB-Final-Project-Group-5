// auth.service.js
const db = require("../models");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

const User = db.user;
const Role = db.role;

const Op = db.Sequelize.Op;

const signup = (req, res) => {
    // Save User to Database
    User.create({
        username: req.body.username,
        phone: req.body.phone,
        password: CryptoJS.AES.encrypt(req.body.password, process.env.PASS_SEC).toString()
    }).then(user => {
        if (req.body.roles) {
            let role_idx = req.body.roles == "user" ? 1 : 2;
            user.setRoles(role_idx).then(() => {
                res.send({ message: "User registered successfully!" });
            });
        } else {
            // user role = 1
            user.setRoles(1).then(() => {
                res.send({ message: "User registered successfully!" });
            });
        }
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

const signin = (req, res) => {
    User.findOne({
        where: {
            username: req.body.username
        }
    }).then(user => {
        if (!user) {
            return res.status(404).send({ message: "Wrong Credentials." });
        }

        const hashedPassword = CryptoJS.AES.decrypt(user.password, process.env.PASS_SEC);
        const orginalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

        orginalPassword !== req.body.password && res.status(401).json("Wrong Credentials");

        const accessToken = jwt.sign(
            {id: user.id}, 
            process.env.JWT_SEC,
            { expiresIn: "3d" }
        );

        var authorities = [];
        user.getRoles().then(roles => {
            for (let i = 0; i < roles.length; i++) {
                authorities.push("ROLE_" + roles[i].name.toUpperCase());
            }
            res.status(200).send({
                id: user.id,
                username: user.username,
                phone: user.phone,
                roles: authorities,
                accessToken: accessToken
            });
        });
    }).catch(err => {
        res.status(500).send({ message: err.message });
    });
};

module.exports = { signup, signin };
