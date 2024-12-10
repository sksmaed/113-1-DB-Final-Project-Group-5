// routes/auth.routes.js
const router = require("express").Router();
const authService = require("../services/auth.service");

// 帳號註冊
router.post("/signup", authService.signup);

// 登入
router.post("/signin", authService.signin);

module.exports = router;