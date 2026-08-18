import { describe, it, expect } from 'vitest';
import { formatCountdown, getFilterColor, getAsset } from '../src/utils';

describe('formatCountdown', () => {
  const mockCurrentTime = new Date('2026-05-12T16:00:00Z').getTime();

  it('should return --:--:-- for unavailable or unknown', () => {
    expect(formatCountdown('unavailable', mockCurrentTime)).toBe('--:--:--');
    expect(formatCountdown('unknown', mockCurrentTime)).toBe('--:--:--');
    expect(formatCountdown('', mockCurrentTime)).toBe('--:--:--');
  });

  it('should return the string if it is already a duration', () => {
    expect(formatCountdown('00:10:00', mockCurrentTime)).toBe('00:10:00');
    expect(formatCountdown('1:30:00', mockCurrentTime)).toBe('01:30:00');
    expect(formatCountdown('1:30', mockCurrentTime)).toBe('00:01:30');
    expect(formatCountdown('25:00', mockCurrentTime)).toBe('00:25:00');
  });

  it('should parse human readable duration strings', () => {
    expect(formatCountdown('1h 30m', mockCurrentTime)).toBe('01:30:00');
    expect(formatCountdown('45 mins', mockCurrentTime)).toBe('00:45:00');
    expect(formatCountdown('2 hours', mockCurrentTime)).toBe('02:00:00');
    expect(formatCountdown('90 sec', mockCurrentTime)).toBe('00:01:30');
    expect(formatCountdown('1hr 15min 20sec', mockCurrentTime)).toBe('01:15:20');
  });

  it('should parse raw numbers and handle unit of measurement', () => {
    // Default number is seconds
    expect(formatCountdown(3665, mockCurrentTime)).toBe('01:01:05');
    expect(formatCountdown('1800', mockCurrentTime)).toBe('00:30:00');
    
    // Minutes unit
    expect(formatCountdown('45', mockCurrentTime, 'min')).toBe('00:45:00');
    expect(formatCountdown(90, mockCurrentTime, 'minutes')).toBe('01:30:00');
    expect(formatCountdown('1.5', mockCurrentTime, 'hours')).toBe('01:30:00');
    expect(formatCountdown('5000', mockCurrentTime, 'ms')).toBe('00:00:05');
  });

  it('should calculate the difference correctly for ISO dates', () => {
    const targetTime = new Date('2026-05-12T16:10:05Z').toISOString();
    expect(formatCountdown(targetTime, mockCurrentTime)).toBe('00:10:05');
  });

  it('should return 00:00:00 if the time has passed', () => {
    const pastTime = new Date('2026-05-12T15:59:59Z').toISOString();
    expect(formatCountdown(pastTime, mockCurrentTime)).toBe('00:00:00');
  });

  it('should return --:--:-- for invalid dates or strings', () => {
    expect(formatCountdown('not-a-date', mockCurrentTime)).toBe('--:--:--');
    expect(formatCountdown(null as any, mockCurrentTime)).toBe('--:--:--');
    expect(formatCountdown(undefined as any, mockCurrentTime)).toBe('--:--:--');
  });
});

describe('getFilterColor', () => {
  it('should return green for low usage', () => {
    expect(getFilterColor('10')).toBe('var(--success-color, #4caf50)');
    expect(getFilterColor('49')).toBe('var(--success-color, #4caf50)');
  });

  it('should return orange for medium usage', () => {
    expect(getFilterColor('50')).toBe('var(--warning-color, #ff9800)');
    expect(getFilterColor('79')).toBe('var(--warning-color, #ff9800)');
  });

  it('should return red for high usage', () => {
    expect(getFilterColor('80')).toBe('var(--error-color, #f44336)');
    expect(getFilterColor('99')).toBe('var(--error-color, #f44336)');
  });

  it('should return disabled color for invalid state', () => {
    expect(getFilterColor('unknown')).toBe('var(--disabled-text-color, #bdbdbd)');
  });
});

describe('getAsset', () => {
  it('should return the embedded asset if found', () => {
    // Note: This assumes 'refrigerator' and 'freezer-temp.png' are in ASSETS
    const result = getAsset('refrigerator', 'freezer-temp.png');
    expect(result).toBeDefined();
  });

  it('should return a fallback path if asset is not found', () => {
    const result = getAsset('unknown', 'missing.png');
    expect(result).toBe('/local/community/ha-smartthings-card/images/unknown/missing.png');
  });
});
