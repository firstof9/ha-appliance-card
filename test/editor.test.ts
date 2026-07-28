import { describe, it, expect } from 'vitest';
import '../src/editor';
import { ApplianceCardEditor } from '../src/editor';
import { mockHass } from './mocks';

describe('ApplianceCardEditor with LocalThings', () => {
  it('should generate form schema with device selector filter array', () => {
    const editor = document.createElement('smartthings-card-editor') as ApplianceCardEditor;
    editor.setConfig({
      type: 'custom:smartthings-card',
      appliance_type: 'washer',
    });
    editor.hass = mockHass as any;

    const schema = (editor as any)._schema();
    const deviceSchema = schema.find((s: any) => s.name === 'device_id');
    expect(deviceSchema.selector.device.filter).toEqual([
      { integration: 'smartthings' },
      { integration: 'localthings' },
    ]);
  });

  it('should autofill LocalThings entities based on entity naming conventions', () => {
    const editor = document.createElement('smartthings-card-editor') as ApplianceCardEditor;
    const localthingsHass = {
      ...mockHass,
      entities: {
        'switch.washer_power_switch': { device_id: 'dev_local_1' },
        'sensor.washer_operation_state': { device_id: 'dev_local_1' },
        'sensor.washer_running_state': { device_id: 'dev_local_1' },
        'sensor.washer_remaining_time': { device_id: 'dev_local_1' },
      },
      states: {
        'switch.washer_power_switch': { state: 'on', attributes: { friendly_name: 'Washer Power Switch' } },
        'sensor.washer_operation_state': { state: 'run', attributes: { friendly_name: 'Washer Operation State' } },
        'sensor.washer_running_state': { state: 'wash', attributes: { friendly_name: 'Washer Running State' } },
        'sensor.washer_remaining_time': { state: '00:25:00', attributes: { friendly_name: 'Washer Remaining Time' } },
      },
    };
    editor.hass = localthingsHass as any;

    const autofilled = (editor as any)._autofillConfig({
      type: 'custom:smartthings-card',
      device_id: 'dev_local_1',
      appliance_type: 'washer',
    });

    expect(autofilled.power_entity).toBe('switch.washer_power_switch');
    expect(autofilled.machine_state_entity).toBe('sensor.washer_operation_state');
    expect(autofilled.job_state_entity).toBe('sensor.washer_running_state');
    expect(autofilled.time_entity).toBe('sensor.washer_remaining_time');
  });

  it('should autofill LocalThings estimated finish time entity', () => {
    const editor = document.createElement('smartthings-card-editor') as ApplianceCardEditor;
    const localthingsHass = {
      ...mockHass,
      entities: {
        'sensor.samsung_dishwasher_da_dw_a51_20_common_estimated_finish': { device_id: 'dev_local_dw' },
      },
      states: {
        'sensor.samsung_dishwasher_da_dw_a51_20_common_estimated_finish': { state: '2026-07-28T22:30:00Z', attributes: { friendly_name: 'Estimated Finish' } },
      },
    };
    editor.hass = localthingsHass as any;

    const autofilled = (editor as any)._autofillConfig({
      type: 'custom:smartthings-card',
      device_id: 'dev_local_dw',
      appliance_type: 'dishwasher',
    });

    expect(autofilled.time_entity).toBe('sensor.samsung_dishwasher_da_dw_a51_20_common_estimated_finish');
  });
});
