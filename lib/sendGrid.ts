import * as sgMail from "@sendgrid/mail";

const sendgridKey = process.env.SENDGRID_API_KEY;

//sgMail.setApiKey(process.env.SENDGRID_API_KEY);

sgMail.setApiKey(sendgridKey);

export { sgMail };
