const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "Email is required for creating a user"],
    trim: true,
    lowercase: true,
    match: [
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Please fill a valid email address",
    ],
    unique: [
      true,
      "Email already exists. Please use a different email address.",
    ],
  },
  name: {
    type: String,
    required: [true, "Name is required for creating a user"],
    trim: true,
  },
});
