'use client';

import { workOrderCompletedTemplate } from '@/services/emails/templates/work-orders/completed';
import { useState } from 'react';

export default function DebugEmailPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Sample data for the work order completed template
  const sampleData = {
    workOrderId: 123,
    workOrderName: 'Equipment Maintenance #123',
    completedBy: {
      id: 1,
      name: 'John Smith',
    },
    to: 'user@example.com',
    subject: 'Work Order Completed',
    peak: 'by Max Mustermann',
    workOrderDueDate: '2025-05-22',
  };

  // Generate the email HTML
  const emailHtml = workOrderCompletedTemplate(sampleData, isDarkMode);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
      }}
    >
      <div
        style={{
          padding: '1rem',
          borderBottom: '1px solid #e5e7eb',
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <input
            type="checkbox"
            checked={isDarkMode}
            onChange={(e) => setIsDarkMode(e.target.checked)}
          />
          Dark Mode
        </label>
      </div>
      <iframe
        srcDoc={emailHtml}
        style={{
          flex: 1,
          width: '100%',
          border: 'none',
        }}
        title="Email Preview"
      />
    </div>
  );
}
