const mailgun=require('nodemailer-mailgun-transport');
const nodemailer=require('nodemailer')

const auth=
{
    auth:{
        api_key: "3f3fc351581e09a415db64e9cec7398b-9ad3eb61-3f75be7a",
        domain: "sandbox086d2bbca5584a9a9969236a701f790c.mailgun.org"
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