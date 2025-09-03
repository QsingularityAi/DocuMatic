import { frontendUrl } from '@/config';
import {
  emailLayout,
  type EmailTemplate,
} from '@/services/emails/templates/layout';
import { WorkOrderOverdueEmailData } from '@/types/emails';

export const workOrderOverdueTemplate = (
  data: WorkOrderOverdueEmailData,
  forceDarkMode = false,
): string => {
  const template: EmailTemplate = {
    peak: `${data.peak}`,
    content: `
    <p><img src="https://cdn.documatic.xyz/icon-date-error.png" width="48" style="width: 48px; height: 48px;" /></p>
    
    <p class="sm-leading-32 dark-mode-text-base" style="margin: 0; margin-bottom: 36px; font-family: ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif; font-size: 24px; font-weight: 600; color: $colors.light.text;">
      Work Order Overdue
    </p>

    <p class="dark-mode-text-base" style="margin: 0; margin-bottom: 24px; color: $colors.light.text;">
      The Work Order #${data.workOrderId} "<strong>${data.workOrderName}</strong>" was due on <strong>${data.workOrderDueDate}</strong> and hasn’t been completed yet. You might want to follow up or reschedule it.
    </p>
    
    <a href="${frontendUrl}/work-orders/${data.workOrderId}" class="hover-bg-blue-600" style="display: inline-block; background-color: $colors.light.primary; padding: 8px 16px; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
      View Details
    </a>

    <table style="width: 100%;" cellpadding="0" cellspacing="0" role="presentation">
      <tr>
        <td style="padding-top: 32px; padding-bottom: 32px;">
          <hr class="dark-mode-border" style="border-bottom-width: 1px; border-top-width: 0; border-color: $colors.light.border;">
        </td>
      </tr>
    </table>

    <p class="dark-mode-text-muted" style="margin: 0; margin-bottom: 16px; color: $colors.light.textMuted;">
      Button not working? Copy and paste the link below into your web browser
      <a href="${frontendUrl}/work-orders/${data.workOrderId}" class="dark-mode-text-muted" style="color: $colors.light.textMuted;">${frontendUrl}/work-orders/${data.workOrderId}</a>
    </p>
`,
  };

  return emailLayout(template, forceDarkMode);
};
