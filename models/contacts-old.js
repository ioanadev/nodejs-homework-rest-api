import fs from 'fs/promises';
import { randomUUID } from 'node:crypto';
import * as path from 'node:path'; 
import { fileURLToPath } from 'node:url';



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contactsPath = `${__dirname}\\contacts.json`;
import contacts from "./contacts.json" assert { type: "json" };
import { connectToDb } from '../utils/connectDb.js';


connectToDb()


export const listContacts = async () => {
  return contacts;
}


export const getContactById = async (contactId) => {
const contact = contacts.find(contact=> contact.id === contactId);
return contact;

}

export const addContact = async (contact) => {
  const {name, email, phone} = contact;
  
  const contacts = await listContacts();

   const newContact = {
     id: randomUUID(),
     name,
     email,
     phone
    }
   contacts.push(newContact);
   fs.writeFile( contactsPath, JSON.stringify(contacts), { encoding: 'utf8' } ) ;
    return contacts;
}

export const removeContact = async (contactId) => {
  const contacts = await listContacts();
  const contactIndex = contacts.findIndex(contact => contact.id === contactId);
  if(contactIndex === -1){
    return false;
  }else{
     contacts.splice(contactIndex, 1);
     fs.writeFile(contactsPath, JSON.stringify(contacts), {encoding: 'utf8'});
     console.log("Contact dupa scriere in fisier", contacts);
     return true;
    }
 
}


export const updateContact = async (contactId, body) => {
  const contacts = await listContacts();
  const {name, email, phone} = body;
    
  const index = contacts.findIndex(contact => contact.id === contactId)
  if(index === -1){
   return null
  }else{
  contacts[index] = {...contacts[index], ...body};

  fs.writeFile( contactsPath, JSON.stringify(contacts));
  return contacts[index]
  }

}


