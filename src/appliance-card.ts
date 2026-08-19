import { LitElement, html, TemplateResult, PropertyValues } from 'lit';
import { live } from 'lit/directives/live.js';
import { customElement, property, state } from 'lit/decorators.js';
import { HomeAssistant, ApplianceCardConfig } from './types';
import { styles } from './styles/styles';
import { formatCountdown, getFilterColor, getAsset } from './utils';
import { getAlarmIcon } from './icons/alarm-icons';
import './editor';
import { version } from '../package.json';

/* eslint no-console: 0 */
console.info(
  `%c APPLIANCE-CARD %c v${version} `,
  'color: white; background: #008cc0; font-weight: 700;',
  'color: #008cc0; background: white; font-weight: 700;',
);

@customElement('appliance-card')
export class ApplianceCard extends LitElement {
  @property({ attribute: false }) public hass!: HomeAssistant;

  @state() private config!: ApplianceCardConfig;
  @state() private _currentTime = new Date().getTime();
  @state() private _templateResults: Record<string, string> = {};
  private _templateUnsub: Record<string, () => Promise<void>> = {};
  private _timer?: number;

  public static getConfigElement() {
    return document.createElement('appliance-card-editor');
  }

  public static getStubConfig() {
    return {
      appliance_type: 'microwave',
    };
  }

  public static override get styles() {
    return styles;
  }

  public getGridOptions() {
    return {
      columns: 12,
      rows: 3,
      min_columns: 9,
      max_columns: 12,
      min_rows: 3,
      max_rows: 6,
    };
  }

  public getGridSize() {
    return [12, 3];
  }

  public getCardSize() {
    return 3;
  }

  public setConfig(config: ApplianceCardConfig): void {
    if (!config) {
      throw new Error('Invalid configuration');
    }

    if (config.type === 'custom:smartthings-card') {
      console.warn(
        'smartthings-card: "type: custom:smartthings-card" is deprecated and will be removed in a future release. Please update your card configuration to "type: custom:appliance-card".',
      );
    }

    this.config = { ...config };
    if (!this.config.type) {
      this.config.type = 'custom:appliance-card';
    }
    if (!this.config.appliance_type) {
      this.config.appliance_type = 'microwave';
    }

    this._subscribeTemplates();
  }

  override connectedCallback() {
    super.connectedCallback();
    this._timer = window.setInterval(() => {
      this._currentTime = new Date().getTime();
    }, 1000);
    this._subscribeTemplates();
  }

  override disconnectedCallback() {
    super.disconnectedCallback();
    if (this._timer) {
      clearInterval(this._timer);
    }
    this._unsubscribeTemplates();
  }

  private async _subscribeTemplates(): Promise<void> {
    if (!this.hass?.connection || !this.config) return;

    const templateKeys: (keyof ApplianceCardConfig)[] = [
      'time_template',
      'mode_template',
      'job_state_template',
      'machine_state_template',
      'power_template',
      'temperature_template',
      'alarm_code_template',
    ];

    for (const key of templateKeys) {
      const templateStr = this.config[key] as string | undefined;
      if (!templateStr || typeof templateStr !== 'string') {
        if (this._templateUnsub[key]) {
          try {
            await this._templateUnsub[key]();
          } catch {
            // ignore
          }
          delete this._templateUnsub[key];
          delete this._templateResults[key];
        }
        continue;
      }

      // If already subscribed to the exact same template, skip
      if (this._templateUnsub[key]) continue;

      try {
        const unsub = await this.hass.connection.subscribeMessage<any>(
          (msg) => {
            const val = msg?.result !== undefined ? String(msg.result) : '';
            this._templateResults = {
              ...this._templateResults,
              [key]: val,
            };
          },
          {
            type: 'render_template',
            template: templateStr,
          }
        );
        this._templateUnsub[key] = unsub;
      } catch (err) {
        console.warn(`appliance-card: Error subscribing to ${key}:`, err);
      }
    }
  }

  private async _unsubscribeTemplates(): Promise<void> {
    for (const key of Object.keys(this._templateUnsub)) {
      try {
        await this._templateUnsub[key]();
      } catch {
        // ignore
      }
    }
    this._templateUnsub = {};
  }

