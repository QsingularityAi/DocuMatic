import { emailLayout } from '@/services/emails/templates/layout';
import { ResetPasswordEmailData } from '@/types/emails';

export const resetPasswordTemplate = (data: ResetPasswordEmailData): string =>
  emailLayout(`
  <h2>Reset Your Password</h2>
  <p>You have requested to reset your password. Click the button below to set a new password:</p>
  <p style="text-align: center; margin: 30px 0;">
    <a href="${data.resetURL}?token=${data.token}" 
       style="background-color: #0066cc; color: white; padding: 12px 24px; border-radius: 4px; text-decoration: none;">
      Reset Password
    </a>
  </p>
  <p style="color: #666; font-size: 14px;">If you didn't request this, you can safely ignore this email.</p>
  <p style="color: #666; font-size: 14px;">This link will expire in 1 hour.</p>
`);
