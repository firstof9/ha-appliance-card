import { describe, it, expect, beforeEach } from 'vitest';
import '../src/appliance-card';
import { ApplianceCard } from '../src/appliance-card';
import { mockHass } from './mocks';
import { HomeAssistant } from '../src/types';
import { ASSETS } from '../src/assets';
import { getAsset } from '../src/utils';

const kettleHass = (modeState: string) =>
  ({
    ...mockHass,
    states: {
      ...mockHass.states,
      'select.smart_kettle_mode': {
        entity_id: 'select.smart_kettle_mode',
        state: modeState,
        attributes: { friendly_name: 'Smart Kettle Mode' },
        last_changed: '2026-05-12T16:00:00Z',
        last_updated: '2026-05-12T16:00:00Z',
        context: { id: 'k1', parent_id: null, user_id: null },
      },
    },
  }) as HomeAssistant;

describe('Kettle', () => {
  let element: ApplianceCard;

  beforeEach(() => {
    element = document.createElement('appliance-card') as ApplianceCard;
    document.body.appendChild(element);
  });

  it('resolves every kettle stage icon from the embedded assets when active', async () => {
    element.setConfig({
      type: 'custom:appliance-card',
      appliance_type: 'kettle',
      job_state_entity: 'select.smart_kettle_mode',
    });
    element.hass = kettleHass('coffee');
    await element.updateComplete;

    const active = element.shadowRoot?.querySelector('.job-icon-container.active');
    expect(active).toBeTruthy();

    const img = active?.querySelector('img.job-icon');
    const src = img?.getAttribute('src') ?? '';

    // An unresolved asset falls through to a bare /local/... path instead of a
    // bundled data URI, which 404s: the images are not shipped to www/.
    expect(src.startsWith('/local/')).toBe(false);
  });

  it('falls back to the base icon when an -on variant is not bundled', () => {
    const kettle = ASSETS['kettle'] ?? {};
    // Kettle ships no "-on" artwork, so the active icon must reuse the base.
    expect(Object.keys(kettle)).not.toContain('boil-on.png');
    expect(getAsset('kettle', 'boil-on.png')).toBe(kettle['boil.png']);
    expect(getAsset('kettle', 'coffee-on.png')).toBe(kettle['coffee.png']);
    expect(getAsset('kettle', 'tea-on.png')).toBe(kettle['tea.png']);
  });

  it('still prefers a real -on variant where one exists', () => {
    const oven = ASSETS['oven'] ?? {};
    expect(getAsset('oven', 'bake-on.png')).toBe(oven['bake-on.png']);
    expect(getAsset('oven', 'bake-on.png')).not.toBe(oven['bake.png']);
  });

  it('maps Govee work modes onto stages via stage_map', async () => {
    element.setConfig({
      type: 'custom:appliance-card',
      appliance_type: 'kettle',
      job_state_entity: 'select.smart_kettle_mode',
      stage_map: {
        'Black Tea/Boil': 'black_tea_boil',
        'Green Tea': 'green_tea',
        'Oolong Tea': 'oolong_tea',
        Coffee: 'coffee',
        DIY: 'boil',
      },
    });
    element.hass = kettleHass('Green Tea');
    await element.updateComplete;

    const active = element.shadowRoot?.querySelector('.job-icon-container.active');
    expect(active).toBeTruthy();
    expect(active?.querySelector('img.job-icon')?.getAttribute('alt')).toBe('Green Tea');
  });

  it('stays idle when only mode_entity is set, since kettles have no mode fallback', async () => {
    element.setConfig({
      type: 'custom:appliance-card',
      appliance_type: 'kettle',
      mode_entity: 'select.smart_kettle_mode',
    });
    element.hass = kettleHass('coffee');
    await element.updateComplete;

    expect(element.shadowRoot?.querySelector('.job-icon-container.active')).toBeNull();
  });
});