  protected override shouldUpdate(changedProps: PropertyValues): boolean {
    if (changedProps.has('config') || changedProps.has('_templateResults')) {
      return true;
    }

    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
    if (oldHass) {
      // Re-trigger template subscriptions if hass connection changed
      if (this.hass?.connection && !oldHass.connection) {
        this._subscribeTemplates();
      }

      const entities = [
        this.config.power_entity,
        this.config.mode_entity,
        this.config.job_state_entity,
        this.config.machine_state_entity,
        this.config.time_entity,
        this.config.fridge_temp_entity,
        this.config.freezer_temp_entity,
        this.config.ice_maker_entity,
        this.config.filter_status_entity,
        this.config.filter_reset_entity,
        this.config.wifi_entity,
        this.config.lock_entity,
        this.config.alarm_code_entity,
        this.config.fan_entity,
        this.config.light_entity,
        this.config.temperature_entity,
        this.config.burner_left_front_on_entity,
        this.config.burner_left_rear_on_entity,
        this.config.burner_center_rear_on_entity,
        this.config.burner_right_front_on_entity,
        this.config.burner_right_rear_on_entity,
        this.config.burner_left_front_sync_entity,
        this.config.burner_left_rear_sync_entity,
        this.config.burner_center_rear_sync_entity,
        this.config.burner_right_front_sync_entity,
        this.config.burner_right_rear_sync_entity,
        this.config.burner_left_front_power_entity,
        this.config.burner_left_rear_power_entity,
        this.config.burner_right_front_power_entity,
        this.config.burner_right_rear_power_entity,
        this.config.sabbath_mode_entity,
        ...(this.config.door_entities || []),
      ].filter(Boolean) as string[];

      return entities.some((entity) => oldHass.states[entity] !== this.hass.states[entity]);
    }

    if (changedProps.has('_currentTime')) {
      return true;
    }

    return true;
  }

  private _findInMap(map: Record<string, string>, key: string): string | undefined {
    if (!map || !key) return undefined;
    const lowerKey = key.toLowerCase();
    for (const [mapKey, mapVal] of Object.entries(map)) {
      if (mapKey.toLowerCase() === lowerKey) {
        return mapVal;
      }
    }
    return undefined;
  }

  private _formatCountdown(timeStr: string, unit?: string): string {
    return formatCountdown(timeStr, this._currentTime, unit);
  }

  protected override render(): TemplateResult | void {
    if (!this.config || !this.hass) {
      return html``;
    }

    const powerStateObj = this.config.power_entity ? this.hass.states[this.config.power_entity] : null;
    const machineStateObj = this.config.machine_state_entity ? this.hass.states[this.config.machine_state_entity] : null;
    const modeStateObj = this.config.mode_entity ? this.hass.states[this.config.mode_entity] : null;
    const jobStateObj = this.config.job_state_entity ? this.hass.states[this.config.job_state_entity] : null;
    const timeStateObj = this.config.time_entity ? this.hass.states[this.config.time_entity] : null;

    // Power logic (template override or entity state)
    const powerValue = this._templateResults['power_template'] !== undefined
      ? this._templateResults['power_template']
      : powerStateObj?.state;
    const isPoweredOff = powerValue?.toLowerCase() === 'off';

    // Active mode logic (prioritize templates if defined, then job state, then mode)
    let rawJobState = (this._templateResults['job_state_template'] !== undefined
      ? this._templateResults['job_state_template']
      : jobStateObj?.state?.toLowerCase()) || 'off';

    let rawModeState = (this._templateResults['mode_template'] !== undefined
      ? this._templateResults['mode_template']
      : modeStateObj?.state?.toLowerCase()) || 'off';

    // Apply custom stage_map and mode_map if configured
    if (this.config.stage_map) {
      const mapped = this._findInMap(this.config.stage_map, rawJobState);
      if (mapped) rawJobState = mapped.toLowerCase();
    }
    if (this.config.mode_map) {
      const mapped = this._findInMap(this.config.mode_map, rawModeState);
      if (mapped) rawModeState = mapped.toLowerCase();
    }

    const isJobGeneric = ['none', 'others', 'off', 'unknown', 'unavailable', 'idle', 'running', 'cooking'].includes(rawJobState);
    
    const activeMode = (isJobGeneric && (this.config.appliance_type === 'microwave' || this.config.appliance_type === 'oven')) ? rawModeState : rawJobState;

    const rawTimeValue = this._templateResults['time_template'] !== undefined
      ? this._templateResults['time_template']
      : timeStateObj?.state;

    const timeUnit = timeStateObj?.attributes?.unit_of_measurement as string | undefined;
    const timeState = (rawTimeValue && !isPoweredOff) ? this._formatCountdown(rawTimeValue, timeUnit) : '--:--:--';

    const tempStateObj = this.config.temperature_entity ? this.hass.states[this.config.temperature_entity] : null;
    const rawTempValue = this._templateResults['temperature_template'] !== undefined
      ? this._templateResults['temperature_template']
      : tempStateObj?.state;

    const isMicrowave = this.config.appliance_type === 'microwave';
    const isIdle = ['none', 'off', 'unknown', 'unavailable', 'idle', 'standby'].includes(activeMode);
    const tempValue = rawTempValue !== undefined && rawTempValue !== null && rawTempValue !== ''
      ? isMicrowave && (isIdle || isPoweredOff)
        ? '---'
        : Math.round(parseFloat(rawTempValue)).toString()
      : null;
    const tempUnit = tempStateObj?.attributes.unit_of_measurement || '°C';

    const applianceImg = this.config.appliance_image || this._getAsset(this.config.appliance_type, 'appliance.png');
    const bgColor = this.config.background_color || '#3d3d3d';

    if (this.config.appliance_type === 'refrigerator') {
      return this._renderRefrigerator();
    }

    if (this.config.appliance_type === 'cooktop') {
      return this._renderCooktop();
    }

    return html`
      <ha-card>
        <div class="container ${this.config.appliance_type}">
          <div class="bg-layer" style="--bg-color-primary: ${bgColor}"></div>
          <img class="appliance-img" src="${applianceImg}" 
            @error=${(e: any) => e.target.style.display = 'none'} />

          ${this._renderJobStates(activeMode)}

          <div class="right-panel">
            ${tempValue 
              ? html`
                  <div class="temp-row">
                    <div class="temp-bg">888</div>
                    <div class="temp-fg">
                      <span>${tempValue.padStart(3, ' ')}</span>
                      <span class="temp-unit">${tempUnit}</span>
                    </div>
                  </div>
                ` 
              : ''}
            <div class="timer-section">
              ${this._renderSecondaryIcons()}
              <div class="timer-row">
                <div class="time-bg">88:88:88</div>
                <div class="time-fg">${timeState}</div>
              </div>
            </div>
            ${this.config.appliance_type === 'microwave' ? this._renderMicrowaveControls() : ''}
          </div>
        </div>
      </ha-card>
    `;
  }

