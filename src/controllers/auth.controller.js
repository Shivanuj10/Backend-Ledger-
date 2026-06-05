const userModel = require("./../models/user.model");
const jwt = require("jsonwebtoken");

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
  });
};

module.exports = {
  userRegisterController,
};
