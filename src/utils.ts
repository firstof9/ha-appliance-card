import { ASSETS } from './assets';

/**
 * Formats a timestamp, numeric duration, or duration string into a countdown string HH:MM:SS
 */
export function formatCountdown(timeVal: string | number, currentTime: number, unit?: string): string {
  if (timeVal === undefined || timeVal === null) return '--:--:--';
  const str = String(timeVal).trim();
  if (!str || ['unavailable', 'unknown', 'none', 'null'].includes(str.toLowerCase())) return '--:--:--';

  const cleanUnit = (unit || '').trim().toLowerCase();

  // 1. Duration string matching: "HH:MM:SS", "H:MM:SS", "MM:SS", "M:SS"
  const colonMatch = str.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?$/);
  if (colonMatch) {
    if (colonMatch[3] !== undefined) {
      // It has HH:MM:SS
      const h = colonMatch[1].padStart(2, '0');
      const m = colonMatch[2];
      const s = colonMatch[3];
      return `${h}:${m}:${s}`;
    } else {
      // It is MM:SS -> 00:MM:SS
      const m = colonMatch[1].padStart(2, '0');
      const s = colonMatch[2];
      return `00:${m}:${s}`;
    }
  }

  // 2. Human-readable duration strings (e.g. "1h 30m 15s", "45 mins", "2 hours", "90 sec")
  const humanDurationMatch = str.match(/^(?:(\d+)\s*(?:h|hr|hrs|hour|hours))?\s*(?:(\d+)\s*(?:m|min|mins|minute|minutes))?\s*(?:(\d+)\s*(?:s|sec|secs|second|seconds))?$/i);
  if (humanDurationMatch && (humanDurationMatch[1] || humanDurationMatch[2] || humanDurationMatch[3])) {
    const h = parseInt(humanDurationMatch[1] || '0', 10);
    const m = parseInt(humanDurationMatch[2] || '0', 10);
    const s = parseInt(humanDurationMatch[3] || '0', 10);
    const totalSec = h * 3600 + m * 60 + s;
    return secondsToHms(totalSec);
  }

  // 3. Numeric string or number (e.g. 3600, "1800", "45" with unit 'min')
  if (/^\d+(?:\.\d+)?$/.test(str)) {
    const num = parseFloat(str);
    if (!isNaN(num)) {
      if (cleanUnit === 'h' || cleanUnit === 'hr' || cleanUnit === 'hrs' || cleanUnit === 'hours') {
        return secondsToHms(Math.round(num * 3600));
      }
      if (cleanUnit === 'min' || cleanUnit === 'm' || cleanUnit === 'mins' || cleanUnit === 'minutes') {
        return secondsToHms(Math.round(num * 60));
      }
      if (cleanUnit === 'ms' || cleanUnit === 'milliseconds') {
        return secondsToHms(Math.round(num / 1000));
      }
      // Default numeric without specific larger unit: treat as seconds
      return secondsToHms(Math.round(num));
    }
  }

  // 4. ISO or Date timestamp calculation (e.g. "2026-08-18T14:30:00Z")
  const targetTime = new Date(str).getTime();
  if (isNaN(targetTime)) {
    return '--:--:--';
  }

  const diff = targetTime - currentTime;
  if (diff <= 0) {
    return '00:00:00';
  }

  return secondsToHms(Math.floor(diff / 1000));
}

function secondsToHms(totalSeconds: number): string {
  if (totalSeconds <= 0) return '00:00:00';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const hStr = hours.toString().padStart(2, '0');
  const mStr = minutes.toString().padStart(2, '0');
  const sStr = seconds.toString().padStart(2, '0');

  return `${hStr}:${mStr}:${sStr}`;
}

/**
 * Returns a color based on filter usage percentage
 */
export function getFilterColor(state: string): string {
  const usage = parseFloat(state);
  if (isNaN(usage)) return 'var(--disabled-text-color, #bdbdbd)';
  if (usage < 50) return 'var(--success-color, #4caf50)'; // Green — plenty of life left
  if (usage < 80) return 'var(--warning-color, #ff9800)'; // Orange — order soon
  return 'var(--error-color, #f44336)'; // Red — replace now
}

/**
 * Resolves an asset path, checking the embedded ASSETS first
 */
export function getAsset(appliance: string, filename: string): string {
  const asset = ASSETS[appliance]?.[filename];
  if (asset) return asset;

  // Not every appliance ships a highlighted "-on" variant for each stage icon
  // (kettle ships none). Fall back to the base icon rather than emitting a path
  // that 404s -- `.job-icon-container.active` already applies the glow and
  // scale, so the active state stays visually distinct. A real "-on" asset
  // takes precedence automatically once one is added.
  const onVariant = filename.match(/^(.*)-on(\.[^.]+)$/);
  if (onVariant) {
    const base = ASSETS[appliance]?.[`${onVariant[1]}${onVariant[2]}`];
    if (base) return base;
  }

  return `/local/community/ha-appliance-card/images/${appliance}/${filename}`;
}