  private _renderMicrowaveControls(): TemplateResult | void {
    const fanStateObj = this.config.fan_entity ? this.hass.states[this.config.fan_entity] : null;
    const lightStateObj = this.config.light_entity ? this.hass.states[this.config.light_entity] : null;

    if (!fanStateObj && !lightStateObj) return;

    return html`
      <div class="microwave-controls">
        <div class="control-group">
          ${lightStateObj
            ? html`
                <div class="light-control ${lightStateObj.state === 'on' ? 'on' : ''}" @click=${this._toggleLight}>
                  <ha-icon icon="${lightStateObj.state === 'on' ? 'mdi:lightbulb' : 'mdi:lightbulb-outline'}"></ha-icon>
                </div>
              `
            : ''}
          ${fanStateObj
            ? (() => {
                const domain = this.config.fan_entity!.split('.')[0];
                let isOff = fanStateObj.state === 'off' || fanStateObj.state === '0' || fanStateObj.state === 'OFF';
                let min = 0;
                let max = 100;
                let step = 1;
                let value = 0;

                if (domain === 'fan') {
                  const pctStep = Number(fanStateObj.attributes?.percentage_step);
                  const percentage = fanStateObj.attributes?.percentage;
                  if (pctStep && pctStep > 0) {
                    min = 0;
                    max = Math.round(100 / pctStep);
                    step = 1;
                    const pctVal = percentage !== undefined && percentage !== null ? Number(percentage) : (isOff ? 0 : 100);
                    value = Math.round(pctVal / pctStep);
                  } else {
                    min = 0;
                    max = 100;
                    step = 1;
                    value = percentage !== undefined && percentage !== null ? Number(percentage) : (isOff ? 0 : 100);
                  }
                  isOff = value === 0 || fanStateObj.state === 'off';
                } else if (domain === 'select') {
                  const options: string[] = (fanStateObj.attributes?.options as string[]) || [];
                  max = Math.max(0, options.length - 1);
                  const currentIndex = options.indexOf(fanStateObj.state);
                  value = currentIndex >= 0 ? currentIndex : 0;
                  isOff = value === 0 || fanStateObj.state.toLowerCase() === 'off';
                } else if (domain === 'number') {
                  min = Number(fanStateObj.attributes.min ?? 0);
                  max = Number(fanStateObj.attributes.max ?? fanStateObj.attributes.maximum ?? 3);
                  step = Number(fanStateObj.attributes.step ?? 1);
                  value = Number(fanStateObj.state) || 0;
                  isOff = value === min;
                } else {
                  min = 0;
                  max = Number(fanStateObj.attributes.maximum ?? 3);
                  value = Number(fanStateObj.state) || 0;
                  isOff = value === 0 || fanStateObj.state === 'off';
                }

                return html`
                  <div class="fan-control ${!isOff ? 'on' : ''}">
                    <ha-icon icon="mdi:fan"></ha-icon>
                    <input
                      type="range"
                      class="fan-slider"
                      min="${min}"
                      max="${max}"
                      step="${step}"
                      .value=${live(value)}
                      @change=${(e: Event) => this._handleFanSpeed(e, fanStateObj)}
                    />
                  </div>
                `;
              })()
            : ''}
        </div>
      </div>
    `;
  }

