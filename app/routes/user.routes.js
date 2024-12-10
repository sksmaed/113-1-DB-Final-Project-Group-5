const router = require("express").Router();
const { authJwt } = require("../middleware");
const userService = require("../services/user.service");

// router.get("/usertest", (req, res) => {
//     res.send("user test is successful");
// });

// router.post("/userposttest",
//     authJwt.verifyToken,
//     (req, res) => {
//         const username = req.body.username;
//         res.send("your username is: " + username)
//     }
// )

router.get(
    "/test/admin",
    [authJwt.verifyToken],
    userService.adminBoard
);

module.exports = router;