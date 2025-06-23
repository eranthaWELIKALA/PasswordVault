const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id);
        if (!req.user) throw new Error("User not found");

        if (req.body) {
            req.body.userId = decoded.id;
            req.body.deviceId = req.headers["device-id"];
        }
        next();
    } catch (err) {
        res.status(401).json({ message: "Invalid token" });
    }
};
