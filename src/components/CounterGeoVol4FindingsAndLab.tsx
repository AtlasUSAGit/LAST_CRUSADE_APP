import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  Shield,
  Zap,
  RotateCcw,
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
  Terminal,
  Activity,
  FileText,
  Eye,
  Radio,
  Sparkles,
  Compass,
  Crosshair,
  Gauge,
  BookOpen,
  Info,
  Sliders,
  DollarSign,
  Briefcase,
  Layers,
  Server
} from 'lucide-react';
import {
  FPGASmartNICSimulator,
  FPGATickResult,
  CounterGEOCommercialEngine,
  ClientROIProfile
} from '../utils/counterGeoVol4Algorithms';
import { MASTER_DOC_VOL4_METADATA } from '../data/counterGeoVol4Content';

interface Vol4FindingsAndLabProps {
  onSwitchToPaper: () => void;
  onNavigateToOverview: () => void;
}

export const CounterGeoVol4FindingsAndLab: React.FC<Vol4FindingsAndLabProps> = ({
  onSwitchToPaper,
  onNavigateToOverview
}) => {
  const [activeTab, setActiveTab] = useState<'fpga' | 'roi' | 'procurement' | 'webgl'>('fpga');

  // -------------------------------------------------------------
  // Tab 1: FPGA SmartNIC Interactive Simulator State
  // -------------------------------------------------------------
  const [ragSignal, setRagSignal] = useState(0.85); // Bullish buy conviction
  const [priorSignal, setPriorSignal] = useState(0.05); // Neutral prior
  const [deltaIRag, setDeltaIRag] = useState(1.45); // High KL surprise
  const [c2paSigned, setC2paSigned] = useState(false);
  const [weightedBidDepth, setWeightedBidDepth] = useState(5.0); // $5M
  const [weightedAskDepth, setWeightedAskDepth] = useState(48.0); // $48M (Huge predatory wall)
  const [eCapitalScore, setECapitalScore] = useState(0.15); // Sparse LOB energy
  const [preNewsWallRatio, setPreNewsWallRatio] = useState(0.92); // 92% rested prior to news
  const [derivDivergence, setDerivDivergence] = useState(0.88);

  const fpgaResult: FPGATickResult = FPGASmartNICSimulator.evaluateOrder({
    orderId: 'ORD-SEC-09281-HFT',
    ragSignal,
    priorSignal,
    deltaIRag,
    c2paSigned,
    weightedBidDepth,
    weightedAskDepth,
    eCapitalScore,
    preNewsWallRatio,
    derivDivergence
  });

  const handleApplyPreset = (preset: 'trap' | 'clean' | 'void') => {
    if (preset === 'trap') {
      // $DFNS Predatory Ask-Wall Trap
      setRagSignal(0.90);
      setPriorSignal(0.02);
      setDeltaIRag(1.80);
      setC2paSigned(false);
      setWeightedBidDepth(4.5);
      setWeightedAskDepth(52.0);
      setECapitalScore(0.12);
      setPreNewsWallRatio(0.95);
      setDerivDivergence(0.91);
    } else if (preset === 'clean') {
      // Clean C2PA Verified Regulatory Filing
      setRagSignal(0.75);
      setPriorSignal(0.10);
      setDeltaIRag(0.40);
      setC2paSigned(true);
      setWeightedBidDepth(25.0);
      setWeightedAskDepth(22.0);
      setECapitalScore(0.85);
      setPreNewsWallRatio(0.20);
      setDerivDivergence(0.15);
    } else {
      // Unanchored Data-Void Flash Pump
      setRagSignal(0.80);
      setPriorSignal(0.00);
      setDeltaIRag(1.35);
      setC2paSigned(false);
      setWeightedBidDepth(10.0);
      setWeightedAskDepth(12.0);
      setECapitalScore(0.08);
      setPreNewsWallRatio(0.30);
      setDerivDivergence(0.40);
    }
  };

  // -------------------------------------------------------------
  // Tab 2: Enterprise ROI Engine State
  // -------------------------------------------------------------
  const [fundAum, setFundAum] = useState(15.0); // $15B
  const [dailyNotional, setDailyNotional] = useState(250.0); // $250M
  const [venues, setVenues] = useState(4);
  const [retailAccounts, setRetailAccounts] = useState(12.0); // 12M accounts
  const [agencyBureaus, setAgencyBureaus] = useState(2);
  const [agencyTradeVol, setAgencyTradeVol] = useState(18.5); // $18.5B

  const quantRoi: ClientROIProfile = CounterGEOCommercialEngine.evaluateQuantHedgeFund(
    'Apex Quant Fund',
    fundAum * 1e9,
    dailyNotional * 1e6,
    venues
  );

  const brokerRoi: ClientROIProfile = CounterGEOCommercialEngine.evaluatePublicBrokerDealer(
    'National Retail Broker',
    retailAccounts * 1e6
  );

  const agencyRoi: ClientROIProfile = CounterGEOCommercialEngine.evaluateFederalAgencyEnclave(
    'U.S. Dept of Commerce / USITC',
    agencyBureaus,
    agencyTradeVol * 1e9
  );

  // -------------------------------------------------------------
  // Tab 4: WebGL 3D Hardware Enclave Canvas
  // -------------------------------------------------------------
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeTab !== 'webgl' || !mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight || 480;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#130108');

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(4, 3, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 1.0;

    // Ambient and directional lighting
    const ambLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambLight);

    const dirLight = new THREE.DirectionalLight(0xd5991c, 1.5);
    dirLight.position.set(5, 8, 5);
    scene.add(dirLight);

    // 1U Rack Chassis
    const chassisGeo = new THREE.BoxGeometry(3.6, 0.6, 2.4);
    const chassisMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      metalness: 0.8,
      roughness: 0.2
    });
    const chassis = new THREE.Mesh(chassisGeo, chassisMat);
    scene.add(chassis);

    // Front Faceplate
    const faceplateGeo = new THREE.BoxGeometry(3.62, 0.58, 0.05);
    const faceplateMat = new THREE.MeshStandardMaterial({
      color: 0x410217,
      metalness: 0.5,
      roughness: 0.3
    });
    const faceplate = new THREE.Mesh(faceplateGeo, faceplateMat);
    faceplate.position.set(0, 0, 1.21);
    scene.add(faceplate);

    // Optical SFP+ Ports
    for (let i = 0; i < 4; i++) {
      const portGeo = new THREE.BoxGeometry(0.22, 0.15, 0.1);
      const portMat = new THREE.MeshStandardMaterial({ color: 0xd5991c, metalness: 0.9 });
      const port = new THREE.Mesh(portGeo, portMat);
      port.position.set(-1.2 + i * 0.35, 0, 1.25);
      scene.add(port);
    }

    // LED Status Array
    const leds: THREE.Mesh[] = [];
    for (let i = 0; i < 8; i++) {
      const ledGeo = new THREE.SphereGeometry(0.04, 16, 16);
      const ledMat = new THREE.MeshBasicMaterial({ color: i % 2 === 0 ? 0x00a878 : 0xd5991c });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(0.4 + i * 0.12, 0.08, 1.25);
      leds.push(led);
      scene.add(led);
    }

    // Server rack rails
    const gridHelper = new THREE.GridHelper(8, 20, 0xd5991c, 0x333333);
    gridHelper.position.y = -1.2;
    scene.add(gridHelper);

    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();
      controls.update();

      // Pulse LEDs
      leds.forEach((led, idx) => {
        const mat = led.material as THREE.MeshBasicMaterial;
        mat.color.setHex(Math.sin(t * 8 + idx) > 0 ? 0x00a878 : 0x410217);
      });

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight || 480;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#FBF3E2] text-[#410217]">
      
      {/* Top Banner & Tab Navigation Switcher */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        {/* Header Overview Card */}
        <div className="bg-[#FAF2E1] border-2 border-[#D5991C] p-6 sm:p-8 shadow-sm relative overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-[#F2D69D] font-mono text-xs">
            <div className="flex items-center space-x-2">
              <span className="px-2 py-0.5 bg-[#410217] text-[#FBF3E2] font-bold uppercase tracking-wider text-[10px]">
                PAGE 2 // INTERACTIVE HARDWARE &amp; COMMERCIAL LAB
              </span>
              <span className="text-[#410217] font-bold">VOLUME IV ENGINE</span>
            </div>
            <button
              onClick={onSwitchToPaper}
              className="flex items-center space-x-1.5 text-xs font-mono font-bold text-[#410217] hover:text-[#D5991C] underline cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>← Switch to Page 1: Full Whitepaper (Word-for-Word)</span>
            </button>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#410217] tracking-tight mb-2">
            Volume 4: Commercialization &amp; FPGA Hardware Lab
          </h1>
          <p className="text-sm sm:text-base text-[#410217]/85 font-sans max-w-4xl leading-relaxed">
            Test the deterministic <strong>142-nanosecond FPGA SmartNIC order kill-switch</strong>, calculate customer <strong>Value-at-Risk (VaR) reduction</strong> across SKUs 1 through 3, and explore the <strong>SBIR Phase III sole-source federal acquisition roadmap</strong>.
          </p>

          {/* Tab Buttons */}
          <div className="flex flex-wrap items-center gap-2 pt-6 font-mono text-xs">
            <button
              onClick={() => setActiveTab('fpga')}
              className={`px-4 py-2 font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'fpga'
                  ? 'bg-[#410217] text-[#FBF3E2] shadow-xs'
                  : 'bg-[#FFFDF8] text-[#410217] border border-[#F2D69D] hover:bg-[#F2D69D]/40'
              }`}
            >
              <Cpu className="w-3.5 h-3.5 text-[#D5991C]" />
              <span>1. 142ns FPGA Kill-Switch</span>
            </button>

            <button
              onClick={() => setActiveTab('roi')}
              className={`px-4 py-2 font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'roi'
                  ? 'bg-[#004566] text-[#FBF3E2] shadow-xs'
                  : 'bg-[#FFFDF8] text-[#410217] border border-[#F2D69D] hover:bg-[#F2D69D]/40'
              }`}
            >
              <DollarSign className="w-3.5 h-3.5 text-[#00A878]" />
              <span>2. Enterprise ROI Engine</span>
            </button>

            <button
              onClick={() => setActiveTab('procurement')}
              className={`px-4 py-2 font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'procurement'
                  ? 'bg-[#410217] text-[#FBF3E2] shadow-xs'
                  : 'bg-[#FFFDF8] text-[#410217] border border-[#F2D69D] hover:bg-[#F2D69D]/40'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-[#D5991C]" />
              <span>3. Sovereign Contracting &amp; IP</span>
            </button>

            <button
              onClick={() => setActiveTab('webgl')}
              className={`px-4 py-2 font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center space-x-1.5 ${
                activeTab === 'webgl'
                  ? 'bg-[#1A050D] text-[#D5991C] border border-[#D5991C]'
                  : 'bg-[#FFFDF8] text-[#410217] border border-[#F2D69D] hover:bg-[#F2D69D]/40'
              }`}
            >
              <Server className="w-3.5 h-3.5" />
              <span>4. 3D Hardware Enclave (WebGL)</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* TAB 1: 142ns FPGA SmartNIC Order Kill-Switch */}
        {/* ============================================================== */}
        {activeTab === 'fpga' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Controls */}
            <div className="lg:col-span-5 bg-[#FAF2E1] border border-[#F2D69D] p-6 space-y-5 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                <span className="font-bold uppercase text-[#410217]">LOB &amp; RAG Order Parameters</span>
                <span className="text-[10px] text-[#00A878] font-bold">Clock: 312.5 MHz</span>
              </div>

              {/* Presets */}
              <div className="space-y-1.5">
                <span className="text-[10px] text-[#410217]/60 uppercase tracking-wider block">Live Attack Presets:</span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleApplyPreset('trap')}
                    className="p-1.5 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] text-[10px] font-bold uppercase transition-colors cursor-pointer text-center"
                  >
                    Ask-Wall Trap
                  </button>
                  <button
                    onClick={() => handleApplyPreset('clean')}
                    className="p-1.5 bg-[#00A878] hover:bg-[#008f66] text-[#FBF3E2] text-[10px] font-bold uppercase transition-colors cursor-pointer text-center"
                  >
                    Clean 8-K
                  </button>
                  <button
                    onClick={() => handleApplyPreset('void')}
                    className="p-1.5 bg-[#D5991C] hover:bg-[#c48912] text-[#130108] text-[10px] font-bold uppercase transition-colors cursor-pointer text-center"
                  >
                    Data Void
                  </button>
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>LLM RAG Signal Conviction:</span>
                    <strong className={ragSignal > 0 ? 'text-[#00A878]' : 'text-[#991B1B]'}>{ragSignal.toFixed(2)}</strong>
                  </div>
                  <input
                    type="range"
                    min="-1.0"
                    max="1.0"
                    step="0.05"
                    value={ragSignal}
                    onChange={(e) => setRagSignal(parseFloat(e.target.value))}
                    className="w-full accent-[#410217]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>KL Surprise (Delta I):</span>
                    <strong className="text-[#D5991C]">{deltaIRag.toFixed(2)} nats</strong>
                  </div>
                  <input
                    type="range"
                    min="0.0"
                    max="2.5"
                    step="0.05"
                    value={deltaIRag}
                    onChange={(e) => setDeltaIRag(parseFloat(e.target.value))}
                    className="w-full accent-[#D5991C]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Resting Ask Depth:</span>
                    <strong className="text-[#991B1B]">${weightedAskDepth.toFixed(1)}M</strong>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="80.0"
                    step="1.0"
                    value={weightedAskDepth}
                    onChange={(e) => setWeightedAskDepth(parseFloat(e.target.value))}
                    className="w-full accent-[#410217]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Resting Bid Depth:</span>
                    <strong className="text-[#00A878]">${weightedBidDepth.toFixed(1)}M</strong>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="80.0"
                    step="1.0"
                    value={weightedBidDepth}
                    onChange={(e) => setWeightedBidDepth(parseFloat(e.target.value))}
                    className="w-full accent-[#00A878]"
                  />
                </div>

                <div className="flex items-center justify-between p-2.5 bg-[#FFFDF8] border border-[#F2D69D]">
                  <span className="text-[11px]">C2PA Hardware Root Signed:</span>
                  <button
                    onClick={() => setC2paSigned(!c2paSigned)}
                    className={`px-3 py-1 font-bold uppercase transition-colors cursor-pointer ${
                      c2paSigned ? 'bg-[#00A878] text-[#FBF3E2]' : 'bg-[#1A050D] text-[#FBF3E2]/60'
                    }`}
                  >
                    {c2paSigned ? 'YES (Signed)' : 'NO (Unsigned)'}
                  </button>
                </div>
              </div>
            </div>

            {/* Right Telemetry & Wire Decision */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Wire-Speed Decision Banner */}
              <div className={`p-6 border-2 transition-all ${
                fpgaResult.txOrderEnable
                  ? 'bg-[#E6F4EA] border-[#00A878] text-[#0D652D]'
                  : 'bg-[#FCE8E6] border-[#D93025] text-[#A50E0E]'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="font-mono text-xs font-bold uppercase tracking-widest mb-1">
                      {fpgaResult.txOrderEnable ? 'ORDER APPROVED AT WIRE SPEED' : 'ORDER PHYSICALLY KILLED ON NETWORK WIRE'}
                    </div>
                    <h2 className="font-serif text-3xl font-bold">
                      {fpgaResult.txOrderEnable ? 'PASS TO EXCHANGE (TX_ENABLE = 1)' : 'SEC 15c3-8 KILLED (TX_ENABLE = 0)'}
                    </h2>
                    <p className="font-sans text-xs sm:text-sm mt-1.5 opacity-90">
                      {fpgaResult.txOrderEnable
                        ? 'Order cleared all 45 clock cycles without detecting predatory order-book walls or unanchored surprise.'
                        : 'FPGA combinational bitwise mask zeroed Ethernet TX frame in 142.0 nanoseconds. No toxic sweep reached exchange.'}
                    </p>
                  </div>
                  <div className="font-mono text-right shrink-0">
                    <span className="text-2xl font-bold">{fpgaResult.elapsedNanoseconds} ns</span>
                    <span className="block text-[10px] opacity-75">45 Clocks @ 312.5 MHz</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-current/20 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                  <div>
                    <span className="text-[10px] opacity-75 block">Status Code:</span>
                    <strong className="text-sm">{fpgaResult.rejectionCode}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-75 block">Reason:</span>
                    <strong className="text-xs truncate block">{fpgaResult.rejectionReason}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-75 block">OBAR Asymmetry:</span>
                    <strong className="text-sm">{(fpgaResult.obarAsymmetry * 100).toFixed(1)}%</strong>
                  </div>
                  <div>
                    <span className="text-[10px] opacity-75 block">Epistemic Halt:</span>
                    <strong className="text-sm">{fpgaResult.secHaltIrq ? 'ACTIVE (15s)' : 'CLEAR'}</strong>
                  </div>
                </div>
              </div>

              {/* 3-Stage Hardware Datapath Pipeline Breakdown */}
              <div className="bg-[#FAF2E1] border border-[#F2D69D] p-6 space-y-4 font-mono text-xs">
                <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                  <span className="font-bold uppercase text-[#410217]">312.5 MHz Pipelined Datapath Budget</span>
                  <span className="text-[11px] text-[#00A878] font-bold">Total: 142.0 ns</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 bg-[#FFFDF8] border border-[#F2D69D]">
                    <div className="flex justify-between text-[10px] text-[#410217]/60 mb-1">
                      <span>STAGE 1</span>
                      <strong className="text-[#00A878]">38.4 ns</strong>
                    </div>
                    <div className="font-bold text-[#410217] mb-1">ITCH 5.0 Parser</div>
                    <div className="text-[11px] text-[#410217]/75">
                      12 clocks. Dual-port BRAM rolling depth &amp; capital allowance.
                    </div>
                  </div>

                  <div className="p-3 bg-[#FFFDF8] border border-[#F2D69D]">
                    <div className="flex justify-between text-[10px] text-[#410217]/60 mb-1">
                      <span>STAGE 2</span>
                      <strong className="text-[#00A878]">83.2 ns</strong>
                    </div>
                    <div className="font-bold text-[#410217] mb-1">TMMEG Systolic Multiplier</div>
                    <div className="text-[11px] text-[#410217]/75">
                      26 clocks. Q8.24 DSP48E2 cross-multiplication (division-free).
                    </div>
                  </div>

                  <div className="p-3 bg-[#FFFDF8] border border-[#F2D69D]">
                    <div className="flex justify-between text-[10px] text-[#410217]/60 mb-1">
                      <span>STAGE 3</span>
                      <strong className="text-[#00A878]">20.4 ns</strong>
                    </div>
                    <div className="font-bold text-[#410217] mb-1">Wire Order Kill-Gate</div>
                    <div className="text-[11px] text-[#410217]/75">
                      7 clocks. Combinational bitwise mask zeroing OUCH TX frame.
                    </div>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: Enterprise Value-at-Risk (VaR) & ROI Engine */}
        {/* ============================================================== */}
        {activeTab === 'roi' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Sliders for ROI */}
            <div className="lg:col-span-5 bg-[#FAF2E1] border border-[#F2D69D] p-6 space-y-5 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                <span className="font-bold uppercase text-[#410217]">Customer Profile Sliders</span>
                <span className="text-[10px] text-[#00A878] font-bold">Actuarial VaR</span>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>SKU 2 Fund AUM ($B):</span>
                    <strong className="text-[#410217]">${fundAum.toFixed(1)}B</strong>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="50.0"
                    step="1.0"
                    value={fundAum}
                    onChange={(e) => setFundAum(parseFloat(e.target.value))}
                    className="w-full accent-[#410217]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Daily Autonomous RAG Notional ($M):</span>
                    <strong className="text-[#00A878]">${dailyNotional.toFixed(0)}M / day</strong>
                  </div>
                  <input
                    type="range"
                    min="20.0"
                    max="1000.0"
                    step="10.0"
                    value={dailyNotional}
                    onChange={(e) => setDailyNotional(parseFloat(e.target.value))}
                    className="w-full accent-[#00A878]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>Co-Located Execution Venues:</span>
                    <strong className="text-[#410217]">{venues} Venues (NY4, DC3, LD4...)</strong>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    step="1"
                    value={venues}
                    onChange={(e) => setVenues(parseInt(e.target.value))}
                    className="w-full accent-[#410217]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>SKU 1 Retail Active AI Accounts (M):</span>
                    <strong className="text-[#410217]">{retailAccounts.toFixed(1)}M Users</strong>
                  </div>
                  <input
                    type="range"
                    min="1.0"
                    max="30.0"
                    step="0.5"
                    value={retailAccounts}
                    onChange={(e) => setRetailAccounts(parseFloat(e.target.value))}
                    className="w-full accent-[#D5991C]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] mb-1">
                    <span>SKU 3 Sovereign Trade Volume ($B):</span>
                    <strong className="text-[#410217]">${agencyTradeVol.toFixed(1)}B / yr</strong>
                  </div>
                  <input
                    type="range"
                    min="2.0"
                    max="50.0"
                    step="1.0"
                    value={agencyTradeVol}
                    onChange={(e) => setAgencyTradeVol(parseFloat(e.target.value))}
                    className="w-full accent-[#410217]"
                  />
                </div>
              </div>
            </div>

            {/* ROI Results Cards */}
            <div className="lg:col-span-7 space-y-5">
              
              {/* Quant Fund ROI Card */}
              <div className="p-6 bg-[#FAF2E1] border-2 border-[#00A878] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#F2D69D]">
                  <span className="font-bold text-[#00A878] uppercase">{quantRoi.skuTier}</span>
                  <span className="text-xl font-bold text-[#00A878]">{quantRoi.roiMultiple.toFixed(1)}x ROI</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#410217]">{quantRoi.clientName}</h3>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-2.5 bg-[#FFFDF8] border border-[#F2D69D]">
                    <span className="text-[10px] text-[#410217]/60 block">Annual License:</span>
                    <strong className="text-sm">${(quantRoi.annualLicenseCostUsd / 1e3).toFixed(0)}k / yr</strong>
                  </div>
                  <div className="p-2.5 bg-[#FFFDF8] border border-[#F2D69D]">
                    <span className="text-[10px] text-[#410217]/60 block">Capital Preserved:</span>
                    <strong className="text-sm text-[#00A878]">${(quantRoi.expectedAnnualCapitalPreservedUsd / 1e6).toFixed(2)}M / yr</strong>
                  </div>
                  <div className="p-2.5 bg-[#FFFDF8] border border-[#F2D69D]">
                    <span className="text-[10px] text-[#410217]/60 block">Net Savings:</span>
                    <strong className="text-sm text-[#00A878]">${(quantRoi.netAnnualSavingsUsd / 1e6).toFixed(2)}M / yr</strong>
                  </div>
                  <div className="p-2.5 bg-[#FFFDF8] border border-[#F2D69D]">
                    <span className="text-[10px] text-[#410217]/60 block">Payback Period:</span>
                    <strong className="text-sm">{quantRoi.paybackPeriodDays.toFixed(1)} Days</strong>
                  </div>
                </div>
              </div>

              {/* Retail Broker ROI Card */}
              <div className="p-6 bg-[#FAF2E1] border border-[#F2D69D] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#F2D69D]">
                  <span className="font-bold text-[#410217] uppercase">{brokerRoi.skuTier}</span>
                  <span className="text-xl font-bold text-[#410217]">{brokerRoi.roiMultiple.toFixed(1)}x ROI</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#410217]">{brokerRoi.clientName}</h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-2.5 bg-[#FFFDF8] border border-[#F2D69D]">
                    <span className="text-[10px] text-[#410217]/60 block">Annual License:</span>
                    <strong className="text-sm">${(brokerRoi.annualLicenseCostUsd / 1e3).toFixed(0)}k / yr</strong>
                  </div>
                  <div className="p-2.5 bg-[#FFFDF8] border border-[#F2D69D]">
                    <span className="text-[10px] text-[#410217]/60 block">Capital Preserved:</span>
                    <strong className="text-sm text-[#00A878]">${(brokerRoi.expectedAnnualCapitalPreservedUsd / 1e6).toFixed(2)}M / yr</strong>
                  </div>
                  <div className="p-2.5 bg-[#FFFDF8] border border-[#F2D69D]">
                    <span className="text-[10px] text-[#410217]/60 block">Net Savings:</span>
                    <strong className="text-sm text-[#00A878]">${(brokerRoi.netAnnualSavingsUsd / 1e6).toFixed(2)}M / yr</strong>
                  </div>
                  <div className="p-2.5 bg-[#FFFDF8] border border-[#F2D69D]">
                    <span className="text-[10px] text-[#410217]/60 block">Payback Period:</span>
                    <strong className="text-sm">{brokerRoi.paybackPeriodDays.toFixed(1)} Days</strong>
                  </div>
                </div>
              </div>

              {/* Sovereign Enclave ROI Card */}
              <div className="p-6 bg-[#FAF2E1] border border-[#410217] space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#F2D69D]">
                  <span className="font-bold text-[#410217] uppercase">{agencyRoi.skuTier}</span>
                  <span className="text-xl font-bold text-[#410217]">{agencyRoi.roiMultiple.toFixed(1)}x ROI</span>
                </div>
                <h3 className="font-serif text-xl font-bold text-[#410217]">{agencyRoi.clientName}</h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                  <div className="p-2.5 bg-[#FFFDF8] border border-[#F2D69D]">
                    <span className="text-[10px] text-[#410217]/60 block">Annual License:</span>
                    <strong className="text-sm">${(agencyRoi.annualLicenseCostUsd / 1e6).toFixed(2)}M / yr</strong>
                  </div>
                  <div className="p-2.5 bg-[#FFFDF8] border border-[#F2D69D]">
                    <span className="text-[10px] text-[#410217]/60 block">Capital Preserved:</span>
                    <strong className="text-sm text-[#00A878]">${(agencyRoi.expectedAnnualCapitalPreservedUsd / 1e6).toFixed(1)}M / yr</strong>
                  </div>
                  <div className="p-2.5 bg-[#FFFDF8] border border-[#F2D69D]">
                    <span className="text-[10px] text-[#410217]/60 block">Net Savings:</span>
                    <strong className="text-sm text-[#00A878]">${(agencyRoi.netAnnualSavingsUsd / 1e6).toFixed(1)}M / yr</strong>
                  </div>
                  <div className="p-2.5 bg-[#FFFDF8] border border-[#F2D69D]">
                    <span className="text-[10px] text-[#410217]/60 block">Payback Period:</span>
                    <strong className="text-sm">{agencyRoi.paybackPeriodDays.toFixed(1)} Days</strong>
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: Sovereign Contracting & IP Blueprint */}
        {/* ============================================================== */}
        {activeTab === 'procurement' && (
          <div className="space-y-8 font-mono text-xs">
            
            {/* Patent Families Grid */}
            <div className="bg-[#FAF2E1] border border-[#F2D69D] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                <span className="font-bold uppercase text-[#410217]">8 Foundational Patent Families</span>
                <span className="text-[10px] text-[#D5991C] font-bold">20-Year IP Moat</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {MASTER_DOC_VOL4_METADATA.patentFamilies.map((pf) => (
                  <div key={pf.id} className="p-3 bg-[#FFFDF8] border border-[#F2D69D]/80">
                    <div className="flex items-center justify-between text-[10px] mb-1">
                      <span className="px-1.5 py-0.5 bg-[#410217] text-[#FBF3E2] font-bold">{pf.id}</span>
                      <strong className="text-[#00A878]">{pf.code}</strong>
                    </div>
                    <div className="font-sans text-xs text-[#410217] font-semibold leading-snug">
                      {pf.title}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 36-Month Financial Ramp */}
            <div className="bg-[#FAF2E1] border border-[#F2D69D] p-6 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                <span className="font-bold uppercase text-[#410217]">36-Month Dual-Use ARR Scaling</span>
                <span className="text-[10px] text-[#00A878] font-bold">87.8% Gross Margin Target</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs border border-[#F2D69D]">
                  <thead className="bg-[#410217] text-[#FBF3E2]">
                    <tr>
                      <th className="p-2.5">Year</th>
                      <th className="p-2.5">Non-Dilutive Federal</th>
                      <th className="p-2.5">Sovereign Clients</th>
                      <th className="p-2.5">Quant Funds</th>
                      <th className="p-2.5">Total ARR</th>
                      <th className="p-2.5">Net Dollar Retention</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F2D69D] bg-[#FFFDF8]">
                    {MASTER_DOC_VOL4_METADATA.financialModel.map((row, idx) => (
                      <tr key={idx}>
                        <td className="p-2.5 font-bold">{row.year}</td>
                        <td className="p-2.5">{row.federalGrants}</td>
                        <td className="p-2.5">{row.sovereignClients} Agencies</td>
                        <td className="p-2.5">{row.quantClients} Funds</td>
                        <td className="p-2.5 text-[#00A878] font-bold text-sm">{row.totalArr}</td>
                        <td className="p-2.5 font-bold">{row.ndr}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: 3D Hardware Enclave (WebGL) */}
        {/* ============================================================== */}
        {activeTab === 'webgl' && (
          <div className="bg-[#FAF2E1] border border-[#F2D69D] p-6 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
              <span className="font-bold uppercase text-[#410217]">
                Equinix NY4 / Aurora DC3 Colocation Hardware Appliance
              </span>
              <span className="text-[10px] text-[#00A878] font-bold">1U AMD Versal FPGA + NVIDIA H200</span>
            </div>

            <div
              ref={mountRef}
              className="w-full h-[500px] border border-[#F2D69D] relative overflow-hidden bg-[#130108]"
            >
              <div className="absolute top-3 left-3 bg-[#410217]/90 text-[#FBF3E2] px-3 py-1.5 text-[10px] font-mono border border-[#D5991C] pointer-events-none z-10">
                <span>INTERACTIVE 3D MODEL // ROTATE WITH MOUSE</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-[#FFFDF8] border border-[#F2D69D]">
                <strong className="text-[#410217] block mb-0.5">Wire Ingest:</strong>
                <span>100GbE Optical QSFP28 ITCH 5.0 Feed (Carteret / Secaucus)</span>
              </div>
              <div className="p-3 bg-[#FFFDF8] border border-[#F2D69D]">
                <strong className="text-[#00A878] block mb-0.5">FPGA SmartNIC:</strong>
                <span>AMD Alveo U250 / Versal HBM (45 Clock Cycles / 142.0 ns Gate)</span>
              </div>
              <div className="p-3 bg-[#FFFDF8] border border-[#F2D69D]">
                <strong className="text-[#D5991C] block mb-0.5">Co-Processor:</strong>
                <span>NVIDIA H200 GPUDirect RDMA ZK-CGEO Prover (11.4 ms)</span>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
