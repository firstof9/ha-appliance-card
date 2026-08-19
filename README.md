# Appliance Card

A custom Home Assistant card for tracking and controlling home appliances — refrigerators, microwaves, ovens, cooktops, dishwashers, washers, dryers and kettles — from SmartThings, LocalThings and others.

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=firstof9&repository=ha-appliance-card&category=plugin)

![Preview](https://raw.githubusercontent.com/firstof9/ha-appliance-card/main/screenshots/smartthings_card.gif)

> [!NOTE]
> `ha-smartthings-card` has been renamed to **`ha-appliance-card`**. The element `custom:smartthings-card` is deprecated and will be removed in a future release. Please update your card configuration to `type: custom:appliance-card`.

## Installation

### HACS (Recommended)

1. Click the badge above or:
2. Go to HACS -> Frontend
3. Click on the three dots in the top right corner and select "Custom repositories"
4. Add `https://github.com/firstof9/ha-appliance-card` as a "Lovelace" repository
5. Click "Install"

### Manual

1. Download `appliance-card.js` from the [latest release](https://github.com/firstof9/ha-appliance-card/releases/latest) and copy it to your `<config>/www/` directory.
2. Add the following to your `configuration.yaml` or through the UI resources:

```yaml
lovelace:
  resources:
    - url: /local/appliance-card.js
      type: module
```

## Features

- **Multi-Integration Support**: Supports appliances from **SmartThings**, **LocalThings**, **Govee**, **GE Home (GE / Café)**, **Bosch Home Connect**, **LG ThinQ**, and **SmartThinQ LGE Sensors**.

### Supported Integrations

| Integration | Domain / ID | Description |
| --- | --- | --- |
| **SmartThings** | `smartthings` | Core Home Assistant SmartThings integration |
| **LocalThings** | `localthings` | Local SmartThings integration |
| **Govee** | `govee`, `govee_ble` | Govee Home / Govee BLE integrations |
| **GE Home** | `ge_home` | GE Appliances / Café integration |
| **Home Connect** | `homeconnect` | Core Home Assistant Bosch / Siemens Home Connect integration |
| **LG ThinQ** | `lg_thinq` | Core Home Assistant LG ThinQ integration |
| **SmartThinQ LGE Sensors** | `smartthinq_sensors` | Custom LG ThinQ integration |

- **Modern Glassmorphic UI**: Sleek, transparent design elements with vibrant accents.
- **7-Segment Digital Readouts**: Authentic digital display for timers and temperatures with grey "88" placeholders.
- **Responsive Layout**: Fully supports the new Home Assistant **Sections** dashboard with dynamic resizing.
- **Live Countdown**: Real-time progress tracking for all appliances.
- **Visual Editor**: Integrated configuration GUI with automatic entity discovery.
- **Appliance Specific Overlays**: Interactive door status, filter health progress bars, cooktop heating coils, and device controls.

## Configuration

This card supports a fully featured Visual Editor in the Home Assistant UI. Simply add the card, select your appliance device (SmartThings or LocalThings), and the editor will automatically discover and populate the relevant entities.

For manual YAML configuration:

| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `type` | string | **Required** | `custom:appliance-card` (deprecated: `custom:smartthings-card`) |
| `device_id` | string | **Required** | The Home Assistant device ID. |
| `appliance_type` | string | **Optional** | `microwave`, `oven`, `dishwasher`, `washer`, `dryer`, `refrigerator`, `cooktop`, `kettle`. Defaults to `microwave`. |
| `power_entity` | string | **Optional** | The entity ID for power state (switch or binary_sensor). |
| `mode_entity` | string | **Optional** | The entity ID for the current appliance mode. |
| `machine_state_entity` | string | **Optional** | The entity ID for the machine state. |
| `job_state_entity` | string | **Optional** | The entity ID for the current job state. |
| `time_entity` | string | **Optional** | The entity ID for completion time or time remaining (supports live countdown). |
| `temperature_entity` | string | **Optional** | The entity ID for real-time temperature monitoring (Microwave/Oven/Kettle). |
| `wifi_entity` | string | **Optional** | The entity ID for WiFi connection status. |
| `lock_entity` | string | **Optional** | The entity ID for child lock status. |

### Refrigerator Specific Options
| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `fridge_temp_entity` | string | **Optional** | The entity ID for the main fridge temperature. |
| `freezer_temp_entity` | string | **Optional** | The entity ID for the freezer temperature. |
| `door_entities` | list | **Optional** | A list of binary_sensor entity IDs for the doors. Overlays map automatically based on entity name (`cooler`, `coolselect`, `freezer`). |
| `ice_maker_entity` | string | **Optional** | The entity ID for the ice maker switch. |
| `filter_status_entity`| string | **Optional** | The entity ID for the water filter usage/health percentage. |
| `filter_reset_entity` | string | **Optional** | The entity ID for a button to reset the water filter. |

### Microwave / Oven Specific Options
| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `fan_entity` | string | **Optional** | The entity ID for the microwave fan (supports slider for `fan` or `number` entities). |
| `light_entity` | string | **Optional** | The entity ID for the microwave light toggle. |
| `temperature_entity` | string | **Optional** | The entity ID for the cooking temperature sensor. |

### Cooktop Specific Options
| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `burner_<position>_on_entity` | string | **Optional** | Binary sensor for burner flame/power state. |
| `burner_<position>_power_entity` | string | **Optional** | Sensor for burner power percentage (0-100%). |
| `burner_<position>_sync_entity` | string | **Optional** | Binary sensor for burner synchronization. |
| `sabbath_mode_entity` | string | **Optional** | Switch or binary sensor for Sabbath mode. |

### Template & Virtual Appliance Options
| Name | Type | Requirement | Description |
| --- | --- | --- | --- |
| `stage_map` | object | **Optional** | Key-value mapping from custom sensor state strings to card stages (e.g. `soaking: wash`). |
| `mode_map` | object | **Optional** | Key-value mapping from custom sensor state strings to card modes. |
| `time_template` | string | **Optional** | Jinja2 template rendering live time remaining or duration (e.g. `{{ states('sensor.washer_secs') }}`). |
| `job_state_template` | string | **Optional** | Jinja2 template rendering active job/cycle state. |
| `mode_template` | string | **Optional** | Jinja2 template rendering active appliance mode. |
| `power_template` | string | **Optional** | Jinja2 template returning `on` or `off` for power state. |
| `temperature_template` | string | **Optional** | Jinja2 template returning temperature value. |
| `alarm_code_template` | string | **Optional** | Jinja2 template returning alarm/fault code. |

---

## Template & Virtual Appliance Examples

`ha-appliance-card` supports non-smart appliances and custom integrations (ESPHome, Shelly, Tuya, Bosch, Miele, MQTT, Virtual Helper Sensors) using flexible duration parsers, stage mapping, and live Jinja2 template evaluation.

### Example 1: Template Washer with Stage Mapping & Seconds Timer
```yaml
type: custom:appliance-card
appliance_type: washer
job_state_entity: sensor.template_washer_status
time_entity: sensor.template_washer_seconds_remaining
stage_map:
  soaking: weight_sensing
  filling: wash
  washing: wash
  deep_rinse: rinse
  extracting: spin
```

### Example 2: Jinja2 Live Template Expressions
```yaml
type: custom:appliance-card
appliance_type: dryer
power_template: "{{ 'on' if is_state('sensor.dryer_power', 'running') else 'off' }}"
job_state_template: >
  {% if is_state('sensor.dryer_phase', 'drying') %}
    dry
  {% elif is_state('sensor.dryer_phase', 'cooling') %}
    cool
  {% else %}
    off
  {% endif %}
time_template: "{{ states('sensor.dryer_remaining_minutes') | int * 60 }}"
```

### Example 3: Flexible Time Formats
The `time_entity` and `time_template` automatically parse:
- **Raw Seconds**: `3600` &rarr; `01:00:00`
- **Units of Measurement**: `45` with unit `min` &rarr; `00:45:00`
- **Human Formatted Strings**: `"1h 25m"`, `"45 mins"`, `"90 sec"`
- **Standard Durations**: `"01:15:00"`, `"25:00"` (MM:SS &rarr; 00:25:00)
- **ISO Target Timestamps**: `"2026-08-18T16:30:00Z"` &rarr; Live countdown

### Kettle Specific Options

Kettles have no kettle-only configuration keys. The stage icon is driven by `job_state_entity`; `stage_map` can translate integration-specific values such as `Black Tea/Boil` and `Green Tea` to recognized stages. Kettles do not use the microwave/oven `mode_entity` fallback.

## Themes

This card supports Home Assistant themes and uses standard CSS variables for styling. You can customize the look of the card by modifying these variables in your theme:

| CSS Variable | Description | Default |
| --- | --- | --- |
| `--accent-color` | Color for active values, primary highlights, and active buttons. | `#ff9800` |
| `--primary-text-color` | Color for primary text elements. | Theme default |
| `--secondary-text-color` | Color for labels and secondary information. | `#888` |
| `--divider-color` | Color for background "segment" digit placeholders. | `#333` |
| `--ha-card-background` | Background color for control boxes. | `var(--card-background-color)` |
| `--success-color` | Color for healthy filter status (usage < 50%). | `#4caf50` |
| `--warning-color` | Color for filter warning state (usage 50-80%). | `#ff9800` |
| `--error-color` | Color for filter replacement state (usage > 80%). | `#f44336` |

## Assets

Images are generated via a build script into the `images/` directory of this repository. When installed via HACS, these images are automatically mapped and accessible at `/local/community/ha-smartthings-card/images/`.

## Development

1. Install dependencies: `npm install`
2. Build the project: `npm run build`
3. Watch for changes: `npm run build:watch`
