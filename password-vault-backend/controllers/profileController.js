const User = require("../models/User");
const { hashPassword } = require("../utils/commonUtils");

exports.getCurrentProfile = async function (req, res) {
    try {
        const user = await User.findById(req.user.id).select("-passwordHash");
        if (!user) return res.status(404).json({ message: "User not found" });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.updateProfile = async function (req, res) {
    const { name, email, password } = req.body;

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).json({ message: "User not found" });

        if (name) user.name = name;
        if (email) user.email = email;
        if (password) user.passwordHash = await hashPassword(password);

        await user.save();

        res.json({ message: "Profile updated successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
