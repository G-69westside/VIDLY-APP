const { Router } = require("express");
const express = require("express");
const mongoose = require("mongoose");
const route = express.Router();
const { user_vidlySchema } = require("../validate_schema");
const { User } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");
const auth = require("../middleware/auth");

route.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  res.send(user);
});

route.post("/",  async (req, res) => {
  const { error } = user_vidlySchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered");

  user = new User(_.pick(req.body, ["name", "email", "password"]));
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  const token = user.generateAuthToken();

  res
    .header("x-auth.token", token)
    .send(_.pick(user, ["_id", "name", "email"]));
});

module.exports = route;
