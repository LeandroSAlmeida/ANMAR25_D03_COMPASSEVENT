import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from '@aws-sdk/client-ses';
import { config } from 'dotenv';

config();

const {
  AWS_REGION,
  AWS_ACCESS_KEY_ID,
  AWS_SECRET_ACCESS_KEY,
  AWS_SESSION_TOKEN,
  MAIL_FROM,
} = process.env;

const shouldSendMail =
  AWS_ACCESS_KEY_ID && AWS_SECRET_ACCESS_KEY && AWS_SESSION_TOKEN && MAIL_FROM;

export class MailService {
  private ses: SESClient | null = null;

  constructor() {
    if (shouldSendMail) {
      this.ses = new SESClient({
        region: AWS_REGION,
        credentials: {
          accessKeyId: AWS_ACCESS_KEY_ID!,
          secretAccessKey: AWS_SECRET_ACCESS_KEY!,
          sessionToken: AWS_SESSION_TOKEN!,
        },
      });
    } else {
      console.warn(
        'AWS credentials or MAIL_FROM are missing, email will not be sent',
      );
    }
  }

  async sendMail(to: string, subject: string, html: string) {
    if (!shouldSendMail || !this.ses) {
      console.log('Email not sent, problem with your credentials or config');
      return;
    }

    const params: SendEmailCommandInput = {
      Destination: { ToAddresses: [to] },
      Message: {
        Body: { Html: { Charset: 'UTF-8', Data: html } },
        Subject: { Charset: 'UTF-8', Data: subject },
      },
      Source: MAIL_FROM,
    };

    console.log('Sending email with params:', {
      Source: MAIL_FROM,
      ToAddresses: params.Destination?.ToAddresses,
      Subject: subject,
    });

    try {
      const result = await this.ses.send(new SendEmailCommand(params));
      console.log(`Email sent to: ${to}`, result);
    } catch (error) {
      console.error('Error sending email:', error);
    }
  }
}
