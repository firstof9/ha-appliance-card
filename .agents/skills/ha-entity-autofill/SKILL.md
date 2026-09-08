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
- **Job State**: `['_job_state', '_running_state', '_cycle_state', '_pre_state', '_current_course', '_progress', '_cooking_mode', '_cook_mode', '_program_progress', '_selected_program', '_active_program']`, falling back to `_mode` (select/sensor) then `_course` (sensor/select) if nothing else matches.
- **Washer / Dryer**: `_run_state`, `_pre_state`, `_current_course`, `_course_selection`, `_remaining_time`, `_countdown_time`, `_error_message`, `_child_lock`, `_ssid`.
- **Time Remaining**: `['_time_remaining', '_remaining_time', '_time_left', '_estimated_finish', '_total_time', '_cook_time_remaining', '_kitchen_timer', '_program_finish_time']` (sensor).
- **WiFi Status**: `['_wifi', '_connectivity', '_ssid']`.
- **Child Lock**: `['_lock', '_child_lock', '_door_lock', '_remote_start', '_remote_enabled', '_remote_control']`.
- **Sabbath Mode**: `['_sabbath_mode']` (switch/binary_sensor).
- **Alarm Code**: `['_alarm_code', '_error_code', '_fault_code', '_alarm', '_error_message', '_error']` (sensor/select).
- **Fan**: `fan` domain (any entity ID) or `['_fan', '_fan_speed']` (number).
- **Light**: `light` domain or `['_light', '_lamp']` (switch/select).
- **Appliance-Specific**:
  - Refrigerator: `_fridge_temp`, `_fridge_temperature`, `_freezer_temp`, `_freezer_temperature`, `_ice_maker_status`, `_water_filter_status`, `_water_filter`, `_door_open`, `_door`.
  - Oven / Range: `_display_temperature`, `_raw_temperature` (sensor), `_cavity_state` (job_state_entity), `water_heater` domain (power_entity).
  - Cooktop: `_cooktop_status` (power_entity), `_*_front_on`, `_*_rear_on`, `_*_synchronized` (binary_sensor), `_*_power_pct` (sensor).
  - Kettle: `_target_temperature` (number/sensor), `_status` (sensor/select), `_mode` (select), `_temperature` (sensor).

## Integrations Supported
- `smartthings`, `localthings`, `smartthinq_sensors`, `lg_thinq`, `ge_home`, `homeconnect`, `govee`, `govee_ble`, `mqtt` (generic MQTT-discovered devices, e.g. local bridges like [rethink](https://github.com/anszom/rethink)).

## Combo Devices (One HA Device, Multiple Logical Appliances)
- Some devices (e.g. LG WashTower-style units bridged through rethink/MQTT) expose two appliances — typically `washer_*` and `dryer_*` — as entities on a single HA device.
- `_autofillConfig` scopes its entity search pool to the card's own `appliance_type` keyword (see `APPLIANCE_TYPE_KEYWORDS` in `editor.ts`) before applying suffix matchers, dropping candidates that clearly belong to a different appliance type. Devices with no such keyword in their entity IDs (e.g. a Samsung "range" configured as an oven) are unaffected — the scoped pool falls back to the full entity list if scoping would eliminate everything.
- Appliance-type auto-detection only runs when `appliance_type` is not already set, so switching device on a card where the user already picked a type (e.g. "dryer" for the second card on a combo device) won't get silently clobbered back to whatever the text-based detector matches first.

## Testing
- Add corresponding unit test assertions in `test/editor.test.ts` whenever expanding auto-fill suffix matchers.
