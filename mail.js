const mailgun=require('nodemailer-mailgun-transport');
const nodemailer=require('nodemailer')

const auth=
{
    auth:{
        api_key: process.env.API_KEY2,
        domain: process.env.DOMAIN
    }
};

const transporter= nodemailer.createTransport(mailgun(auth));
const sendMail=(email,message,cb)=>
{
    const mailOptions = {
        from: email,
        to: 'sanya.bahl001@gmail.com', // TODO: the receiver email
        text: message
    };
    
    transporter.sendMail(mailOptions,(err)=>
    {
      if(err)
      cb(err,null)
      else
      cb(null,data)
    })
}
module.exports=sendMail;