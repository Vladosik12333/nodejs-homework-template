const express = require("express");
const {
  addContact,
  deleteContact,
  getContacts,
  getContactById,
  updateContact,
  updateFavoriteContact,
} = require("../controllers/contacts");
const {
  validationBody,
  validationParams,
} = require("../middlewares/validation");
const {
  schemaCreateContact,
  schemaUpdateContact,
  schemaUpdateFavorite,
  schemaMongoId,
} = require("../models/contacts");
const { container } = require("../middlewares/container-ctrl");

const router = express.Router();

router.get("/", container(getContacts));

router.get("/:id", validationParams(schemaMongoId), container(getContactById));

router.post("/", validationBody(schemaCreateContact), container(addContact));

router.delete(
  "/:id",
  validationParams(schemaMongoId),
  container(deleteContact)
);

router.put(
  "/:id",
  validationBody(schemaUpdateContact),
  validationParams(schemaMongoId),
  container(updateContact)
);

router.patch(
  "/:id/favorite",
  validationBody(schemaUpdateFavorite),
  validationParams(schemaMongoId),
  container(updateFavoriteContact)
);

module.exports = router;
