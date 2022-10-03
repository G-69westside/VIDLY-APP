const mongoose = require("mongoose");
const express = require("express");
const route = express.Router();
const { Rental } = require("../models/rental");
const { rental_vidlySchema } = require("../validate_schema");
const { Customer } = require("../models/customer");
const { Movie } = require("../models/movie");
const Fawn = require("fawn");
const auth = require("../middleware/auth");

Fawn.init("mongodb://localhost/vidly");

route.get("/", async (req, res) => {
  const rentals = await Rental.find().sort("-dateOut");
  res.send(rentals);
});

route.get("/:id", async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental)
    res.status(404).send("The course with the given ID was not found");
  res.send(rental);
});

route.post("/", auth, async (req, res) => {
  const { error } = rental_vidlySchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  if (!mongoose.Types.ObjectId.isValid(req.body.customerId))
    return res.status(400).send("Invalid customer");
  const customer = await Customer.findById(req.body.customerId);
  if (!customer)
    res.status(404).send("Invalid customerID or the customer was not found ");
  const movie = await Movie.findById(req.body.movieId);
  if (!movie)
    res.status(404).send("Invalid Movie ID or the movie was not found");

  if (movie.numberInStock === 0) res.status(404).send("Movie not in stock");
  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update("movies", { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();
  } catch (ex) {
    res.status(500).send("something failed"); // internal server error
  }

  // rental = await rental.save();

  // movie.numberInStock--;
  // movie.save();

  res.send(rental);
});

module.exports = route;
