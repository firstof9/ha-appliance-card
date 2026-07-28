---
name: home-assistant-card-development
description: Standards for LitElement Home Assistant custom cards and visual editor elements.
---

# Home Assistant Custom Card Development

Guidelines and best practices for developing `<appliance-card>` and visual editor components for Home Assistant.

## Core Card Architecture
1. **Custom Element Decorators**:
   - Always use Lit `@customElement('appliance-card')` class decorators.
   - For backwards compatibility aliases, subclass explicitly with decorators:
     ```typescript
     @customElement('smartthings-card')
     export class SmartthingsCard extends ApplianceCard {}
     ```
2. **Deprecation Warnings**:
   - Log console deprecation warnings when legacy tags or configuration types (`custom:smartthings-card`) are used.
3. **Card API Methods**:
   - Every card class must provide `setConfig(config)`, `getCardSize()`, and static `getConfigElement()` / `getStubConfig()`.

## Editor Integration
- Visual editors must inherit from `LitElement` and export `setConfig(config)` and `hass`.
- Form schemas must use HA `ha-form` selector definitions.
