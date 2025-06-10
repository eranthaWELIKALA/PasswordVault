require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function addUser(email, password, name = "") {
    await mongoose.connect(process.env.MONGO_URI);
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ email, passwordHash, name });
    await user.save();
    console.log("User created:", email);
    process.exit();
}

addUser("admin@example.com", "SuperSecurePassword123", "Admin");
