import { LitElement, html, TemplateResult } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, ApplianceCardConfig, SmartthingsCardConfig } from './types';

@customElement('appliance-card-editor')
export class ApplianceCardEditor extends LitElement {
  @property({ attribute: false }) public hass?: HomeAssistant;

  @state() private _config?: ApplianceCardConfig;

  public setConfig(config: ApplianceCardConfig): void {
    this._config = config;
  }


  private _schema() {
    const deviceId = this._config?.device_id;
    const integrations = ['smartthings', 'localthings', 'smartthinq_sensors', 'lg_thinq', 'ge_home'];

    const getEntitySelector = (domain?: string | string[], multiple?: boolean) => {
      const entitySelectorConfig: Record<string, any> = {};
      if (domain) {
        entitySelectorConfig.filter = { domain };
      }
      if (multiple) {
        entitySelectorConfig.multiple = true;
      }

      if (deviceId && this.hass) {
        const entities = Object.keys(this.hass.states || {});
        const deviceEntities = entities.filter(
          (id) => (this.hass as any).entities?.[id]?.device_id === deviceId
        );
        if (deviceEntities.length > 0) {
          entitySelectorConfig.include_entities = deviceEntities;
        }
      }

      return { entity: entitySelectorConfig };
    };

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
        selector: getEntitySelector(['switch', 'binary_sensor']),
      },
      {
        name: 'machine_state_entity',
        label: 'Machine State Entity (Optional)',
        selector: getEntitySelector(['sensor', 'select', 'binary_sensor']),
      },
    ];

    const secondaryIconsSchema = [
      {
        name: 'wifi_entity',
        label: 'WiFi Status Entity (Optional)',
        selector: getEntitySelector(['binary_sensor', 'switch', 'sensor']),
      },
      {
        name: 'lock_entity',
        label: 'Child Lock Entity (Optional)',
        selector: getEntitySelector(['binary_sensor', 'switch']),
      },
      {
        name: 'alarm_code_entity',
        label: 'Alarm Code Entity (Optional)',
        selector: getEntitySelector(['sensor', 'select']),
      },
    ];

    const refrigeratorSchema = [
      {
        name: 'fridge_temp_entity',
        label: 'Fridge Temperature Entity (Optional)',
        selector: getEntitySelector(['sensor', 'number', 'select']),
      },
      {
        name: 'freezer_temp_entity',
        label: 'Freezer Temperature Entity (Optional)',
        selector: getEntitySelector(['sensor', 'number', 'select']),
      },
      {
        name: 'door_entities',
        label: 'Door Sensors (Optional)',
        selector: getEntitySelector('binary_sensor', true),
      },
      {
        name: 'ice_maker_entity',
        label: 'Ice Maker Entity (Optional)',
        selector: getEntitySelector(['switch', 'input_boolean']),
      },
      {
        name: 'filter_status_entity',
        label: 'Water Filter Usage Entity (Optional)',
        selector: getEntitySelector('sensor'),
      },
      {
        name: 'filter_reset_entity',
        label: 'Filter Reset Entity (Optional)',
        selector: getEntitySelector(['button', 'switch', 'input_button']),
      },
    ];

    const commonApplianceSchema = [
      {
        name: 'mode_entity',
        label: 'Mode Entity (Optional)',
        selector: getEntitySelector(['sensor', 'select']),
      },
      {
        name: 'job_state_entity',
        label: 'Job State Entity (Optional)',
        selector: getEntitySelector(['sensor', 'select']),
      },
      {
        name: 'time_entity',
        label: 'Time Entity (Optional)',
        selector: getEntitySelector('sensor'),
      },
    ];

    const microwaveSchema = [
      {
        name: 'fan_entity',
        label: 'Fan Control Entity (Optional)',
        selector: getEntitySelector(['fan', 'number', 'select']),
      },
      {
        name: 'light_entity',
        label: 'Light Control Entity (Optional)',
        selector: getEntitySelector(['light', 'switch']),
      },
      {
        name: 'temperature_entity',
        label: 'Temperature Entity (Optional)',
        selector: getEntitySelector('sensor'),
      },
    ];

    const cooktopSchema = [
      {
        name: 'sabbath_mode_entity',
        label: 'Sabbath Mode Entity (Optional)',
        selector: getEntitySelector(['switch', 'binary_sensor']),
      },
      {
        name: 'burner_left_front_on_entity',
        label: 'Left Front Burner On (Optional)',
        selector: getEntitySelector('binary_sensor'),
      },
      {
        name: 'burner_left_rear_on_entity',
        label: 'Left Rear Burner On (Optional)',
        selector: getEntitySelector('binary_sensor'),
      },
      {
        name: 'burner_center_rear_on_entity',
        label: 'Center Rear Burner On (Optional)',
        selector: getEntitySelector('binary_sensor'),
      },
      {
        name: 'burner_right_front_on_entity',
        label: 'Right Front Burner On (Optional)',
        selector: getEntitySelector('binary_sensor'),
      },
      {
        name: 'burner_right_rear_on_entity',
        label: 'Right Rear Burner On (Optional)',
        selector: getEntitySelector('binary_sensor'),
      },
      {
        name: 'burner_left_front_power_entity',
        label: 'Left Front Power % (Optional)',
        selector: getEntitySelector('sensor'),
      },
      {
        name: 'burner_left_rear_power_entity',
        label: 'Left Rear Power % (Optional)',
        selector: getEntitySelector('sensor'),
      },
      {
        name: 'burner_right_front_power_entity',
        label: 'Right Front Power % (Optional)',
        selector: getEntitySelector('sensor'),
      },
      {
        name: 'burner_right_rear_power_entity',
        label: 'Right Rear Power % (Optional)',
        selector: getEntitySelector('sensor'),
      },
      {
        name: 'burner_left_front_sync_entity',
        label: 'Left Front Synchronized (Optional)',
        selector: getEntitySelector('binary_sensor'),
      },
      {
        name: 'burner_left_rear_sync_entity',
        label: 'Left Rear Synchronized (Optional)',
        selector: getEntitySelector('binary_sensor'),
      },
      {
        name: 'burner_center_rear_sync_entity',
        label: 'Center Rear Synchronized (Optional)',
        selector: getEntitySelector('binary_sensor'),
      },
      {
        name: 'burner_right_front_sync_entity',
        label: 'Right Front Synchronized (Optional)',
        selector: getEntitySelector('binary_sensor'),
      },
      {
        name: 'burner_right_rear_sync_entity',
        label: 'Right Rear Synchronized (Optional)',
        selector: getEntitySelector('binary_sensor'),
      },
    ];

    const footerSchema = [
      { name: 'appliance_image', label: 'Appliance Image Path (Optional)', selector: { text: {} } },
      { name: 'background_color', label: 'Background Color (Optional)', selector: { color_rgb: {} } },
    ];

    let finalSchema: any[] = [...baseSchema];

    if (this._config?.appliance_type === 'refrigerator') {
      finalSchema = finalSchema.concat(refrigeratorSchema);
    } else if (this._config?.appliance_type === 'cooktop') {
      finalSchema = finalSchema.concat(cooktopSchema).concat(secondaryIconsSchema);
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

  private _autofillConfig(config: ApplianceCardConfig): ApplianceCardConfig {
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
      } else if (allText.includes('cooktop')) {
        newConfig.appliance_type = 'cooktop';
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

    newConfig.power_entity = newConfig.power_entity || findEntity(['_cooktop_status'], 'binary_sensor') || findEntity(['_switch', '_power', '_power_switch', '_oven'], 'water_heater') || findEntity(['_switch', '_power', '_power_switch'], 'switch') || findEntity(['_power', '_state'], 'binary_sensor');
    newConfig.machine_state_entity = newConfig.machine_state_entity || findEntity(['_machine_state', '_operation_state', '_appliance_state', '_current_status', '_run_state', '_operation', '_state', '_current_state']);
    newConfig.job_state_entity = newConfig.job_state_entity || findEntity(['_job_state', '_running_state', '_cycle_state', '_pre_state', '_current_course', '_progress', '_cooking_mode', '_cook_mode']);
    newConfig.time_entity = newConfig.time_entity || findEntity(['_time_remaining', '_remaining_time', '_time_left', '_estimated_finish', '_total_time', '_cook_time_remaining', '_kitchen_timer'], 'sensor');
    newConfig.wifi_entity = newConfig.wifi_entity || findEntity(['_wifi', '_connectivity', '_ssid'], 'binary_sensor') || findEntity(['_ssid'], 'sensor');
    newConfig.lock_entity = newConfig.lock_entity || findEntity(['_lock', '_child_lock', '_door_lock', '_remote_start', '_remote_enabled']);
    newConfig.alarm_code_entity = newConfig.alarm_code_entity || findEntity(['_alarm_code', '_error_code', '_fault_code', '_alarm'], 'sensor') || findEntity(['_alarm_code', '_error_code', '_fault_code', '_alarm'], 'select');
    newConfig.fan_entity = newConfig.fan_entity || findEntity(['_fan', '_fan_speed', ''], 'fan') || findEntity(['_fan_speed'], 'number');
    newConfig.light_entity = newConfig.light_entity || findEntity(['_light', '_lamp', ''], 'light') || findEntity(['_light', '_lamp'], 'switch') || findEntity(['_light'], 'select');
    newConfig.temperature_entity = newConfig.temperature_entity || findEntity(['_temperature', '_target_temperature', '_display_temperature', '_raw_temperature'], 'sensor');
    newConfig.sabbath_mode_entity = newConfig.sabbath_mode_entity || findEntity(['_sabbath_mode'], 'switch') || findEntity(['_sabbath_mode'], 'binary_sensor');

    if (type === 'cooktop') {
      newConfig.burner_left_front_on_entity = newConfig.burner_left_front_on_entity || findEntity(['_left_front_on'], 'binary_sensor');
      newConfig.burner_left_rear_on_entity = newConfig.burner_left_rear_on_entity || findEntity(['_left_rear_on'], 'binary_sensor');
      newConfig.burner_center_rear_on_entity = newConfig.burner_center_rear_on_entity || findEntity(['_center_rear_on'], 'binary_sensor');
      newConfig.burner_right_front_on_entity = newConfig.burner_right_front_on_entity || findEntity(['_right_front_on'], 'binary_sensor');
      newConfig.burner_right_rear_on_entity = newConfig.burner_right_rear_on_entity || findEntity(['_right_rear_on'], 'binary_sensor');

      newConfig.burner_left_front_sync_entity = newConfig.burner_left_front_sync_entity || findEntity(['_left_front_synchronized'], 'binary_sensor');
      newConfig.burner_left_rear_sync_entity = newConfig.burner_left_rear_sync_entity || findEntity(['_left_rear_synchronized'], 'binary_sensor');
      newConfig.burner_center_rear_sync_entity = newConfig.burner_center_rear_sync_entity || findEntity(['_center_rear_synchronized'], 'binary_sensor');
      newConfig.burner_right_front_sync_entity = newConfig.burner_right_front_sync_entity || findEntity(['_right_front_synchronized'], 'binary_sensor');
      newConfig.burner_right_rear_sync_entity = newConfig.burner_right_rear_sync_entity || findEntity(['_right_rear_synchronized'], 'binary_sensor');

      newConfig.burner_left_front_power_entity = newConfig.burner_left_front_power_entity || findEntity(['_left_front_power_pct'], 'sensor');
      newConfig.burner_left_rear_power_entity = newConfig.burner_left_rear_power_entity || findEntity(['_left_rear_power_pct'], 'sensor');
      newConfig.burner_right_front_power_entity = newConfig.burner_right_front_power_entity || findEntity(['_right_front_power_pct'], 'sensor');
      newConfig.burner_right_rear_power_entity = newConfig.burner_right_rear_power_entity || findEntity(['_right_rear_power_pct'], 'sensor');
    }

    if (type === 'refrigerator') {
      newConfig.fridge_temp_entity = newConfig.fridge_temp_entity || findEntity(['_fridge_temp', '_fridge_temperature', '_refrigerator_temp', '_refrigerator_temperature', '_fridge_target_temperature']);
      newConfig.freezer_temp_entity = newConfig.freezer_temp_entity || findEntity(['_freezer_temp', '_freezer_temperature', '_freezer_target_temperature']);
      // LG ThinQ integration exposes express freeze switch as _express_mode, mapping to ice_maker_entity icon toggle
      newConfig.ice_maker_entity = newConfig.ice_maker_entity || findEntity(['_ice_maker', '_ice_maker_status', '_ice_maker_switch', '_express_mode']);
      newConfig.filter_status_entity = newConfig.filter_status_entity || findEntity(['_filter_status', '_water_filter_status', '_water_filter', '_filter_usage'], 'sensor');
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
