require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("../models/User");

async function addUser(email, password, name = "") {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log(`User with email "${email}" already exists.`);
    } else {
      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({ email, passwordHash, name });
      await user.save();
      console.log(`User "${email}" created successfully.`);
    }
  } catch (error) {
    console.error("Error adding user:", error);
  } finally {
    await mongoose.disconnect();
    process.exit();
  }
}

addUser("admin@example.com", "SuperSecurePassword123", "Admin");
