import { describe, it, expect, beforeEach, vi } from 'vitest';
import '../src/appliance-card';
import { ApplianceCard } from '../src/appliance-card';
import { mockHass } from './mocks';
import { HomeAssistant } from '../src/types';

describe('ApplianceCard rendering', () => {
  let element: ApplianceCard;

  beforeEach(async () => {
    element = document.createElement('appliance-card') as ApplianceCard;
    document.body.appendChild(element);
  });

  it('should log a deprecation warning when using custom:smartthings-card config type', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    element.setConfig({
      type: 'custom:smartthings-card',
      appliance_type: 'microwave',
    });
    expect(consoleWarnSpy).toHaveBeenCalledWith(
      expect.stringContaining('smartthings-card: "type: custom:smartthings-card" is deprecated'),
    );
    consoleWarnSpy.mockRestore();
  });

  it('should not render the container if no config', () => {
    expect(element.shadowRoot?.querySelector('.container')).toBeNull();
  });

  it('should render the card with legacy smartthings-card custom element and editor', async () => {
    const legacyElement = document.createElement('smartthings-card') as ApplianceCard;
    document.body.appendChild(legacyElement);
    legacyElement.setConfig({
      type: 'custom:smartthings-card',
      appliance_type: 'microwave',
      job_state_entity: 'sensor.microwave_job_state',
    });
    legacyElement.hass = mockHass as HomeAssistant;

    await legacyElement.updateComplete;
    const card = legacyElement.shadowRoot?.querySelector('ha-card');
    expect(card).toBeTruthy();

    const editorEl = (legacyElement.constructor as any).getConfigElement();
    expect(editorEl.tagName.toLowerCase()).toBe('smartthings-card-editor');
  });

  it('should render the card with appliance-card custom element', async () => {
    const applianceElement = document.createElement('appliance-card') as ApplianceCard;
    document.body.appendChild(applianceElement);
    applianceElement.setConfig({
      type: 'custom:appliance-card',
      appliance_type: 'microwave',
      job_state_entity: 'sensor.microwave_job_state',
    });
    applianceElement.hass = mockHass as HomeAssistant;

    await applianceElement.updateComplete;
    const card = applianceElement.shadowRoot?.querySelector('ha-card');
    expect(card).toBeTruthy();
  });

  it('should render the card with microwave configuration', async () => {
    element.setConfig({
      type: 'custom:smartthings-card',
      appliance_type: 'microwave',
      job_state_entity: 'sensor.microwave_job_state',
    });
    element.hass = mockHass as HomeAssistant;
    
    // Wait for update
    await element.updateComplete;

    const card = element.shadowRoot?.querySelector('ha-card');
    expect(card).toBeTruthy();
    
    const timeValue = element.shadowRoot?.querySelector('.time-fg');
    // timer row should show the formatted time (or --:--:-- if mocked time doesn't match)
    expect(timeValue).toBeTruthy();
  });

  it('should show --- for temperature when microwave is idle', async () => {
    const hass = {
      ...mockHass,
      states: {
        ...mockHass.states,
        'sensor.microwave_job_state': {
          state: 'idle',
          attributes: {},
        },
        'sensor.microwave_temperature': {
          state: '100',
          attributes: { unit_of_measurement: '°C' },
        },
      },
    };

    element.setConfig({
      type: 'custom:smartthings-card',
      appliance_type: 'microwave',
      job_state_entity: 'sensor.microwave_job_state',
      temperature_entity: 'sensor.microwave_temperature',
    });
    element.hass = hass as any;

    await element.updateComplete;

    const tempValue = element.shadowRoot?.querySelector('.temp-fg span');
    expect(tempValue?.textContent?.trim()).toBe('---');
  });

  it('should show actual temperature when microwave is cooking', async () => {
    const hass = {
      ...mockHass,
      states: {
        ...mockHass.states,
        'sensor.microwave_job_state': {
          state: 'cooking',
          attributes: {},
        },
        'sensor.microwave_mode': {
          state: 'microwave',
          attributes: {},
        },
        'sensor.microwave_temperature': {
          state: '100',
          attributes: { unit_of_measurement: '°C' },
        },
      },
    };

    element.setConfig({
      type: 'custom:smartthings-card',
      appliance_type: 'microwave',
      job_state_entity: 'sensor.microwave_job_state',
      mode_entity: 'sensor.microwave_mode',
      temperature_entity: 'sensor.microwave_temperature',
    });
    element.hass = hass as any;

    await element.updateComplete;

    const tempValue = element.shadowRoot?.querySelector('.temp-fg span');
    expect(tempValue?.textContent?.trim()).toBe('100');
  });

  it('should render the card with refrigerator configuration and column layout', async () => {
    element.setConfig({
      type: 'custom:smartthings-card',
      appliance_type: 'refrigerator',
      fridge_temp_entity: 'sensor.refrigerator_temp',
      freezer_temp_entity: 'sensor.freezer_temp',
    });
    const hass = {
      ...mockHass,
      states: {
        ...mockHass.states,
        'sensor.refrigerator_temp': {
          state: '4',
          attributes: { unit_of_measurement: '°C' },
        },
        'sensor.freezer_temp': {
          state: '-18',
          attributes: { unit_of_measurement: '°C' },
        },
      },
    };
    element.hass = hass as any;

    await element.updateComplete;

    const fridgeColumn = element.shadowRoot?.querySelector('.fridge-temp-column');
    expect(fridgeColumn).toBeTruthy();
    
    const fridgeIcon = fridgeColumn?.querySelector('.fridge-icon');
    expect(fridgeIcon).toBeTruthy();

    const fridgeTempBox = fridgeColumn?.querySelector('.fridge-temp-box');
    expect(fridgeTempBox).toBeTruthy();

    const freezerColumn = element.shadowRoot?.querySelector('.freezer-temp-column');
    expect(freezerColumn).toBeTruthy();
  });

  it('should render the card with washer configuration and weight_sensing stage active', async () => {
    const hass = {
      ...mockHass,
      states: {
        ...mockHass.states,
        'sensor.washer_job_state': {
          state: 'weight_sensing',
          attributes: {},
        },
      },
    };

    element.setConfig({
      type: 'custom:smartthings-card',
      appliance_type: 'washer',
      job_state_entity: 'sensor.washer_job_state',
    });
    element.hass = hass as any;

    await element.updateComplete;

    const card = element.shadowRoot?.querySelector('ha-card');
    expect(card).toBeTruthy();

    const activeIconContainer = element.shadowRoot?.querySelector('.job-icon-container.active');
    expect(activeIconContainer).toBeTruthy();

    const img = activeIconContainer?.querySelector('img.job-icon');
    expect(img?.getAttribute('alt')).toBe('Sensing');
  });

  it('should render secondary alarm icon when alarm_code_entity is active', async () => {
    const hass = {
      ...mockHass,
      states: {
        ...mockHass.states,
        'sensor.washer_alarm_code': {
          state: 'DC',
          attributes: {},
        },
      },
    };

    element.setConfig({
      type: 'custom:appliance-card',
      appliance_type: 'washer',
      alarm_code_entity: 'sensor.washer_alarm_code',
    });
    element.hass = hass as any;

    await element.updateComplete;

    const alarmIcon = element.shadowRoot?.querySelector('.secondary-icon.alarm');
    expect(alarmIcon).toBeTruthy();
    expect(alarmIcon?.getAttribute('title')).toBe('Alarm Code: DC');
  });

  it('should render the card with cooktop configuration and burner status elements', async () => {
    element.setConfig({
      type: 'custom:appliance-card',
      appliance_type: 'cooktop',
      burner_left_front_on_entity: 'binary_sensor.cooktop_left_front_on',
      burner_left_front_power_entity: 'sensor.cooktop_left_front_power_pct',
      burner_right_rear_on_entity: 'binary_sensor.cooktop_right_rear_on',
      sabbath_mode_entity: 'switch.cooktop_sabbath_mode',
    });
    const hass = {
      ...mockHass,
      states: {
        ...mockHass.states,
        'binary_sensor.cooktop_left_front_on': { state: 'on', attributes: {} },
        'sensor.cooktop_left_front_power_pct': { state: '85', attributes: {} },
        'binary_sensor.cooktop_right_rear_on': { state: 'off', attributes: {} },
        'switch.cooktop_sabbath_mode': { state: 'on', attributes: {} },
      },
    };
    element.hass = hass as any;

    await element.updateComplete;

    const cooktopContainer = element.shadowRoot?.querySelector('.container.cooktop');
    expect(cooktopContainer).not.toBeNull();

    const leftFrontBurner = element.shadowRoot?.querySelector('.burner-element.left-front');
    expect(leftFrontBurner?.classList.contains('on')).toBe(true);

    const powerText = leftFrontBurner?.querySelector('.burner-power');
    expect(powerText?.textContent?.trim()).toBe('85%');

    const sabbathIcon = element.shadowRoot?.querySelector('.secondary-icon.sabbath');
    expect(sabbathIcon).not.toBeNull();
  });
});
