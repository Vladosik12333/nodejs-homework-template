const express = require("express");
const {
  addContact,
  deleteContact,
  getContacts,
  getContactById,
  updateContact,
} = require("../controllers/contacts");
const validationBody = require("../middlewares/validation");
const {
  schemaCreateContact,
  schemaUpdateContact,
} = require("../schemes/contacts");

const router = express.Router();

router.get("/", getContacts);

router.get("/:id", getContactById);

router.post("/", validationBody(schemaCreateContact), addContact);

router.delete("/:id", deleteContact);

router.put("/:id", validationBody(schemaUpdateContact), updateContact);

module.exports = router;
