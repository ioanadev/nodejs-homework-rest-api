import sgMail from '@sendgrid/mail';
import "dotenv/config";

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendEmailVerification = async (email, token)=>{
const verificationLink = 'http://localhost:3000/users/verify';
const msg = {
  to: email,
  from: 'ioanah.dev@gmail.com',
  subject: 'Email Verification ',

  html: `Hello from <strong>ContactsApp</strong> 
  <br />
   To validate your account <a href="${verificationLink}/${token}">
      click here
    </a> 
    .
    <br />`,
};
try{
  await sgMail
  .send(msg)
     console.log(`Email sent succesfully to ${email}`);
}
  catch(error) {
    if (error?.response) {
      console.error(error.response.body);
    } else {
      console.error(error);
    }
  };
}