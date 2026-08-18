import { html, TemplateResult } from 'lit';

export interface AlarmIconInfo {
  category: string;
  title: string;
  svgTemplate: TemplateResult;
}

// 24x24 SVG Path Definitions wrapped in div container with data-tooltip attributes for modern hover tooltips

// Water Tap / Faucet (IEC 60417 Water Supply / Tap Symbol)
const renderWaterTap = (title: string) => html`
  <div class="secondary-icon-wrapper" data-tooltip="${title}" role="img" aria-label="${title}">
    <svg class="secondary-icon alarm active" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3v2h4a3 3 0 0 1 3 3v2h2v2h-2v1a4 4 0 0 1-4 4h-1v-2h1a2 2 0 0 0 2-2v-1h-6v1a4 4 0 0 1-4 4H7v2H5v-2H3v-2h2v-1a4 4 0 0 1 4-4V8a3 3 0 0 1 3-3h2V3h2zm0 15a1.5 1.5 0 0 1 1.5 1.5c0 .83-.67 2-1.5 2.7-.83-.7-1.5-1.87-1.5-2.7A1.5 1.5 0 0 1 12 18z"/>
    </svg>
  </div>
`;

// Drain Pump / Filter Clog (IEC Drainage / Filter symbol)
const renderDrainFilter = (title: string) => html`
  <div class="secondary-icon-wrapper" data-tooltip="${title}" role="img" aria-label="${title}">
    <svg class="secondary-icon alarm active" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M3 4h18v2H3V4zm2 3h14l-2 10H7L5 7zm4 2v6h2V9H9zm4 0v6h2V9h-2zm-6 9h10v2H7v-2zm-3 3h16v1H4v-1z"/>
    </svg>
  </div>
`;

// Water Leakage Detected (Dripping drops in base pan / safety basin)
const renderWaterLeak = (title: string) => html`
  <div class="secondary-icon-wrapper" data-tooltip="${title}" role="img" aria-label="${title}">
    <svg class="secondary-icon alarm active" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0zM12 4.83L7.76 9.07a6 6 0 1 0 8.49 0zM2 20h20v2H2v-2z"/>
    </svg>
  </div>
`;

// Door Open / Latch (Open appliance door ajar)
const renderDoorOpen = (title: string) => html`
  <div class="secondary-icon-wrapper" data-tooltip="${title}" role="img" aria-label="${title}">
    <svg class="secondary-icon alarm active" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 19V5c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v14H3v2h18v-2h-2zm-4-1V6l-6 1.8v10.4L15 18zm-2-6a1 1 0 1 1 0-2 1 1 0 0 1 0 2z"/>
    </svg>
  </div>
`;

// Unbalanced Drum / Scale (Uneven weight distribution)
const renderUnbalancedLoad = (title: string) => html`
  <div class="secondary-icon-wrapper" data-tooltip="${title}" role="img" aria-label="${title}">
    <svg class="secondary-icon alarm active" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9zm0 16a7 7 0 1 1 7-7 7 7 0 0 1-7 7zm-3-8h6a3 3 0 0 1-3 3 3 3 0 0 1-3-3zm1-3h4v2h-4z"/>
    </svg>
  </div>
`;

// Dishwasher Rinse Aid Refill (IEC 60417-5388 6-ray / 8-ray sunburst sparkle)
const renderRinseAid = (title: string) => html`
  <div class="secondary-icon-wrapper" data-tooltip="${title}" role="img" aria-label="${title}">
    <svg class="secondary-icon alarm active" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="3"/>
      <path d="M12 2v3m0 14v3M2 12h3m14 0h3m-3.05-6.95l-2.12 2.12m-9.66 9.66l-2.12 2.12m0-13.9l2.12 2.12m9.66 9.66l2.12 2.12" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/>
    </svg>
  </div>
`;

