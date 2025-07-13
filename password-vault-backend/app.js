const express = require("express");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const authRoutes = require("./routes/authRoutes");
const auditRoutes = require("./routes/auditRoutes");
const vaultEntryRoutes = require("./routes/vaultEntryRoutes");
const connectDB = require("./config/db");
const app = express();
const cors = require('cors');

dotenv.config();
connectDB();

app.set("trust proxy", 1);
app.use(cors());
app.use(express.json());

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: "Too many requests, please try again later.",
});
app.use(limiter);

app.use("/api/auth", authRoutes);
app.use("/api/audit-logs", auditRoutes);
app.use("/api/vault", vaultEntryRoutes);

module.exports = app;
