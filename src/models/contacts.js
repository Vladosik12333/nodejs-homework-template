const DB = require("./db");
const { randomUUID } = require("crypto");

const db = new DB();

const listContactsModel = async () => {
  return await db.readFile();
};

const getContactByIdModel = async (contactId) => {
  const contacts = await db.readFile();
  const contact = contacts.find((item) => item.id === contactId);

  return contact === undefined ? null : contact;
};

const removeContactModel = async (contactId) => {
  const contacts = await db.readFile();
  const index = contacts.findIndex((item) => item.id === contactId);

  if (index !== -1) {
    const [contact] = contacts.splice(index, 1);
    await db.writeFile(contacts);
    return contact;
  }

  return null;
};

const addContactModel = async (body) => {
  const contacts = await db.readFile();
  const newContact = { id: randomUUID(), ...body };
  contacts.push(newContact);

  await db.writeFile(contacts);
  return newContact;
};

const updateContactModel = async (contactId, body) => {
  const contacts = await db.readFile();
  const index = contacts.findIndex((item) => item.id === contactId);

  if (index !== -1) {
    contacts[index] = { ...contacts[index], ...body };
    await db.writeFile(contacts);
    return contacts[index];
  }

  return null;
};

module.exports = {
  listContactsModel,
  getContactByIdModel,
  removeContactModel,
  addContactModel,
  updateContactModel,
};
