const sgMail = require("@sendgrid/mail");
import logger from 'lib/logger';

export function sendClaimEmail(email, claimUrl) {
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: "lewin76@gmail.com", // SendGrid verified mail account
    subject: "Claim your PrepIntel account",
    text: `Claim your PrepIntel account today\n ${claimUrl}`,
    html: `<h3>Claim your PrepIntel account today</h3> <a href="${claimUrl}">${claimUrl}</a>`,
  };

  sgMail
    .send(msg)
    .then(() => {
        logger.info("Email sent");
    })
    .catch((error) => {
        logger.error(error);
    });
}

export function sendResetPasswordEmail(email, claimUrl) {
  // using Twilio SendGrid's v3 Node.js Library
  // https://github.com/sendgrid/sendgrid-nodejs
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: email,
    from: "lewin76@gmail.com", // SendGrid verified mail account
    subject: "Password Reset",
    text: `Reset your PrepIntel password: \n ${claimUrl}`,
    html: `<h3>Reset your PrepIntel password: </h3> <a href="${claimUrl}">${claimUrl}</a>`,
  };

  sgMail
    .send(msg)
    .then(() => {
        logger.info("Email sent");
    })
    .catch((error) => {
        logger.error(error);
    });
}

