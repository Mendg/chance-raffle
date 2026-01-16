import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  user: string;
  password: string;
  from: string;
}

function getEmailConfig(): EmailConfig | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, EMAIL_FROM } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD || !EMAIL_FROM) {
    console.warn('Email configuration is incomplete. Emails will not be sent.');
    return null;
  }

  return {
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    user: SMTP_USER,
    password: SMTP_PASSWORD,
    from: EMAIL_FROM,
  };
}

interface EntryConfirmationData {
  name: string;
  email: string;
  assignedNumber: number;
  amountCharged: number; // in cents
  campaignName: string;
  prizeDescription: string;
}

export async function sendEntryConfirmation(data: EntryConfirmationData): Promise<boolean> {
  const config = getEmailConfig();
  if (!config) {
    console.log('Email not configured. Skipping confirmation email.');
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.password,
    },
  });

  const amountDollars = (data.amountCharged / 100).toFixed(2);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: 'Proxima Nova', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #1b365d 0%, #36bbae 100%);
          color: white;
          padding: 30px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .number-box {
          background: #1b365d;
          color: white;
          font-size: 48px;
          font-weight: bold;
          padding: 20px 40px;
          border-radius: 10px;
          display: inline-block;
          margin: 20px 0;
        }
        .details {
          background: white;
          padding: 20px;
          border-radius: 8px;
          margin: 20px 0;
        }
        .amount {
          color: #36bbae;
          font-size: 24px;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 12px;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${data.campaignName}</h1>
        <p>Entry Confirmation</p>
      </div>
      <div class="content">
        <p>Hi ${data.name},</p>
        <p>Thank you for supporting our cause! Your entry has been confirmed.</p>

        <div style="text-align: center;">
          <p><strong>Your Entry Number:</strong></p>
          <div class="number-box">#${data.assignedNumber}</div>
        </div>

        <div class="details">
          <p><strong>Amount Charged:</strong> <span class="amount">$${amountDollars}</span></p>
          <p><strong>Prize:</strong> ${data.prizeDescription}</p>
        </div>

        <p>Good luck! We'll notify you if you're selected as the winner.</p>

        <p>Thank you for your generosity!</p>
      </div>
      <div class="footer">
        <p>This is an automated confirmation email. Please do not reply.</p>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: config.from,
      to: data.email,
      subject: `${data.campaignName} - Entry #${data.assignedNumber} Confirmed`,
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send confirmation email:', error);
    return false;
  }
}

interface WinnerNotificationData {
  name: string;
  email: string;
  assignedNumber: number;
  campaignName: string;
  prizeDescription: string;
  cashValue: number; // in cents
}

export async function sendWinnerNotification(data: WinnerNotificationData): Promise<boolean> {
  const config = getEmailConfig();
  if (!config) {
    console.log('Email not configured. Skipping winner notification.');
    return false;
  }

  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: {
      user: config.user,
      pass: config.password,
    },
  });

  const cashValueDollars = (data.cashValue / 100).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body {
          font-family: 'Proxima Nova', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background: linear-gradient(135deg, #36bbae 0%, #1b365d 100%);
          color: white;
          padding: 40px;
          text-align: center;
          border-radius: 10px 10px 0 0;
        }
        .header h1 {
          font-size: 36px;
          margin: 0;
        }
        .content {
          background: #f9f9f9;
          padding: 30px;
          border-radius: 0 0 10px 10px;
        }
        .winner-badge {
          background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
          color: #1b365d;
          font-size: 28px;
          font-weight: bold;
          padding: 20px 40px;
          border-radius: 10px;
          display: inline-block;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>CONGRATULATIONS!</h1>
        <p>You're the Winner!</p>
      </div>
      <div class="content">
        <p>Dear ${data.name},</p>

        <div style="text-align: center;">
          <div class="winner-badge">WINNER #${data.assignedNumber}</div>
        </div>

        <p>We're thrilled to announce that you've won the <strong>${data.campaignName}</strong>!</p>

        <p><strong>Your Prize:</strong> ${data.prizeDescription}</p>
        <p><strong>Cash-out Option:</strong> ${cashValueDollars}</p>

        <p>Please reply to this email to claim your prize and arrange delivery.</p>

        <p>Thank you for supporting our cause!</p>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: config.from,
      to: data.email,
      subject: `You Won the ${data.campaignName}!`,
      html,
    });
    return true;
  } catch (error) {
    console.error('Failed to send winner notification:', error);
    return false;
  }
}
