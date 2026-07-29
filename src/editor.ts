import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, SmartthingsCardConfig } from './types';

@customElement('appliance-card-editor')
export class ApplianceCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: SmartthingsCardConfig;

  public setConfig(config: SmartthingsCardConfig): void {
    this._config = config;
  }

  private _schema() {
    const deviceId = this._config?.device_id;
    const integrations = ['smartthings', 'localthings', 'smartthinq_sensors', 'lg_thinq'];

    const baseSchema = [
      {
        name: 'device_id',
        label: 'Appliance Device',
        selector: {
          device: {
            filter: integrations.map((integration) => ({ integration })),
          },
        },
      },
      {
        name: 'power_entity',
        label: 'Power Entity (Optional)',
        selector: { entity: { device_id: deviceId, integration: integrations } },
      },
      {
        name: 'machine_state_entity',
        label: 'Machine State Entity (Optional)',
        selector: { entity: { device_id: deviceId, integration: integrations } },
      },
    ];

    const secondaryIconsSchema = [
      {
        name: 'wifi_entity',
        label: 'WiFi Status Entity (Optional)',
        selector: { entity: { device_id: deviceId, integration: integrations, domain: ['binary_sensor', 'switch'] } },
      },
      {
        name: 'lock_entity',
        label: 'Child Lock Entity (Optional)',
        selector: { entity: { device_id: deviceId, integration: integrations, domain: ['binary_sensor', 'switch'] } },
      },
    ];

    const refrigeratorSchema = [
      {
        name: 'fridge_temp_entity',
        label: 'Fridge Temperature Entity (Optional)',
        selector: { entity: { device_id: deviceId, integration: integrations, domain: ['sensor', 'number', 'select'] } },
      },
      {
        name: 'freezer_temp_entity',
        label: 'Freezer Temperature Entity (Optional)',
        selector: { entity: { device_id: deviceId, integration: integrations, domain: ['sensor', 'number', 'select'] } },
      },
      {
        name: 'door_entities',
        label: 'Door Sensors (Optional)',
        selector: { entity: { device_id: deviceId, integration: integrations, domain: 'binary_sensor', multiple: true } },
      },
      {
        name: 'ice_maker_entity',
        label: 'Ice Maker Entity (Optional)',
        selector: { entity: { device_id: deviceId, integration: integrations, domain: ['switch', 'input_boolean'] } },
      },
      {
        name: 'filter_status_entity',
        label: 'Water Filter Usage Entity (Optional)',
        selector: { entity: { device_id: deviceId, integration: integrations, domain: 'sensor' } },
      },
      {
        name: 'filter_reset_entity',
        label: 'Filter Reset Entity (Optional)',
        selector: { entity: { device_id: deviceId, integration: integrations, domain: ['button', 'switch', 'input_button'] } },
      },
    ];

    const commonApplianceSchema = [
      {
        name: 'mode_entity',
        label: 'Mode Entity (Optional)',
        selector: { entity: { device_id: deviceId, integration: integrations } },
      },
      {
        name: 'job_state_entity',
        label: 'Job State Entity (Optional)',
        selector: { entity: { device_id: deviceId, integration: integrations } },
      },
      {
        name: 'time_entity',
        label: 'Time Entity (Optional)',
        selector: { entity: { device_id: deviceId, integration: integrations, domain: 'sensor' } },
      },
    ];

    const microwaveSchema = [
      {
        name: 'fan_entity',
        label: 'Fan Control Entity (Optional)',
        selector: { entity: { device_id: deviceId, integration: integrations, domain: ['fan', 'number', 'select'] } },
      },
      {
        name: 'light_entity',
        label: 'Light Control Entity (Optional)',
        selector: { entity: { device_id: deviceId, integration: integrations, domain: 'light' } },
      },
      {
        name: 'temperature_entity',
        label: 'Temperature Entity (Optional)',
        selector: { entity: { device_id: deviceId, integration: integrations, domain: 'sensor' } },
      },
    ];

    const footerSchema = [
      { name: 'appliance_image', label: 'Appliance Image Path (Optional)', selector: { text: {} } },
      { name: 'background_color', label: 'Background Color (Optional)', selector: { color_rgb: {} } },
    ];

    let finalSchema: any[] = [...baseSchema];

    if (this._config?.appliance_type === 'refrigerator') {
      finalSchema = finalSchema.concat(refrigeratorSchema);
    } else if (this._config?.appliance_type === 'microwave') {
      finalSchema = finalSchema.concat(commonApplianceSchema).concat(secondaryIconsSchema).concat(microwaveSchema);
    } else {
      finalSchema = finalSchema.concat(commonApplianceSchema).concat(secondaryIconsSchema);
    }

    return finalSchema.concat(footerSchema);
  }

  protected override render(): TemplateResult {
    if (!this.hass || !this._config) {
      return html``;
    }

    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${this._schema()}
        .computeLabel=${(s: any) => s.label || s.name}
        @value-changed=${this._valueChanged}
      ></ha-form>
    `;
  }

  private _valueChanged(ev: CustomEvent): void {
    if (!this._config || !this.hass) {
      return;
    }

    const value = ev.detail.value;
    let newConfig = { ...value };

    if (this._config.device_id !== value.device_id) {
      // Device changed, reset and try to autofill
      // Start fresh but preserve the basic info
      newConfig = {
        type: value.type,
        device_id: value.device_id,
        appliance_type: this._config.appliance_type || value.appliance_type,
      } as SmartthingsCardConfig;

      newConfig = this._autofillConfig(newConfig);
    }

    this._config = newConfig;

    this.dispatchEvent(
      new CustomEvent('config-changed', {
        detail: { config: this._config },
        bubbles: true,
        composed: true,
      }),
    );
  }

  private _autofillConfig(config: SmartthingsCardConfig): SmartthingsCardConfig {
    if (!this.hass) return config;

    const deviceId = config.device_id;
    const entities = Object.keys(this.hass.states);
    let newConfig = { ...config };

    // Filter entities by device_id if provided
    const deviceEntities = deviceId
      ? entities.filter(id => (this.hass as any).entities?.[id]?.device_id === deviceId)
      : entities;

    // If no device-specific entities found (e.g. registry not loaded), fall back to all
    const relevantEntities = deviceEntities.length > 0 ? deviceEntities : entities;

    // 1. Detect Appliance Type if not set or if device changed
    if (deviceId) {
      const allText = relevantEntities.map(id => id + ' ' + (this.hass!.states[id].attributes.friendly_name || '')).join(' ').toLowerCase();

      if (allText.includes('refrigerator') || allText.includes('fridge') || allText.includes('freezer')) {
        newConfig.appliance_type = 'refrigerator';
      } else if (allText.includes('dishwasher')) {
        newConfig.appliance_type = 'dishwasher';
      } else if (allText.includes('washer')) {
        newConfig.appliance_type = 'washer';
      } else if (allText.includes('dryer')) {
        newConfig.appliance_type = 'dryer';
      } else if (allText.includes('microwave')) {
        newConfig.appliance_type = 'microwave';
      } else if (allText.includes('oven')) {
        newConfig.appliance_type = 'oven';
      }
    }

    const type = newConfig.appliance_type;
    if (!type) return newConfig;

    // 2. Helper to find a specific entity (stripping trailing numeric suffixes like _2, _3)
    const findEntity = (suffixes: string[], domain?: string) => {
      return relevantEntities.find((id) => {
        const normalizedId = id.toLowerCase().replace(/_\d+$/, '');
        const matchesSuffix = suffixes.some((s) => normalizedId.endsWith(s) || normalizedId.includes(s));
        const matchesDomain = !domain || id.startsWith(domain + '.');
        return matchesSuffix && matchesDomain;
      });
    };

    // 3. Autofill logic supporting SmartThings, LocalThings, SmartThinQ Sensors, and LG ThinQ
    newConfig.power_entity = newConfig.power_entity || findEntity(['_switch', '_power', '_power_switch'], 'switch') || findEntity(['_power', '_state'], 'binary_sensor');
    newConfig.machine_state_entity = newConfig.machine_state_entity || findEntity(['_machine_state', '_operation_state', '_appliance_state', '_current_status', '_run_state', '_operation', '_state']);
    newConfig.job_state_entity = newConfig.job_state_entity || findEntity(['_job_state', '_running_state', '_cycle_state', '_pre_state', '_current_course', '_progress', '_cooking_mode']);
    newConfig.time_entity = newConfig.time_entity || findEntity(['_time_remaining', '_remaining_time', '_time_left', '_estimated_finish', '_total_time'], 'sensor');
    newConfig.wifi_entity = newConfig.wifi_entity || findEntity(['_wifi', '_connectivity', '_ssid'], 'binary_sensor') || findEntity(['_ssid'], 'sensor');
    newConfig.lock_entity = newConfig.lock_entity || findEntity(['_lock', '_child_lock', '_door_lock', '_remote_start']);
    newConfig.fan_entity = newConfig.fan_entity || findEntity(['_fan'], 'fan') || findEntity(['_fan_speed'], 'number');
    newConfig.light_entity = newConfig.light_entity || findEntity(['_light'], 'light');
    newConfig.temperature_entity = newConfig.temperature_entity || findEntity(['_temperature', '_target_temperature'], 'sensor');

    if (type === 'refrigerator') {
      newConfig.fridge_temp_entity = newConfig.fridge_temp_entity || findEntity(['_fridge_temp', '_refrigerator_temp', '_refrigerator_temperature', '_fridge_target_temperature']);
      newConfig.freezer_temp_entity = newConfig.freezer_temp_entity || findEntity(['_freezer_temp', '_freezer_temperature', '_freezer_target_temperature']);
      newConfig.ice_maker_entity = newConfig.ice_maker_entity || findEntity(['_ice_maker', '_ice_maker_status', '_ice_maker_switch']);
      newConfig.filter_status_entity = newConfig.filter_status_entity || findEntity(['_filter_status', '_water_filter_status', '_filter_usage'], 'sensor');
      newConfig.filter_reset_entity = newConfig.filter_reset_entity || findEntity(['_filter_reset', '_reset_water_filter', '_water_filter_reset'], 'button') || findEntity(['_filter_reset', '_reset_water_filter', '_water_filter_reset'], 'switch');

      const doors = relevantEntities.filter(id => (id.includes('_door') || id.includes('_door_open')) && id.startsWith('binary_sensor.'));
      if (doors.length > 0 && (!newConfig.door_entities || newConfig.door_entities.length === 0)) {
        newConfig.door_entities = doors;
      }
    }

    return newConfig;
  }
}

@customElement('smartthings-card-editor')
export class SmartthingsCardEditor extends ApplianceCardEditor { }
