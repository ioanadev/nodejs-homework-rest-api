import express from'express'; 
import { addContact, getContactById, listContacts, removeContact, updateContact, updateStatusContact } from "../../controller/contactsControler.js";

import  Joi from 'joi';
// import passport from "passport";
import "../../passport.js";
import { ValidateJWT, validateAuth } from '../../controller/authControler.js';


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
router.get('/', validateAuth, async (req, res, next) => {

    try{
     
      const header = req.get('authorization');
      if(!header) {
        throw(new Error("Not authorized"))
      }
      const token = header.split("")[1];
      ValidateJWT(token)

      const data = await listContacts();
      res.statusCode = 200;
      res.json({ message: 'The contacts have been retrieved successfully', data })
    }
    catch(err){
     res.statusCode = 500;
     res.json({ message: `${err}` })
    }

})

   
// GET /api/contacts/:id
router.get('/:contactId',validateAuth, async (req, res, next) => { 
  try{
    const header = req.get('authorization');
    if(!header) {
      throw(new Error("Not authorized"))
    }
    const token = header.split("")[1];
    ValidateJWT(token)
    const contact = await getContactById(req.params.contactId);
    if(!contact){
      res.statusCode = 404;
      return res.json({message: 'The contact was not found'})
    }
    res.statusCode = 200;
    return res.json({ message: 'The contact was returned successfully', contact});
  }
  catch(err){
    return res.status(500).json({ message: `${err}`});
  }
  
})

// POST /api/contacts
router.post('/', validateAuth, async (req, res, next) => {
  try{

      const header = req.get('authorization');
    if(!header) {
      throw(new Error("Not authorized"))
    }
    const token = header.split("")[1];
    ValidateJWT(token)

    const {error, value:contact} = schema.validate(req.body) ;
    if(error){
      return res.status(400).json({ error: error.details[0].message });
    }
 
    // const contact = req.body;

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
router.delete('/:contactId', validateAuth, async (req, res, next) => {

  try{
    const header = req.get('authorization');
    if(!header) {
      throw(new Error("Not authorized"))
    }
    const token = header.split("")[1];
    ValidateJWT(token) 

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
router.put('/:contactId', validateAuth, async (req, res, next) => {
  try{

    const header = req.get('authorization');
    if(!header) {
      throw(new Error("Not authorized"))
    }
    const token = header.split("")[1];
    ValidateJWT(token)

    const {error, value:body} = schema.validate(req.body);
  
    if(error){
      return res.status(400).json({ error: error.details[0].message });
    }

    // const id = req.params.contactId;
    // const body = req.body;


    if(!body.name && !body.email && !body.phone){
     return res.status(400).json({ message: 'Missing fields'  })
    }

    const changedContact = await updateContact(req.params.contactId, req.body);

    if(changedContact){
     return res.status(200).json({ message: 'Contract updated', changedContact })
    }else {
    return res.status(404).json({ message: 'Contract not found'})
    }
  }
  catch(err){
    return res.status(500).json({ message: `${err}`});
  }
})

// PATCH /api/contacts/:contactId/favorite

router.patch('/:contactId/favorite', validateAuth, async (req, res, next)=>{
  try{
    const header = req.get('authorization');
    if(!header) {
      throw(new Error("Not authorized"))
    }
    const token = header.split("")[1];
    ValidateJWT(token)


    const id = req.params.contactId;
    const body = req.body;
    const favorite = body.favorite

    console.log("id:", id);
    console.log("body favorite:", body.favorite);
    console.log("not body favorite:", !body.favorite);
    


    if(favorite === "undefine"){
      return res.status(400).json({ message: 'Missing field favorite'  })
     }
     const changedStatus = await updateStatusContact(id, {favorite});
     if(changedStatus){

      return res
      .status(200)
      .json({ message: 'Status updated', changedStatus })
     }else {
     return res
     .status(404)
     .json({ message: 'Not found'})

     }
  } 
  catch(err){
    return res.status(500).json({ message: `${err}`});
  }

})

export default router;