  private _toggleLight(): void {
    if (!this.hass || !this.config.light_entity) return;
    const state = this.hass.states[this.config.light_entity].state;
    this.hass.callService('light', state === 'on' ? 'turn_off' : 'turn_on', {
      entity_id: this.config.light_entity,
    });
  }

  private _handleFanSpeed(ev: Event, fanStateObj: any): void {
    const rawValue = (ev.target as HTMLInputElement).value;
    const numValue = Number(rawValue);
    if (!this.hass || !this.config.fan_entity) return;

    const domain = this.config.fan_entity.split('.')[0];
    const data: Record<string, any> = { entity_id: this.config.fan_entity };

    if (domain === 'fan') {
      const pctStep = Number(fanStateObj?.attributes?.percentage_step);
      let targetPercentage = numValue;

      if (pctStep && pctStep > 0) {
        const maxStep = Math.round(100 / pctStep);
        if (numValue >= maxStep) {
          targetPercentage = 100;
        } else {
          targetPercentage = Math.round(numValue * pctStep);
        }
      }

      if (numValue === 0 || targetPercentage === 0) {
        this.hass.callService('fan', 'turn_off', data);
      } else {
        this.hass.callService('fan', 'set_percentage', { ...data, percentage: targetPercentage });
      }
    } else if (domain === 'select') {
      const options: string[] = fanStateObj?.attributes?.options || [];
      const selectedOption = options[numValue];
      if (selectedOption) {
        this.hass.callService('select', 'select_option', { ...data, option: selectedOption });
      }
    } else if (domain === 'number') {
      this.hass.callService('number', 'set_value', { ...data, value: numValue });
    } else {
      this.hass.callService(domain, 'set_percentage', { ...data, percentage: numValue });
    }
  }

