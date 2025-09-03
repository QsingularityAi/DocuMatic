import { resetPasswordTemplate } from '@/services/emails/templates/auth/reset-password';
import { welcomeTemplate } from '@/services/emails/templates/auth/welcome';
import { emailLayout } from '@/services/emails/templates/layout';
import { workOrderAssignedTemplate } from '@/services/emails/templates/work-orders/assigned';
import { workOrderCompletedTemplate } from '@/services/emails/templates/work-orders/completed';
import { workOrderOverdueTemplate } from '@/services/emails/templates/work-orders/overdue';
import { EmailTemplateMap, EmailTemplateName } from '@/types/emails';
import { NOTIFICATION_TEMPLATE_PATHS } from '@/types/shared';
import { Payload } from 'payload';

type TemplateFunction<T> = (data: T) => string;

/**
 * Map of template paths to their implementation functions
 * This mapping is necessary to connect the template paths with their actual implementations
 */
const templates: {
  [K in EmailTemplateName]: TemplateFunction<EmailTemplateMap[K]>;
} = {
  // Auth templates
  'auth/reset-password': resetPasswordTemplate,
  'auth/welcome': welcomeTemplate,

  // Work order notification templates
  [NOTIFICATION_TEMPLATE_PATHS.WORK_ORDER_COMPLETED]:
    workOrderCompletedTemplate,
  [NOTIFICATION_TEMPLATE_PATHS.WORK_ORDER_ASSIGNED]: workOrderAssignedTemplate,
  [NOTIFICATION_TEMPLATE_PATHS.WORK_ORDER_OVERDUE]: workOrderOverdueTemplate,
} as const;

/**
 * Email service for sending all types of emails
 */
export const emailService = {
  /**
   * Send an email using a predefined template
   */
  sendTemplate: async <T extends EmailTemplateName>(
    templateName: T,
    data: EmailTemplateMap[T],
    payload: Payload,
  ): Promise<void> => {
    try {
      const template = templates[templateName];

      if (!template) {
        throw new Error(`Email template not found: ${templateName}`);
      }

      await payload.sendEmail({
        to: data.to,
        subject: data.subject,
        html: template(data),
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  },

  /**
   * Send a custom email without a predefined template
   * The content will still be wrapped in the master template
   */
  send: async (
    options: {
      to: string;
      subject: string;
      html: string;
    },
    payload: Payload,
  ): Promise<void> => {
    try {
      await payload.sendEmail({
        to: options.to,
        subject: options.subject,
        html: emailLayout(options.html),
      });
    } catch (error) {
      console.error('Failed to send email:', error);
      throw error;
    }
  },
};
