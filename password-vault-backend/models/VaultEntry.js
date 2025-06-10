const mongoose = require("mongoose");

const vaultEntrySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    deviceId: { type: String, required: true },
    label: { type: String, required: true },
    entryType: {
        type: String,
        enum: ["login", "card_pin", "wifi", "note"],
        required: true,
    },
    group: { type: String, default: "default" }, // e.g., "office", "personal"

    encryptedData: { type: String, required: true }, // Encrypted JSON blob

    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("VaultEntry", vaultEntrySchema);
