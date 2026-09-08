import { describe, it, expect } from 'vitest';
import {
  getRetailerDestination,
  OFFICIAL_RETAILER_MAPPINGS,
} from '../src/services/retailerService';

describe('Official Retailer Mapping & Shop Now Redirect Service', () => {
  it('correctly maps 3D Stage core cans to official Coca-Cola buying URLs', () => {
    const classicDest = getRetailerDestination('can_classic_4pack');
    expect(classicDest.storeUrl).toBe('https://www.coca-cola.com/us/en/brands/coca-cola');
    expect(classicDest.storeName).toBe('Coca-Cola Official Store');
    expect(classicDest.badge).toBe('Official Brand Store');

    const zeroDest = getRetailerDestination('can_zero_4pack');
    expect(zeroDest.storeUrl).toBe('https://www.coca-cola.com/us/en/brands/coca-cola-zero-sugar');

    const cherryDest = getRetailerDestination('can_cherry_4pack');
    expect(cherryDest.storeUrl).toBe('https://www.coca-cola.com/us/en/brands/coca-cola-cherry');

    const vanillaDest = getRetailerDestination('can_vanilla_4pack');
    expect(vanillaDest.storeUrl).toBe('https://www.coca-cola.com/us/en/brands/coca-cola-vanilla');

    const y3000Dest = getRetailerDestination('can_y3000_4pack');
    expect(y3000Dest.storeUrl).toBe('https://www.coca-cola.com/us/en/offerings/creations');

    const nebulaDest = getRetailerDestination('can_nebula_4pack');
    expect(nebulaDest.storeUrl).toBe('https://www.coca-cola.com/us/en/offerings/creations');
  });

  it('correctly maps Vault Drop collector items to authentic Merch Store URLs', () => {
    const vaultTin = getRetailerDestination('drop_y3000_box');
    expect(vaultTin.storeUrl).toBe('https://www.coca-colastore.com/collectibles');
    expect(vaultTin.storeName).toContain('Coca-Cola Store Collectibles');

    const glassBottle = getRetailerDestination('drop_1915_glass');
    expect(glassBottle.storeUrl).toBe('https://www.coca-colastore.com/drinkware');

    const headphones = getRetailerDestination('drop_coke_studio_audio');
    expect(headphones.storeUrl).toBe('https://www.coca-colastore.com/accessories');

    const hoodie = getRetailerDestination('drop_vintage_hoodie');
    expect(hoodie.storeUrl).toBe('https://www.coca-colastore.com/apparel');
  });

  it('routes Share a Coke custom items to the official customizer portal', () => {
    const customCan = getRetailerDestination('share_coke_alex_12345', 'Share a Coke with Alex');
    expect(customCan.storeUrl).toBe('https://www.coca-cola.com/us/en/offerings/share-a-coke');
    expect(customCan.storeName).toBe('Official Share a Coke Store');
  });

  it('provides safe fallback for unknown items', () => {
    const unknownItem = getRetailerDestination('custom_item_999', 'Mystery Soda');
    expect(unknownItem.storeUrl).toBe('https://www.coca-colastore.com/');
    expect(unknownItem.storeName).toBe('The Coca-Cola Company Store');
  });

  it('enforces verified retailer badges across all registered SKUs', () => {
    Object.values(OFFICIAL_RETAILER_MAPPINGS).forEach((destination) => {
      expect(destination.storeUrl).toMatch(/^https:\/\/(www\.)?(coca-cola\.com|coca-colastore\.com)/);
      expect(destination.badge.length).toBeGreaterThan(0);
      expect(destination.storeName.length).toBeGreaterThan(0);
    });
  });
});
