const mongoose = require('mongoose');

const vaultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true },
  deviceId: { type: String, required: true },
  encryptedVault: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
  version: { type: Number, default: 1 }
});

module.exports = mongoose.model('Vault', vaultSchema);
