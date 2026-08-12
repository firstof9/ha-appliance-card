import { css } from 'lit';

export const styles = css`
  ha-card {
    overflow: hidden;
  }
  .container {
    position: relative;
    width: 100%;
    height: 100%;
    min-height: 180px;
    background: #1c1c1c;
    border-radius: 12px;
    overflow: hidden;
    user-select: none;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  }

  .bg-layer {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 30% 50%, var(--bg-color-primary, #3d3d3d) 0%, #2a2a2a 70%);
    z-index: 0;
  }

  .appliance-img {
    position: absolute;
    left: 4%;
    top: 50%;
    transform: translateY(-50%);
    height: 75%;
    max-width: 45%;
    object-fit: contain;
    z-index: 2;
    filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5));
  }


  .mode-icon {
    position: absolute;
    top: 33%;
    left: 77%;
    width: 20%;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    transform: translate(-50%, -50%);
  }
  /* Right Panel — stacks timer + controls vertically */
  .right-panel {
    position: absolute;
    right: 5%;
    top: 0;
    bottom: 3%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
    gap: 2px;
    z-index: 5;
  }
  .timer-row {
    position: relative;
    white-space: nowrap;
    background: rgba(0, 0, 0, 0.2);
    padding: 0px 10px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    margin-bottom: 5px;
    line-height: 1;
  }
  .time-bg,
  .time-fg {
    font-family: 'segment7', monospace;
    font-size: clamp(40px, 8vw, 50px);
    white-space: nowrap;
  }
  .time-bg {
    color: var(--divider-color, #333);
  }
  .time-fg {
    position: absolute;
    top: 2px;
    left: 10px;
    color: var(--accent-color, #ff9800);
  }

  .temp-row {
    font-family: 'segment7', monospace;
    font-size: clamp(40px, 8vw, 50px);
    margin-bottom: 5px;
    background: rgba(0, 0, 0, 0.2);
    padding: 0px 10px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    display: grid;
    place-items: center baseline;
    line-height: 1;
  }
  .temp-bg,
  .temp-fg {
    grid-area: 1 / 1;
    white-space: pre;
  }
  .temp-bg {
    color: var(--divider-color, #333);
  }
  .temp-fg {
    color: var(--accent-color, #ff9800);
    z-index: 1;
    display: flex;
    align-items: baseline;
    gap: 4px;
  }
  .temp-unit {
    font-size: 0.4em;
    opacity: 0.7;
  }

  /* Refrigerator Styles */
  .refrigerator .fridge-temp-column,
  .refrigerator .freezer-temp-column {
    position: absolute;
    top: 48%;
    transform: translate(-50%, -50%);
    width: 20%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    z-index: 5;
  }
  .refrigerator .fridge-temp-column { left: 33%; }
  .refrigerator .freezer-temp-column { left: 51%; }

  .refrigerator .fridge-icon,
  .refrigerator .freezer-icon {
    width: 100%;
    height: auto;
    image-rendering: pixelated;
    z-index: 5;
    display: block;
    margin: 0 auto;
    padding: 0;
  }

  .refrigerator .icemaker-icon {
    position: absolute;
    top: 33%;
    left: 69%;
    width: 20%;
    height: auto;
    transform: translate(-50%, -50%);
    image-rendering: pixelated;
    z-index: 5;
    cursor: pointer;
  }

  .microwave .appliance-img,
  .oven .appliance-img {
    max-width: 35%;
  }

  .washer .appliance-img,
  .dryer .appliance-img {
    height: 55%;
  }

  .dishwasher .appliance-img {
    height: 50%;
  }

  .refrigerator .appliance-container {
    position: absolute;
    left: 4%;
    top: 50%;
    transform: translateY(-50%);
    height: 65%;
    display: inline-block;
    z-index: 2;
  }

  .refrigerator .appliance-img {
    height: 100%;
    width: auto;
    display: block;
    position: static;
    transform: none;
    max-width: none;
  }

  .refrigerator .fridge-temp-box,
  .refrigerator .freezer-temp-box {
    z-index: 5;
    background: rgba(0, 0, 0, 0.2);
    padding: 0px 8px;
    border-radius: 8px;
    border: 1px solid rgba(255, 255, 255, 0.05);
    display: grid;
    place-items: center;
    line-height: 1;
    margin: 0 auto;
  }

  .refrigerator .fridge-value-bg,
  .refrigerator .fridge-value,
  .refrigerator .freezer-value-bg,
  .refrigerator .freezer-value {
    grid-area: 1 / 1;
    font-family: 'segment7', monospace;
    font-size: 50px;
    white-space: pre;
  }

  .refrigerator .fridge-value-bg,
  .refrigerator .freezer-value-bg { 
    color: var(--divider-color, #333);
  }
  .refrigerator .fridge-value,
  .refrigerator .freezer-value { 
    color: var(--accent-color, #ff9800);
    z-index: 1;
  }

  .filter-status {
    position: absolute;
    top: 65%;
    right: 2%;
    width: 35%;
    display: flex;
    flex-direction: column;
    gap: 4px;
    color: var(--secondary-text-color, #888);
    z-index: 5;
  }
  .filter-label-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .filter-label {
    font-size: 11px;
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }
  .filter-info-row {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 11px;
  }
  .progress-bar {
    flex-grow: 1;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 3px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    transition: width 0.5s ease, background-color 0.5s ease;
  }
  .filter-percentage {
    min-width: 25px;
    text-align: right;
  }
  .reset-btn-mini {
    background: transparent;
    border: none;
    color: #f44336;
    cursor: pointer;
    padding: 2px;
    display: flex;
    align-items: center;
    transition: transform 0.2s ease, filter 0.2s ease;
  }
  .reset-btn-mini:hover {
    transform: scale(1.3);
    filter: brightness(1.3);
  }
  .reset-btn-mini ha-icon {
    --mdc-icon-size: 16px;
  }

  .door-overlay {
    position: absolute;
    left: 4%;
    width: 12%;
    border-radius: 4px;
    transition: all 0.4s ease;
    z-index: 4;
  }
  .door-overlay.closed {
    background: rgba(76, 175, 80, 0.15);
    border: 1px solid rgba(76, 175, 80, 0.4);
  }
  .door-overlay.open {
    background: rgba(255, 82, 82, 0.25);
    border: 1px solid rgba(255, 82, 82, 0.7);
    box-shadow: 0 0 8px rgba(255, 82, 82, 0.3);
  }
  .refrigerator .door-overlay {
    left: 0;
    width: 100%;
  }
  /* Cooler door — top section */
  .door-overlay.door-top {
    top: 1.54%;
    height: 46.15%;
  }
  /* CoolSelect drawer — middle section */
  .door-overlay.door-middle {
    top: 49.23%;
    height: 17.69%;
  }
  /* Freezer drawer — bottom section */
  .door-overlay.door-bottom {
    top: 68.46%;
    height: 27.69%;
  }

  /* Ice Maker States */
  .refrigerator .icemaker-icon.on {
    filter: drop-shadow(0 0 6px rgba(76, 175, 80, 0.8)) drop-shadow(0 0 12px rgba(76, 175, 80, 0.4));
  }
  .refrigerator .icemaker-icon.off {
    animation: ice-pulse 2s ease-in-out infinite;
  }
  @keyframes ice-pulse {
    0%, 100% { filter: drop-shadow(0 0 0px transparent); opacity: 0.6; }
    50% { filter: drop-shadow(0 0 8px rgba(255, 82, 82, 0.7)); opacity: 1; }
  }
  .refrigerator .controls {
    display: none; /* Replaced by icons */
  }
  .control-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: var(--ha-card-background, var(--card-background-color, rgba(0, 0, 0, 0.6)));
    padding: 8px 12px;
    border-radius: 10px;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.05);
  }
  .control-box.on {
    color: var(--accent-color, #ff9800);
    border-color: var(--accent-color, #ff9800);
    background: rgba(255, 152, 0, 0.1);
  }
  .control-box.off {
    color: var(--secondary-text-color, #666);
    background: var(--ha-card-background, var(--card-background-color, rgba(0, 0, 0, 0.3)));
  }
  .control-box .label {
    font-size: 9px;
    margin-top: 4px;
    font-weight: bold;
  }
  .control-box ha-icon {
    --mdc-icon-size: 28px;
  }
  .control-box.filter {
    cursor: default;
    min-width: 120px;
  }
  .filter-info {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
  }
  .progress-bar {
    width: 100%;
    height: 4px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 2px;
    overflow: hidden;
  }
  .progress-fill {
    height: 100%;
    transition: width 0.5s ease, background-color 0.5s ease;
  }
  .reset-btn {
    margin-top: 8px;
    background: var(--accent-color, #ff9800);
    border: none;
    color: white;
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 10px;
    font-weight: bold;
    cursor: pointer;
    transition: background 0.3s ease;
  }
  .reset-btn:hover {
    filter: brightness(1.2);
  }
  .reset-btn:active {
    transform: scale(0.95);
  }

  /* Job States Styles */
  .job-states {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
  }
   .job-icon-container {
    position: absolute;
    top: 25%;
    width: 18%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    transform: translate(-50%, -50%);
    transition: all 0.5s ease;
    pointer-events: auto;
    z-index: 5;
  }
  .job-icon {
    width: 100%;
    image-rendering: -webkit-optimize-contrast;
    image-rendering: crisp-edges;
    filter: grayscale(1) opacity(0.3) drop-shadow(rgba(255, 255, 255, 1) 0px 0px 0.6px);
    transition: all 0.5s ease;
  }
  .job-label {
    margin-top: -12px;
    font-size: clamp(8px, 1.8vw, 10px);
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    color: var(--secondary-text-color, #888);
    text-align: center;
    white-space: nowrap;
    opacity: 0.4;
    transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    z-index: 2;
  }
  .washer .job-icon-container,
  .dryer .job-icon-container,
  .dishwasher .job-icon-container {
    top: 38%;
  }
  .microwave .job-icon-container,
  .oven .job-icon-container {
    top: 15%;
    left: 65%;
  }
  .job-icon-container.active::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 150%;
    height: 150%;
    background: radial-gradient(circle, rgba(255, 152, 0, 0.15) 0%, transparent 70%);
    transform: translate(-50%, -60%);
    z-index: -1;
    pointer-events: none;
    animation: glow-pulse 3s ease-in-out infinite;
  }
  @keyframes glow-pulse {
    0%, 100% { opacity: 0.8; transform: translate(-50%, -60%) scale(1); }
    50% { opacity: 1; transform: translate(-50%, -60%) scale(1.1); }
  }
  .job-icon-container.active .job-icon {
    filter: grayscale(0) opacity(1) drop-shadow(0 0 8px var(--accent-color, #ff9800)) drop-shadow(0 0 15px rgba(255, 152, 0, 0.4));
    transform: scale(1.15);
  }
  .job-icon-container.active .job-label {
    opacity: 1;
    color: var(--accent-color, #ff9800);
    text-shadow: 0 0 10px var(--accent-color, #ff9800), 0 0 20px rgba(255, 152, 0, 0.3);
    transform: scale(1.05);
  }

  /* Secondary Icons (WiFi, Lock) */
  .timer-section {
    display: flex;
    align-items: center;
    gap: 10px;
    justify-content: flex-end;
    width: 100%;
  }

  .secondary-icons {
    display: flex;
    gap: 6px;
    align-items: center;
    justify-content: center;
    z-index: 5;
  }
  .refrigerator .secondary-icons {
    position: absolute;
    top: 5%;
    right: 5%;
  }
  .secondary-icon {
    width: 40px;
    height: 40px;
    transition: opacity 0.3s ease;
    filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
  }
  .secondary-icon.alarm {
    --mdc-icon-size: 32px;
    color: #f44336;
    animation: alarm-blink 1.5s ease-in-out infinite;
  }
  @keyframes alarm-blink {
    0%, 100% { filter: drop-shadow(0 0 4px rgba(244, 67, 54, 0.8)); opacity: 1; }
    50% { filter: drop-shadow(0 0 10px rgba(244, 67, 54, 1)); opacity: 0.5; }
  }
  .secondary-icon.active {
  }

  /* Microwave Controls */
  .microwave-controls {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    pointer-events: auto;
    z-index: 5;
  }
  .control-group {
    display: flex;
    align-items: center;
    gap: 12px;
    background: rgba(0, 0, 0, 0.4);
    padding: 4px 10px;
    border-radius: 16px;
    backdrop-filter: blur(4px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  .light-control {
    cursor: pointer;
    display: flex;
    align-items: center;
    color: var(--secondary-text-color, #888);
    transition: all 0.3s ease;
  }
  .light-control.on {
    color: var(--accent-color, #ff9800);
    filter: drop-shadow(0 0 5px var(--accent-color, #ff9800));
  }
  .fan-control {
    display: flex;
    align-items: center;
    gap: 8px;
    color: var(--secondary-text-color, #888);
  }
  .fan-control.on {
    color: var(--accent-color, #ff9800);
  }
  .fan-slider {
    width: 80px;
    height: 4px;
    -webkit-appearance: none;
    background: rgba(255, 255, 255, 0.2);
    border-radius: 2px;
    outline: none;
  }
  .fan-slider::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    background: var(--accent-color, #ff9800);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  }
  .fan-control.on ha-icon {
    animation: spin 2s linear infinite;
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  /* Cooktop Appliance Styles */
  .cooktop .appliance-img {
    height: 70%;
    max-width: 40%;
    left: 5%;
  }

  .cooktop-burners-overlay {
    position: absolute;
    top: 50%;
    left: 45%;
    transform: translateY(-50%);
    width: 48%;
    height: 80%;
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-template-rows: repeat(2, 1fr);
    gap: 10px;
    z-index: 5;
  }

  .cooktop-burners-overlay.has-center {
    grid-template-columns: 1fr 1fr 1fr;
  }

  .burner-element {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background: rgba(0, 0, 0, 0.4);
    transition: all 0.4s ease;
    padding: 4px;
    min-height: 55px;
  }

  .burner-svg {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 1;
  }

  .burner-ring {
    fill: none;
    stroke: rgba(255, 255, 255, 0.15);
    stroke-width: 1.5;
    transition: all 0.4s ease;
  }

  .burner-element-coil {
    fill: none;
    stroke: rgba(255, 255, 255, 0.05);
    stroke-width: 1;
    stroke-dasharray: 4, 3;
    transition: all 0.4s ease;
  }

  .burner-element.center-rear {
    grid-column: 2;
    grid-row: 1;
  }

  .burner-element.left-rear {
    grid-column: 1;
    grid-row: 1;
  }

  .burner-element.right-rear {
    grid-column: 2;
    grid-row: 1;
  }

  .cooktop-burners-overlay.has-center .burner-element.right-rear {
    grid-column: 3;
    grid-row: 1;
  }

  .burner-element.left-front {
    grid-column: 1;
    grid-row: 2;
  }

  .burner-element.right-front {
    grid-column: 2;
    grid-row: 2;
  }

  .cooktop-burners-overlay.has-center .burner-element.right-front {
    grid-column: 3;
    grid-row: 2;
  }

  .burner-element.on {
    background: radial-gradient(circle, rgba(255, 87, 34, 0.3) 0%, rgba(255, 87, 34, 0.05) 75%);
    box-shadow: 0 0 14px rgba(255, 87, 34, 0.6), inset 0 0 12px rgba(255, 87, 34, 0.4);
    animation: burner-heat-pulse 2.5s ease-in-out infinite;
  }

  .burner-element.on .burner-ring {
    stroke: #ff5722;
    filter: drop-shadow(0 0 4px #ff5722);
  }

  .burner-element.on .burner-element-coil {
    stroke: #ffab91;
    stroke-width: 1.5;
    filter: drop-shadow(0 0 6px #ff5722);
  }

  @keyframes burner-heat-pulse {
    0%, 100% { box-shadow: 0 0 10px rgba(255, 87, 34, 0.5), inset 0 0 8px rgba(255, 87, 34, 0.3); }
    50% { box-shadow: 0 0 20px rgba(255, 87, 34, 0.85), inset 0 0 16px rgba(255, 87, 34, 0.6); }
  }

  .burner-label {
    position: relative;
    z-index: 2;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    color: var(--secondary-text-color, #aaa);
    letter-spacing: 0.5px;
    line-height: 1;
  }

  .burner-element.on .burner-label {
    color: #ffffff;
    text-shadow: 0 0 6px rgba(255, 87, 34, 0.9);
  }

  .burner-power {
    position: relative;
    z-index: 2;
    font-family: 'segment7', monospace;
    font-size: 14px;
    color: var(--accent-color, #ff9800);
    margin-top: 2px;
    line-height: 1;
  }

  .burner-sync-badge {
    position: absolute;
    top: 2px;
    right: 2px;
    font-size: 10px;
    color: #2196f3;
    display: flex;
    align-items: center;
  }

  .burner-sync-badge ha-icon {
    --mdc-icon-size: 12px;
  }
`;
