const express = require("express");
const { Customer } = require("../models/customer");
const mongoose = require("mongoose");
const route = express.Router();
const { customer_vidlySchema } = require("../validate_schema");
const auth = require("../middleware/auth");
route.get("/", async (req, res) => {
  const customers = await Customer.find().sort("name");
  res.send(customers);
});

route.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);
  if (!customer) res.status(404).send("There is no course with the given ID");
  res.send(customer);
});
route.post("/", auth, async (req, res) => {
  // route for inserting new customers to the database
  const { error } = customer_vidlySchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  await customer.save();
  res.send(customer);
});

route.put("/:id", async (req, res) => {
  // route for updating a customer
  const { error } = customer_vidlySchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    },
    { new: true }
  );
  res.send(customer);
});

route.delete("/:id", async (req, res) => {
  // Route to handle delete requests
  const customer = await Customer.findByIdAndRemove(req.params.id);
  if (!customer)
    res.status(404).send("The customer with the given ID was not found");
  res.send("The customer was deleted successfuly");
});
module.exports = route;
