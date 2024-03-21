const express = require("express");
const router = express.Router();
const controller = require("./controller");

router.post("/token", controller.getTokenAtenea);
router.post('/refreshToken', controller.getRefreshTokenAtenea);

module.exports = router;
