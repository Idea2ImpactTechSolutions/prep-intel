
import AWS from 'aws-sdk';
import logger from 'lib/logger';

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
  if(process.env.SEND_EMAIL){
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
      await ses.sendEmail(params).promise();
    } catch (error) {
      logger.error(error);
    }
  }else{
    logger.info(`Email would be sent to : ${to}\n. To enable email sending update the SEND_EMAIL env variable to true`)
  }

};