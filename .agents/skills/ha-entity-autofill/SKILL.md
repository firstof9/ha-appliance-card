---
name: ha-entity-autofill
description: Naming conventions and suffix mapping for Home Assistant entity auto-discovery.
---

# Home Assistant Entity Auto-Fill Rules

Rules for automatic entity mapping when a user selects a `device_id` in the editor.

## Suffix Matchers
- **Power**: `['_switch', '_power', '_power_switch']` (switch) or `['_power', '_state']` (binary_sensor).
- **Machine State**: `['_machine_state', '_operation_state', '_appliance_state', '_state']`.
- **Job State**: `['_job_state', '_running_state', '_cycle_state']`.
- **Time Remaining**: `['_time_remaining', '_remaining_time', '_time_left', '_estimated_finish']` (sensor).
- **WiFi Status**: `['_wifi', '_connectivity']` (binary_sensor).
- **Child Lock**: `['_lock', '_child_lock']`.
- **Appliance-Specific**:
  - Refrigerator: `_fridge_temp`, `_freezer_temp`, `_ice_maker_status`, `_water_filter_status`, `_door_open`.

## Testing
- Add corresponding unit test assertions in `test/editor.test.ts` whenever expanding auto-fill suffix matchers.
