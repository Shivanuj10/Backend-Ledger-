const userModel = require("./../models/user.model");
const jwt = require("jsonwebtoken");
const emailService = require("../services/email.service");

const userRegisterController = async (req, res) => {
  const { email, name, password } = req.body;

  let isExists = await userModel.findOne({
    email: email,
  });

  if (isExists) {
    return res.status(400).json({
      message: "Email already exists. Please use a different email address.",
      status: "failed",
    });
  }

  const user = await userModel.create({
    email,
    name,
    password,
  });

  const token = jwt.sign(
    {
      userId: user._id,
    },
    process.env.JWT_SECRET,
    { expiresIn: "3d" },
  );

  res.cookie("token", token);
  res.status(201).json({
    user: {
      email: user.email,
      name: user.name,
    },
    token: token,
    message: "User registered successfully now you can login",
  });

  await emailService.sendRegistrationEmail(user.email, user.name);
};

const userLoginController = async (req, res) => {
  const { email, password } = req.body;

  let user = await userModel
    .findOne({
      email: email,
    })
    .select("+password");

  if (!user) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const isValidPassword = await user.comparePassword(password);

  if (!isValidPassword) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "3d",
  });

  res.cookie("token", token);

  res.status(200).json({
    user: {
      email: user.email,
      name: user.name,
    },
    token: token,
    message: "Login successful now you can view your profile",
  });
};

module.exports = {
  userRegisterController,
  userLoginController,
};
