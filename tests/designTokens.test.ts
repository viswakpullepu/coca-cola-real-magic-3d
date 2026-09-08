import { describe, it, expect } from 'vitest';
import { FLAVOR_PROFILES, getContrastRatio, getLuminance } from '../src/tokens/designSystem';

describe('Design System & Color Tokens (WCAG 2.2 AA)', () => {
  it('should have all 5 canonical Coca-Cola flavor profiles defined', () => {
    const keys = Object.keys(FLAVOR_PROFILES);
    expect(keys).toContain('classic');
    expect(keys).toContain('zero');
    expect(keys).toContain('cherry');
    expect(keys).toContain('vanilla');
    expect(keys).toContain('y3000');
  });

  it('should satisfy WCAG 2.2 AA large text contrast ratio (>= 3.0:1) on classic Coke Red', () => {
    // White headline text on Classic Red #F40009
    const ratio = getContrastRatio('#FFFFFF', '#F40009');
    expect(ratio).toBeGreaterThanOrEqual(3.0);
    expect(ratio).toBeCloseTo(4.33, 1);
  });

  it('should satisfy WCAG 2.2 AA body text contrast ratio (>= 4.5:1) on accessible Deep Red', () => {
    // White body text on Deep Brand Red #BA0007
    const ratio = getContrastRatio('#FFFFFF', '#BA0007');
    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });

  it('should satisfy WCAG 2.2 AAA contrast ratio (>= 7.0:1) for text on Zero Sugar Onyx', () => {
    // White text on Onyx Black #111111
    const ratio = getContrastRatio('#FFFFFF', '#111111');
    expect(ratio).toBeGreaterThanOrEqual(7.0);
  });

  it('should calculate relative luminance correctly', () => {
    const whiteLum = getLuminance('#FFFFFF');
    const blackLum = getLuminance('#000000');
    expect(whiteLum).toBeCloseTo(1.0, 1);
    expect(blackLum).toBeCloseTo(0.0, 1);
  });
});
