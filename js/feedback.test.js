import { describe, it, expect } from 'vitest';
import { getFeedbackLevel, getFeedbackMessage } from './feedback.js';

describe('feedback system', () => {
  it('returns level 1 for first error', () => {
    expect(getFeedbackLevel(0, 1)).toBe(1);
  });

  it('returns level 4 after 4+ errors', () => {
    expect(getFeedbackLevel(0, 5)).toBe(4);
  });

  it('returns level 2 for partial progress with attempts', () => {
    expect(getFeedbackLevel(2, 1)).toBe(2);
  });

  it('returns level 3 when complete', () => {
    expect(getFeedbackLevel(3, 0)).toBe(3);
  });

  it('generates a diagnostic message for errors', () => {
    const msg = getFeedbackMessage('enigma1', 'error', 1);
    expect(msg).toBeTruthy();
    expect(typeof msg).toBe('string');
  });

  it('generates partial progress message', () => {
    const msg = getFeedbackMessage('enigma1', 'partial', 1);
    expect(msg).toBeTruthy();
    expect(msg).toContain('%');
  });
});
