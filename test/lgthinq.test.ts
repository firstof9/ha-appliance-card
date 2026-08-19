import { describe, it, expect, beforeEach } from 'vitest';
import '../src/appliance-card';
import { ApplianceCard } from '../src/appliance-card';
import { mockHass } from './mocks';
import { HomeAssistant } from '../src/types';

const s = (id: string, state: string, attrs: Record<string, unknown> = {}) => ({
  entity_id: id,
  state,
  attributes: attrs,
  last_changed: '2026-08-19T01:00:00Z',
  last_updated: '2026-08-19T01:00:00Z',
  context: { id: 'x', parent_id: null, user_id: null },
});

// Real values from the live LG ThinQ integration: the machine is running but the
// power switch still reads "off", and remaining time is an ISO timestamp.
const hass = {
  ...mockHass,
  states: {
    ...mockHass.states,
    'switch.washer_power': s('switch.washer_power', 'off'),
    'sensor.washer_current_status': s('sensor.washer_current_status', 'running'),
    'sensor.washer_remaining_time': s('sensor.washer_remaining_time', '2026-08-19T02:36:38+00:00', {
      device_class: 'timestamp',
    }),
  },
} as HomeAssistant;

const wmap = { running: 'wash', rinsing: 'rinse', spinning: 'spin', power_off: 'off' };

describe('LG ThinQ washer', () => {
  let el: ApplianceCard;
  beforeEach(() => {
    el = document.createElement('appliance-card') as ApplianceCard;
    document.body.appendChild(el);
  });

  it('lights the Wash stage when status is running via stage_map', async () => {
    el.setConfig({
      type: 'custom:appliance-card',
      appliance_type: 'washer',
      job_state_entity: 'sensor.washer_current_status',
      stage_map: wmap,
    });
    el.hass = hass;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.job-icon-container.active')).toBeTruthy();
  });

  it('keeps the countdown when power_entity reads off but the cycle is running', async () => {
    el.setConfig({
      type: 'custom:appliance-card',
      appliance_type: 'washer',
      power_entity: 'switch.washer_power',
      job_state_entity: 'sensor.washer_current_status',
      time_entity: 'sensor.washer_remaining_time',
      stage_map: wmap,
    });
    el.hass = hass;
    await el.updateComplete;
    const t = el.shadowRoot?.querySelector('.time-fg')?.textContent?.trim();
    expect(t).not.toBe('--:--:--');
    expect(t).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    expect(el.shadowRoot?.querySelector('.job-icon-container.active')).toBeTruthy();
  });

  it('still blanks the countdown when powered off and genuinely idle', async () => {
    const idle = {
      ...hass,
      states: {
        ...hass.states,
        'sensor.washer_current_status': s('sensor.washer_current_status', 'power_off'),
      },
    } as HomeAssistant;
    el.setConfig({
      type: 'custom:appliance-card',
      appliance_type: 'washer',
      power_entity: 'switch.washer_power',
      job_state_entity: 'sensor.washer_current_status',
      time_entity: 'sensor.washer_remaining_time',
      stage_map: wmap,
    });
    el.hass = idle;
    await el.updateComplete;
    expect(el.shadowRoot?.querySelector('.time-fg')?.textContent?.trim()).toBe('--:--:--');
  });
});
