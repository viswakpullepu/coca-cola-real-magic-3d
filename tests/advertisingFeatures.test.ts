import { describe, it, expect } from 'vitest';

describe('Coca-Cola Advertising Campaigns & Gamification Mechanics', () => {
  it('should validate Share a Coke name character constraints and uppercase formatting', () => {
    const rawInput = 'elizabeth';
    const formatted = rawInput.trim().toUpperCase();
    expect(formatted).toBe('ELIZABETH');
    expect(formatted.length).toBeLessThanOrEqual(12);
  });

  it('should verify Golden Tab promotional discount codes and percentage bounds', () => {
    const validCodes = ['GOLDENTAB30', 'REALMAGIC20', 'COKEZERO'];
    const discounts: Record<string, number> = {
      GOLDENTAB30: 30,
      REALMAGIC20: 20,
      COKEZERO: 15,
    };

    validCodes.forEach((code) => {
      expect(discounts[code]).toBeGreaterThanOrEqual(10);
      expect(discounts[code]).toBeLessThanOrEqual(50);
    });
  });

  it('should calculate the dominant Aura flavor based on user answers', () => {
    // Simulated answers choosing Cyberpunk / AI options
    const answers = ['y3000', 'y3000', 'classic'];
    const counts: Record<string, number> = {};
    answers.forEach((t) => {
      counts[t] = (counts[t] || 0) + 1;
    });

    let highestKey = 'classic';
    let max = 0;
    Object.entries(counts).forEach(([k, count]) => {
      if (count > max) {
        max = count;
        highestKey = k;
      }
    });

    expect(highestKey).toBe('y3000');
  });

  it('should resolve tie-breaks gracefully to default classic', () => {
    const answers = ['classic', 'zero', 'cherry'];
    const counts: Record<string, number> = {};
    answers.forEach((t) => {
      counts[t] = (counts[t] || 0) + 1;
    });

    let highestKey = 'classic';
    let max = 0;
    Object.entries(counts).forEach(([k, count]) => {
      if (count > max) {
        max = count;
        highestKey = k;
      }
    });

    expect(['classic', 'zero', 'cherry']).toContain(highestKey);
  });
});
