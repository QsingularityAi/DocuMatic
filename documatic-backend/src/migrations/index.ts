import * as migration_20250515_220509_init_2025_05_16 from './20250515_220509_init_2025_05_16';
import * as migration_20250516_131458 from './20250516_131458';
import * as migration_20250521_204858_service_agent_role from './20250521_204858_service_agent_role';
import * as migration_20250521_212635_tenant_settings from './20250521_212635_tenant_settings';
import * as migration_20250521_213229_tenant_settings_fix1 from './20250521_213229_tenant_settings_fix1';
import * as migration_20250521_213230_convert_vid_to_numeric from './20250521_213230_convert_vid_to_numeric';
import * as migration_20250610_182621_sensors_and_assets_assoc from './20250610_182621_sensors_and_assets_assoc';

export const migrations = [
  {
    up: migration_20250515_220509_init_2025_05_16.up,
    down: migration_20250515_220509_init_2025_05_16.down,
    name: '20250515_220509_init_2025_05_16',
  },
  {
    up: migration_20250516_131458.up,
    down: migration_20250516_131458.down,
    name: '20250516_131458',
  },
  {
    up: migration_20250521_204858_service_agent_role.up,
    down: migration_20250521_204858_service_agent_role.down,
    name: '20250521_204858_service_agent_role',
  },
  {
    up: migration_20250521_212635_tenant_settings.up,
    down: migration_20250521_212635_tenant_settings.down,
    name: '20250521_212635_tenant_settings',
  },
  {
    up: migration_20250521_213229_tenant_settings_fix1.up,
    down: migration_20250521_213229_tenant_settings_fix1.down,
    name: '20250521_213229_tenant_settings_fix1',
  },
  {
    up: migration_20250521_213230_convert_vid_to_numeric.up,
    down: migration_20250521_213230_convert_vid_to_numeric.down,
    name: '20250521_213230_convert_vid_to_numeric',
  },
  {
    up: migration_20250610_182621_sensors_and_assets_assoc.up,
    down: migration_20250610_182621_sensors_and_assets_assoc.down,
    name: '20250610_182621_sensors_and_assets_assoc'
  },
];
