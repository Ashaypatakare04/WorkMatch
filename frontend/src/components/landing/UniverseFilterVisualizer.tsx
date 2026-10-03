import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Filter, Sparkles, Check, ArrowRight } from 'lucide-react';

interface UniverseFilterVisualizerProps {
  onExploreDemo?: () => void;
}

export const UniverseFilterVisualizer: React.FC<UniverseFilterVisualizerProps> = ({ onExploreDemo }) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [filterActive, setFilterActive] = useState<boolean>(true);
  const [activeListingCount, setActiveListingCount] = useState<number>(14);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth || 700;
    const height = container.clientHeight || 450;

    // Check if running in headless test environment like jsdom
    if (typeof window === 'undefined' || navigator.userAgent.includes('jsdom') || navigator.userAgent.includes('Node.js')) {
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x070a12);
    scene.fog = new THREE.FogExp2(0x070a12, 0.04);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 0, 8);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      container.appendChild(renderer.domElement);
    } catch {
      return;
    }

    // Ambient and point lights
    const ambientLight = new THREE.AmbientLight(0x111a2e, 1.5);
    scene.add(ambientLight);

    const coreLight = new THREE.PointLight(0x20d3c2, 2.5, 15);
    coreLight.position.set(0, 0, 0);
    scene.add(coreLight);

    // 1. Hundreds of Opportunity Starfield Nodes in the Background (Section 8)
    const totalStarCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const starPositions = new Float32Array(totalStarCount * 3);
    const starTargetPositions = new Float32Array(totalStarCount * 3);
    const starOpacities = new Float32Array(totalStarCount);
    const isTargetStar = new Uint8Array(totalStarCount);

    // Generate random cloud positions
    for (let i = 0; i < totalStarCount; i++) {
      const x = (Math.random() - 0.5) * 16;
      const y = (Math.random() - 0.5) * 10;
      const z = (Math.random() - 0.5) * 8;

      starPositions[i * 3] = x;
      starPositions[i * 3 + 1] = y;
      starPositions[i * 3 + 2] = z;

      // Select ~14 stars as relevant high-fit opportunities that converge to center
      if (i < 14) {
        isTargetStar[i] = 1;
        const angle = (i / 14) * Math.PI * 2;
        const radius = 1.8 + (i % 3) * 0.4;
        starTargetPositions[i * 3] = Math.cos(angle) * radius;
        starTargetPositions[i * 3 + 1] = Math.sin(angle) * radius;
        starTargetPositions[i * 3 + 2] = (Math.random() - 0.5) * 0.6;
      } else {
        isTargetStar[i] = 0;
        // Far outward drift when filtered
        starTargetPositions[i * 3] = x * 2.5;
        starTargetPositions[i * 3 + 1] = y * 2.5;
        starTargetPositions[i * 3 + 2] = z - 6;
      }

      starOpacities[i] = 1.0;
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));

    const starMaterial = new THREE.PointsMaterial({
      color: 0x5ee7df,
      size: 0.07,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending
    });
    const starPoints = new THREE.Points(starGeo, starMaterial);
    scene.add(starPoints);

    // 2. Central Core Marker
    const coreGeo = new THREE.OctahedronGeometry(0.5, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x172238,
      emissive: 0x20d3c2,
      emissiveIntensity: 0.7,
      metalness: 0.8,
      roughness: 0.2
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    scene.add(coreMesh);

    // Concentric orbital rings around core
    const ringGeo = new THREE.TorusGeometry(1.8, 0.012, 16, 80);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x20d3c2,
      transparent: true,
      opacity: 0.35
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    // Connecting laser lines to the 14 converged targets
    const lineGeo = new THREE.BufferGeometry();
    const linePositions = new Float32Array(14 * 6);
    lineGeo.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const lineMat = new THREE.LineBasicMaterial({
      color: 0x20d3c2,
      transparent: true,
      opacity: 0.4
    });
    const connectingLines = new THREE.LineSegments(lineGeo, lineMat);
    scene.add(connectingLines);

    // Mouse parallax
    const mouse = { x: 0, y: 0 };
    const onMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    container.addEventListener('mousemove', onMouseMove);

    // Animation Loop
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Camera parallax
      camera.position.x += (mouse.x * 0.8 - camera.position.x) * 0.05;
      camera.position.y += (mouse.y * 0.6 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Core rotation
      coreMesh.rotation.y += 0.4 * delta;
      coreMesh.rotation.x += 0.2 * delta;
      ringMesh.rotation.z += 0.15 * delta;

      // Update positions based on filterActive state
      const positions = starGeo.attributes.position.array as Float32Array;

      for (let i = 0; i < totalStarCount; i++) {
        const isTarget = isTargetStar[i] === 1;

        if (filterActive) {
          // Converge target stars toward center; scatter noise stars away
          const tx = isTarget ? starTargetPositions[i * 3] : starTargetPositions[i * 3];
          const ty = isTarget ? starTargetPositions[i * 3 + 1] : starTargetPositions[i * 3 + 1];
          const tz = isTarget ? starTargetPositions[i * 3 + 2] : starTargetPositions[i * 3 + 2];

          positions[i * 3] += (tx - positions[i * 3]) * (isTarget ? 0.05 : 0.02);
          positions[i * 3 + 1] += (ty - positions[i * 3 + 1]) * (isTarget ? 0.05 : 0.02);
          positions[i * 3 + 2] += (tz - positions[i * 3 + 2]) * (isTarget ? 0.05 : 0.02);
        } else {
          // Disperse into uncurated chaotic cloud
          const rx = (Math.sin(i + elapsed * 0.2)) * 6;
          const ry = (Math.cos(i * 1.5 + elapsed * 0.2)) * 4;
          positions[i * 3] += (rx - positions[i * 3]) * 0.02;
          positions[i * 3 + 1] += (ry - positions[i * 3 + 1]) * 0.02;
        }

        // Update connecting lines for the 14 targets
        if (i < 14) {
          linePositions[i * 6] = 0;
          linePositions[i * 6 + 1] = 0;
          linePositions[i * 6 + 2] = 0;
          linePositions[i * 6 + 3] = positions[i * 3];
          linePositions[i * 6 + 4] = positions[i * 3 + 1];
          linePositions[i * 6 + 5] = positions[i * 3 + 2];
        }
      }

      starGeo.attributes.position.needsUpdate = true;
      lineGeo.attributes.position.needsUpdate = true;
      connectingLines.visible = filterActive;

      renderer?.render(scene, camera);
    };

    animId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener('mousemove', onMouseMove);
      renderer?.dispose();
      if (renderer?.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [filterActive]);

  const toggleFilter = () => {
    setFilterActive(!filterActive);
    setActiveListingCount(!filterActive ? 14 : 3500);
  };

  return (
    <div className="w-full rounded-3xl bg-[#070A12] border border-[#1B253B] overflow-hidden shadow-2xl relative">
      {/* 3D Canvas Mounting Area */}
      <div
        ref={mountRef}
        className="w-full h-[450px] sm:h-[500px] relative cursor-crosshair"
        data-cursor-label="UNIVERSE"
      />

      {/* Floating HUD Overlay (Section 8) */}
      <div className="absolute top-6 left-6 right-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pointer-events-none">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111A2E]/90 border border-[#20D3C2]/30 text-[11px] font-mono text-[#20D3C2] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-[#20D3C2] animate-ping" />
            <span>OPPORTUNITY UNIVERSE RADAR</span>
          </div>
          <h4 className="text-xl sm:text-2xl font-bold text-[#F4F7FB] font-display">
            Less searching. More matching.
          </h4>
        </div>

        <div className="pointer-events-auto flex items-center gap-3">
          <button
            onClick={toggleFilter}
            className={`px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center gap-2 ${
              filterActive
                ? 'bg-[#20D3C2] text-[#0B1220] shadow-glow-teal'
                : 'bg-[#172238] text-[#F4F7FB] border border-[#1B253B]'
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            <span>{filterActive ? 'Filtering: ACTIVE' : 'Show Unfiltered Cloud'}</span>
          </button>
        </div>
      </div>

      {/* Bottom Status Ticker */}
      <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-[#0D1322]/90 border border-[#1B253B] backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono">
        <div className="flex items-center gap-4 text-[#9AA8BC]">
          <span>Raw Stream: <strong className="text-[#F4F7FB]">3,500+ listings</strong></span>
          <span className="text-[#20D3C2]">•</span>
          <span>Matched &amp; Verified: <strong className="text-[#20D3C2]">{activeListingCount} high-fit contracts</strong></span>
        </div>

        <div className="flex items-center gap-2 text-[#35D07F]">
          <Check className="w-4 h-4" />
          <span>99.6% irrelevant noise eliminated before review</span>
        </div>
      </div>
    </div>
  );
};
