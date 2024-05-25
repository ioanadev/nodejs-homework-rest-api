import express from'express'; 
import { addContact, getContactById, listContacts, removeContact, updateContact } from '../../models/contacts-old.js';
import  Joi from 'joi';

const router = express.Router();

const schema = Joi.object({
  name: Joi.string()
     .min(3)
     .max(30)
     .required(),
  email: Joi.string()
     .email()
     .required(),
  phone: Joi.string()
  .required(),
})


// GET /api/contacts
router.get('/', async (req, res, next) => {

  try{
    const contacts = await listContacts();
    res.statusCode = 200;
    res.json({ message: 'The contacts have been retrieved successfully', data: contacts })
  }
  catch(err){
   res.statusCode = 500;
   res.json({ message: `${err}` })
  }
 
  
})

// GET /api/contacts/:id
router.get('/:contactId', async (req, res, next) => { 
  try{
    const contact = await getContactById(req.params.contactId);
    if(!contact){
      res.statusCode = 404;
      return res.json({message: 'The contact was not found'})
    }
    res.statusCode = 200;
    return res.json({ message: 'The contact was returned successfully', contact});
  }
  catch(err){
   return res.json({ message: `${err}`});
  }
  
})

// POST /api/contacts
router.post('/', async (req, res, next) => {
  try{
    const {error, value:contact} = schema.validate(req.body) ;
    // const contacts = await listContacts();

    if(error){
      return res.status(400).json({ error: error.details[0].message });
    }

    if(contact.name && contact.email && contact.phone){
      await addContact(contact)
      return res.status(201).json({ message: 'The contact has been added', contact })
    }else if(!contact.name && !contact.email && !contact.phone){
      return res.status(400).json({mesage: "Missing required field"})
    }
  }
  catch(err){
    return res.status(500).json({ message: `${err}`});
  }

})

// DELETE /api/contacts/:id
router.delete('/:contactId', async (req, res, next) => {

  try{
   const contacts =  await removeContact(req.params.contactId)
   if(contacts){
    res.status(200).json({ message: 'Contact deleted', contacts })
   } else{
    res.status(404).json({ message: 'Contact not found'})
   }
  }
  catch(err){
    return res.status(500).json({ message: `${err}`});
  }

})

// PUT /api/contacts/:id
router.put('/:contactId', async (req, res, next) => {
  try{
    const {error, value:contact} = schema.validate(req.body);
    console.log(req.body);
    console.log(req.params.contactId);

    if(error){
      return res.status(400).json({ error: error.details[0].message });
    }

    if(!contact.name && !contact.email && !contact.phone){
     return res.status(400).json({ message: 'Missing fields'  })
    }
    const modificationContact = await updateContact(req.params.contactId, req.body);
    if(modificationContact){
     return res.status(200).json({ message: 'Contract updated', modificationContact })
    }else {
    return res.status(404).json({ message: 'Contract not found'})
    }
  }
  catch(err){
    return res.status(500).json({ message: `${err}`});
  }
})

export default router;