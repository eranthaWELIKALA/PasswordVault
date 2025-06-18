const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const vaultEntryController = require("../controllers/vaultEntryController");

router.post("/", auth, vaultEntryController.createEntry);
router.get("/", auth, vaultEntryController.getAllEntries);
router.put("/:id", auth, vaultEntryController.updateEntry);
router.delete("/:id", auth, vaultEntryController.deleteEntry);
router.get("/groups", auth, vaultEntryController.getGroups);

module.exports = router;
