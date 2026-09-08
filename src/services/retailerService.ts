/**
 * Retailer Service: Directs users to verified, authentic buying stores
 * for Coca-Cola official products, limited drops, and regional retailers.
 */

export interface RetailerDestination {
  id: string;
  name: string;
  storeName: string;
  storeUrl: string;
  badge: string;
  description: string;
}

export const OFFICIAL_RETAILER_MAPPINGS: Record<string, RetailerDestination> = {
  // 3D Stage Core Cans
  can_classic_4pack: {
    id: 'can_classic_4pack',
    name: 'Coca-Cola Original Taste (4-Pack Sleek Cans)',
    storeName: 'Coca-Cola Official Store',
    storeUrl: 'https://www.coca-cola.com/us/en/brands/coca-cola',
    badge: 'Official Brand Store',
    description: 'Purchase authentic Coca-Cola Original Taste directly from the Coca-Cola Company retailer network.',
  },
  can_zero_4pack: {
    id: 'can_zero_4pack',
    name: 'Coca-Cola Zero Sugar (4-Pack Sleek Cans)',
    storeName: 'Coca-Cola Official Store',
    storeUrl: 'https://www.coca-cola.com/us/en/brands/coca-cola-zero-sugar',
    badge: 'Official Brand Store',
    description: 'Order crisp Zero Sugar authentic packs directly from the official brand catalog.',
  },
  can_cherry_4pack: {
    id: 'can_cherry_4pack',
    name: 'Coca-Cola Cherry Ruby (4-Pack Sleek Cans)',
    storeName: 'Coca-Cola Official Store',
    storeUrl: 'https://www.coca-cola.com/us/en/brands/coca-cola-cherry',
    badge: 'Official Brand Store',
    description: 'Buy fresh Coca-Cola Cherry packs directly through verified retail partners.',
  },
  can_vanilla_4pack: {
    id: 'can_vanilla_4pack',
    name: 'Coca-Cola Vanilla Cream (4-Pack Sleek Cans)',
    storeName: 'Coca-Cola Official Store',
    storeUrl: 'https://www.coca-cola.com/us/en/brands/coca-cola-vanilla',
    badge: 'Official Brand Store',
    description: 'Order authentic Coca-Cola Vanilla directly from authorized brand grocers and stores.',
  },
  can_y3000_4pack: {
    id: 'can_y3000_4pack',
    name: 'Coca-Cola Y3000 AI Co-Created (4-Pack Sleek Cans)',
    storeName: 'Coca-Cola Creations Hub',
    storeUrl: 'https://www.coca-cola.com/us/en/offerings/creations',
    badge: 'Creations Official Hub',
    description: 'Acquire limited-edition Y3000 AI series directly via Coca-Cola Creations.',
  },
  can_nebula_4pack: {
    id: 'can_nebula_4pack',
    name: 'Coca-Cola Cosmic Nebula (4-Pack Sleek Cans)',
    storeName: 'Coca-Cola Creations Secret Drop',
    storeUrl: 'https://www.coca-cola.com/us/en/offerings/creations',
    badge: 'Secret Vault Drop',
    description: 'Access exclusive small-batch drops directly through the official Creations portal.',
  },

  // Drop Store Collector Vault Items
  drop_y3000_box: {
    id: 'drop_y3000_box',
    name: 'Y3000 Cyber Collector Vault',
    storeName: 'Coca-Cola Store Collectibles',
    storeUrl: 'https://www.coca-colastore.com/collectibles',
    badge: 'Official Merch Store',
    description: 'Acquire official limited-edition collector tins from the Atlanta Flagship Store catalog.',
  },
  drop_1915_glass: {
    id: 'drop_1915_glass',
    name: '1915 Georgia Green Glass 4-Pack',
    storeName: 'Coca-Cola Store Heritage Drinkware',
    storeUrl: 'https://www.coca-colastore.com/drinkware',
    badge: 'Official Merch Store',
    description: 'Buy genuine patent contour glass bottles directly from the official store.',
  },
  drop_coke_studio_audio: {
    id: 'drop_coke_studio_audio',
    name: 'Coke Studio Wireless Audio Gear',
    storeName: 'Coca-Cola Store Lifestyle & Tech',
    storeUrl: 'https://www.coca-colastore.com/accessories',
    badge: 'Official Merch Store',
    description: 'Official licensed Coke Studio audio accessories and high-fidelity merchandise.',
  },
  drop_vintage_hoodie: {
    id: 'drop_vintage_hoodie',
    name: 'Spencerian Script 450GSM Hoodie',
    storeName: 'Coca-Cola Store Apparel',
    storeUrl: 'https://www.coca-colastore.com/apparel',
    badge: 'Official Merch Store',
    description: 'Official licensed Spencerian Script apparel direct from the Coca-Cola Store.',
  },
};

/**
 * Returns the verified official buying store link and metadata for any product SKU.
 */
export function getRetailerDestination(itemId: string, itemName?: string): RetailerDestination {
  if (OFFICIAL_RETAILER_MAPPINGS[itemId]) {
    return OFFICIAL_RETAILER_MAPPINGS[itemId];
  }

  // Handle Share a Coke custom cans
  if (itemId.startsWith('share_coke_')) {
    return {
      id: itemId,
      name: itemName || 'Share a Coke Personalized Can',
      storeName: 'Official Share a Coke Store',
      storeUrl: 'https://www.coca-cola.com/us/en/offerings/share-a-coke',
      badge: 'Customizer Portal',
      description: 'Order customized named Coca-Cola bottles and cans through the official Share a Coke studio.',
    };
  }

  // Handle Creations Lab custom formulas
  if (itemId.startsWith('creation_')) {
    return {
      id: itemId,
      name: itemName || 'Creations Lab Custom Small-Batch',
      storeName: 'Coca-Cola Creations Experience',
      storeUrl: 'https://www.coca-cola.com/us/en/offerings/creations',
      badge: 'Creations Portal',
      description: 'Explore limited series and co-created flavors at Coca-Cola Creations.',
    };
  }

  // Fallback to official Coca-Cola Store
  return {
    id: itemId,
    name: itemName || 'Coca-Cola Product',
    storeName: 'The Coca-Cola Company Store',
    storeUrl: 'https://www.coca-colastore.com/',
    badge: 'Verified Retailer',
    description: 'Authentic Coca-Cola beverages, gear, and merchandise at the official store.',
  };
}

/**
 * Opens the authentic buying store in a secure new tab.
 */
export function redirectToOfficialStore(url: string): void {
  if (typeof window !== 'undefined') {
    window.open(url, '_blank', 'noopener,noreferrer');
  }
}
