import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Briefcase,
  CheckCircle2,
  Compass,
  ShieldAlert,
  Sliders,
  Sparkles,
  Terminal,
  Volume2,
  VolumeX
} from 'lucide-react';
import { NavigationPage } from '../types';
import {
  CAPABILITIES_MATRIX,
  CASE_STUDIES,
  ENGINE_STATUSES,
  INITIAL_THREAT_ALERTS,
  PROCESS_STEPS,
  SERVICES
} from '../data/geoData';

gsap.registerPlugin(ScrollTrigger);

export interface HomeRedesignProps {
  onOpenAudit?: () => void;
  onOpenIncident?: () => void;
  onNavigate?: (page: NavigationPage, subPage?: 'paper' | 'lab') => void;
}

/* ==========================================================================
   MOTION & PERFORMANCE CONSTANTS
   ========================================================================== */
const MAX_DPR = 2;
const EASE_OUT_EXPO = 'expo.out';
const EASE_IN_OUT_EXPO = 'expo.inOut';
const MOTION_QUERY = '(prefers-reduced-motion: no-preference)';

/* ==========================================================================
   EXTENDED 4-VOLUME TETRALOGY CATALOG (UPGRADED FROM LEGACY 3-VOL TRILOGY)
   ========================================================================== */
interface TetralogyVolume {
  id: string;
  volumeNumber: string;
  roman: string;
  code: string;
  date: string;
  title: string;
  subtitle: string;
  summary: string;
  equation: string;
  equationLabel: string;
  keyMetric: string;
  targetPage: NavigationPage;
  badgeBg: string;
}

const TETRALOGY_VOLUMES: TetralogyVolume[] = [
  {
    id: 'ADV-2026-004',
    volumeNumber: 'VOLUME I',
    roman: 'I',
    code: 'LCD-VOL-01 // LAYERS 0–4',
    date: 'October 2026',
    title: 'Sovereign Architecture for Epistemic & Financial Cybersecurity',
    subtitle: 'Vector De-Biasing, Intrinsic Dimension & 6-Layer RAG Defense',
    summary:
      'Establishes the mathematical foundation of Counter-AEO: moving-target Householder isometric rotations, Levina-Bickel Local Intrinsic Dimension (LID_k) sinkhole detection, and multi-topology reciprocal rank divergence.',
    equation: 'Q_t = I - 2u_t u_t^⊤ ∈ O(d),   LID_k(x) = - (1/k ∑ ln(r_i / r_k))⁻¹',
    equationLabel: 'Householder Isometric Rotation & Levina-Bickel Estimator',
    keyMetric: '99.4% Sinkhole Quarantine',
    targetPage: 'counter-geo',
    badgeBg: 'bg-[#410217] text-[#FBF3E2] border-[#D5991C]'
  },
  {
    id: 'ADV-2026-003',
    volumeNumber: 'VOLUME II',
    roman: 'II',
    code: 'LCD-VOL-02 // LAYERS 5–8',
    date: 'October 2026',
    title: 'Stateful Memory Immunity, Byzantine Swarms & Zero-Knowledge Compliance',
    subtitle: 'Doob-Meyer Epistemic Martingales, VLM Saliency & 288-Byte zk-SNARKs',
    summary:
      'Extends sovereign defense to persistent autonomous agent memory, autophagous AI-citing-AI echo chambers, multimodal PDF steganography, and cryptographic SEC Rule 15c3-8 compliance proofs.',
    equation: 'M_t = E[Θ | F_t],   W_2(μ_t, μ_{t-1}) ≤ τ_merkle,   π_{ZK} ∈ {0,1}^{288B}',
    equationLabel: 'Doob-Meyer Martingale Memory Guard & R1CS Proof Bound',
    keyMetric: '1.4 ms zk-SNARK Verify',
    targetPage: 'counter-geo-vol2',
    badgeBg: 'bg-[#004566] text-[#FBF3E2] border-[#25B888]'
  },
  {
    id: 'ADV-2026-002',
    volumeNumber: 'VOLUME III',
    roman: 'III',
    code: 'LCD-VOL-03 // BENCHMARK SUITE',
    date: 'October 2026',
    title: 'The CounterAEO-Bench Simulation Suite, Flash-Crash Stress Testing & ROC/AUC',
    subtitle: '250,000-Vector Empirical Validation & Order-Book Contagion Trials',
    summary:
      'Empirical evaluation across N = 250,000 adversarial RAG payloads and synthetic limit-order-book flash crashes, proving sub-millisecond suppression without degrading benign retrieval recall.',
    equation: 'AUC_{ROC} = 0.994 ± 0.002,   VPIN_t · Kyle_λ < Θ_{circuit}',
    equationLabel: 'CounterAEO-Bench Empirical ROC & Order-Book Toxicity Gate',
    keyMetric: 'N = 250,000 Trial Corpus',
    targetPage: 'counter-geo-vol3',
    badgeBg: 'bg-[#2B0110] text-[#FBF3E2] border-[#D5991C]'
  },
  {
    id: 'ADV-2026-001',
    volumeNumber: 'VOLUME IV',
    roman: 'IV',
    code: 'LCD-VOL-04 // SILICON & ENCLAVE',
    date: 'October 2026',
    title: 'Wire-Speed 142ns FPGA SmartNIC Interdiction & Sovereign Enclave Architecture',
    subtitle: 'Xilinx UltraScale+ 45-Clock Q8.24 Pipeline & Actuarial VaR Guard',
    summary:
      'Hardware-accelerated wire-speed defense executing thermodynamic KL-surprise vs. Order-Book Energy on 312.5 MHz FPGA silicon in 142.0 nanoseconds, paired with an air-gapped Sovereign Enclave.',
    equation: 'T_{pipe} = 45 × 3.2ns = 142.0ns,   ΔE_{LOB}(Q8.24) ⊥ D_{KL}(P_t ∥ P_0)',
    equationLabel: '45-Clock Division-Free Q8.24 SmartNIC Pipeline Law',
    keyMetric: '142.0 ns Wire-Speed Gate',
    targetPage: 'counter-geo-vol4',
    badgeBg: 'bg-[#130108] text-[#D5991C] border-[#D5991C]'
  }
];

/* ==========================================================================
   10-LAYER SOVEREIGN DEFENSE STACK SPECIFICATIONS
   ========================================================================== */
interface DefenseLayerSpec {
  id: string;
  layer: string;
  code: string;
  act: 0 | 1 | 2;
  volPage: NavigationPage;
  volLabel: string;
  threatVector: string;
  mathematicalCore: string;
  latency: string;
}

const TEN_LAYER_STACK: DefenseLayerSpec[] = [
  {
    id: 'L0',
    layer: 'Layer 0',
    code: 'MTVD-CANARY',
    act: 0,
    volPage: 'counter-geo',
    volLabel: 'Vol. I',
    threatVector: 'Black-box query probing & surrogate embedding model extraction',
    mathematicalCore: 'Householder Isometric Rotations Q_t ∈ O(d) + Orthogonal Canary Subspaces',
    latency: '0.38 ms'
  },
  {
    id: 'L1',
    layer: 'Layer 1',
    code: 'AM-CIDP',
    act: 0,
    volPage: 'counter-geo',
    volLabel: 'Vol. I',
    threatVector: 'Universal & regional adversarial vector hubs (topological sinkholes)',
    mathematicalCore: 'Levina-Bickel Intrinsic Dimension (LID_k) + Gram Matrix Spectral Entropy',
    latency: '1.80 ms'
  },
  {
    id: 'L2',
    layer: 'Layer 2',
    code: 'NCARD',
    act: 0,
    volPage: 'counter-geo',
    volLabel: 'Vol. I',
    threatVector: 'Single-embedder gradient overfitting across dense retrieval indexes',
    mathematicalCore: 'Depth-Weighted Reciprocal Rank Divergence (Dense ⊕ ColBERT ⊕ SPLADE)',
    latency: '4.20 ms'
  },
  {
    id: 'L3',
    layer: 'Layer 3',
    code: 'TCG-CL v2.0',
    act: 1,
    volPage: 'counter-geo',
    volLabel: 'Vol. I',
    threatVector: 'Sybil citation botnets & circular synthetic authority laundering',
    mathematicalCore: 'X.509 C2PA Hardware Roots + NLI Entailment Max-Flow + Hawkes CV² Filter',
    latency: '6.50 ms'
  },
  {
    id: 'L4A',
    layer: 'Layer 4A',
    code: 'CEH-ASID',
    act: 1,
    volPage: 'counter-geo',
    volLabel: 'Vol. I',
    threatVector: 'Split-payload enthymematic AEO & indirect prompt injection',
    mathematicalCore: 'Möbius KL Synergy (I_ij) + Transformer Attention-Sink Tomography',
    latency: '5.10 ms'
  },
  {
    id: 'L5',
    layer: 'Layer 5',
    code: 'DMEM-WMQ',
    act: 1,
    volPage: 'counter-geo-vol2',
    volLabel: 'Vol. II',
    threatVector: 'Slow-boil chronic episodic memory drift in long-horizon AI agents',
    mathematicalCore: 'Doob-Meyer Epistemic Martingale Decomposition + W₂ Merkle Rollback',
    latency: '0.90 ms'
  },
  {
    id: 'L6',
    layer: 'Layer 6',
    code: 'SGL-CMI',
    act: 1,
    volPage: 'counter-geo-vol2',
    volLabel: 'Vol. II',
    threatVector: 'Autophagous AI-citing-AI swarm echo chambers & consensus hijacking',
    mathematicalCore: 'Spectral Graph Laplacian Fiedler Eigenvalue + Conditional Mutual Info I(Z_i;Z_j|R)',
    latency: '1.10 ms'
  },
  {
    id: 'L7',
    layer: 'Layer 7',
    code: 'CM-JSAS',
    act: 2,
    volPage: 'counter-geo-vol2',
    volLabel: 'Vol. II',
    threatVector: 'Multimodal steganographic AEO payloads in PDF earnings slides & charts',
    mathematicalCore: 'VLM Jacobian Saliency vs. Sobel Contour Mask (L_leak) + Spectral DCT Scrub',
    latency: '8.40 ms'
  },
  {
    id: 'L8',
    layer: 'Layer 8',
    code: 'ZK-CAEO',
    act: 2,
    volPage: 'counter-geo-vol2',
    volLabel: 'Vol. II',
    threatVector: 'Institutional alpha leakage during SEC Rule 15c3-8 audit verification',
    mathematicalCore: '288-Byte Groth16/Plonky2 Fixed-Point R1CS Arithmetic Compliance Proof',
    latency: '1.40 ms'
  },
  {
    id: 'L4B-HW',
    layer: 'Layer 4B-HW',
    code: 'TMMEG-142NS',
    act: 2,
    volPage: 'counter-geo-vol4',
    volLabel: 'Vol. IV',
    threatVector: 'Wire-speed predatory limit-order-book sweeps & synthetic flash crashes',
    mathematicalCore: '312.5 MHz Xilinx UltraScale+ FPGA (45 Clocks, Division-Free Q8.24 VPIN/KL Gate)',
    latency: '142.0 ns'
  }
];

/* ==========================================================================
   RAW GLSL SHADERS + OGL-STYLE ATTRIBUTE PIPELINE FOR UNIFIED WEBGL SCENE
   ========================================================================== */
const MANIFOLD_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uStage;
  uniform float uPerturbation;
  uniform float uShieldActive;
  uniform float uActProgress;
  uniform vec3 uPointerWorld;
  uniform float uPointerActive;
  uniform float uDpr;
  uniform float uHighlightedCluster;

  attribute vec3 aSpherePos;
  attribute vec3 aSinkholePos;
  attribute vec3 aHouseholderPos;
  attribute vec3 aOrderBookPos;
  attribute vec3 aMerklePos;
  attribute vec3 aMetrics; // x: clusterId (0..5), y: intrinsicDim (0..1), z: pointScale

  varying float vCluster;
  varying float vIntrinsicDim;
  varying float vAnomaly;
  varying float vShieldFactor;
  varying float vDepth;
  varying float vHighlight;

  vec3 rotateAxis(vec3 p, vec3 axis, float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return p * c + cross(axis, p) * s + axis * dot(axis, p) * (1.0 - c);
  }

  void main() {
    vCluster = aMetrics.x;
    vIntrinsicDim = aMetrics.y;
    float baseScale = aMetrics.z;

    float w0 = clamp(1.0 - abs(uStage - 0.0), 0.0, 1.0);
    float w1 = clamp(1.0 - abs(uStage - 1.0), 0.0, 1.0);
    float w2 = clamp(1.0 - abs(uStage - 2.0), 0.0, 1.0);
    float w3 = clamp(1.0 - abs(uStage - 3.0), 0.0, 1.0);
    float w4 = clamp(1.0 - abs(uStage - 4.0), 0.0, 1.0);
    float wSum = max(w0 + w1 + w2 + w3 + w4, 0.0001);
    w0 /= wSum; w1 /= wSum; w2 /= wSum; w3 /= wSum; w4 /= wSum;

    // Stage 0: Geodesic Sovereign Sphere + Orbital Embedding Shell
    vec3 p0 = rotateAxis(aSpherePos, normalize(vec3(0.18, 1.0, 0.08)), uTime * 0.16);

    // Stage 1: Topological Sinkhole (AM-CIDP Gravity Funnel)
    vec3 p1 = aSinkholePos;
    float radialDist = length(p1.xz);
    float funnelPull = exp(-radialDist * 1.35) * (0.45 + 0.85 * uPerturbation * (1.0 - 0.72 * uShieldActive));
    p1.y -= funnelPull * 1.45;
    p1.xz *= (1.0 - funnelPull * 0.28);
    p1 = rotateAxis(p1, vec3(0.0, 1.0, 0.0), uTime * 0.12 + funnelPull * 1.2);

    // Stage 2: Householder Isometric Rotation Q_t = I - 2 u u^T & Quarantine Dome
    vec3 uVec = normalize(vec3(sin(uTime * 0.35), cos(uTime * 0.25), 0.5));
    vec3 reflected = aHouseholderPos - 2.0 * dot(aHouseholderPos, uVec) * uVec;
    vec3 p2 = mix(aSinkholePos, reflected, clamp(uShieldActive * 0.7 + uActProgress * 0.3, 0.0, 1.0));
    p2 = rotateAxis(p2, normalize(vec3(0.0, 1.0, 0.2)), uTime * 0.2 + uActProgress * 1.57);

    // Stage 3: 142ns Limit Order Book Depth Canyon (TMMEG Layer 4B-HW)
    vec3 p3 = aOrderBookPos;
    float wave = sin(p3.x * 3.2 + uTime * 1.8) * cos(p3.z * 2.4 - uTime * 1.1) * 0.14;
    p3.y += wave * (1.0 + uPerturbation * 0.8 * (1.0 - uShieldActive));

    // Stage 4: Zero-Knowledge R1CS Merkle Proof Lattice (ZK-CAEO)
    vec3 p4 = rotateAxis(aMerklePos, normalize(vec3(0.1, 1.0, 0.1)), uTime * 0.14);

    vec3 pos = p0 * w0 + p1 * w1 + p2 * w2 + p3 * w3 + p4 * w4;

    float isPoisonedCluster = step(0.68, 1.0 - vIntrinsicDim);
    float activeThreat = isPoisonedCluster * uPerturbation * (1.0 - 0.82 * uShieldActive);
    pos += normalize(pos + vec3(0.001)) * sin(uTime * 3.4 + vCluster * 6.28) * 0.08 * activeThreat;

    if (uPointerActive > 0.01) {
      vec3 toPtr = pos - uPointerWorld;
      float dPtr = length(toPtr);
      if (dPtr < 1.35) {
        float push = (1.0 - dPtr / 1.35) * 0.26 * uPointerActive;
        pos += normalize(toPtr + vec3(0.0001)) * push;
      }
    }

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;

    float distAtten = clamp(4.2 / max(-mvPosition.z, 1.2), 0.45, 2.2);
    float clusterBoost = (uHighlightedCluster >= 0.0 && abs(vCluster - uHighlightedCluster) < 0.4) ? 1.55 : 1.0;

    gl_PointSize = max(2.0, baseScale * uDpr * distAtten * clusterBoost * (1.0 + 0.35 * activeThreat));

    vAnomaly = clamp(activeThreat + w1 * isPoisonedCluster * 0.65, 0.0, 1.0);
    vShieldFactor = clamp(uShieldActive * (0.4 + 0.6 * w2 + 0.5 * w4), 0.0, 1.0);
    vDepth = clamp((-mvPosition.z - 2.0) / 6.0, 0.0, 1.0);
    vHighlight = (uHighlightedCluster >= 0.0 && abs(vCluster - uHighlightedCluster) < 0.4) ? 1.0 : 0.0;
  }
