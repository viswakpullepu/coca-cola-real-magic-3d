import { describe, it, expect } from 'vitest';

describe('Scroll-Based Kinetic Animation Calculations', () => {
  it('calculates scroll progress correctly between 0% and 100%', () => {
    const calculateProgress = (scrollY: number, scrollHeight: number, innerHeight: number) => {
      const totalScroll = scrollHeight - innerHeight;
      if (totalScroll <= 0) return 0;
      const progress = (scrollY / totalScroll) * 100;
      return Math.min(100, Math.max(0, progress));
    };

    expect(calculateProgress(0, 2000, 1000)).toBe(0);
    expect(calculateProgress(500, 2000, 1000)).toBe(50);
    expect(calculateProgress(1000, 2000, 1000)).toBe(100);
    expect(calculateProgress(1500, 2000, 1000)).toBe(100); // Clamped to 100%
    expect(calculateProgress(-50, 2000, 1000)).toBe(0);    // Clamped to 0%
  });

  it('handles zero or negative scrollable height safely without NaN', () => {
    const calculateProgress = (scrollY: number, scrollHeight: number, innerHeight: number) => {
      const totalScroll = scrollHeight - innerHeight;
      if (totalScroll <= 0) return 0;
      const progress = (scrollY / totalScroll) * 100;
      return Math.min(100, Math.max(0, progress));
    };

    expect(calculateProgress(100, 800, 800)).toBe(0);
    expect(calculateProgress(100, 600, 800)).toBe(0);
  });

  it('calculates scroll torque and velocity physics dampening correctly', () => {
    let scrollVelocity = 0;
    const deltaY = 35; // simulated scroll delta
    
    // Simulating scroll velocity impulse
    scrollVelocity = Math.max(-0.06, Math.min(0.06, deltaY * 0.0008));
    expect(scrollVelocity).toBeCloseTo(0.028, 3);

    // Simulating friction dampening over frame ticks
    const friction = 0.94;
    scrollVelocity *= friction;
    expect(scrollVelocity).toBeLessThan(0.028);
    expect(scrollVelocity).toBeGreaterThan(0);
  });
});
