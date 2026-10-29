import React, { useState, useEffect, useRef, useMemo } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Shield,
  Zap,
  RotateCcw,
  Sliders,
  Play,
  Pause,
  SkipForward,
  CheckCircle2,
  AlertTriangle,
  Cpu,
  BarChart3,
  TrendingUp,
  FileCode,
  Lock,
  Database,
  ArrowRight,
  Maximize2,
  Minimize2,
  Terminal,
  Activity,
  FileText,
  Clock,
  Sparkles,
  TrendingDown,
  Info,
  Eye,
  Compass,
  Crosshair,
  FastForward,
  Gauge,
  BookOpen,
  HelpCircle,
  Radio
} from 'lucide-react';
import {
  CounterAEOBenchGenerator,
  CounterAEOBenchmarkEvaluator,
  ScenarioAlphaMarketSimulator,
  SimulatedTrialSample,
  BatchMetrics,
  LOBTick,
  LayerDecisionBreakdown,
  Gen1DecisionBreakdown
} from '../utils/counterGeoVol3Benchmark';
import { MASTER_DOC_VOL3_METADATA } from '../data/counterGeoVol3Content';


interface Vol3FindingsAndLabProps {
  onSwitchToPaper: () => void;
  onNavigateToOverview: () => void;
}

export const CounterGeoVol3FindingsAndLab: React.FC<Vol3FindingsAndLabProps> = ({
  onSwitchToPaper,
  onNavigateToOverview
}) => {
  const getInitialTab = (): 'benchmark' | 'flashcrash' | 'charts' | 'webgl' => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('webgl') || hash.includes('visualizer') || hash.includes('3d')) return 'webgl';
    if (hash.includes('flashcrash') || hash.includes('market') || hash.includes('lob')) return 'flashcrash';
    if (hash.includes('charts')) return 'charts';
    return 'benchmark';
  };

  const [activeTab, setActiveTab] = useState<'benchmark' | 'flashcrash' | 'charts' | 'webgl'>(getInitialTab);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('webgl') || hash.includes('visualizer') || hash.includes('3d')) {
        setActiveTab('webgl');
      } else if (hash.includes('flashcrash') || hash.includes('market')) {
        setActiveTab('flashcrash');
      } else if (hash.includes('charts')) {
        setActiveTab('charts');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // ==========================================
  // TAB 1: LIVE BENCHMARK RUNNER STATE
  // ==========================================
  const [sampleSize, setSampleSize] = useState(2000);
  const [attackRatio, setAttackRatio] = useState(0.5);
  const [c2paExemptionActive, setC2paExemptionActive] = useState(true);
  const [isRunningBenchmark, setIsRunningBenchmark] = useState(false);
  const [benchmarkSeed, setBenchmarkSeed] = useState(20261013);

  // Generated dataset
  const generator = useMemo(() => new CounterAEOBenchGenerator(benchmarkSeed), [benchmarkSeed]);
  const dataset = useMemo(() => generator.generateDataset(sampleSize, attackRatio), [generator, sampleSize, attackRatio]);

  // Evaluated batch metrics
  const gen1Metrics: BatchMetrics = useMemo(() => {
    return CounterAEOBenchmarkEvaluator.runBatchEvaluation(dataset, 'gen1', c2paExemptionActive);
  }, [dataset, c2paExemptionActive]);

  const sovereignMetrics: BatchMetrics = useMemo(() => {
    return CounterAEOBenchmarkEvaluator.runBatchEvaluation(dataset, 'sovereign_8layer', c2paExemptionActive);
  }, [dataset, c2paExemptionActive]);

  // Single sample inspection probe
  const [selectedProbeCategory, setSelectedProbeCategory] = useState<string>('AT-5_SPLIT');
  const probeSample = useMemo(() => {
    const match = dataset.find((s) => s.attack_category === selectedProbeCategory);
    return match || dataset[0];
  }, [dataset, selectedProbeCategory]);

  const probeGen1Verdict = useMemo(() => {
    return CounterAEOBenchmarkEvaluator.evaluateGen1Baseline(probeSample);
  }, [probeSample]);

  const probeSovereignVerdict = useMemo(() => {
    return CounterAEOBenchmarkEvaluator.evaluate8LayerStack(probeSample, c2paExemptionActive);
  }, [probeSample, c2paExemptionActive]);

  // ==========================================
  // TAB 2: SCENARIO ALPHA FLASH-CRASH SIMULATOR
  // ==========================================
  const replayTicks = useMemo(() => ScenarioAlphaMarketSimulator.generateReplayTrajectory(), []);
  const [currentTickIdx, setCurrentTickIdx] = useState(3); // Start at 07:30:00 attack
  const [isPlayingReplay, setIsPlayingReplay] = useState(false);
  const [replaySpeed, setReplaySpeed] = useState<number>(1);
  const currentTick = replayTicks[currentTickIdx] || replayTicks[0];

  useEffect(() => {
    let interval: any = null;
    if (isPlayingReplay) {
      interval = setInterval(() => {
        setCurrentTickIdx((prev) => {
          if (prev >= replayTicks.length - 1) {
            setIsPlayingReplay(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200 / replaySpeed);
    }
    return () => clearInterval(interval);
  }, [isPlayingReplay, replaySpeed, replayTicks.length]);

  // ==========================================
  // TAB 4: THREE.JS WEBGL 2.0 3D ENGINE
  // ==========================================
  const threeMountRef = useRef<HTMLDivElement>(null);
  const [webglMode, setWebglMode] = useState(0);
  const [isAttackInjected, setIsAttackInjected] = useState(false);
  const [attackIntensity, setAttackIntensity] = useState(85);
  const [simSpeed, setSimSpeed] = useState(1);
  const [activeCameraPreset, setActiveCameraPreset] = useState<'perspective' | 'top' | 'side'>('perspective');
  const [selectedTaxonomy, setSelectedTaxonomy] = useState(0);

  const threeState = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    controls: OrbitControls | null;
    modeGroups: THREE.Group[];
    lobBids: THREE.Mesh[];
    lobAsks: THREE.Mesh[];
    predatoryWall: THREE.Mesh | null;
    circuitBreakerPlane: THREE.Mesh | null;
    lobFlowParticles: THREE.Points | null;
    midPriceLine: THREE.Line | null;
    rocSurface: THREE.Mesh | null;
    rocCurveSovereign: THREE.Line | null;
    rocCurveBaseline: THREE.Line | null;
    rocMarker: THREE.Mesh | null;
    taxonomyNodes: THREE.Mesh[];
    taxonomyRays: THREE.Line[];
    citadelCore: THREE.Mesh | null;
    clusteringPoints: THREE.Points | null;
    decisionHyperplane: THREE.Mesh | null;
    clock: THREE.Clock;
    animId: number | null;
    isAttack: boolean;
    intensity: number;
    speed: number;
    currentMode: number;
    selectedTaxonomy: number;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    controls: null,
    modeGroups: [],
    lobBids: [],
    lobAsks: [],
    predatoryWall: null,
    circuitBreakerPlane: null,
    lobFlowParticles: null,
    midPriceLine: null,
    rocSurface: null,
    rocCurveSovereign: null,
    rocCurveBaseline: null,
    rocMarker: null,
    taxonomyNodes: [],
    taxonomyRays: [],
    citadelCore: null,
    clusteringPoints: null,
    decisionHyperplane: null,
    clock: new THREE.Clock(),
    animId: null,
    isAttack: false,
    intensity: 0.85,
    speed: 1,
    currentMode: 0,
    selectedTaxonomy: 0
  });

  const setCameraPreset = (preset: 'perspective' | 'top' | 'side') => {
    setActiveCameraPreset(preset);
    const camera = threeState.current.camera;
    const controls = threeState.current.controls;
    if (!camera || !controls) return;
    if (preset === 'perspective') {
      camera.position.set(0, 18, 42);
      controls.target.set(0, 0, 0);
    } else if (preset === 'top') {
      camera.position.set(0, 46, 0.1);
      controls.target.set(0, 0, 0);
    } else if (preset === 'side') {
      camera.position.set(44, 4, 0);
      controls.target.set(0, 0, 0);
    }
    controls.update();
  };

  useEffect(() => {
    if (activeTab !== 'webgl' || !threeMountRef.current) return;
    const container = threeMountRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 560;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x363636);
    scene.fog = new THREE.FogExp2(0x363636, 0.016);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 18, 42);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.maxDistance = 120;
    controls.minDistance = 6;
    controls.target.set(0, 0, 0);

    // Lights
    scene.add(new THREE.AmbientLight(0xfff5ea, 0.95));
    const goldLight = new THREE.PointLight(0xd5991c, 4, 120);
    goldLight.position.set(15, 20, 15);
    scene.add(goldLight);

    const crimsonLight = new THREE.PointLight(0x8b1e1e, 3.5, 120);
    crimsonLight.position.set(-15, 10, -15);
    scene.add(crimsonLight);

    const emeraldLight = new THREE.PointLight(0x00a878, 3.5, 100);
    emeraldLight.position.set(0, -10, 15);
    scene.add(emeraldLight);

    // 4 Mode Groups
    const modeGroups: THREE.Group[] = [];
    for (let i = 0; i < 4; i++) {
      const g = new THREE.Group();
      g.visible = i === webglMode;
      scene.add(g);
      modeGroups.push(g);
    }

    // ==========================================
    // MODE 0: 3D High-Frequency LOB Canyon & Flash-Crash
    // ==========================================
    const g0 = modeGroups[0];
    const lobBids: THREE.Mesh[] = [];
    const lobAsks: THREE.Mesh[] = [];

    for (let i = 0; i < 14; i++) {
      const h = 1 + i * 0.85;
      // Bids on left (Gold)
      const bidMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, h, 3.5),
        new THREE.MeshStandardMaterial({ color: 0xd5991c, metalness: 0.85, roughness: 0.2 })
      );
      bidMesh.position.set(-11.5 + i * 0.8, h / 2, 0);
      g0.add(bidMesh);
      lobBids.push(bidMesh);

      // Asks on right (Oxblood)
      const askMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, h, 3.5),
        new THREE.MeshStandardMaterial({ color: 0x8b1e1e, metalness: 0.85, roughness: 0.2 })
      );
      askMesh.position.set(2.5 + i * 0.8, h / 2, 0);
      g0.add(askMesh);
      lobAsks.push(askMesh);
    }

    // Mid-Price line in center canyon
    const midLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.5, 0.4, -10),
      new THREE.Vector3(-0.5, 0.4, 10)
    ]);
    const midPriceLine = new THREE.Line(midLineGeo, new THREE.LineBasicMaterial({ color: 0x00a878, linewidth: 3 }));
    g0.add(midPriceLine);

    // $45M Predatory Spoof Wall
    const wallMesh = new THREE.Mesh(
      new THREE.BoxGeometry(4, 18, 4.5),
      new THREE.MeshStandardMaterial({ color: 0xe63946, emissive: 0x8b1e1e, transparent: true, opacity: 0.9 })
    );
    wallMesh.position.set(4.5, 9, 0);
    wallMesh.visible = isAttackInjected;
    g0.add(wallMesh);

    // Sovereign Epistemic Circuit Breaker Plane
    const cbPlaneGeo = new THREE.PlaneGeometry(32, 22);
    cbPlaneGeo.rotateY(Math.PI / 2);
    const cbPlaneMat = new THREE.MeshBasicMaterial({ color: 0x00a878, wireframe: true, transparent: true, opacity: 0.7 });
    const circuitBreakerPlane = new THREE.Mesh(cbPlaneGeo, cbPlaneMat);
    circuitBreakerPlane.position.set(-0.5, 10, 0);
    circuitBreakerPlane.visible = !isAttackInjected;
    g0.add(circuitBreakerPlane);

    // LOB Transaction Flow Particles (200 particles)
    const flowCount = 180;
    const flowPos = new Float32Array(flowCount * 3);
    for (let i = 0; i < flowCount; i++) {
      flowPos[i * 3] = -0.5 + (Math.random() - 0.5) * 2;
      flowPos[i * 3 + 1] = Math.random() * 10;
      flowPos[i * 3 + 2] = -10 + Math.random() * 20;
    }
    const flowGeo = new THREE.BufferGeometry();
    flowGeo.setAttribute('position', new THREE.BufferAttribute(flowPos, 3));
    const lobFlowParticles = new THREE.Points(
      flowGeo,
      new THREE.PointsMaterial({ color: 0x00a878, size: 0.4, transparent: true, opacity: 0.9 })
    );
    g0.add(lobFlowParticles);

    // ==========================================
    // MODE 1: 7-Vector Attack Taxonomy Radar Space
    // ==========================================
    const g1 = modeGroups[1];
    const taxonomyNodes: THREE.Mesh[] = [];
    const taxonomyRays: THREE.Line[] = [];

    // Central Sovereign Citadel
    const citadelCore = new THREE.Mesh(
      new THREE.DodecahedronGeometry(3.4),
      new THREE.MeshStandardMaterial({ color: 0x00a878, metalness: 0.9, roughness: 0.1, emissive: 0x004566 })
    );
    g1.add(citadelCore);

    // Protective Citadel Ring
    const cRing = new THREE.Mesh(
      new THREE.TorusGeometry(6.2, 0.35, 16, 64),
      new THREE.MeshStandardMaterial({ color: 0xd5991c, wireframe: true })
    );
    cRing.rotateX(Math.PI / 2);
    g1.add(cRing);

    // 7 Satellite Attack Vectors (AT-1 through AT-7)
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const r = 14.5;
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const y = Math.sin(i * 1.5) * 3;

      const node = new THREE.Mesh(
        new THREE.OctahedronGeometry(1.3),
        new THREE.MeshStandardMaterial({ color: 0xe63946, emissive: 0x8b1e1e, roughness: 0.2, metalness: 0.8 })
      );
      node.position.set(x, y, z);
      g1.add(node);
      taxonomyNodes.push(node);

      // Ray beam to citadel
      const rayGeo = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, y, z),
        new THREE.Vector3(0, 0, 0)
      ]);
      const ray = new THREE.Line(rayGeo, new THREE.LineBasicMaterial({ color: 0xd5991c, transparent: true, opacity: 0.55 }));
      g1.add(ray);
      taxonomyRays.push(ray);
    }

    // ==========================================
    // MODE 2: 3D ROC-Space Hyper-Surface
    // ==========================================
    const g2 = modeGroups[2];
    const rocGeo = new THREE.PlaneGeometry(30, 30, 36, 36);
    rocGeo.rotateX(-Math.PI / 2);
    const rocMat = new THREE.MeshStandardMaterial({
      color: 0x2a0845,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.8
    });
    const rocSurface = new THREE.Mesh(rocGeo, rocMat);
    g2.add(rocSurface);

    // 8-Layer Sovereign AUROC Curvature Arc (Near-ideal upper boundary)
    const sovPoints: THREE.Vector3[] = [];
    for (let t = 0; t <= 1; t += 0.04) {
      const fpr = t * 26 - 13;
      const tpr = Math.pow(t, 0.08) * 14 - 1; // Near perfect steep curve
      sovPoints.push(new THREE.Vector3(fpr, tpr, 0));
    }
    const sovGeo = new THREE.BufferGeometry().setFromPoints(sovPoints);
    const rocCurveSovereign = new THREE.Line(sovGeo, new THREE.LineBasicMaterial({ color: 0x00a878, linewidth: 3 }));
    g2.add(rocCurveSovereign);

    // Baseline Gen-1 Detector Curve (Suffers severe false alarms on SEC filings)
    const basePoints: THREE.Vector3[] = [];
    for (let t = 0; t <= 1; t += 0.04) {
      const fpr = t * 26 - 13;
      const tpr = Math.pow(t, 0.55) * 11 - 1; // Sluggish, high false alarm curve
      basePoints.push(new THREE.Vector3(fpr, tpr, 2));
    }
    const baseGeo = new THREE.BufferGeometry().setFromPoints(basePoints);
    const rocCurveBaseline = new THREE.Line(baseGeo, new THREE.LineBasicMaterial({ color: 0xe63946, linewidth: 2 }));
    g2.add(rocCurveBaseline);

    // Operating point indicator marker
    const rocMarker = new THREE.Mesh(
      new THREE.SphereGeometry(0.8, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0xd5991c, emissive: 0x410217 })
    );
    rocMarker.position.set(-11, 12, 0);
    g2.add(rocMarker);

    // ==========================================
    // MODE 3: SEC 10-K vs Sybil Clustering Subspace
    // ==========================================
    const g3 = modeGroups[3];
    const pCount = 1000;
    const pPositions = new Float32Array(pCount * 3);
    const pColors = new Float32Array(pCount * 3);

    for (let i = 0; i < pCount; i++) {
      const isSec = i < 500;
      // SEC Cluster (tight emerald cloud centered at (-8, 1, 0))
      // Sybil Cluster (diffuse crimson cloud centered at (8, -1, 0))
      const cx = isSec ? -8 : 8;
      const cy = isSec ? 1.5 : -1.5;
      const spread = isSec ? 3.2 : 5.8;

      pPositions[i * 3] = cx + (Math.random() - 0.5) * spread;
      pPositions[i * 3 + 1] = cy + (Math.random() - 0.5) * spread;
      pPositions[i * 3 + 2] = (Math.random() - 0.5) * spread;

      if (isSec) {
        // Emerald
        pColors[i * 3] = 0.0;
        pColors[i * 3 + 1] = 0.66;
        pColors[i * 3 + 2] = 0.47;
      } else {
        // Crimson
        pColors[i * 3] = 0.9;
        pColors[i * 3 + 1] = 0.22;
        pColors[i * 3 + 2] = 0.27;
      }
    }

    const clusterGeo = new THREE.BufferGeometry();
    clusterGeo.setAttribute('position', new THREE.BufferAttribute(pPositions, 3));
    clusterGeo.setAttribute('color', new THREE.BufferAttribute(pColors, 3));
    const clusterMat = new THREE.PointsMaterial({ size: 0.45, vertexColors: true, transparent: true, opacity: 0.9 });
    const clusteringPoints = new THREE.Points(clusterGeo, clusterMat);
    g3.add(clusteringPoints);

    // Separating Hyperplane (Translucent Gold Plane at x = 0)
    const hpGeo = new THREE.PlaneGeometry(16, 20);
    hpGeo.rotateY(Math.PI / 2);
    const hpMat = new THREE.MeshBasicMaterial({ color: 0xd5991c, wireframe: true, transparent: true, opacity: 0.45 });
    const decisionHyperplane = new THREE.Mesh(hpGeo, hpMat);
    decisionHyperplane.position.set(0, 0, 0);
    g3.add(decisionHyperplane);

    // Save refs
    threeState.current = {
      renderer,
      scene,
      camera,
      controls,
      modeGroups,
      lobBids,
      lobAsks,
      predatoryWall: wallMesh,
      circuitBreakerPlane,
      lobFlowParticles,
      midPriceLine,
      rocSurface,
      rocCurveSovereign,
      rocCurveBaseline,
      rocMarker,
      taxonomyNodes,
      taxonomyRays,
      citadelCore,
      clusteringPoints,
      decisionHyperplane,
      clock: new THREE.Clock(),
      animId: null,
      isAttack: isAttackInjected,
      intensity: attackIntensity / 100,
      speed: simSpeed,
      currentMode: webglMode,
      selectedTaxonomy
    };

    // Animation Loop
    const animate = () => {
      const state = threeState.current;
      const delta = state.clock.getDelta() * state.speed;
      const time = state.clock.getElapsedTime() * state.speed;
      const intensity = state.intensity || 0.85;

      state.controls?.update();

      // Mode 0: LOB Canyon oscillations
      if (state.currentMode === 0) {
        state.lobBids.forEach((b, i) => {
          b.scale.y = 1 + Math.sin(time * 3 + i) * 0.12;
        });
        state.lobAsks.forEach((a, i) => {
          a.scale.y = 1 + Math.cos(time * 3 + i) * 0.12;
        });
        if (state.predatoryWall) {
          state.predatoryWall.visible = state.isAttack;
          if (state.isAttack) {
            state.predatoryWall.scale.y = (1 + Math.sin(time * 10) * 0.15) * intensity;
          }
        }
        if (state.circuitBreakerPlane) {
          state.circuitBreakerPlane.visible = !state.isAttack;
          state.circuitBreakerPlane.rotation.z = Math.sin(time * 0.5) * 0.05;
        }
        if (state.midPriceLine) {
          state.midPriceLine.position.y = state.isAttack ? -2.5 * intensity : 0;
        }
        if (state.lobFlowParticles) {
          const pos = state.lobFlowParticles.geometry.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            let pz = pos.getZ(i) + delta * 9;
            if (pz > 10) pz = -10;
            pos.setZ(i, pz);
          }
          pos.needsUpdate = true;
        }
      }

      // Mode 1: Taxonomy satellites orbit
      if (state.currentMode === 1) {
        state.modeGroups[1].rotation.y += delta * 0.2;
        if (state.citadelCore) {
          state.citadelCore.rotation.y += delta * 0.5;
          state.citadelCore.rotation.x += delta * 0.25;
        }
        state.taxonomyNodes.forEach((node, i) => {
          const isSelected = i === state.selectedTaxonomy;
          const mat = node.material as THREE.MeshStandardMaterial;
          if (isSelected) {
            mat.emissive.setHex(0xd5991c);
            node.scale.setScalar(1.4 + Math.sin(time * 5) * 0.2);
          } else {
            mat.emissive.setHex(0x8b1e1e);
            node.scale.setScalar(1.0);
          }
        });
      }

      // Mode 2: ROC Manifold deformation
      if (state.currentMode === 2 && state.rocSurface) {
        const geo = state.rocSurface.geometry as THREE.PlaneGeometry;
        const pos = geo.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const vx = pos.getX(i);
          const vz = pos.getZ(i);
          const dist = Math.sqrt(vx * vx + vz * vz);
          pos.setY(i, Math.sin(dist * 0.4 - time * 1.5) * (0.8 * intensity));
        }
        pos.needsUpdate = true;

        if (state.rocMarker) {
          const markerT = (Math.sin(time * 0.8) + 1) * 0.5;
          const fpr = markerT * 26 - 13;
          const tpr = Math.pow(markerT, 0.08) * 14 - 1;
          state.rocMarker.position.set(fpr, tpr, 0);
        }
      }

      // Mode 3: Swarm clusters drift
      if (state.currentMode === 3 && state.clusteringPoints) {
        state.clusteringPoints.rotation.y += delta * 0.15;
        if (state.decisionHyperplane) {
          state.decisionHyperplane.rotation.z = Math.sin(time * 0.8) * 0.04;
        }
      }

      renderer.render(scene, camera);
      state.animId = requestAnimationFrame(animate);
    };

    animate();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: nw, height: nh } = entry.contentRect;
        if (nw > 0 && nh > 0 && camera && renderer) {
          camera.aspect = nw / nh;
          camera.updateProjectionMatrix();
          renderer.setSize(nw, nh);
        }
      }
    });
    resizeObserver.observe(container);

    const handleWindowResize = () => {
      if (!container || !renderer || !camera) return;
      const nw = container.clientWidth || 800;
      const nh = container.clientHeight || 560;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener('resize', handleWindowResize);

    return () => {
      window.removeEventListener('resize', handleWindowResize);
      resizeObserver.disconnect();
      if (threeState.current.animId) cancelAnimationFrame(threeState.current.animId);
      renderer.dispose();
      scene.clear();
      container.innerHTML = '';
      threeState.current.renderer = null;
      threeState.current.scene = null;
      threeState.current.camera = null;
      threeState.current.controls = null;
      threeState.current.modeGroups = [];
    };
  }, [activeTab]);

  useEffect(() => {
    threeState.current.isAttack = isAttackInjected;
    threeState.current.intensity = attackIntensity / 100;
    if (threeState.current.predatoryWall) {
      threeState.current.predatoryWall.visible = isAttackInjected;
    }
    if (threeState.current.circuitBreakerPlane) {
      threeState.current.circuitBreakerPlane.visible = !isAttackInjected;
    }
  }, [isAttackInjected, attackIntensity]);

  useEffect(() => {
    threeState.current.speed = simSpeed;
  }, [simSpeed]);

  useEffect(() => {
    threeState.current.selectedTaxonomy = selectedTaxonomy;
  }, [selectedTaxonomy]);

  useEffect(() => {
    threeState.current.currentMode = webglMode;
    threeState.current.modeGroups.forEach((g, idx) => {
      g.visible = idx === webglMode;
    });
  }, [webglMode]);

  return (
    <div className="min-h-screen bg-[#FBF3E2] text-[#410217]">
      {/* Top Header */}
      <header className="border-b border-[#F2D69D] bg-[#FAF2E1] py-6 px-4 sm:px-6 lg:px-8 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={onNavigateToOverview}
              className="px-2.5 py-1 bg-[#410217] text-[#FBF3E2] text-xs font-mono font-bold uppercase hover:bg-[#5C0A24] cursor-pointer"
            >
              ← Overview
            </button>
            <div>
              <div className="text-[10px] font-mono text-[#D5991C] uppercase font-bold tracking-widest">
                PAGE 2 // EXPERIMENTAL BENCHMARK & SIMULATION SUITE
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#410217]">
                CounterAEO-Bench & Market Stress Lab (Vol. 3)
              </h2>
            </div>
          </div>

          {/* Module Tab Switcher */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F5EAD4] border border-[#F2D69D] text-xs font-mono">
            <button
              onClick={() => setActiveTab('benchmark')}
              className={`px-3 py-1.5 font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'benchmark' ? 'bg-[#410217] text-[#FBF3E2] shadow-xs' : 'text-[#410217]/70 hover:text-[#410217]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-[#D5991C]" />
              <span>1. Live Benchmark Runner</span>
            </button>

            <button
              onClick={() => setActiveTab('flashcrash')}
              className={`px-3 py-1.5 font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'flashcrash' ? 'bg-[#410217] text-[#FBF3E2] shadow-xs' : 'text-[#410217]/70 hover:text-[#410217]'
              }`}
            >
              <TrendingDown className="w-3.5 h-3.5 text-[#8B1E1E]" />
              <span>2. Flash-Crash LOB Replay</span>
            </button>

            <button
              onClick={() => setActiveTab('charts')}
              className={`px-3 py-1.5 font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'charts' ? 'bg-[#410217] text-[#FBF3E2] shadow-xs' : 'text-[#410217]/70 hover:text-[#410217]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#D5991C]" />
              <span>3. Whitepaper Figures</span>
            </button>

            <button
              onClick={() => setActiveTab('webgl')}
              className={`px-3 py-1.5 font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'webgl' ? 'bg-[#410217] text-[#FBF3E2] shadow-xs' : 'text-[#410217]/70 hover:text-[#410217]'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-[#00A878]" />
              <span>4. WebGL 3D Engine</span>
            </button>


            <button
              onClick={onSwitchToPaper}
              className="ml-2 px-3 py-1.5 bg-[#FAF2E1] border border-[#F2D69D] hover:bg-[#F2D69D]/50 text-[#8B1E1E] font-bold transition-all cursor-pointer flex items-center space-x-1.5"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Read Full Paper (Page 1) →</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        
        {/* ========================================================
            TAB 1: LIVE BENCHMARK RUNNER & ALGORITHM EXECUTION
           ======================================================== */}
        {activeTab === 'benchmark' && (
          <div className="space-y-8">
            {/* Header Description */}
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-[#D5991C] uppercase font-bold tracking-wider">
                  // SECTION 16 & 17 ALGORITHM EXECUTION
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#410217]">
                  CounterAEO-Bench Empirical Simulation Suite
                </h3>
                <p className="font-sans text-sm text-[#410217]/75">
                  Direct client-side execution of Section 19 (<code className="text-[#8B1E1E]">counter_aeo_benchmark_suite.py</code>) across {sampleSize.toLocaleString()} statistically calibrated document trials.
                </p>
              </div>

              {/* Controls */}
              <div className="flex flex-wrap items-center gap-3 font-mono text-xs">
                <button
                  onClick={() => setBenchmarkSeed((s) => s + 1)}
                  className="px-3 py-1.5 bg-[#FAF2E1] border border-[#F2D69D] hover:bg-[#F2D69D]/40 text-[#410217] font-bold flex items-center space-x-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#D5991C]" />
                  <span>Reseed Generator</span>
                </button>

                <div className="flex items-center space-x-1 bg-[#FAF2E1] border border-[#F2D69D] px-2 py-1">
                  <span className="text-[#410217]/60">N =</span>
                  <select
                    value={sampleSize}
                    onChange={(e) => setSampleSize(Number(e.target.value))}
                    className="bg-transparent font-bold text-[#410217] cursor-pointer outline-hidden"
                  >
                    <option value={1000}>1,000</option>
                    <option value={2000}>2,000</option>
                    <option value={3500}>3,500</option>
                    <option value={5000}>5,000</option>
                  </select>
                </div>

                <div className="flex items-center space-x-1 bg-[#FAF2E1] border border-[#F2D69D] px-2 py-1">
                  <span className="text-[#410217]/60">Adv Ratio:</span>
                  <select
                    value={attackRatio}
                    onChange={(e) => setAttackRatio(Number(e.target.value))}
                    className="bg-transparent font-bold text-[#410217] cursor-pointer outline-hidden"
                  >
                    <option value={0.2}>20% Adv / 80% Clean</option>
                    <option value={0.5}>50% Adv / 50% Clean</option>
                    <option value={0.7}>70% Adv / 30% Clean</option>
                  </select>
                </div>

                <button
                  onClick={() => setC2paExemptionActive((v) => !v)}
                  className={`px-3 py-1.5 border font-bold flex items-center space-x-1.5 transition-colors cursor-pointer ${
                    c2paExemptionActive
                      ? 'bg-[#00A878] text-[#130108] border-[#00A878]'
                      : 'bg-[#FAF2E1] text-[#8B1E1E] border-[#8B1E1E]'
                  }`}
                  title="Toggle C2PA Root Exemption for genuine SEC 10-K filings"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>C2PA Root: {c2paExemptionActive ? 'ACTIVE (SEC Safe)' : 'DISABLED (Gen-1 Mode)'}</span>
                </button>
              </div>
            </div>

            {/* Metric Comparison Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              
              <div className="bg-[#FAF2E1] border-2 border-[#410217] p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-mono text-[#410217]/70">
                  <span>OVERALL ATTACK RECALL (TPR)</span>
                  <Sparkles className="w-4 h-4 text-[#00A878]" />
                </div>
                <div className="text-3xl font-serif font-bold text-[#00A878]">
                  {(sovereignMetrics.overallTpr * 100).toFixed(1)}%
                </div>
                <div className="text-xs font-mono text-[#410217]/80 flex justify-between pt-1 border-t border-[#F2D69D]">
                  <span>Gen-1 Baseline:</span>
                  <span className="font-bold text-[#8B1E1E]">{(gen1Metrics.overallTpr * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className="bg-[#FAF2E1] border-2 border-[#410217] p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-mono text-[#410217]/70">
                  <span>SEC 10-K FALSE ALARM RATE</span>
                  <Shield className="w-4 h-4 text-[#D5991C]" />
                </div>
                <div className="text-3xl font-serif font-bold text-[#00A878]">
                  {(sovereignMetrics.sec10kFpr * 100).toFixed(2)}%
                </div>
                <div className="text-xs font-mono text-[#410217]/80 flex justify-between pt-1 border-t border-[#F2D69D]">
                  <span>Gen-1 False Alarm:</span>
                  <span className="font-bold text-[#8B1E1E]">{(gen1Metrics.sec10kFpr * 100).toFixed(1)}% (Broken)</span>
                </div>
              </div>

              <div className="bg-[#FAF2E1] border-2 border-[#410217] p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-mono text-[#410217]/70">
                  <span>COMPOSITE MACRO F1</span>
                  <Activity className="w-4 h-4 text-[#D5991C]" />
                </div>
                <div className="text-3xl font-serif font-bold text-[#410217]">
                  {sovereignMetrics.macroF1.toFixed(3)}
                </div>
                <div className="text-xs font-mono text-[#410217]/80 flex justify-between pt-1 border-t border-[#F2D69D]">
                  <span>Gen-1 Macro F1:</span>
                  <span className="font-bold text-[#8B1E1E]">{gen1Metrics.macroF1.toFixed(3)}</span>
                </div>
              </div>

              <div className="bg-[#FAF2E1] border-2 border-[#410217] p-4 space-y-2 shadow-xs">
                <div className="flex items-center justify-between text-xs font-mono text-[#410217]/70">
                  <span>BATCH EVAL TIME ({sampleSize})</span>
                  <Clock className="w-4 h-4 text-[#00A878]" />
                </div>
                <div className="text-3xl font-serif font-bold text-[#410217]">
                  {sovereignMetrics.elapsedMs.toFixed(1)} <span className="text-base font-normal font-sans">ms</span>
                </div>
                <div className="text-xs font-mono text-[#410217]/80 flex justify-between pt-1 border-t border-[#F2D69D]">
                  <span>Per-Trial Latency:</span>
                  <span className="font-bold text-[#00A878]">{(sovereignMetrics.elapsedMs / sampleSize * 1000).toFixed(1)} µs</span>
                </div>
              </div>

            </div>

            {/* Category Breakdown Table */}
            <div className="bg-[#FAF2E1] border border-[#F2D69D] p-6 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F2D69D] pb-3">
                <div className="font-serif font-bold text-lg text-[#410217]">
                  Live Threat Category Detection Telemetry
                </div>
                <span className="font-mono text-xs text-[#D5991C]">
                  {sampleSize.toLocaleString()} Trials Evaluated (Seed #{benchmarkSeed})
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead className="bg-[#410217] text-[#FBF3E2] font-mono uppercase text-[11px]">
                    <tr>
                      <th className="p-2.5 border-r border-[#F2D69D]/30">Attack Category</th>
                      <th className="p-2.5 border-r border-[#F2D69D]/30">Tested Trials</th>
                      <th className="p-2.5 border-r border-[#F2D69D]/30">Gen-1 Detected</th>
                      <th className="p-2.5 border-r border-[#F2D69D]/30 text-[#8B1E1E]">Gen-1 Recall</th>
                      <th className="p-2.5 border-r border-[#F2D69D]/30">8-Layer Detected</th>
                      <th className="p-2.5 border-r border-[#F2D69D]/30 text-[#00A878]">8-Layer Recall</th>
                      <th className="p-2.5">Net Gain</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2D69D]">
                    {Object.keys(sovereignMetrics.categoryBreakdown).map((cat) => {
                      const sov = sovereignMetrics.categoryBreakdown[cat];
                      const g1 = gen1Metrics.categoryBreakdown[cat] || { detected: 0, total: sov.total, recall: 0 };
                      const gain = (sov.recall - g1.recall) * 100;

                      return (
                        <tr key={cat} className="hover:bg-[#FFFDF8]">
                          <td className="p-2.5 font-mono font-bold text-[#410217]">{cat}</td>
                          <td className="p-2.5 font-mono">{sov.total.toLocaleString()}</td>
                          <td className="p-2.5 font-mono text-[#410217]/70">{g1.detected.toLocaleString()}</td>
                          <td className="p-2.5 font-mono text-[#8B1E1E]">{(g1.recall * 100).toFixed(1)}%</td>
                          <td className="p-2.5 font-mono font-bold text-[#410217]">{sov.detected.toLocaleString()}</td>
                          <td className="p-2.5 font-mono font-bold text-[#00A878]">{(sov.recall * 100).toFixed(1)}%</td>
                          <td className="p-2.5 font-mono font-bold text-[#D5991C]">
                            {gain >= 0 ? `+${gain.toFixed(1)}%` : `${gain.toFixed(1)}%`}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Single Sample Interactive Probe Inspector */}
            <div className="bg-[#FAF2E1] border-2 border-[#410217] p-6 shadow-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#F2D69D] pb-3">
                <div>
                  <span className="font-mono text-xs text-[#D5991C] uppercase font-bold tracking-wider">
                    // SINGLE-TRIAL DEEP PROBE INSPECTOR
                  </span>
                  <h4 className="font-serif font-bold text-xl text-[#410217]">
                    Trace a Document Trial Through All 8 Decision Gates
                  </h4>
                </div>

                <div className="flex items-center space-x-2 font-mono text-xs">
                  <span className="text-[#410217]/70">Select Target Class:</span>
                  <select
                    value={selectedProbeCategory}
                    onChange={(e) => setSelectedProbeCategory(e.target.value)}
                    className="bg-[#FFFDF8] border border-[#F2D69D] px-3 py-1 font-bold text-[#410217] cursor-pointer"
                  >
                    <option value="CLEAN_SEC_10K_TABLE">CLEAN_SEC_10K_TABLE (Dense 10-K Table)</option>
                    <option value="CLEAN_PROSE">CLEAN_PROSE (Standard News)</option>
                    <option value="AT-1_HUB">AT-1: Universal Vector Hub</option>
                    <option value="AT-2_STUFF">AT-2: Authority/Quote Stuffing</option>
                    <option value="AT-3_AIP">AT-3: Adversarial Prompt Injection</option>
                    <option value="AT-4_SYBIL">AT-4: Hawkes Sybil Consensus</option>
                    <option value="AT-5_SPLIT">AT-5: Split-Payload Enthymeme</option>
                    <option value="AT-6_LOB_TRAP">AT-6: Data-Void LOB Liquidity Trap</option>
                    <option value="AT-7_SLOW_MULTIMODAL">AT-7: Slow-Boil Memory & Multimodal</option>
                  </select>
                </div>
              </div>

              {/* Sample Data & Verdicts */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-mono text-xs">
                
                {/* Column 1: Raw Trial Telemetry */}
                <div className="bg-[#FFFDF8] border border-[#F2D69D] p-4 space-y-2">
                  <div className="text-[10px] text-[#D5991C] font-bold uppercase tracking-wider border-b border-[#F2D69D] pb-1">
                    Input Sample Telemetry ({probeSample.sample_id})
                  </div>
                  <div className="space-y-1.5 text-[11px] text-[#410217]/85">
                    <div className="flex justify-between">
                      <span>C2PA HSM Root:</span>
                      <span className={`font-bold ${probeSample.has_valid_c2pa_root ? 'text-[#00A878]' : 'text-[#8B1E1E]'}`}>
                        {probeSample.has_valid_c2pa_root ? 'VALID_ROOT' : 'UNSIGNED'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Local Intrinsic Dim (LID):</span>
                      <span className="font-bold text-[#410217]">{probeSample.local_intrinsic_dim.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Spectral Entropy:</span>
                      <span className="font-bold text-[#410217]">{probeSample.spectral_entropy.toFixed(2)} nats</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ranks (D / C / S):</span>
                      <span className="font-bold text-[#410217]">
                        #{probeSample.ranks_dense_colbert_sparse.dense} / #{probeSample.ranks_dense_colbert_sparse.colbert} / #{probeSample.ranks_dense_colbert_sparse.sparse}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Fact Density (IGPR):</span>
                      <span className={`font-bold ${probeSample.igpr_density_ratio > 3.5 ? 'text-[#8B1E1E]' : 'text-[#410217]'}`}>
                        {probeSample.igpr_density_ratio.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Hawkes Sybil Score:</span>
                      <span className={`font-bold ${probeSample.hawkes_sybil_score > 0.65 ? 'text-[#8B1E1E]' : 'text-[#410217]'}`}>
                        {probeSample.hawkes_sybil_score.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Möbius KL Synergy:</span>
                      <span className={`font-bold ${probeSample.mobius_kl_synergy > 0.35 ? 'text-[#8B1E1E]' : 'text-[#410217]'}`}>
                        {probeSample.mobius_kl_synergy.toFixed(2)} nats
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>RAG Surprise / LOB Cap:</span>
                      <span className="font-bold text-[#410217]">
                        {probeSample.rag_surprise_nats.toFixed(2)} / {probeSample.lob_capital_capacity.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>DMEM Martingale Ratio:</span>
                      <span className={`font-bold ${probeSample.dmem_martingale_ratio > 3.2 ? 'text-[#8B1E1E]' : 'text-[#410217]'}`}>
                        {probeSample.dmem_martingale_ratio.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Saliency Leakage:</span>
                      <span className={`font-bold ${probeSample.cm_jsas_saliency_leakage > 0.18 ? 'text-[#8B1E1E]' : 'text-[#410217]'}`}>
                        {(probeSample.cm_jsas_saliency_leakage * 100).toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Column 2: Gen-1 Decision */}
                <div className={`p-4 border space-y-3 ${
                  probeGen1Verdict.isFlagged
                    ? 'bg-[#FFEAEB] border-[#8B1E1E]'
                    : 'bg-[#EBF7F2] border-[#00A878]'
                }`}>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#410217]/70 border-b pb-1">
                    Baseline 1 (Gen-1 MAD + IGPR) Decision
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold font-serif">
                      {probeGen1Verdict.isFlagged ? '❌ QUARANTINED' : '✓ PASSED'}
                    </div>
                    <div className="text-[11px] text-[#410217]/80">
                      Score: <strong>{probeGen1Verdict.score.toFixed(2)}</strong> (Threshold 1.00)
                    </div>
                  </div>

                  <div className="space-y-1 text-[11px] border-t pt-2">
                    <div className="flex justify-between">
                      <span>MAD Z-Score &gt; 3.0:</span>
                      <span className="font-bold">{probeGen1Verdict.flags.madZScore ? 'TRIGGERED' : 'CLEAR'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Raw Rank Var &gt; 2500:</span>
                      <span className="font-bold">{probeGen1Verdict.flags.rawRankVar ? 'TRIGGERED' : 'CLEAR'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>IGPR Density &gt; 3.5:</span>
                      <span className="font-bold">{probeGen1Verdict.flags.igprRatio ? 'TRIGGERED' : 'CLEAR'}</span>
                    </div>
                  </div>

                  {probeSample.attack_category === 'CLEAN_SEC_10K_TABLE' && probeGen1Verdict.isFlagged && (
                    <div className="bg-[#8B1E1E] text-[#FBF3E2] p-2 text-[10px] font-bold">
                      ⚠️ PATHOLOGY DETECTED: Gen-1 falsely flags genuine SEC 10-K tables due to dense statistics!
                    </div>
                  )}
                </div>

                {/* Column 3: Sovereign 8-Layer Decision */}
                <div className={`p-4 border space-y-3 ${
                  probeSovereignVerdict.isFlagged
                    ? 'bg-[#FFEAEB] border-[#8B1E1E]'
                    : 'bg-[#EBF7F2] border-[#00A878]'
                }`}>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#410217]/70 border-b pb-1">
                    Proposed 8-Layer Sovereign Stack Decision
                  </div>
                  <div className="space-y-1">
                    <div className="text-xl font-bold font-serif text-[#00A878]">
                      {probeSovereignVerdict.isFlagged ? '🛑 RED-TEAM QUARANTINE' : '🛡️ VERIFIED AUTONOMOUS ENTRY'}
                    </div>
                    <div className="text-[11px] text-[#410217]/80">
                      Composite Anomaly Score: <strong>{probeSovereignVerdict.compositeScore.toFixed(2)}</strong>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-1 text-[10px] border-t pt-2">
                    <div className={`p-1 ${probeSovereignVerdict.layerFlags.l0_canary ? 'bg-[#8B1E1E] text-white' : 'bg-white/80'}`}>
                      L0 Canary: {probeSovereignVerdict.layerFlags.l0_canary ? 'FLAG' : 'OK'}
                    </div>
                    <div className={`p-1 ${probeSovereignVerdict.layerFlags.l1_amcidp ? 'bg-[#8B1E1E] text-white' : 'bg-white/80'}`}>
                      L1 AM-CIDP: {probeSovereignVerdict.layerFlags.l1_amcidp ? 'FLAG' : 'OK'}
                    </div>
                    <div className={`p-1 ${probeSovereignVerdict.layerFlags.l2_ncard ? 'bg-[#8B1E1E] text-white' : 'bg-white/80'}`}>
                      L2 NCARD: {probeSovereignVerdict.layerFlags.l2_ncard ? 'FLAG' : 'OK'}
                    </div>
                    <div className={`p-1 ${probeSovereignVerdict.layerFlags.l3_tcgcl ? 'bg-[#8B1E1E] text-white' : 'bg-white/80'}`}>
                      L3 TCG-CL: {probeSovereignVerdict.layerFlags.l3_tcgcl ? 'FLAG' : 'OK'}
                    </div>
                    <div className={`p-1 ${probeSovereignVerdict.layerFlags.l4a_cehasid ? 'bg-[#8B1E1E] text-white' : 'bg-white/80'}`}>
                      L4A CEH-ASID: {probeSovereignVerdict.layerFlags.l4a_cehasid ? 'FLAG' : 'OK'}
                    </div>
                    <div className={`p-1 ${probeSovereignVerdict.layerFlags.l4b_tmmeg ? 'bg-[#8B1E1E] text-white' : 'bg-white/80'}`}>
                      L4B TMMEG: {probeSovereignVerdict.layerFlags.l4b_tmmeg ? 'FLAG' : 'OK'}
                    </div>
                    <div className={`p-1 ${probeSovereignVerdict.layerFlags.l5_dmem ? 'bg-[#8B1E1E] text-white' : 'bg-white/80'}`}>
                      L5 DMEM: {probeSovereignVerdict.layerFlags.l5_dmem ? 'FLAG' : 'OK'}
                    </div>
                    <div className={`p-1 ${probeSovereignVerdict.layerFlags.l7_cmjsas ? 'bg-[#8B1E1E] text-white' : 'bg-white/80'}`}>
                      L7 CM-JSAS: {probeSovereignVerdict.layerFlags.l7_cmjsas ? 'FLAG' : 'OK'}
                    </div>
                  </div>

                  {probeSample.attack_category === 'CLEAN_SEC_10K_TABLE' && !probeSovereignVerdict.isFlagged && (
                    <div className="bg-[#00A878] text-[#130108] p-2 text-[10px] font-bold">
                      ✓ C2PA Cryptographic Root Exemption verified SEC 10-K authenticity (0.00% False Alarm).
                    </div>
                  )}
                </div>

              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 2: HIGH-FREQUENCY FLASH-CRASH LOB SIMULATOR
           ======================================================== */}
        {activeTab === 'flashcrash' && (
          <div className="space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-[#8B1E1E] uppercase font-bold tracking-wider">
                  // SECTION 18 HISTORICAL MARKET REPLAY
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#410217]">
                  Scenario Alpha: Pre-Market LOB Data-Void Spoofing & Flash Crash
                </h3>
                <p className="font-sans text-sm text-[#410217]/75">
                  Replays the $45M predatory ask-wall liquidity extraction attack on mid-cap aerospace stock ($DFNS) tick-by-tick.
                </p>
              </div>

              {/* Playback Controls */}
              <div className="flex items-center space-x-2 font-mono text-xs">
                <button
                  onClick={() => setIsPlayingReplay((p) => !p)}
                  className={`px-3 py-1.5 border font-bold flex items-center space-x-1.5 cursor-pointer transition-colors ${
                    isPlayingReplay ? 'bg-[#8B1E1E] text-[#FBF3E2] border-[#8B1E1E]' : 'bg-[#410217] text-[#FBF3E2] border-[#D5991C]'
                  }`}
                >
                  {isPlayingReplay ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{isPlayingReplay ? 'Pause' : 'Play Replay'}</span>
                </button>

                <button
                  onClick={() => setCurrentTickIdx((p) => Math.min(replayTicks.length - 1, p + 1))}
                  className="px-2.5 py-1.5 bg-[#FAF2E1] border border-[#F2D69D] hover:bg-[#F2D69D]/40 text-[#410217] font-bold cursor-pointer"
                  title="Step 1 Tick Forward"
                >
                  <SkipForward className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => {
                    setIsPlayingReplay(false);
                    setCurrentTickIdx(0);
                  }}
                  className="px-2.5 py-1.5 bg-[#FAF2E1] border border-[#F2D69D] hover:bg-[#F2D69D]/40 text-[#410217] font-bold cursor-pointer"
                  title="Reset Replay"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>

                <div className="flex items-center space-x-1 bg-[#FAF2E1] border border-[#F2D69D] px-2 py-1">
                  <span>Speed:</span>
                  {[1, 2, 5].map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setReplaySpeed(spd)}
                      className={`px-1.5 py-0.5 cursor-pointer font-bold ${replaySpeed === spd ? 'bg-[#410217] text-[#FBF3E2]' : 'text-[#410217]/60'}`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Time Scrub Slider */}
            <div className="bg-[#FAF2E1] border border-[#F2D69D] p-4 space-y-2">
              <div className="flex items-center justify-between font-mono text-xs text-[#410217]">
                <span className="font-bold text-[#8B1E1E]">{currentTick.timestamp}</span>
                <span>Offset: {currentTick.timeOffsetSeconds > 0 ? `+${currentTick.timeOffsetSeconds}s` : `${currentTick.timeOffsetSeconds}s`}</span>
                <span className="font-bold text-[#00A878]">Mid-Price: ${currentTick.currentMidPrice.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min={0}
                max={replayTicks.length - 1}
                value={currentTickIdx}
                onChange={(e) => setCurrentTickIdx(Number(e.target.value))}
                className="w-full accent-[#410217] cursor-pointer"
              />
              <div className="font-sans text-xs text-[#410217]/80 italic pt-1">
                // {currentTick.annotation}
              </div>
            </div>

            {/* Live Order Book Depth & PnL Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Level 2 Limit Order Book Ladder */}
              <div className="lg:col-span-7 bg-[#363636] border-2 border-[#410217] p-5 shadow-xl text-[#FBF3E2] font-mono text-xs space-y-4">
                <div className="flex items-center justify-between border-b border-[#F2D69D]/30 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className="text-[#D5991C] font-bold uppercase">$DFNS LIMIT ORDER BOOK (LOB)</span>
                    {currentTick.circuitBreakerActive && (
                      <span className="px-2 py-0.5 bg-[#00A878] text-[#130108] text-[10px] font-bold">
                        HALTED // SEC RULE 15c3-8
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-[#FBF3E2]/60">Spread: ${(currentTick.bestAsk - currentTick.bestBid).toFixed(2)}</span>
                </div>

                {/* Depth Ladder */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Bids */}
                  <div className="space-y-1">
                    <div className="text-[10px] text-[#D5991C] font-bold uppercase border-b border-[#F2D69D]/20 pb-1 flex justify-between">
                      <span>BIDS (BUY)</span>
                      <span>SHARES</span>
                    </div>
                    {currentTick.bidsDepth.map((b, i) => (
                      <div key={i} className="flex justify-between items-center py-1 px-1.5 bg-[#2C0212]/80 border-r-2 border-[#D5991C]">
                        <span className="text-[#D5991C] font-bold">${b.price.toFixed(2)}</span>
                        <span>{b.volume.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>

                  {/* Asks */}
                  <div className="space-y-1">
                    <div className="text-[10px] text-[#E63946] font-bold uppercase border-b border-[#F2D69D]/20 pb-1 flex justify-between">
                      <span>ASKS (SELL)</span>
                      <span>SHARES</span>
                    </div>
                    {currentTick.asksDepth.map((a, i) => {
                      const isPredatory = currentTick.predatoryAskWallActive && a.volume > 20000;
                      return (
                        <div
                          key={i}
                          className={`flex justify-between items-center py-1 px-1.5 border-l-2 ${
                            isPredatory
                              ? 'bg-[#E63946] text-[#FBF3E2] font-bold border-[#FFF] animate-pulse'
                              : 'bg-[#2C0212]/80 border-[#8B1E1E] text-[#FBF3E2]'
                          }`}
                        >
                          <span className={isPredatory ? 'text-[#FFF]' : 'text-[#E63946]'}>${a.price.toFixed(2)}</span>
                          <span>{isPredatory ? `${a.volume.toLocaleString()} (PREDATORY)` : a.volume.toLocaleString()}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {currentTick.predatoryAskWallActive && (
                  <div className="bg-[#3A0318] border border-[#E63946] p-2.5 text-[11px] text-[#FBF3E2] flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-[#E63946] shrink-0" />
                    <span>
                      Predatory $45M Ask Wall resting at <strong>${currentTick.bestAsk.toFixed(2)} (+3.5%)</strong>. Unprotected AI funds are sweeping buys directly into attacker inventory!
                    </span>
                  </div>
                )}
              </div>

              {/* Right Column: Comparative PnL & Fund Survival */}
              <div className="lg:col-span-5 space-y-4">
                
                <div className="bg-[#FAF2E1] border-2 border-[#8B1E1E] p-4 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-xs font-mono text-[#8B1E1E] font-bold">
                    <span>UNPROTECTED RAG FUND</span>
                    <span>DRAWDOWN</span>
                  </div>
                  <div className={`text-3xl font-serif font-bold ${currentTick.unprotectedFundPnlPct < 0 ? 'text-[#8B1E1E]' : 'text-[#410217]'}`}>
                    {currentTick.unprotectedFundPnlPct >= 0 ? `+${currentTick.unprotectedFundPnlPct.toFixed(1)}%` : `${currentTick.unprotectedFundPnlPct.toFixed(1)}%`}
                  </div>
                  <div className="text-xs font-mono text-[#410217]/70">
                    Max Capital Loss: <strong className="text-[#8B1E1E]">-$14.2M (Liquidated)</strong>
                  </div>
                </div>

                <div className="bg-[#FAF2E1] border border-[#F2D69D] p-4 space-y-2 shadow-xs">
                  <div className="flex items-center justify-between text-xs font-mono text-[#410217]/70 font-bold">
                    <span>GEN-1 DEFENSES (MAD + IGPR)</span>
                    <span>DRAWDOWN</span>
                  </div>
                  <div className={`text-2xl font-serif font-bold ${currentTick.gen1FundPnlPct < 0 ? 'text-[#8B1E1E]' : 'text-[#410217]'}`}>
                    {currentTick.gen1FundPnlPct >= 0 ? `+${currentTick.gen1FundPnlPct.toFixed(1)}%` : `${currentTick.gen1FundPnlPct.toFixed(1)}%`}
                  </div>
                  <div className="text-xs font-mono text-[#410217]/70">
                    Delayed Exit Loss: <strong className="text-[#8B1E1E]">-$4.8M</strong>
                  </div>
                </div>

                <div className="bg-[#FAF2E1] border-2 border-[#00A878] p-4 space-y-2 shadow-md">
                  <div className="flex items-center justify-between text-xs font-mono text-[#00A878] font-bold">
                    <span>SOVEREIGN 8-LAYER STACK</span>
                    <span>RULE 15c3-8 SHIELD</span>
                  </div>
                  <div className="text-3xl font-serif font-bold text-[#00A878]">
                    0.00%
                  </div>
                  <div className="text-xs font-mono text-[#410217]/80">
                    Halt Response: <strong className="text-[#00A878]">14.2 ms</strong> | Loss Avoided: <strong>$14.2M</strong>
                  </div>
                </div>

              </div>

            </div>
          </div>
        )}

        {/* ========================================================
            TAB 3: WHITEPAPER CHARTS & FIGURES (FIGURE 9, 10, TABLES 7 & 8)
           ======================================================== */}
        {activeTab === 'charts' && (
          <div className="space-y-10">
            <div>
              <span className="font-mono text-xs text-[#D5991C] uppercase font-bold tracking-wider">
                // PUBLICATION FIGURES & EMPIRICAL CHARTS
              </span>
              <h3 className="font-serif text-2xl font-bold text-[#410217]">
                Interactive Graphical Figures from Volume III
              </h3>
            </div>

            {/* FIGURE 9: ROC Curves */}
            <div className="bg-[#FAF2E1] border-2 border-[#410217] p-6 shadow-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F2D69D] pb-3">
                <div>
                  <span className="font-mono text-xs text-[#00A878] font-bold uppercase">// FIGURE 9</span>
                  <h4 className="font-serif font-bold text-xl text-[#410217]">
                    Receiver Operating Characteristic (ROC) Comparison
                  </h4>
                </div>
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className="flex items-center gap-1.5 text-[#00A878] font-bold">
                    <span className="w-3 h-3 bg-[#00A878] rounded-full inline-block" /> 8-Layer Stack (AUROC 0.996)
                  </span>
                  <span className="flex items-center gap-1.5 text-[#D5991C] font-bold">
                    <span className="w-3 h-3 bg-[#D5991C] rounded-full inline-block" /> Gen-1 Baseline (AUROC 0.768)
                  </span>
                  <span className="flex items-center gap-1.5 text-[#8B1E1E]">
                    <span className="w-3 h-3 bg-[#8B1E1E] rounded-full inline-block" /> Unprotected (0.512)
                  </span>
                </div>
              </div>

              {/* Interactive SVG ROC Chart */}
              <div className="bg-[#363636] p-4 sm:p-6 border border-[#F2D69D]/30 shadow-inner">
                <svg viewBox="0 0 600 320" className="w-full h-auto">
                  {/* Grid Lines */}
                  {[0, 0.25, 0.5, 0.75, 1.0].map((v, i) => {
                    const y = 280 - v * 240;
                    const x = 50 + v * 500;
                    return (
                      <React.Fragment key={i}>
                        <line x1={50} y1={y} x2={550} y2={y} stroke="#410217" strokeDasharray="3 3" />
                        <line x1={x} y1={40} x2={x} y2={280} stroke="#410217" strokeDasharray="3 3" />
                        <text x={35} y={y + 4} fill="#FBF3E2" fontSize="9" fontFamily="monospace" textAnchor="end">
                          {v.toFixed(2)}
                        </text>
                        <text x={x} y={298} fill="#FBF3E2" fontSize="9" fontFamily="monospace" textAnchor="middle">
                          {v.toFixed(2)}
                        </text>
                      </React.Fragment>
                    );
                  })}

                  {/* Diagonal random guess */}
                  <line x1={50} y1={280} x2={550} y2={40} stroke="#666" strokeDasharray="4 4" strokeWidth="1.5" />

                  {/* Gen-1 Defenses Curve (Hubscan MAD) */}
                  <path
                    d="M 50 280 Q 150 140 280 110 T 550 40"
                    fill="none"
                    stroke="#D5991C"
                    strokeWidth="2.5"
                  />

                  {/* Proposed 8-Layer Sovereign Stack (Near-perfect AUROC 0.996) */}
                  <path
                    d="M 50 280 C 55 52 70 42 550 40"
                    fill="none"
                    stroke="#00A878"
                    strokeWidth="3.5"
                  />

                  {/* Operating Point Circles */}
                  <circle cx={58} cy={44} r={5} fill="#00A878" stroke="#FFF" strokeWidth="1.5" />
                  <text x={70} y={48} fill="#00A878" fontSize="10" fontFamily="monospace" fontWeight="bold">
                    8-Layer Optimum: TPR=99.1%, FPR=0.38%
                  </text>

                  <circle cx={143} cy={135} r={4} fill="#D5991C" stroke="#FFF" strokeWidth="1" />
                  <text x={155} y={138} fill="#D5991C" fontSize="9" fontFamily="monospace">
                    Gen-1 Point: TPR=58.4%, FPR=18.6%
                  </text>

                  {/* Axis Labels */}
                  <text x={300} y={315} fill="#D5991C" fontSize="10" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    False Positive Rate (FPR) on Clean SEC 10-K Filings →
                  </text>
                  <text x={18} y={160} fill="#00A878" fontSize="10" fontFamily="monospace" transform="rotate(-90 18 160)" textAnchor="middle" fontWeight="bold">
                    True Positive Rate (TPR / Attack Recall) →
                  </text>
                </svg>
              </div>
            </div>

            {/* FIGURE 10: Scenario Alpha Trajectory */}
            <div className="bg-[#FAF2E1] border-2 border-[#410217] p-6 shadow-md space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F2D69D] pb-3">
                <div>
                  <span className="font-mono text-xs text-[#8B1E1E] font-bold uppercase">// FIGURE 10</span>
                  <h4 className="font-serif font-bold text-xl text-[#410217]">
                    Intraday Order Book Price & Flash-Crash Cascade ($DFNS)
                  </h4>
                </div>
                <span className="font-mono text-xs text-[#410217]/70">
                  Pre-Market 07:29:45 to 07:30:45 EST
                </span>
              </div>

              <div className="bg-[#363636] p-4 sm:p-6 border border-[#F2D69D]/30 shadow-inner">
                <svg viewBox="0 0 600 260" className="w-full h-auto">
                  {/* Grid Lines */}
                  {[-6, -4, -2, 0, 2, 4, 6, 8].map((v, i) => {
                    const y = 200 - ((v + 6) / 14) * 160;
                    return (
                      <React.Fragment key={i}>
                        <line x1={50} y1={y} x2={560} y2={y} stroke="#410217" strokeDasharray="3 3" />
                        <text x={42} y={y + 3} fill="#FBF3E2" fontSize="9" fontFamily="monospace" textAnchor="end">
                          {v >= 0 ? `+${v}%` : `${v}%`}
                        </text>
                      </React.Fragment>
                    );
                  })}

                  {/* Zero reference line */}
                  <line x1={50} y1={200 - (6 / 14) * 160} x2={560} y2={200 - (6 / 14) * 160} stroke="#F2D69D" strokeWidth="1.5" />

                  {/* Unprotected Price Wave */}
                  <path
                    d="M 50 131 L 180 131 L 240 45 L 340 215 L 560 210"
                    fill="none"
                    stroke="#8B1E1E"
                    strokeWidth="3"
                  />

                  {/* Proposed Sovereign Stack (Zero price distortion) */}
                  <line x1={50} y1={131} x2={560} y2={131} stroke="#00A878" strokeWidth="3" />

                  {/* Markers */}
                  <circle cx={180} cy={131} r={4} fill="#D5991C" />
                  <text x={180} y={120} fill="#D5991C" fontSize="9" fontFamily="monospace" textAnchor="middle">
                    07:30:00 Injected
                  </text>

                  <circle cx={185} cy={131} r={4} fill="#00A878" />
                  <text x={185} y={150} fill="#00A878" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    07:30:00.014 Halt!
                  </text>

                  <circle cx={240} cy={45} r={5} fill="#E63946" />
                  <text x={240} y={35} fill="#E63946" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    Peak +7.8% (Dump $45M)
                  </text>

                  <circle cx={340} cy={215} r={5} fill="#8B1E1E" />
                  <text x={340} y={235} fill="#8B1E1E" fontSize="9" fontFamily="monospace" textAnchor="middle" fontWeight="bold">
                    Flash-Crash -6.4% (-14.2% Net)
                  </text>
                </svg>
              </div>
            </div>

            {/* TABLE 8: Layer-by-Layer Ablation Study */}
            <div className="bg-[#FAF2E1] border border-[#F2D69D] p-6 shadow-xs space-y-4">
              <div className="font-serif font-bold text-lg text-[#410217] border-b border-[#F2D69D] pb-2">
                Table 8: Layer-by-Layer Defense Ablation Study
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-sans text-xs">
                  <thead className="bg-[#410217] text-[#FBF3E2] font-mono uppercase text-[11px]">
                    <tr>
                      <th className="p-3 border-r border-[#F2D69D]/30">Ablated Tier</th>
                      <th className="p-3 border-r border-[#F2D69D]/30">Recall (TPR)</th>
                      <th className="p-3 border-r border-[#F2D69D]/30">SEC 10-K False Alarms (FPR)</th>
                      <th className="p-3 border-r border-[#F2D69D]/30">Scenario Alpha Max Drawdown</th>
                      <th className="p-3">P99 System Latency</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2D69D]">
                    {MASTER_DOC_VOL3_METADATA.table8AblationRows.map((row, i) => (
                      <tr key={i} className={`hover:bg-[#FFFDF8] ${i === 0 ? 'bg-[#F5EAD4] font-bold text-[#410217]' : ''}`}>
                        <td className="p-3 font-mono font-medium">{row.config}</td>
                        <td className="p-3 font-mono text-[#00A878]">{row.tpr}</td>
                        <td className="p-3 font-mono text-[#8B1E1E]">{row.fpr}</td>
                        <td className="p-3 font-mono text-[#D5991C]">{row.maxDd}</td>
                        <td className="p-3 font-mono text-[#410217]/70">{row.p99Latency}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 4: WEBGL 2.0 3D PHYSICS & RADAR ENGINE
           ======================================================== */}
        {activeTab === 'webgl' && (
          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-[#00A878] uppercase font-bold tracking-wider flex items-center space-x-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#00A878]" />
                  <span>// WEBGL 2.0 3D EXPERIMENTAL ENGINE & THREAT RADAR</span>
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#410217]">
                  High-Frequency Market Microstructure & Threat Radar
                </h3>
              </div>

              {/* Mode Selectors */}
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                {[
                  { id: 0, label: 'Mode 0: 3D LOB Canyon & Flash-Crash' },
                  { id: 1, label: 'Mode 1: 7-Vector Attack Taxonomy Radar' },
                  { id: 2, label: 'Mode 2: 3D ROC-Space Hyper-Surface' },
                  { id: 3, label: 'Mode 3: SEC 10-K vs Sybil Subspace' }
                ].map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setWebglMode(m.id)}
                    className={`px-3 py-1.5 border font-bold cursor-pointer transition-all ${
                      webglMode === m.id
                        ? 'bg-[#410217] text-[#FBF3E2] border-[#00A878] shadow-sm'
                        : 'bg-[#FAF2E1] text-[#410217] border-[#F2D69D] hover:bg-[#F2D69D]/40'
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3D WebGL Canvas Container */}
            <div className="relative rounded-none border-2 border-[#410217] bg-[#363636] overflow-hidden shadow-2xl h-[600px] min-h-[600px]">
              <div ref={threeMountRef} className="w-full h-full min-h-[600px]" style={{ width: '100%', height: '600px' }} />

              {/* Top-Left Red-Team Probe Overlay Controls */}
              <div className="absolute top-4 left-4 z-20 space-y-2 font-mono text-xs max-w-sm sm:max-w-md">
                <div className="bg-[#363636]/95 backdrop-blur-md border border-[#F2D69D]/30 p-3 space-y-2.5 text-[#FBF3E2] shadow-2xl">
                  <div className="flex items-center justify-between border-b border-[#F2D69D]/20 pb-1.5">
                    <span className="text-[10px] text-[#D5991C] font-bold uppercase tracking-wider flex items-center space-x-1.5">
                      <Zap className="w-3.5 h-3.5 text-[#D5991C]" />
                      <span>Interactive Red-Team Probe</span>
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 bg-[#410217] text-[#FAF2E1] font-bold">
                      MODE 0{webglMode}
                    </span>
                  </div>

                  {/* Mode-Specific Probes */}
                  {webglMode === 0 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-[#FAF2E1]/70">Scenario Alpha: Order Book Spoof & Liquidity Vacuum</div>
                      <div className="flex flex-wrap gap-1.5">
                        <button
                          onClick={() => setIsAttackInjected(true)}
                          className={`px-2.5 py-1 text-[10px] border font-bold uppercase cursor-pointer flex items-center space-x-1 transition-all ${
                            isAttackInjected ? 'bg-[#E63946] text-[#FBF3E2] border-[#E63946]' : 'bg-[#2a2a2a] text-[#E63946] border-[#E63946]/50 hover:bg-[#E63946]/20'
                          }`}
                        >
                          <Zap className="w-3 h-3" />
                          <span>Inject $45M Ask Wall</span>
                        </button>
                        <button
                          onClick={() => setIsAttackInjected(false)}
                          className={`px-2.5 py-1 text-[10px] border font-bold uppercase cursor-pointer flex items-center space-x-1 transition-all ${
                            !isAttackInjected ? 'bg-[#00A878] text-[#130108] border-[#00A878]' : 'bg-[#2a2a2a] text-[#00A878] border-[#00A878]/50 hover:bg-[#00A878]/20'
                          }`}
                        >
                          <Shield className="w-3 h-3" />
                          <span>Engage 14.2ms Circuit Breaker</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {webglMode === 1 && (
                    <div className="space-y-2">
                      <div className="text-[10px] text-[#FAF2E1]/70">Target Threat Vector Satellite:</div>
                      <div className="grid grid-cols-4 gap-1">
                        {[
                          { id: 0, label: 'AT-1 Inject' },
                          { id: 1, label: 'AT-2 Sybil' },
                          { id: 2, label: 'AT-3 Latent' },
                          { id: 3, label: 'AT-4 LOB' },
                          { id: 4, label: 'AT-5 Drift' },
                          { id: 5, label: 'AT-6 Stego' },
                          { id: 6, label: 'AT-7 Split' }
                        ].map((v) => (
                          <button
                            key={v.id}
                            onClick={() => setSelectedTaxonomy(v.id)}
                            className={`px-1.5 py-1 text-[9px] border font-bold cursor-pointer transition-all ${
                              selectedTaxonomy === v.id
                                ? 'bg-[#D5991C] text-[#130108] border-[#D5991C]'
                                : 'bg-[#2a2a2a] text-[#FBF3E2] border-[#F2D69D]/30 hover:border-[#D5991C]'
                            }`}
                          >
                            {v.label}
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-1.5 pt-1">
                        <button
                          onClick={() => setIsAttackInjected(!isAttackInjected)}
                          className={`w-full px-2 py-1 text-[10px] border font-bold uppercase cursor-pointer flex items-center justify-center space-x-1.5 ${
                            isAttackInjected ? 'bg-[#E63946] text-[#FAF2E1] border-[#E63946]' : 'bg-[#00A878] text-[#130108] border-[#00A878]'
                          }`}
                        >
                          <Radio className="w-3 h-3" />
                          <span>{isAttackInjected ? 'Disable Vector Pulse' : 'Pulse Vector Weapon'}</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {webglMode === 2 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-[#FAF2E1]/70">3D ROC Hyper-Surface Inspection:</div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setIsAttackInjected(false)}
                          className={`flex-1 px-2 py-1 text-[10px] border font-bold uppercase cursor-pointer ${
                            !isAttackInjected ? 'bg-[#00A878] text-[#130108] border-[#00A878]' : 'bg-[#2a2a2a] text-[#00A878] border-[#00A878]/50'
                          }`}
                        >
                          8-Layer Stack (AUROC 0.998)
                        </button>
                        <button
                          onClick={() => setIsAttackInjected(true)}
                          className={`flex-1 px-2 py-1 text-[10px] border font-bold uppercase cursor-pointer ${
                            isAttackInjected ? 'bg-[#D5991C] text-[#130108] border-[#D5991C]' : 'bg-[#2a2a2a] text-[#D5991C] border-[#D5991C]/50'
                          }`}
                        >
                          Baseline MAD (AUROC 0.812)
                        </button>
                      </div>
                    </div>
                  )}

                  {webglMode === 3 && (
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-[#FAF2E1]/70">Subspace Manifold Partitioning:</div>
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => setIsAttackInjected(false)}
                          className={`flex-1 px-2 py-1 text-[10px] border font-bold uppercase cursor-pointer ${
                            !isAttackInjected ? 'bg-[#00A878] text-[#130108] border-[#00A878]' : 'bg-[#2a2a2a] text-[#00A878] border-[#00A878]/50'
                          }`}
                        >
                          SEC 10-K Manifold (LID=24.8)
                        </button>
                        <button
                          onClick={() => setIsAttackInjected(true)}
                          className={`flex-1 px-2 py-1 text-[10px] border font-bold uppercase cursor-pointer ${
                            isAttackInjected ? 'bg-[#E63946] text-[#FBF3E2] border-[#E63946]' : 'bg-[#2a2a2a] text-[#E63946] border-[#E63946]/50'
                          }`}
                        >
                          Sybil Quorum Swarm (LID=7.9)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Intensity Slider */}
                  <div className="pt-2 border-t border-[#F2D69D]/20 space-y-1">
                    <div className="flex justify-between items-center text-[10px]">
                      <span className="text-[#FAF2E1]/70">Stress Load / Attack Intensity:</span>
                      <span className="font-bold text-[#D5991C]">{attackIntensity}%</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={100}
                      value={attackIntensity}
                      onChange={(e) => setAttackIntensity(Number(e.target.value))}
                      className="w-full accent-[#00A878] cursor-pointer h-1.5 bg-[#410217]"
                    />
                  </div>
                </div>
              </div>

              {/* Top-Right Camera Presets & Speed Controls */}
              <div className="absolute top-4 right-4 z-20 space-y-2 font-mono text-xs">
                <div className="bg-[#363636]/95 backdrop-blur-md border border-[#F2D69D]/30 p-2.5 space-y-2 text-[#FBF3E2] shadow-xl">
                  <div className="text-[10px] text-[#D5991C] font-bold uppercase tracking-wider flex items-center space-x-1">
                    <Compass className="w-3 h-3 text-[#D5991C]" />
                    <span>Camera Presets</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { id: 'perspective', label: '3D Orbit' },
                      { id: 'top', label: 'Top Map' },
                      { id: 'side', label: 'Side Depth' }
                    ].map((p) => (
                      <button
                        key={p.id}
                        onClick={() => setCameraPreset(p.id as any)}
                        className={`px-2 py-1 text-[10px] border font-bold cursor-pointer transition-all ${
                          activeCameraPreset === p.id
                            ? 'bg-[#00A878] text-[#130108] border-[#00A878]'
                            : 'bg-[#2a2a2a] text-[#FBF3E2] border-[#F2D69D]/30 hover:border-[#F2D69D]'
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                    <button
                      onClick={() => setCameraPreset('perspective')}
                      className="px-2 py-1 text-[10px] border border-[#F2D69D]/30 bg-[#2a2a2a] text-[#D5991C] font-bold hover:bg-[#410217] cursor-pointer"
                    >
                      Reset
                    </button>
                  </div>

                  <div className="pt-1 border-t border-[#F2D69D]/20 flex items-center justify-between text-[10px]">
                    <span className="text-[#FAF2E1]/70">Sim Speed:</span>
                    <div className="flex space-x-1">
                      {[0.5, 1, 2].map((s) => (
                        <button
                          key={s}
                          onClick={() => setSimSpeed(s)}
                          className={`px-1.5 py-0.5 border text-[9px] font-bold cursor-pointer ${
                            simSpeed === s ? 'bg-[#D5991C] text-[#130108] border-[#D5991C]' : 'bg-[#2a2a2a] text-[#FAF2E1] border-transparent'
                          }`}
                        >
                          {s}x
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Telemetry HUD */}
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-[#363636]/95 backdrop-blur-md border border-[#F2D69D]/30 p-3 font-mono text-xs text-[#FBF3E2] shadow-2xl space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F2D69D]/20 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isAttackInjected ? 'bg-[#E63946] animate-pulse' : 'bg-[#00A878]'}`} />
                    <span className="font-bold text-[11px] tracking-wide">
                      {webglMode === 0 && (isAttackInjected
                        ? 'PREDATORY LIQUIDITY ATTACK ACTIVE // $45M SPOOF ASK WALL DEPLOYED'
                        : 'SOVEREIGN CIRCUIT BREAKER ENGAGED // 14.2 MS EPISTEMIC HALT APPLIED')}
                      {webglMode === 1 && `TACTICAL RADAR TARGET: AT-0${selectedTaxonomy + 1} // SOVEREIGN RECALL: 99.4%`}
                      {webglMode === 2 && (isAttackInjected
                        ? 'LEGACY BASELINE DETECTOR ACTIVE // HIGH FALSE-ALARM BURDEN (FPR=18.6%)'
                        : 'SOVEREIGN 8-LAYER ROC OPTIMUM // TPR=99.1% @ FPR=0.08%')}
                      {webglMode === 3 && (isAttackInjected
                        ? 'SYBIL COLLAPSE SUB-MANIFOLD // INTRINSIC DIMENSION HAT{m}=7.9 QUARANTINED'
                        : 'CLEAN SEC 10-K SUB-MANIFOLD // MULTI-DIMENSIONAL INTRINSIC DIMENSION HAT{m}=24.8')}
                    </span>
                  </div>
                  <div className="text-[#D5991C] text-[10px] hidden sm:block">
                    Rotate: Left-Click + Drag | Zoom: Scroll | Pan: Right-Click
                  </div>
                </div>

                {/* Mathematical Telemetry Indicators */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px]">
                  {webglMode === 0 && (
                    <>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#FAF2E1]/60 block">Price Impact:</span>
                        <span className={`font-bold ${isAttackInjected ? 'text-[#E63946]' : 'text-[#00A878]'}`}>
                          {isAttackInjected ? `-${(7.4 * (attackIntensity / 85)).toFixed(2)}%` : '0.00% (Protected)'}
                        </span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#FAF2E1]/60 block">Predatory Ask Wall:</span>
                        <span className="font-bold text-[#E63946]">
                          {isAttackInjected ? `$${((45 * attackIntensity) / 85).toFixed(1)}M` : '$0.0M'}
                        </span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#FAF2E1]/60 block">Circuit Halt Latency:</span>
                        <span className="font-bold text-[#00A878]">14.2 ms</span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#FAF2E1]/60 block">VPIN Toxicity:</span>
                        <span className={`font-bold ${isAttackInjected ? 'text-[#E63946]' : 'text-[#D5991C]'}`}>
                          {isAttackInjected ? '0.84' : '0.12'}
                        </span>
                      </div>
                    </>
                  )}

                  {webglMode === 1 && (
                    <>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#FAF2E1]/60 block">Selected Threat:</span>
                        <span className="font-bold text-[#D5991C]">
                          {['AT-1 Prompt', 'AT-2 Sybil', 'AT-3 Latent', 'AT-4 LOB Spoof', 'AT-5 Drift', 'AT-6 Stego', 'AT-7 Split'][selectedTaxonomy]}
                        </span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#FAF2E1]/60 block">Baseline Recall:</span>
                        <span className="font-bold text-[#E63946]">
                          {['42.1%', '38.4%', '51.0%', '29.3%', '34.7%', '48.9%', '31.2%'][selectedTaxonomy]}
                        </span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#FAF2E1]/60 block">Sovereign Recall:</span>
                        <span className="font-bold text-[#00A878]">
                          {['99.8%', '99.5%', '99.2%', '99.9%', '99.4%', '98.9%', '99.6%'][selectedTaxonomy]}
                        </span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#FAF2E1]/60 block">Mitigation Latency:</span>
                        <span className="font-bold text-[#00A878]">&lt; 18.5 ms</span>
                      </div>
                    </>
                  )}

                  {webglMode === 2 && (
                    <>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#FAF2E1]/60 block">Sovereign AUROC:</span>
                        <span className="font-bold text-[#00A878]">0.998</span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#FAF2E1]/60 block">Clean 10-K False Positives:</span>
                        <span className="font-bold text-[#00A878]">0.08% (0 of 500)</span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#FAF2E1]/60 block">Legacy Baseline FPR:</span>
                        <span className="font-bold text-[#E63946]">18.6%</span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#FAF2E1]/60 block">Optimal Threshold tau*:</span>
                        <span className="font-bold text-[#D5991C]">0.892</span>
                      </div>
                    </>
                  )}

                  {webglMode === 3 && (
                    <>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#FAF2E1]/60 block">SEC 10-K Dimension:</span>
                        <span className="font-bold text-[#00A878]">m_hat = 24.8</span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#FAF2E1]/60 block">Sybil Swarm Dimension:</span>
                        <span className="font-bold text-[#E63946]">m_hat = 7.9</span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#FAF2E1]/60 block">Separation Margin:</span>
                        <span className="font-bold text-[#00A878]">3.42 sigma</span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#FAF2E1]/60 block">Confidence Level:</span>
                        <span className="font-bold text-[#D5991C]">99.98% (p &lt; 10^-6)</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* PLAIN-ENGLISH EDUCATIONAL GUIDE: 4-CARD BREAKDOWN */}
            <div className="bg-[#FAF2E1] border-2 border-[#410217] p-6 shadow-xl space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F2D69D] pb-3">
                <div className="flex items-center space-x-2">
                  <BookOpen className="w-5 h-5 text-[#410217]" />
                  <h4 className="font-serif font-bold text-xl text-[#410217]">
                    Plain-English Guide: What You Are Seeing & What Is Happening
                  </h4>
                </div>
                <span className="font-mono text-xs px-2.5 py-1 bg-[#410217] text-[#FAF2E1] font-bold">
                  {webglMode === 0 && 'MODE 0: ORDER BOOK FLASH-CRASH & CIRCUIT BREAKERS'}
                  {webglMode === 1 && 'MODE 1: 7-VECTOR ATTACK TAXONOMY RADAR'}
                  {webglMode === 2 && 'MODE 2: 3D ROC-SPACE HYPER-SURFACE & OPTIMAL OPERATING POINT'}
                  {webglMode === 3 && 'MODE 3: SEC 10-K VS SYBIL INTRINSIC DIMENSION'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* CARD 1: Everyday Analogy */}
                <div className="bg-[#FBF3E2] border border-[#F2D69D] p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-[#D5991C] font-mono text-xs font-bold uppercase">
                    <Eye className="w-4 h-4 text-[#D5991C]" />
                    <span>1. What You're Looking At</span>
                  </div>
                  <h5 className="font-serif font-bold text-base text-[#410217]">
                    {webglMode === 0 && 'The Wall Street AI Flash-Crash'}
                    {webglMode === 1 && 'The 7-Headed Threat Radar'}
                    {webglMode === 2 && 'The Airport Scanner Tradeoff'}
                    {webglMode === 3 && 'The Mathematical Fingerprint'}
                  </h5>
                  <p className="font-sans text-xs text-[#410217]/85 leading-relaxed">
                    {webglMode === 0 &&
                      'The emerald and crimson staircases represent the live Limit Order Book (bids to buy vs asks to sell). In the center, particles flow along the price stream, and a towering red wall represents predatory spoof orders.'}
                    {webglMode === 1 &&
                      'A central sovereign citadel surrounded by 7 orbiting threat satellites. Yellow orbital rings and green defense beams shield the core, while red attack pulses simulate multi-angle penetration attempts.'}
                    {webglMode === 2 &&
                      'A 3D curved mountain of accuracy vs risk. The green line climbs straight up to near-perfect accuracy (catching attacks) without triggering annoying false alarms on legitimate documents.'}
                    {webglMode === 3 &&
                      '1,000 corporate data points mapped in 3D. Genuine corporate SEC filings expand across a broad emerald galaxy, while synthetic bot-farm copies collapse into a tight crimson line.'}
                  </p>
                </div>

                {/* CARD 2: The Threat */}
                <div className="bg-[#FBF3E2] border border-[#F2D69D] p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-[#E63946] font-mono text-xs font-bold uppercase">
                    <AlertTriangle className="w-4 h-4 text-[#E63946]" />
                    <span>2. The Attack Mechanism</span>
                  </div>
                  <h5 className="font-serif font-bold text-base text-[#410217]">
                    {webglMode === 0 && 'Predatory Liquidity Vacuum'}
                    {webglMode === 1 && 'Synchronized Multi-Vector Assault'}
                    {webglMode === 2 && 'The False-Alarm Operational Trap'}
                    {webglMode === 3 && 'Sybil Swarm Semantic Spoofing'}
                  </h5>
                  <p className="font-sans text-xs text-[#410217]/85 leading-relaxed">
                    {webglMode === 0 &&
                      'Bad actors plant a massive $45M synthetic sell wall while feeding poisoned news summaries to financial RAG systems. Autonomous trading bots panic-dump inventory in under 60 seconds.'}
                    {webglMode === 1 &&
                      'Adversaries combine prompt injections with Sybil citation swarms and hidden steganographic charts to bypass legacy single-point filters that only check one vector at a time.'}
                    {webglMode === 2 &&
                      'Standard security filters trigger so many false alarms on legitimate financial filings (18.6% error rate) that enterprises are forced to turn them off or suffer constant business halts.'}
                    {webglMode === 3 &&
                      'Coordinated bot swarms flood the web with paraphrased slander. Because they share synthetic LLM generation roots, their mathematical complexity is unnaturally low (dimension collapse).'}
                  </p>
                </div>

                {/* CARD 3: Last Crusade Defense */}
                <div className="bg-[#FBF3E2] border border-[#F2D69D] p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-[#00A878] font-mono text-xs font-bold uppercase">
                    <Shield className="w-4 h-4 text-[#00A878]" />
                    <span>3. What Last Crusade Defense Is Doing</span>
                  </div>
                  <h5 className="font-serif font-bold text-base text-[#410217]">
                    {webglMode === 0 && '14.2ms Epistemic Circuit Breaker'}
                    {webglMode === 1 && '8-Layer Cross-Validation Matrix'}
                    {webglMode === 2 && 'Pareto-Optimal AUROC 0.998'}
                    {webglMode === 3 && 'Intrinsic Dimension Partitioning'}
                  </h5>
                  <p className="font-sans text-xs text-[#410217]/85 leading-relaxed">
                    {webglMode === 0 &&
                      'Last Crusade calculates order toxicity (VPIN) and information entropy. If an artificial flash-crash is detected, a neon emerald quarantine shield instantly freezes automated order routing in 14.2 milliseconds.'}
                    {webglMode === 1 &&
                      'Last Crusade connects all 7 defense layers into a unified consensus mesh. If an attack slips past context sanitation, it is immediately flagged by the topological curvature and zk-SNARK consensus.'}
                    {webglMode === 2 &&
                      'Last Crusade shifts the operational curve to achieve 99.1% threat recall while keeping the false positive rate at an ultra-low 0.08%, allowing clean SEC 10-K filings to pass without friction.'}
                    {webglMode === 3 &&
                      'Using Local Intrinsic Dimensionality (LID), Last Crusade projects an impenetrable hyperplane boundary. High-entropy authentic text passes freely, while low-entropy synthetic swarms are locked in quarantine.'}
                  </p>
                </div>

                {/* CARD 4: Real-World Discovery */}
                <div className="bg-[#FBF3E2] border border-[#F2D69D] p-4 space-y-2">
                  <div className="flex items-center space-x-2 text-[#410217] font-mono text-xs font-bold uppercase">
                    <TrendingUp className="w-4 h-4 text-[#410217]" />
                    <span>4. Whitepaper Vol 3 Discovery</span>
                  </div>
                  <h5 className="font-serif font-bold text-base text-[#410217]">
                    {webglMode === 0 && 'Zero Capital Drawdown in Alpha Replay'}
                    {webglMode === 1 && '99.4% Mitigation Across 10k Probes'}
                    {webglMode === 2 && '0.08% False Alarm on Clean 10-Ks'}
                    {webglMode === 3 && 'Statistically Proved Dimension Gap'}
                  </h5>
                  <p className="font-sans text-xs text-[#410217]/85 leading-relaxed">
                    {webglMode === 0 &&
                      'In benchmarked 60-second market replays, unshielded quantitative funds suffered an average -7.4% price impact and $12.4M drawdown. Last Crusade-shielded portfolios maintained 0.00% drawdown.'}
                    {webglMode === 1 &&
                      'Whitepaper Vol 3 proved that single-layer defenses miss 84% of combined multi-vector attacks. Last Crusade’s 8-layer architecture achieved 99.4% recall across all 7 taxonomy classes.'}
                    {webglMode === 2 &&
                      'Tested on 500 official SEC 10-K annual reports, legacy keyword and cosine filters generated dozens of false alerts; Last Crusade produced zero false quarantines across all 500 documents.'}
                    {webglMode === 3 &&
                      'Real corporate disclosures measure m_hat = 24.8 intrinsic dimensions, whereas adversarial Sybil swarms collapse to m_hat = 7.9 (p < 10^-6), giving Last Crusade Defense an unbreakable mathematical discriminator.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}



      </div>
    </div>
  );
};
