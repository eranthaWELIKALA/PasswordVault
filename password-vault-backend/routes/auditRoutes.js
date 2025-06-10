const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getLoginHistory } = require("../controllers/auditController");

router.get("/login-history", auth, getLoginHistory);

module.exports = router;
