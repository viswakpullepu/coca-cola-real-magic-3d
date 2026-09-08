import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { FLAVOR_PROFILES, FlavorProfile } from '../tokens/designSystem';
import { sound } from '../audio/SoundSynthesizer';

interface CokeCanSceneProps {
  flavorKey: string;
  customLabel?: string;
  customInfusion?: string;
  isInteractive?: boolean;
  onFpsUpdate?: (fps: number) => void;
  onCanPopped?: () => void;
}

export const CokeCanScene: React.FC<CokeCanSceneProps> = ({
  flavorKey,
  customLabel,
  customInfusion,
  isInteractive = true,
  onFpsUpdate,
  onCanPopped,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isPopped, setIsPopped] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const canGroupRef = useRef<THREE.Group | null>(null);
  const bodyMaterialRef = useRef<THREE.MeshStandardMaterial | null>(null);
  const pullTabRef = useRef<THREE.Mesh | null>(null);
  const textureRef = useRef<THREE.CanvasTexture | null>(null);
  const animFrameId = useRef<number | null>(null);

  // Drag physics state
  const mouseState = useRef({
    prevX: 0,
    prevY: 0,
    velX: 0.008, // Initial gentle idle spin
    velY: 0,
    targetVelX: 0.008,
    isDown: false,
  });

  // FPS tracking
  const fpsTracker = useRef({
    frames: 0,
    lastTime: performance.now(),
  });

  // Generates high-res label texture for can body
  const generateCanTexture = useCallback(
    (profile: FlavorProfile, labelText?: string, infusionText?: string): THREE.CanvasTexture => {
      const canvas = document.createElement('canvas');
      canvas.width = 2048;
      canvas.height = 1024;
      const ctx = canvas.getContext('2d');
      if (!ctx) return new THREE.CanvasTexture(canvas);

      const w = canvas.width;
      const h = canvas.height;

      // 1. Base Gradient / Color Fill
      if (profile.id === 'nebula') {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#0F051D');
        grad.addColorStop(0.3, '#4C1D95');
        grad.addColorStop(0.6, '#EC4899');
        grad.addColorStop(0.85, '#06B6D4');
        grad.addColorStop(1, '#0F051D');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);

        // Cosmic stars
        ctx.save();
        for (let s = 0; s < 120; s++) {
          ctx.fillStyle = Math.random() > 0.5 ? '#FFFFFF' : '#00F5D4';
          ctx.beginPath();
          ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 2.5 + 0.8, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      } else if (profile.id === 'zero') {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#0a0a0a');
        grad.addColorStop(0.5, '#1e1e1e');
        grad.addColorStop(1, '#080808');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, w, h);
      } else if (profile.id === 'y3000') {
        const grad = ctx.createLinearGradient(0, 0, w, h);
        grad.addColorStop(0, '#7B2CBF');
        grad.addColorStop(0.35, '#00F5D4');
        grad.addColorStop(0.7, '#FF0055');
        grad.addColorStop(1, '#7B2CBF');
        ctx.fillStyle = grad;
      } else if (profile.id === 'vanilla') {
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, '#B45309');
        grad.addColorStop(0.5, '#F59E0B');
        grad.addColorStop(1, '#92400E');
        ctx.fillStyle = grad;
      } else if (profile.id === 'cherry') {
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, '#7A0005');
        grad.addColorStop(0.5, '#D90429');
        grad.addColorStop(1, '#500003');
        ctx.fillStyle = grad;
      } else {
        // Classic Georgia Red
        const grad = ctx.createLinearGradient(0, 0, w, 0);
        grad.addColorStop(0, '#B80006');
        grad.addColorStop(0.5, '#F40009');
        grad.addColorStop(1, '#960005');
        ctx.fillStyle = grad;
      }
      ctx.fillRect(0, 0, w, h);

      // 2. Metallic Specular Stripes / Foil Sheen
      ctx.save();
      ctx.globalAlpha = 0.08;
      for (let i = 0; i < w; i += 60) {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(i, 0, 18, h);
      }
      ctx.restore();

      // 3. Iconic Dynamic Ribbon Device (The Wave)
      ctx.save();
      ctx.lineWidth = 26;
      ctx.strokeStyle = profile.id === 'zero' ? '#F40009' : '#FFFFFF';
      ctx.beginPath();
      ctx.moveTo(0, h * 0.72);
      ctx.bezierCurveTo(w * 0.25, h * 0.45, w * 0.5, h * 0.9, w * 0.75, h * 0.65);
      ctx.bezierCurveTo(w * 0.88, h * 0.55, w * 0.95, h * 0.7, w, h * 0.72);
      ctx.stroke();

      // Secondary subtle ribbon
      ctx.lineWidth = 8;
      ctx.globalAlpha = 0.5;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.78);
      ctx.bezierCurveTo(w * 0.25, h * 0.52, w * 0.5, h * 0.96, w * 0.75, h * 0.72);
      ctx.bezierCurveTo(w * 0.88, h * 0.62, w * 0.95, h * 0.76, w, h * 0.78);
      ctx.stroke();
      ctx.restore();

      // Helper function to draw the main face label
      const drawFace = (centerX: number) => {
        ctx.save();
        ctx.translate(centerX, h * 0.45);

        // A. Primary Spencerian / Display Logo
        ctx.fillStyle = '#FFFFFF';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        // Shadow for depth
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 15;
        ctx.shadowOffsetX = 3;
        ctx.shadowOffsetY = 4;

        ctx.font = 'bold italic 138px "Playfair Display", Georgia, serif';
        const displayBrand = labelText ? labelText.toUpperCase() : 'Coca-Cola';
        ctx.fillText(displayBrand, 0, -50);

        ctx.shadowColor = 'transparent';

        // B. Secondary Flavor Subtitle
        ctx.font = '700 48px "Outfit", "Plus Jakarta Sans", sans-serif';
        ctx.letterSpacing = '6px';
        const subTitle = infusionText
          ? infusionText.toUpperCase()
          : profile.id === 'zero'
          ? 'ZERO SUGAR'
          : profile.id === 'classic'
          ? 'ORIGINAL TASTE'
          : profile.name.replace('Coca-Cola ', '').toUpperCase();

        if (profile.id === 'zero') {
          ctx.fillStyle = '#FFFFFF';
        } else if (profile.id === 'y3000') {
          ctx.fillStyle = '#00F5D4';
        } else {
          ctx.fillStyle = profile.secondaryColor;
        }
        ctx.fillText(subTitle, 0, 45);

        // C. Badge & Volume stamp
        ctx.font = '500 30px "Plus Jakarta Sans", sans-serif';
        ctx.letterSpacing = '3px';
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.fillText('330 mL  •  SERVE ICE COLD  •  EST. 1886', 0, 110);

        ctx.restore();
      };

      // Draw on front (center) and back
      drawFace(w * 0.32);
      drawFace(w * 0.82);

      // 4. Barcode, Recycling Icon, & Nutrition Block
      ctx.save();
      ctx.translate(w * 0.58, h * 0.35);
      // Nutrition box outline
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 3;
      ctx.strokeRect(-120, -100, 240, 260);

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 24px monospace';
      ctx.textAlign = 'left';
      ctx.fillText('NUTRITION FACTS', -105, -70);
      ctx.font = '400 18px monospace';
      ctx.fillText(`Calories: ${profile.calories}`, -105, -35);
      ctx.fillText('Total Fat: 0g', -105, -10);
      ctx.fillText('Sodium: 45mg', -105, 15);
      ctx.fillText(`Carbonation: ${profile.effervescenceRating}/5`, -105, 40);
      ctx.fillText('Recycle Can 100%', -105, 75);
      ctx.fillText('Real Magic™ ©2026', -105, 110);

      // Barcode bars
      ctx.fillStyle = '#FFFFFF';
      for (let b = -105; b < 105; b += 7) {
        const barWidth = Math.random() > 0.4 ? 4 : 2;
        ctx.fillRect(b, 125, barWidth, 40);
      }
      ctx.restore();

      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.ClampToEdgeWrapping;
      texture.needsUpdate = true;
      return texture;
    },
    []
  );

  // Creates procedural bump map for condensation droplets
  const generateCondensationBumpMap = (): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#808080'; // Neutral bump
      ctx.fillRect(0, 0, 512, 512);

      // Draw cold condensation droplets
      for (let i = 0; i < 350; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const radius = Math.random() * 3 + 1;

        const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.7, '#CCCCCC');
        grad.addColorStop(1, '#808080');
        ctx.fillStyle = grad;

        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const bumpTex = new THREE.CanvasTexture(canvas);
    bumpTex.wrapS = THREE.RepeatWrapping;
    bumpTex.wrapT = THREE.RepeatWrapping;
    bumpTex.repeat.set(3, 3);
    bumpTex.needsUpdate = true;
    return bumpTex;
  };

  // Setup Three.js Scene, Can Geometry, Lights, & Render Loop
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 500;
    const height = container.clientHeight || 550;

    // 1. Scene & Camera
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0.2, 5.8);

    // 2. Renderer
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 3. Lighting Setup for Ultra-Crisp Aluminum Reflections
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambientLight);

    // Key Light (warm studio spotlight)
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.2);
    keyLight.position.set(4, 5, 4);
    scene.add(keyLight);

    // Fill Light (soft cool reflection)
    const fillLight = new THREE.DirectionalLight(0xddeeff, 1.4);
    fillLight.position.set(-4, 2, 2);
    scene.add(fillLight);

    // Rim / Backlight for aluminum contour edge glint
    const rimLight = new THREE.DirectionalLight(0xffffff, 3.0);
    rimLight.position.set(0, -3, -4);
    scene.add(rimLight);

    // 4. Construct Can 3D Model Hierarchy
    const canGroup = new THREE.Group();
    canGroupRef.current = canGroup;
    scene.add(canGroup);

    // Metallic Aluminum Material for rim, lid, pull-tab, and bottom
    const aluminumMaterial = new THREE.MeshStandardMaterial({
      color: 0xd8d8d8,
      metalness: 0.94,
      roughness: 0.18,
    });

    const bumpMap = generateCondensationBumpMap();

    // Can Body Material (uses dynamic canvas label)
    const currentProfile = FLAVOR_PROFILES[flavorKey] || FLAVOR_PROFILES.classic;
    const canvasTexture = generateCanTexture(currentProfile, customLabel, customInfusion);
    textureRef.current = canvasTexture;

    const bodyMaterial = new THREE.MeshStandardMaterial({
      map: canvasTexture,
      metalness: currentProfile.canMetalness,
      roughness: currentProfile.canRoughness,
      bumpMap: bumpMap,
      bumpScale: 0.035,
    });
    bodyMaterialRef.current = bodyMaterial;

    // Geometry Dimensions (Accurate 330ml sleek can ratio)
    const canRadius = 0.95;
    const canHeight = 2.7;

    // Main Cylindrical Body
    const bodyGeometry = new THREE.CylinderGeometry(canRadius, canRadius, canHeight, 64, 1, true);
    const bodyMesh = new THREE.Mesh(bodyGeometry, bodyMaterial);
    canGroup.add(bodyMesh);

    // Upper Taper / Beveled Neck
    const neckHeight = 0.28;
    const neckRadiusTop = 0.84;
    const neckGeometry = new THREE.CylinderGeometry(neckRadiusTop, canRadius, neckHeight, 64);
    const neckMesh = new THREE.Mesh(neckGeometry, aluminumMaterial);
    neckMesh.position.y = canHeight / 2 + neckHeight / 2;
    canGroup.add(neckMesh);

    // Top Rim Lip (Torus)
    const rimGeometry = new THREE.TorusGeometry(neckRadiusTop, 0.045, 16, 64);
    rimGeometry.rotateX(Math.PI / 2);
    const rimMesh = new THREE.Mesh(rimGeometry, aluminumMaterial);
    rimMesh.position.y = canHeight / 2 + neckHeight;
    canGroup.add(rimMesh);

    // Can Lid Disc
    const lidGeometry = new THREE.CylinderGeometry(neckRadiusTop - 0.02, neckRadiusTop - 0.02, 0.03, 64);
    const lidMesh = new THREE.Mesh(lidGeometry, aluminumMaterial);
    lidMesh.position.y = canHeight / 2 + neckHeight - 0.01;
    canGroup.add(lidMesh);

    // Can Pull Tab
    const tabShape = new THREE.Shape();
    tabShape.moveTo(-0.16, -0.32);
    tabShape.lineTo(0.16, -0.32);
    tabShape.lineTo(0.12, 0.22);
    tabShape.lineTo(-0.12, 0.22);
    tabShape.closePath();

    // Hole in tab
    const tabHole = new THREE.Path();
    tabHole.moveTo(-0.06, -0.15);
    tabHole.lineTo(0.06, -0.15);
    tabHole.lineTo(0.05, 0.1);
    tabHole.lineTo(-0.05, 0.1);
    tabHole.closePath();
    tabShape.holes.push(tabHole);

    const tabExtrudeSettings = { depth: 0.02, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.01, bevelThickness: 0.01 };
    const tabGeometry = new THREE.ExtrudeGeometry(tabShape, tabExtrudeSettings);
    tabGeometry.rotateX(-Math.PI / 2);
    const pullTabMesh = new THREE.Mesh(tabGeometry, aluminumMaterial);
    pullTabMesh.position.set(0, canHeight / 2 + neckHeight + 0.02, 0.15);
    pullTabRef.current = pullTabMesh;
    canGroup.add(pullTabMesh);

    // Bottom Concave Dome / Base Rim
    const baseTaperHeight = 0.22;
    const baseRadiusBottom = 0.82;
    const baseGeometry = new THREE.CylinderGeometry(canRadius, baseRadiusBottom, baseTaperHeight, 64);
    const baseMesh = new THREE.Mesh(baseGeometry, aluminumMaterial);
    baseMesh.position.y = -canHeight / 2 - baseTaperHeight / 2;
    canGroup.add(baseMesh);

    // Bottom Rim Lip
    const bottomRimGeo = new THREE.TorusGeometry(baseRadiusBottom, 0.035, 16, 64);
    bottomRimGeo.rotateX(Math.PI / 2);
    const bottomRimMesh = new THREE.Mesh(bottomRimGeo, aluminumMaterial);
    bottomRimMesh.position.y = -canHeight / 2 - baseTaperHeight;
    canGroup.add(bottomRimMesh);

    // Initial orientation: slight angle to show 3D volume
    canGroup.rotation.x = 0.18;
    canGroup.rotation.y = -0.5;

    // 5. Render Loop with Inertia Physics & FPS counter
    const renderLoop = (time: number) => {
      // Calculate FPS
      fpsTracker.current.frames++;
      if (time - fpsTracker.current.lastTime >= 1000) {
        if (onFpsUpdate) {
          onFpsUpdate(Math.round((fpsTracker.current.frames * 1000) / (time - fpsTracker.current.lastTime)));
        }
        fpsTracker.current.frames = 0;
        fpsTracker.current.lastTime = time;
      }

      if (canGroupRef.current) {
        // Apply inertia dampening
        if (!mouseState.current.isDown) {
          // Slowly lerp towards idle spin
          mouseState.current.velX += (mouseState.current.targetVelX - mouseState.current.velX) * 0.03;
          mouseState.current.velY *= 0.92;
        }

        canGroupRef.current.rotation.y += mouseState.current.velX;
        canGroupRef.current.rotation.x = Math.max(-0.45, Math.min(0.5, canGroupRef.current.rotation.x + mouseState.current.velY));
      }

      renderer.render(scene, camera);
      animFrameId.current = requestAnimationFrame(renderLoop);
    };

    animFrameId.current = requestAnimationFrame(renderLoop);

    // Resize Handler
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const newW = container.clientWidth;
      const newH = container.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    // Scroll-Linked Kinetic Animation Handler
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const deltaY = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Impart rotational momentum and subtle pitch tilt from scroll velocity
      mouseState.current.velX += deltaY * 0.0006;
      if (canGroupRef.current) {
        canGroupRef.current.rotation.x = Math.max(
          -0.35,
          Math.min(0.45, canGroupRef.current.rotation.x + deltaY * 0.0004)
        );
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      renderer.dispose();
      bodyGeometry.dispose();
      bodyMaterial.dispose();
      aluminumMaterial.dispose();
    };
  }, [flavorKey, customLabel, customInfusion, generateCanTexture, onFpsUpdate]);

  // Update Material & Texture dynamically when flavorKey or labels change
  useEffect(() => {
    const profile = FLAVOR_PROFILES[flavorKey] || FLAVOR_PROFILES.classic;
    if (bodyMaterialRef.current) {
      if (textureRef.current) {
        textureRef.current.dispose();
      }
      const newTexture = generateCanTexture(profile, customLabel, customInfusion);
      textureRef.current = newTexture;
      bodyMaterialRef.current.map = newTexture;
      bodyMaterialRef.current.metalness = profile.canMetalness;
      bodyMaterialRef.current.roughness = profile.canRoughness;
      bodyMaterialRef.current.needsUpdate = true;
    }
  }, [flavorKey, customLabel, customInfusion, generateCanTexture]);

  // Mouse / Touch Event Handlers for Drag Spin
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!isInteractive) return;
    setIsDragging(true);
    mouseState.current.isDown = true;
    mouseState.current.prevX = e.clientX;
    mouseState.current.prevY = e.clientY;
    mouseState.current.velX = 0;
    mouseState.current.velY = 0;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!mouseState.current.isDown || !canGroupRef.current) return;
    const deltaX = e.clientX - mouseState.current.prevX;
    const deltaY = e.clientY - mouseState.current.prevY;

    mouseState.current.prevX = e.clientX;
    mouseState.current.prevY = e.clientY;

    const dragFactor = 0.008;
    mouseState.current.velX = deltaX * dragFactor;
    mouseState.current.velY = deltaY * dragFactor * 0.5;

    canGroupRef.current.rotation.y += deltaX * dragFactor;
    canGroupRef.current.rotation.x += deltaY * dragFactor * 0.5;
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    mouseState.current.isDown = false;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // Ignore
    }
  };

  // Pop Can Action (Opens tab, synthesizes audio & carbonation blast)
  const handlePopCan = () => {
    if (isPopped) return;
    setIsPopped(true);
    sound.playCanSnap();

    // Animate tab pulling up
    if (pullTabRef.current) {
      pullTabRef.current.rotation.x = -0.55;
      pullTabRef.current.position.y += 0.04;
    }

    if (onCanPopped) {
      onCanPopped();
    }
  };

  return (
    <div
      className="relative w-full h-full flex items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 3D WebGL Canvas Container */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className={`w-full h-full cursor-grab active:cursor-grabbing transition-transform duration-300 ${
          isDragging ? 'scale-[1.02]' : ''
        }`}
        aria-label={`Interactive 3D Coca-Cola Can: ${FLAVOR_PROFILES[flavorKey]?.name || 'Classic'}. Drag to spin 360 degrees.`}
        role="img"
      />

      {/* Interactive Pop-the-Can Overlay Badge */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 pointer-events-auto">
        {!isPopped ? (
          <button
            onClick={handlePopCan}
            className="group px-5 py-2.5 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-medium text-xs tracking-wider uppercase transition-all duration-300 hover:scale-105 hover:shadow-glow-red flex items-center gap-2 active:scale-95"
            title="Pop open the can to release crisp carbonation"
          >
            <span className="w-2 h-2 rounded-full bg-[#F40009] animate-ping" />
            <span>Click to Crack & Pop Tab</span>
          </button>
        ) : (
          <div className="px-4 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold tracking-wider uppercase flex items-center gap-2 backdrop-blur-md animate-fade-in">
            <span>✓ Opened • Serving at 3.2°C</span>
          </div>
        )}
      </div>

      {/* Tactile 360° Drag Hint */}
      <div
        className={`absolute bottom-4 left-1/2 -translate-x-1/2 text-xs tracking-widest text-white/50 uppercase transition-opacity duration-300 pointer-events-none flex items-center gap-2 ${
          isHovered ? 'opacity-90' : 'opacity-40'
        }`}
      >
        <span>← Drag to Spin 360° →</span>
      </div>
    </div>
  );
};
