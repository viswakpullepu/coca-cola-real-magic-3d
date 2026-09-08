import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { StudioDock, StudioTab } from './components/StudioDock';
import { HeroStage } from './components/HeroStage';
import { HappinessMachine } from './components/HappinessMachine';
import { CokeDjRemixDeck } from './components/CokeDjRemixDeck';
import { WipeTheFrostOverlay } from './components/WipeTheFrostOverlay';
import { RedHotlineSecretVault } from './components/RedHotlineSecretVault';
import { ShareACokeStudio } from './components/ShareACokeStudio';
import { AsmrSensoryChamber } from './components/AsmrSensoryChamber';
import { GoldenTabSweepstakes } from './components/GoldenTabSweepstakes';
import { AuraTasteQuiz } from './components/AuraTasteQuiz';
import { CreationsLab } from './components/CreationsLab';
import { HeritageTimeline } from './components/HeritageTimeline';
import { DropStore } from './components/DropStore';
import { SocialProofTicker } from './components/SocialProofTicker';
import { CartDrawer, CartItem } from './components/CartDrawer';
import { CheckoutModal } from './components/CheckoutModal';
import { InsidersClubModal } from './components/InsidersClubModal';
import { AccessibilityHUD } from './components/AccessibilityHUD';
import { ShopRedirectModal } from './components/ShopRedirectModal';
import { Footer } from './components/Footer';
import { sound } from './audio/SoundSynthesizer';
import { realtime } from './services/realtime';
import { UserSession } from './services/security';
import { getRetailerDestination, RetailerDestination } from './services/retailerService';

