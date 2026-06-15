import { describe, it, expect, vi } from 'vitest';
import { createTimer } from './dom-utils.js';

describe('createTimer', () => {
  it('executes callback after delay', async () => {
    const timer = createTimer();
    const fn = vi.fn();
    timer.setTimeout(fn, 10);
    await new Promise(r => setTimeout(r, 20));
    expect(fn).toHaveBeenCalledOnce();
  });

  it('clears all pending timers', async () => {
    const timer = createTimer();
    const fn = vi.fn();
    timer.setTimeout(fn, 100);
    timer.setTimeout(fn, 200);
    timer.clearAll();
    await new Promise(r => setTimeout(r, 50));
    expect(fn).not.toHaveBeenCalled();
  });

  it('does not throw if clearAll called with no timers', () => {
    const timer = createTimer();
    expect(() => timer.clearAll()).not.toThrow();
  });
});
