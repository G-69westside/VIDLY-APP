const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  isGold: {
    type: Boolean,
    default: false,
  },
  name: {
    type: String,
    lowercase: true,
  },
  date: { type: Date, default: Date.now },
  phone: {
    type: Number,
    required: true,
  },
  version: Number,
});

const Customer = mongoose.model("customers", customerSchema);
exports.Customer = Customer;
