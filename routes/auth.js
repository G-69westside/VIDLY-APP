const express = require("express");
const route = express.Router();
const { auth_vidlySchema } = require("../validate_schema");
const { User } = require("../models/user");
const _ = require("lodash");
const bcrypt = require("bcrypt");

route.post("/", async (req, res) => {
  const { error } = auth_vidlySchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("Invalid e-mail or password");

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send("Invalid e-mail or password");

  const token = user.generateAuthToken();
  res.send(token);
});

module.exports = route;
