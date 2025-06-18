const bcrypt = require("bcryptjs");

exports.hashPassword = async function (passwordString) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(passwordString, salt);
};

exports.matchPassword = async function (password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
};
