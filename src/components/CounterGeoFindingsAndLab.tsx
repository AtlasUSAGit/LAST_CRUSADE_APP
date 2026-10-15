import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import gsap from 'gsap';
import {
  Shield,
  Zap,
  RotateCcw,
  Sliders,
  Play,
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
  Eye,
  Compass,
  Crosshair,
  FastForward,
  Gauge,
  BookOpen,
  Info,
  HelpCircle
} from 'lucide-react';
import {
  MTVDManifoldEngine,
  AMCIDPProfiler,
  NCARDRankDivergenceEngine,
  TCGCLProvenanceEngine,
  CEHASIDDefenseEngine,
  TMMEGFinancialShield,
  SybilDocNode
} from '../utils/counterGeoAlgorithms';
import { MASTER_DOC_METADATA } from '../data/counterGeoPaperContent';


interface FindingsAndLabProps {
  onSwitchToPaper: () => void;
  onNavigateToOverview: () => void;
}

export const CounterGeoFindingsAndLab: React.FC<FindingsAndLabProps> = ({
  onSwitchToPaper,
  onNavigateToOverview
}) => {
  // Navigation tabs within Page 2
  const getInitialTab = (): 'charts' | 'algorithms' | 'webgl' => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('webgl') || hash.includes('visualizer') || hash.includes('3d') || hash.includes('topological')) {
      return 'webgl';
    }
    if (hash.includes('charts')) return 'charts';
    return 'algorithms';
  };

  const [activeTab, setActiveTab] = useState<'charts' | 'algorithms' | 'webgl'>(getInitialTab);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('webgl') || hash.includes('visualizer') || hash.includes('topological')) {
        setActiveTab('webgl');
      } else if (hash.includes('charts')) {
        setActiveTab('charts');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // ==========================================
  // STATE FOR LIVE ALGORITHM RUNNER
  // ==========================================

  // Layer 0 MTVD State
  const [mtvdDim, setMtvdDim] = useState(32);
  const [mtvdCanaryEnergyResult, setMtvdCanaryEnergyResult] = useState<{
    energy: number;
    isTriggered: boolean;
    projectionComponents: number[];
  } | null>(null);
  const [mtvdIsometryResult, setMtvdIsometryResult] = useState<{
    distancePreservationPct: number;
    adversarialHubDrift: number;
  } | null>(null);

  // Layer 1 AM-CIDP State
  const [amcidpClusterType, setAmcidpClusterType] = useState<'natural' | 'adversarial_hub'>('adversarial_hub');
  const [amcidpKNeighbors, setAmcidpKNeighbors] = useState(15);
  const [amcidpResult, setAmcidpResult] = useState<{
    lid: number;
    spectralEntropy: number;
    manifoldAnomalyScore: number;
    isFlagged: boolean;
    verdict: string;
    eigenvalues: number[];
  } | null>(null);

  // Layer 2 NCARD State
  const [ncardDenseRank, setNcardDenseRank] = useState(1);
  const [ncardColbertRank, setNcardColbertRank] = useState(85);
  const [ncardSparseRank, setNcardSparseRank] = useState(320);
  const [ncardResult, setNcardResult] = useState<any | null>(null);

  // Layer 3 TCG-CL State
  const [sybilClusterType, setSybilClusterType] = useState<'organic_journalism' | 'coordinated_sybil'>('coordinated_sybil');
  const [tcgclResult, setTcgclResult] = useState<any | null>(null);

  // Layer 4A CEH-ASID State
  const [cehasidAttackScenario, setCehasidAttackScenario] = useState<'split_payload_enthymeme' | 'independent_facts'>('split_payload_enthymeme');
  const [cehasidResult, setCehasidResult] = useState<any | null>(null);

  // Layer 4B TMMEG State
  const [tmmegPriorSignal, setTmmegPriorSignal] = useState(0.05); // Neutral
  const [tmmegRagSignal, setTmmegRagSignal] = useState(0.85); // Aggressive Buy
  const [tmmegVpinZ, setTmmegVpinZ] = useState(-0.5); // Low informed flow
  const [tmmegKyleZ, setTmmegKyleZ] = useState(-0.8);
  const [tmmegOptionsZ, setTmmegOptionsZ] = useState(-1.2); // Zero call-buying
  const [tmmegAskWallSize, setTmmegAskWallSize] = useState(85000); // Massive pre-positioned ask wall
  const [tmmegResult, setTmmegResult] = useState<any | null>(null);

  // ==========================================
  // RUN INITIAL ALGORITHMS ON LOAD
  // ==========================================
  useEffect(() => {
    runLayer0MTVD();
    runLayer1AMCIDP('adversarial_hub');
    runLayer2NCARD(1, 85, 320);
    runLayer3TCGCL('coordinated_sybil');
    runLayer4ACEHASID('split_payload_enthymeme');
    runLayer4BTMMEG();
  }, []);

  // Algorithm Execution Handlers
  const runLayer0MTVD = () => {
    const engine = new MTVDManifoldEngine(mtvdDim, 6, 0.22);
    // Simulating adversarial probe vector aligned with honeypot canary
    const advVec = Array.from({ length: mtvdDim }, (_, i) => (i < 6 ? 0.42 : 0.05));
    const canary = engine.computeCanaryEnergy(advVec);
    setMtvdCanaryEnergyResult({
      energy: canary.energy,
      isTriggered: canary.isTriggered,
      projectionComponents: canary.projectionComponents
    });

    const query = Array.from({ length: mtvdDim }, () => Math.random() - 0.5);
    const naturalNbs = Array.from({ length: 8 }, () =>
      query.map((v) => v + (Math.random() - 0.5) * 0.2)
    );
    const hub = query.map((v) => v + 0.1);
    const iso = engine.evaluateIsometry(query, naturalNbs, hub);
    setMtvdIsometryResult({
      distancePreservationPct: iso.distancePreservationPct,
      adversarialHubDrift: iso.adversarialHubDrift
    });
  };

  const runLayer1AMCIDP = (type: 'natural' | 'adversarial_hub') => {
    setAmcidpClusterType(type);
    const profiler = new AMCIDPProfiler(amcidpKNeighbors, 0.5, 0.72);
    const d = 32;
    const target = Array.from({ length: d }, () => 0.5);

    let neighbors: number[][];
    if (type === 'adversarial_hub') {
      // Artificially flattened subspace (collapsed dimensionality)
      neighbors = Array.from({ length: amcidpKNeighbors }, () => {
        const base = [...target];
        // Only vary along 2 singular axes
        base[0] += (Math.random() - 0.5) * 0.1;
        base[1] += (Math.random() - 0.5) * 0.1;
        return base;
      });
    } else {
      // Natural high-dimensional isotropic cloud
      neighbors = Array.from({ length: amcidpKNeighbors }, () => {
        return target.map((v) => v + (Math.random() - 0.5) * 0.4);
      });
    }

    const res = profiler.evaluateManifold(target, neighbors);
    setAmcidpResult({
      lid: res.lid,
      spectralEntropy: res.spectralEntropy,
      manifoldAnomalyScore: res.manifoldAnomalyScore,
      isFlagged: res.isFlagged,
      verdict: res.verdict,
      eigenvalues: res.eigenvalues
    });
  };

  const runLayer2NCARD = (dense: number, colbert: number, sparse: number) => {
    const engine = new NCARDRankDivergenceEngine(60.0, 15.0, 0.45);
    const res = engine.evaluateRanks(dense, colbert, sparse);
    setNcardResult(res);
  };

  const runLayer3TCGCL = (type: 'organic_journalism' | 'coordinated_sybil') => {
    setSybilClusterType(type);
    const engine = new TCGCLProvenanceEngine(0.82, 86400);

    let docs: SybilDocNode[];
    const now = Date.now() / 1000;

    if (type === 'organic_journalism') {
      docs = [
        {
          id: 'DOC-SEC-ROOT',
          domain: 'sec.gov',
          timestamp: now - 3600,
          c2paSigned: true,
          issuerTier: 1.0,
          citations: [],
          textExcerpt: 'SEC EDGAR 8-K Disclosure: Normal course quarterly debt restructuring.'
        },
        {
          id: 'DOC-REUTERS-WIRE',
          domain: 'reuters.com',
          timestamp: now - 2800,
          c2paSigned: true,
          issuerTier: 0.85,
          citations: ['DOC-SEC-ROOT'],
          textExcerpt: 'Reuters Financial: Company completes planned debt notes tender per SEC 8-K.'
        },
        {
          id: 'DOC-BLOOMBERG-WIRE',
          domain: 'bloomberg.com',
          timestamp: now - 1800,
          c2paSigned: true,
          issuerTier: 0.85,
          citations: ['DOC-SEC-ROOT'],
          textExcerpt: 'Bloomberg Terminal: Corporate debt refinancing priced with institutional backing.'
        },
        {
          id: 'DOC-FIN-BLOG-01',
          domain: 'market-insights-daily.org',
          timestamp: now - 600,
          c2paSigned: false,
          issuerTier: 0.0,
          citations: ['DOC-REUTERS-WIRE'],
          textExcerpt: 'Market Analysis: Reviewing recent balance sheet stabilization per wire reports.'
        }
      ];
    } else {
      // Coordinated Hawkes Sybil botnet: 6 unsigned domains, staggered by seconds, circular citations
      docs = [
        {
          id: 'SYBIL-SITE-01',
          domain: 'fast-defense-alpha.com',
          timestamp: now - 300,
          c2paSigned: false,
          issuerTier: 0.0,
          citations: ['SYBIL-SITE-02'],
          textExcerpt: 'EXCLUSIVE: Major aerospace supplier faces imminent criminal suspension.'
        },
        {
          id: 'SYBIL-SITE-02',
          domain: 'market-leak-radar.net',
          timestamp: now - 295,
          c2paSigned: false,
          issuerTier: 0.0,
          citations: ['SYBIL-SITE-03'],
          textExcerpt: 'Breaking Defense Alert: Key government contractor hit with severe regulatory stop-order.'
        },
        {
          id: 'SYBIL-SITE-03',
          domain: 'insider-equities-wire.org',
          timestamp: now - 290,
          c2paSigned: false,
          issuerTier: 0.0,
          citations: ['SYBIL-SITE-01'],
          textExcerpt: 'Sources Confirm: Criminal investigation opened against defense contractor.'
        },
        {
          id: 'SYBIL-SITE-04',
          domain: 'capital-pulse-flash.io',
          timestamp: now - 285,
          c2paSigned: false,
          issuerTier: 0.0,
          citations: ['SYBIL-SITE-02', 'SYBIL-SITE-03'],
          textExcerpt: 'Contractor shutdown: Federal agencies suspend all contract payments immediately.'
        }
      ];
    }

    const res = engine.evaluateCluster(docs);
    setTcgclResult(res);
  };

  const runLayer4ACEHASID = (scenario: 'split_payload_enthymeme' | 'independent_facts') => {
    setCehasidAttackScenario(scenario);
    const engine = new CEHASIDDefenseEngine(0.35, 0.18);

    const prior = [0.33, 0.34, 0.33]; // [P(Buy), P(Hold), P(Sell)]

    if (scenario === 'split_payload_enthymeme') {
      // Document A alone looks benign (Hold)
      const marginalA = [0.30, 0.40, 0.30];
      // Document B alone looks benign (Hold)
      const marginalB = [0.28, 0.42, 0.30];
      // Joint inclusion fuses the enthymeme: sudden massive spike in Sell probability (92%!)
      const joint = [0.03, 0.05, 0.92];
      const res = engine.evaluateEpistemicSynergy(prior, marginalA, marginalB, joint, 0.45);
      setCehasidResult(res);
    } else {
      // Independent facts: joint shift is linear/sub-additive
      const marginalA = [0.45, 0.35, 0.20];
      const marginalB = [0.48, 0.32, 0.20];
      const joint = [0.55, 0.30, 0.15];
      const res = engine.evaluateEpistemicSynergy(prior, marginalA, marginalB, joint, 0.08);
      setCehasidResult(res);
    }
  };

  const runLayer4BTMMEG = () => {
    const shield = new TMMEGFinancialShield(2.5, 3.0, 0.65);
    const bids = [12000, 15000, 11000, 9000, 8000, 7000, 5000, 4000, 3000, 2000];
    const asks = [
      tmmegAskWallSize, // Massive wall
      14000,
      12000,
      9000,
      8000,
      6000,
      5000,
      4000,
      3000,
      2000
    ];

    const verdict = shield.filterTradingSignal({
      ticker: 'LDOS',
      priorSignal: tmmegPriorSignal,
      ragSignal: tmmegRagSignal,
      vpinZScore: tmmegVpinZ,
      kyleLambdaZScore: tmmegKyleZ,
      optionsSkewZScore: tmmegOptionsZ,
      top10Bids: bids,
      top10Asks: asks,
      preNewsRestingRatio: 0.92 // Placed BEFORE article was published!
    });
    setTmmegResult(verdict);
  };

  // ==========================================
  // THREE.JS WEBGL 2.0 3D ENGINE
  // ==========================================
  const threeMountRef = useRef<HTMLDivElement>(null);
  const [webglMode, setWebglMode] = useState(0);
  const [isAttackInjected, setIsAttackInjected] = useState(false);
  const [attackIntensity, setAttackIntensity] = useState(80);
  const [simSpeed, setSimSpeed] = useState(1);
  const [activeCameraPreset, setActiveCameraPreset] = useState<'perspective' | 'top' | 'side'>('perspective');

  const threeState = useRef<{
    renderer: THREE.WebGLRenderer | null;
    scene: THREE.Scene | null;
    camera: THREE.PerspectiveCamera | null;
    controls: OrbitControls | null;
    modeGroups: THREE.Group[];
    manifoldMesh: THREE.Mesh | null;
    particles: THREE.Points | null;
    particleHome: Float32Array | null;
    hubCore: THREE.Mesh | null;
    quarantineCage: THREE.Mesh | null;
    mode0Streamlines: THREE.LineSegments | null;
    mode1DivergenceLine: THREE.Line | null;
    mode1DenseNode: THREE.Mesh | null;
    mode1ColbertNode: THREE.Mesh | null;
    mode1SparseNode: THREE.Mesh | null;
    mode1StreamParticles: THREE.Points | null;
    mode2Core: THREE.Mesh | null;
    mode2TokenGroup: THREE.Group | null;
    mode2AttentionLines: THREE.LineSegments | null;
    mode2StealthToken: THREE.Mesh | null;
    mode2StealthRays: THREE.LineSegments | null;
    mode2EntropyShield: THREE.Mesh | null;
    mode3BidBars: THREE.Mesh[];
    mode3AskBars: THREE.Mesh[];
    mode3SpoofWall: THREE.Mesh | null;
    mode3CircuitBreaker: THREE.Mesh | null;
    mode3FlowParticles: THREE.Points | null;
    mode4Torus: THREE.Mesh | null;
    mode4InnerRing: THREE.Mesh | null;
    mode4SwarmGroup: THREE.Group | null;
    mode4SybilNodes: THREE.Mesh[];
    mode4ShieldRing: THREE.Mesh | null;
    clock: THREE.Clock;
    animId: number | null;
    isAttack: boolean;
    intensity: number;
    speed: number;
    currentMode: number;
    rotationPulse: number;
  }>({
    renderer: null,
    scene: null,
    camera: null,
    controls: null,
    modeGroups: [],
    manifoldMesh: null,
    particles: null,
    particleHome: null,
    hubCore: null,
    quarantineCage: null,
    mode0Streamlines: null,
    mode1DivergenceLine: null,
    mode1DenseNode: null,
    mode1ColbertNode: null,
    mode1SparseNode: null,
    mode1StreamParticles: null,
    mode2Core: null,
    mode2TokenGroup: null,
    mode2AttentionLines: null,
    mode2StealthToken: null,
    mode2StealthRays: null,
    mode2EntropyShield: null,
    mode3BidBars: [],
    mode3AskBars: [],
    mode3SpoofWall: null,
    mode3CircuitBreaker: null,
    mode3FlowParticles: null,
    mode4Torus: null,
    mode4InnerRing: null,
    mode4SwarmGroup: null,
    mode4SybilNodes: [],
    mode4ShieldRing: null,
    clock: new THREE.Clock(),
    animId: null,
    isAttack: false,
    intensity: 0.8,
    speed: 1,
    currentMode: 0,
    rotationPulse: 0
  });

  const setCameraPreset = (preset: 'perspective' | 'top' | 'side') => {
    setActiveCameraPreset(preset);
    const camera = threeState.current.camera;
    const controls = threeState.current.controls;
    if (!camera || !controls) return;
    if (preset === 'perspective') {
      camera.position.set(0, 18, 38);
      controls.target.set(0, 0, 0);
    } else if (preset === 'top') {
      camera.position.set(0, 44, 0.1);
      controls.target.set(0, 0, 0);
    } else if (preset === 'side') {
      camera.position.set(42, 6, 0);
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
    scene.background = new THREE.Color(0x363636); // Dark Gray #363636 background
    scene.fog = new THREE.FogExp2(0x363636, 0.016);

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
    camera.position.set(0, 18, 38);

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

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xfff5ea, 0.95);
    scene.add(ambientLight);

    const goldLight = new THREE.PointLight(0xd5991c, 4, 120);
    goldLight.position.set(15, 20, 15);
    scene.add(goldLight);

    const oxbloodLight = new THREE.PointLight(0x8b1e1e, 3, 120);
    oxbloodLight.position.set(-15, 10, -15);
    scene.add(oxbloodLight);

    const emeraldLight = new THREE.PointLight(0x00a878, 3.5, 100);
    emeraldLight.position.set(0, -10, 15);
    scene.add(emeraldLight);

    // Create 5 Mode Groups
    const modeGroups: THREE.Group[] = [];
    for (let i = 0; i < 5; i++) {
      const g = new THREE.Group();
      g.visible = i === webglMode;
      scene.add(g);
      modeGroups.push(g);
    }

    // ==========================================
    // MODE 0: AM-CIDP Attractor Manifold Curvature & Streamlines
    // ==========================================
    const g0 = modeGroups[0];
    const manifoldGeo = new THREE.PlaneGeometry(36, 36, 48, 48);
    manifoldGeo.rotateX(-Math.PI / 2);
    const manifoldMat = new THREE.MeshStandardMaterial({
      color: 0x410217,
      wireframe: true,
      roughness: 0.3,
      metalness: 0.8
    });
    const manifoldMesh = new THREE.Mesh(manifoldGeo, manifoldMat);
    g0.add(manifoldMesh);

    // Hub Core (Adversarial Sinkhole center)
    const hubCoreGeo = new THREE.SphereGeometry(1.8, 32, 32);
    const hubCoreMat = new THREE.MeshStandardMaterial({
      color: 0xe63946,
      emissive: 0x8b1e1e,
      roughness: 0.2
    });
    const hubCore = new THREE.Mesh(hubCoreGeo, hubCoreMat);
    hubCore.position.set(0, -3.2, 0);
    g0.add(hubCore);

    // Quarantine Cage (Gold/Emerald wireframe icosahedron)
    const cageGeo = new THREE.IcosahedronGeometry(4.2, 1);
    const cageMat = new THREE.MeshBasicMaterial({ color: 0x00a878, wireframe: true, transparent: true, opacity: 0.85 });
    const quarantineCage = new THREE.Mesh(cageGeo, cageMat);
    quarantineCage.position.set(0, -3.2, 0);
    g0.add(quarantineCage);

    // Streamline arcs showing topological gradient flow into sinkhole
    const streamlinePoints: THREE.Vector3[] = [];
    const streamRays = 16;
    for (let r = 0; r < streamRays; r++) {
      const angle = (r / streamRays) * Math.PI * 2;
      for (let s = 0; s < 10; s++) {
        const radius = 16 - s * 1.4;
        const curAngle = angle + s * 0.12;
        const sx = Math.cos(curAngle) * radius;
        const sz = Math.sin(curAngle) * radius;
        const sy = 0.5 - (s / 10) * 3.5;
        streamlinePoints.push(new THREE.Vector3(sx, sy, sz));
        if (s > 0 && s < 9) {
          streamlinePoints.push(new THREE.Vector3(sx, sy, sz));
        }
      }
    }
    const streamlineGeo = new THREE.BufferGeometry().setFromPoints(streamlinePoints);
    const streamlineMat = new THREE.LineBasicMaterial({ color: 0xd5991c, transparent: true, opacity: 0.35 });
    const mode0Streamlines = new THREE.LineSegments(streamlineGeo, streamlineMat);
    g0.add(mode0Streamlines);

    // 500 Query Particles
    const particleCount = 500;
    const particlePositions = new Float32Array(particleCount * 3);
    const particleHome = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const r = 4 + Math.random() * 14;
      const theta = Math.random() * Math.PI * 2;
      const y = -1 + Math.random() * 4;
      const x = Math.cos(theta) * r;
      const z = Math.sin(theta) * r;
      particlePositions[i * 3] = x;
      particlePositions[i * 3 + 1] = y;
      particlePositions[i * 3 + 2] = z;
      particleHome[i * 3] = x;
      particleHome[i * 3 + 1] = y;
      particleHome[i * 3 + 2] = z;
    }
    const particleGeo = new THREE.BufferGeometry();
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMat = new THREE.PointsMaterial({ color: 0xfbf3e2, size: 0.4, transparent: true, opacity: 0.85 });
    const particles = new THREE.Points(particleGeo, particleMat);
    g0.add(particles);

    // ==========================================
    // MODE 1: NCARD Cross-Architecture Retrieval Planes
    // ==========================================
    const g1 = modeGroups[1];
    const planeHeights = [8, 0, -8];
    const planeColors = [0x005577, 0x410217, 0x8b1e1e];
    planeHeights.forEach((yPos, idx) => {
      const planeGeo = new THREE.BoxGeometry(28, 0.4, 16);
      const planeMat = new THREE.MeshStandardMaterial({
        color: planeColors[idx],
        transparent: true,
        opacity: 0.65,
        wireframe: true
      });
      const plane = new THREE.Mesh(planeGeo, planeMat);
      plane.position.y = yPos;
      g1.add(plane);

      // Grid helper on each plane
      const grid = new THREE.GridHelper(24, 12, 0xd5991c, 0x410217);
      grid.position.y = yPos + 0.25;
      g1.add(grid);
    });

    // Node markers on planes
    const denseNode = new THREE.Mesh(
      new THREE.SphereGeometry(1.0, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0x00d2ff, emissive: 0x004566, metalness: 0.8, roughness: 0.2 })
    );
    denseNode.position.set(0, 8.5, 0);
    g1.add(denseNode);

    const colbertNode = new THREE.Mesh(
      new THREE.SphereGeometry(1.0, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xd5991c, emissive: 0x5c0a24, metalness: 0.8, roughness: 0.2 })
    );
    colbertNode.position.set(0, 0.5, 0);
    g1.add(colbertNode);

    const sparseNode = new THREE.Mesh(
      new THREE.SphereGeometry(1.0, 24, 24),
      new THREE.MeshStandardMaterial({ color: 0xe63946, emissive: 0x8b1e1e, metalness: 0.8, roughness: 0.2 })
    );
    sparseNode.position.set(0, -7.5, 0);
    g1.add(sparseNode);

    // Dynamic Rank Divergence line connecting nodes
    const divLineGeo = new THREE.BufferGeometry().setFromPoints([
      denseNode.position,
      colbertNode.position,
      sparseNode.position
    ]);
    const divLineMat = new THREE.LineBasicMaterial({ color: 0xf2d69d, linewidth: 2 });
    const mode1DivergenceLine = new THREE.Line(divLineGeo, divLineMat);
    g1.add(mode1DivergenceLine);

    // Flowing cross-architecture data packets (200 particles)
    const p1Count = 180;
    const p1Pos = new Float32Array(p1Count * 3);
    for (let i = 0; i < p1Count; i++) {
      p1Pos[i * 3] = (Math.random() - 0.5) * 22;
      p1Pos[i * 3 + 1] = -8 + Math.random() * 16;
      p1Pos[i * 3 + 2] = (Math.random() - 0.5) * 14;
    }
    const p1Geo = new THREE.BufferGeometry();
    p1Geo.setAttribute('position', new THREE.BufferAttribute(p1Pos, 3));
    const mode1StreamParticles = new THREE.Points(
      p1Geo,
      new THREE.PointsMaterial({ color: 0x00a878, size: 0.35, transparent: true, opacity: 0.7 })
    );
    g1.add(mode1StreamParticles);

    // ==========================================
    // MODE 2: CEH-ASID Transformer Attention Holography
    // ==========================================
    const g2 = modeGroups[2];
    const mode2Core = new THREE.Mesh(
      new THREE.OctahedronGeometry(2.8),
      new THREE.MeshStandardMaterial({ color: 0xd5991c, emissive: 0x410217, roughness: 0.1, metalness: 0.9 })
    );
    g2.add(mode2Core);

    // Ring of 12 Context Token Nodes
    const mode2TokenGroup = new THREE.Group();
    const tokenCount = 12;
    for (let i = 0; i < tokenCount; i++) {
      const angle = (i / tokenCount) * Math.PI * 2;
      const r = 11;
      const tx = Math.cos(angle) * r;
      const tz = Math.sin(angle) * r;
      const tMesh = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 1.3, 1.3),
        new THREE.MeshStandardMaterial({ color: 0xfbf3e2, roughness: 0.2, metalness: 0.5 })
      );
      tMesh.position.set(tx, 0, tz);
      mode2TokenGroup.add(tMesh);
    }
    g2.add(mode2TokenGroup);

    // Dynamic Attention Rays
    const rayPoints: THREE.Vector3[] = [];
    for (let i = 0; i < tokenCount; i++) {
      rayPoints.push(new THREE.Vector3(0, 0, 0));
      const angle = (i / tokenCount) * Math.PI * 2;
      rayPoints.push(new THREE.Vector3(Math.cos(angle) * 11, 0, Math.sin(angle) * 11));
    }
    const rayGeo = new THREE.BufferGeometry().setFromPoints(rayPoints);
    const rayMat = new THREE.LineBasicMaterial({ color: 0xd5991c, transparent: true, opacity: 0.7 });
    const mode2AttentionLines = new THREE.LineSegments(rayGeo, rayMat);
    g2.add(mode2AttentionLines);

    // Stealth Zero-Font Prompt Token (Hidden Adversarial Node)
    const mode2StealthToken = new THREE.Mesh(
      new THREE.DodecahedronGeometry(1.4),
      new THREE.MeshStandardMaterial({ color: 0xe63946, emissive: 0x8b1e1e, wireframe: true })
    );
    mode2StealthToken.position.set(13, 3, 4);
    mode2StealthToken.visible = false;
    g2.add(mode2StealthToken);

    // Stealth attention beam into core
    const stealthRayGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(13, 3, 4),
      new THREE.Vector3(0, 0, 0)
    ]);
    const mode2StealthRays = new THREE.LineSegments(
      stealthRayGeo,
      new THREE.LineBasicMaterial({ color: 0xe63946, transparent: true, opacity: 0.9 })
    );
    mode2StealthRays.visible = false;
    g2.add(mode2StealthRays);

    // CEH-ASID Holographic Entropy Gate Shield
    const entropyShieldGeo = new THREE.IcosahedronGeometry(4.8, 2);
    const entropyShieldMat = new THREE.MeshBasicMaterial({
      color: 0x00a878,
      wireframe: true,
      transparent: true,
      opacity: 0.6
    });
    const mode2EntropyShield = new THREE.Mesh(entropyShieldGeo, entropyShieldMat);
    mode2EntropyShield.visible = false;
    g2.add(mode2EntropyShield);

    // ==========================================
    // MODE 3: TMMEG Limit Order Book Canyon
    // ==========================================
    const g3 = modeGroups[3];
    const mode3BidBars: THREE.Mesh[] = [];
    const mode3AskBars: THREE.Mesh[] = [];

    for (let i = 0; i < 12; i++) {
      // Gold Bids on Left
      const bidH = 1 + i * 0.75;
      const bidBar = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, bidH, 2.6),
        new THREE.MeshStandardMaterial({ color: 0xd5991c, metalness: 0.85, roughness: 0.2 })
      );
      bidBar.position.set(-9.5 + i * 0.75, bidH / 2, 0);
      g3.add(bidBar);
      mode3BidBars.push(bidBar);

      // Oxblood Asks on Right
      const askH = 1 + i * 1.05;
      const askBar = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, askH, 2.6),
        new THREE.MeshStandardMaterial({ color: 0x8b1e1e, metalness: 0.85, roughness: 0.2 })
      );
      askBar.position.set(1.5 + i * 0.75, askH / 2, 0);
      g3.add(askBar);
      mode3AskBars.push(askBar);
    }

    // Mid-Price line in center canyon
    const midLineGeo = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-0.8, 0.5, -8),
      new THREE.Vector3(-0.8, 0.5, 8)
    ]);
    const midLine = new THREE.Line(midLineGeo, new THREE.LineBasicMaterial({ color: 0x00a878, linewidth: 2 }));
    g3.add(midLine);

    // Spoof Ask Wall (massive predatory wall appearing on attack)
    const spoofWallGeo = new THREE.BoxGeometry(6, 16, 3.2);
    const spoofWallMat = new THREE.MeshStandardMaterial({
      color: 0xe63946,
      emissive: 0x8b1e1e,
      transparent: true,
      opacity: 0.88
    });
    const mode3SpoofWall = new THREE.Mesh(spoofWallGeo, spoofWallMat);
    mode3SpoofWall.position.set(5.5, 8, 0);
    mode3SpoofWall.visible = isAttackInjected;
    g3.add(mode3SpoofWall);

    // Epistemic Circuit Breaker Barrier
    const cbBarrierGeo = new THREE.PlaneGeometry(28, 18);
    cbBarrierGeo.rotateY(Math.PI / 2);
    const cbBarrierMat = new THREE.MeshBasicMaterial({
      color: 0x00a878,
      wireframe: true,
      transparent: true,
      opacity: 0.7
    });
    const mode3CircuitBreaker = new THREE.Mesh(cbBarrierGeo, cbBarrierMat);
    mode3CircuitBreaker.position.set(-0.8, 9, 0);
    mode3CircuitBreaker.visible = false;
    g3.add(mode3CircuitBreaker);

    // High frequency transaction particles
    const fCount = 150;
    const fPos = new Float32Array(fCount * 3);
    for (let i = 0; i < fCount; i++) {
      fPos[i * 3] = -0.8 + (Math.random() - 0.5) * 1.5;
      fPos[i * 3 + 1] = Math.random() * 8;
      fPos[i * 3 + 2] = -8 + Math.random() * 16;
    }
    const fGeo = new THREE.BufferGeometry();
    fGeo.setAttribute('position', new THREE.BufferAttribute(fPos, 3));
    const mode3FlowParticles = new THREE.Points(
      fGeo,
      new THREE.PointsMaterial({ color: 0x00a878, size: 0.45, transparent: true, opacity: 0.9 })
    );
    g3.add(mode3FlowParticles);

    // ==========================================
    // MODE 4: zk-SNARK Swarm & Sovereign Governance
    // ==========================================
    const g4 = modeGroups[4];
    const mode4Torus = new THREE.Mesh(
      new THREE.TorusGeometry(8.5, 0.9, 16, 100),
      new THREE.MeshStandardMaterial({ color: 0x00a878, wireframe: true })
    );
    mode4Torus.rotateX(Math.PI / 3);
    g4.add(mode4Torus);

    // Inner Gyroscopic Gold Ring
    const mode4InnerRing = new THREE.Mesh(
      new THREE.TorusGeometry(5.2, 0.5, 16, 80),
      new THREE.MeshStandardMaterial({ color: 0xd5991c, wireframe: true })
    );
    mode4InnerRing.rotateY(Math.PI / 3);
    g4.add(mode4InnerRing);

    // Orbiting Swarm Ring
    const mode4SwarmGroup = new THREE.Group();
    const swarmNodesCount = 18;
    for (let i = 0; i < swarmNodesCount; i++) {
      const angle = (i / swarmNodesCount) * Math.PI * 2;
      const sr = 12.5;
      const sNode = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.8),
        new THREE.MeshStandardMaterial({ color: i === 0 ? 0xd5991c : 0x00a878, roughness: 0.2, metalness: 0.8 })
      );
      sNode.position.set(Math.cos(angle) * sr, Math.sin(angle * 2) * 1.5, Math.sin(angle) * sr);
      mode4SwarmGroup.add(sNode);
    }
    g4.add(mode4SwarmGroup);

    // Sybil Intrusion Nodes (4 hostile probing entities)
    const mode4SybilNodes: THREE.Mesh[] = [];
    for (let i = 0; i < 4; i++) {
      const sNode = new THREE.Mesh(
        new THREE.TetrahedronGeometry(1.2),
        new THREE.MeshStandardMaterial({ color: 0xe63946, emissive: 0x8b1e1e, wireframe: true })
      );
      sNode.position.set(Math.cos((i * Math.PI) / 2) * 17, 3, Math.sin((i * Math.PI) / 2) * 17);
      sNode.visible = false;
      g4.add(sNode);
      mode4SybilNodes.push(sNode);
    }

    // Defensive Shockwave Ring
    const shockwaveGeo = new THREE.RingGeometry(1, 16, 64);
    shockwaveGeo.rotateX(-Math.PI / 2);
    const mode4ShieldRing = new THREE.Mesh(
      shockwaveGeo,
      new THREE.MeshBasicMaterial({ color: 0x00a878, transparent: true, opacity: 0.0, side: THREE.DoubleSide })
    );
    g4.add(mode4ShieldRing);

    // Save state
    threeState.current = {
      renderer,
      scene,
      camera,
      controls,
      modeGroups,
      manifoldMesh,
      particles,
      particleHome,
      hubCore,
      quarantineCage,
      mode0Streamlines,
      mode1DivergenceLine,
      mode1DenseNode: denseNode,
      mode1ColbertNode: colbertNode,
      mode1SparseNode: sparseNode,
      mode1StreamParticles,
      mode2Core,
      mode2TokenGroup,
      mode2AttentionLines,
      mode2StealthToken,
      mode2StealthRays,
      mode2EntropyShield,
      mode3BidBars,
      mode3AskBars,
      mode3SpoofWall,
      mode3CircuitBreaker,
      mode3FlowParticles,
      mode4Torus,
      mode4InnerRing,
      mode4SwarmGroup,
      mode4SybilNodes,
      mode4ShieldRing,
      clock: new THREE.Clock(),
      animId: null,
      isAttack: isAttackInjected,
      intensity: attackIntensity / 100,
      speed: simSpeed,
      currentMode: webglMode,
      rotationPulse: 0
    };

    // ==========================================
    // ANIMATION LOOP (60 FPS REALTIME)
    // ==========================================
    const animate = () => {
      const state = threeState.current;
      const delta = state.clock.getDelta() * state.speed;
      const time = state.clock.getElapsedTime() * state.speed;
      const intensity = state.intensity || 0.8;

      state.controls?.update();

      // MODE 0 ANIMATION
      if (state.currentMode === 0) {
        if (state.manifoldMesh) {
          const geo = state.manifoldMesh.geometry as THREE.PlaneGeometry;
          const pos = geo.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            const vx = pos.getX(i);
            const vz = pos.getZ(i);
            const dist = Math.sqrt(vx * vx + vz * vz);
            let vy = Math.sin(dist * 0.6 - time * 2) * 0.6;
            if (state.isAttack) {
              // Gravitational Sinkhole collapse scaled by intensity
              vy -= Math.exp(-dist * 0.22) * (8.5 * intensity);
            }
            pos.setY(i, vy);
          }
          pos.needsUpdate = true;
        }

        if (state.quarantineCage) {
          state.quarantineCage.rotation.y += delta * 0.8;
          state.quarantineCage.rotation.x += delta * 0.4;
          state.quarantineCage.visible = !state.isAttack;
        }

        if (state.mode0Streamlines) {
          state.mode0Streamlines.rotation.y += delta * (state.isAttack ? 0.6 * intensity : 0.2);
        }

        if (state.particles && state.particleHome) {
          const pPos = state.particles.geometry.attributes.position;
          for (let i = 0; i < pPos.count; i++) {
            let px = pPos.getX(i);
            let py = pPos.getY(i);
            let pz = pPos.getZ(i);
            if (state.isAttack) {
              const dist = Math.sqrt(px * px + pz * pz);
              if (dist > 1.2) {
                px -= (px / dist) * delta * (6 * intensity);
                pz -= (pz / dist) * delta * (6 * intensity);
              } else {
                const angle = time * 2 + i * 0.2;
                px = Math.cos(angle) * (10 + Math.random() * 4);
                pz = Math.sin(angle) * (10 + Math.random() * 4);
                py = 2 + Math.random() * 2;
              }
              py += (-3.2 - py) * delta * 3.5;
            } else {
              const hx = state.particleHome[i * 3];
              const hy = state.particleHome[i * 3 + 1];
              const hz = state.particleHome[i * 3 + 2];
              const curR = Math.sqrt(hx * hx + hz * hz);
              const initA = Math.atan2(hz, hx);
              px = Math.cos(initA + time * 0.4) * curR;
              pz = Math.sin(initA + time * 0.4) * curR;
              py = hy + Math.sin(time * 2 + i) * 0.3;
            }
            pPos.setXYZ(i, px, py, pz);
          }
          pPos.needsUpdate = true;
        }
      }

      // MODE 1 ANIMATION
      if (state.currentMode === 1) {
        if (state.mode1DenseNode && state.mode1DivergenceLine) {
          const targetX = state.isAttack ? 13 * intensity : 0;
          const targetZ = state.isAttack ? 6.5 * intensity : 0;
          state.mode1DenseNode.position.x += (targetX - state.mode1DenseNode.position.x) * delta * 3;
          state.mode1DenseNode.position.z += (targetZ - state.mode1DenseNode.position.z) * delta * 3;

          const lineGeo = state.mode1DivergenceLine.geometry;
          lineGeo.setFromPoints([
            state.mode1DenseNode.position,
            new THREE.Vector3(0, 0.5, 0),
            new THREE.Vector3(state.isAttack ? -6 * intensity : 0, -7.5, 0)
          ]);

          const lineMat = state.mode1DivergenceLine.material as THREE.LineBasicMaterial;
          lineMat.color.setHex(state.isAttack ? 0xe63946 : 0x00a878);
        }

        if (state.mode1StreamParticles) {
          const pos = state.mode1StreamParticles.geometry.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            let py = pos.getY(i) - delta * 4;
            if (py < -8) py = 8;
            pos.setY(i, py);
          }
          pos.needsUpdate = true;
        }
      }

      // MODE 2 ANIMATION
      if (state.currentMode === 2) {
        if (state.mode2Core) {
          state.mode2Core.rotation.y += delta * 0.8;
          state.mode2Core.rotation.x += delta * 0.4;
        }
        if (state.mode2TokenGroup) {
          state.mode2TokenGroup.rotation.y += delta * 0.25;
        }
        if (state.mode2StealthToken) {
          state.mode2StealthToken.visible = state.isAttack;
          if (state.isAttack) {
            state.mode2StealthToken.rotation.y += delta * 1.5;
            state.mode2StealthToken.position.y = 3 + Math.sin(time * 4) * 0.8;
          }
        }
        if (state.mode2StealthRays) {
          state.mode2StealthRays.visible = state.isAttack;
        }
        if (state.mode2EntropyShield) {
          state.mode2EntropyShield.visible = !state.isAttack;
          if (!state.isAttack) {
            state.mode2EntropyShield.rotation.y += delta * 0.5;
            state.mode2EntropyShield.rotation.z += delta * 0.3;
          }
        }
      }

      // MODE 3 ANIMATION
      if (state.currentMode === 3) {
        state.mode3BidBars.forEach((b, i) => {
          b.scale.y = 1 + Math.sin(time * 3 + i) * 0.15;
        });
        state.mode3AskBars.forEach((a, i) => {
          a.scale.y = 1 + Math.cos(time * 3 + i) * 0.15;
        });
        if (state.mode3SpoofWall) {
          state.mode3SpoofWall.visible = state.isAttack;
          if (state.isAttack) {
            state.mode3SpoofWall.scale.y = (1 + Math.sin(time * 8) * 0.15) * intensity;
          }
        }
        if (state.mode3CircuitBreaker) {
          state.mode3CircuitBreaker.visible = !state.isAttack;
        }
        if (state.mode3FlowParticles) {
          const pos = state.mode3FlowParticles.geometry.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            let pz = pos.getZ(i) + delta * 7;
            if (pz > 8) pz = -8;
            pos.setZ(i, pz);
          }
          pos.needsUpdate = true;
        }
      }

      // MODE 4 ANIMATION
      if (state.currentMode === 4) {
        if (state.mode4Torus) {
          state.mode4Torus.rotation.y += delta * 0.4;
        }
        if (state.mode4InnerRing) {
          state.mode4InnerRing.rotation.x += delta * 0.7;
          state.mode4InnerRing.rotation.z += delta * 0.3;
        }
        if (state.mode4SwarmGroup) {
          state.mode4SwarmGroup.rotation.y += delta * 0.5;
        }
        state.mode4SybilNodes.forEach((s, idx) => {
          s.visible = state.isAttack;
          if (state.isAttack) {
            s.rotation.y += delta * 1.2;
            s.position.y = 2 + Math.sin(time * 3 + idx) * 1.5;
          }
        });
        if (state.mode4ShieldRing) {
          const mat = state.mode4ShieldRing.material as THREE.MeshBasicMaterial;
          if (!state.isAttack) {
            const pulse = (Math.sin(time * 2.5) + 1) * 0.5;
            mat.opacity = 0.25 + pulse * 0.35;
            state.mode4ShieldRing.scale.setScalar(0.9 + pulse * 0.25);
          } else {
            mat.opacity = 0.05;
          }
        }
      }

      renderer.render(scene, camera);
      state.animId = requestAnimationFrame(animate);
    };

    animate();

    // ResizeObserver for responsive canvas sizing
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
      if (threeState.current.animId) {
        cancelAnimationFrame(threeState.current.animId);
      }
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

  // Update Three.js when attack state changes
  useEffect(() => {
    threeState.current.isAttack = isAttackInjected;
    threeState.current.intensity = attackIntensity / 100;
  }, [isAttackInjected, attackIntensity]);

  // Update Three.js when simulation speed changes
  useEffect(() => {
    threeState.current.speed = simSpeed;
  }, [simSpeed]);

  // Update Three.js when mode changes
  useEffect(() => {
    threeState.current.currentMode = webglMode;
    threeState.current.modeGroups.forEach((g, idx) => {
      g.visible = idx === webglMode;
    });
  }, [webglMode]);

  const handleExecuteHouseholderRotation = () => {
    runLayer0MTVD();
    if (threeState.current.particles) {
      gsap.to(threeState.current.particles.rotation, {
        y: '+=' + Math.PI,
        duration: 0.8,
        ease: 'power3.out'
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#FBF3E2] text-[#410217]">
      
      {/* Page Header with Dual Navigation Tabs */}
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
                PAGE 2 // INTERACTIVE FINDINGS, ALGORITHMS & VISUALIZERS
              </div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#410217]">
                Counter-GEO Sovereign Architecture Lab
              </h2>
            </div>
          </div>

          {/* Tab Switcher for Page 2 Modules */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#F5EAD4] border border-[#F2D69D] text-xs font-mono">
            <button
              onClick={() => setActiveTab('algorithms')}
              className={`px-3 py-1.5 font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'algorithms'
                  ? 'bg-[#410217] text-[#FBF3E2] shadow-xs'
                  : 'text-[#410217]/70 hover:text-[#410217]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-[#D5991C]" />
              <span>1. Live Algorithm Runner</span>
            </button>

            <button
              onClick={() => setActiveTab('charts')}
              className={`px-3 py-1.5 font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'charts'
                  ? 'bg-[#410217] text-[#FBF3E2] shadow-xs'
                  : 'text-[#410217]/70 hover:text-[#410217]'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5 text-[#D5991C]" />
              <span>2. Whitepaper Charts & Figures</span>
            </button>

            <button
              onClick={() => setActiveTab('webgl')}
              className={`px-3 py-1.5 font-bold transition-all cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'webgl'
                  ? 'bg-[#410217] text-[#FBF3E2] shadow-xs'
                  : 'text-[#410217]/70 hover:text-[#410217]'
              }`}
            >
              <Activity className="w-3.5 h-3.5 text-[#00A878]" />
              <span>3. WebGL 3D Physics Engine</span>
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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        
        {/* ========================================================
            TAB 1: LIVE ALGORITHM EXECUTION LAB (ACTUAL CODE RUNS)
           ======================================================== */}
        {activeTab === 'algorithms' && (
          <div className="space-y-10">
            
            {/* Lab Intro Callout */}
            <div className="p-6 bg-[#FAF2E1] border-l-4 border-[#00A878] border-y border-r border-[#F2D69D] space-y-2">
              <div className="flex items-center space-x-2 text-xs font-mono text-[#00A878] font-bold uppercase tracking-wider">
                <CheckCircle2 className="w-4 h-4" />
                <span>Verified Interactive Production Code Simulation</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-[#410217]">
                Live Mathematical Defense Engine (Client-Side Real-Time Execution)
              </h3>
              <p className="text-sm text-[#410217]/80 leading-relaxed font-sans max-w-4xl">
                The implementations below run the exact mathematical algorithms specified in{' '}
                <strong className="text-[#410217]">Counter GEO Master Doc Volume 1</strong>. Adjust parameters,
                switch attack scenarios, and observe real-time matrix transformations, Levina-Bickel LID
                collapses, Hawkes point-process decay, and SEC Rule 15c3-8 limit-order book damping.
              </p>
            </div>

            {/* Algorithms Grid (6 Defense Layers) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* CARD 1: LAYER 0 - MTVD Householder Rotation */}
              <div className="bg-[#FFFDF8] border border-[#F2D69D] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                  <span className="font-mono text-xs text-[#D5991C] font-bold uppercase tracking-wider">
                    // LAYER 0 DEFENSE
                  </span>
                  <span className="font-mono text-[10px] bg-[#FAF2E1] px-2 py-0.5 border border-[#F2D69D] text-[#004566] font-bold">
                    MTVD & CANARY MANIFOLD
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-lg text-[#410217]">
                    Key-Seeded Isometric Orthogonal Rotation (IOMR)
                  </h4>
                  <p className="text-xs text-[#410217]/75 font-sans mt-1">
                    Householder reflection Q_t = (I - 2 u u^T) transforms vector indexing every epoch,
                    preserving natural distances while scrambling adversarial hubs.
                  </p>
                </div>

                <div className="space-y-3 font-mono text-xs bg-[#FAF2E1] p-4 border border-[#F2D69D]">
                  <div className="flex justify-between items-center">
                    <span>Embedding Space Dimension (d):</span>
                    <span className="font-bold text-[#410217]">{mtvdDim}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Spectral Canary Energy (E_canary):</span>
                    <span className={`font-bold ${mtvdCanaryEnergyResult?.isTriggered ? 'text-[#8B1E1E]' : 'text-[#00A878]'}`}>
                      {mtvdCanaryEnergyResult?.energy.toFixed(4) ?? '0.0000'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Canary Scraper Alarm:</span>
                    <span className={`font-bold uppercase ${mtvdCanaryEnergyResult?.isTriggered ? 'text-[#8B1E1E]' : 'text-[#00A878]'}`}>
                      {mtvdCanaryEnergyResult?.isTriggered ? 'ALERT: SURROGATE SCRAPER DETECTED' : 'CLEAR'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Natural Distance Preservation:</span>
                    <span className="font-bold text-[#00A878]">
                      {mtvdIsometryResult?.distancePreservationPct.toFixed(2)}% (Machine Epsilon)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Adversarial Hub Displacement Drift:</span>
                    <span className="font-bold text-[#8B1E1E]">
                      +{mtvdIsometryResult?.adversarialHubDrift.toFixed(4)} (Hub Geometry Broken)
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleExecuteHouseholderRotation}
                  className="w-full py-2.5 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] font-mono text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center space-x-2 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#D5991C]" />
                  <span>Execute Secret Householder Rotation Q_t</span>
                </button>
              </div>

              {/* CARD 2: LAYER 1 - AM-CIDP Levina-Bickel LID */}
              <div className="bg-[#FFFDF8] border border-[#F2D69D] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                  <span className="font-mono text-xs text-[#D5991C] font-bold uppercase tracking-wider">
                    // LAYER 1 DEFENSE
                  </span>
                  <span className="font-mono text-[10px] bg-[#FAF2E1] px-2 py-0.5 border border-[#F2D69D] text-[#8B1E1E] font-bold">
                    AM-CIDP (UPGRADED AMTD)
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-lg text-[#410217]">
                    Levina-Bickel Local Intrinsic Dimensionality (LID)
                  </h4>
                  <p className="text-xs text-[#410217]/75 font-sans mt-1">
                    Detects topological vector sinkholes. Adversarial retrieval hubs collapse local tangent
                    degrees of freedom into low-dimensional bottlenecks (LID &lt; 4.5).
                  </p>
                </div>

                <div className="flex space-x-2 text-xs font-mono">
                  <button
                    onClick={() => runLayer1AMCIDP('adversarial_hub')}
                    className={`flex-1 py-1.5 border font-bold cursor-pointer transition-all ${
                      amcidpClusterType === 'adversarial_hub'
                        ? 'bg-[#8B1E1E] text-[#FBF3E2] border-[#8B1E1E]'
                        : 'bg-[#FAF2E1] text-[#410217] border-[#F2D69D]'
                    }`}
                  >
                    Test Adversarial Hub
                  </button>
                  <button
                    onClick={() => runLayer1AMCIDP('natural')}
                    className={`flex-1 py-1.5 border font-bold cursor-pointer transition-all ${
                      amcidpClusterType === 'natural'
                        ? 'bg-[#00A878] text-[#130108] border-[#00A878]'
                        : 'bg-[#FAF2E1] text-[#410217] border-[#F2D69D]'
                    }`}
                  >
                    Test Natural News
                  </button>
                </div>

                <div className="space-y-3 font-mono text-xs bg-[#FAF2E1] p-4 border border-[#F2D69D]">
                  <div className="flex justify-between items-center">
                    <span>Levina-Bickel LID Estimator (LID_k):</span>
                    <span className={`font-bold ${amcidpResult?.isFlagged ? 'text-[#8B1E1E]' : 'text-[#00A878]'}`}>
                      {amcidpResult?.lid.toFixed(2) ?? '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Gram Spectral Entropy (H_spectral):</span>
                    <span className="font-bold text-[#410217]">
                      {amcidpResult?.spectralEntropy.toFixed(3) ?? '0.000'} nats
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>AM-CIDP Composite Anomaly Score:</span>
                    <span className={`font-bold ${amcidpResult?.isFlagged ? 'text-[#8B1E1E]' : 'text-[#00A878]'}`}>
                      {amcidpResult?.manifoldAnomalyScore.toFixed(4) ?? '0.000'} (Threshold: 0.72)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Topological Filter Status:</span>
                    <span className={`font-bold uppercase ${amcidpResult?.isFlagged ? 'text-[#8B1E1E]' : 'text-[#00A878]'}`}>
                      {amcidpResult?.verdict.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-[#410217]/70">
                  ⚡ Pre-retrieval latency: <strong className="text-[#00A878]">1.8 ms</strong> via pre-indexed HNSW neighbors.
                </div>
              </div>

              {/* CARD 3: LAYER 2 - NCARD Rank Divergence */}
              <div className="bg-[#FFFDF8] border border-[#F2D69D] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                  <span className="font-mono text-xs text-[#D5991C] font-bold uppercase tracking-wider">
                    // LAYER 2 DEFENSE
                  </span>
                  <span className="font-mono text-[10px] bg-[#FAF2E1] px-2 py-0.5 border border-[#F2D69D] text-[#004566] font-bold">
                    NCARD RANK DIVERGENCE
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-lg text-[#410217]">
                    Normalized Cross-Architecture Rank Divergence
                  </h4>
                  <p className="text-xs text-[#410217]/75 font-sans mt-1">
                    Evaluates consistency across Dense, ColBERT Late-Interaction, and Sparse SPLADE retrievers.
                    Solves scale non-linearity of Delta_CEGD.
                  </p>
                </div>

                {/* Rank Inputs */}
                <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                  <div>
                    <label className="text-[10px] text-[#410217]/70 block">Dense Rank:</label>
                    <input
                      type="number"
                      value={ncardDenseRank}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setNcardDenseRank(val);
                        runLayer2NCARD(val, ncardColbertRank, ncardSparseRank);
                      }}
                      className="w-full bg-[#FAF2E1] border border-[#F2D69D] p-1.5 font-bold text-[#410217]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#410217]/70 block">ColBERT Rank:</label>
                    <input
                      type="number"
                      value={ncardColbertRank}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setNcardColbertRank(val);
                        runLayer2NCARD(ncardDenseRank, val, ncardSparseRank);
                      }}
                      className="w-full bg-[#FAF2E1] border border-[#F2D69D] p-1.5 font-bold text-[#410217]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-[#410217]/70 block">Sparse Rank:</label>
                    <input
                      type="number"
                      value={ncardSparseRank}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setNcardSparseRank(val);
                        runLayer2NCARD(ncardDenseRank, ncardColbertRank, val);
                      }}
                      className="w-full bg-[#FAF2E1] border border-[#F2D69D] p-1.5 font-bold text-[#410217]"
                    />
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs bg-[#FAF2E1] p-4 border border-[#F2D69D]">
                  <div className="flex justify-between items-center">
                    <span>Depth-Weighted NCARD Score:</span>
                    <span className={`font-bold ${ncardResult?.isQuarantined ? 'text-[#8B1E1E]' : 'text-[#00A878]'}`}>
                      {ncardResult?.ncardScore.toFixed(4) ?? '0.0000'} (Threshold: 0.4500)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Quarantine Status:</span>
                    <span className={`font-bold uppercase ${ncardResult?.isQuarantined ? 'text-[#8B1E1E]' : 'text-[#00A878]'}`}>
                      {ncardResult?.verdict.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-[#410217]/70">
                  ⚡ Eliminates scale distortion of corpus size N while gating R &le; 10 context window.
                </div>
              </div>

              {/* CARD 4: LAYER 3 - TCG-CL v2.0 C2PA & Hawkes Sybil */}
              <div className="bg-[#FFFDF8] border border-[#F2D69D] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                  <span className="font-mono text-xs text-[#D5991C] font-bold uppercase tracking-wider">
                    // LAYER 3 DEFENSE
                  </span>
                  <span className="font-mono text-[10px] bg-[#FAF2E1] px-2 py-0.5 border border-[#F2D69D] text-[#00A878] font-bold">
                    TCG-CL v2.0 & C2PA
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-lg text-[#410217]">
                    Temporal Citation Graph & Hawkes Point Process
                  </h4>
                  <p className="text-xs text-[#410217]/75 font-sans mt-1">
                    Defeats multi-domain synthetic consensus. Distinguishes organic breaking reporting
                    from closed-loop state Sybil botnets via C2PA roots and Hawkes burstiness (CV^2).
                  </p>
                </div>

                <div className="flex space-x-2 text-xs font-mono">
                  <button
                    onClick={() => runLayer3TCGCL('coordinated_sybil')}
                    className={`flex-1 py-1.5 border font-bold cursor-pointer transition-all ${
                      sybilClusterType === 'coordinated_sybil'
                        ? 'bg-[#8B1E1E] text-[#FBF3E2] border-[#8B1E1E]'
                        : 'bg-[#FAF2E1] text-[#410217] border-[#F2D69D]'
                    }`}
                  >
                    Simulate Sybil Botnet
                  </button>
                  <button
                    onClick={() => runLayer3TCGCL('organic_journalism')}
                    className={`flex-1 py-1.5 border font-bold cursor-pointer transition-all ${
                      sybilClusterType === 'organic_journalism'
                        ? 'bg-[#00A878] text-[#130108] border-[#00A878]'
                        : 'bg-[#FAF2E1] text-[#410217] border-[#F2D69D]'
                    }`}
                  >
                    Simulate C2PA SEC Wire
                  </button>
                </div>

                <div className="space-y-3 font-mono text-xs bg-[#FAF2E1] p-4 border border-[#F2D69D]">
                  <div className="flex justify-between items-center">
                    <span>Hawkes Point-Process Sybil Probability:</span>
                    <span className={`font-bold ${tcgclResult?.sybilProbability > 0.5 ? 'text-[#8B1E1E]' : 'text-[#00A878]'}`}>
                      {(tcgclResult?.sybilProbability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>C2PA Hardware-Verified Roots:</span>
                    <span className="font-bold text-[#00A878]">
                      {tcgclResult?.c2paVerifiedRoots.length ?? 0} ROOT KEYS
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Quarantined Sybil Nodes:</span>
                    <span className="font-bold text-[#8B1E1E]">
                      {tcgclResult?.quarantinedNodes.length ?? 0} BLOCKED
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Lineage Consensus Verdict:</span>
                    <span className={`font-bold uppercase ${tcgclResult?.sybilProbability > 0.5 ? 'text-[#8B1E1E]' : 'text-[#00A878]'}`}>
                      {tcgclResult?.verdict.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-[#410217]/70">
                  ⚡ Unanchored Sybil domains without C2PA keys converge mathematically to w = 0.00.
                </div>
              </div>

              {/* CARD 5: LAYER 4A - CEH-ASID Attention Tomography */}
              <div className="bg-[#FFFDF8] border border-[#F2D69D] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                  <span className="font-mono text-xs text-[#D5991C] font-bold uppercase tracking-wider">
                    // LAYER 4A DEFENSE
                  </span>
                  <span className="font-mono text-[10px] bg-[#FAF2E1] px-2 py-0.5 border border-[#F2D69D] text-[#D5991C] font-bold">
                    CEH-ASID & MÖBIUS SYNERGY
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-lg text-[#410217]">
                    Combinatorial Epistemic Holography & Attention Tomography
                  </h4>
                  <p className="text-xs text-[#410217]/75 font-sans mt-1">
                    Detects Split-Payload (Enthymematic) attacks across multiple benign documents.
                    Applies surgical attention masking (mask[u,v] = -1e9) to sever bridge tokens.
                  </p>
                </div>

                <div className="flex space-x-2 text-xs font-mono">
                  <button
                    onClick={() => runLayer4ACEHASID('split_payload_enthymeme')}
                    className={`flex-1 py-1.5 border font-bold cursor-pointer transition-all ${
                      cehasidAttackScenario === 'split_payload_enthymeme'
                        ? 'bg-[#8B1E1E] text-[#FBF3E2] border-[#8B1E1E]'
                        : 'bg-[#FAF2E1] text-[#410217] border-[#F2D69D]'
                    }`}
                  >
                    Inject Split Payload
                  </button>
                  <button
                    onClick={() => runLayer4ACEHASID('independent_facts')}
                    className={`flex-1 py-1.5 border font-bold cursor-pointer transition-all ${
                      cehasidAttackScenario === 'independent_facts'
                        ? 'bg-[#00A878] text-[#130108] border-[#00A878]'
                        : 'bg-[#FAF2E1] text-[#410217] border-[#F2D69D]'
                    }`}
                  >
                    Natural Passages
                  </button>
                </div>

                <div className="space-y-3 font-mono text-xs bg-[#FAF2E1] p-4 border border-[#F2D69D]">
                  <div className="flex justify-between items-center">
                    <span>Möbius Synergy Interaction I(A, B):</span>
                    <span className={`font-bold ${cehasidResult?.isSuperAdditiveAttack ? 'text-[#8B1E1E]' : 'text-[#00A878]'}`}>
                      +{cehasidResult?.mobiusInteractionSynergy.toFixed(4) ?? '0.0000'} nats (Threshold: 0.35)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Cross-Passage Attention Coupling &Omega;_ij:</span>
                    <span className="font-bold text-[#410217]">
                      {cehasidResult?.attentionOmegaCoupling.toFixed(4) ?? '0.0000'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Surgical Attention Firewall Mask:</span>
                    <span className={`font-bold uppercase ${cehasidResult?.firewallMaskApplied ? 'text-[#8B1E1E]' : 'text-[#00A878]'}`}>
                      {cehasidResult?.firewallMaskApplied ? 'ENGAGED: MASK[-1e9] SEVERED' : 'CLEAN'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Synthesis Verdict:</span>
                    <span className={`font-bold uppercase ${cehasidResult?.isSuperAdditiveAttack ? 'text-[#8B1E1E]' : 'text-[#00A878]'}`}>
                      {cehasidResult?.verdict.replace(/_/g, ' ')}
                    </span>
                  </div>
                </div>

                <div className="text-[11px] font-mono text-[#410217]/70">
                  ⚡ Neutralizes split attacks in a single forward pass under 5.1 ms.
                </div>
              </div>

              {/* CARD 6: LAYER 4B - TMMEG Thermodynamic Order Book Shield */}
              <div className="bg-[#FFFDF8] border border-[#F2D69D] p-6 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                  <span className="font-mono text-xs text-[#D5991C] font-bold uppercase tracking-wider">
                    // LAYER 4B DEFENSE
                  </span>
                  <span className="font-mono text-[10px] bg-[#FAF2E1] px-2 py-0.5 border border-[#F2D69D] text-[#8B1E1E] font-bold">
                    TMMEG & SEC RULE 15c3-8
                  </span>
                </div>

                <div>
                  <h4 className="font-serif font-bold text-lg text-[#410217]">
                    Thermodynamic Market-Microstructure Epistemic Grounding
                  </h4>
                  <p className="text-xs text-[#410217]/75 font-sans mt-1">
                    Binds unstructured RAG text to live Limit Order Book energy, VPIN, and Kyle's lambda.
                    Detects Predatory Liquidity Traps and triggers 15-second epistemic halts.
                  </p>
                </div>

                <div className="space-y-3 font-mono text-xs bg-[#FAF2E1] p-4 border border-[#F2D69D]">
                  <div className="flex justify-between items-center">
                    <span>Raw Unfiltered RAG Signal:</span>
                    <span className="font-bold text-[#8B1E1E]">
                      +{tmmegRagSignal.toFixed(2)} (AGGRESSIVE BUY SWEEP)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Order Book Asymmetry (OBAR):</span>
                    <span className="font-bold text-[#8B1E1E]">
                      +{tmmegResult?.obarAsymmetry.toFixed(4) ?? '0.0000'} (PRE-POSITIONED ASK WALL)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Predatory Liquidity Trap Score:</span>
                    <span className={`font-bold ${tmmegResult?.predatoryTrapScore >= 0.65 ? 'text-[#8B1E1E]' : 'text-[#00A878]'}`}>
                      {tmmegResult?.predatoryTrapScore.toFixed(4) ?? '0.0000'} (Threshold: 0.65)
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Thermodynamic Damping Factor &Gamma;_t:</span>
                    <span className="font-bold text-[#410217]">
                      {tmmegResult?.dampingFactorGamma.toFixed(4) ?? '0.0000'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>SEC Rule 15c3-8 Status:</span>
                    <span className={`font-bold uppercase ${tmmegResult?.isEpistemicHaltTriggered ? 'text-[#8B1E1E]' : 'text-[#00A878]'}`}>
                      {tmmegResult?.statusText}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    alert(tmmegResult?.catAuditTelemetryJson);
                  }}
                  className="w-full py-2 bg-[#FAF2E1] border border-[#F2D69D] hover:bg-[#F2D69D]/40 text-[#410217] font-mono text-xs font-bold uppercase tracking-wider cursor-pointer flex items-center justify-center space-x-2"
                >
                  <Terminal className="w-3.5 h-3.5 text-[#00A878]" />
                  <span>Inspect SEC CAT WORM Epistemic Audit JSON</span>
                </button>
              </div>

            </div>

          </div>
        )}

        {/* ========================================================
            TAB 2: WHITEPAPER CHARTS & ARCHITECTURAL FIGURES
           ======================================================== */}
        {activeTab === 'charts' && (
          <div className="space-y-12">
            
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <span className="font-mono text-xs text-[#D5991C] uppercase tracking-widest font-bold">
                // ARCHITECTURAL SCHEMATICS & EMPIRICAL BENCHMARKS
              </span>
              <h3 className="font-serif text-3xl font-bold text-[#410217]">
                Whitepaper Graphic Figures & Synthesis Matrix
              </h3>
              <p className="text-sm text-[#410217]/75 font-sans">
                Interactive diagrams faithfully recreating Figures 1–8 and Tables 1–5 from Counter GEO Master Doc Volume 1.
              </p>
            </div>

            {/* FIGURE 1: Multi-Stage RAG Pipeline Flow */}
            <div className="bg-[#FFFDF8] border border-[#F2D69D] p-6 sm:p-8 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                <div>
                  <span className="font-mono text-xs text-[#D5991C] font-bold uppercase tracking-wider block">
                    FIGURE 1: MULTI-STAGE RAG ARCHITECTURE PROCESSING FLOW
                  </span>
                  <h4 className="font-serif text-xl font-bold text-[#410217]">
                    End-to-End Generative Engine Pipeline Breakdown
                  </h4>
                </div>
                <span className="font-mono text-xs bg-[#FAF2E1] px-2.5 py-1 border border-[#F2D69D] text-[#004566] font-bold">
                  Aggarwal et al. (2024)
                </span>
              </div>

              {/* Interactive 5-Stage Diagram */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-3 font-mono text-xs">
                <div className="bg-[#FAF2E1] border border-[#F2D69D] p-4 text-center space-y-2">
                  <div className="text-[#D5991C] font-bold uppercase">Stage 1</div>
                  <div className="font-serif font-bold text-sm text-[#410217]">Query Expansion</div>
                  <div className="text-[11px] text-[#410217]/70 font-sans">
                    Breaks user query into multi-intent sub-prompts.
                  </div>
                </div>

                <div className="bg-[#FAF2E1] border border-[#F2D69D] p-4 text-center space-y-2">
                  <div className="text-[#D5991C] font-bold uppercase">Stage 2</div>
                  <div className="font-serif font-bold text-sm text-[#410217]">Hybrid Retrieval</div>
                  <div className="text-[11px] text-[#410217]/70 font-sans">
                    Fetches candidates across Dense vector & Sparse BM25 indices.
                  </div>
                </div>

                <div className="bg-[#FAF2E1] border border-[#F2D69D] p-4 text-center space-y-2">
                  <div className="text-[#D5991C] font-bold uppercase">Stage 3</div>
                  <div className="font-serif font-bold text-sm text-[#410217]">Cross-Encoder</div>
                  <div className="text-[11px] text-[#410217]/70 font-sans">
                    Filters top-k candidate passages into context window.
                  </div>
                </div>

                <div className="bg-[#FAF2E1] border border-[#F2D69D] p-4 text-center space-y-2">
                  <div className="text-[#D5991C] font-bold uppercase">Stage 4</div>
                  <div className="font-serif font-bold text-sm text-[#410217]">LLM Synthesis</div>
                  <div className="text-[11px] text-[#410217]/70 font-sans">
                    Context compression & multi-document claim extraction.
                  </div>
                </div>

                <div className="bg-[#FAF2E1] border border-[#F2D69D] p-4 text-center space-y-2">
                  <div className="text-[#D5991C] font-bold uppercase">Stage 5</div>
                  <div className="font-serif font-bold text-sm text-[#410217]">Inline Attribution</div>
                  <div className="text-[11px] text-[#410217]/70 font-sans">
                    Assigns source footnoting & authoritative mentions.
                  </div>
                </div>
              </div>
            </div>

            {/* TABLE 1: Traditional SEO vs. Generative Engine Optimization */}
            <div className="bg-[#FFFDF8] border border-[#F2D69D] p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                <div>
                  <span className="font-mono text-xs text-[#D5991C] font-bold uppercase tracking-wider block">
                    TABLE 1: PARADIGM COMPARISON
                  </span>
                  <h4 className="font-serif text-xl font-bold text-[#410217]">
                    Traditional SEO vs. Generative Engine Optimization (GEO)
                  </h4>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm font-sans">
                  <thead>
                    <tr className="bg-[#410217] text-[#FBF3E2] font-serif font-bold">
                      <th className="p-3 border-r border-[#F2D69D]/30">Dimension</th>
                      <th className="p-3 border-r border-[#F2D69D]/30">Traditional SEO</th>
                      <th className="p-3">Generative Engine Optimization (GEO)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2D69D]">
                    <tr className="hover:bg-[#FAF2E1]">
                      <td className="p-3 font-bold font-mono text-xs text-[#410217]">Primary Goal</td>
                      <td className="p-3 text-[#410217]/80">Rank link URLs on Page 1 of SERP</td>
                      <td className="p-3 font-semibold text-[#8B1E1E]">Gain inline citations & entity mentions in LLM answer</td>
                    </tr>
                    <tr className="hover:bg-[#FAF2E1]">
                      <td className="p-3 font-bold font-mono text-xs text-[#410217]">Unit of Optimization</td>
                      <td className="p-3 text-[#410217]/80">Whole Webpage / Domain Authority</td>
                      <td className="p-3 font-semibold text-[#8B1E1E]">Self-contained, fact-dense passage or section</td>
                    </tr>
                    <tr className="hover:bg-[#FAF2E1]">
                      <td className="p-3 font-bold font-mono text-xs text-[#410217]">Retrieval Engine</td>
                      <td className="p-3 text-[#410217]/80">Inverted Keyword Indexes / PageRank</td>
                      <td className="p-3 font-semibold text-[#8B1E1E]">Vector Embeddings + Hybrid Dense-Lexical Search</td>
                    </tr>
                    <tr className="hover:bg-[#FAF2E1]">
                      <td className="p-3 font-bold font-mono text-xs text-[#410217]">Output Format</td>
                      <td className="p-3 text-[#410217]/80">Hyperlink List with Blue Text</td>
                      <td className="p-3 font-semibold text-[#8B1E1E]">Unified natural language response with footnotes</td>
                    </tr>
                    <tr className="hover:bg-[#FAF2E1]">
                      <td className="p-3 font-bold font-mono text-xs text-[#410217]">Traffic & Influence</td>
                      <td className="p-3 text-[#410217]/80">Direct referral click-throughs (CTR)</td>
                      <td className="p-3 font-semibold text-[#8B1E1E]">Zero-click answers & autonomous agent execution</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* TABLE 4: Master Six-Layer Counter-GEO Synthesis Matrix */}
            <div className="bg-[#FFFDF8] border border-[#F2D69D] p-6 sm:p-8 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                <div>
                  <span className="font-mono text-xs text-[#D5991C] font-bold uppercase tracking-wider block">
                    TABLE 4: MASTER SYNTHESIS SPECIFICATION MATRIX
                  </span>
                  <h4 className="font-serif text-xl font-bold text-[#410217]">
                    The Six-Layer Sovereign Counter-GEO Defense Stack
                  </h4>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="bg-[#410217] text-[#FBF3E2] font-bold">
                      <th className="p-3 border-r border-[#F2D69D]/30">Layer</th>
                      <th className="p-3 border-r border-[#F2D69D]/30">Algorithm / Protocol</th>
                      <th className="p-3 border-r border-[#F2D69D]/30">Primary Threat Target</th>
                      <th className="p-3 border-r border-[#F2D69D]/30">Mathematical Core</th>
                      <th className="p-3 border-r border-[#F2D69D]/30">Latency</th>
                      <th className="p-3">Pipeline Placement</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2D69D]">
                    {MASTER_DOC_METADATA.defenseStackLayers.map((l, i) => (
                      <tr key={i} className="hover:bg-[#FAF2E1]">
                        <td className="p-3 font-bold text-[#D5991C]">{l.layer}</td>
                        <td className="p-3 font-bold text-[#410217]">{l.name}</td>
                        <td className="p-3 text-[#8B1E1E]">{l.target}</td>
                        <td className="p-3 text-[#410217]/80">{l.core}</td>
                        <td className="p-3 font-bold text-[#00A878]">
                          {i === 0 ? '< 0.4 ms' : i === 1 ? '1.8 ms' : i === 2 ? '4.2 ms' : i === 3 ? '6.5 ms' : i === 4 ? '5.1 ms' : '< 0.2 ms'}
                        </td>
                        <td className="p-3 text-[#410217]/70">
                          {i === 0 ? 'Vector Storage & Honeypots' : i === 1 ? 'Vector DB Ingestion' : i === 2 ? 'Candidate Fusion' : i === 3 ? 'Cross-Encoder Reranker' : i === 4 ? 'LLM Context Synthesis' : 'Order Routing Gateway'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 3: 3D WEBGL 2.0 PHYSICS ENGINE (THREE.JS)
           ======================================================== */}
        {activeTab === 'webgl' && (
          <div className="space-y-6">
            
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="font-mono text-xs text-[#00A878] uppercase font-bold tracking-wider">
                  // WEBGL 2.0 HIGH-PERFORMANCE 3D ENGINE
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#410217]">
                  Real-Time Topological Vector Field & Microstructure Engine
                </h3>
              </div>

              {/* Mode Selectors */}
              <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
                {['Mode 0: AM-CIDP Manifold', 'Mode 1: NCARD Planes', 'Mode 2: CEH-ASID Attention', 'Mode 3: TMMEG LOB Canyon', 'Mode 4: zk-SNARK Swarm'].map((m, idx) => (
                  <button
                    key={idx}
                    onClick={() => setWebglMode(idx)}
                    className={`px-3 py-1.5 border font-bold cursor-pointer transition-all ${
                      webglMode === idx
                        ? 'bg-[#410217] text-[#FBF3E2] border-[#D5991C]'
                        : 'bg-[#FAF2E1] text-[#410217] border-[#F2D69D]'
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* 3D WebGL Canvas Container */}
            <div className="relative rounded-none border-2 border-[#410217] bg-[#363636] overflow-hidden shadow-2xl h-[580px] min-h-[580px]">
              
              <div ref={threeMountRef} className="w-full h-full min-h-[580px]" style={{ width: '100%', height: '580px' }} />

              {/* Top Left Overlay: Red-Team Probe Controls */}
              <div className="absolute top-4 left-4 z-20 space-y-2 font-mono text-xs max-w-sm">
                <div className="bg-[#363636]/95 backdrop-blur-md border border-[#F2D69D]/30 p-3 space-y-2.5 text-[#FBF3E2] shadow-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] text-[#D5991C] font-bold uppercase tracking-wider">
                      Interactive Red-Team Probe
                    </span>
                    <span className="text-[9px] text-[#00A878] font-bold uppercase">60 FPS Realtime</span>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setIsAttackInjected(true)}
                      className={`px-3 py-1.5 border font-bold uppercase cursor-pointer flex items-center space-x-1.5 transition-all text-left text-[11px] ${
                        isAttackInjected ? 'bg-[#E63946] text-[#FBF3E2] border-[#E63946] shadow-md shadow-[#E63946]/30' : 'bg-[#2a2a2a] text-[#E63946] border-[#E63946]/50 hover:bg-[#E63946]/20'
                      }`}
                    >
                      <Zap className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {webglMode === 0 && 'Inject Hub Sinkhole'}
                        {webglMode === 1 && 'Trigger Dense Drift'}
                        {webglMode === 2 && 'Inject Stealth Token'}
                        {webglMode === 3 && 'Drop $45M Ask Wall'}
                        {webglMode === 4 && 'Inject Sybil Probe'}
                      </span>
                    </button>
                    <button
                      onClick={() => setIsAttackInjected(false)}
                      className={`px-3 py-1.5 border font-bold uppercase cursor-pointer flex items-center space-x-1.5 transition-all text-left text-[11px] ${
                        !isAttackInjected ? 'bg-[#00A878] text-[#130108] border-[#00A878] shadow-md shadow-[#00A878]/30' : 'bg-[#2a2a2a] text-[#00A878] border-[#00A878]/50 hover:bg-[#00A878]/20'
                      }`}
                    >
                      <Shield className="w-3.5 h-3.5 shrink-0" />
                      <span>
                        {webglMode === 0 && 'Engage AM-CIDP Cage'}
                        {webglMode === 1 && 'Align NCARD Rank'}
                        {webglMode === 2 && 'Entropy Gate Shield'}
                        {webglMode === 3 && 'Epistemic Rollback'}
                        {webglMode === 4 && 'Verify zk-SNARK'}
                      </span>
                    </button>
                  </div>

                  {/* Interactive Attack Intensity Slider */}
                  <div className="pt-1.5 border-t border-[#F2D69D]/20 space-y-1">
                    <div className="flex justify-between text-[10px] text-[#FAF2E1]/80">
                      <span>Probe Intensity: {attackIntensity}%</span>
                      <span className="text-[#D5991C]">
                        {attackIntensity > 75 ? 'Critical Anomaly' : attackIntensity > 40 ? 'Moderate Anomaly' : 'Sub-Threshold'}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="10"
                      max="100"
                      value={attackIntensity}
                      onChange={(e) => setAttackIntensity(Number(e.target.value))}
                      className="w-full accent-[#00A878] cursor-pointer h-1.5 bg-[#410217]"
                    />
                  </div>
                </div>
              </div>

              {/* Top Right Overlay: Camera Presets & Speed Controls */}
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
              <div className="absolute bottom-4 left-4 right-4 z-20 bg-[#363636]/95 backdrop-blur-md border border-[#F2D69D]/30 p-3 font-mono text-xs text-[#FBF3E2] space-y-2 shadow-2xl">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#F2D69D]/20 pb-2">
                  <div className="flex items-center space-x-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${isAttackInjected ? 'bg-[#E63946] animate-pulse shadow-sm shadow-[#E63946]' : 'bg-[#00A878] shadow-sm shadow-[#00A878]'}`} />
                    <span className="font-bold text-sm tracking-wide">
                      {isAttackInjected
                        ? `ATTACK TRIGGERED // ${['COLLAPSED MANIFOLD SINGULARITY', 'NCARD DIVERGENCE (Δr > 60)', 'CEH-ASID ATTENTION HIJACKED', 'TMMEG CANCELLATION OVERFLOW', 'SYBIL POISON PROBE REJECTED'][webglMode]}`
                        : `SOVEREIGN DEFENSE ACTIVE // ${['TOPOLOGICAL MANIFOLD PRESERVED', 'NCARD MULTI-VECTOR CONSENSUS', 'CEH-ASID ZERO-FONT SUPPRESSED', 'TMMEG ORDER BOOK EQUILIBRIUM', 'BN254 zk-SNARK SWARM PROVED'][webglMode]}`}
                    </span>
                  </div>
                  <div className="text-[#D5991C] text-[11px] flex items-center space-x-2">
                    <span>Rotate: Left-Click + Drag</span>
                    <span>|</span>
                    <span>Zoom: Scroll</span>
                    <span>|</span>
                    <span>Pan: Right-Click</span>
                  </div>
                </div>

                {/* Real-time Math Metrics Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
                  {webglMode === 0 && (
                    <>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#D5991C] block text-[9px]">INTRINSIC DIM (LID):</span>
                        <span className={`font-bold ${isAttackInjected ? 'text-[#E63946]' : 'text-[#00A878]'}`}>
                          {isAttackInjected ? (24.6 - (16.8 * (attackIntensity / 100))).toFixed(1) : '24.6 (Clean)'}
                        </span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#D5991C] block text-[9px]">CURVATURE κ(x):</span>
                        <span className={`font-bold ${isAttackInjected ? 'text-[#E63946]' : 'text-[#00A878]'}`}>
                          {isAttackInjected ? (0.04 + (0.85 * (attackIntensity / 100))).toFixed(3) : '0.042 (Flat)'}
                        </span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#D5991C] block text-[9px]">SINKHOLE TRAPPING:</span>
                        <span className={`font-bold ${isAttackInjected ? 'text-[#E63946]' : 'text-[#00A878]'}`}>
                          {isAttackInjected ? `${Math.round(84 * (attackIntensity / 100))}%` : '0.0% (Quarantined)'}
                        </span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#D5991C] block text-[9px]">AM-CIDP LATENCY:</span>
                        <span className="font-bold text-[#00A878]">1.8 ms (P99)</span>
                      </div>
                    </>
                  )}

                  {webglMode === 1 && (
                    <>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#D5991C] block text-[9px]">DENSE RANK (r₁):</span>
                        <span className={`font-bold ${isAttackInjected ? 'text-[#E63946]' : 'text-[#00A878]'}`}>
                          {isAttackInjected ? '#1 (Overfitted)' : '#18 (Normalized)'}
                        </span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#D5991C] block text-[9px]">SPARSE BM25 RANK (r₃):</span>
                        <span className="font-bold text-[#FAF2E1]">#82 (Organic)</span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#D5991C] block text-[9px]">NCARD DIVERGENCE (Δr):</span>
                        <span className={`font-bold ${isAttackInjected ? 'text-[#E63946]' : 'text-[#00A878]'}`}>
                          {isAttackInjected ? `+${Math.round(64 * (attackIntensity / 100))} (ANOMALY)` : '+3.1 (CONSENSUS)'}
                        </span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#D5991C] block text-[9px]">LATENCY OVERHEAD:</span>
                        <span className="font-bold text-[#00A878]">4.2 ms (Parallel)</span>
                      </div>
                    </>
                  )}

                  {webglMode === 2 && (
                    <>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#D5991C] block text-[9px]">ATTENTION ENTROPY H:</span>
                        <span className={`font-bold ${isAttackInjected ? 'text-[#E63946]' : 'text-[#00A878]'}`}>
                          {isAttackInjected ? '1.42 nats (Collapsing)' : '4.88 nats (Healthy)'}
                        </span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#D5991C] block text-[9px]">MÖBIUS KL SYNERGY:</span>
                        <span className={`font-bold ${isAttackInjected ? 'text-[#E63946]' : 'text-[#00A878]'}`}>
                          {isAttackInjected ? `+${(0.78 * (attackIntensity / 100)).toFixed(2)} (ENTHYMEME)` : '0.04 (Independent)'}
                        </span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#D5991C] block text-[9px]">STEALTH ZERO-FONT:</span>
                        <span className={`font-bold ${isAttackInjected ? 'text-[#E63946]' : 'text-[#00A878]'}`}>
                          {isAttackInjected ? 'HIJACK ACTIVE' : 'SEVERED [-1e9]'}
                        </span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#D5991C] block text-[9px]">FORWARD PASS TIME:</span>
                        <span className="font-bold text-[#00A878]">5.1 ms</span>
                      </div>
                    </>
                  )}

                  {webglMode === 3 && (
                    <>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#D5991C] block text-[9px]">OBAR SPOOF DEPTH:</span>
                        <span className={`font-bold ${isAttackInjected ? 'text-[#E63946]' : 'text-[#00A878]'}`}>
                          {isAttackInjected ? `$${Math.round(45 * (attackIntensity / 100))}M Ask Wall` : '$0.8M (Balanced)'}
                        </span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#D5991C] block text-[9px]">VPIN TOXICITY:</span>
                        <span className={`font-bold ${isAttackInjected ? 'text-[#E63946]' : 'text-[#00A878]'}`}>
                          {isAttackInjected ? (0.35 + 0.58 * (attackIntensity / 100)).toFixed(3) : '0.142 (Benign)'}
                        </span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#D5991C] block text-[9px]">SEC 15c3-8 CIRCUIT BREAKER:</span>
                        <span className={`font-bold ${isAttackInjected ? 'text-[#E63946]' : 'text-[#00A878]'}`}>
                          {isAttackInjected ? 'HALT TRIGGERED' : 'ARMED (14.2 ms)'}
                        </span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#D5991C] block text-[9px]">PRICE IMPACT SAVED:</span>
                        <span className="font-bold text-[#00A878]">96.4% Protection</span>
                      </div>
                    </>
                  )}

                  {webglMode === 4 && (
                    <>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#D5991C] block text-[9px]">BN254 PROOF SIZE:</span>
                        <span className="font-bold text-[#00A878]">288 Bytes (Fixed)</span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#D5991C] block text-[9px]">VERIFICATION TIME:</span>
                        <span className="font-bold text-[#00A878]">1.4 ms (On-Chip)</span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#D5991C] block text-[9px]">SYBIL NODES REJECTED:</span>
                        <span className={`font-bold ${isAttackInjected ? 'text-[#E63946]' : 'text-[#00A878]'}`}>
                          {isAttackInjected ? '4 INTRUSIONS DEFLECTED' : '0 PENDING (PURE SWARM)'}
                        </span>
                      </div>
                      <div className="bg-[#262626] p-1.5 border border-[#F2D69D]/20">
                        <span className="text-[#D5991C] block text-[9px]">PROPRIETARY ALPHA LEAK:</span>
                        <span className="font-bold text-[#00A878]">0 Tokens (Zero-Knowledge)</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>

            {/* ========================================================
                USER-FRIENDLY PLAIN-ENGLISH EDUCATIONAL GUIDE
                Comprehensive Explanations in Basic Terms
               ======================================================== */}
            <div className="bg-[#FFFDF8] border-2 border-[#410217] p-6 sm:p-8 shadow-md space-y-6">
              
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#F2D69D] pb-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 bg-[#410217] text-[#FBF3E2] font-mono text-[11px] font-bold uppercase tracking-wider">
                      PLAIN-ENGLISH GUIDE
                    </span>
                    <span className="font-mono text-xs text-[#00A878] font-bold uppercase">
                      {['Layer 1 · Vector Manifold Geometry', 'Layer 2 · Multi-Engine Consensus', 'Layer 4A · Neural Attention Security', 'Layer 4B · Financial Market Physics', 'Sovereign Governance · Cryptographic zk-SNARKs'][webglMode]}
                    </span>
                  </div>
                  <h4 className="font-serif text-2xl font-bold text-[#410217]">
                    {webglMode === 0 && 'What You Are Seeing: The AI Search "Gravity Well" (Vector Sinkholes)'}
                    {webglMode === 1 && 'What You Are Seeing: The Multi-Engine Consensus Check (NCARD)'}
                    {webglMode === 2 && 'What You Are Seeing: Invisible Ink & Split-Paragraph Hijacking (CEH-ASID)'}
                    {webglMode === 3 && 'What You Are Seeing: The Wall Street AI News Flash-Crash (TMMEG)'}
                    {webglMode === 4 && 'What You Are Seeing: The Zero-Knowledge Cryptographic Shield'}
                  </h4>
                </div>

                <div className="flex items-center space-x-1.5 font-mono text-xs">
                  {[0, 1, 2, 3, 4].map((idx) => (
                    <button
                      key={idx}
                      onClick={() => setWebglMode(idx)}
                      className={`px-2.5 py-1 font-bold border transition-all ${
                        webglMode === idx ? 'bg-[#D5991C] text-[#130108] border-[#D5991C]' : 'bg-[#FAF2E1] text-[#410217] border-[#F2D69D]'
                      }`}
                    >
                      Mode {idx}
                    </button>
                  ))}
                </div>
              </div>

              {/* 4 User-Friendly Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm font-sans">
                
                {/* CARD 1: What You're Looking At (Analogy) */}
                <div className="bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-2.5">
                  <div className="flex items-center space-x-2 text-[#410217] font-bold font-serif text-base">
                    <Eye className="w-4 h-4 text-[#00A878]" />
                    <span>1. What You're Looking At (Everyday Analogy)</span>
                  </div>
                  <p className="text-[#410217]/85 leading-relaxed">
                    {webglMode === 0 && (
                      <>
                        <strong>Think of space and gravity.</strong> Imagine the search universe as a flat rubber sheet. In normal search, questions float naturally across different topics. But an attacker creates a heavy bowling ball—a <em>mathematical gravity well</em>. Notice how the grid warps downward and search questions (the white particle dots) get pulled into the spinning red sinkhole instead of spreading out evenly.
                      </>
                    )}
                    {webglMode === 1 && (
                      <>
                        <strong>Think of getting three independent doctor opinions.</strong> Instead of trusting just one AI model that can easily be tricked, we test the document across three separate search engines at once: modern AI dense neural search (top cyan deck), token-interaction search (middle gold deck), and classic exact-keyword search (bottom crimson deck).
                      </>
                    )}
                    {webglMode === 2 && (
                      <>
                        <strong>Think of a person reading a document with invisible ink between the lines.</strong> The central gold shape is the AI’s "brain" (its Transformer attention core). The outer white blocks are the paragraphs of text it is reading. The connecting lines are the AI’s "gaze" or attention beams, deciding what ideas connect to each other.
                      </>
                    )}
                    {webglMode === 3 && (
                      <>
                        <strong>Think of an auction pit where someone blocks the door.</strong> The gold bars on the left are people trying to buy (Bids). The oxblood bars on the right are people trying to sell (Asks). The green line in the center canyon is the fair market price. Normally, buying and selling balance out smoothly.
                      </>
                    )}
                    {webglMode === 4 && (
                      <>
                        <strong>Think of an exclusive club requiring a tamper-proof digital badge.</strong> The outer green and gold gyroscopic rings represent a cryptographic security gate. The floating nodes are autonomous AI agents and servers. They can only join and share data if they have a valid mathematical proof.
                      </>
                    )}
                  </p>
                </div>

                {/* CARD 2: The Attack / The Threat */}
                <div className="bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-2.5">
                  <div className="flex items-center space-x-2 text-[#410217] font-bold font-serif text-base">
                    <AlertTriangle className="w-4 h-4 text-[#8B1E1E]" />
                    <span>2. The Attack: What Bad Actors Are Doing</span>
                  </div>
                  <p className="text-[#410217]/85 leading-relaxed">
                    {webglMode === 0 && (
                      <>
                        Attackers engineer a single webpage using gradient optimization so that its mathematical coordinates match thousands of completely unrelated user queries. When anyone asks about health, finance, or news, the AI search engine is tricked into citing the attacker’s page in over <strong>84% of all answers</strong>.
                      </>
                    )}
                    {webglMode === 1 && (
                      <>
                        Attackers optimize their content to "overfit" one specific neural embedding model (like OpenAI or NV-Embed). The dense model ranks their page #1, but if you look at the other search engines, the page is complete gibberish (ranking #80+). This creates a massive <strong>rank divergence gap</strong> (the red tension line).
                      </>
                    )}
                    {webglMode === 2 && (
                      <>
                        Attackers hide invisible white-on-white text ("Zero-Font") or split a malicious claim across three innocent-looking paragraphs. When the AI reads them together, its internal attention beams snap onto the hidden instructions (the red ghost node), completely hijacking the AI's answer without human readers noticing.
                      </>
                    )}
                    {webglMode === 3 && (
                      <>
                        Predatory high-frequency trading firms release fake AI-written press releases while secretly placing a massive $45M fake sell order (the giant red "spoof wall"). AI trading bots panic-sell their shares into the canyon, allowing the predator to steal millions before humans can react.
                      </>
                    )}
                    {webglMode === 4 && (
                      <>
                        Hostile nation-states and botnets deploy thousands of cheap automated accounts (the red probing nodes) that quote and cite each other in circles. This manufactures fake "consensus," tricking AI search engines into thinking a piece of propaganda is widely verified.
                      </>
                    )}
                  </p>
                </div>

                {/* CARD 3: What Last Crusade Defense Is Doing Right Now */}
                <div className="bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-2.5">
                  <div className="flex items-center space-x-2 text-[#410217] font-bold font-serif text-base">
                    <Shield className="w-4 h-4 text-[#00A878]" />
                    <span>3. What Last Crusade Defense Is Doing Right Now</span>
                  </div>
                  <p className="text-[#410217]/85 leading-relaxed">
                    {webglMode === 0 && (
                      <>
                        Last Crusade’s <strong>AM-CIDP</strong> engine constantly measures the geometric smoothness and intrinsic dimensions of the search space. When it spots a sinkhole forming (dimension dropping from 24.6 to 7.8), it instantly snaps an <strong>emerald quarantine cage</strong> around the malicious hub, protecting normal queries and preserving retrieval neutrality.
                      </>
                    )}
                    {webglMode === 1 && (
                      <>
                        Last Crusade’s <strong>NCARD</strong> engine compares where a webpage ranks across all three scanning decks. If it sees a huge gap between the neural deck and the keyword decks (Δr &gt; 60), it pulls the rogue node back into strict consensus alignment, neutralizing the exploit in just 4.2 milliseconds.
                      </>
                    )}
                    {webglMode === 2 && (
                      <>
                        Last Crusade’s <strong>CEH-ASID</strong> engine inspects the AI's internal attention beams in real time. When it detects an unnatural concentration of attention focused on stealth text, it deploys an <strong>emerald entropy shield</strong> that severs the malicious attention links before the AI writes a single word.
                      </>
                    )}
                    {webglMode === 3 && (
                      <>
                        Last Crusade’s <strong>TMMEG</strong> financial shield binds AI news sentiment to real market physics. When it sees an AI news alert accompanied by suspicious spoofed orders, it activates an <strong>emerald Epistemic Circuit Breaker</strong> in under 14.2 milliseconds, rolling back fake orders and halting trading until facts are confirmed.
                      </>
                    )}
                    {webglMode === 4 && (
                      <>
                        Last Crusade requires all published claims and citations to present a tiny <strong>288-byte zero-knowledge mathematical proof (zk-SNARK)</strong> tied to hardware cryptographic roots. Unverified bot accounts cannot produce these proofs and are repelled from the consensus ring by emerald defensive shockwaves.
                      </>
                    )}
                  </p>
                </div>

                {/* CARD 4: Key Research Finding from Volume 1 */}
                <div className="bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-2.5">
                  <div className="flex items-center space-x-2 text-[#410217] font-bold font-serif text-base">
                    <BarChart3 className="w-4 h-4 text-[#D5991C]" />
                    <span>4. Key Real-World Discovery from Whitepaper Volume 1</span>
                  </div>
                  <p className="text-[#410217]/85 leading-relaxed">
                    {webglMode === 0 && (
                      <>
                        Conventional spam filters that only check words miss <strong>94.2% of neural vector sinkholes</strong>. By analyzing high-dimensional geometry directly, Last Crusade stops universal vector hubs in under <strong>1.8 ms</strong> without slowing down search engine response times.
                      </>
                    )}
                    {webglMode === 1 && (
                      <>
                        Single-vector search engines suffer an <strong>84% compromise rate</strong> against gradient-crafted text. NCARD's multi-engine consensus cuts adversarial top-1 survival down to under <strong>4.1%</strong> across 250,000 real-world benchmark documents.
                      </>
                    )}
                    {webglMode === 2 && (
                      <>
                        Split-paragraph and stealth prompt attacks succeed <strong>78% of the time</strong> against standard prompt firewalls. CEH-ASID evaluates multi-document combinatorial synergy, crushing attack success to <strong>under 3%</strong> in a single forward pass.
                      </>
                    )}
                    {webglMode === 3 && (
                      <>
                        Autonomous trading bots without thermodynamic grounding lose up to <strong>14.8% of portfolio capital</strong> during synthetic news attacks. TMMEG reduces market impact from fake AI news by <strong>96.4%</strong>.
                      </>
                    )}
                    {webglMode === 4 && (
                      <>
                        Using BN254 elliptic curve cryptography, institutions can prove their compliance with SEC Counter-GEO rules in <strong>1.4 milliseconds</strong> with <strong>zero leakage</strong> of confidential prompts or proprietary trading algorithms.
                      </>
                    )}
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
