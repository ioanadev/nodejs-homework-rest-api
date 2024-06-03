import Contact from "../models/contacts.js";

export const listContacts = async () => {
  const data = await Contact.find();
  console.log(data);
  return data;
}
  
  
export const getContactById = async (contactId) => {
  const dataById = await Contact.findById(contactId);
  console.log(dataById);
  return dataById;
}
  
export const addContact = async (contact) => {
  const addNewContact = await Contact.create(contact);
  return addNewContact;
    
}
  
export const removeContact = async (contactId) => {
  const removeContact = await Contact.findByIdAndDelete(contactId)
  return removeContact;   
}
  
  
export const updateContact = async (contactId, body) => {
  const modifiedContact = await Contact.findByIdAndUpdate(contactId, body);
  console.log("Modified Contact:", modifiedContact)
  return modifiedContact; 
}
  
export const updateStatusContact = async (contactId, status)=>{
  const modifiedStatus = await Contact.findByIdAndUpdate(contactId, status);
  console.log("Modified status", modifiedStatus)
  return modifiedStatus;
}
  
