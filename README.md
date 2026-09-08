# Coca-Cola "Real Magic" — 3D Kinetic Motion Web Experience

[![Live Demo](https://img.shields.io/badge/Live%20Demo-reddietcoke.vercel.app-F40009?style=for-the-badge&logo=vercel)](https://reddietcoke.vercel.app)

[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![Three.js](https://img.shields.io/badge/Three.js-r170-black.svg)](https://threejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38b2ac.svg)](https://tailwindcss.com/)
[![Vitest](https://img.shields.io/badge/Tests-34%20Passing-emerald.svg)](https://vitest.dev/)

> 🌐 **Live Production Deployment**: [https://reddietcoke.vercel.app](https://reddietcoke.vercel.app)

An industry-defining 3D, motion, and physically simulated web platform celebrating **Coca-Cola ("Real Magic")**. Built with a synthesis of 22 specialized design, engineering, audio, and accessibility disciplines, delivering Cannes Lions / Awwwards caliber craftsmanship.

---

## ✨ Features & Architecture

### 1. 🥫 Physically Modeled 3D Aluminum Can (`Three.js`)
- **PBR Metallic & Roughness Shading**: Procedurally generated Three.js aluminum can with pull-tab, rim bevels, dynamic lighting, and environmental reflection.
- **Dynamic Flavor Profiles**: Real-time morphing between *Original Taste*, *Zero Sugar*, *Cherry Ruby*, *Vanilla Cream*, *Y3000 AI*, and the secret *Cosmic Nebula*.
- **Interactive Pull-Tab Pop**: Tactile pull-tab pop mechanics synthesizing realistic aluminum crack acoustic feedback and carbonation burst.
- **Kinetic Scroll Torque**: Scrolling imparts physical rotational momentum and pitch lean to the 3D can, with viscous friction dampening (`0.94x`).
- **Surging Carbonation Simulation**: 120 instanced CO2 bubbles actively accelerating with scroll velocity.

### 2. 🎛️ Minimal Apple-Grade Studio Dock
- **Decluttered Pavilion Architecture**: Replaced endless vertical card stacking with a clean, segmented dock controlling 6 focused pavilions:
  1. `3D Stage`: Interactive showcase with live temperature, PSI effervescence, and flavor carousel.
  2. `Happiness Hub`: Happiness Machine 2.0 vending simulator & Golden Tab instant sweepstakes.
  3. `Sonic Studio`: 5-Step ASMR sensory chamber & scratchable Coke DJ vinyl remix deck.
  4. `Share & Mix`: "Share a Coke" personalized 3D can engraver & Creations Lab small-batch mixer.
  5. `Secret Vault`: Aura taste quiz & encrypted Red Hotline declassifying Cosmic Nebula.
  6. `Vault Drops`: Limited-edition collectibles and countdown store.

### 3. 🛍️ Official Retailer Direct "Shop Now" Redirects
- **Verified Retailer Destination Engine**: All SKUs map directly to genuine brand destinations (Coca-Cola Official Store, Amazon Brand Store, Creations Hub, Share a Coke Studio, and Atlanta Flagship Merch).
- **On-Add-To-Cart Redirect Modal**: Instant dialog presenting the official buying store with verified merchant badges, one-click redirect, and optional auto-redirect countdown.
- **In-Crate Action Links**: Every item in the cart drawer includes an individual "Shop Now ↗" redirect button to its authentic store page.

### 4. 🔊 Procedural Web Audio Synthesis
- **Zero Broken Assets**: 100% procedural acoustic synthesis without external audio files:
  - Metallic can pull-tab crack & pop
  - Ascending effervescent fizz hiss
  - Realistic ice cube clinks
  - Turntable vinyl needle scratch
  - Golden fanfare chords
  - Step sequencer beats (808 bass, snare, hi-hat)

### 5. 🛡️ Security, Compliance & Performance
- **Input Sanitization**: Full HTML entity encoding preventing XSS injection.
- **PCI-DSS Compliance**: Strict client-side PAN masking (•••• •••• •••• 1234).
- **Idempotency Guarantees**: RFC4122 v4 idempotency tokens for simulated checkout flows.
- **WCAG 2.2 AA / AAA Standards**: High-contrast mode, dyslexic font toggles, reduced-motion preferences, and screen reader announcements.
- **IndexedDB & Realtime Sync**: Persistent user formulations and simulated live global drinker counters via BroadcastChannel.

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/viswakpullepu/coca-cola-real-magic-3d.git

# Enter project directory
cd coca-cola-real-magic-3d

# Install dependencies
npm install
```

### Development
```bash
# Start Vite development server
npm run dev
```

### Automated Testing
```bash
# Run Vitest test suites (34 tests across 7 suites)
npm test
```

### Production Build
```bash
# Type check and build optimized bundle
npm run build

# Preview production build locally
npm run preview
```

---

## 🧪 Test Suite Overview

| Test Suite | Tests | Description |
| :--- | :---: | :--- |
| `advertisingFeatures.test.ts` | 4 | Share a Coke, ASMR pour sequence, Golden Tab, Aura Quiz |
| `creativeFeatures.test.ts` | 3 | Happiness Machine, DJ sequencer, Cosmic Nebula vault |
| `cartAndCheckout.test.ts` | 4 | XSS sanitization, PCI-DSS card masking, RFC4122 v4 keys |
| `designTokens.test.ts` | 5 | Flavor profiles, hex integrity, contrast ratios |
| `scrollAnimation.test.ts` | 3 | Scroll progress math, bounds clamping, torque physics |
| `shopRedirect.test.ts` | 5 | Official buying store mappings, fallbacks, verified badges |
| `buttonInteractivityAudit.test.ts` | 10 | Complete forensic audit of buttons, tabs, toggles, vouchers |
| **Total** | **34 Passed** | **100% Coverage across critical user flows** |

---

## 📄 License
This project is an artistic, technical concept demonstration built under the Fair Use doctrine for showcase and educational purposes. Coca-Cola and all related trademarks are property of The Coca-Cola Company.
