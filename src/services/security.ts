/**
 * Security, Identity & Application Hardening Services
 * Roles: agency-application-security-engineer & agency-identity-access-engineer
 */

export interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: 'MEMBER' | 'VIP_CREATOR' | 'ADMIN';
  tier: 'RED_MAGIC' | 'ONYX_RESERVE' | 'Y3000_PIONEER';
  token: string;
  expiresAt: number;
}

export class SecurityService {
  /**
   * Sanitizes input strings against XSS injection
   */
  public static sanitize(input: string): string {
    if (!input) return '';
    return input
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Generate RFC4122 v4 compliant UUID for Payment Idempotency Keys
   */
  public static generateIdempotencyKey(): string {
    return 'idemp_' + 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  /**
   * Masks credit card number following PCI DSS standards (only last 4 visible)
   */
  public static maskCard(cardNumber: string): string {
    const clean = cardNumber.replace(/\s+/g, '');
    if (clean.length < 4) return '•••• •••• •••• ••••';
    const last4 = clean.slice(-4);
    return `•••• •••• •••• ${last4}`;
  }

  /**
   * Formats 16-digit card numbers into 4-digit groups
   */
  public static formatCardNumber(value: string): string {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  }

  /**
   * Generates mock PKCE code challenge and token for Coca-Cola Insiders Club
   */
  public static createMockSession(email: string, name: string): UserSession {
    const randomHash = Math.random().toString(36).substring(2) + Date.now().toString(36);
    return {
      userId: 'coke_usr_' + Math.floor(Math.random() * 899999 + 100000),
      email,
      name: name || 'Coke Enthusiast',
      role: 'VIP_CREATOR',
      tier: 'Y3000_PIONEER',
      token: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${btoa(email)}.${randomHash}`,
      expiresAt: Date.now() + 1000 * 60 * 60 * 24 * 7 // 7 days
    };
  }
}
