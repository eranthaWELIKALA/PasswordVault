const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");

router.get("/", profileController.getCurrentProfile);
router.put("/", profileController.updateProfile);

module.exports = router;