  private _renderJobStates(activeMode: string): TemplateResult | void {
    const appliance = this.config.appliance_type;

    interface Stage {
      name: string;
      left: string;
      icon?: string;
    }

    const stages: Record<string, Stage[]> = {
      dishwasher: [
        { name: 'prewash', left: '33%' },
        { name: 'wash', left: '51%', icon: 'wash-plate' },
        { name: 'rinse', left: '69%', icon: 'rinse-plate' },
        { name: 'dry', left: '85%', icon: 'dry-plate' },
      ],
      washer: [
        { name: 'weight_sensing', left: '35%' },
        { name: 'wash', left: '52%' },
        { name: 'rinse', left: '69%' },
        { name: 'spin', left: '86%' },
      ],
      dryer: [
        { name: 'dry', left: '45%' },
        { name: 'cool', left: '75%' },
      ],
      microwave: [
        { name: 'microwave', left: '65%', icon: 'microwave' },
        { name: 'autocook', left: '65%', icon: 'autocook' },
        { name: 'conventional', left: '65%', icon: 'conventional' },
        { name: 'bake', left: '65%', icon: 'bake' },
        { name: 'bottom_heat', left: '65%', icon: 'bake' },
        { name: 'convection_bake', left: '65%', icon: 'convection' },
        { name: 'convection_roast', left: '65%', icon: 'convection' },
        { name: 'broil', left: '65%', icon: 'grill' },
        { name: 'convection_broil', left: '65%', icon: 'grill' },
        { name: 'steam_cook', left: '65%', icon: 'steam' },
        { name: 'steam_bake', left: '65%', icon: 'steam' },
        { name: 'steam_roast', left: '65%', icon: 'steam' },
        { name: 'microwave_plus_grill', left: '65%', icon: 'grill' },
        { name: 'microwave_plus_convection', left: '65%', icon: 'convection' },
        { name: 'microwave_plus_hot_blast', left: '65%', icon: 'hot_blast' },
        { name: 'microwave_plus_hot_blast_2', left: '65%', icon: 'hot_blast' },
        { name: 'slim_middle', left: '65%', icon: 'convection' },
        { name: 'slim_strong', left: '65%', icon: 'convection' },
        { name: 'slow_cook', left: '65%', icon: 'bake' },
        { name: 'proof', left: '65%', icon: 'bake' },
        { name: 'dehydrate', left: '65%', icon: 'convection' },
        { name: 'strong_steam', left: '65%', icon: 'steam' },
        { name: 'descale', left: '65%', icon: 'rinse' },
        { name: 'rinse', left: '65%', icon: 'rinse' },
        { name: 'heating', left: '65%', icon: 'conventional' },
        { name: 'grill', left: '65%', icon: 'grill' },
        { name: 'defrosting', left: '65%', icon: 'microwave' },
        { name: 'warming', left: '65%', icon: 'bake' },
        { name: 'others', left: '65%', icon: 'cooking' },
      ],
      oven: [
        { name: 'conventional', left: '65%', icon: 'conventional' },
        { name: 'bake', left: '65%', icon: 'bake' },
        { name: 'bottom_heat', left: '65%', icon: 'bake' },
        { name: 'convection_bake', left: '65%', icon: 'convection' },
        { name: 'convection_roast', left: '65%', icon: 'convection' },
        { name: 'broil', left: '65%', icon: 'grill' },
        { name: 'convection_broil', left: '65%', icon: 'grill' },
        { name: 'steam_cook', left: '65%', icon: 'steam' },
        { name: 'steam_bake', left: '65%', icon: 'steam' },
        { name: 'steam_roast', left: '65%', icon: 'steam' },
        { name: 'microwave_plus_grill', left: '65%', icon: 'grill' },
        { name: 'microwave_plus_convection', left: '65%', icon: 'convection' },
        { name: 'microwave_plus_hot_blast', left: '65%', icon: 'hot_blast' },
        { name: 'microwave_plus_hot_blast_2', left: '65%', icon: 'hot_blast' },
        { name: 'slim_middle', left: '65%', icon: 'convection' },
        { name: 'slim_strong', left: '65%', icon: 'convection' },
        { name: 'slow_cook', left: '65%', icon: 'bake' },
        { name: 'proof', left: '65%', icon: 'bake' },
        { name: 'dehydrate', left: '65%', icon: 'convection' },
        { name: 'strong_steam', left: '65%', icon: 'steam' },
        { name: 'descale', left: '65%', icon: 'rinse' },
        { name: 'rinse', left: '65%', icon: 'rinse' },
        { name: 'heating', left: '65%', icon: 'conventional' },
        { name: 'grill', left: '65%', icon: 'grill' },
        { name: 'defrosting', left: '65%', icon: 'bake' },
        { name: 'warming', left: '65%', icon: 'bake' },
        { name: 'others', left: '65%', icon: 'cooking' },
        { name: 'cooking', left: '65%', icon: 'cooking' },
      ],
      kettle: [
        { name: 'boiling', left: '65%', icon: 'boil' },
        { name: 'boil', left: '65%', icon: 'boil' },
        { name: 'black_tea_boil', left: '65%', icon: 'boil' },
        { name: 'coffee', left: '65%', icon: 'coffee' },
        { name: 'green_tea', left: '65%', icon: 'tea' },
        { name: 'oolong_tea', left: '65%', icon: 'tea' },
        { name: 'tea', left: '65%', icon: 'tea' },
        { name: 'keep_warm', left: '65%', icon: 'boil' },
        { name: 'warm', left: '65%', icon: 'boil' },
      ],
    };

    if (!stages[appliance]) return;

    const currentMode = activeMode.toLowerCase();
    const isIdle = ['none', 'off', 'unknown', 'unavailable', 'idle', 'standby'].includes(currentMode);

    // Find the best matching stage
    let activeStage = stages[appliance].find((s) => !isIdle && (currentMode.startsWith(s.name) || (s.icon && currentMode.startsWith(s.icon))));

    // Fallback for idle state
    if (!activeStage) {
      const defaultName = appliance === 'microwave' ? 'microwave' : appliance === 'oven' ? 'conventional' : stages[appliance][0].name;
      activeStage = stages[appliance].find((s) => s.name === defaultName) || stages[appliance][0];
    }

    const isActive = !isIdle && (currentMode.startsWith(activeStage.name) || (activeStage.icon && currentMode.startsWith(activeStage.icon)));
    const iconBase = activeStage.icon || activeStage.name;
    let iconName = isActive ? `${iconBase}-on.png` : `${iconBase}.png`;

    // Special handling for microwave autocook icons
    if (appliance === 'microwave' && iconBase === 'autocook') {
      iconName = isActive ? 'autocook.png' : 'autocook-off.png';
    }

    const isTimeline = ['dishwasher', 'washer', 'dryer'].includes(appliance);

    if (isTimeline) {
      return html`
        <div class="job-states">
          ${stages[appliance].map((stage) => {
            const isActive = !isIdle && (currentMode.startsWith(stage.name) || (stage.icon && currentMode.startsWith(stage.icon)));
            const iconBase = stage.icon || stage.name;
            const iconName = isActive ? `${iconBase}-on.png` : `${iconBase}.png`;
            return html`
              <div class="job-icon-container ${isActive ? 'active' : ''}" style="left: ${stage.left}"
                ?aria-current=${isActive ? 'step' : undefined}>
                <img class="job-icon" 
                  src="${this._getAsset(appliance, iconName)}" 
                  alt="${this._getStageLabel(stage.name)}" />
              </div>
            `;
          })}
        </div>
      `;
    }

    // Centered single icon for microwave/oven
    return html`
      <div class="job-states">
        <div class="job-icon-container ${isActive ? 'active' : ''}" style="left: 50%; top: 45%"
          ?aria-current=${isActive ? 'step' : undefined}>
          <img class="job-icon" 
            src="${this._getAsset(appliance, iconName)}" 
            alt="${isActive ? this._getStageLabel(activeStage.name) : 'Idle'}" />
          <div class="job-label">${isActive ? this._getStageLabel(activeStage.name) : 'Idle'}</div>
        </div>
      </div>
    `;
  }

