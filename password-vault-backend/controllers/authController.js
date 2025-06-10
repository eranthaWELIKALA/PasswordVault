const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AuditLog = require("../models/AuditLog");

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_DURATION_MINUTES = 15;

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    const ip = req.ip;

    try {
        const user = await User.findOne({ email });
        if (!user)
            return res
                .status(401)
                .json({ success: false, message: "Invalid credentials" });

        // Check if locked
        if (user.isLocked && user.lockUntil > new Date()) {
            return res.status(403).json({
                success: false,
                message: `Account locked. Try again after ${user.lockUntil.toLocaleTimeString()}`,
            });
        }

        const isMatch = await bcrypt.compare(password, user.passwordHash);

        if (!isMatch) {
            user.failedLoginAttempts += 1;

            // Lock account if too many attempts
            if (user.failedLoginAttempts >= MAX_FAILED_ATTEMPTS) {
                user.isLocked = true;
                user.lockUntil = new Date(
                    Date.now() + LOCK_DURATION_MINUTES * 60 * 1000
                );
            }

            await user.save();

            return res.status(401).json({
                success: false,
                message: "Invalid credentials",
            });
        }

        // Reset failed attempts on success
        user.failedLoginAttempts = 0;
        user.isLocked = false;
        user.lockUntil = null;
        user.lastLoginAt = new Date();
        user.lastLoginIP = ip;
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        await AuditLog.create({
            userId: user?._id,
            email,
            ip,
            success: isMatch,
            reason: isMatch
                ? "Login success"
                : user.isLocked
                ? "Account locked"
                : "Invalid credentials",
        });

        res.json({
            success: true,
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                lastLoginAt: user.lastLoginAt,
                lastLoginIP: user.lastLoginIP,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};
