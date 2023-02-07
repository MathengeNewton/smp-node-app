const { SentryErrorLogging } = require('./exceptionHandler');
const nodemailer = require('nodemailer');
const mailUser = process.env.SMTP_HOST;
const mailPass =  process.env.SMTP_MAIL_API_KEY;

const transporter = nodemailer.createTransport({
    host: 'smtp.mailgun.org', port: 587, auth: {        
    user: mailUser, pass: mailPass},        
});

const nodeMailer = async (mailto, mailSubject, htmlBody)=>{
    let sendMail = await transporter.sendMail({        
        from: mailUser, to: mailto,
        subject: mailSubject, 
        html: htmlBody
    }); 

    try{
        if(sendMail){
            return true;
        }else{
            return false;
        }
    }catch(e){
        SentryErrorLogging(e);
        return false;
    }

}


module.exports = { nodeMailer };