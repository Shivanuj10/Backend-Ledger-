const accountModel = require("../models/account.model");

const createAccountController = async (req, res) => {
  const user = req.user;

  const account = await accountModel.create({
    user: user._id,
  });

  res.status(201).json({
    account,
  });
};

const getUserAccountsController = async (req, res) => {
  const accounts = await accountModel.find({
    user: req.user._id,
  });

  return res.status(200).json({
    accounts,
  });
};

module.exports = {
  createAccountController,
  getUserAccountsController,
};
