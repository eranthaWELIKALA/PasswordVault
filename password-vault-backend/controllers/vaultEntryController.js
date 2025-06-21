const Group = require("../models/Group");
const VaultEntry = require("../models/VaultEntry");

exports.createEntry = async (req, res) => {
    try {
        const newEntry = new VaultEntry({
            ...req.body,
            userId: req.user._id,
        });
        await newEntry.save();
        res.status(201).json({ success: true, entry: newEntry });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getAllEntries = async (req, res) => {
    try {
        const entries = await VaultEntry.find({ userId: req.user._id });
        res.json({ success: true, entries });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.updateEntry = async (req, res) => {
    try {
        const updated = await VaultEntry.findOneAndUpdate(
            { _id: req.params.id, userId: req.user._id },
            req.body,
            { new: true }
        );
        if (!updated)
            return res
                .status(404)
                .json({ success: false, message: "Entry not found" });
        res.json({ success: true, entry: updated });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.deleteEntry = async (req, res) => {
    try {
        const deleted = await VaultEntry.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id,
        });
        if (!deleted)
            return res
                .status(404)
                .json({ success: false, message: "Entry not found" });
        res.json({ success: true, message: "Entry deleted" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.getGroups = async (req, res) => {
    try {
        const groups = await VaultEntry.distinct("group", {
            userId: req.user._id,
            group: { $nin: [null, ""] }, // filter out null and empty string
        });
        res.json({ success: true, groups });
    } catch (error) {
        console.error("Error fetching groups:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.createGroup = async (req, res) => {
    try {
        const newGroup = new Group({
            userId: req.user._id,
            group: req.body.group,
        });
        await newGroup.save();
        res.status(201).json({ success: true, group: newGroup });
    } catch (error) {
        console.error("Error creating group:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
