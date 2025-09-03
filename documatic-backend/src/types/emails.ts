import {
  NOTIFICATION_TEMPLATE_PATHS,
  WorkOrderAssignedSharedData,
  WorkOrderCompletedSharedData,
  WorkOrderOverdueSharedData,
} from './shared';

/**
 * Base email template data
 */
export type BaseEmailData = {
  to: string;
  subject: string;
  peak?: string; // the "sub subject" of the email
};

/**
 * Auth related email templates
 */
export type ResetPasswordEmailData = BaseEmailData & {
  token: string;
  resetURL: string;
};

export type WelcomeEmailData = BaseEmailData & {
  firstName?: string;
  lastName?: string;
};

/**
 * Notification related email templates
 */
export type WorkOrderCompletedEmailData = BaseEmailData &
  WorkOrderCompletedSharedData;

export type WorkOrderAssignedEmailData = BaseEmailData &
  WorkOrderAssignedSharedData;

export type WorkOrderOverdueEmailData = BaseEmailData &
  WorkOrderOverdueSharedData;

/**
 * Map of email templates to their data types
 */
export type EmailTemplateMap = {
  'auth/reset-password': ResetPasswordEmailData;
  'auth/welcome': WelcomeEmailData;
  [NOTIFICATION_TEMPLATE_PATHS.WORK_ORDER_COMPLETED]: WorkOrderCompletedEmailData;
  [NOTIFICATION_TEMPLATE_PATHS.WORK_ORDER_ASSIGNED]: WorkOrderAssignedEmailData;
  [NOTIFICATION_TEMPLATE_PATHS.WORK_ORDER_OVERDUE]: WorkOrderOverdueEmailData;
};

/**
 * Email template names
 */
export type EmailTemplateName = keyof EmailTemplateMap;