  private _getStageLabel(name: string): string {
    const labels: Record<string, string> = {
      conventional: 'Conventional',
      bake: 'Bake',
      bottom_heat: 'Bottom',
      convection_bake: 'Convection',
      convection_roast: 'Roast',
      broil: 'Broil',
      convection_broil: 'Broil',
      steam_cook: 'Steam',
      steam_bake: 'Steam',
      steam_roast: 'Steam',
      microwave_plus_grill: 'Grill',
      microwave_plus_convection: 'Convection',
      microwave_plus_hot_blast: 'HotBlast',
      microwave_plus_hot_blast_2: 'HotBlast',
      slim_middle: 'Slim',
      slim_strong: 'Slim',
      slow_cook: 'Slow',
      proof: 'Proof',
      dehydrate: 'Dehydrate',
      strong_steam: 'Steam',
      descale: 'Descale',
      rinse: 'Rinse',
      heating: 'Heating',
      defrosting: 'Defrost',
      warming: 'Warming',
      others: 'Cooking',
      microwave: 'Microwave',
      autocook: 'Auto',
      sensing: 'Sensing',
      weight_sensing: 'Sensing',
      wash: 'Wash',
      spin: 'Spin',
      dry: 'Dry',
      cool: 'Cool',
      convection: 'Convection',
      grill: 'Grill',
      steam: 'Steam',
      hot_blast: 'Hot Blast',
      cooking: 'Cooking',
    };

    if (labels[name]) return labels[name];

    // Fallback: capitalize and remove underscores
    return name
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  private _renderSecondaryIcons(): TemplateResult | void {
    const wifiState = this.config.wifi_entity ? this.hass.states[this.config.wifi_entity] : null;
    const lockState = this.config.lock_entity ? this.hass.states[this.config.lock_entity] : null;
    const alarmState = this.config.alarm_code_entity ? this.hass.states[this.config.alarm_code_entity] : null;

    const rawAlarmCode = this._templateResults['alarm_code_template'] !== undefined
      ? this._templateResults['alarm_code_template']
      : (alarmState?.state ? String(alarmState.state) : '');

    const isAlarmActive =
      rawAlarmCode !== undefined &&
      rawAlarmCode !== null &&
      !['off', 'none', '0', '0.0', 'normal', 'ok', 'unavailable', 'unknown', ''].includes(
        String(rawAlarmCode).trim().toLowerCase(),
      );

    const sabbathState = this.config.sabbath_mode_entity ? this.hass.states[this.config.sabbath_mode_entity] : null;

    if (!wifiState && !lockState && !isAlarmActive && !sabbathState) return;

    const appliance = this.config.appliance_type;

    return html`
      <div class="secondary-icons">
        ${sabbathState && sabbathState.state === 'on'
          ? html`
              <span data-tooltip="Sabbath Mode Active">
                <ha-icon class="secondary-icon sabbath" icon="mdi:candle"></ha-icon>
              </span>
            `
          : ''}
        ${isAlarmActive
          ? getAlarmIcon(rawAlarmCode, appliance).svgTemplate
          : ''}
        ${wifiState
          ? html`
              <img
                class="secondary-icon wifi ${wifiState.state === 'on' ? 'active' : ''}"
                src="${this._getAsset(appliance, wifiState.state === 'on' ? 'wifi-on.png' : 'wifi.png')}"
              />
            `
          : ''}
        ${lockState && appliance !== 'microwave'
          ? html`
              <img
                class="secondary-icon lock ${lockState.state === 'on' ? 'active' : ''}"
                src="${this._getAsset(appliance, lockState.state === 'on' ? 'lock-on.png' : 'lock.png')}"
              />
            `
          : ''}
      </div>
    `;
  }

  private _renderCooktop(): TemplateResult {
    const applianceImg = this.config.appliance_image || this._getAsset('cooktop', 'appliance.png');
    const bgColor = this.config.background_color || '#3d3d3d';

    const hasCenter = Boolean(
      this.config.burner_center_rear_on_entity ||
        this.config.burner_center_rear_sync_entity,
    );

    const burners = [
      {
        key: 'left-rear',
        label: 'Left Rear',
        onEntity: this.config.burner_left_rear_on_entity,
        powerEntity: this.config.burner_left_rear_power_entity,
        syncEntity: this.config.burner_left_rear_sync_entity,
      },
      ...(hasCenter
        ? [
            {
              key: 'center-rear',
              label: 'Center Rear',
              onEntity: this.config.burner_center_rear_on_entity,
              powerEntity: undefined,
              syncEntity: this.config.burner_center_rear_sync_entity,
            },
          ]
        : []),
      {
        key: 'right-rear',
        label: 'Right Rear',
        onEntity: this.config.burner_right_rear_on_entity,
        powerEntity: this.config.burner_right_rear_power_entity,
        syncEntity: this.config.burner_right_rear_sync_entity,
      },
      {
        key: 'left-front',
        label: 'Left Front',
        onEntity: this.config.burner_left_front_on_entity,
        powerEntity: this.config.burner_left_front_power_entity,
        syncEntity: this.config.burner_left_front_sync_entity,
      },
      {
        key: 'right-front',
        label: 'Right Front',
        onEntity: this.config.burner_right_front_on_entity,
        powerEntity: this.config.burner_right_front_power_entity,
        syncEntity: this.config.burner_right_front_sync_entity,
      },
    ];

    return html`
      <ha-card>
        <div class="container cooktop">
          <div class="bg-layer" style="--bg-color-primary: ${bgColor}"></div>
          <img
            class="appliance-img"
            src="${applianceImg}"
            @error=${(e: any) => (e.target.style.display = 'none')}
          />

          <div class="cooktop-burners-overlay ${hasCenter ? 'has-center' : ''}">
            ${burners.map((b) => {
              const onStateObj = b.onEntity ? this.hass.states[b.onEntity] : null;
              const powerStateObj = b.powerEntity ? this.hass.states[b.powerEntity] : null;
              const syncStateObj = b.syncEntity ? this.hass.states[b.syncEntity] : null;

              const isOn = onStateObj?.state === 'on';
              const isSynced = syncStateObj?.state === 'on';
              const powerValue = powerStateObj && isOn ? powerStateObj.state : null;

              return html`
                ${(() => {
                  const powerNum = powerValue !== null ? Math.max(0, Math.min(100, parseFloat(powerValue) || 0)) : (isOn ? 100 : 0);
                  const glowFactor = (powerNum / 100).toFixed(2);
                  const glowPx = Math.round(4 + powerNum * 0.16); // 4px at 0% to 20px at 100%
                  const opacityVal = (0.2 + powerNum * 0.008).toFixed(2); // 0.20 to 1.00

                  return html`
                    <div
                      class="burner-element ${b.key} ${isOn ? 'on' : 'off'}"
                      style="--burner-glow-factor: ${glowFactor}; --burner-glow-px: ${glowPx}px; --burner-glow-opacity: ${opacityVal};"
                    >
                      <svg class="burner-svg" viewBox="0 0 100 100">
                        <circle class="burner-ring outer" cx="50" cy="50" r="44" />
                        <circle class="burner-ring inner" cx="50" cy="50" r="28" />
                        <circle class="burner-ring center" cx="50" cy="50" r="12" />
                        <path
                          class="burner-element-coil"
                          d="M 50,6 A 44 44 0 1 0 50,94 A 44 44 0 1 0 50,6 M 50,22 A 28 28 0 1 0 50,78 A 28 28 0 1 0 50,22"
                        />
                      </svg>
                      ${isSynced
                        ? html`
                            <div class="burner-sync-badge" title="Synchronized">
                              <ha-icon icon="mdi:link-variant"></ha-icon>
                            </div>
                          `
                        : ''}
                      <div class="burner-label">${b.label}</div>
                      ${powerValue !== null
                        ? html`<div class="burner-power">${powerValue}%</div>`
                        : ''}
                    </div>
                  `;
                })()}
              `;
            })}
          </div>

          <div class="right-panel">
            <div class="timer-section">
              ${this._renderSecondaryIcons()}
            </div>
          </div>
        </div>
      </ha-card>
    `;
  }

  private _getAsset(appliance: string, fileName: string): string {
    return getAsset(appliance, fileName);
  }

  private _renderRefrigerator(): TemplateResult {
    const fridgeTemp = this.config.fridge_temp_entity ? this.hass.states[this.config.fridge_temp_entity] : null;
    const freezerTemp = this.config.freezer_temp_entity ? this.hass.states[this.config.freezer_temp_entity] : null;
    const iceMaker = this.config.ice_maker_entity ? this.hass.states[this.config.ice_maker_entity] : null;
    const filterStatus = this.config.filter_status_entity ? this.hass.states[this.config.filter_status_entity] : null;

    // Parse door entities into labeled objects with positions
    const doorData = (this.config.door_entities || []).map((id) => {
      const stateObj = this.hass.states[id];
      const entityId = id.toLowerCase();
      let position = 'top';
      if (entityId.includes('coolselect')) position = 'middle';
      else if (entityId.includes('freezer')) position = 'bottom';
      else if (entityId.includes('cooler')) position = 'top';
      const label = stateObj?.attributes?.friendly_name || id;
      return { position, label, isOpen: stateObj?.state === 'on' };
    });

    const applianceImg = this.config.appliance_image || this._getAsset('refrigerator', 'appliance.png');
    const bgColor = this.config.background_color || '#3d3d3d';

    const fTemp = fridgeTemp ? Math.round(parseFloat(fridgeTemp.state)).toString().padStart(2, ' ') : '--';
    const frzTemp = freezerTemp ? Math.round(parseFloat(freezerTemp.state)).toString().padStart(2, ' ') : '--';

    return html`
      <ha-card>
        <div class="container refrigerator">
          <div class="bg-layer" style="--bg-color-primary: ${bgColor}"></div>
          
          <div class="appliance-container">
            <img class="appliance-img" src="${applianceImg}" 
              @error=${(e: any) => e.target.style.display = 'none'} />
            ${doorData.length > 0
              ? html`
                  ${doorData.map(
                    (door) => html`
                      <div
                        class="door-overlay door-${door.position} ${door.isOpen ? 'open' : 'closed'}"
                        title="${door.label}: ${door.isOpen ? 'Open' : 'Closed'}"
                      ></div>
                    `,
                  )}
                `
              : ''}
          </div>

          <!-- Icons Layer -->
          <div class="fridge-temp-column">
            <img class="fridge-icon" src="${this._getAsset('refrigerator', 'fridge-temp.png')}" />
            <div class="fridge-temp-box">
              <div class="fridge-value-bg">88</div>
              <div class="fridge-value">${fTemp}</div>
            </div>
          </div>
          
          <div class="freezer-temp-column">
            <img class="freezer-icon" src="${this._getAsset('refrigerator', 'freezer-temp.png')}" />
            <div class="freezer-temp-box">
              <div class="freezer-value-bg">88</div>
              <div class="freezer-value">${frzTemp}</div>
            </div>
          </div>
          
          <img class="icemaker-icon ${iceMaker?.state === 'on' ? 'on' : 'off'}" 
            src="${this._getAsset('refrigerator', iceMaker?.state === 'on' ? 'icemaker_on.png' : 'icemaker_off.png')}"
            @click=${this._toggleIceMaker} />
          
          ${this._renderSecondaryIcons()}

          <!-- Extra Info -->
          ${filterStatus
            ? html`
                <div class="filter-status">
                  <div class="filter-label-row">
                    <span class="filter-label" style="color: ${this._getFilterColor(filterStatus.state)}">Water Filter</span>
                    <button class="reset-btn-mini" @click=${this._resetFilter} title="Reset Filter">
                      <ha-icon icon="mdi:restart"></ha-icon>
                    </button>
                  </div>
                  <div class="filter-info-row">
                    <div class="progress-bar">
                      <div
                        class="progress-fill"
                        style="width: ${100 - parseFloat(filterStatus.state)}%; background-color: ${this._getFilterColor(filterStatus.state)}"
                      ></div>
                    </div>
                    <span class="filter-percentage" style="color: ${this._getFilterColor(filterStatus.state)}">${filterStatus.state}%</span>
                  </div>
                </div>
              `
            : ''}
        </div>
      </ha-card>
    `;
  }

  private _getFilterColor(state: string): string {
    return getFilterColor(state);
  }

  private _resetFilter(): void {
    if (!this.hass || !this.config.filter_reset_entity) {
      return;
    }

    const domain = this.config.filter_reset_entity.split('.')[0];
    const service = domain === 'button' ? 'press' : 'turn_on';

    this.hass.callService(domain, service, {
      entity_id: this.config.filter_reset_entity,
    });
  }

  private _toggleIceMaker(): void {
    if (!this.hass || !this.config.ice_maker_entity) {
      return;
    }

    const state = this.hass.states[this.config.ice_maker_entity].state;
    const service = state === 'on' ? 'turn_off' : 'turn_on';
    const domain = this.config.ice_maker_entity.split('.')[0];

    this.hass.callService(domain, service, {
      entity_id: this.config.ice_maker_entity,
    });
  }


}

@customElement('smartthings-card')
export class SmartthingsCard extends ApplianceCard {
  public static override getConfigElement() {
    return document.createElement('smartthings-card-editor');
  }

  override connectedCallback() {
    console.warn(
      'smartthings-card: <smartthings-card> custom element is deprecated and will be removed in a future release. Please update your dashboard to <appliance-card>.',
    );
    super.connectedCallback();
  }
}

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'appliance-card',
  name: 'Appliance Card',
  description: 'A custom card for Home Assistant appliances (SmartThings, LocalThings, etc.)',
  preview: true,
});
(window as any).customCards.push({
  type: 'smartthings-card',
  name: 'Smartthings Card',
  description: 'A custom card for Smartthings devices',
  preview: true,
});
