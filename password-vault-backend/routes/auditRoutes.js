const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getLoginHistory } = require("../controllers/auditController");

router.get("/", auth, getLoginHistory);

module.exports = router;
