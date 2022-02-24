const { Contacts } = require("../models/contacts");

const getContacts = async (_, res) => {
  const contacts = await Contacts.find({});

  res.json({ contacts });
};

const getContactById = async (req, res) => {
  const contact = await Contacts.findById(req.params.id);

  contact
    ? res.json({ contact })
    : res.status(404).json({ message: "Not found" });
};

const deleteContact = async (req, res) => {
  const contact = await Contacts.findByIdAndRemove(req.params.id);

  contact
    ? res.json({ message: "Contact deleted" })
    : res.status(404).json({ message: "Not found" });
};

const addContact = async (req, res) => {
  const contact = await Contacts.create(req.body);

  res.status(201).json({ contact });
};

const updateContact = async (req, res) => {
  const contact = await Contacts.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

  contact
    ? res.json({ contact })
    : res.status(404).json({ message: "Not found" });
};

const updateFavoriteContact = async (req, res) => {
  const contact = await Contacts.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });

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
  updateFavoriteContact,
};
