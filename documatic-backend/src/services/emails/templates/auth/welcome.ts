import { emailLayout } from '@/services/emails/templates/layout';
import { WelcomeEmailData } from '@/types/emails';

export const welcomeTemplate = (data: WelcomeEmailData): string => {
  const userName = data.firstName
    ? `${data.firstName}${data.lastName ? ` ${data.lastName}` : ''}`
    : 'there';

  return emailLayout(`
    <h2>Welcome to DocuMatic!</h2>
    <p>Hi ${userName},</p>
    <p>Welcome to DocuMatic! We're excited to have you on board.</p>
    <p>DocuMatic is your new CMMS solution that will help you:</p>
    <ul style="padding-left: 20px;">
      <li>Manage your assets and equipment</li>
      <li>Handle work orders efficiently</li>
      <li>Track maintenance activities</li>
      <li>And much more!</li>
    </ul>
    <p style="margin-top: 30px;">If you have any questions, feel free to reach out to our support team.</p>
    <p>Best regards,<br>The DocuMatic Team</p>
  `);
};
