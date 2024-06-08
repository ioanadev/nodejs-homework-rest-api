import User from "../models/auth.js";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import "dotenv/config";
import gravatar from 'gravatar';
import Jimp from "jimp";
import passport from 'passport';

const PRIVATE_KEY = process.env.PRIVATE_KEY

export const singupFunction = async (user) => {

 const saltRounds = 10;
 const encryptedPass = await bcrypt.hash(user.password, saltRounds);
 const userAvatar= gravatar.url(user.email);

  const newUser = ({
   password: encryptedPass,
   email: user.email,
   subscription: user.subscription ?? "starter",
   avatarURL: userAvatar
  });

 const addNewUser = User.create(newUser)
 return addNewUser;   
}

export const emailVerification = async (email)=>{
 const verifEmail =  await User.findOne({email})
 return verifEmail;
}

export const passwordVerification = async(email, password)=>{
  const user = await emailVerification(email)
  if(!user){
   return false;
  }
  const verifPassword = bcrypt.compareSync(password, user.password)

  return verifPassword;
}

export const loginFunction = async (user) => {

  const payload = {
    id: user._id,
    useremail: user.email
  }

  const token = jwt.sign(
    payload, 
    PRIVATE_KEY, 
    { expiresIn: '1h' });

    user.token = token;
    await user.save();
    return token;
}

export const ValidateJWT = (token)=>{
  try{
    const decoded = jwt.verify(token, PRIVATE_KEY)
    return decoded
  }
  catch(err){
   console.log(err)
  }
}

export function validateAuth(req, res, next) {
  passport.authenticate("jwt", { session: false }, (err, user) => {
    if (!user || err) {
      return res
      .status(401).json({message: "Not authorized"});
    }
    req.user = user;
    next();
  })
  (req, res, next);
}

export const jimpFunction = async (path) =>{
  Jimp.read(path, (err, avatar) => {
    if (err) throw err;
    avatar
      .resize(250, 250) 
      .quality(60)
      .write(path); 
      // console.log("Avatar din jumpFunction:", avatar)
    // return avatar;
  });
  
}
