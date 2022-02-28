const nodeMailer = require('nodemailer')

const sendEmail = async(options)=>{
    const transporter = nodeMailer.createTransport({
        service : process.env.SMPT_SERVICE ,
        auth : {
            email : process.env.SMPT_EMAIL,
            password : process.env.SMPT_PASSWORD
        }
        
    })

    const mailOptions = {
        form : process.env.SMPT_EMAIL,
        to : options.email,
        subject : options.subject,
        message : options.message
    }

    await transporter.sendMail(mailOptions)
}

module.exports(sendEmail)