// routes/auth.routes.js
const router = require("express").Router();
const authService = require("../services/auth.service");
const { verifySignUp } = require("../middleware")

// 帳號註冊
router.post("/signup", 
[
    verifySignUp.checkDuplicatePhoneNum,
    verifySignUp.checkRolesExisted
],
authService.signup);

// 登入
router.post("/signin", authService.signin);

module.exports = router;