export interface HassEntityState {
  entity_id: string;
  state: string;
  attributes: {
    friendly_name?: string;
    unit_of_measurement?: string;
    [key: string]: unknown;
  };
  last_changed: string;
  last_updated: string;
  context: { id: string; parent_id: string | null; user_id: string | null };
}

export interface HomeAssistant {
  states: Record<string, HassEntityState>;
  locale?: { language?: string };
  language?: string;
  connection?: {
    subscribeMessage<T>(
      callback: (result: T) => void,
      params: { type: string; [key: string]: any }
    ): Promise<() => Promise<void>>;
  };
  callService(domain: string, service: string, data?: Record<string, any>): Promise<void>;
}

export interface ApplianceCardConfig {
  type: string;
  appliance_type: 'microwave' | 'oven' | 'dishwasher' | 'washer' | 'dryer' | 'refrigerator' | 'cooktop' | 'kettle';
  device_id?: string;
  power_entity?: string;
  power_template?: string;
  mode_entity?: string;
  mode_template?: string;
  job_state_entity?: string;
  job_state_template?: string;
  machine_state_entity?: string;
  machine_state_template?: string;
  time_entity?: string;
  time_template?: string;
  door_entities?: string[];
  fridge_temp_entity?: string;
  freezer_temp_entity?: string;
  ice_maker_entity?: string;
  filter_status_entity?: string;
  filter_reset_entity?: string;
  wifi_entity?: string;
  lock_entity?: string;
  alarm_code_entity?: string;
  alarm_code_template?: string;
  fan_entity?: string;
  light_entity?: string;
  temperature_entity?: string;
  temperature_template?: string;
  burner_left_front_on_entity?: string;
  burner_left_rear_on_entity?: string;
  burner_center_rear_on_entity?: string;
  burner_right_front_on_entity?: string;
  burner_right_rear_on_entity?: string;
  burner_left_front_sync_entity?: string;
  burner_left_rear_sync_entity?: string;
  burner_center_rear_sync_entity?: string;
  burner_right_front_sync_entity?: string;
  burner_right_rear_sync_entity?: string;
  burner_left_front_power_entity?: string;
  burner_left_rear_power_entity?: string;
  burner_right_front_power_entity?: string;
  burner_right_rear_power_entity?: string;
  sabbath_mode_entity?: string;
  stage_map?: Record<string, string>;
  mode_map?: Record<string, string>;
  appliance_image?: string;
  background_color?: string;
  state_images?: Record<string, string>;
}

export type SmartthingsCardConfig = ApplianceCardConfig;

