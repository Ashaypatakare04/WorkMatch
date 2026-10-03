import React, { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';
import { OpportunityNodeData, StoryStage, OPPORTUNITY_NODES } from './types.js';
import { FallbackEcosystem } from './FallbackEcosystem.js';

interface OpportunitySceneProps {
  stage?: StoryStage;
  selectedOpportunity?: OpportunityNodeData | null;
  onSelectOpportunity?: (opp: OpportunityNodeData) => void;
  onHoverOpportunity?: (opp: OpportunityNodeData | null) => void;
  className?: string;
  interactive?: boolean;
}

// Utility to check WebGL capability cleanly without triggering jsdom warnings
function checkWebGLSupport(): boolean {
  try {
    if (typeof window === 'undefined' || typeof document === 'undefined') return false;
    // Check if running in headless test environment like jsdom
    if (navigator.userAgent.includes('jsdom') || navigator.userAgent.includes('Node.js')) {
      return false;
    }
    const canvas = document.createElement('canvas');
    if (!canvas || typeof canvas.getContext !== 'function') return false;
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    return !!(window.WebGLRenderingContext && gl);
  } catch {
    return false;
  }
}

export const OpportunityScene: React.FC<OpportunitySceneProps> = ({
  stage = 'discover',
  selectedOpportunity = null,
  onSelectOpportunity,
  onHoverOpportunity,
  className = '',
  interactive = true
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [hasWebGL, setHasWebGL] = useState<boolean>(() => checkWebGLSupport());
  const [internalSelected, setInternalSelected] = useState<OpportunityNodeData>(
    selectedOpportunity || OPPORTUNITY_NODES[0]
  );
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);

  // Sync internal selected state
  useEffect(() => {
    if (selectedOpportunity) {
      setInternalSelected(selectedOpportunity);
    }
  }, [selectedOpportunity]);

  const handleSelectNode = useCallback(
    (opp: OpportunityNodeData) => {
      setInternalSelected(opp);
      if (onSelectOpportunity) {
        onSelectOpportunity(opp);
      }
    },
    [onSelectOpportunity]
  );

  // Re-verify WebGL support on mount
  useEffect(() => {
    setHasWebGL(checkWebGLSupport());
  }, []);

  // Main Three.js Scene Setup & Animation Lifecycle
  useEffect(() => {
    if (!hasWebGL || !mountRef.current) return;

    const container = mountRef.current;
    let width = container.clientWidth || 600;
    let height = container.clientHeight || 500;

    // Check for prefers-reduced-motion
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let prefersReducedMotion = reducedMotionQuery.matches;
    const onReducedMotionChange = (e: MediaQueryListEvent) => {
      prefersReducedMotion = e.matches;
    };
    reducedMotionQuery.addEventListener('change', onReducedMotionChange);

    // 1. Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0b1220);
    scene.fog = new THREE.FogExp2(0x0b1220, 0.045);

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.5, 7.5);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setSize(width, height);
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;
      container.appendChild(renderer.domElement);
      canvasRef.current = renderer.domElement;
    } catch {
      setHasWebGL(false);
      return;
    }

    // 2. Lighting (Restrained, dark navy with teal accents - Section 13)
    const ambientLight = new THREE.AmbientLight(0x111a2e, 1.4);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xf4f7fb, 1.2);
    directionalLight.position.set(5, 8, 6);
    scene.add(directionalLight);

    const tealAccentLight = new THREE.PointLight(0x20d3c2, 2.2, 14);
    tealAccentLight.position.set(0, 0, 0); // Positioned inside Profile Core
    scene.add(tealAccentLight);

    const cyanRimLight = new THREE.DirectionalLight(0x5ee7df, 0.8);
    cyanRimLight.position.set(-5, -4, -4);
    scene.add(cyanRimLight);

    // 3. Profile Core (Abstract Geometric Structure - Section 2 & 6)
    // Core group: layered rings + faceted geometric core + orbital skill nodes
    const profileCoreGroup = new THREE.Group();
    scene.add(profileCoreGroup);

    // Faceted slate inner core (Low-poly icosahedron)
    const coreGeo = new THREE.IcosahedronGeometry(0.85, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0x172238,
      roughness: 0.35,
      metalness: 0.65,
      flatShading: true,
      emissive: 0x0f1c30,
      emissiveIntensity: 0.5
    });
    const coreMesh = new THREE.Mesh(coreGeo, coreMat);
    profileCoreGroup.add(coreMesh);

    // Subtle wireframe overlay for precision feel
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x20d3c2,
      wireframe: true,
      transparent: true,
      opacity: 0.3
    });
    const coreWireMesh = new THREE.Mesh(coreGeo, wireframeMat);
    coreWireMesh.scale.setScalar(1.01);
    profileCoreGroup.add(coreWireMesh);

    // Inner glowing core beacon
    const innerBeaconGeo = new THREE.OctahedronGeometry(0.35, 0);
    const innerBeaconMat = new THREE.MeshBasicMaterial({
      color: 0x5ee7df,
      transparent: true,
      opacity: 0.8
    });
    const innerBeacon = new THREE.Mesh(innerBeaconGeo, innerBeaconMat);
    profileCoreGroup.add(innerBeacon);

    // Layered Gyroscopic Thin Rings (Section 6: Layered rings, thin connection lines)
    const ringMat1 = new THREE.MeshStandardMaterial({
      color: 0x20d3c2,
      roughness: 0.3,
      metalness: 0.7,
      transparent: true,
      opacity: 0.65,
      side: THREE.DoubleSide
    });
    const ringMat2 = new THREE.MeshStandardMaterial({
      color: 0x5ee7df,
      roughness: 0.4,
      metalness: 0.6,
      transparent: true,
      opacity: 0.45,
      side: THREE.DoubleSide
    });
    const ringMat3 = new THREE.MeshStandardMaterial({
      color: 0x22324f,
      roughness: 0.5,
      metalness: 0.8,
      transparent: true,
      opacity: 0.5,
      side: THREE.DoubleSide
    });

    const ringGeo1 = new THREE.TorusGeometry(1.35, 0.015, 16, 80);
    const ringGeo2 = new THREE.TorusGeometry(1.65, 0.015, 16, 80);
    const ringGeo3 = new THREE.TorusGeometry(1.95, 0.012, 16, 80);

    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    const ringMesh3 = new THREE.Mesh(ringGeo3, ringMat3);

    ringMesh1.rotation.x = Math.PI / 4;
    ringMesh2.rotation.y = Math.PI / 3;
    ringMesh3.rotation.x = -Math.PI / 5;

    profileCoreGroup.add(ringMesh1);
    profileCoreGroup.add(ringMesh2);
    profileCoreGroup.add(ringMesh3);

    // Orbiting Skill Satellite Markers (React, TypeScript, Architecture, Cloud)
    const skillNodesGroup = new THREE.Group();
    profileCoreGroup.add(skillNodesGroup);

    const skillGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12);
    const skillMat = new THREE.MeshStandardMaterial({
      color: 0x20d3c2,
      emissive: 0x20d3c2,
      emissiveIntensity: 0.6,
      metalness: 0.7,
      roughness: 0.2
    });

    const skillMeshes: THREE.Mesh[] = [];
    const skillAngles = [0, (Math.PI * 2) / 3, (Math.PI * 4) / 3];
    const skillRadii = [1.35, 1.65, 1.95];

    skillAngles.forEach((angle, idx) => {
      const mesh = new THREE.Mesh(skillGeo, skillMat);
      mesh.userData = { initialAngle: angle, radius: skillRadii[idx], speed: 0.5 + idx * 0.2 };
      skillNodesGroup.add(mesh);
      skillMeshes.push(mesh);
    });

    // 4. Opportunity Nodes (Section 6 & 11)
    // Small floating cards / geometric panels with indicator beacons
    const oppMeshesGroup = new THREE.Group();
    scene.add(oppMeshesGroup);

    interface OppMeshEntry {
      data: OpportunityNodeData;
      root: THREE.Group;
      cardMesh: THREE.Mesh;
      beaconMesh: THREE.Mesh;
      currentPos: THREE.Vector3;
      targetPos: THREE.Vector3;
      line: THREE.Line;
      particles: THREE.Points;
      particlePositions: Float32Array;
      particleProgresses: number[];
    }

    const oppEntries: OppMeshEntry[] = [];

    // Card geometry: Rounded thin hexagonal prism / beveled plate
    const cardGeometry = new THREE.BoxGeometry(0.7, 0.45, 0.08);

    OPPORTUNITY_NODES.forEach(opp => {
      const oppRoot = new THREE.Group();
      oppRoot.position.set(...opp.basePosition);

      // Card plate material: dark slate with subtle reflective sheen
      const isHighFit = opp.matchScore >= 90;
      const cardMaterial = new THREE.MeshStandardMaterial({
        color: 0x172238,
        roughness: 0.35,
        metalness: 0.7,
        emissive: isHighFit ? 0x0f242e : 0x0a101d,
        emissiveIntensity: 0.6
      });

      const cardMesh = new THREE.Mesh(cardGeometry, cardMaterial);
      cardMesh.userData = { opportunityId: opp.id, isOpportunityNode: true };
      oppRoot.add(cardMesh);

      // Match Score Indicator Beacon (Teal/Emerald glow pip)
      const beaconGeo = new THREE.SphereGeometry(0.06, 12, 12);
      const beaconMat = new THREE.MeshBasicMaterial({
        color: isHighFit ? 0x20d3c2 : opp.matchScore >= 80 ? 0x5ee7df : 0x9aa8bc
      });
      const beaconMesh = new THREE.Mesh(beaconGeo, beaconMat);
      beaconMesh.position.set(-0.24, 0.12, 0.06);
      oppRoot.add(beaconMesh);

      // Subtle border frame
      const frameMat = new THREE.MeshBasicMaterial({
        color: isHighFit ? 0x20d3c2 : 0x22324f,
        wireframe: true,
        transparent: true,
        opacity: isHighFit ? 0.75 : 0.35
      });
      const frameMesh = new THREE.Mesh(cardGeometry, frameMat);
      frameMesh.scale.set(1.02, 1.02, 1.02);
      oppRoot.add(frameMesh);

      oppMeshesGroup.add(oppRoot);

      // 5. Connection Line to Profile Core (Thin teal line - Section 8 & 11)
      const lineGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        oppRoot.position.clone()
      ]);
      const lineMat = new THREE.LineBasicMaterial({
        color: 0x20d3c2,
        transparent: true,
        opacity: isHighFit ? 0.45 : 0.18,
        linewidth: 1
      });
      const line = new THREE.Line(lineGeo, lineMat);
      scene.add(line);

      // 6. Data Particles Traveling Along Connection (Section 8)
      const particleCount = 8;
      const particlePositions = new Float32Array(particleCount * 3);
      const particleProgresses: number[] = [];

      for (let i = 0; i < particleCount; i++) {
        particleProgresses.push(Math.random());
      }

      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

      const particleMat = new THREE.PointsMaterial({
        color: 0x5ee7df,
        size: 0.05,
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending
      });

      const particles = new THREE.Points(particleGeo, particleMat);
      scene.add(particles);

      oppEntries.push({
        data: opp,
        root: oppRoot,
        cardMesh,
        beaconMesh,
        currentPos: oppRoot.position.clone(),
        targetPos: oppRoot.position.clone(),
        line,
        particles,
        particlePositions,
        particleProgresses
      });
    });

    // 7. Ambient Data Particles Field (Negative space particle constellation)
    const ambientParticleCount = 45;
    const ambientGeo = new THREE.BufferGeometry();
    const ambientPos = new Float32Array(ambientParticleCount * 3);

    for (let i = 0; i < ambientParticleCount * 3; i += 3) {
      ambientPos[i] = (Math.random() - 0.5) * 12;
      ambientPos[i + 1] = (Math.random() - 0.5) * 8;
      ambientPos[i + 2] = (Math.random() - 0.5) * 6;
    }
    ambientGeo.setAttribute('position', new THREE.BufferAttribute(ambientPos, 3));

    const ambientMat = new THREE.PointsMaterial({
      color: 0x20d3c2,
      size: 0.035,
      transparent: true,
      opacity: 0.35
    });
    const ambientPoints = new THREE.Points(ambientGeo, ambientMat);
    scene.add(ambientPoints);

    // 8. Raycaster & Mouse Parallax System (Section 7)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2(-999, -999);
    const targetCameraPos = new THREE.Vector3(0, 0.5, 7.5);
    const mouseParallax = { x: 0, y: 0 };

    const onPointerMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = e.clientX - rect.left;
      const clientY = e.clientY - rect.top;

      mouse.x = (clientX / rect.width) * 2 - 1;
      mouse.y = -(clientY / rect.height) * 2 + 1;

      if (!prefersReducedMotion) {
        // Restrained subtle parallax
        mouseParallax.x = mouse.x * 0.45;
        mouseParallax.y = mouse.y * 0.35;
      }
    };

    const onClick = () => {
      if (!interactive) return;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(oppMeshesGroup.children, true);

      if (intersects.length > 0) {
        let hitMesh: THREE.Object3D | null = intersects[0].object;
        while (hitMesh && !hitMesh.userData.opportunityId) {
          hitMesh = hitMesh.parent;
        }

        if (hitMesh && hitMesh.userData.opportunityId) {
          const targetOpp = OPPORTUNITY_NODES.find(o => o.id === hitMesh?.userData.opportunityId);
          if (targetOpp) {
            handleSelectNode(targetOpp);
          }
        }
      }
    };

    container.addEventListener('mousemove', onPointerMove);
    container.addEventListener('click', onClick);

    // 9. IntersectionObserver to Pause Off-Screen (Section 16: Performance)
    let isVisible = true;
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          isVisible = entry.isIntersecting;
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(container);

    // 10. ResizeObserver for responsive canvas
    const resizeObserver = new ResizeObserver(entries => {
      for (const entry of entries) {
        const { width: newW, height: newH } = entry.contentRect;
        if (newW > 0 && newH > 0 && renderer) {
          camera.aspect = newW / newH;
          camera.updateProjectionMatrix();
          renderer.setSize(newW, newH);
        }
      }
    });
    resizeObserver.observe(container);

    // 11. Animation Loop & Stage Evolution (Section 9 & 15)
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      if (!isVisible) return; // Paused when off-screen

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();

      // Core Rotation (Gyroscopic subtle movement)
      if (!prefersReducedMotion) {
        ringMesh1.rotation.z += 0.25 * delta;
        ringMesh1.rotation.y += 0.15 * delta;
        ringMesh2.rotation.x += 0.2 * delta;
        ringMesh2.rotation.z -= 0.18 * delta;
        ringMesh3.rotation.y -= 0.15 * delta;
        ringMesh3.rotation.x += 0.1 * delta;

        coreMesh.rotation.y += 0.2 * delta;
        coreMesh.rotation.x += 0.15 * delta;
        coreWireMesh.rotation.y = coreMesh.rotation.y;
        coreWireMesh.rotation.x = coreMesh.rotation.x;

        innerBeacon.rotation.y -= 0.4 * delta;
        innerBeacon.rotation.z += 0.3 * delta;

        // Animate skill orbital satellites
        skillMeshes.forEach(mesh => {
          const angle = mesh.userData.initialAngle + elapsed * mesh.userData.speed;
          const r = mesh.userData.radius;
          mesh.position.set(Math.cos(angle) * r, Math.sin(angle * 0.7) * 0.4, Math.sin(angle) * r);
          mesh.rotation.y += 1.5 * delta;
        });
      }

      // Camera Parallax Interpolation (Slow & subtle)
      camera.position.x += (targetCameraPos.x + mouseParallax.x - camera.position.x) * 0.04;
      camera.position.y += (targetCameraPos.y + mouseParallax.y - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);

      // Raycasting for Hover Detection
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(oppMeshesGroup.children, true);
      let hoveredId: string | null = null;

      if (intersects.length > 0) {
        let hitMesh: THREE.Object3D | null = intersects[0].object;
        while (hitMesh && !hitMesh.userData.opportunityId) {
          hitMesh = hitMesh.parent;
        }
        if (hitMesh && hitMesh.userData.opportunityId) {
          hoveredId = hitMesh.userData.opportunityId;
        }
      }

      if (hoveredId !== hoveredNodeId) {
        setHoveredNodeId(hoveredId);
        if (onHoverOpportunity) {
          const oppObj = OPPORTUNITY_NODES.find(o => o.id === hoveredId) || null;
          onHoverOpportunity(oppObj);
        }
      }

      // 12. Stage-Driven Dynamic Spatial Evolution (Section 9)
      oppEntries.forEach(entry => {
        const { data, root, cardMesh, line, particles, particlePositions, particleProgresses } = entry;
        const isHovered = hoveredId === data.id;
        const isSelected = internalSelected.id === data.id;
        const isHighFit = data.matchScore >= 90;

        // Base target positioning according to stage
        const base = data.basePosition;
        const target = entry.targetPos;

        if (stage === 'discover') {
          // Constellation cloud: wide spread
          target.set(base[0] * 1.15, base[1] * 1.15, base[2] * 1.1);
        } else if (stage === 'understand') {
          // Structured observation: align closer to viewing plane
          target.set(base[0] * 1.0, base[1] * 1.0, base[2] * 0.6);
        } else if (stage === 'match') {
          // Filtering: low-fit drift away, high-fit pull close to core
          if (isHighFit) {
            target.set(base[0] * 0.75, base[1] * 0.75, base[2] * 0.5);
          } else {
            target.set(base[0] * 1.7, base[1] * 1.7, base[2] * 1.5 - 2);
          }
        } else if (stage === 'explain') {
          // Primary focus: top-fit steps to center front
          if (data.id === 'frontend-dashboard' || isSelected) {
            target.set(0.6, 0.2, 1.8);
          } else {
            target.set(base[0] * 1.5, base[1] * 1.5, -2);
          }
        } else if (stage === 'apply') {
          // Proposal mode: top-fit docks to the right of core
          if (isSelected || data.id === 'frontend-dashboard') {
            target.set(1.4, 0.1, 1.2);
          } else {
            target.set(base[0] * 1.6, base[1] * 1.6, -2.5);
          }
        } else if (stage === 'learn') {
          // Learning mode: reorganization ripple based on matchScore
          const angle = (data.matchScore / 100) * Math.PI * 2 + elapsed * 0.15;
          const dist = 2.2 + (100 - data.matchScore) * 0.025;
          target.set(Math.cos(angle) * dist, Math.sin(angle) * (dist * 0.5), Math.sin(angle * 2) * 0.5);
        }

        // Hover offset: bring hovered node slightly closer
        if (isHovered) {
          target.z += 0.35;
        }

        // Smooth positional lerp
        root.position.lerp(target, 0.05);

        // Keep card oriented towards camera with slight float
        root.lookAt(camera.position);

        // Visual State (Color, Emissive, Line opacity)
        const mat = cardMesh.material as THREE.MeshStandardMaterial;
        const lineMat = line.material as THREE.LineBasicMaterial;
        const partMat = particles.material as THREE.PointsMaterial;

        if (isHovered || isSelected) {
          mat.color.setHex(0x1c2943);
          mat.emissive.setHex(0x20d3c2);
          mat.emissiveIntensity = 0.8;
          lineMat.opacity = 0.85;
          lineMat.color.setHex(0x20d3c2);
          partMat.opacity = 0.95;
        } else if (stage === 'match' && !isHighFit) {
          mat.color.setHex(0x111a2e);
          mat.emissive.setHex(0x000000);
          mat.emissiveIntensity = 0.1;
          lineMat.opacity = 0.08;
          partMat.opacity = 0.1;
        } else {
          mat.color.setHex(0x172238);
          mat.emissive.setHex(isHighFit ? 0x0f242e : 0x08101a);
          mat.emissiveIntensity = 0.4;
          lineMat.opacity = isHighFit ? 0.35 : 0.15;
          partMat.opacity = isHighFit ? 0.6 : 0.2;
        }

        // Update connection line endpoints
        const linePosAttr = line.geometry.attributes.position as THREE.BufferAttribute;
        linePosAttr.setXYZ(0, 0, 0, 0);
        linePosAttr.setXYZ(1, root.position.x, root.position.y, root.position.z);
        linePosAttr.needsUpdate = true;

        // Animate particles along connection line (Section 8: Particles travel along connection)
        if (!prefersReducedMotion) {
          for (let i = 0; i < particleProgresses.length; i++) {
            particleProgresses[i] = (particleProgresses[i] + delta * (isHovered ? 0.8 : 0.3)) % 1;
            const progress = particleProgresses[i];
            const px = root.position.x * progress;
            const py = root.position.y * progress;
            const pz = root.position.z * progress;

            particlePositions[i * 3] = px;
            particlePositions[i * 3 + 1] = py;
            particlePositions[i * 3 + 2] = pz;
          }
          particles.geometry.attributes.position.needsUpdate = true;
        }
      });

      if (renderer) {
        renderer.render(scene, camera);
      }
    };

    animationFrameId = requestAnimationFrame(animate);

    // Cleanup on unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      resizeObserver.disconnect();
      reducedMotionQuery.removeEventListener('change', onReducedMotionChange);
      container.removeEventListener('mousemove', onPointerMove);
      container.removeEventListener('click', onClick);

      // Dispose Three.js objects
      scene.traverse(obj => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Points || obj instanceof THREE.Line) {
          if (obj.geometry) obj.geometry.dispose();
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else if (obj.material) {
            obj.material.dispose();
          }
        }
      });

      if (renderer) {
        renderer.dispose();
        if (renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, [hasWebGL, stage, internalSelected, interactive, handleSelectNode, onHoverOpportunity]);

  // If WebGL is not available, render the 2D Fallback diagram (Section 19)
  if (!hasWebGL) {
    return (
      <FallbackEcosystem
        opportunities={OPPORTUNITY_NODES}
        selectedOpportunity={internalSelected}
        onSelectOpportunity={handleSelectNode}
        stage={stage}
      />
    );
  }

  const activeOpp = internalSelected || OPPORTUNITY_NODES[0];

  return (
    <div className={`relative w-full h-full min-h-[460px] md:min-h-[560px] select-none ${className}`}>
      {/* 3D Canvas Mounting Container */}
      <div
        ref={mountRef}
        className="w-full h-full min-h-[460px] md:min-h-[560px] rounded-2xl md:rounded-3xl overflow-hidden cursor-grab active:cursor-grabbing border border-[#22324F] bg-[#0B1220] shadow-card relative"
        aria-label="Interactive 3D Opportunity Ecosystem"
      />

      {/* Floating 3D HUD / Status Overlays (Section 6, 7, 8) */}
      <div className="absolute top-4 left-4 z-20 pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#111A2E]/90 border border-[#22324F] backdrop-blur-md text-[11px] font-mono text-[#F4F7FB]">
          <span className="w-2 h-2 rounded-full bg-[#20D3C2] animate-pulse" />
          <span className="text-[#20D3C2] font-bold">OPPORTUNITY ECOSYSTEM</span>
          <span className="text-slate-500">•</span>
          <span className="text-[#9AA8BC]">STAGE: {stage.toUpperCase()}</span>
        </div>
      </div>

      {/* Interactive Node Inspection Popover (Hover/Select HUD - Section 7 & 8) */}
      <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-auto">
        <div className="bg-[#111A2E]/95 border border-[#22324F] backdrop-blur-md rounded-2xl p-4 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#20D3C2]/15 text-[#20D3C2] border border-[#20D3C2]/30 font-bold">
                {activeOpp.platform}
              </span>
              <span className="text-xs font-semibold text-[#F4F7FB]">{activeOpp.title}</span>
              <span className="text-xs text-[#9AA8BC] font-mono">{activeOpp.budget}</span>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-[#9AA8BC]">
              <span>Skills: <strong className="text-[#20D3C2]">{activeOpp.breakdown.skills}%</strong></span>
              <span>Time: <strong className="text-[#35D07F]">{activeOpp.breakdown.time}%</strong></span>
              <span>Budget: <strong className="text-[#F5B942]">{activeOpp.breakdown.budget}%</strong></span>
              <span>Risk: <strong className="text-[#35D07F]">{activeOpp.risk}</strong></span>
            </div>
          </div>

          {/* Signature Match Badge */}
          <div className="flex items-center gap-3 self-end sm:self-auto flex-shrink-0">
            <div className="text-right">
              <div className="text-2xl font-mono font-extrabold text-[#20D3C2] leading-none">
                {activeOpp.matchScore}
              </div>
              <div className="text-[9px] font-mono font-bold tracking-wider text-[#9AA8BC]">
                MATCH
              </div>
            </div>

            <div className="h-8 w-px bg-[#22324F]" />

            <button
              onClick={() => handleSelectNode(activeOpp)}
              className="px-3.5 py-2 rounded-xl bg-[#20D3C2] hover:bg-[#5EE7DF] text-[#0B1220] text-xs font-bold font-mono transition-all shadow-sm"
            >
              Inspect Fit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
