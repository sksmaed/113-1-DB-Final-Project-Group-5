const db = require("../models");
const ROLES = db.ROLES;
const User = db.user;

checkDuplicatePhoneNum = (req, res, next) => {
  // Username
  User.findOne({
    where: {
      phone: req.body.phone
    }
  }).then(user => {
    if (user) {
      res.status(400).send({
        message: "Failed! Phone number is already in use!"
      });
      return;
    }
    next();
  });
};

checkRolesExisted = (req, res, next) => {
  console.log(req.body.roles);
  if (req.body.roles) {
    if (!ROLES.includes(req.body.roles)) {
      res.status(400).send({
        message: "Failed! Role does not exist = " + req.body.roles
      });
      return;
    }
  }
  
  next();
};

const verifySignUp = {
    checkDuplicatePhoneNum: checkDuplicatePhoneNum,
  checkRolesExisted: checkRolesExisted
};

module.exports = verifySignUp;