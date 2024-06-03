import express from'express'; 
import {ValidateJWT, emailVerification, loginFunction, passwordVerification, singupFunction, validateAuth } from '../../controller/authControler.js';
import "dotenv/config";
import  Joi from 'joi';
import User from '../../models/auth.js';



const router = express.Router();

const UserSchema = Joi.object({
  email: Joi.string()
            .email()
            .required(),
  password: Joi.string()
               .required(),
  subscription: Joi.string()             
})

// POST /users/signup
router.post('/signup', async (req, res, next) => {

  const {error, value:user} = UserSchema.validate(req.body) ;


  if(error){
    return res.status(400).json({ error: error.details[0].message });
  }

  const existsEmail  = await emailVerification(user.email)
  if(existsEmail){
   return res 
         .status(409)
         .json({mesage: "Email in use"})
  }

  try{
    if(user.email && user.password){
      const newUser = await singupFunction(user)
      return res
      .status(201)
      .json({ message: 'The user has been added',
          user: {
             email: newUser.email,
             subscription: newUser.subscription
          }
      })
    }else{
      return res
      .status(400)
      .json({mesage: "Eroare de la librăria Joi sau o altă librărie de validare"})
    }
 }
  catch(err){
    return res.status(500).json({ message: `${err}`});
  }
  
})

// POST /users/login
router.post('/login', async (req, res, next) => {
  const {error, value:user} = UserSchema.validate(req.body) ;

  if(error){
    return res
     .status(400)
     .json({ error: error.details[0].message });
  }
  try{
    const existsEmail  = await emailVerification(user.email);
    const existPassword = await passwordVerification(user.email, user.password);

    if(!existsEmail){
     return res
       .status(401)
       .json({message:"Email is wrong"})
    }else if(!existPassword){
      return res
       .status(401)
       .json({message:"Password is wrong"})
    }else{
      
      const token = await loginFunction(existsEmail)
      return res
      .status(200)
      .json({message:"Login completed successfully",  
       token: token,
        user: {
         email: user.email,
         subscription: user.subscription
        },
      })
    }
  }
  catch(err){
    return res.status(500).json({ message: `${err}`});
  }
})

// GET /users/logout
router.get('/logout', validateAuth, async (req, res, next) => {
try{ 

  const header = req.get('authorization');
 
  if(!header) {
    return res.status(401).json({ message: 'Not authorized'});
  }
  const token = header.split(" ")[1];

 const payload =  ValidateJWT(token);
  const id = payload.id;
  const user = await User.findById(id)

  user.token = null;
  await user.save();
  return res
  .status(204).send()
}
catch(err){
  res.status(500).json({ message: `${err}`})
}
})

// GET /users/current
router.get('/current', validateAuth, async (req, res, next) => {
  try{ 
  
    const header = req.get('authorization');
   
    if(!header) {
      return res.status(401).json({ message: 'Not authorized'});
    }
    const token = header.split(" ")[1];
  
   const payload =  ValidateJWT(token);
    const id = payload.id;
    const user = await User.findById(id)

    return res
    .status(200)
    .json({  
      user: {
      email: user.email,
      subscription: user.subscription
     },
    })
  }
  catch(err){
    res.status(500).json({ message: `${err}`})
  }
  })

export default router