`;

const MANIFOLD_FRAGMENT_SHADER = `
  precision highp float;

  uniform float uDarkTheme;

  varying float vCluster;
  varying float vIntrinsicDim;
  varying float vAnomaly;
  varying float vShieldFactor;
  varying float vDepth;
  varying float vHighlight;

  void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv) * 2.0;
    if (r > 1.0) discard;

    float core = 1.0 - smoothstep(0.45, 0.98, r);
    float ring = smoothstep(0.62, 0.78, r) * (1.0 - smoothstep(0.78, 1.0, r));

    vec3 oxblood = vec3(0.255, 0.008, 0.090);
    vec3 brass   = vec3(0.835, 0.600, 0.110);
    vec3 sand    = vec3(0.949, 0.839, 0.616);
    vec3 crimson = vec3(0.680, 0.120, 0.140);
    vec3 emerald = vec3(0.110, 0.680, 0.510);

    vec3 baseCol = mix(
      mix(oxblood, brass, step(0.5, fract(vCluster * 0.37))),
      mix(sand, brass, step(0.45, fract(vCluster * 0.37))),
      uDarkTheme
    );

    vec3 col = mix(baseCol, crimson, vAnomaly);
    col = mix(col, emerald, vShieldFactor * (1.0 - vAnomaly * 0.4));
    if (vHighlight > 0.5) {
      col = mix(col, brass, 0.75);
    }

    float alpha = (core * 0.88 + ring * 0.5) * mix(0.95, 0.42, vDepth);
    if (vHighlight > 0.5) alpha = min(1.0, alpha * 1.35);

    gl_FragColor = vec4(col, alpha);
  }
`;

const CORE_HARMONIC_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uStage;
  uniform float uPerturbation;
  uniform float uShieldActive;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vDisplacement;

  void main() {
    vec3 n = normalize(normal);
    // Spherical harmonics-inspired displacement modulated by stage & perturbation
    float h0 = sin(n.x * 5.0 + uTime * 1.4) * cos(n.y * 5.0 - uTime * 1.1) * sin(n.z * 5.0 + uTime * 0.9);
    float pinch = (uStage > 0.5 && uStage < 1.5) ? -0.22 * exp(-length(n.xz) * 2.5) : 0.0;
    float disp = h0 * (0.04 + 0.12 * uPerturbation * (1.0 - 0.7 * uShieldActive)) + pinch;
    vec3 newPos = position + n * disp;
    vDisplacement = disp;
    vNormal = normalize(normalMatrix * n);
    vWorldPos = newPos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

const CORE_HARMONIC_FRAGMENT_SHADER = `
  precision highp float;
  uniform float uShieldActive;
  uniform float uPerturbation;
  uniform float uDarkTheme;
  varying vec3 vNormal;
  varying vec3 vWorldPos;
  varying float vDisplacement;

  void main() {
    vec3 viewDir = vec3(0.0, 0.0, 1.0);
    float fresnel = pow(1.0 - abs(dot(vNormal, viewDir)), 2.4);
    float contour = smoothstep(0.88, 0.98, abs(sin((vWorldPos.y + vDisplacement * 3.0) * 22.0)));

    vec3 oxblood = vec3(0.20, 0.01, 0.07);
    vec3 brass   = vec3(0.835, 0.600, 0.110);
    vec3 emerald = vec3(0.09, 0.62, 0.45);
    vec3 crimson = vec3(0.68, 0.12, 0.14);

    vec3 rimCol = mix(crimson, mix(brass, emerald, 0.45), uShieldActive);
    vec3 baseCol = mix(oxblood, vec3(0.12, 0.01, 0.04), uDarkTheme);
    vec3 col = mix(baseCol, rimCol, fresnel * 0.85 + contour * 0.45);

    float alpha = 0.24 + fresnel * 0.52 + contour * 0.18;
    gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.78));
  }
`;

const DOME_VERTEX_SHADER = `
  uniform float uTime;
  uniform float uPerturbation;
  uniform float uShieldActive;
  varying vec3 vNormal;
  varying vec3 vPos;

  void main() {
    vNormal = normalize(normalMatrix * normal);
    vec3 p = position;
    float ripple = sin(p.y * 6.0 + uTime * 2.0) * cos(p.x * 5.0 - uTime * 1.4) * 0.025;
    p += normal * ripple * (uPerturbation * (1.0 - 0.6 * uShieldActive));
    vPos = p;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const DOME_FRAGMENT_SHADER = `
  precision highp float;
  uniform float uShieldActive;
  uniform float uPerturbation;
  uniform float uDarkTheme;
  varying vec3 vNormal;
  varying vec3 vPos;

  void main() {
    float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.2);
    float latLine = smoothstep(0.94, 0.99, abs(sin(vPos.y * 14.0)));

    vec3 brass = vec3(0.835, 0.600, 0.110);
    vec3 emerald = vec3(0.110, 0.680, 0.510);
    vec3 crimson = vec3(0.680, 0.120, 0.140);
    vec3 oxblood = vec3(0.255, 0.008, 0.090);

    vec3 base = mix(oxblood, brass, uDarkTheme * 0.8 + 0.2);
    vec3 shieldCol = mix(crimson, emerald, uShieldActive);
    vec3 col = mix(base, shieldCol, 0.55);

    float alpha = (fresnel * 0.24 + latLine * 0.09) * (0.55 + 0.35 * uShieldActive + 0.2 * uPerturbation);
    gl_FragColor = vec4(col, clamp(alpha, 0.0, 0.42));
  }
`;

function createSeededRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function playTactilePulse(enabled: boolean, freq = 520, durationMs = 28) {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.018, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + durationMs / 1000);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + durationMs / 1000);
    setTimeout(() => {
      ctx.close().catch(() => {});
    }, durationMs + 40);
  } catch {
    // Ignore audio context restrictions
  }
}

/* ==========================================================================
   STAGE-SPECIFIC MATHEMATICAL SVG PLATES (INSTANT LCP & MULTI-SLOT SCHEMATICS)
   ========================================================================== */
const ArchivalGeodesicPoster: React.FC<{
  perturbation: number;
  shieldActive: boolean;
  stageLabel: string;
}> = ({ perturbation, shieldActive, stageLabel }) => {
  const sinkholeRadius = Math.round(28 + perturbation * 42 * (shieldActive ? 0.35 : 1));
  return (
    <div className="relative w-full h-full flex items-center justify-center p-6 select-none">
      <svg
        viewBox="0 0 480 480"
        className="w-full h-full max-w-[440px] max-h-[440px]"
        role="img"
        aria-label="Sovereign Epistemic Vector Manifold Cartographic Plate"
      >
        <defs>
          <radialGradient id="petra-manifold-core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={shieldActive ? '#15684E' : '#8B1E1E'} stopOpacity="0.22" />
            <stop offset="65%" stopColor="#410217" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#FAF5EB" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="240" cy="240" r="212" fill="url(#petra-manifold-core)" stroke="#410217" strokeOpacity="0.24" strokeWidth="1" />
        <circle cx="240" cy="240" r="176" fill="none" stroke="#410217" strokeOpacity="0.16" strokeWidth="1" strokeDasharray="3 5" />
        <circle cx="240" cy="240" r="132" fill="none" stroke="#D5991C" strokeOpacity="0.35" strokeWidth="1" />
        <circle
          cx="240"
          cy="240"
          r={sinkholeRadius}
          fill="none"
          stroke={shieldActive ? '#15684E' : '#8B1E1E'}
          strokeWidth="1.5"
          strokeDasharray={shieldActive ? 'none' : '6 4'}
        />

        <ellipse cx="240" cy="240" rx="176" ry="68" fill="none" stroke="#410217" strokeOpacity="0.18" strokeWidth="1" />
        <ellipse cx="240" cy="240" rx="68" ry="176" fill="none" stroke="#410217" strokeOpacity="0.18" strokeWidth="1" />
        <ellipse
          cx="240"
          cy="240"
          rx="168"
          ry="74"
          fill="none"
          stroke="#D5991C"
          strokeOpacity="0.28"
          strokeWidth="1"
          transform="rotate(34 240 240)"
        />
        <ellipse
          cx="240"
          cy="240"
          rx="168"
          ry="74"
          fill="none"
          stroke="#410217"
          strokeOpacity="0.18"
          strokeWidth="1"
          transform="rotate(-34 240 240)"
        />

        <line x1="20" y1="240" x2="460" y2="240" stroke="#410217" strokeOpacity="0.15" strokeWidth="1" />
        <line x1="240" y1="20" x2="240" y2="460" stroke="#410217" strokeOpacity="0.15" strokeWidth="1" />

        {[
          { x: 240, y: 64, label: 'OPENAI-GPT4O', col: '#410217' },
          { x: 392, y: 152, label: 'ANTH-CLAUDE', col: '#15684E' },
          { x: 388, y: 332, label: 'GOOG-AIO', col: '#D5991C' },
          { x: 240, y: 416, label: 'PPLX-RAG', col: '#8B1E1E' },
          { x: 90, y: 328, label: 'MSFT-COPILOT', col: '#004566' },
          { x: 92, y: 152, label: 'DEEPSEEK-R1', col: '#8B1E1E' }
        ].map((n, idx) => (
          <g key={idx}>
            <line x1="240" y1="240" x2={n.x} y2={n.y} stroke={n.col} strokeOpacity="0.25" strokeWidth="1" />
            <circle cx={n.x} cy={n.y} r="5" fill={n.col} />
            <circle cx={n.x} cy={n.y} r="10" fill="none" stroke={n.col} strokeOpacity="0.4" strokeWidth="1" />
            <text
              x={n.x + (n.x >= 240 ? 14 : -14)}
              y={n.y + 3}
              textAnchor={n.x >= 240 ? 'start' : 'end'}
              className="font-mono text-[9px] fill-[#410217] font-bold"
            >
              {n.label}
            </text>
          </g>
        ))}

        <rect x="233" y="233" width="14" height="14" fill="#410217" stroke="#D5991C" strokeWidth="1.5" transform="rotate(45 240 240)" />
        <text x="240" y="218" textAnchor="middle" className="font-mono text-[9px] fill-[#410217] font-bold tracking-widest">
          HSM GROUND TRUTH // Q_t ∈ O(d)
        </text>
        <text x="240" y="454" textAnchor="middle" className="font-mono text-[9px] fill-[#6E3340] tracking-widest uppercase">
          {stageLabel}
        </text>
      </svg>
    </div>
  );
};

const SinkholeSchematicPlate: React.FC<{ perturbation: number; shieldActive: boolean }> = ({
  perturbation,
  shieldActive
}) => {
  const wellDepth = Math.round(55 + perturbation * 65 * (shieldActive ? 0.35 : 1));
  return (
    <svg
      viewBox="0 0 420 220"
      className="w-full h-full"
      role="img"
      aria-label="Riemannian Vector Gravity Sinkhole Topology Diagram"
    >
      <ellipse cx="210" cy="54" rx="175" ry="32" fill="none" stroke="#410217" strokeOpacity="0.22" strokeWidth="1" />
      <ellipse cx="210" cy="68" rx="130" ry="24" fill="none" stroke="#410217" strokeOpacity="0.28" strokeWidth="1" strokeDasharray="4 4" />
      <ellipse cx="210" cy="92" rx="82" ry="16" fill="none" stroke="#8B5A0B" strokeOpacity="0.45" strokeWidth="1" />
      <ellipse
        cx="210"
        cy={75 + wellDepth}
        rx="28"
        ry="8"
        fill={shieldActive ? 'rgba(21,104,78,0.2)' : 'rgba(139,30,30,0.25)'}
        stroke={shieldActive ? '#15684E' : '#8B1E1E'}
        strokeWidth="1.5"
      />

      <path
        d={`M 35 54 Q 160 80 182 ${75 + wellDepth}`}
        fill="none"
        stroke={shieldActive ? '#15684E' : '#8B1E1E'}
        strokeWidth="1.5"
      />
      <path
        d={`M 385 54 Q 260 80 238 ${75 + wellDepth}`}
        fill="none"
        stroke={shieldActive ? '#15684E' : '#8B1E1E'}
        strokeWidth="1.5"
      />
      <path
        d={`M 80 68 Q 175 95 195 ${75 + wellDepth}`}
        fill="none"
        stroke="#410217"
        strokeOpacity="0.3"
        strokeWidth="1"
      />
      <path
        d={`M 340 68 Q 245 95 225 ${75 + wellDepth}`}
        fill="none"
        stroke="#410217"
        strokeOpacity="0.3"
        strokeWidth="1"
      />

      {shieldActive && (
        <path
          d="M 110 86 Q 210 12 310 86"
          fill="none"
          stroke="#15684E"
          strokeWidth="2"
          strokeDasharray="5 3"
        />
      )}

      <text x="210" y="24" textAnchor="middle" className="font-mono text-[9px] fill-[#410217] font-bold">
        {shieldActive
          ? 'AM-CIDP QUARANTINE DOME ENGAGED // LID_k STABILIZED'
          : 'UNPROTECTED AT-1 SINKHOLE // 21,400+ QUERIES CAPTURED'}
      </text>
      <text
        x="210"
        y={98 + wellDepth}
        textAnchor="middle"
        className="font-mono text-[9px] fill-[#8B1E1E] font-bold"
      >
        HUB SINGULARITY (LID_k = {shieldActive ? '17.3' : '2.1'})
      </text>
    </svg>
  );
};