export const App: React.FC = () => {
  // Navigation & Pavilion State
  const [activeTab, setActiveTab] = useState<StudioTab>('stage');
  const [selectedFlavor, setSelectedFlavor] = useState('classic');

  // Sub-pavilion toggles for clean single-focus views
  const [happinessSubTab, setHappinessSubTab] = useState<'vending' | 'tab'>('vending');
  const [sonicSubTab, setSonicSubTab] = useState<'asmr' | 'dj'>('asmr');
  const [createSubTab, setCreateSubTab] = useState<'share' | 'lab'>('share');
  const [vaultSubTab, setVaultSubTab] = useState<'aura' | 'hotline'>('aura');

  // Cart & Order State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('coke_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Modals & Overlays
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isInsidersOpen, setIsInsidersOpen] = useState(false);
  const [isHudOpen, setIsHudOpen] = useState(false);
  const [checkoutDiscount, setCheckoutDiscount] = useState(0);
  const [redirectModalState, setRedirectModalState] = useState<{
    isOpen: boolean;
    destination: RetailerDestination | null;
    price: number;
    image: string;
  }>({
    isOpen: false,
    destination: null,
    price: 9.99,
    image: '',
  });

  // Creative Stunt States
  const [isFrostActive, setIsFrostActive] = useState(false);
  const [isDiscoActive, setIsDiscoActive] = useState(false);

  // User & Realtime
  const [userSession, setUserSession] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('coke_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [onlineCount, setOnlineCount] = useState(418);

  // Accessibility & Performance State
  const [fps, setFps] = useState(60);
  const [isMuted, setIsMuted] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isDyslexicFont, setIsDyslexicFont] = useState(false);

  // Persist Cart
  useEffect(() => {
    try {
      localStorage.setItem('coke_cart', JSON.stringify(cartItems));
    } catch {
      // Ignore
    }
  }, [cartItems]);

  // Persist Session
  useEffect(() => {
    try {
      if (userSession) {
        localStorage.setItem('coke_session', JSON.stringify(userSession));
      } else {
        localStorage.removeItem('coke_session');
      }
    } catch {
      // Ignore
    }
  }, [userSession]);

  // Accessibility Classes on Document Element
  useEffect(() => {
    const root = document.documentElement;
    if (isHighContrast) root.classList.add('high-contrast');
    else root.classList.remove('high-contrast');

    if (isReducedMotion) root.classList.add('reduced-motion');
    else root.classList.remove('reduced-motion');

    if (isDyslexicFont) root.classList.add('font-dyslexic');
    else root.classList.remove('font-dyslexic');
  }, [isHighContrast, isReducedMotion, isDyslexicFont]);

  // Poll online fans presence
  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineCount(realtime.getOnlineCount());
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  // Cart Handlers
  const handleAddToCart = (item: {
    id: string;
    name: string;
    price: number;
    image: string;
    storeUrl?: string;
    storeName?: string;
  }) => {
    const retailer = getRetailerDestination(item.id, item.name);
    const enrichedItem: CartItem = {
      ...item,
      quantity: 1,
      storeUrl: item.storeUrl || retailer.storeUrl,
      storeName: item.storeName || retailer.storeName,
    };

    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, enrichedItem];
    });

    // Open the official buying store redirect modal for this item
    setRedirectModalState({
      isOpen: true,
      destination: retailer,
      price: item.price,
      image: item.image,
    });
  };

  const handleUpdateQuantity = (id: string, delta: number) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((i): i is CartItem => i !== null)
    );
  };

  const handleRemoveItem = (id: string) => {
    setCartItems((prev) => prev.filter((i) => i.id !== id));
  };

  const handleOpenCheckout = (discountPercent: number) => {
    setCheckoutDiscount(discountPercent);
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleApplyPrizeCode = (_code: string, discount: number) => {
    setCheckoutDiscount(discount);
    setIsCartOpen(true);
  };

  const handleOrderSuccess = () => {
    setCartItems([]);
  };

  const handleToggleMute = () => {
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    sound.setMuted(newMuted);
  };

  const handleUnlockNebula = () => {
    setSelectedFlavor('nebula');
    setActiveTab('stage');
  };

  const handleActivateDisco = () => {
    setIsDiscoActive(true);
    sound.playGoldenFanfare();
    setTimeout(() => setIsDiscoActive(false), 8000);
  };

  return (
    <div className={`min-h-screen flex flex-col bg-[#070707] text-white transition-colors duration-1000 ${
      isDiscoActive ? 'animate-pulse-slow ring-8 ring-inset ring-[#EC4899]' : ''
    }`}>
      
      {/* Skip Navigation Link for Screen Readers (WCAG 2.2 AA) */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 z-50 px-4 py-2 bg-[#F40009] text-white font-bold rounded-lg shadow-lg"
      >
        Skip to main content
      </a>

      {/* Top Navigation */}
      <Navbar
        cartCount={cartItems.reduce((acc, i) => acc + i.quantity, 0)}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenInsiders={() => setIsInsidersOpen(true)}
        onOpenHud={() => setIsHudOpen(true)}
        onlineCount={onlineCount}
        userSession={userSession}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onSelectTab={setActiveTab}
      />

      {/* Fluid Liquid Scroll Progress Indicator */}
      <ScrollProgressBar />

      {/* Clean Segmented Studio Dock */}
      <StudioDock
        activeTab={activeTab}
        onSelectTab={setActiveTab}
      />

      {/* Main Experience Viewport */}
      <main id="studio-viewport" className="flex-1">
        
        {/* PAVILION 1: 3D CAN STAGE */}
        {activeTab === 'stage' && (
          <div className="animate-in fade-in duration-300">
            <HeroStage
              selectedFlavor={selectedFlavor}
              onSelectFlavor={setSelectedFlavor}
              onAddToCart={handleAddToCart}
              onFpsUpdate={setFps}
              onTriggerFrost={() => setIsFrostActive(true)}
              onNavigateTab={setActiveTab}
            />
          </div>
        )}

        {/* PAVILION 2: HAPPINESS & PROMOTIONAL STUNTS */}
        {activeTab === 'happiness' && (
          <div className="py-12 animate-in fade-in duration-300">
            {/* Sub-tab switcher */}
            <div className="max-w-md mx-auto mb-8 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex gap-1">
              <button
                onClick={() => {
                  sound.playTactileClick();
                  setHappinessSubTab('vending');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  happinessSubTab === 'vending'
                    ? 'bg-[#F40009] text-white shadow-glow-red'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Happiness Machine 2.0
              </button>
              <button
                onClick={() => {
                  sound.playTactileClick();
                  setHappinessSubTab('tab');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  happinessSubTab === 'tab'
                    ? 'bg-[#F59E0B] text-black shadow-glow-gold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Under the Cap Golden Tab
              </button>
            </div>

            {happinessSubTab === 'vending' ? (
              <HappinessMachine
                onApplyPrizeCode={handleApplyPrizeCode}
                onActivateDisco={handleActivateDisco}
              />
            ) : (
              <GoldenTabSweepstakes onApplyPrizeCode={handleApplyPrizeCode} />
            )}
          </div>
        )}

        {/* PAVILION 3: SONIC STUDIO */}
        {activeTab === 'sonic' && (
          <div className="py-12 animate-in fade-in duration-300">
            {/* Sub-tab switcher */}
            <div className="max-w-md mx-auto mb-8 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex gap-1">
              <button
                onClick={() => {
                  sound.playTactileClick();
                  setSonicSubTab('asmr');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  sonicSubTab === 'asmr'
                    ? 'bg-white text-black shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                5-Step ASMR Pour
              </button>
              <button
                onClick={() => {
                  sound.playTactileClick();
                  setSonicSubTab('dj');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  sonicSubTab === 'dj'
                    ? 'bg-[#EC4899] text-white shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Bottle-Cap DJ Remix Deck
              </button>
            </div>

            {sonicSubTab === 'asmr' ? (
              <AsmrSensoryChamber />
            ) : (
              <CokeDjRemixDeck />
            )}
          </div>
        )}

        {/* PAVILION 4: CREATION & GIFTING */}
        {activeTab === 'create' && (
          <div className="py-12 animate-in fade-in duration-300">
            {/* Sub-tab switcher */}
            <div className="max-w-md mx-auto mb-8 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex gap-1">
              <button
                onClick={() => {
                  sound.playTactileClick();
                  setCreateSubTab('share');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  createSubTab === 'share'
                    ? 'bg-[#F40009] text-white shadow-glow-red'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Share a Coke 3D Studio
              </button>
              <button
                onClick={() => {
                  sound.playTactileClick();
                  setCreateSubTab('lab');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  createSubTab === 'lab'
                    ? 'bg-[#00F5D4] text-black shadow-glow-cyan'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Creations Mixology Lab
              </button>
            </div>

            {createSubTab === 'share' ? (
              <ShareACokeStudio onAddToCart={handleAddToCart} />
            ) : (
              <CreationsLab onAddToCart={handleAddToCart} />
            )}
          </div>
        )}

        {/* PAVILION 5: DISCOVERY & VAULT */}
        {activeTab === 'vault' && (
          <div className="py-12 animate-in fade-in duration-300">
            {/* Sub-tab switcher */}
            <div className="max-w-md mx-auto mb-8 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex gap-1">
              <button
                onClick={() => {
                  sound.playTactileClick();
                  setVaultSubTab('aura');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  vaultSubTab === 'aura'
                    ? 'bg-[#00F5D4] text-black shadow-glow-cyan'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                What’s Your Coke Aura?
              </button>
              <button
                onClick={() => {
                  sound.playTactileClick();
                  setVaultSubTab('hotline');
                }}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                  vaultSubTab === 'hotline'
                    ? 'bg-[#A855F7] text-white shadow'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Red Magic Hotline Vault
              </button>
            </div>

            {vaultSubTab === 'aura' ? (
              <AuraTasteQuiz
                onSelectFlavor={(f) => {
                  setSelectedFlavor(f);
                  setActiveTab('stage');
                }}
                onAddToCart={handleAddToCart}
              />
            ) : (
              <RedHotlineSecretVault
                onUnlockNebula={handleUnlockNebula}
                onApplyPrizeCode={handleApplyPrizeCode}
              />
            )}
          </div>
        )}

        {/* PAVILION 6: VAULT DROPS & HERITAGE */}
        {activeTab === 'drops' && (
          <div className="animate-in fade-in duration-300">
            <DropStore onAddToCart={handleAddToCart} />
            <HeritageTimeline />
          </div>
        )}

      </main>

      {/* Real-Time Live Social Proof Ticker */}
      <SocialProofTicker />

      {/* Wipe The Frost Condensation Screen Overlay */}
      <WipeTheFrostOverlay
        isActive={isFrostActive}
        onClose={() => setIsFrostActive(false)}
      />

      {/* Comprehensive Brand Footer & AEO Knowledge Hub */}
      <Footer onSelectTab={setActiveTab} />

      {/* Modals & Drawers */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onOpenCheckout={handleOpenCheckout}
      />

      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        discountPercent={checkoutDiscount}
        onOrderSuccess={handleOrderSuccess}
      />

      <InsidersClubModal
        isOpen={isInsidersOpen}
        onClose={() => setIsInsidersOpen(false)}
        session={userSession}
        onLogin={(s) => {
          setUserSession(s);
          setIsInsidersOpen(false);
        }}
        onLogout={() => setUserSession(null)}
      />

      <AccessibilityHUD
        isOpen={isHudOpen}
        onClose={() => setIsHudOpen(false)}
        fps={fps}
        isHighContrast={isHighContrast}
        onToggleHighContrast={() => setIsHighContrast(!isHighContrast)}
        isReducedMotion={isReducedMotion}
        onToggleReducedMotion={() => setIsReducedMotion(!isReducedMotion)}
        isDyslexicFont={isDyslexicFont}
        onToggleDyslexicFont={() => setIsDyslexicFont(!isDyslexicFont)}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Shop Now Official Buying Store Redirect Modal */}
      <ShopRedirectModal
        isOpen={redirectModalState.isOpen}
        onClose={() => setRedirectModalState((prev) => ({ ...prev, isOpen: false }))}
        destination={redirectModalState.destination}
        productPrice={redirectModalState.price}
        productImage={redirectModalState.image}
        onOpenCart={() => setIsCartOpen(true)}
      />

    </div>
  );
};

export default App;
