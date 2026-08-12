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
- **Job State**: `['_job_state', '_running_state', '_cycle_state', '_pre_state', '_current_course', '_progress', '_cooking_mode', '_cook_mode']`.
- **Time Remaining**: `['_time_remaining', '_remaining_time', '_time_left', '_estimated_finish', '_total_time', '_cook_time_remaining', '_kitchen_timer']` (sensor).
- **WiFi Status**: `['_wifi', '_connectivity', '_ssid']`.
- **Child Lock**: `['_lock', '_child_lock', '_door_lock', '_remote_start', '_remote_enabled']`.
- **Alarm Code**: `['_alarm_code', '_error_code', '_fault_code', '_alarm']`.
- **Fan**: `fan` domain (any entity ID) or `['_fan', '_fan_speed']` (number).
- **Light**: `light` domain or `['_light', '_lamp']` (switch/select).
- **Appliance-Specific**:
  - Refrigerator: `_fridge_temp`, `_freezer_temp`, `_ice_maker_status`, `_water_filter_status`, `_door_open`.
  - Oven / Range: `_display_temperature`, `_raw_temperature` (sensor), `water_heater` domain (power_entity).

## Testing
- Add corresponding unit test assertions in `test/editor.test.ts` whenever expanding auto-fill suffix matchers.
