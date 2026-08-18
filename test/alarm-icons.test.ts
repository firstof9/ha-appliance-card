import { describe, it, expect } from 'vitest';
import { getAlarmIcon } from '../src/icons/alarm-icons';

describe('Alarm Icon Matcher & SVGs', () => {
  it('should match water supply error codes', () => {
    const info4C = getAlarmIcon('4C');
    expect(info4C.category).toBe('water_supply');
    expect(info4C.title).toBe('Water Supply Error: 4C');

    const infoIE = getAlarmIcon('IE');
    expect(infoIE.category).toBe('water_supply');

    const infoH2O = getAlarmIcon('H2O SUPPLY');
    expect(infoH2O.category).toBe('water_supply');

    const infoE22 = getAlarmIcon('E22');
    expect(infoE22.category).toBe('water_supply');
  });

  it('should match drain error codes', () => {
    const info5C = getAlarmIcon('5C');
    expect(info5C.category).toBe('drain');
    expect(info5C.title).toBe('Drain Error: 5C');

    const infoOE = getAlarmIcon('OE');
    expect(infoOE.category).toBe('drain');

    const infoDrain = getAlarmIcon('DRAIN');
    expect(infoDrain.category).toBe('drain');
  });

  it('should match water leak error codes', () => {
    const infoLC = getAlarmIcon('LC');
    expect(infoLC.category).toBe('leak');
    expect(infoLC.title).toBe('Water Leak Detected: LC');

    const infoAE = getAlarmIcon('AE');
    expect(infoAE.category).toBe('leak');

    const infoLeak = getAlarmIcon('water_leak');
    expect(infoLeak.category).toBe('leak');
  });

  it('should match door error codes', () => {
    const infoDC = getAlarmIcon('DC');
    expect(infoDC.category).toBe('door');
    expect(infoDC.title).toBe('Door Open / Latch Error: DC');

    const infoDE = getAlarmIcon('dE');
    expect(infoDE.category).toBe('door');

    const infoDoorOpen = getAlarmIcon('DoorA_Opened');
    expect(infoDoorOpen.category).toBe('door');

    const infoErrorCodeDC = getAlarmIcon('ErrorCode_DC');
    expect(infoErrorCodeDC.category).toBe('door');
  });

  it('should match dishwasher rinse aid refill codes', () => {
    const infoRinse = getAlarmIcon('RINSE_AID_EMPTY', 'dishwasher');
    expect(infoRinse.category).toBe('rinse_aid');
    expect(infoRinse.title).toBe('Rinse Aid Empty / Low: RINSE_AID_EMPTY');

    const infoRinseA = getAlarmIcon('RinseA_Empty', 'dishwasher');
    expect(infoRinseA.category).toBe('rinse_aid');
    expect(infoRinseA.title).toBe('Rinse Aid Empty / Low: RinseA_Empty');

    const infoLowRinse = getAlarmIcon('LOW_RINSE_AID');
    expect(infoLowRinse.category).toBe('rinse_aid');
  });

  it('should match dishwasher salt refill codes', () => {
    const infoSalt = getAlarmIcon('SALT_LOW', 'dishwasher');
    expect(infoSalt.category).toBe('salt_refill');
    expect(infoSalt.title).toBe('Dishwasher Salt Low: SALT_LOW');

    const infoSaltA = getAlarmIcon('SaltA_Empty', 'dishwasher');
    expect(infoSaltA.category).toBe('salt_refill');
    expect(infoSaltA.title).toBe('Dishwasher Salt Low: SaltA_Empty');

    const infoRefillSalt = getAlarmIcon('REFILL_SALT');
    expect(infoRefillSalt.category).toBe('salt_refill');
  });

  it('should match unbalanced load error codes', () => {
    const infoUB = getAlarmIcon('Ub');
    expect(infoUB.category).toBe('unbalanced');
    expect(infoUB.title).toBe('Unbalanced Load: Ub');

    const infoUE = getAlarmIcon('UE');
    expect(infoUE.category).toBe('unbalanced');
  });

  it('should match temperature / thermistor fault codes', () => {
    const infoTC = getAlarmIcon('tC');
    expect(infoTC.category).toBe('temperature');
    expect(infoTC.title).toBe('Temperature / Sensor Fault: tC');

    const infoF10 = getAlarmIcon('F10');
    expect(infoF10.category).toBe('temperature');
  });

  it('should match heating element fault codes', () => {
    const infoHC = getAlarmIcon('HC');
    expect(infoHC.category).toBe('heater');
    expect(infoHC.title).toBe('Heating Element Fault: HC');
  });

  it('should match excess suds error codes', () => {
    const infoSud = getAlarmIcon('Sud');
    expect(infoSud.category).toBe('suds');
    expect(infoSud.title).toBe('Excess Suds Detected: Sud');
  });

  it('should match filter / tub clean maintenance reminders', () => {
    const infoTCL = getAlarmIcon('tcL');
    expect(infoTCL.category).toBe('filter_clean');
    expect(infoTCL.title).toBe('Cleaning / Filter Reminder: tcL');

    const infoFilter = getAlarmIcon('FilterAlarm');
    expect(infoFilter.category).toBe('filter_clean');
  });

  it('should match dryer exhaust duct blockage codes', () => {
    const infoD80 = getAlarmIcon('d80', 'dryer');
    expect(infoD80.category).toBe('exhaust');
    expect(infoD80.title).toBe('Exhaust Duct Blocked: d80');
  });

  it('should match motor / inverter faults', () => {
    const info3C = getAlarmIcon('3C');
    expect(info3C.category).toBe('motor');
    expect(info3C.title).toBe('Motor Fault: 3C');
  });

  it('should fallback to generic alarm for unknown codes', () => {
    const infoUnknown = getAlarmIcon('ERR_999');
    expect(infoUnknown.category).toBe('generic');
    expect(infoUnknown.title).toBe('Alarm Code: ERR_999');
  });
});
