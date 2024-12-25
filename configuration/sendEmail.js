require("dotenv").config();
const {Resend} = require("resend");

if(!process.env['RESEND_API_KEY']){
    console.log("Provide RESEND_API_KEY in side the .env file")
}
const resend = new Resend(process.env['RESEND_API_KEY']);

const sendEmail = async ({sendTo, subject, html}) =>{
    try {
        const {data, error} = await resend.emails.send({
            from: `Binkeyit <noreply@amitprajapati.co.in>`,
            to: sendTo,
            subject,
            html,
        });
        if(error){
            console.error("Failed to send email", {error});
            return;
        }
        console.log("Email sent successfully");
        return data;
    } catch (error) {
        console.error("Failed to send email", error);
    }
}

module.exports = sendEmail;