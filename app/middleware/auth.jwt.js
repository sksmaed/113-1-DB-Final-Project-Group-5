const jwt = require("jsonwebtoken");
const db = require("../models");
const User = db.user;

const verifyToken = (req, res, next) => {
  let authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(403).send({
      message: "Your are not authenticated!"
    });
  }
  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.JWT_SEC, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Token is not valid!"
      });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken: verifyToken,
};
module.exports = authJwt;