/* ==========================================================================
   MAIN REDESIGNED HOME PAGE COMPONENT
   ========================================================================== */
export const HomeRedesign: React.FC<HomeRedesignProps> = ({
  onOpenAudit,
  onOpenIncident,
  onNavigate
}) => {
  // Interactive Epistemic Manifold Parameters
  const [perturbationEpsilon, setPerturbationEpsilon] = useState<number>(0.42);
  const [shieldEngaged, setShieldEngaged] = useState<boolean>(true);
  const [highlightedEngineIdx, setHighlightedEngineIdx] = useState<number>(-1);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [activeInterdictionAct, setActiveInterdictionAct] = useState<0 | 1 | 2>(0);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(SERVICES[0]?.id || 'defensive-cyber');
  const [selectedCapabilityCategory, setSelectedCapabilityCategory] = useState<string>('ALL');
  const [selectedCaseIndex, setSelectedCaseIndex] = useState<number>(0);
  const [audioPulseEnabled, setAudioPulseEnabled] = useState<boolean>(false);
  const [webglReady, setWebglReady] = useState<boolean>(false);
  const [webglSupported, setWebglSupported] = useState<boolean>(true);
  const [canvasDockedStage, setCanvasDockedStage] = useState<number>(0);

  // Actuarial Exposure Calculator State
  const [monthlyQueryVolume, setMonthlyQueryVolume] = useState<number>(450000);
  const [institutionalOrderBookM, setInstitutionalOrderBookM] = useState<number>(120);

  // Refs for DOM & Unified Single-Canvas WebGL Stage Docking
  const rootRef = useRef<HTMLDivElement>(null);
  const canvasHostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const slot0Ref = useRef<HTMLDivElement>(null);
  const slot1Ref = useRef<HTMLDivElement>(null);
  const slot2Ref = useRef<HTMLDivElement>(null);
  const slot3Ref = useRef<HTMLDivElement>(null);

  const uniformBridgeRef = useRef({
    stage: 0,
    targetStage: 0,
    actProgress: 0,
    perturbation: 0.42,
    shieldActive: 1.0,
    darkTheme: 0.0,
    highlightedCluster: -1.0,
    pointerX: 0,
    pointerY: 0,
    pointerActive: 0
  });

  useEffect(() => {
    uniformBridgeRef.current.perturbation = perturbationEpsilon;
  }, [perturbationEpsilon]);

  useEffect(() => {
    uniformBridgeRef.current.shieldActive = shieldEngaged ? 1.0 : 0.0;
  }, [shieldEngaged]);

  useEffect(() => {
    uniformBridgeRef.current.highlightedCluster = highlightedEngineIdx;
  }, [highlightedEngineIdx]);

  // Dock the single WebGL canvas host into whichever section's Observatory Slot is active
  useEffect(() => {
    const host = canvasHostRef.current;
    const slots = [slot0Ref.current, slot1Ref.current, slot2Ref.current, slot3Ref.current];
    const targetSlot = slots[canvasDockedStage] || slots[0];
    if (!host || !targetSlot) return;
    if (host.parentElement !== targetSlot) {
      targetSlot.appendChild(host);
      window.dispatchEvent(new Event('resize'));
    }
  }, [canvasDockedStage]);

  const triggerNavigate = (page: NavigationPage, subPage?: 'paper' | 'lab') => {
    playTactilePulse(audioPulseEnabled, 640, 24);
    if (onNavigate) {
      onNavigate(page, subPage);
      return;
    }
    const routeMap: Record<NavigationPage, string> = {
      overview: '#/',
      services: '#/services',
      rea: '#/rea',
      research: '#/research',
      'counter-geo': subPage ? `#/counter-geo/${subPage}` : '#/counter-geo',
      'counter-geo-vol2': subPage ? `#/counter-geo-vol2/${subPage}` : '#/counter-geo-vol2',
      'counter-geo-vol3': subPage ? `#/counter-geo-vol3/${subPage}` : '#/counter-geo-vol3',
      'counter-geo-vol4': subPage ? `#/counter-geo-vol4/${subPage}` : '#/counter-geo-vol4',
      'counter-geo-vol5': subPage ? `#/counter-geo-vol5/${subPage}` : '#/counter-geo-vol5',
      'counter-geo-ops': '#/attack-library',
      'pitch-deck': '#/pitch-deck'
    };
    window.location.hash = routeMap[page] || '#/';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const triggerAudit = () => {
    playTactilePulse(audioPulseEnabled, 720, 35);
    if (onOpenAudit) {
      onOpenAudit();
    }
  };

  const triggerIncident = () => {
    playTactilePulse(audioPulseEnabled, 440, 40);
    if (onOpenIncident) {
      onOpenIncident();
    } else if (onOpenAudit) {
      onOpenAudit();
    }
  };

  /* ==========================================================================
     UNIFIED SINGLE-CANVAS WEBGL ENGINE (THREE.JS + CUSTOM GLSL + OGL BUFFER MORPH)
     ========================================================================== */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let rafId = 0;
    let cleanupFn: (() => void) | null = null;

    const startWebGL = () => {
      let testGl: WebGLRenderingContext | null = null;
      try {
        testGl =
          (canvas.getContext('webgl2', { alpha: true, antialias: true, powerPreference: 'high-performance' }) as WebGLRenderingContext | null) ||
          (canvas.getContext('webgl', { alpha: true, antialias: true, powerPreference: 'high-performance' }) as WebGLRenderingContext | null);
      } catch {
        testGl = null;
      }

      if (!testGl) {
        setWebglSupported(false);
        return;
      }

      let renderer: THREE.WebGLRenderer;
      try {
        renderer = new THREE.WebGLRenderer({
          canvas,
          context: testGl,
          alpha: true,
          antialias: true,
          powerPreference: 'high-performance'
        });
      } catch {
        setWebglSupported(false);
        return;
      }

      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
      renderer.setPixelRatio(dpr);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 50);
      camera.position.set(0, 0.15, 4.8);

      const rootGroup = new THREE.Group();
      scene.add(rootGroup);

      const isCompact = window.innerWidth < 768;
      const nodeCount = isCompact ? 780 : 1850;
      const rng = createSeededRng(20261016);

      const aSpherePos = new Float32Array(nodeCount * 3);
      const aSinkholePos = new Float32Array(nodeCount * 3);
      const aHouseholderPos = new Float32Array(nodeCount * 3);
      const aOrderBookPos = new Float32Array(nodeCount * 3);
      const aMerklePos = new Float32Array(nodeCount * 3);
      const aMetrics = new Float32Array(nodeCount * 3);

      for (let i = 0; i < nodeCount; i++) {
        const i3 = i * 3;
        const clusterId = i % 6;
        const u = rng();
        const v = rng();

        // 1. Geodesic Sovereign Sphere + Outer Orbital Embedding Shell
        const theta = u * Math.PI * 2;
        const phi = Math.acos(2 * v - 1);
        const isOrbital = i % 4 === 0;
        const rSphere = isOrbital ? 1.52 + rng() * 0.28 : 1.18 + (rng() - 0.5) * 0.06;
        aSpherePos[i3] = rSphere * Math.sin(phi) * Math.cos(theta);
        aSpherePos[i3 + 1] = rSphere * Math.cos(phi);
        aSpherePos[i3 + 2] = rSphere * Math.sin(phi) * Math.sin(theta);

        // 2. Topological Sinkhole (AM-CIDP Riemannian Funnel)
        const radiusSink = 0.14 + Math.pow(rng(), 0.72) * 1.75;
        const angleSink = theta + radiusSink * 1.4;
        aSinkholePos[i3] = Math.cos(angleSink) * radiusSink;
        aSinkholePos[i3 + 1] = (rng() - 0.5) * 0.25 + 0.35;
        aSinkholePos[i3 + 2] = Math.sin(angleSink) * radiusSink;

        // 3. Householder Isometric Orthogonal Lattice (Q_t = I - 2 u u^T)
        const shellLayer = (i % 3) * 0.36 + 0.72;
        aHouseholderPos[i3] = shellLayer * Math.sin(phi) * Math.cos(theta);
        aHouseholderPos[i3 + 1] = shellLayer * Math.cos(phi);
        aHouseholderPos[i3 + 2] = shellLayer * Math.sin(phi) * Math.sin(theta);

        // 4. 142ns Limit Order Book Depth Canyon (Bid / Ask Walls)
        const side = i % 2 === 0 ? -1 : 1;
        const depthStep = Math.pow(rng(), 0.85) * 1.45 + 0.18;
        const spreadX = side * depthStep;
        const bookZ = (rng() - 0.5) * 2.4;
        const wallHeight = Math.min(1.15, Math.pow(depthStep, 1.25) * 0.75) - 0.45;
        aOrderBookPos[i3] = spreadX;
        aOrderBookPos[i3 + 1] = wallHeight;
        aOrderBookPos[i3 + 2] = bookZ;

        // 5. Zero-Knowledge R1CS Merkle Proof Crystal
        const tier = i % 4;
        const tierY = -0.85 + tier * 0.56;
        const tierSpan = 1.35 - tier * 0.24;
        const gridAngle = ((i >> 2) % 24) * ((Math.PI * 2) / 24);
        aMerklePos[i3] = Math.cos(gridAngle) * tierSpan * (0.45 + 0.55 * rng());
        aMerklePos[i3 + 1] = tierY + (rng() - 0.5) * 0.08;
        aMerklePos[i3 + 2] = Math.sin(gridAngle) * tierSpan * (0.45 + 0.55 * rng());

        const lidNormalized = i % 7 === 0 ? 0.14 + rng() * 0.15 : 0.55 + rng() * 0.45;
        const pointScale = i % 11 === 0 ? 6.8 : 3.4 + rng() * 2.3;
        aMetrics[i3] = clusterId;
        aMetrics[i3 + 1] = lidNormalized;
        aMetrics[i3 + 2] = pointScale;
      }

      const manifoldGeom = new THREE.BufferGeometry();
      manifoldGeom.setAttribute('position', new THREE.BufferAttribute(aSpherePos, 3));
      manifoldGeom.setAttribute('aSpherePos', new THREE.BufferAttribute(aSpherePos, 3));
      manifoldGeom.setAttribute('aSinkholePos', new THREE.BufferAttribute(aSinkholePos, 3));
      manifoldGeom.setAttribute('aHouseholderPos', new THREE.BufferAttribute(aHouseholderPos, 3));
      manifoldGeom.setAttribute('aOrderBookPos', new THREE.BufferAttribute(aOrderBookPos, 3));
      manifoldGeom.setAttribute('aMerklePos', new THREE.BufferAttribute(aMerklePos, 3));
      manifoldGeom.setAttribute('aMetrics', new THREE.BufferAttribute(aMetrics, 3));

      const manifoldUniforms = {
        uTime: { value: 0 },
        uStage: { value: 0 },
        uPerturbation: { value: uniformBridgeRef.current.perturbation },
        uShieldActive: { value: uniformBridgeRef.current.shieldActive },
        uActProgress: { value: 0 },
        uPointerWorld: { value: new THREE.Vector3(0, 0, 0) },
        uPointerActive: { value: 0 },
        uDpr: { value: dpr },
        uDarkTheme: { value: 0 },
        uHighlightedCluster: { value: -1 }
      };

      const manifoldMat = new THREE.ShaderMaterial({
        vertexShader: MANIFOLD_VERTEX_SHADER,
        fragmentShader: MANIFOLD_FRAGMENT_SHADER,
        uniforms: manifoldUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.NormalBlending
      });

      const manifoldPoints = new THREE.Points(manifoldGeom, manifoldMat);
      rootGroup.add(manifoldPoints);

      // Inner Spherical-Harmonics Sovereign Core Mesh (Custom GLSL Displacement + Fresnel Contour Shader)
      const coreGeom = new THREE.IcosahedronGeometry(0.62, isCompact ? 3 : 4);
      const coreUniforms = {
        uTime: { value: 0 },
        uStage: { value: 0 },
        uPerturbation: { value: uniformBridgeRef.current.perturbation },
        uShieldActive: { value: uniformBridgeRef.current.shieldActive },
        uDarkTheme: { value: 0 }
      };
      const coreMat = new THREE.ShaderMaterial({
        vertexShader: CORE_HARMONIC_VERTEX_SHADER,
        fragmentShader: CORE_HARMONIC_FRAGMENT_SHADER,
        uniforms: coreUniforms,
        transparent: true,
        depthWrite: false
      });
      const coreMesh = new THREE.Mesh(coreGeom, coreMat);
      rootGroup.add(coreMesh);

      // Geodesic Quarantine Dome & Fresnel Survey Shell
      const domeGeom = new THREE.IcosahedronGeometry(1.22, isCompact ? 2 : 3);
      const domeUniforms = {
        uTime: { value: 0 },
        uPerturbation: { value: uniformBridgeRef.current.perturbation },
        uShieldActive: { value: uniformBridgeRef.current.shieldActive },
        uDarkTheme: { value: 0 }
      };
      const domeMat = new THREE.ShaderMaterial({
        vertexShader: DOME_VERTEX_SHADER,
        fragmentShader: DOME_FRAGMENT_SHADER,
        uniforms: domeUniforms,
        transparent: true,
        depthWrite: false,
        wireframe: true
      });
      const domeMesh = new THREE.Mesh(domeGeom, domeMat);
      rootGroup.add(domeMesh);

      const ringGeom1 = new THREE.RingGeometry(1.56, 1.578, 96);
      const ringGeom2 = new THREE.RingGeometry(1.82, 1.835, 96);
      const ringMat = new THREE.MeshBasicMaterial({
        color: 0xd5991c,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.28
      });
      const ringMesh1 = new THREE.Mesh(ringGeom1, ringMat);
      ringMesh1.rotation.x = Math.PI / 2.6;
      ringMesh1.rotation.y = 0.25;
      rootGroup.add(ringMesh1);

      const ringMesh2 = new THREE.Mesh(ringGeom2, ringMat);
      ringMesh2.rotation.x = -Math.PI / 3.1;
      ringMesh2.rotation.z = 0.42;
      rootGroup.add(ringMesh2);

      const arcGroup = new THREE.Group();
      const arcGeometries: THREE.BufferGeometry[] = [];
      const arcMat = new THREE.LineBasicMaterial({
        color: 0xd5991c,
        transparent: true,
        opacity: 0.42
      });

      const anchorVec = new THREE.Vector3(0.2, 0.72, 0.92).normalize().multiplyScalar(1.2);
      for (let a = 0; a < 8; a++) {
        const angle = (a / 8) * Math.PI * 2;
        const targetVec = new THREE.Vector3(
          Math.cos(angle) * 1.15,
          Math.sin(angle * 1.5) * 0.65,
          Math.sin(angle) * 1.15
        ).normalize().multiplyScalar(1.2);

        const midVec = anchorVec.clone().add(targetVec).multiplyScalar(0.5).normalize().multiplyScalar(1.58);
        const curve = new THREE.QuadraticBezierCurve3(anchorVec, midVec, targetVec);
        const pts = curve.getPoints(32);
        const arcGeom = new THREE.BufferGeometry().setFromPoints(pts);
        arcGeometries.push(arcGeom);
        const arcLine = new THREE.Line(arcGeom, arcMat);
        arcGroup.add(arcLine);
      }
      rootGroup.add(arcGroup);

      const updateSize = () => {
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const w = Math.max(1, rect.width || 440);
        const h = Math.max(1, rect.height || 440);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      };
      updateSize();
      window.addEventListener('resize', updateSize);

      const onPointerMove = (e: PointerEvent) => {
        const rect = canvas.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;
        if (
          e.clientX < rect.left ||
          e.clientX > rect.right ||
          e.clientY < rect.top ||
          e.clientY > rect.bottom
        ) {
          uniformBridgeRef.current.pointerActive = 0.0;
          return;
        }
        const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
        const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1;
        uniformBridgeRef.current.pointerX = nx * 1.8;
        uniformBridgeRef.current.pointerY = ny * 1.4;
        uniformBridgeRef.current.pointerActive = 1.0;
      };
      const onPointerLeave = () => {
        uniformBridgeRef.current.pointerActive = 0.0;
      };
      window.addEventListener('pointermove', onPointerMove, { passive: true });
      window.addEventListener('pointerleave', onPointerLeave, { passive: true });

      let isVisible = true;
      let isTabActive = !document.hidden;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            isVisible = entry.isIntersecting;
          });
        },
        { threshold: 0.01 }
      );
      observer.observe(canvas);

      const onVisibilityChange = () => {
        isTabActive = !document.hidden;
      };
      document.addEventListener('visibilitychange', onVisibilityChange);

      const onContextLost = (e: Event) => {
        e.preventDefault();
        cancelAnimationFrame(rafId);
      };
      const onContextRestored = () => {
        updateSize();
        rafId = requestAnimationFrame(tick);
      };
      canvas.addEventListener('webglcontextlost', onContextLost, false);
      canvas.addEventListener('webglcontextrestored', onContextRestored, false);

      const clockStart = performance.now();
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const tick = (now: number) => {
        rafId = requestAnimationFrame(tick);
        if (!isVisible || !isTabActive) return;

        const elapsed = prefersReduced ? 0 : (now - clockStart) * 0.001;
        const bridge = uniformBridgeRef.current;

        bridge.stage += (bridge.targetStage - bridge.stage) * 0.09;

        manifoldUniforms.uTime.value = elapsed;
        manifoldUniforms.uStage.value = bridge.stage;
        manifoldUniforms.uPerturbation.value += (bridge.perturbation - manifoldUniforms.uPerturbation.value) * 0.12;
        manifoldUniforms.uShieldActive.value += (bridge.shieldActive - manifoldUniforms.uShieldActive.value) * 0.12;
        manifoldUniforms.uActProgress.value += (bridge.actProgress - manifoldUniforms.uActProgress.value) * 0.1;
        manifoldUniforms.uDarkTheme.value += (bridge.darkTheme - manifoldUniforms.uDarkTheme.value) * 0.12;
        manifoldUniforms.uHighlightedCluster.value = bridge.highlightedCluster;
        manifoldUniforms.uPointerActive.value += (bridge.pointerActive - manifoldUniforms.uPointerActive.value) * 0.08;
        manifoldUniforms.uPointerWorld.value.set(bridge.pointerX, bridge.pointerY, 0.3);

        coreUniforms.uTime.value = elapsed;
        coreUniforms.uStage.value = bridge.stage;
        coreUniforms.uPerturbation.value = manifoldUniforms.uPerturbation.value;
        coreUniforms.uShieldActive.value = manifoldUniforms.uShieldActive.value;
        coreUniforms.uDarkTheme.value = manifoldUniforms.uDarkTheme.value;
        coreMesh.rotation.y = -elapsed * 0.18;
        coreMesh.rotation.x = elapsed * 0.11;

        domeUniforms.uTime.value = elapsed;
        domeUniforms.uPerturbation.value = manifoldUniforms.uPerturbation.value;
        domeUniforms.uShieldActive.value = manifoldUniforms.uShieldActive.value;
        domeUniforms.uDarkTheme.value = manifoldUniforms.uDarkTheme.value;

        const domeScale = Math.max(
          0.45,
          1.0 - Math.abs(bridge.stage - 0.0) * 0.15 + (bridge.stage > 1.5 && bridge.stage < 2.5 ? 0.18 : 0)
        );
        domeMesh.scale.setScalar(domeScale);
        domeMesh.rotation.y = elapsed * 0.12 + bridge.stage * 0.4;
        ringMesh1.rotation.z = elapsed * 0.08 + bridge.stage * 0.3;
        ringMesh2.rotation.y = -elapsed * 0.06;
        arcGroup.rotation.y = elapsed * 0.16;
        arcMat.opacity = Math.max(0.06, 0.42 * (1.0 - Math.min(1.0, bridge.stage * 0.6)));

        const camXTarget = bridge.pointerX * 0.08;
        const camYTarget = 0.15 + bridge.pointerY * 0.06 - (bridge.stage === 1 ? 0.12 : 0);
        camera.position.x += (camXTarget - camera.position.x) * 0.06;
        camera.position.y += (camYTarget - camera.position.y) * 0.06;
        camera.lookAt(0, 0, 0);

        renderer.render(scene, camera);
      };

      setWebglReady(true);
      rafId = requestAnimationFrame(tick);

      cleanupFn = () => {
        cancelAnimationFrame(rafId);
        observer.disconnect();
        window.removeEventListener('resize', updateSize);
        window.removeEventListener('pointermove', onPointerMove);
        window.removeEventListener('pointerleave', onPointerLeave);
        document.removeEventListener('visibilitychange', onVisibilityChange);
        canvas.removeEventListener('webglcontextlost', onContextLost);
        canvas.removeEventListener('webglcontextrestored', onContextRestored);

        manifoldGeom.dispose();
        manifoldMat.dispose();
        coreGeom.dispose();
        coreMat.dispose();
        domeGeom.dispose();
        domeMat.dispose();
        ringGeom1.dispose();
        ringGeom2.dispose();
        ringMat.dispose();
        arcGeometries.forEach((g) => g.dispose());
        arcMat.dispose();
        renderer.dispose();
      };
    };

    startWebGL();

    return () => {
      if (cleanupFn) cleanupFn();
    };
  }, []);

  /* ==========================================================================
     GSAP + SCROLLTRIGGER CHOREOGRAPHY (MULTI-SECTION DOCKING & SCRUBBED ACT TIMELINES)
     ========================================================================== */
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      ScrollTrigger.create({
        trigger: '#hero-observatory',
        start: 'top top',
        end: 'bottom 45%',
        onEnter: () => {
          uniformBridgeRef.current.targetStage = 0;
          uniformBridgeRef.current.darkTheme = 0;
          setActiveStageIndex(0);
          setCanvasDockedStage(0);
        },
        onEnterBack: () => {
          uniformBridgeRef.current.targetStage = 0;
          uniformBridgeRef.current.darkTheme = 0;
          setActiveStageIndex(0);
          setCanvasDockedStage(0);
        }
      });

      ScrollTrigger.create({
        trigger: '#problem',
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => {
          uniformBridgeRef.current.targetStage = 1;
          uniformBridgeRef.current.darkTheme = 0;
          setActiveStageIndex(1);
          setCanvasDockedStage(1);
        },
        onEnterBack: () => {
          uniformBridgeRef.current.targetStage = 1;
          uniformBridgeRef.current.darkTheme = 0;
          setActiveStageIndex(1);
          setCanvasDockedStage(1);
        }
      });

      ScrollTrigger.create({
        trigger: '#interdiction',
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => {
          uniformBridgeRef.current.targetStage = 2;
          uniformBridgeRef.current.darkTheme = 1;
          setActiveStageIndex(2);
          setCanvasDockedStage(2);
        },
        onEnterBack: () => {
          uniformBridgeRef.current.targetStage = 2;
          uniformBridgeRef.current.darkTheme = 1;
          setActiveStageIndex(2);
          setCanvasDockedStage(2);
        },
        onLeave: () => {
          uniformBridgeRef.current.darkTheme = 0;
        },
        onLeaveBack: () => {
          uniformBridgeRef.current.darkTheme = 0;
        },
        onUpdate: (self) => {
          uniformBridgeRef.current.actProgress = self.progress;
          const actIdx = self.progress < 0.34 ? 0 : self.progress < 0.67 ? 1 : 2;
          setActiveInterdictionAct(actIdx as 0 | 1 | 2);
        }
      });

      ScrollTrigger.create({
        trigger: '#services',
        start: 'top 55%',
        end: 'bottom 45%',
        onEnter: () => {
          uniformBridgeRef.current.targetStage = 3;
          uniformBridgeRef.current.darkTheme = 0;
          setActiveStageIndex(3);
          setCanvasDockedStage(3);
        },
        onEnterBack: () => {
          uniformBridgeRef.current.targetStage = 3;
          uniformBridgeRef.current.darkTheme = 0;
          setActiveStageIndex(3);
          setCanvasDockedStage(3);
        }
      });

      ScrollTrigger.create({
        trigger: '#research',
        start: 'top 60%',
        end: 'bottom bottom',
        onEnter: () => {
          uniformBridgeRef.current.targetStage = 4;
          uniformBridgeRef.current.darkTheme = 0;
          setActiveStageIndex(4);
        },
        onEnterBack: () => {
          uniformBridgeRef.current.targetStage = 4;
          uniformBridgeRef.current.darkTheme = 0;
          setActiveStageIndex(4);
        }
      });

      mm.add(MOTION_QUERY, () => {
        const heroTl = gsap.timeline({ defaults: { ease: EASE_OUT_EXPO } });
        heroTl.fromTo(
          '[data-hero-line]',
          { yPercent: 24, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 0.9, stagger: 0.07 },
          0.02
        );

        gsap.utils.toArray<HTMLElement>('[data-rule-draw]').forEach((rule) => {
          gsap.fromTo(
            rule,
            { scaleX: 0.12 },
            {
              scaleX: 1,
              ease: EASE_IN_OUT_EXPO,
              scrollTrigger: {
                trigger: rule,
                start: 'top 92%',
                end: 'top 45%',
                scrub: 0.5
              }
            }
          );
        });

        gsap.utils.toArray<HTMLElement>('[data-parallax-numeral]').forEach((numEl) => {
          gsap.fromTo(
            numEl,
            { y: 20 },
            {
              y: -16,
              ease: 'none',
              scrollTrigger: {
                trigger: numEl,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
              }
            }
          );
        });

        gsap.fromTo(
          '[data-interdiction-progress]',
          { scaleX: 0.05 },
          {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: {
              trigger: '#interdiction',
              start: 'top 60%',
              end: 'bottom 45%',
              scrub: 0.3
            }
          }
        );
      });

      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          ScrollTrigger.refresh();
        });
      }
    }, root);

    return () => ctx.revert();
  }, []);

  /* ==========================================================================
     DERIVED TELEMETRY & ACTUARIAL METRICS
     ========================================================================== */
  const liveCosineSimilarity = useMemo(() => {
    const rawDrift = perturbationEpsilon * (shieldEngaged ? 0.042 : 0.685);
    return Math.max(0.18, 0.998 - rawDrift).toFixed(3);
  }, [perturbationEpsilon, shieldEngaged]);

  const liveIntrinsicDim = useMemo(() => {
    const collapse = perturbationEpsilon * (shieldEngaged ? 1.1 : 16.3);
    return Math.max(2.1, 18.4 - collapse).toFixed(1);
  }, [perturbationEpsilon, shieldEngaged]);

  const stageNames = [
    'STAGE I // GEODESIC RAG MANIFOLD [38.90°N, 77.03°W]',
    'STAGE II // TOPOLOGICAL SINKHOLE GRAVITY WELL (AM-CIDP)',
    'STAGE III // HOUSEHOLDER ISOMETRIC ROTATION Q_t ∈ O(d)',
    'STAGE IV // 142.0ns FPGA ORDER-BOOK WAVEFRONT (TMMEG)',
    'STAGE V // ZERO-KNOWLEDGE R1CS MERKLE LATTICE (ZK-CAEO)'
  ];

  const activeService = useMemo(
    () => SERVICES.find((s) => s.id === selectedServiceId) || SERVICES[0],
    [selectedServiceId]
  );

  const filteredCapabilities = useMemo(() => {
    if (selectedCapabilityCategory === 'ALL') return CAPABILITIES_MATRIX;
    return CAPABILITIES_MATRIX.filter((c) => c.category === selectedCapabilityCategory);
  }, [selectedCapabilityCategory]);

  const estimatedAiSynthesizedQueries = Math.round(monthlyQueryVolume * 0.48);
  const unmitigatedPoisonedCitations = Math.round(
    estimatedAiSynthesizedQueries * (0.04 + perturbationEpsilon * 0.09)
  );
  const orderBookSweepRiskM = (institutionalOrderBookM * (0.065 + perturbationEpsilon * 0.14)).toFixed(1);
  const protectedResidualRiskM = (Number(orderBookSweepRiskM) * 0.018).toFixed(2);

  const activeCase = CASE_STUDIES[selectedCaseIndex] || CASE_STUDIES[0];

  return (
    <div
      ref={rootRef}
      className="relative bg-[#FAF5EB] text-[#410217] font-sans selection:bg-[#410217] selection:text-[#FBF3E2]"
    >
      {/* =====================================================================
          TOP ARCHIVAL FOLIO & TELEMETRY CLASSIFICATION BAR
          ===================================================================== */}
      <div
        role="region"
        aria-label="Sovereign Epistemic Telemetry Ribbon"
        className="relative z-30 bg-[#FAF2E1] border-b border-[#410217]/20 px-4 sm:px-6 lg:px-8 py-2.5 font-mono text-[11px]"
      >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#410217] text-[#FBF3E2] font-bold tracking-widest uppercase text-[10px]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#D5991C]" />
              FOLIO // LCD-2026-SOVEREIGN
            </span>
            <span className="hidden sm:inline text-[#5A1827] font-semibold">
              {stageNames[activeStageIndex]}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6 text-[#410217]">
            <div className="hidden lg:flex items-center gap-2">
              <span className="text-[#6E3340]">COSINE_SIM:</span>
              <strong
                className={`tabular-nums px-1.5 py-0.5 border ${
                  Number(liveCosineSimilarity) > 0.9
                    ? 'bg-[#15684E]/10 text-[#15684E] border-[#15684E]/30'
                    : 'bg-[#8B1E1E]/10 text-[#8B1E1E] border-[#8B1E1E]/30'
                }`}
              >
                {liveCosineSimilarity}
              </strong>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <span className="text-[#6E3340]">LID_k:</span>
              <strong className="tabular-nums text-[#410217]">{liveIntrinsicDim} dim</strong>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[#6E3340]">SMARTNIC_GATE:</span>
              <strong className="tabular-nums text-[#8B5A0B]">142.0 ns</strong>
            </div>

            <button
              type="button"
              onClick={() => {
                const next = !audioPulseEnabled;
                setAudioPulseEnabled(next);
                if (next) playTactilePulse(true, 660, 30);
              }}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 border border-[#410217]/25 bg-[#FAF5EB] hover:border-[#410217] text-[#410217] font-bold uppercase tracking-wider text-[10px] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#410217]"
              aria-pressed={audioPulseEnabled}
              title="Toggle subtle acoustic telemetry clicks on manifold interactions"
            >
              {audioPulseEnabled ? (
                <>
                  <Volume2 className="w-3 h-3 text-[#15684E]" />
                  <span>ACOUSTIC: ON</span>
                </>
              ) : (
                <>
                  <VolumeX className="w-3 h-3 text-[#6E3340]" />
                  <span>ACOUSTIC: MUTED</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================================
          HERO — THE SOVEREIGN EPISTEMIC MANIFOLD & CARTOGRAPHIC OBSERVATORY
          ===================================================================== */}
      <section
        id="hero-observatory"
        aria-labelledby="hero-heading"
        className="relative z-20 pt-8 pb-16 md:pt-14 md:pb-24 border-b border-[#410217]/20"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-[#410217]/15 font-mono text-[11px] text-[#5A1827]">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#8B5A0B] uppercase tracking-[0.2em]">
                § 00 // SOVEREIGN EPISTEMIC &amp; FINANCIAL DEFENSE
              </span>
              <span className="hidden sm:inline text-[#410217]/30">|</span>
              <span className="hidden sm:inline">WASHINGTON D.C. COMMAND HUB [38.9072° N, 77.0369° W]</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 bg-[#15684E]/10 border border-[#15684E]/30 text-[#15684E] font-bold uppercase tracking-wider text-[10px]">
                10-LAYER STACK ACTIVE
              </span>
              <span className="text-[#6E3340]">COUNTERAEO-BENCH N=250,000</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            {/* Left 7 Columns */}
            <div className="lg:col-span-7 space-y-8">
              <h1
                id="hero-heading"
                className="font-display text-[clamp(2.65rem,5.6vw,5.15rem)] leading-[1.09] tracking-[-0.02em] text-[#410217]"
              >
                <span data-hero-line className="block will-change-transform">
                  Defending America
                </span>
                <span data-hero-line className="block will-change-transform">
                  in the era of the
                </span>
                <span data-hero-line className="block will-change-transform">
                  <em className="text-[#8B5A0B] font-normal">generative engine.</em>
                </span>
              </h1>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 pt-2">
                <div className="sm:col-span-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6E3340] space-y-1.5 border-l-2 border-[#8B5A0B] pl-3">
                  <div className="font-bold text-[#410217]">MISSION DIRECTIVE</div>
                  <div>VECTOR: 1,536-DIM</div>
                  <div>DEFENSE: DUAL-USE</div>
                  <div>COMPLIANCE: 15c3-8</div>
                </div>
                <p className="sm:col-span-9 text-base sm:text-[17px] leading-[1.68] text-[#410217]/90 font-sans">
                  Foundation model weights sit behind fortified corporate firewalls—so foreign adversaries and predatory trading desks weaponize the{' '}
                  <strong className="font-semibold text-[#410217]">open-web RAG layer</strong> as an asymmetric backdoor. Last Crusade Defense detects and neutralizes generative engine manipulation across national security, corporate intelligence, and high-frequency capital markets.
                </p>
              </div>

              {/* Interactive Manifold Perturbation & Householder Shield Controller */}
              <div
                className="bg-[#FAF2E1] border border-[#410217]/25 p-5 sm:p-6 space-y-4"
                aria-label="Interactive Epistemic Manifold Perturbation Controls"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#410217]/15 font-mono text-xs">
                  <div className="flex items-center gap-2">
                    <Sliders className="w-3.5 h-3.5 text-[#8B5A0B]" />
                    <span className="font-bold uppercase tracking-wider text-[#410217]">
                      LIVE MANIFOLD STRESS TEST // ADVERSARIAL PERTURBATION (ε)
                    </span>
                  </div>
                  <span className="text-[11px] font-bold text-[#8B5A0B] tabular-nums">
                    ε = {perturbationEpsilon.toFixed(2)} rad
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
                  <div className="sm:col-span-7 space-y-2">
                    <label
                      htmlFor="hero-epsilon-slider"
                      className="flex items-center justify-between font-mono text-[11px] text-[#5A1827]"
                    >
                      <span>INJECTED RAG HUB GRAVITY (AT-1 SINKHOLE):</span>
                      <span className="font-bold text-[#410217] tabular-nums">
                        {Math.round(perturbationEpsilon * 21400).toLocaleString()} queries pulled
                      </span>
                    </label>
                    <input
                      id="hero-epsilon-slider"
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={perturbationEpsilon}
                      onChange={(e) => setPerturbationEpsilon(parseFloat(e.target.value))}
                      className="w-full accent-[#410217] cursor-pointer h-2 bg-[#410217]/15"
                    />
                    <div className="flex justify-between font-mono text-[10px] text-[#6E3340]">
                      <span>0.00 (Nominal Corpus)</span>
                      <span>0.50 (Regional Hub)</span>
                      <span>1.00 (Sovereign Sinkhole)</span>
                    </div>
                  </div>

                  <div className="sm:col-span-5 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setShieldEngaged(!shieldEngaged);
                        playTactilePulse(audioPulseEnabled, !shieldEngaged ? 680 : 320, 35);
                      }}
                      aria-pressed={shieldEngaged}
                      className={`w-full py-2.5 px-3.5 font-mono text-xs font-bold uppercase tracking-wider border transition-colors flex items-center justify-between cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#410217] ${
                        shieldEngaged
                          ? 'bg-[#15684E] text-[#FBF3E2] border-[#15684E]'
                          : 'bg-[#8B1E1E] text-[#FBF3E2] border-[#8B1E1E]'
                      }`}
                    >
                      <span>{shieldEngaged ? 'SHIELD: Q_t ∈ O(d) LOCKED' : 'SHIELD: BYPASSED (EXPOSED)'}</span>
                      <span className="w-2 h-2 rounded-full bg-[#FBF3E2]" />
                    </button>
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#5A1827] px-1">
                      <span>
                        COSINE FIDELITY: <strong className="text-[#410217] tabular-nums">{liveCosineSimilarity}</strong>
                      </span>
                      <span>
                        LID_k: <strong className="text-[#410217] tabular-nums">{liveIntrinsicDim}</strong>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Primary Action Row */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  type="button"
                  onClick={triggerAudit}
                  className="group inline-flex items-center gap-4 bg-[#410217] hover:bg-[#26010D] text-[#FBF3E2] pl-6 pr-4 py-4 font-mono text-xs font-bold uppercase tracking-[0.14em] border border-[#410217] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#410217]"
                >
                  <span>Request Sovereign AEO Audit</span>
                  <span className="w-7 h-7 border border-[#F2D69D]/35 flex items-center justify-center bg-[#26010D]">
                    <ArrowRight className="w-3.5 h-3.5 text-[#D5991C] transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </button>

                <button
                  type="button"
                  onClick={triggerIncident}
                  className="inline-flex items-center gap-2.5 px-5 py-4 bg-[#FAF2E1] hover:bg-[#F2D69D]/45 text-[#8B1E1E] border border-[#8B1E1E]/40 font-mono text-xs font-bold uppercase tracking-[0.12em] transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#410217]"
                >
                  <ShieldAlert className="w-4 h-4 text-[#8B1E1E]" />
                  <span>Report Active Incident</span>
                </button>

                <a
                  href="#problem"
                  className="link-underline font-mono text-xs font-bold uppercase tracking-wider text-[#410217] py-2 px-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#410217]"
                >
                  Inspect Attack Surface ↓
                </a>
              </div>
            </div>

            {/* Right 5 Columns: Observatory Slot 0 + 6-Engine Telemetry Matrix */}
            <div className="lg:col-span-5 space-y-4">
              <div className="relative bg-[#FAF2E1] border border-[#410217]/30 overflow-hidden">
                <div className="flex items-center justify-between px-4 py-2.5 bg-[#410217] text-[#FBF3E2] font-mono text-[10px] tracking-widest uppercase">
                  <div className="flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-[#D5991C]" />
                    <span>OBSERVATORY // 1,536-DIM RAG MANIFOLD</span>
                  </div>
                  <span className="text-[#D5991C] font-bold">
                    {webglSupported ? 'WEBGL 2.0 + GLSL' : 'STATIC PLATE'}
                  </span>
                </div>

                {/* SLOT 0 */}
                <div
                  ref={slot0Ref}
                  className="relative aspect-square w-full bg-[#FAF5EB] overflow-hidden"
                >
                  <div
                    className={`absolute inset-0 transition-opacity duration-300 ${
                      webglReady && webglSupported && canvasDockedStage === 0
                        ? 'opacity-0 pointer-events-none'
                        : 'opacity-100'
                    }`}
                  >
                    <ArchivalGeodesicPoster
                      perturbation={perturbationEpsilon}
                      shieldActive={shieldEngaged}
                      stageLabel={stageNames[0]}
                    />
                  </div>

                  {/* Single Shared WebGL Canvas Host */}
                  <div
                    ref={canvasHostRef}
                    className="absolute inset-0 z-10 w-full h-full pointer-events-auto"
                  >
                    <canvas
                      ref={canvasRef}
                      className="w-full h-full block cursor-crosshair"
                      aria-label="Interactive 3D Epistemic Vector Manifold visualizing RAG embeddings, topological sinkholes, and Householder isometric rotations"
                    />
                  </div>

                  <div className="pointer-events-none absolute top-3 left-3 z-20 font-mono text-[10px] text-[#410217] bg-[#FAF5EB]/90 border border-[#410217]/20 px-2.5 py-1.5 space-y-0.5">
                    <div className="text-[#8B5A0B] font-bold">Q_t = I - 2u_t u_t^⊤ ∈ O(d)</div>
                    <div>
                      STATE: <strong className="text-[#410217]">{shieldEngaged ? 'ISOMETRIC LOCK' : 'VULNERABLE'}</strong>
                    </div>
                  </div>

                  <div className="pointer-events-none absolute bottom-3 right-3 z-20 font-mono text-[10px] text-[#410217] bg-[#FAF5EB]/90 border border-[#410217]/20 px-2.5 py-1 text-right">
                    <span>HOVER TO PROBE GEODESICS</span>
                  </div>
                </div>

                {/* 6-Engine Live Citation Health Matrix */}
                <div className="border-t border-[#410217]/20 bg-[#FAF2E1] p-3">
                  <div className="flex items-center justify-between font-mono text-[10px] text-[#5A1827] mb-2 px-1">
                    <span className="font-bold uppercase tracking-wider">
                      MONITORED FOUNDATION ENGINES (HOVER TO ISOLATE CLUSTER)
                    </span>
                    <span className="text-[#15684E] font-bold">15/15 LIVE</span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5 font-mono text-[10px]">
                    {ENGINE_STATUSES.map((eng, idx) => {
                      const isHovered = highlightedEngineIdx === idx;
                      const isDistorted = eng.sentiment === 'DISTORTED' || eng.sentiment === 'HOSTILE';
                      return (
                        <button
                          key={eng.code}
                          type="button"
                          onMouseEnter={() => {
                            setHighlightedEngineIdx(idx);
                            playTactilePulse(audioPulseEnabled, 480 + idx * 55, 18);
                          }}
                          onMouseLeave={() => setHighlightedEngineIdx(-1)}
                          onFocus={() => setHighlightedEngineIdx(idx)}
                          onBlur={() => setHighlightedEngineIdx(-1)}
                          className={`text-left p-2 border transition-colors cursor-pointer ${
                            isHovered
                              ? 'bg-[#410217] text-[#FBF3E2] border-[#410217]'
                              : 'bg-[#FAF5EB] text-[#410217] border-[#410217]/15 hover:border-[#410217]'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold truncate">{eng.code}</span>
                            <span
                              className={`tabular-nums font-bold ${
                                isHovered
                                  ? 'text-[#D5991C]'
                                  : isDistorted
                                  ? 'text-[#8B1E1E]'
                                  : 'text-[#15684E]'
                              }`}
                            >
                              {eng.citationHealthScore}%
                            </span>
                          </div>
                          <div
                            className={`text-[9px] truncate mt-0.5 ${
                              isHovered ? 'text-[#F2D69D]' : 'text-[#6E3340]'
                            }`}
                          >
                            {eng.threatCount} alerts · {eng.sentiment}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Direct Module Index & Sovereign Metrics Ledger */}
          <div className="mt-14 pt-8 border-t border-[#410217]/20">
            <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-[#5A1827] mb-4">
              <span>DIRECT PLATFORM DISPATCH // INTERACTIVE WORKBENCHES &amp; ARCHIVES</span>
              <span>SELECT MODULE TO LAUNCH</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 border-t border-l border-[#410217]/20">
              {[
                {
                  num: '01',
                  page: 'rea' as NavigationPage,
                  kicker: 'BINARY & BUNDLE FORENSICS',
                  title: 'REA Studio',
                  detail: 'Reverse-engineering workbench for Electron, Mach-O & Web targets'
                },
                {
                  num: '02',
                  page: 'research' as NavigationPage,
                  kicker: '180-PAGE ARCHIVAL CORPUS',
                  title: 'Research Tetralogy',
                  detail: 'Volumes I, II, III & IV · Mathematical proofs & 3D WebGL labs'
                },
                {
                  num: '03',
                  page: 'counter-geo-ops' as NavigationPage,
                  kicker: '8 INTERACTIVE WEBGL SIMS',
                  title: 'Strategy Library',
                  detail: 'Offensive AEO payloads (AT-1..AT-8) & live countermeasure sandbox'
                },
                {
                  num: '04',
                  page: 'pitch-deck' as NavigationPage,
                  kicker: 'INSTITUTIONAL BRIEFING',
                  title: 'Pitch Deck',
                  detail: 'Last Crusade Defense & Petra Labs sovereign operations dossier'
                }
              ].map((item) => (
                <button
                  key={item.page}
                  type="button"
                  onClick={() => triggerNavigate(item.page)}
                  className="group text-left p-6 bg-[#FAF2E1]/60 hover:bg-[#410217] text-[#410217] hover:text-[#FBF3E2] border-r border-b border-[#410217]/20 transition-colors cursor-pointer flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#410217]"
                >
                  <div className="flex items-center justify-between font-mono text-[10px] mb-4">
                    <span className="font-bold text-[#8B5A0B] group-hover:text-[#D5991C]">
                      MODULE // {item.num}
                    </span>
                    <ArrowUpRight className="w-4 h-4 text-[#410217]/60 group-hover:text-[#D5991C] transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                  <div>
                    <div className="font-mono text-[9px] uppercase tracking-widest text-[#6E3340] group-hover:text-[#F2D69D]/80 mb-1">
                      {item.kicker}
                    </div>
                    <div className="font-serif text-2xl tracking-tight group-hover:italic">
                      {item.title}
                    </div>
                    <p className="text-xs text-[#5A1827] group-hover:text-[#FBF3E2]/80 mt-2 leading-relaxed">
                      {item.detail}
                    </p>
                  </div>
                </button>
              ))}
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 border-x border-b border-[#410217]/20 bg-[#FAF5EB]">
              {[
                {
                  figure: '42.8M+',
                  label: 'AI citations & RAG embeddings monitored continuously',
                  spec: '15 FRONTIER ENGINES',
                  note: '¹'
                },
                {
                  figure: '14,289',
                  label: 'Poisoned open-web RAG hubs & vector sinkholes neutralized',
                  spec: 'AM-CIDP QUARANTINE',
                  note: '²'
                },
                {
                  figure: '98.4%',
                  label: 'Hallucinated & adversarial claim suppression rate',
                  spec: 'AUC = 0.994 ± 0.002',
                  note: '³'
                },
                {
                  figure: '142.0 ns',
                  label: 'Wire-speed SmartNIC FPGA order-book interdiction latency',
                  spec: '45 CLOCKS @ 312.5 MHz',
                  note: '⁴'
                }
              ].map((stat, idx) => (
                <div
                  key={stat.label}
                  className={`p-5 sm:p-6 ${idx > 0 ? 'border-l border-[#410217]/20' : ''} ${
                    idx >= 2 ? 'border-t lg:border-t-0 border-[#410217]/20' : ''
                  }`}
                >
                  <div className="font-mono text-[9px] uppercase tracking-widest text-[#8B5A0B] font-bold mb-2">
                    {stat.spec}
                  </div>
                  <div className="font-display text-[clamp(1.75rem,3.8vw,3.45rem)] leading-none text-[#410217] tabular-nums whitespace-nowrap">
                    {stat.figure}
                  </div>
                  <div className="mt-3 text-xs sm:text-[13px] text-[#5A1827] leading-snug">
                    {stat.label}
                    <sup className="ml-0.5 text-[#8B5A0B] font-mono">{stat.note}</sup>
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-3 font-mono text-[10px] text-[#6E3340] leading-relaxed">
              ¹–⁴ Empirical telemetry across monitored foundation models, CounterAEO-Bench (N = 250,000 vector trials, Vol. III), and Xilinx UltraScale+ SmartNIC synthesis (Vol. IV).
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================================
          § 01 — THE ASYMMETRIC BACKDOOR (EDITORIAL SPREAD + SLOT 1 SINKHOLE VIEWPORT)
          ===================================================================== */}
      <section
        id="problem"
        aria-labelledby="problem-heading"
        className="relative z-20 py-20 md:py-28 border-b border-[#410217]/20 bg-[#FAF5EB]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div data-rule-draw className="rule-draw h-px w-full bg-[#410217]/25 mb-10" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
              <div className="flex items-baseline justify-between font-mono text-xs">
                <span className="text-[#8B5A0B] font-bold uppercase tracking-[0.2em]">
                  § 01 // THE ASYMMETRIC BACKDOOR
                </span>
                <span
                  data-parallax-numeral
                  className="font-display text-5xl text-outline select-none"
                  aria-hidden="true"
                >
                  01
                </span>
              </div>

              <h2
                id="problem-heading"
                className="font-display text-[clamp(2.2rem,4.2vw,3.75rem)] leading-[1.12] text-[#410217]"
              >
                Traditional SEO and brand protection are{' '}
                <em className="text-[#8B5A0B] font-normal">blind</em> to generative engines.
              </h2>

              <p className="text-base leading-relaxed text-[#410217]/85">
                Search engines no longer return ten blue links—generative engines synthesize singular, authoritative reality across defense, finance, and governance. While foundation model weights sit behind air-gapped training clusters, every commercial engine continuously ingests the unfortified open web via Retrieval-Augmented Generation (RAG).
              </p>

              {/* SLOT 1: Topological Sinkhole Gravity Funnel Viewport */}
              <div className="bg-[#FAF2E1] border border-[#410217]/30 overflow-hidden">
                <div className="px-4 py-2 bg-[#410217] text-[#FBF3E2] font-mono text-[10px] flex items-center justify-between uppercase tracking-widest">
                  <span>STAGE II // RIEMANNIAN SINKHOLE FUNNEL (AM-CIDP)</span>
                  <span className="text-[#D5991C] font-bold">LID_k = {liveIntrinsicDim}</span>
                </div>
                <div
                  ref={slot1Ref}
                  className="relative h-56 w-full bg-[#FAF5EB] overflow-hidden flex items-center justify-center p-3"
                >
                  <div
                    className={`w-full h-full transition-opacity duration-300 ${
                      canvasDockedStage === 1 && webglSupported ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                  >
                    <SinkholeSchematicPlate
                      perturbation={perturbationEpsilon}
                      shieldActive={shieldEngaged}
                    />
                  </div>
                </div>
                <div className="px-4 py-2.5 border-t border-[#410217]/15 font-mono text-[11px] text-[#410217] bg-[#FAF2E1]">
                  max_&#123;δ ∈ B_ε&#125; E_&#123;q ∼ Q&#125; [ ⟨ f_θ(q), f_θ(d ⊕ δ) ⟩ / (∥f_θ(q)∥ ∥f_θ(d ⊕ δ)∥) ]
                </div>
              </div>

              <div className="bg-[#26010D] text-[#FBF3E2] border border-[#410217] p-4 font-mono text-[11px] space-y-2.5">
                <div className="flex items-center justify-between border-b border-[#F2D69D]/20 pb-2">
                  <span className="text-[#D5991C] font-bold uppercase tracking-wider flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-[#D5991C]" />
                    RECENT INTERCEPTED RAG PAYLOADS
                  </span>
                  <span className="text-[#25B888] text-[10px]">LIVE TELEMETRY</span>
                </div>
                {INITIAL_THREAT_ALERTS.slice(0, 3).map((alert) => (
                  <div
                    key={alert.id}
                    className="flex items-start justify-between gap-3 py-1.5 border-b border-[#F2D69D]/10 last:border-b-0"
                  >
                    <div>
                      <div className="text-[#F2D69D] font-bold">
                        {alert.id} · {alert.engine}
                      </div>
                      <div className="text-[#FBF3E2]/75 text-[10px]">{alert.attackVector}</div>
                    </div>
                    <span className="px-1.5 py-0.5 bg-[#15684E]/30 border border-[#25B888]/40 text-[#25B888] text-[9px] font-bold shrink-0">
                      {alert.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              {[
                {
                  clause: '§ 01.1 // MODEL OPERATIONS',
                  severity: 'CRITICAL',
                  severityStyle: 'bg-[#8B1E1E]/10 text-[#8B1E1E] border-[#8B1E1E]/35',
                  title: 'Open-Web RAG Sinkholes & Asymmetric Model Hijacking',
                  vectorCode: 'AT-1 / AT-2 · VECTOR HUBNESS & ENTHYMEMATIC SPLIT PAYLOADS',
                  body: 'Directly breaching commercial foundation models is firewalled and prohibitively expensive. State cyber units and corporate adversaries instead weaponize the open-web RAG layer—deploying gradient-aligned documents that collapse Local Intrinsic Dimension (LID_k) and force ChatGPT, Claude, Gemini, and Perplexity to synthesize fabricated reality.',
                  metricLeftLabel: 'Observed Hub Capture',
                  metricLeftVal: '21,400+ Queries / Doc',
                  metricRightLabel: 'Vector Drift Metric',
                  metricRightVal: '+0.642 Cosine Skew',
                  presetEpsilon: 0.88,
                  presetShield: false
                },
                {
                  clause: '§ 01.2 // MARKET WARFARE',
                  severity: 'HIGH SEVERITY',
                  severityStyle: 'bg-[#D5991C]/15 text-[#8B5A0B] border-[#D5991C]/45',
                  title: 'Liquidity Extraction Arbitrage & Order-Book Traps',
                  vectorCode: 'AT-6 · PREDATORY AI AGENT BUYING SWEEPS (LOB SPOOFING)',
                  body: 'Predatory desks accumulate pre-positioned limit-order ask walls in mid-cap or illiquid securities, then detonate coordinated generative disinformation across financial RAG scrapers. Autonomous AI trading bots ingest the poisoned citations and execute synchronized market buy sweeps directly into the adversary’s liquidity trap.',
                  metricLeftLabel: 'Order-Book Toxicity',
                  metricLeftVal: 'VPIN_t > 0.84 (Critical)',
                  metricRightLabel: 'Required Gate Speed',
                  metricRightVal: '142.0 ns SmartNIC FPGA',
                  presetEpsilon: 0.72,
                  presetShield: true
                },
                {
                  clause: '§ 01.3 // AGENT INTERDICTION',
                  severity: 'SYSTEMIC',
                  severityStyle: 'bg-[#004566]/10 text-[#004566] border-[#004566]/35',
                  title: 'Autonomous Swarm & Agent-to-Agent (A2A) Sabotage',
                  vectorCode: 'AT-4 / AT-7 · BYZANTINE CONSENSUS & EPISODIC MEMORY DRIFT',
                  body: 'Defense robotics, autonomous drone swarms, and multi-agent enterprise workflows rely on shared RAG memory and inter-agent consensus. Hostile AEO payloads inject slow-boil martingale drift into episodic vector memory and trigger autophagous AI-citing-AI cascades that paralyze swarm coordination.',
                  metricLeftLabel: 'Swarm Fiedler λ₂',
                  metricLeftVal: 'Consensus Partitioned',
                  metricRightLabel: 'Countermeasure',
                  metricRightVal: 'Doob-Meyer + W₂ Merkle',
                  presetEpsilon: 0.64,
                  presetShield: true
                }
              ].map((dossier, idx) => (
                <article
                  key={dossier.clause}
                  className={`bg-[#FAF2E1] border border-[#410217]/25 p-7 sm:p-8 transition-colors hover:border-[#410217] ${
                    idx === 1 ? 'lg:ml-8' : idx === 2 ? 'lg:ml-4' : ''
                  }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-4 mb-4 border-b border-[#410217]/15 font-mono text-xs">
                    <span className="font-bold text-[#8B5A0B] tracking-widest uppercase">
                      {dossier.clause}
                    </span>
                    <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase border ${dossier.severityStyle}`}>
                      {dossier.severity}
                    </span>
                  </div>

                  <div className="font-mono text-[10px] text-[#6E3340] uppercase tracking-wider font-bold mb-2">
                    {dossier.vectorCode}
                  </div>

                  <h3 className="font-serif text-2xl sm:text-3xl text-[#410217] tracking-tight mb-3">
                    {dossier.title}
                  </h3>

                  <p className="text-[#410217]/85 text-sm sm:text-[15px] leading-relaxed mb-6">
                    {dossier.body}
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#410217]/15 font-mono text-xs items-center">
                    <div className="bg-[#FAF5EB] p-3 border border-[#410217]/15">
                      <span className="text-[10px] text-[#6E3340] block">{dossier.metricLeftLabel}</span>
                      <strong className="text-[#410217]">{dossier.metricLeftVal}</strong>
                    </div>
                    <div className="bg-[#FAF5EB] p-3 border border-[#410217]/15">
                      <span className="text-[10px] text-[#6E3340] block">{dossier.metricRightLabel}</span>
                      <strong className="text-[#8B1E1E]">{dossier.metricRightVal}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setPerturbationEpsilon(dossier.presetEpsilon);
                        setShieldEngaged(dossier.presetShield);
                        triggerNavigate('counter-geo-ops');
                      }}
                      className="h-full py-3 px-4 bg-[#410217] hover:bg-[#26010D] text-[#FBF3E2] font-bold uppercase tracking-wider text-[11px] flex items-center justify-between transition-colors cursor-pointer"
                    >
                      <span>Simulate in 3D Lab</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-[#D5991C]" />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          § 02 — INTERDICTION CHAMBER: THE 10-LAYER SOVEREIGN ARCHITECTURE + SLOT 2
          ===================================================================== */}
      <section
        id="interdiction"
        aria-labelledby="interdiction-heading"
        className="relative z-20 py-20 md:py-28 bg-[#26010D] text-[#FBF3E2] border-b border-[#F2D69D]/30"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div>
            <div className="h-1 w-full bg-[#F2D69D]/15 mb-8 overflow-hidden">
              <div
                data-interdiction-progress
                className="rule-draw h-full w-full bg-[#D5991C]"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-7 space-y-4">
                <div className="font-mono text-xs text-[#D5991C] font-bold uppercase tracking-[0.22em]">
                  § 02 // ACTIVE INTERDICTION PROTOCOL · 10-LAYER DEFENSE STACK
                </div>
                <h2
                  id="interdiction-heading"
                  className="font-display text-[clamp(2.2rem,4.4vw,4rem)] leading-[1.12] text-[#FBF3E2]"
                >
                  From topological sinkhole detection to{' '}
                  <em className="text-[#D5991C] font-normal">142-nanosecond</em> silicon gating.
                </h2>
                <p className="text-sm sm:text-base text-[#FBF3E2]/80 max-w-2xl leading-relaxed">
                  Select any interdiction act below or scrub through the chamber to inspect how Householder reflections{' '}
                  <code className="font-mono text-[#D5991C]">Q_t ∈ O(d)</code>, C2PA provenance graphs, and 45-clock UltraScale+ FPGA pipelines neutralize adversarial payloads in real time.
                </p>
              </div>

              {/* SLOT 2: 3D Householder Isometric Rotation & Quarantine Dome Viewport */}
              <div className="lg:col-span-5 bg-[#1A0109] border border-[#D5991C]/40 overflow-hidden">
                <div className="px-4 py-2 bg-[#310111] border-b border-[#F2D69D]/20 font-mono text-[10px] flex items-center justify-between uppercase tracking-widest">
                  <span className="text-[#D5991C] font-bold">STAGE III // HOUSEHOLDER ISOMETRIC SHIELD</span>
                  <span className="text-[#25B888]">ACT 0{activeInterdictionAct + 1} ACTIVE</span>
                </div>
                <div
                  ref={slot2Ref}
                  className="relative h-60 w-full bg-[#130108] overflow-hidden flex items-center justify-center p-4"
                >
                  <svg
                    viewBox="0 0 420 220"
                    className={`w-full h-full transition-opacity duration-300 ${
                      canvasDockedStage === 2 && webglSupported ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                    role="img"
                    aria-label="Householder Isometric Reflection and Quarantine Dome Diagram"
                  >
                    <circle cx="210" cy="110" r="84" fill="none" stroke="#D5991C" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="4 4" />
                    <circle cx="210" cy="110" r="56" fill="rgba(37,184,136,0.12)" stroke="#25B888" strokeWidth="1.5" />
                    <line x1="90" y1="170" x2="330" y2="50" stroke="#D5991C" strokeWidth="1.5" />
                    <line x1="130" y1="50" x2="210" y2="110" stroke="#E63946" strokeWidth="1.5" strokeDasharray="3 3" />
                    <line x1="210" y1="110" x2="290" y2="170" stroke="#25B888" strokeWidth="2" />
                    <circle cx="210" cy="110" r="5" fill="#D5991C" />
                    <text x="210" y="24" textAnchor="middle" className="font-mono text-[9px] fill-[#F2D69D] font-bold">
                      HOUSEHOLDER HYPERPLANE // Q_t = I - 2u_t u_t^⊤ ∈ O(d)
                    </text>
                    <text x="210" y="206" textAnchor="middle" className="font-mono text-[9px] fill-[#25B888] font-bold">
                      45-CLOCK XILINX ULTRASCALE+ GATE // 142.0 ns WIRE-SPEED
                    </text>
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 font-mono">
            {[
              {
                act: 0 as const,
                phase: 'ACT I // INGEST & TOMOGRAPHY',
                layers: 'LAYERS 0–2 (MTVD · AM-CIDP · NCARD)',
                headline: 'Isometric Canary Rotation & Intrinsic Dimension Scan',
                formula: 'LID_k(x) = - (1/k ∑ ln(r_i / r_k))⁻¹',
                sla: '< 1.8 ms Latency',
                detail:
                  'Probes incoming RAG chunks across Dense, ColBERT, and SPLADE topologies while rotating vector coordinates via Householder reflections Q_t ∈ O(d).'
              },
              {
                act: 1 as const,
                phase: 'ACT II // CONSENSUS & MEMORY',
                layers: 'LAYERS 3–6 (TCG-CL · CEH-ASID · DMEM · SGL)',
                headline: 'C2PA Provenance Graph & Martingale Memory Shield',
                formula: 'M_t = E[Θ | F_t],   W_2(μ_t, μ_{t-1}) ≤ τ',
                sla: '< 5.1 ms Latency',
                detail:
                  'Neutralizes split-payload prompt injections, verifies X.509 C2PA hardware signatures, and rolls back poisoned agent memory states via Wasserstein-2 Merkle trees.'
              },
              {
                act: 2 as const,
                phase: 'ACT III // SILICON & ZK PROOF',
                layers: 'LAYERS 4B-HW, 7–9 (TMMEG 142ns · CM-JSAS · ZK-CAEO)',
                headline: '45-Clock SmartNIC FPGA Gate & 288-Byte zk-SNARK',
                formula: 'T_{FPGA} = 45 × 3.2ns = 142.0ns (Q8.24)',
                sla: '142.0 ns Wire-Speed',
                detail:
                  'Blocks predatory limit-order-book sweeps at PCIe Gen5 wire speed and generates a 288-byte Groth16/Plonky2 compliance proof for SEC Rule 15c3-8.'
              }
            ].map((item) => {
              const isCurrent = activeInterdictionAct === item.act;
              return (
                <button
                  key={item.phase}
                  type="button"
                  onClick={() => {
                    setActiveInterdictionAct(item.act);
                    uniformBridgeRef.current.actProgress = item.act * 0.45;
                    setCanvasDockedStage(2);
                    uniformBridgeRef.current.targetStage = 2;
                    uniformBridgeRef.current.darkTheme = 1;
                    playTactilePulse(audioPulseEnabled, 540 + item.act * 110, 30);
                  }}
                  className={`text-left p-6 border transition-colors cursor-pointer flex flex-col justify-between ${
                    isCurrent
                      ? 'bg-[#410217] border-[#D5991C] text-[#FBF3E2]'
                      : 'bg-[#1A0109] border-[#F2D69D]/20 text-[#FBF3E2]/75 hover:border-[#F2D69D]/50'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-[10px] mb-2">
                      <span className="text-[#D5991C] font-bold tracking-widest uppercase">
                        {item.phase}
                      </span>
                      <span className="px-2 py-0.5 bg-[#15684E]/30 border border-[#25B888]/40 text-[#25B888] font-bold">
                        {item.sla}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#F2D69D]/70 mb-3">{item.layers}</div>
                    <h3 className="font-serif text-xl text-[#FBF3E2] mb-2 font-sans font-semibold">
                      {item.headline}
                    </h3>
                    <p className="font-sans text-xs text-[#FBF3E2]/80 leading-relaxed mb-4">
                      {item.detail}
                    </p>
                  </div>
                  <div className="pt-3 border-t border-[#F2D69D]/15 text-[11px] text-[#D5991C] font-bold">
                    {item.formula}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="bg-[#1A0109] border border-[#F2D69D]/25 overflow-hidden">
            <div className="px-6 py-4 bg-[#310111] border-b border-[#F2D69D]/20 flex flex-wrap items-center justify-between gap-4 font-mono text-xs">
              <div className="flex items-center gap-2.5">
                <Terminal className="w-4 h-4 text-[#D5991C]" />
                <span className="font-bold tracking-wider uppercase text-[#FBF3E2]">
                  SOVEREIGN 10-LAYER DEFENSE MATRIX // ARCHITECTURAL LEDGER
                </span>
              </div>
              <div className="flex items-center gap-4 text-[11px]">
                <span className="text-[#25B888] font-bold">● ALL 10 LAYERS VERIFIED</span>
                <button
                  type="button"
                  onClick={() => triggerNavigate('research')}
                  className="px-3 py-1 bg-[#D5991C] text-[#130108] font-bold uppercase tracking-wider hover:bg-[#F2D69D] transition-colors cursor-pointer"
                >
                  Open Full Research Matrix →
                </button>
              </div>
            </div>

            <div className="divide-y divide-[#F2D69D]/15 font-mono text-xs">
              {TEN_LAYER_STACK.map((row) => {
                const isActHighlighted = row.act === activeInterdictionAct;
                return (
                  <div
                    key={row.id}
                    className={`grid grid-cols-1 lg:grid-cols-12 gap-3 px-6 py-4 items-center transition-colors ${
                      isActHighlighted ? 'bg-[#410217]/65' : 'hover:bg-[#310111]/60'
                    }`}
                  >
                    <div className="lg:col-span-2 flex items-center gap-2.5">
                      <span className="px-2 py-0.5 bg-[#D5991C]/15 border border-[#D5991C]/40 text-[#D5991C] text-[10px] font-bold">
                        {row.layer}
                      </span>
                      <span className="font-bold text-[#FBF3E2]">{row.code}</span>
                    </div>

                    <div className="lg:col-span-4 font-sans text-xs text-[#FBF3E2]/85">
                      {row.threatVector}
                    </div>

                    <div className="lg:col-span-4 text-[11px] text-[#F2D69D]">
                      {row.mathematicalCore}
                    </div>

                    <div className="lg:col-span-2 flex items-center justify-between lg:justify-end gap-3">
                      <span className="text-[11px] font-bold text-[#25B888] tabular-nums">
                        {row.latency}
                      </span>
                      <button
                        type="button"
                        onClick={() => triggerNavigate(row.volPage, 'lab')}
                        className="px-2.5 py-1 border border-[#F2D69D]/30 hover:border-[#D5991C] text-[#FBF3E2] hover:text-[#D5991C] text-[10px] uppercase tracking-wider transition-colors cursor-pointer"
                      >
                        {row.volLabel} Lab ↗
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#F2D69D]/70 mb-4">
              OPERATIONAL EXECUTION CADENCE // FIVE-STAGE LIFECYCLE SLA (&lt; 15s AUTO-REMEDIATION)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 border-t border-l border-[#F2D69D]/20">
              {PROCESS_STEPS.map((step) => (
                <div
                  key={step.step}
                  className="p-5 bg-[#1A0109]/90 border-r border-b border-[#F2D69D]/20 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] text-[#D5991C] mb-2">
                      <span className="font-bold">STAGE {step.step}</span>
                      <span>{step.phase}</span>
                    </div>
                    <h4 className="font-serif text-lg text-[#FBF3E2] mb-2">{step.title}</h4>
                    <p className="text-xs text-[#FBF3E2]/75 leading-relaxed font-sans">
                      {step.description}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 border-t border-[#F2D69D]/10 font-mono text-[10px] text-[#25B888]">
                    STATUS // AUTOMATED
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          § 03 — DUAL-USE SOVEREIGN OPERATIONS (INTERACTIVE COMMAND LEDGER + SLOT 3)
          ===================================================================== */}
      <section
        id="services"
        aria-labelledby="services-heading"
        className="relative z-20 py-20 md:py-28 border-b border-[#410217]/20 bg-[#FAF5EB]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div data-rule-draw className="rule-draw h-px w-full bg-[#410217]/25" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-4 space-y-2">
              <span className="font-mono text-xs text-[#8B5A0B] font-bold uppercase tracking-[0.2em] block">
                § 03 // DUAL-USE SOVEREIGN ARCHITECTURE
              </span>
              <span
                data-parallax-numeral
                className="font-display text-5xl text-outline block select-none"
                aria-hidden="true"
              >
                03
              </span>
            </div>
            <div className="lg:col-span-8 space-y-4">
              <h2
                id="services-heading"
                className="font-display text-[clamp(2.2rem,4.3vw,3.9rem)] leading-[1.12] text-[#410217]"
              >
                Counter-AEO defensive cybersecurity &amp;{' '}
                <em className="text-[#8B5A0B] font-normal">offensive operations.</em>
              </h2>
              <p className="text-base sm:text-lg text-[#5A1827] max-w-3xl leading-relaxed">
                Engineered for national security agencies, defense contractors, Fortune 500 enterprises, and institutional broker-dealers operating across contested generative information theaters.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 border border-[#410217]/25 bg-[#FAF2E1]">
            <div className="lg:col-span-5 flex flex-col justify-between divide-y divide-[#410217]/20 border-b lg:border-b-0 lg:border-r border-[#410217]/25">
              <div className="divide-y divide-[#410217]/20">
                {SERVICES.map((service, idx) => {
                  const isSelected = service.id === activeService.id;
                  return (
                    <button
                      key={service.id}
                      type="button"
                      onClick={() => {
                        setSelectedServiceId(service.id);
                        setCanvasDockedStage(3);
                        uniformBridgeRef.current.targetStage = 3;
                        uniformBridgeRef.current.darkTheme = 0;
                        playTactilePulse(audioPulseEnabled, 500 + idx * 90, 28);
                      }}
                      className={`w-full text-left p-6 sm:p-7 transition-colors cursor-pointer block ${
                        isSelected
                          ? 'bg-[#410217] text-[#FBF3E2]'
                          : 'bg-[#FAF2E1] hover:bg-[#FAF5EB] text-[#410217]'
                      }`}
                    >
                      <div className="flex items-center justify-between font-mono text-[10px] mb-2.5">
                        <span className={isSelected ? 'text-[#D5991C] font-bold' : 'text-[#8B5A0B] font-bold'}>
                          DIVISION 0{idx + 1} // {service.badge}
                        </span>
                        <span
                          className={`px-2 py-0.5 border ${
                            isSelected
                              ? 'border-[#D5991C] text-[#D5991C]'
                              : 'border-[#410217]/25 text-[#5A1827]'
                          }`}
                        >
                          {isSelected ? 'ACTIVE DOSSIER' : 'INSPECT'}
                        </span>
                      </div>
                      <h3 className="font-serif text-2xl tracking-tight mb-1">
                        {service.title}
                      </h3>
                      <p
                        className={`font-mono text-[11px] uppercase tracking-wider ${
                          isSelected ? 'text-[#F2D69D]/85' : 'text-[#6E3340]'
                        }`}
                      >
                        {service.subtitle}
                      </p>
                    </button>
                  );
                })}
              </div>

              {/* SLOT 3: 142.0ns Limit Order Book Wavefront Viewport */}
              <div className="bg-[#FAF5EB]">
                <div className="px-4 py-2 bg-[#410217] text-[#FBF3E2] font-mono text-[10px] flex items-center justify-between uppercase tracking-widest">
                  <span>STAGE IV // 142ns LOB DEPTH CANYON (TMMEG)</span>
                  <span className="text-[#D5991C] font-bold">Q8.24 PIPELINE</span>
                </div>
                <div
                  ref={slot3Ref}
                  className="relative h-48 w-full bg-[#FAF5EB] overflow-hidden flex items-center justify-center p-3"
                >
                  <svg
                    viewBox="0 0 420 180"
                    className={`w-full h-full transition-opacity duration-300 ${
                      canvasDockedStage === 3 && webglSupported ? 'opacity-0 pointer-events-none' : 'opacity-100'
                    }`}
                    role="img"
                    aria-label="142-Nanosecond Limit Order Book Bid/Ask Liquidity Canyon Diagram"
                  >
                    <path
                      d="M 24 40 L 110 40 L 110 75 L 155 75 L 155 115 L 195 115 L 195 150 L 24 150 Z"
                      fill="rgba(21,104,78,0.16)"
                      stroke="#15684E"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 396 35 L 310 35 L 310 70 L 265 70 L 265 110 L 225 110 L 225 150 L 396 150 Z"
                      fill="rgba(139,30,30,0.16)"
                      stroke="#8B1E1E"
                      strokeWidth="1.5"
                    />
                    <line x1="210" y1="20" x2="210" y2="158" stroke="#D5991C" strokeWidth="2" strokeDasharray="4 3" />
                    <text x="90" y="30" textAnchor="middle" className="font-mono text-[9px] fill-[#15684E] font-bold">
                      BID LIQUIDITY WALL
                    </text>
                    <text x="330" y="26" textAnchor="middle" className="font-mono text-[9px] fill-[#8B1E1E] font-bold">
                      PREDATORY ASK SWEEP
                    </text>
                    <text x="210" y="170" textAnchor="middle" className="font-mono text-[9px] fill-[#410217] font-bold">
                      TMMEG 142.0 ns FPGA CIRCUIT BREAKER // VPIN_t &lt; Θ
                    </text>
                  </svg>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 p-7 sm:p-10 bg-[#FAF5EB] flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#410217]/15 font-mono text-xs">
                  <span className="text-[#8B5A0B] font-bold uppercase tracking-widest">
                    OPERATIONAL SPECIFICATION // {activeService.badge}
                  </span>
                  <span className="text-[#15684E] font-bold">TLP:CLEAR // DEPLOYABLE</span>
                </div>

                <div>
                  <h3 className="font-serif text-3xl text-[#410217] mb-3">
                    {activeService.title}
                  </h3>
                  <p className="text-[#410217]/85 text-base leading-relaxed">
                    {activeService.description}
                  </p>
                </div>

                <div className="space-y-3 pt-2">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-[#6E3340] font-bold">
                    AUTHORIZED CAPABILITIES &amp; DELIVERABLES:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {activeService.capabilities.map((cap) => (
                      <div
                        key={cap}
                        className="p-3.5 bg-[#FAF2E1] border border-[#410217]/15 flex items-start gap-2.5 text-xs text-[#410217]"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#15684E] shrink-0 mt-0.5" />
                        <span className="leading-snug">{cap}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-4 pt-6 border-t border-[#410217]/15">
                <div className="bg-[#26010D] text-[#FBF3E2] p-4 font-mono text-xs border border-[#410217]">
                  <div className="text-[10px] text-[#D5991C] font-bold uppercase tracking-widest mb-1">
                    FIELD TELEMETRY TRACE:
                  </div>
                  <div className="text-[#FBF3E2]/90 leading-relaxed">{activeService.sampleLog}</div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => triggerNavigate('services')}
                    className="inline-flex items-center gap-3 px-5 py-3 bg-[#410217] hover:bg-[#26010D] text-[#FBF3E2] font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-[#D5991C]" />
                    <span>Open Volume IV Services Architecture</span>
                    <ArrowUpRight className="w-3.5 h-3.5 text-[#D5991C]" />
                  </button>

                  <button
                    type="button"
                    onClick={triggerAudit}
                    className="link-underline font-mono text-xs font-bold uppercase tracking-wider text-[#410217] cursor-pointer"
                  >
                    Schedule Division Briefing →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================================
          § 04 — THE COUNTER-AEO TETRALOGY (ALL 4 PEER-REVIEWED VOLUMES & 3D LABS)
          ===================================================================== */}
      <section
        id="research"
        aria-labelledby="research-heading"
        className="relative z-20 py-20 md:py-28 border-b border-[#410217]/20 bg-[#FAF2E1]/50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div data-rule-draw className="rule-draw h-px w-full bg-[#410217]/25" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-4 space-y-2">
              <span className="font-mono text-xs text-[#8B5A0B] font-bold uppercase tracking-[0.2em] block">
                § 04 // PEER-REVIEWED ARCHIVAL CORPUS
              </span>
              <div className="font-mono text-[11px] text-[#5A1827]">
                DOI: 10.1145/3637528.3671900-CAEO · 180 PAGES
              </div>
            </div>

            <div className="lg:col-span-8 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <h2
                  id="research-heading"
                  className="font-display text-[clamp(2.2rem,4.3vw,3.9rem)] leading-[1.12] text-[#410217]"
                >
                  The Counter-AEO <em className="text-[#8B5A0B] font-normal">Tetralogy.</em>
                </h2>
                <p className="mt-3 text-base text-[#5A1827] max-w-2xl leading-relaxed">
                  Four peer-reviewed volumes codifying the mathematical proofs, threat taxonomies, empirical ROC benchmarks, and 142ns FPGA silicon architectures of sovereign AI defense.
                </p>
              </div>

              <button
                type="button"
                onClick={() => triggerNavigate('research')}
                className="shrink-0 inline-flex items-center gap-2 px-5 py-3.5 bg-[#410217] hover:bg-[#26010D] text-[#FBF3E2] font-mono text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#D5991C]" />
                <span>Enter Research Portal</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-[#D5991C]" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-l border-[#410217]/25">
            {TETRALOGY_VOLUMES.map((vol) => (
              <article
                key={vol.id}
                className="bg-[#FAF5EB] hover:bg-[#FAF2E1] border-r border-b border-[#410217]/25 p-7 sm:p-9 flex flex-col justify-between transition-colors group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-4 border-b border-[#410217]/15 font-mono text-xs">
                    <div className="flex items-center gap-2.5">
                      <span className={`px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${vol.badgeBg}`}>
                        {vol.volumeNumber}
                      </span>
                      <span className="text-[11px] font-bold text-[#5A1827]">{vol.code}</span>
                    </div>
                    <span className="font-display text-3xl text-[#410217]/25 group-hover:text-[#8B5A0B] transition-colors">
                      {vol.roman}
                    </span>
                  </div>

                  <div className="font-mono text-[11px] text-[#8B5A0B] font-bold uppercase tracking-wider">
                    {vol.subtitle}
                  </div>

                  <h3 className="font-serif text-2xl text-[#410217] leading-snug">
                    {vol.title}
                  </h3>

                  <p className="text-sm text-[#5A1827] leading-relaxed">
                    {vol.summary}
                  </p>

                  <div className="bg-[#FAF2E1] border border-[#410217]/20 p-3.5 font-mono">
                    <div className="flex items-center justify-between text-[9px] text-[#6E3340] uppercase tracking-wider mb-1">
                      <span>{vol.equationLabel}</span>
                      <span className="text-[#15684E] font-bold">{vol.keyMetric}</span>
                    </div>
                    <div className="text-xs font-bold text-[#410217] overflow-x-auto">
                      {vol.equation}
                    </div>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-[#410217]/15 flex flex-wrap items-center justify-between gap-3 font-mono text-xs">
                  <button
                    type="button"
                    onClick={() => triggerNavigate(vol.targetPage, 'paper')}
                    className="inline-flex items-center gap-1.5 py-2 px-3.5 bg-[#410217] hover:bg-[#26010D] text-[#FBF3E2] font-bold uppercase tracking-wider text-[11px] transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#D5991C]" />
                    <span>Read Whitepaper</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => triggerNavigate(vol.targetPage, 'lab')}
                    className="inline-flex items-center gap-1.5 py-2 px-3.5 bg-[#FAF2E1] hover:bg-[#D5991C] text-[#410217] border border-[#410217]/30 font-bold uppercase tracking-wider text-[11px] transition-colors cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#8B5A0B]" />
                    <span>Launch 3D WebGL Lab ↗</span>
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================================
          § 05 — MULTI-VECTOR THREAT MATRIX & VERIFIED FIELD DOSSIERS
          ===================================================================== */}
      <section
        id="capabilities"
        aria-labelledby="capabilities-heading"
        className="relative z-20 py-20 md:py-28 bg-[#FAF5EB]"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div data-rule-draw className="rule-draw h-px w-full bg-[#410217]/25" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-5 space-y-2">
              <span className="font-mono text-xs text-[#8B5A0B] font-bold uppercase tracking-[0.2em] block">
                § 05 // MULTI-VECTOR CAPABILITIES &amp; FIELD PROOF
              </span>
              <h2
                id="capabilities-heading"
                className="font-display text-[clamp(2.1rem,4vw,3.6rem)] leading-[1.12] text-[#410217]"
              >
                Verified field interdictions &amp;{' '}
                <em className="text-[#8B5A0B] font-normal">threat specifications.</em>
              </h2>
            </div>

            <div className="lg:col-span-7 flex flex-wrap items-center lg:justify-end gap-2 font-mono text-xs">
              {['ALL', 'Defensive Cyber', 'Offensive Operations', 'Market Arbitrage', 'Autonomous Swarms'].map(
                (cat) => {
                  const active = selectedCapabilityCategory === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCapabilityCategory(cat);
                        playTactilePulse(audioPulseEnabled, 580, 20);
                      }}
                      className={`px-3.5 py-2 border uppercase tracking-wider font-bold text-[11px] transition-colors cursor-pointer ${
                        active
                          ? 'bg-[#410217] text-[#FBF3E2] border-[#410217]'
                          : 'bg-[#FAF2E1] text-[#410217] border-[#410217]/20 hover:border-[#410217]'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                }
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-[#410217]/20">
            {filteredCapabilities.map((cap, i) => (
              <article
                key={cap.id}
                className="bg-[#FAF2E1]/70 border-r border-b border-[#410217]/20 p-7 flex flex-col justify-between space-y-5"
              >
                <div>
                  <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#410217]/15 font-mono text-[10px]">
                    <span className="font-bold text-[#8B5A0B]">SPEC // OPS-0{i + 1}</span>
                    <span className="px-2 py-0.5 bg-[#FAF5EB] border border-[#410217]/20 text-[#410217] font-bold uppercase">
                      {cap.category}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl text-[#410217] mb-2 leading-snug">
                    {cap.title}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#5A1827] leading-relaxed">
                    {cap.description}
                  </p>
                </div>

                <div className="p-3.5 bg-[#FAF5EB] border border-[#410217]/15 font-mono text-[11px] space-y-1">
                  <div className="flex items-center justify-between text-[9px] text-[#8B5A0B] font-bold uppercase">
                    <span>TECHNICAL IMPACT INVARIANT</span>
                    <span className="text-[#15684E]">ACTIVE RULE</span>
                  </div>
                  <p className="font-sans text-xs text-[#410217]/85 leading-relaxed">
                    {cap.technicalImpact}
                  </p>
                </div>
              </article>
            ))}
          </div>

          {/* Verified Field Case Studies + Interactive Actuarial VaR Exposure Calculator */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
            <div className="lg:col-span-7 bg-[#FAF2E1] border border-[#410217]/25 p-7 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-[#410217]/15 font-mono text-xs">
                  <span className="font-bold text-[#8B5A0B] uppercase tracking-widest">
                    VERIFIED FIELD INTERDICTION DOSSIERS
                  </span>
                  <div className="flex items-center gap-1.5">
                    {CASE_STUDIES.map((cs, idx) => (
                      <button
                        key={cs.id}
                        type="button"
                        onClick={() => setSelectedCaseIndex(idx)}
                        className={`px-2.5 py-1 text-[10px] font-bold uppercase border cursor-pointer ${
                          selectedCaseIndex === idx
                            ? 'bg-[#410217] text-[#FBF3E2] border-[#410217]'
                            : 'bg-[#FAF5EB] text-[#410217] border-[#410217]/20'
                        }`}
                      >
                        CASE 0{idx + 1}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="font-mono text-[11px] text-[#6E3340] uppercase font-bold">
                  {activeCase.clientCategory} · {activeCase.timeframe}
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl text-[#410217] leading-tight">
                  {activeCase.headline}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 text-xs sm:text-[13px] leading-relaxed">
                  <div className="p-4 bg-[#FAF5EB] border border-[#410217]/15">
                    <strong className="font-mono text-[10px] text-[#8B1E1E] uppercase tracking-wider block mb-1">
                      ADVERSARIAL VECTOR:
                    </strong>
                    <p className="text-[#410217]/85">{activeCase.challenge}</p>
                  </div>
                  <div className="p-4 bg-[#FAF5EB] border border-[#410217]/15">
                    <strong className="font-mono text-[10px] text-[#15684E] uppercase tracking-wider block mb-1">
                      COUNTER-AEO REMEDIATION:
                    </strong>
                    <p className="text-[#410217]/85">{activeCase.solution}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-[#410217]/15">
                {activeCase.metrics.map((m) => (
                  <div key={m.label} className="bg-[#FAF5EB] p-3.5 border border-[#410217]/15">
                    <div className="font-display text-2xl sm:text-3xl text-[#410217] tabular-nums">
                      {m.value}
                    </div>
                    <div className="font-mono text-[10px] text-[#8B5A0B] font-bold uppercase mt-1">
                      {m.label}
                    </div>
                    <div className="text-[11px] text-[#5A1827] mt-0.5 leading-tight">{m.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-5 bg-[#410217] text-[#FBF3E2] border border-[#410217] p-7 sm:p-8 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]/20 font-mono text-[10px] text-[#D5991C] uppercase tracking-widest font-bold">
                  <span>LAYER 9-SE // ACTUARIAL VaR TELEMETRY</span>
                  <span>SEC RULE 15c3-8</span>
                </div>

                <h3 className="font-serif text-2xl text-[#FBF3E2]">
                  Institutional AEO Exposure &amp; Liquidity VaR Calculator
                </h3>

                <div className="space-y-4 pt-2 font-mono text-xs">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="calc-query-vol"
                      className="flex justify-between text-[11px] text-[#F2D69D]"
                    >
                      <span>MONTHLY AI / RAG QUERY FOOTPRINT:</span>
                      <strong className="tabular-nums">{monthlyQueryVolume.toLocaleString()} / mo</strong>
                    </label>
                    <input
                      id="calc-query-vol"
                      type="range"
                      min="50000"
                      max="2000000"
                      step="50000"
                      value={monthlyQueryVolume}
                      onChange={(e) => setMonthlyQueryVolume(Number(e.target.value))}
                      className="w-full accent-[#D5991C] cursor-pointer h-2 bg-[#26010D]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="calc-order-book"
                      className="flex justify-between text-[11px] text-[#F2D69D]"
                    >
                      <span>DAILY ALGORITHMIC ORDER-BOOK DEPTH:</span>
                      <strong className="tabular-nums">${institutionalOrderBookM}M USD</strong>
                    </label>
                    <input
                      id="calc-order-book"
                      type="range"
                      min="10"
                      max="500"
                      step="10"
                      value={institutionalOrderBookM}
                      onChange={(e) => setInstitutionalOrderBookM(Number(e.target.value))}
                      className="w-full accent-[#D5991C] cursor-pointer h-2 bg-[#26010D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-3 font-mono">
                  <div className="p-3.5 bg-[#26010D] border border-[#F2D69D]/20">
                    <span className="text-[10px] text-[#F2D69D]/70 block uppercase">
                      UNMITIGATED SWEEP VaR
                    </span>
                    <span className="font-display text-2xl text-[#D5991C] tabular-nums">
                      ${orderBookSweepRiskM}M
                    </span>
                    <span className="block text-[10px] text-[#FBF3E2]/60 mt-1">
                      {unmitigatedPoisonedCitations.toLocaleString()} distorted answers/mo
                    </span>
                  </div>

                  <div className="p-3.5 bg-[#26010D] border border-[#25B888]/40">
                    <span className="text-[10px] text-[#25B888] block uppercase font-bold">
                      WITH 142ns TMMEG GATE
                    </span>
                    <span className="font-display text-2xl text-[#25B888] tabular-nums">
                      ${protectedResidualRiskM}M
                    </span>
                    <span className="block text-[10px] text-[#FBF3E2]/70 mt-1">
                      98.2% tail-risk suppression
                    </span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={triggerAudit}
                className="w-full py-4 px-5 bg-[#D5991C] hover:bg-[#F2D69D] text-[#130108] font-mono text-xs font-bold uppercase tracking-widest flex items-center justify-between transition-colors cursor-pointer"
              >
                <span>Commission Custom VaR &amp; RAG Audit</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomeRedesign;
