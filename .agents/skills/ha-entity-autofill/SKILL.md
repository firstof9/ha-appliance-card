---
name: ha-entity-autofill
description: Naming conventions and suffix mapping for Home Assistant entity auto-discovery.
---

# Home Assistant Entity Auto-Fill Rules

Rules for automatic entity mapping when a user selects a `device_id` in the editor.

## Suffix Matchers & Normalization
- **Trailing Numeric Suffix Normalization**: Strip trailing numbers (`/\_\d+$/`) such as `_2` or `_3` before evaluating suffix matchers so duplicated entity IDs across multiple integrations auto-populate correctly.
- **Power**: `['_switch', '_power', '_power_switch']` (switch) or `['_power', '_state']` (binary_sensor).
- **Machine State**: `['_machine_state', '_operation_state', '_appliance_state', '_current_status', '_run_state', '_operation', '_state', '_current_state']`.
- **Job State**: `['_job_state', '_running_state', '_cycle_state', '_pre_state', '_current_course', '_progress', '_cooking_mode', '_cook_mode', '_program_progress', '_selected_program', '_active_program']`.
- **Washer / Dryer**: `_run_state`, `_pre_state`, `_current_course`, `_course_selection`, `_remaining_time`, `_countdown_time`, `_error_message`, `_child_lock`, `_ssid`.
- **Time Remaining**: `['_time_remaining', '_remaining_time', '_time_left', '_estimated_finish', '_total_time', '_cook_time_remaining', '_kitchen_timer', '_program_finish_time']` (sensor).
- **WiFi Status**: `['_wifi', '_connectivity', '_ssid']`.
- **Child Lock**: `['_lock', '_child_lock', '_door_lock', '_remote_start', '_remote_enabled', '_remote_control']`.
- **Sabbath Mode**: `['_sabbath_mode']` (switch/binary_sensor).
- **Alarm Code**: `['_alarm_code', '_error_code', '_fault_code', '_alarm']`.
- **Fan**: `fan` domain (any entity ID) or `['_fan', '_fan_speed']` (number).
- **Light**: `light` domain or `['_light', '_lamp']` (switch/select).
- **Appliance-Specific**:
  - Refrigerator: `_fridge_temp`, `_fridge_temperature`, `_freezer_temp`, `_freezer_temperature`, `_ice_maker_status`, `_water_filter_status`, `_water_filter`, `_door_open`, `_door`.
  - Oven / Range: `_display_temperature`, `_raw_temperature` (sensor), `_cavity_state` (job_state_entity), `water_heater` domain (power_entity).
  - Cooktop: `_cooktop_status` (power_entity), `_*_front_on`, `_*_rear_on`, `_*_synchronized` (binary_sensor), `_*_power_pct` (sensor).
  - Kettle: `_target_temperature` (number/sensor), `_status` (sensor/select), `_mode` (select), `_temperature` (sensor).

## Integrations Supported
- `smartthings`, `localthings`, `smartthinq_sensors`, `lg_thinq`, `ge_home`, `homeconnect`, `govee`, `govee_ble`.

## Testing
- Add corresponding unit test assertions in `test/editor.test.ts` whenever expanding auto-fill suffix matchers.
