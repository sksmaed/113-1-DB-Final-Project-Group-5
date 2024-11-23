const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicatePhoneNum = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      username: req.body.phone
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Phone number is already in use!"
      });
      return;
    }
  });
};

checkRolesExisted = (req, res, next) => {
  if (req.body.roles) {
    for (let i = 0; i < req.body.roles.length; i++) {
      if (!ROLES.includes(req.body.roles[i])) {
        res.status(400).send({
          message: "Failed! Role does not exist = " + req.body.roles[i]
        });
        return;
      }
    }
  }
  
  next();
};

const verifySignUp = {
    checkDuplicatePhoneNum: checkDuplicatePhoneNum,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;