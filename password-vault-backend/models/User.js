const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    name: { type: String },
    failedLoginAttempts: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    lockUntil: { type: Date, default: null },
    lastLoginAt: { type: Date },
    lastLoginIP: { type: String },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("User", userSchema);
