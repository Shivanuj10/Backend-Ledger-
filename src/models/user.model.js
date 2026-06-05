const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = mongoose.Schema(
  {
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
    password: {
      type: String,
      required: [true, "Password is required for creating a user"],
      minlength: [6, "Password must be at least 6 characters long"],
      select: false, // Exclude password from query results by default
    },
  },
  {
    timestamps: true,
  },
);

// Without this hook:

// passwords would be stored in plain text ❌

// With this hook:

// passwords are automatically encrypted before saving ✔

userSchema.pre("save", async function () {
  if (!this.isModified("password")) {
    return;
  }

  const hash = await bcrypt.hash(this.password, 10);
  this.password = hash;

  return;
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

const userModel = mongoose.model("user", userSchema);

module.exports = userModel;
