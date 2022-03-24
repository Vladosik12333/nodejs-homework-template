const { Schema, model } = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const userSchema = Schema({
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: {
    type: String,
    default: null,
  },
  avatarURL: String,
  verify: {
    type: Boolean,
    default: false,
  },
  verificationToken: {
    type: String,
    required: [true, "Verify token is required"],
  },
});

const schemaPassAndLogin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

const schemaVerifyAgain = Joi.object({
  email: Joi.string().email().required(),
});

const schemaUpdateSub = Joi.object({
  sub: Joi.string().valid("starter", "pro", "business").required(),
});

const schemaVerify = Joi.object({
  verificationToken: Joi.string().required(),
});

const User = model("user", userSchema);

module.exports = {
  User,
  schemaPassAndLogin,
  schemaUpdateSub,
  schemaVerify,
  schemaVerifyAgain,
};
