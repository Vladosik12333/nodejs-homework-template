const {
  listContactsModel,
  getContactByIdModel,
  removeContactModel,
  addContactModel,
  updateContactModel,
} = require("../models/contacts");

const getContacts = async (req, res) => {
  const contacts = await listContactsModel();
  res.json({ contacts });
};

const getContactById = async (req, res) => {
  const contact = await getContactByIdModel(req.params.id);

  contact
    ? res.json({ contact })
    : res.status(404).json({ message: "Not found" });
};

const deleteContact = async (req, res) => {
  const contact = await removeContactModel(req.params.id);

  contact
    ? res.json({ message: "Contact deleted" })
    : res.status(404).json({ message: "Not found" });
};

const addContact = async (req, res) => {
  const contact = await addContactModel(req.body);

  res.status(201).json({ contact });
};

const updateContact = async (req, res) => {
  const contact = await updateContactModel(req.params.id, req.body);

  contact
    ? res.json({ contact })
    : res.status(404).json({ message: "Not found" });
};

module.exports = {
  getContacts,
  getContactById,
  deleteContact,
  addContact,
  updateContact,
};
