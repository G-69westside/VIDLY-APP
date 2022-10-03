const express = require("express");
const mongoose = require("mongoose");
const route = express.Router();
const { genre_VidlySchema } = require("../validate_schema");
const validateObjectId = require("../middleware/validateObjectID");
const { Genre } = require("../models/genre");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

route.get("/", async (req, res) => {
  const genres = await Genre.find().sort("name");
  res.send(genres);
});

route.get("/:id", validateObjectId, async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre)
    return res.status(404).send("The genre with the given ID was not found");
  res.send(genre);
});

route.post("/", auth, async (req, res) => {
  const { error } = genre_VidlySchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = new Genre({
    name: req.body.name,
  });

  await genre.save();
  res.send(genre);
});

route.put("/:id",[auth,validateObjectId], async (req, res) => {
  const { error } = genre_VidlySchema.validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre) return res.status(404).send("The genre was not found!");

  res.send(genre);
});

route.delete("/:id", [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndDelete(req.params.id);
  if (!genre) return res.status(404).send("The genre was not found!");
  res.send("Deleted successfully");
});

module.exports = route;
