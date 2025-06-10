const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: false,
    },
    email: { type: String },
    ip: { type: String },
    success: { type: Boolean },
    timestamp: { type: Date, default: Date.now },
    reason: { type: String }, // e.g., "Login success", "Account locked"
});

module.exports = mongoose.model("AuditLog", auditLogSchema);
