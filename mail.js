const mailgun=require('nodemailer-mailgun-transport');
const nodemailer=require('nodemailer')

const auth=
{
    auth:{
        api_key:'8fd6ffe1b484c8307edd34c775d3628a-50f43e91-0a03cb2e',
        domain:'sandbox3e5cb7f8119745119f5bd88ea5874ad6.mailgun.org'
    }
};

const transporter= nodemailer.createTransport(mailgun(auth));
const sendMail=(email,message,cb)=>
{
    const mailOptions = {
        from: email,
        to: 'ulogistics21@gmail.com', // TODO: the receiver email
        text: message
    };
    
    transporter.sendMail(mailOptions,(err,data)=>
    {
      if(err)
      cb(err,null);
      else
      cb( null,data);
    })
}
module.exports=sendMail;