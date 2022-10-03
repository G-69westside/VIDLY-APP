const express = require("express");
const { Rental } = require("../models/rental");
const route = express.Router();
const auth = require("../middleware/auth");
const moment = require("moment");
const { Movie } = require("../models/movie");
const { returns_VidlySchema } = require("../validate_schema");
route.post("/", auth, async (req, res) => {
  // if (!req.body.customerId)
  //   return res.status(400).send("customerId is not provided");
  // if (!req.body.movieId) return res.status(400).send("movieId is not provided");

  const { error } = returns_VidlySchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);


  const rental = await Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });
  if (!rental) return res.status(404).send("no rental found for this customer");

  if (rental.dateReturned)
    return res.status(400).send("Return already processed");
  rental.dateReturned = new Date();
  const rentalDays = moment().diff(rental.dateOut, "days");
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;

  await rental.save();
  await Movie.updateOne(
    { _id: rental.movie._id },
    { $inc: { numberInStock: 1 } }
  );

  return res.status(200).send(rental);
});

module.exports = route;
