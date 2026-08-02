import { describe, it, expect } from 'vitest';
import '../src/editor';
import { ApplianceCardEditor } from '../src/editor';
import { mockHass } from './mocks';

describe('ApplianceCardEditor with LocalThings', () => {
  it('should generate form schema with device selector filter array and entity selector device_id filter', () => {
    const editor = document.createElement('smartthings-card-editor') as ApplianceCardEditor;
    editor.setConfig({
      type: 'custom:smartthings-card',
      device_id: 'dev_123',
      appliance_type: 'washer',
    });
    editor.hass = {
      ...mockHass,
      entities: {
        'switch.washer_power': { device_id: 'dev_123' },
      },
      states: {
        'switch.washer_power': { state: 'on', attributes: {} },
      },
    } as any;

    const schema = (editor as any)._schema();
    const deviceSchema = schema.find((s: any) => s.name === 'device_id');
    expect(deviceSchema.selector.device.filter).toEqual([
      { integration: 'smartthings' },
      { integration: 'localthings' },
      { integration: 'smartthinq_sensors' },
      { integration: 'lg_thinq' },
    ]);

    const powerSchema = schema.find((s: any) => s.name === 'power_entity');
    expect(powerSchema.selector.entity).toEqual({
      filter: { domain: ['switch', 'binary_sensor'] },
      include_entities: ['switch.washer_power'],
    });
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

  it('should autofill SmartThinQ Sensors entities', () => {
    const editor = document.createElement('smartthings-card-editor') as ApplianceCardEditor;
    const lgHass = {
      ...mockHass,
      entities: {
        'switch.washer_power': { device_id: 'dev_lg_st' },
        'sensor.washer_run_state': { device_id: 'dev_lg_st' },
        'sensor.washer_pre_state': { device_id: 'dev_lg_st' },
        'sensor.washer_remaining_time': { device_id: 'dev_lg_st' },
        'binary_sensor.washer_child_lock': { device_id: 'dev_lg_st' },
        'sensor.washer_ssid': { device_id: 'dev_lg_st' },
      },
      states: {
        'switch.washer_power': { state: 'on', attributes: { friendly_name: 'Washer Power' } },
        'sensor.washer_run_state': { state: 'RUNNING', attributes: { friendly_name: 'Washer Run State' } },
        'sensor.washer_pre_state': { state: 'WASH', attributes: { friendly_name: 'Washer Pre State' } },
        'sensor.washer_remaining_time': { state: '00:30:00', attributes: { friendly_name: 'Washer Remaining Time' } },
        'binary_sensor.washer_child_lock': { state: 'off', attributes: { friendly_name: 'Washer Child Lock' } },
        'sensor.washer_ssid': { state: 'HomeWiFi', attributes: { friendly_name: 'Washer SSID' } },
      },
    };
    editor.hass = lgHass as any;

    const autofilled = (editor as any)._autofillConfig({
      type: 'custom:smartthings-card',
      device_id: 'dev_lg_st',
      appliance_type: 'washer',
    });

    expect(autofilled.power_entity).toBe('switch.washer_power');
    expect(autofilled.machine_state_entity).toBe('sensor.washer_run_state');
    expect(autofilled.job_state_entity).toBe('sensor.washer_pre_state');
    expect(autofilled.time_entity).toBe('sensor.washer_remaining_time');
    expect(autofilled.lock_entity).toBe('binary_sensor.washer_child_lock');
    expect(autofilled.wifi_entity).toBe('sensor.washer_ssid');
  });

  it('should autofill LG ThinQ entities with trailing numeric suffixes (e.g. _2)', () => {
    const editor = document.createElement('smartthings-card-editor') as ApplianceCardEditor;
    const lgThinqHass = {
      ...mockHass,
      entities: {
        'switch.washer_power_2': { device_id: 'dev_lg_thinq' },
        'sensor.washer_current_status': { device_id: 'dev_lg_thinq' },
        'sensor.washer_remaining_time_2': { device_id: 'dev_lg_thinq' },
        'binary_sensor.washer_remote_start_2': { device_id: 'dev_lg_thinq' },
      },
      states: {
        'switch.washer_power_2': { state: 'on', attributes: { friendly_name: 'Washer Power' } },
        'sensor.washer_current_status': { state: 'washing', attributes: { friendly_name: 'Washer Current Status' } },
        'sensor.washer_remaining_time_2': { state: '00:15:00', attributes: { friendly_name: 'Washer Remaining Time' } },
        'binary_sensor.washer_remote_start_2': { state: 'on', attributes: { friendly_name: 'Washer Remote Start' } },
      },
    };
    editor.hass = lgThinqHass as any;

    const autofilled = (editor as any)._autofillConfig({
      type: 'custom:smartthings-card',
      device_id: 'dev_lg_thinq',
      appliance_type: 'washer',
    });

    expect(autofilled.power_entity).toBe('switch.washer_power_2');
    expect(autofilled.machine_state_entity).toBe('sensor.washer_current_status');
    expect(autofilled.time_entity).toBe('sensor.washer_remaining_time_2');
    expect(autofilled.lock_entity).toBe('binary_sensor.washer_remote_start_2');
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

  it('should autofill LocalThings progress job state entity', () => {
    const editor = document.createElement('smartthings-card-editor') as ApplianceCardEditor;
    const localthingsHass = {
      ...mockHass,
      entities: {
        'sensor.samsung_dryer_da_wm_a51_20_common_progress': { device_id: 'dev_local_dryer' },
      },
      states: {
        'sensor.samsung_dryer_da_wm_a51_20_common_progress': { state: 'drying', attributes: { friendly_name: 'Progress' } },
      },
    };
    editor.hass = localthingsHass as any;

    const autofilled = (editor as any)._autofillConfig({
      type: 'custom:smartthings-card',
      device_id: 'dev_local_dryer',
      appliance_type: 'dryer',
    });

    expect(autofilled.job_state_entity).toBe('sensor.samsung_dryer_da_wm_a51_20_common_progress');
  });

  it('should autofill LocalThings cooking_mode job state, fan, and light entities for microwave/oven', () => {
    const editor = document.createElement('smartthings-card-editor') as ApplianceCardEditor;
    const localthingsHass = {
      ...mockHass,
      entities: {
        'select.kitchen_samsung_microwave_tp2x_da_ks_microwave_0101x_40436241_50040100011411000200000000000000_cooking_mode': { device_id: 'dev_local_mw' },
        'fan.kitchen_samsung_microwave_tp2x_da_ks_microwave_0101x_40436241_50040100011411000200000000000000': { device_id: 'dev_local_mw' },
        'switch.kitchen_samsung_microwave_tp2x_da_ks_microwave_0101x_40436241_50040100011411000200000000000000_lamp': { device_id: 'dev_local_mw' },
      },
      states: {
        'select.kitchen_samsung_microwave_tp2x_da_ks_microwave_0101x_40436241_50040100011411000200000000000000_cooking_mode': { state: 'microwave', attributes: { friendly_name: 'Cooking Mode' } },
        'fan.kitchen_samsung_microwave_tp2x_da_ks_microwave_0101x_40436241_50040100011411000200000000000000': { state: 'off', attributes: { friendly_name: 'Microwave Fan' } },
        'switch.kitchen_samsung_microwave_tp2x_da_ks_microwave_0101x_40436241_50040100011411000200000000000000_lamp': { state: 'off', attributes: { friendly_name: 'Microwave Lamp' } },
      },
    };
    editor.hass = localthingsHass as any;

    const autofilled = (editor as any)._autofillConfig({
      type: 'custom:smartthings-card',
      device_id: 'dev_local_mw',
      appliance_type: 'microwave',
    });

    expect(autofilled.job_state_entity).toBe('select.kitchen_samsung_microwave_tp2x_da_ks_microwave_0101x_40436241_50040100011411000200000000000000_cooking_mode');
    expect(autofilled.fan_entity).toBe('fan.kitchen_samsung_microwave_tp2x_da_ks_microwave_0101x_40436241_50040100011411000200000000000000');
    expect(autofilled.light_entity).toBe('switch.kitchen_samsung_microwave_tp2x_da_ks_microwave_0101x_40436241_50040100011411000200000000000000_lamp');
  });

  it('should autofill alarm_code_entity for Samsung washer alarm code', () => {
    const editor = document.createElement('smartthings-card-editor') as ApplianceCardEditor;
    const alarmHass = {
      ...mockHass,
      entities: {
        'sensor.samsung_washer_da_wm_tp2_20_common_alarm_code': { device_id: 'dev_local_washer' },
      },
      states: {
        'sensor.samsung_washer_da_wm_tp2_20_common_alarm_code': { state: 'DC', attributes: { friendly_name: 'Washer Alarm Code' } },
      },
    };
    editor.hass = alarmHass as any;

    const autofilled = (editor as any)._autofillConfig({
      type: 'custom:appliance-card',
      device_id: 'dev_local_washer',
      appliance_type: 'washer',
    });

    expect(autofilled.alarm_code_entity).toBe('sensor.samsung_washer_da_wm_tp2_20_common_alarm_code');
  });
});
