const { Schema, model } = require("mongoose");
const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);

const contactsSchema = Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for contact"],
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

const Contacts = model("contact", contactsSchema);

const schemaCreateContact = Joi.object({
  name: Joi.string().min(3).max(30).required(),
  email: Joi.string().email().required(),
  phone: Joi.string()
    .pattern(/[0-9]+/)
    .required(),
});

const schemaUpdateContact = Joi.object({
  name: Joi.string().min(3).max(30),
  email: Joi.string().email(),
  phone: Joi.string().pattern(/[0-9]+/),
});

const schemaUpdateFavorite = Joi.object({
  favorite: Joi.bool().required(),
});

const schemaMongoId = Joi.object({
  id: Joi.objectId().required(),
});

module.exports = {
  Contacts,
  schemaCreateContact,
  schemaUpdateContact,
  schemaUpdateFavorite,
  schemaMongoId,
};
