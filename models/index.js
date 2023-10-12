import fs from 'fs/promises';
import path from 'path';
import { nanoid } from "nanoid";

const contactsPath = path.resolve('models', 'contacts.json');

const listContacts = async () => {
    const data = await fs.readFile(contactsPath)
    return JSON.parse(data);
}

const getContactById = async (id) => {
  const contacts = await listContacts();
  const result = contacts.find(item => item.id === id)
  return result || null;
}

const removeContact = async (id) => {
  const contacts = await listContacts();
  const index = contacts.findIndex(item => item.id === id);
  if (index === -1) {
    return null;
  }
  const [result] = contacts.splice(index, 1);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return result;
}

const addContact = async (body) => {
  const contacts = await listContacts();
  const newContact = {
    id: nanoid(),
    ...body,
  };
  contacts.push(newContact);
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
  return newContact;
}

const updateContactById = async (id, body) => {
  const contacts = await listContacts();
    const index = contacts.findIndex(item => item.id === id);
    if(index === -1) {
        return null;
    }
    contacts[index] = { ...contacts[index], ...body };
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return contacts[index];
}

export default {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContactById,
}