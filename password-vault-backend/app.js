const express = require("express");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const auditRoutes = require("./routes/auditRoutes");
const vaultEntryRoutes = require("./routes/vaultEntryRoutes");
const connectDB = require("./config/db");
const app = express();

dotenv.config();
connectDB();

app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
});
app.use(limiter);

app.use("/api/auth", authRoutes);
app.use("/api/audit", auditRoutes);
app.use("/api/vault-entries", vaultEntryRoutes);

module.exports = app;
