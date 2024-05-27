import mongoose from'mongoose';

export async function connectToDb (){
    try{
      await mongoose
      .connect('mongodb+srv://ioanahdev:j4Xo14DJZgni7yFB@cluster0.do5fuou.mongodb.net/db-contacts');
     console.log('Database connection successful')
    }
    catch(error){
     console.log(error);
     process.exit(1);
    }
    }