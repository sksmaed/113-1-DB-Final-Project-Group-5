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

router.get("/test/all", userService.allAccess);

router.get(
    "/test/user",
    [authJwt.verifyToken],
    userService.userBoard
);

router.get(
    "/test/admin",
    [authJwt.verifyToken, authJwt.isAdmin],
    userService.adminBoard
);

module.exports = router;