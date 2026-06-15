import { describe, it, expect } from 'vitest';
import { getTimerPhase, getHeartColor, getBPM } from './timer.js';

describe('timer logic', () => {
  it('returns stable phase above 50%', () => {
    expect(getTimerPhase(0.75)).toBe('stable');
  });

  it('returns alert phase between 25% and 50%', () => {
    expect(getTimerPhase(0.35)).toBe('alert');
  });

  it('returns critical phase between 10% and 25%', () => {
    expect(getTimerPhase(0.15)).toBe('critical');
  });

  it('returns terminal phase below 10%', () => {
    expect(getTimerPhase(0.05)).toBe('terminal');
  });

  it('returns green color for stable', () => {
    expect(getHeartColor('stable')).toBe('#00FF41');
  });

  it('returns orange for alert', () => {
    expect(getHeartColor('alert')).toBe('#FF6A00');
  });

  it('returns red for critical', () => {
    expect(getHeartColor('critical')).toBe('#FF0033');
  });

  it('returns correct BPM for stable', () => {
    expect(getBPM('stable')).toBe(60);
  });

  it('returns correct BPM for alert', () => {
    expect(getBPM('alert')).toBe(90);
  });

  it('returns correct BPM for critical', () => {
    expect(getBPM('critical')).toBe(130);
  });

  it('returns correct BPM for terminal', () => {
    expect(getBPM('terminal')).toBe(180);
  });
});
