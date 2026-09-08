import { describe, it, expect } from 'vitest';
import { SecurityService } from '../src/services/security';

describe('Cart, Payment & Security Engineering Services', () => {
  it('should sanitize input strings to eliminate XSS risks', () => {
    const maliciousInput = '<script>alert("hack")</script>';
    const sanitized = SecurityService.sanitize(maliciousInput);
    expect(sanitized).not.toContain('<script>');
    expect(sanitized).toBe('&lt;script&gt;alert(&quot;hack&quot;)&lt;&#x2F;script&gt;');
  });

  it('should mask 16-digit card numbers according to PCI-DSS rules', () => {
    const fullCard = '4242 4242 4242 1234';
    const masked = SecurityService.maskCard(fullCard);
    expect(masked).toBe('•••• •••• •••• 1234');
    expect(masked).not.toContain('4242');
  });

  it('should generate unique RFC4122 v4 idempotency keys', () => {
    const key1 = SecurityService.generateIdempotencyKey();
    const key2 = SecurityService.generateIdempotencyKey();
    expect(key1).toMatch(/^idemp_[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i);
    expect(key1).not.toBe(key2);
  });

  it('should format raw card numbers into 4-digit chunks', () => {
    const raw = '1234567812345678';
    const formatted = SecurityService.formatCardNumber(raw);
    expect(formatted).toBe('1234 5678 1234 5678');
  });
});
