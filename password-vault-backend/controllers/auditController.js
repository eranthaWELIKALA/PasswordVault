const AuditLog = require("../models/AuditLog");

exports.getLoginHistory = async (req, res) => {
    try {
        const logs = await AuditLog.find({ userId: req.user._id })
            .sort({ timestamp: -1 })
            .limit(50); // latest 50 logs

        res.json({
            success: true,
            logs,
        });
    } catch (err) {
        console.error("Error fetching login history:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
