import { isSuperAdmin } from '@/access/isSuperAdmin';
import { createSystemEventHooks } from '@/hooks/createSystemEvent';
import { CollectionConfig } from 'payload';

const timezoneOptions = [
  // UTC
  { label: '(UTC+00:00) Coordinated Universal Time', value: 'UTC' },

  // Americas
  { label: '(UTC-10:00) Hawaii', value: 'Pacific/Honolulu' },
  {
    label: '(UTC-08:00) Pacific Time (US & Canada)',
    value: 'America/Los_Angeles',
  },
  { label: '(UTC-07:00) Mountain Time (US & Canada)', value: 'America/Denver' },
  { label: '(UTC-07:00) Phoenix', value: 'America/Phoenix' },
  { label: '(UTC-06:00) Central Time (US & Canada)', value: 'America/Chicago' },
  { label: '(UTC-06:00) Mexico City', value: 'America/Mexico_City' },
  {
    label: '(UTC-05:00) Eastern Time (US & Canada)',
    value: 'America/New_York',
  },
  { label: '(UTC-05:00) Bogota', value: 'America/Bogota' },
  { label: '(UTC-04:00) Atlantic Time (Canada)', value: 'America/Halifax' },
  { label: '(UTC-04:00) Santiago', value: 'America/Santiago' },
  { label: '(UTC-03:00) São Paulo', value: 'America/Sao_Paulo' },
  {
    label: '(UTC-03:00) Buenos Aires',
    value: 'America/Argentina/Buenos_Aires',
  },

  // Europe & Africa
  { label: '(UTC+00:00) London, Dublin', value: 'Europe/London' },
  { label: '(UTC+01:00) Berlin, Paris, Rome', value: 'Europe/Paris' },
  { label: '(UTC+01:00) Amsterdam', value: 'Europe/Amsterdam' },
  { label: '(UTC+01:00) Madrid', value: 'Europe/Madrid' },
  { label: '(UTC+02:00) Helsinki, Kiev', value: 'Europe/Helsinki' },
  { label: '(UTC+02:00) Athens', value: 'Europe/Athens' },
  { label: '(UTC+02:00) Cairo', value: 'Africa/Cairo' },
  { label: '(UTC+02:00) Jerusalem', value: 'Asia/Jerusalem' },
  { label: '(UTC+03:00) Moscow, St. Petersburg', value: 'Europe/Moscow' },
  { label: '(UTC+03:00) Istanbul', value: 'Europe/Istanbul' },
  { label: '(UTC+02:00) Johannesburg', value: 'Africa/Johannesburg' },

  // Asia & Oceania
  { label: '(UTC+03:30) Tehran', value: 'Asia/Tehran' },
  { label: '(UTC+04:00) Dubai', value: 'Asia/Dubai' },
  { label: '(UTC+05:30) Mumbai, New Delhi', value: 'Asia/Kolkata' },
  { label: '(UTC+05:45) Kathmandu', value: 'Asia/Kathmandu' },
  { label: '(UTC+06:00) Dhaka', value: 'Asia/Dhaka' },
  { label: '(UTC+07:00) Bangkok, Jakarta', value: 'Asia/Bangkok' },
  { label: '(UTC+08:00) Singapore', value: 'Asia/Singapore' },
  { label: '(UTC+08:00) Hong Kong', value: 'Asia/Hong_Kong' },
  { label: '(UTC+08:00) Beijing, Shanghai', value: 'Asia/Shanghai' },
  { label: '(UTC+08:00) Taipei', value: 'Asia/Taipei' },
  { label: '(UTC+09:00) Tokyo', value: 'Asia/Tokyo' },
  { label: '(UTC+09:00) Seoul', value: 'Asia/Seoul' },
  { label: '(UTC+09:30) Adelaide', value: 'Australia/Adelaide' },
  { label: '(UTC+10:00) Sydney', value: 'Australia/Sydney' },
  { label: '(UTC+10:00) Brisbane', value: 'Australia/Brisbane' },
  { label: '(UTC+12:00) Auckland', value: 'Pacific/Auckland' },
];

export const Tenants: CollectionConfig = {
  slug: 'tenants',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: isSuperAdmin.collection,
    read: () => true,
    update: isSuperAdmin.collection,
    delete: isSuperAdmin.collection,
  },
  hooks: {
    afterChange: [createSystemEventHooks.afterChange],
    afterDelete: [createSystemEventHooks.afterDelete],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
    },
    {
      name: 'logo',
      type: 'text',
      required: false,
    },
    {
      name: 'settings',
      type: 'group',
      fields: [
        {
          name: 'timezone',
          type: 'select',
          required: false,
          options: timezoneOptions,
          defaultValue: 'Europe/Paris',
        },
        {
          name: 'language',
          type: 'select',
          required: false,
          options: [
            { label: 'English', value: 'en' },
            { label: 'Spanish', value: 'es' },
          ],
          defaultValue: 'en',
        },
        {
          name: 'workingDays',
          type: 'select',
          required: false,
          hasMany: true,
          options: [
            { label: 'Monday', value: 'mon' },
            { label: 'Tuesday', value: 'tue' },
            { label: 'Wednesday', value: 'wed' },
            { label: 'Thursday', value: 'thu' },
            { label: 'Friday', value: 'fri' },
            { label: 'Saturday', value: 'sat' },
            { label: 'Sunday', value: 'sun' },
          ],
          defaultValue: ['mon', 'tue', 'wed', 'thu', 'fri'],
        },
        {
          name: 'dateFormat',
          type: 'select',
          required: false,
          options: [
            { label: '31/12/2025', value: 'dd/MM/yyyy' },
            { label: '2025-12-31', value: 'yyyy-MM-dd' },
            { label: 'January 12th, 2025', value: 'MMMM d, yyyy' },
            { label: '12th of January, 2025', value: "d 'of' MMMM, yyyy" },
            { label: 'Jan 12, 2025', value: 'MMM d, yyyy' },
            {
              label: 'Wednesday, January 1st, 2025',
              value: 'EEEE, MMMM d, yyyy',
            },
            { label: 'Wed, Jan 1, 2025', value: 'EEE, MMM d, yyyy' },
            { label: '1 January 2025', value: 'd MMMM yyyy' },
            { label: '1 Jan 2025', value: 'd MMM yyyy' },
          ],
          defaultValue: 'd MMM yyyy',
        },
        {
          name: 'timeFormat',
          type: 'select',
          required: false,
          options: [
            { label: '12h', value: 'h:mm a' },
            { label: '24h', value: 'HH:mm' },
          ],
          defaultValue: 'HH:mm',
        },
      ],
    },
  ],
};