// Dishwasher Salt Refill (IEC 60417-5389 Two opposing curved S-arrows)
const renderSaltRefill = (title: string) => html`
  <div class="secondary-icon-wrapper" data-tooltip="${title}" role="img" aria-label="${title}">
    <svg class="secondary-icon alarm active" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 3a4 4 0 0 0-4 4c0 2 2 3 4 4s4 2 4 4a4 4 0 0 1 4-4H5v2h2a6 6 0 0 0 6-6c0-2-2-3-4-4s-4-2-4-4a4 4 0 0 1 4-4h2V1H7v2zm10 20a4 4 0 0 0 4-4c0-2-2-3-4-4s-4-2-4-4a4 4 0 0 1 4-4h2V5h-2a6 6 0 0 0-6 6c0 2 2 3 4 4s4 2 4 4a4 4 0 0 1-4 4h-2v2h2z"/>
    </svg>
  </div>
`;

// Temperature / Overheating Fault (Thermometer with high level alert)
const renderTemperatureFault = (title: string) => html`
  <div class="secondary-icon-wrapper" data-tooltip="${title}" role="img" aria-label="${title}">
    <svg class="secondary-icon alarm active" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 13V5a3 3 0 0 0-6 0v8a5 5 0 1 0 6 0zm-3-10a1 1 0 0 1 1 1v4h-2V4a1 1 0 0 1 1-1zm0 17a3 3 0 0 1-2-5.24V9h4v5.76A3 3 0 0 1 12 20zm7-11h3v2h-3zm0-4h3v2h-3zm0 8h3v2h-3z"/>
    </svg>
  </div>
`;

// Heating Element (Radiant heat coil waves)
const renderHeaterFault = (title: string) => html`
  <div class="secondary-icon-wrapper" data-tooltip="${title}" role="img" aria-label="${title}">
    <svg class="secondary-icon alarm active" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 3v18h2V3H6zm5 0v18h2V3h-2zm5 0v18h2V3h-2zm-9 6h10v2H7V9zm0 6h10v2H7v-2z" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/>
      <path d="M4 19h16v2H4z"/>
    </svg>
  </div>
`;

// Excess Suds / Bubbles (Foam overflow)
const renderExcessSuds = (title: string) => html`
  <div class="secondary-icon-wrapper" data-tooltip="${title}" role="img" aria-label="${title}">
    <svg class="secondary-icon alarm active" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <circle cx="8" cy="8" r="4"/>
      <circle cx="16" cy="9" r="3.5"/>
      <circle cx="12" cy="15" r="4.5"/>
      <circle cx="18" cy="17" r="2.5"/>
      <circle cx="6" cy="17" r="2.5"/>
    </svg>
  </div>
`;

// Drum / Filter Cleaning Reminder (Drum with sparkles / maintenance)
const renderFilterClean = (title: string) => html`
  <div class="secondary-icon-wrapper" data-tooltip="${title}" role="img" aria-label="${title}">
    <svg class="secondary-icon alarm active" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14zM12 7a5 5 0 1 0 5 5 5 5 0 0 0-5-5zm0 8a3 3 0 1 1 3-3 3 3 0 0 1-3 3zm5-11l1.5 3.5L22 9l-3.5 1.5L17 14l-1.5-3.5L12 9l3.5-1.5z"/>
    </svg>
  </div>
`;

// Motor / Drive Fault (Motor cog with warning)
const renderMotorFault = (title: string) => html`
  <div class="secondary-icon-wrapper" data-tooltip="${title}" role="img" aria-label="${title}">
    <svg class="secondary-icon alarm active" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
    </svg>
  </div>
`;

// Dryer Exhaust Duct Blocked (HVAC airflow restriction)
const renderExhaustDuct = (title: string) => html`
  <div class="secondary-icon-wrapper" data-tooltip="${title}" role="img" aria-label="${title}">
    <svg class="secondary-icon alarm active" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 4H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 14H5V6h14v12zm-3-8h-2v4h2v-4zm-4 0h-2v4h2v-4zm-4 0H6v4h2v-4z"/>
      <line x1="4" y1="4" x2="20" y2="20" stroke="currentColor" stroke-width="2"/>
    </svg>
  </div>
`;

