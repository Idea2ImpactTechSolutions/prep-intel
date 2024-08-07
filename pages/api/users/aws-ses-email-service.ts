
import AWS from 'aws-sdk';

AWS.config.update({
  accessKeyId: process.env.AWS_SES_KEY,
  secretAccessKey: process.env.AWS_SES_SECRET_KEY,
  region: process.env.AWS_REGION // Replace with your AWS SES region
});

const ses = new AWS.SES();

interface EmailParams {
  to: string;
  subject: string;
  text: string;
}

export const sendEmail = async ({ to, subject, text }: EmailParams): Promise<void> => {
  const params = {
    Source: process.env.SES_VERIFIED_EMAIL, // Your verified email address
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Body: {
        Text: { Data: text },
      },
      Subject: { Data: subject },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log(result);
  } catch (error) {
    console.error(error);
    throw new Error('Error sending email');
  }
};