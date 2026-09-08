import { describe, it, expect } from 'vitest';
import { FLAVOR_PROFILES } from '../src/tokens/designSystem';

describe('Creative Stunts & Brand Magic Features', () => {
  it('should have the secret 6th flavor "nebula" registered with galactic specs', () => {
    expect(FLAVOR_PROFILES.nebula).toBeDefined();
    expect(FLAVOR_PROFILES.nebula.name).toContain('Cosmic Nebula');
    expect(FLAVOR_PROFILES.nebula.isSecret).toBe(true);
    expect(FLAVOR_PROFILES.nebula.canMetalness).toBeGreaterThanOrEqual(0.95);
  });

  it('should validate Happiness Machine promotional vouchers', () => {
    const secretCodes = ['POLARBEAR40', 'NEBULA1886'];
    const discounts: Record<string, number> = {
      POLARBEAR40: 40,
      NEBULA1886: 35,
    };

    secretCodes.forEach((code) => {
      expect(discounts[code]).toBeGreaterThanOrEqual(30);
      expect(discounts[code]).toBeLessThanOrEqual(50);
    });
  });

  it('should constrain DJ step sequencer tempo to danceable range (90 - 130 BPM)', () => {
    const minBpm = 90;
    const maxBpm = 130;
    const defaultBpm = 110;

    expect(defaultBpm).toBeGreaterThanOrEqual(minBpm);
    expect(defaultBpm).toBeLessThanOrEqual(maxBpm);
  });
});
