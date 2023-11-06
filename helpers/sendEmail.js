import nodemailer from "nodemailer";
import "dotenv/config";

const {UKRNET_PASSWORD, UKRNET_EMAIL} = process.env;

const nodemailerConfig = {
    host: "smtp.ukr.net",
    port: 465, // 25, 465, 2525
    secure: true,
    auth: {
        user: UKRNET_EMAIL,
        pass: UKRNET_PASSWORD,
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);

// const data = {
//     from: UKRNET_EMAIL,
//     to: "vajope7931@hondabbs.com",
//     subject: "Test email",
//     html: "<strong>Test email</strong>"
// };

// transport.sendMail(data)
// .then(() => console.log("Email send success"))
// .catch(error => console.log(error.message))


const sendEmail = (data) => {
    const email = {...data, from: UKRNET_EMAIL};
    return transport.sendMail(email);
}

export default sendEmail;