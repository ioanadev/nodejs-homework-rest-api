// import { boolean, string } from 'joi';
// import { required } from 'joi';
import mongoose from 'mongoose';

const {Schema, model} = mongoose;


const schema = new mongoose.Schema({ 
  name: {
    type: String,
    required: [true, 'Set name for contact']
  },
  email: {
    type: String,
  },
  phone: {
    type: String,
  },
  favorite: {
    type: Boolean,
    default: false,
  },
 });


const Contact = mongoose.model('Contact', schema);


export default Contact


  