const express = require("express");
const UserModel = require("../modals/userModel");
const expressAsyncHandler = require("express-async-handler");
const generateToken = require("../config/generateToken");
const { protect } = require("../middleware/authMiddleware");

const loginController = expressAsyncHandler(async (req, res) => {
  const { name, password } = req.body;

  const user = await UserModel.findOne({ name });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401).json({ message: "Invalid Username or Password" });
  }
});

const registerController = expressAsyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    res.status(400).json({ message: "All necessary input fields have not been filled" });
    return;
  }

  const userExist = await UserModel.findOne({ email });
  if (userExist) {
    res.status(400).json({ message: "User already exists" });
    return;
  }

  const userNameExist = await UserModel.findOne({ name });
  if (userNameExist) {
    res.status(400).json({ message: "Username already exists" });
    return;
  }

  const user = await UserModel.create({ name, email, password });
  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json({ message: "Registration Error" });
  }
});

const fetchAllUsersController = expressAsyncHandler(async (req, res) => {
  const keyword = req.query.search ? {
    $or: [
      { name: { $regex: req.query.search, $options: "i" } },
      { email: { $regex: req.query.search, $options: "i" } },
    ],
  } : {};

  const users = await UserModel.find(keyword).find({
    _id: { $ne: req._id },
  });

  res.json(users);
});

module.exports = { loginController, registerController, fetchAllUsersController };