// Generic Alarm / Error Fallback (Shield / Triangle with exclamation point)
const renderGenericAlarm = (title: string) => html`
  <div class="secondary-icon-wrapper" data-tooltip="${title}" role="img" aria-label="${title}">
    <svg class="secondary-icon alarm active" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L1 21h22L12 2zm0 4.5l8.5 14.5H3.5L12 6.5zm-1 5v4h2v-4h-2zm0 6v2h2v-2h-2z"/>
    </svg>
  </div>
`;

/**
 * Returns the matching SVG icon template and human-readable title for a given error or alarm code.
 */
export function getAlarmIcon(code: string, applianceType?: string): AlarmIconInfo {
  const cleanCode = String(code || '').trim();
  const rawUpper = cleanCode.toUpperCase();
  // Strip ErrorCode_ / Error_ prefix for normalized matching (e.g. ErrorCode_DC -> DC)
  const upper = rawUpper.replace(/^ERROR(?:CODE)?[_\-\s]+/, '');
  const type = (applianceType || '').toLowerCase();

  // 1. Water Supply / Inlet Faults
  if (
    /^(4C|4C2|4E|4E2|1 4C|IE|NF|NO_FILL|WATER_INLET|WATER_SUPPLY|TAP|E22|E23)$/.test(upper) ||
    upper.includes('WATER SUPPLY') ||
    upper.includes('WATER_INLET') ||
    upper.includes('NO_WATER') ||
    upper.includes('H2O')
  ) {
    const title = `Water Supply Error: ${cleanCode}`;
    return {
      category: 'water_supply',
      title,
      svgTemplate: renderWaterTap(title),
    };
  }

  // 2. Drain / Filter / Pump Faults
  if (
    /^(5C|5E|OE|ND|SE|E2|E30|E31|DRAIN|DRAIN_ERROR|NO_DRAIN|PUMP)$/.test(upper) ||
    upper.includes('DRAIN') ||
    upper.includes('PUMP')
  ) {
    const title = `Drain Error: ${cleanCode}`;
    return {
      category: 'drain',
      title,
      svgTemplate: renderDrainFilter(title),
    };
  }

  // 3. Water Leak / Base Pan Overflow
  if (
    /^(LC|LC1|LE1|1E|1C|E9|AE|EI|LEAK|WATER_LEAK|LEAKAGE)$/.test(upper) ||
    (upper === 'LE' && type !== 'dryer') ||
    upper.includes('LEAK')
  ) {
    const title = `Water Leak Detected: ${cleanCode}`;
    return {
      category: 'leak',
      title,
      svgTemplate: renderWaterLeak(title),
    };
  }

  // 4. Door Open / Latch / Lock Faults
  if (
    /^(DC|DC1|DC2|DE|DE1|DE2|DO|DOORA_OPENED|DOOR_OPEN|DOOR_OPENED|DOOR_LOCK|DOOR_ERROR|LOCKED|E60|E61|F9|F90)$/.test(upper) ||
    upper.includes('DOOR') ||
    upper.includes('LATCH')
  ) {
    const title = `Door Open / Latch Error: ${cleanCode}`;
    return {
      category: 'door',
      title,
      svgTemplate: renderDoorOpen(title),
    };
  }

  // 5. Dishwasher Rinse Aid Refill
  if (
    /^(RINSE_AID|RINSE_AID_EMPTY|RINSE_AID_LOW|REFILL_RINSE_AID|LOW_RINSE_AID|RINSE_AID_REFILL|RINSEAID|RINSEA_EMPTY|RINSEA_LOW|RINSEA)$/.test(upper) ||
    upper.includes('RINSE_AID') ||
    upper.includes('RINSE AID') ||
    upper.includes('RINSEA')
  ) {
    const title = `Rinse Aid Empty / Low: ${cleanCode}`;
    return {
      category: 'rinse_aid',
      title,
      svgTemplate: renderRinseAid(title),
    };
  }

  // 6. Dishwasher Salt Refill
  if (
    /^(SALT_EMPTY|SALT_LOW|REFILL_SALT|LOW_SALT|SALT_REFILL|SALT|SALTA_EMPTY|SALTA_LOW|SALTA)$/.test(upper) ||
    upper.includes('SALT_REFILL') ||
    upper.includes('REFILL_SALT') ||
    upper.includes('SALTA') ||
    (type === 'dishwasher' && upper.includes('SALT'))
  ) {
    const title = `Dishwasher Salt Low: ${cleanCode}`;
    return {
      category: 'salt_refill',
      title,
      svgTemplate: renderSaltRefill(title),
    };
  }

  // 7. Unbalanced Load (Washers / Dryers)
  if (
    /^(UB|UE|UR|E4|UNBALANCED|UNBALANCE|UNBALANCE_ERROR)$/.test(upper) ||
    upper.includes('UNBALANC')
  ) {
    const title = `Unbalanced Load: ${cleanCode}`;
    return {
      category: 'unbalanced',
      title,
      svgTemplate: renderUnbalancedLoad(title),
    };
  }

  // 8. Temperature / Overheating / Thermistor Sensor
  if (
    /^(TC|TC1|TC2|TC3|TC4|TE|TE1|6C|6E|F2|F3|F4|F10|F20|F30|HOT|TEMPERATURE|OVERHEAT|THERMISTOR)$/.test(upper) ||
    upper.includes('TEMP') ||
    upper.includes('OVERHEAT') ||
    upper.includes('THERMISTOR')
  ) {
    const title = `Temperature / Sensor Fault: ${cleanCode}`;
    return {
      category: 'temperature',
      title,
      svgTemplate: renderTemperatureFault(title),
    };
  }

  // 9. Heating Element Fault
  if (
    /^(HC|HC1|HC2|HE|HE1|HEATER|HEATING_FAULT)$/.test(upper) ||
    upper.includes('HEATER') ||
    upper.includes('HEATING')
  ) {
    const title = `Heating Element Fault: ${cleanCode}`;
    return {
      category: 'heater',
      title,
      svgTemplate: renderHeaterFault(title),
    };
  }

  // 10. Excess Suds / Foam
  if (
    /^(SUD|SUDS|BE|BUBBLE|FOAM|EXCESS_SUDS)$/.test(upper) ||
    upper.includes('SUD') ||
    upper.includes('FOAM')
  ) {
    const title = `Excess Suds Detected: ${cleanCode}`;
    return {
      category: 'suds',
      title,
      svgTemplate: renderExcessSuds(title),
    };
  }

  // 11. Maintenance / Drum Clean / Filter Clean Reminder
  if (
    /^(TCL|FILTERALARM|FILTER_ALARM|FILTER_CLEAN|TUB_CLEAN|CLEAN_DRUM|FILTER_TIME)$/.test(upper) ||
    upper.includes('FILTER') ||
    upper.includes('TUB_CLEAN')
  ) {
    const title = `Cleaning / Filter Reminder: ${cleanCode}`;
    return {
      category: 'filter_clean',
      title,
      svgTemplate: renderFilterClean(title),
    };
  }

  // 12. Dryer Exhaust Duct Blockage
  if (
    /^(D80|D90|D95|EXHAUST|DUCT_BLOCKED|VENT_BLOCKED)$/.test(upper) ||
    upper.includes('EXHAUST') ||
    upper.includes('DUCT')
  ) {
    const title = `Exhaust Duct Blocked: ${cleanCode}`;
    return {
      category: 'exhaust',
      title,
      svgTemplate: renderExhaustDuct(title),
    };
  }

  // 13. Motor / Inverter / Drive Fault
  if (
    /^(3C|3C1|3C2|3C3|3C4|3E|3E1|3E2|3E3|3E4|E42|E45|MOTOR|MOTOR_ERROR|DRIVE)$/.test(upper) ||
    upper.includes('MOTOR') ||
    upper.includes('DRIVE')
  ) {
    const title = `Motor Fault: ${cleanCode}`;
    return {
      category: 'motor',
      title,
      svgTemplate: renderMotorFault(title),
    };
  }

  // 14. Fallback Generic Alarm
  const title = `Alarm Code: ${cleanCode}`;
  return {
    category: 'generic',
    title,
    svgTemplate: renderGenericAlarm(title),
  };
}
