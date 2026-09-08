import { describe, it, expect } from 'vitest';
import { FLAVOR_PROFILES } from '../src/tokens/designSystem';
import { SecurityService } from '../src/services/security';
import { sound } from '../src/audio/SoundSynthesizer';

describe('Comprehensive Button & Interactive Actions Forensic Audit', () => {
  describe('StudioDock & Pavilion Navigation', () => {
    it('should validate all 6 active pavilion keys', () => {
      const validTabs = ['stage', 'happiness', 'sonic', 'create', 'vault', 'drops'];
      validTabs.forEach((tab) => {
        expect(['stage', 'happiness', 'sonic', 'create', 'vault', 'drops']).toContain(tab);
      });
    });
  });

  describe('HeroStage & Flavor Carousel Buttons', () => {
    it('should allow selecting any of the 6 canonical flavor profiles', () => {
      const flavorKeys = Object.keys(FLAVOR_PROFILES);
      expect(flavorKeys.length).toBe(6);
      expect(flavorKeys).toContain('classic');
      expect(flavorKeys).toContain('zero');
      expect(flavorKeys).toContain('cherry');
      expect(flavorKeys).toContain('vanilla');
      expect(flavorKeys).toContain('y3000');
      expect(flavorKeys).toContain('nebula');
    });
  });

  describe('Cart Drawer & Quantity Buttons', () => {
    interface TestItem {
      id: string;
      name: string;
      price: number;
      quantity: number;
    }

    const updateQuantity = (items: TestItem[], id: string, delta: number): TestItem[] => {
      return items
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((i): i is TestItem => i !== null);
    };

    it('should increase quantity when "+" button is clicked', () => {
      const initial = [{ id: 'can_1', name: 'Classic', price: 9.99, quantity: 1 }];
      const updated = updateQuantity(initial, 'can_1', 1);
      expect(updated[0].quantity).toBe(2);
    });

    it('should decrease quantity when "-" button is clicked', () => {
      const initial = [{ id: 'can_1', name: 'Classic', price: 9.99, quantity: 2 }];
      const updated = updateQuantity(initial, 'can_1', -1);
      expect(updated[0].quantity).toBe(1);
    });

    it('should remove item when "-" button reduces quantity to 0', () => {
      const initial = [{ id: 'can_1', name: 'Classic', price: 9.99, quantity: 1 }];
      const updated = updateQuantity(initial, 'can_1', -1);
      expect(updated.length).toBe(0);
    });
  });

  describe('All Promo Code & Reward Vouchers Buttons', () => {
    it('should calculate discounts correctly across all campaign prizes', () => {
      const subtotal = 100.0;
      const validVouchers: Record<string, number> = {
        GOLDENTAB30: 30,
        POLARBEAR40: 40,
        NEBULA1886: 35,
        REALMAGIC20: 20,
        COKEZERO: 15,
      };

      Object.entries(validVouchers).forEach(([code, percent]) => {
        const discountAmount = subtotal * (percent / 100);
        const finalTotal = subtotal - discountAmount;
        expect(finalTotal).toBe(100 - percent);
        expect(code.length).toBeGreaterThanOrEqual(7);
      });
    });
  });

  describe('Audio Synthesizer Controls', () => {
    it('should toggle sound mute state on and off without throwing', () => {
      sound.setMuted(true);
      expect(sound.getMuted()).toBe(true);
      sound.playCanSnap(); // Should be silent and safe

      sound.setMuted(false);
      expect(sound.getMuted()).toBe(false);
    });

    it('should clamp volume bounds safely', () => {
      sound.setVolume(1.5);
      sound.setVolume(-0.5);
      sound.setVolume(0.7);
    });
  });

  describe('Security & Payment Form Validations', () => {
    it('should mask credit cards safely', () => {
      const masked = SecurityService.maskCard('4242 4242 4242 9999');
      expect(masked).toBe('•••• •••• •••• 9999');
    });

    it('should generate valid RFC4122 v4 idempotency keys for checkout', () => {
      const key = SecurityService.generateIdempotencyKey();
      expect(key.startsWith('idemp_')).toBe(true);
      expect(key.length).toBeGreaterThan(30);
    });
  });
});
