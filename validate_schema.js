const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const AuthSchema = Joi.object({
  name: Joi.string().min(3).lowercase().required(),
});

const genre_VidlySchema = Joi.object({
  name: Joi.string().lowercase().min(5).max(50).required(),
  isGold: Joi.boolean(),
});
const returns_VidlySchema = Joi.object({
  customerId: Joi.objectId().required(),
  movieId: Joi.objectId().required(),
});
const customer_vidlySchema = Joi.object({
  phone: Joi.number().required(),
  isGold: Joi.boolean(),
  name: Joi.string().lowercase().required(),
});

const movie_vidlySchema = Joi.object({
  title: Joi.string().min(5).max(50).required(),
  genreId: Joi.objectId().required(),
  numberInStock: Joi.number().min(0).required(),
  dailyRentalRate: Joi.number().min(0).required(),
});
const rental_vidlySchema = Joi.object({
  customerId: Joi.objectId().required(),
  movieId: Joi.string().required(),
});
const user_vidlySchema = Joi.object({
  name: Joi.string().min(5).max(50).required(),
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(255).required(),
});
const auth_vidlySchema = Joi.object({
  email: Joi.string().min(5).max(255).required().email(),
  password: Joi.string().min(5).max(255).required(),
});
module.exports = {
  AuthSchema,
  genre_VidlySchema,
  customer_vidlySchema,
  movie_vidlySchema,
  rental_vidlySchema,
  user_vidlySchema,
  auth_vidlySchema,
  returns_VidlySchema,
};
