import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Terminal,
  FileCode,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ArrowUpRight,
  RefreshCw,
  Cpu,
  Boxes,
  Sparkles,
  ChevronRight,
  Sliders,
  Activity,
} from 'lucide-react';
import { REA_SAMPLE_TARGETS, REA_PROMPT_TEMPLATES, REA_TOOL_SUITES } from '../data/reaData';
import { NavigationPage, ReaSampleTarget } from '../types';

interface ReaStudioPageProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenAudit?: () => void;
  onOpenIncident?: () => void;
}

type ReaSubView = 'dashboard' | 'inspector' | 'promptStudio' | 'terminal' | 'setupManager';

export const ReaStudioPage: React.FC<ReaStudioPageProps> = ({
  onNavigate,
}) => {
  const [activeView, setActiveView] = useState<ReaSubView>('dashboard');
  const [selectedTargetKey, setSelectedTargetKey] = useState<string>('electronNotes');
  const [inspectorTab, setInspectorTab] = useState<'ipc' | 'modules' | 'decompiled' | 'evidence'>('ipc');
  const [customPath, setCustomPath] = useState('');
  const [isAnalyzingPath, setIsAnalyzingPath] = useState(false);
  const [customAnalysisTarget, setCustomAnalysisTarget] = useState<ReaSampleTarget | null>(null);

  // Prompt Studio state
  const [selectedPromptPattern, setSelectedPromptPattern] = useState(REA_PROMPT_TEMPLATES[0].id);
  const [promptTargetInput, setPromptTargetInput] = useState('Slack.app / notes-desktop');
  const [promptFeatureInput, setPromptFeatureInput] = useState('SQLite full-text search and IPC message bridge');

  // Terminal state
  const [terminalHistory, setTerminalHistory] = useState<
    Array<{ text: string; type: 'cmd' | 'output' | 'success' | 'warn' | 'info' }>
  >([
    { text: 'REA Workbench Terminal Bridge Ready · v6.3.0', type: 'info' },
    { text: 'Connected to local analysis runtime.', type: 'info' },
    { text: '$ rea doctor --client antigravity --format json', type: 'cmd' },
    { text: '✓ 133 MCP inspection tools ready across 6 domain suites.', type: 'success' },
    { text: 'Ready. Type a command below or click one of the preset buttons.', type: 'info' },
  ]);
  const [terminalInput, setTerminalInput] = useState('');
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Setup Modal state
  const [isSetupModalOpen, setIsSetupModalOpen] = useState(false);
  const [setupApplied, setSetupApplied] = useState(false);

  // Toast state
  const [toastText, setToastText] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastText(msg);
    setTimeout(() => setToastText(null), 3000);
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalHistory]);

  const activeTarget: ReaSampleTarget =
    customAnalysisTarget || REA_SAMPLE_TARGETS[selectedTargetKey] || REA_SAMPLE_TARGETS['electronNotes'];

  const handleAnalyzeCustomPath = () => {
    if (!customPath.trim()) return;
    setIsAnalyzingPath(true);
    setTimeout(() => {
      const isAsar = customPath.includes('.asar') || customPath.includes('.app');
      const syntheticTarget: ReaSampleTarget = {
        id: 'custom-' + Date.now(),
        name: `Analyzed Target: ${customPath.split('/').pop() || customPath}`,
        target: customPath,
        type: isAsar ? 'electron' : 'native',
        badge: isAsar ? 'Electron / ASAR Local' : 'Local Binary / Bundle',
        summary: `Inspection summary for ${customPath}. Extracted entry points, verified security isolation settings, and mapped 2 communication channels.`,
        evidenceCount: 19,
        confidence: 'High (0.92)',
        ipcChannels: [
          {
            channel: 'app:handshake',
            direction: 'renderer -> main',
            handler: 'src/main/ipc.ts:L32',
            method: 'ipcMain.handle',
            description: 'Client session handshake and token check',
          },
          {
            channel: 'telemetry:emit',
            direction: 'renderer -> main',
            handler: 'src/main/telemetry.ts:L14',
            method: 'ipcMain.on',
            description: 'Event dispatcher passing payload through schema validator',
          },
        ],
        boundaries: {
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true,
          preloadPath: 'preload.js',
          contextBridgeExposed: ['window.api.handshake', 'window.api.emitTelemetry'],
        },
        modules: [
          { name: 'better-sqlite3', role: 'Local embedded cache & search index', imports: ['sqlite3'] },
          { name: 'electron-updater', role: 'Background update checker', imports: ['electron-updater'] },
        ],
        decompiledLogic: `// Clean-Room Entry Point Reconstruction for ${customPath}
import { BrowserWindow, ipcMain } from 'electron';
import path from 'path';

export function createSecureWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  ipcMain.handle('app:handshake', async () => {
    return { ok: true, version: '1.0.0', epoch: Date.now() };
  });

  return win;
}`,
      };
      setCustomAnalysisTarget(syntheticTarget);
      setIsAnalyzingPath(false);
      triggerToast(`Analysis complete for ${customPath}`);
    }, 900);
  };

  const executeTerminalCmd = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const newHistory = [...terminalHistory, { text: `$ ${trimmed}`, type: 'cmd' as const }];

    if (trimmed === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else if (trimmed.includes('doctor')) {
      newHistory.push({ text: 'Running system check: rea doctor ...', type: 'info' });
      newHistory.push({ text: '✓ REA CLI Version: 6.3.0', type: 'success' });
      newHistory.push({ text: '✓ 133 MCP inspection tools ready across 6 domain suites.', type: 'success' });
      newHistory.push({ text: '✓ Supported Targets: macOS Mach-O, Electron ASAR, Web Bundles, Android APK, Firmware', type: 'info' });
    } else if (trimmed.includes('providers')) {
      newHistory.push({ text: 'Supported Coding Agents:', type: 'info' });
      newHistory.push({ text: '• Antigravity: Connected (133 Tools / Native MCP)', type: 'success' });
      newHistory.push({ text: '• Claude Code: Supported (~/.claude/mcp_servers.json)', type: 'success' });
      newHistory.push({ text: '• Gemini CLI & Cursor: Supported', type: 'success' });
    } else if (trimmed.includes('setup')) {
      newHistory.push({ text: 'Running dry-run preview: rea setup --dry-run ...', type: 'info' });
      newHistory.push({ text: 'Proposed Steps:', type: 'warn' });
      newHistory.push({ text: '1. Register REA MCP server in agent config', type: 'info' });
      newHistory.push({ text: '2. Install Reverse-Engineer-Anything skill guide', type: 'info' });
      newHistory.push({ text: 'Automatic backup created before any changes.', type: 'success' });
    } else if (trimmed.includes('inspect')) {
      newHistory.push({ text: 'Target inspection completed. 42 evidence items extracted.', type: 'success' });
      newHistory.push({ text: 'Clean-room summary ready for review.', type: 'info' });
    } else {
      newHistory.push({ text: `Executed '${trimmed}'. Status: OK.`, type: 'info' });
    }

    setTerminalHistory(newHistory);
    setTerminalInput('');
  };

  const currentTemplate =
    REA_PROMPT_TEMPLATES.find((t) => t.id === selectedPromptPattern) || REA_PROMPT_TEMPLATES[0];
  const renderedPrompt = currentTemplate.template(promptTargetInput, promptFeatureInput);

  return (
    <div className="min-h-screen bg-[#FBF3E2] text-[#410217] font-sans selection:bg-[#410217]/15 selection:text-[#410217]">
      {/* Toast */}
      {toastText && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 rounded-lg bg-[#410217] text-[#FBF3E2] px-4 py-3 border border-[#F2D69D] shadow-xl text-xs">
          <CheckCircle2 className="w-4 h-4 text-[#D5991C]" />
          <span>{toastText}</span>
        </div>
      )}

      {/* REA Studio Header Bar */}
      <section className="border-b border-[#F2D69D] bg-[#FAF2E1]/95 backdrop-blur-md sticky top-20 z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#410217] flex items-center justify-center border border-[#D5991C]/50 shadow-xs">
                <FileCode className="w-5 h-5 text-[#D5991C]" />
              </div>
              <div>
                <div className="flex items-center space-x-2.5">
                  <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#410217] leading-none">
                    REA Workbench
                  </h1>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#410217] text-[#D5991C] text-[10px] font-semibold">
                    133 Inspection Tools
                  </span>
                </div>
                <p className="text-xs text-[#410217]/75 font-sans mt-1">
                  Reverse Engineer Anything · Inspect Apps, Understand Features &amp; Build Clean-Room Code
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 text-xs">
              <button
                onClick={() => {
                  executeTerminalCmd('rea doctor --format json');
                  setActiveView('terminal');
                  triggerToast('Running System Doctor...');
                }}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#FAF2E1] hover:bg-[#F2D69D]/60 border border-[#410217]/25 text-[#410217] font-semibold cursor-pointer transition-colors"
              >
                <Activity className="w-3.5 h-3.5 text-[#D5991C]" />
                <span>System Check</span>
              </button>

              <button
                onClick={() => onNavigate('counter-geo-ops')}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#D5991C] hover:bg-[#E5A932] text-[#130108] font-semibold cursor-pointer shadow-xs transition-all"
              >
                <Boxes className="w-3.5 h-3.5" />
                <span>3D Threat Lab</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => setIsSetupModalOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] font-semibold cursor-pointer shadow-xs transition-all"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#D5991C]" />
                <span>Connect Coding Agents</span>
              </button>
            </div>
          </div>

          {/* Sub-View Navigation Tabs (No eyebrows) */}
          <div className="flex items-center space-x-2 overflow-x-auto pt-4 border-t border-[#F2D69D]/60 mt-3 text-xs font-semibold">
            {[
              { id: 'dashboard' as const, label: 'Overview & Tool Suites', icon: Cpu },
              { id: 'inspector' as const, label: 'Target App Inspector', icon: Search },
              { id: 'promptStudio' as const, label: 'Agent Prompt Builder', icon: Sparkles },
              { id: 'terminal' as const, label: 'Interactive CLI Bridge', icon: Terminal },
              { id: 'setupManager' as const, label: 'Agent Integration Guide', icon: Sliders },
            ].map((tab) => {
              const IconComp = tab.icon;
              const isActive = activeView === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveView(tab.id)}
                  className={`px-4 py-2 rounded-t-lg border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-2 ${
                    isActive
                      ? 'border-[#410217] text-[#410217] bg-[#FBF3E2]'
                      : 'border-transparent text-[#410217]/65 hover:text-[#410217]'
                  }`}
                >
                  <IconComp className="w-3.5 h-3.5 text-[#D5991C]" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* VIEW 1: DASHBOARD */}
        {activeView === 'dashboard' && (
          <div className="space-y-8">
            {/* Hero Banner + Visual Workflow Diagram */}
            <div className="rounded-2xl bg-[#FAF2E1] border border-[#F2D69D] p-6 sm:p-8 shadow-sm">
              <div className="max-w-3xl space-y-4">
                <div className="w-12 h-1 bg-[#D5991C] rounded-full" />
                <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#410217] tracking-tight leading-tight">
                  Inspect Any App. Understand How It Works. Build Clean-Room Code.
                </h2>
                <p className="text-sm sm:text-base text-[#410217]/80 leading-relaxed font-sans">
                  Normally, when you ask an AI coding assistant how a compiled desktop app, mobile binary, or minified web bundle works, it has to guess. REA Workbench gives coding agents 133 specialized tools to inspect the actual shipped files, map how features work, and write clean, original code based on real evidence rather than guesswork.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveView('inspector')}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] font-semibold text-xs cursor-pointer transition-all"
                  >
                    <Search className="w-4 h-4 text-[#D5991C]" />
                    <span>Inspect Sample Apps</span>
                  </button>

                  <button
                    onClick={() => setActiveView('promptStudio')}
                    className="flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-[#FBF3E2] hover:bg-[#F2D69D]/70 text-[#410217] font-semibold text-xs border border-[#410217]/25 cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-[#D5991C]" />
                    <span>Build an Agent Prompt</span>
                  </button>
                </div>
              </div>

              {/* Animated SVG Visual Pipeline of How REA Works */}
              <div className="mt-8 pt-6 border-t border-[#F2D69D]">
                <div className="text-xs font-semibold text-[#410217]/75 mb-3">
                  How REA Guides an AI Coding Agent From Binary to Clean-Room Code
                </div>
                <svg viewBox="0 0 920 96" className="w-full h-auto overflow-visible">
                  {[
                    { x: 8, title: '1. Shipped App or Binary', sub: 'Electron, macOS, Web, APK', color: '#410217' },
                    { x: 244, title: '2. 133 Inspection Tools', sub: 'Extracts symbols, IPC & routes', color: '#D5991C' },
                    { x: 480, title: '3. Verified Evidence Map', sub: 'Zero guesswork or hallucination', color: '#004566' },
                    { x: 716, title: '4. Clean-Room Build', sub: 'Fresh, tested implementation', color: '#00A878' },
                  ].map((step, idx) => (
                    <g key={idx}>
                      {idx < 3 && (
                        <>
                          <line
                            x1={step.x + 196}
                            y1="48"
                            x2={step.x + 236}
                            y2="48"
                            stroke="#410217"
                            strokeOpacity="0.3"
                            strokeWidth="2"
                          />
                          <circle r="3.5" fill="#D5991C">
                            <animate
                              attributeName="cx"
                              from={step.x + 196}
                              to={step.x + 236}
                              dur="1.4s"
                              repeatCount="indefinite"
                            />
                            <animate attributeName="cy" values="48;48" dur="1.4s" repeatCount="indefinite" />
                          </circle>
                        </>
                      )}
                      <rect
                        x={step.x}
                        y="10"
                        width="196"
                        height="76"
                        rx="12"
                        fill="#FFFDF8"
                        stroke={step.color}
                        strokeWidth="1.8"
                      />
                      <text x={step.x + 98} y="40" textAnchor="middle" fill={step.color} fontSize="12" fontWeight="700">
                        {step.title}
                      </text>
                      <text x={step.x + 98} y="60" textAnchor="middle" fill="#410217" fillOpacity="0.75" fontSize="10.5">
                        {step.sub}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            </div>

            {/* 3 Sample Target Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {[
                {
                  key: 'electronNotes',
                  badge: 'Electron Desktop App',
                  title: 'Notes App (Search & IPC Bridge)',
                  desc: 'See how REA maps local SQLite search queries, security boundaries, and message channels between the UI and main process.',
                  nodes: '42 Evidence Items',
                },
                {
                  key: 'machoBinary',
                  badge: 'macOS ARM64 Binary',
                  title: 'macOS System Telemetry Agent',
                  desc: 'Inspect system library links, background power monitoring hooks, and decompiled ARM64 function call paths.',
                  nodes: '78 Evidence Items',
                },
                {
                  key: 'webBundle',
                  badge: 'Minified Web App',
                  title: 'Cloud Dashboard Web Bundle',
                  desc: 'Trace recovered source structure, live WebSocket channels, and session refresh logic from a bundled single-page app.',
                  nodes: '35 Evidence Items',
                },
              ].map((card) => (
                <div
                  key={card.key}
                  onClick={() => {
                    setSelectedTargetKey(card.key);
                    setActiveView('inspector');
                  }}
                  className="rounded-2xl bg-[#FAF2E1] border border-[#F2D69D] p-6 hover:border-[#410217] transition-all cursor-pointer group shadow-xs hover:shadow-md flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#410217]/10 text-[#410217] text-[11px] font-semibold">
                        {card.badge}
                      </span>
                      <span className="text-xs text-[#D5991C] font-semibold">Sample Target</span>
                    </div>
                    <h3 className="font-serif font-bold text-xl text-[#410217] mt-3 group-hover:text-[#D5991C] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#410217]/80 mt-2 leading-relaxed">
                      {card.desc}
                    </p>
                  </div>
                  <div className="mt-5 flex items-center justify-between text-xs text-[#410217]/75 pt-3 border-t border-[#F2D69D]/60">
                    <span>{card.nodes}</span>
                    <span className="text-[#410217] font-bold flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                      Inspect Target <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Tool Suites Directory */}
            <div className="rounded-2xl bg-[#FAF2E1] border border-[#F2D69D] p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2D69D] pb-3">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#410217]">
                    6 Specialized Inspection Suites (133 Tools Total)
                  </h3>
                  <p className="text-xs text-[#410217]/75 font-sans">
                    Organized by platform so your coding agent always picks the right inspection tool for the job.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {REA_TOOL_SUITES.map((suite, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-[#FBF3E2] border border-[#F2D69D]/80 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-base text-[#410217]">{suite.name}</span>
                      <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#410217] text-[#D5991C]">
                        {suite.count} tools
                      </span>
                    </div>
                    <p className="text-xs text-[#410217]/80 leading-relaxed font-sans">
                      {suite.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* VIEW 2: TARGET INSPECTOR */}
        {activeView === 'inspector' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
              <div className="rounded-2xl bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-4">
                <div className="border-b border-[#F2D69D] pb-3">
                  <h3 className="font-serif font-bold text-lg text-[#410217]">Sample Targets</h3>
                  <p className="text-xs text-[#410217]/70 font-sans">
                    Choose a target below to explore its extracted channels, modules, and clean-room code.
                  </p>
                </div>

                <div className="space-y-3">
                  {Object.values(REA_SAMPLE_TARGETS).map((t) => {
                    const isSelected = selectedTargetKey === t.id && !customAnalysisTarget;
                    return (
                      <div
                        key={t.id}
                        onClick={() => {
                          setSelectedTargetKey(t.id);
                          setCustomAnalysisTarget(null);
                        }}
                        className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#410217] text-[#FBF3E2] border-[#410217] shadow-sm'
                            : 'bg-[#FBF3E2] hover:bg-[#FAF2E1] border-[#F2D69D] text-[#410217]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className={`font-bold ${isSelected ? 'text-[#D5991C]' : 'text-[#410217]'}`}>
                            {t.name.split(' ')[0]}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              isSelected ? 'bg-[#D5991C] text-[#410217]' : 'bg-[#410217]/10 text-[#410217]'
                            }`}
                          >
                            {t.badge}
                          </span>
                        </div>
                        <p className={`text-xs mt-1.5 line-clamp-2 ${isSelected ? 'text-[#FBF3E2]/80' : 'text-[#410217]/75'}`}>
                          {t.summary}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-3">
                <div className="border-b border-[#F2D69D] pb-2">
                  <h4 className="font-serif font-bold text-base text-[#410217]">Simulate Custom Path Inspection</h4>
                  <p className="text-xs text-[#410217]/70">Preview how REA structures findings for a local app path</p>
                </div>

                <div className="space-y-2.5">
                  <input
                    type="text"
                    value={customPath}
                    onChange={(e) => setCustomPath(e.target.value)}
                    placeholder="/Applications/Slack.app or ./dist/app.asar"
                    className="w-full px-3 py-2 rounded-lg bg-[#FBF3E2] border border-[#F2D69D] text-xs font-mono text-[#410217] focus:outline-hidden focus:border-[#410217]"
                  />

                  <button
                    onClick={handleAnalyzeCustomPath}
                    disabled={isAnalyzingPath || !customPath.trim()}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 rounded-lg bg-[#410217] hover:bg-[#5C0A24] disabled:opacity-50 text-[#FBF3E2] font-semibold text-xs transition-colors cursor-pointer"
                  >
                    {isAnalyzingPath ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D5991C]" />
                    ) : (
                      <Search className="w-3.5 h-3.5 text-[#D5991C]" />
                    )}
                    <span>{isAnalyzingPath ? 'Inspecting...' : 'Inspect Path'}</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-8 space-y-4">
              <div className="rounded-2xl bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#410217] text-[#D5991C] text-[11px] font-semibold">
                        Confidence: {activeTarget.confidence}
                      </span>
                    </div>
                    <h2 className="font-serif font-bold text-2xl text-[#410217] mt-1.5">
                      {activeTarget.name}
                    </h2>
                    <p className="font-mono text-xs text-[#410217]/70 mt-0.5">
                      {activeTarget.target}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(activeTarget, null, 2));
                      triggerToast('Evidence JSON copied to clipboard');
                    }}
                    className="flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#FBF3E2] hover:bg-[#F2D69D] border border-[#410217]/25 text-[#410217] text-xs font-semibold cursor-pointer transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#D5991C]" />
                    <span>Copy Evidence JSON</span>
                  </button>
                </div>

                <div className="flex border-b border-[#F2D69D] pt-2 text-xs font-semibold">
                  {[
                    { id: 'ipc' as const, label: 'Communication & Security' },
                    { id: 'modules' as const, label: 'Modules & Libraries' },
                    { id: 'decompiled' as const, label: 'Clean-Room Code' },
                    { id: 'evidence' as const, label: 'Raw JSON' },
                  ].map((t) => (
                    <button
                      key={t.id}
                      onClick={() => setInspectorTab(t.id)}
                      className={`px-4 py-2 border-b-2 transition-all cursor-pointer ${
                        inspectorTab === t.id
                          ? 'border-[#410217] text-[#410217] bg-[#FBF3E2]'
                          : 'border-transparent text-[#410217]/60 hover:text-[#410217]'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {inspectorTab === 'ipc' && (
                <div className="space-y-4">
                  {activeTarget.boundaries && (
                    <div className="rounded-xl bg-[#FAF2E1] border border-[#F2D69D] p-4 flex flex-wrap gap-4 text-xs">
                      <div>
                        <span className="text-[#410217]/70">Context Isolation:</span>{' '}
                        <strong className={activeTarget.boundaries.contextIsolation ? 'text-[#00A878]' : 'text-[#E63946]'}>
                          {activeTarget.boundaries.contextIsolation ? 'Enabled (Secure)' : 'Disabled'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#410217]/70">Node Integration:</span>{' '}
                        <strong className={!activeTarget.boundaries.nodeIntegration ? 'text-[#00A878]' : 'text-[#E63946]'}>
                          {activeTarget.boundaries.nodeIntegration ? 'Enabled (Risk)' : 'Disabled (Secure)'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#410217]/70">Sandbox:</span>{' '}
                        <strong className={activeTarget.boundaries.sandbox ? 'text-[#00A878]' : 'text-[#E63946]'}>
                          {activeTarget.boundaries.sandbox ? 'Enabled' : 'Disabled'}
                        </strong>
                      </div>
                    </div>
                  )}

                  <div className="space-y-3">
                    {activeTarget.ipcChannels?.map((ch, idx) => (
                      <div key={idx} className="rounded-xl bg-[#FAF2E1] border border-[#F2D69D] p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-sm text-[#410217]">{ch.channel}</span>
                          <span className="px-2.5 py-0.5 rounded-full bg-[#410217] text-[#D5991C] font-mono text-[10px] font-bold">
                            {ch.method}
                          </span>
                        </div>
                        <div className="font-mono text-xs text-[#004566]">
                          {ch.direction} · <span className="text-[#575F62]">{ch.handler}</span>
                        </div>
                        <p className="text-xs text-[#410217]/80 font-sans leading-relaxed">{ch.description}</p>
                      </div>
                    ))}

                    {(!activeTarget.ipcChannels || activeTarget.ipcChannels.length === 0) && (
                      <div className="rounded-xl bg-[#FAF2E1] border border-[#F2D69D] p-6 text-center text-xs text-[#410217]/75">
                        This target is a native binary or web bundle rather than an Electron app. Switch to &ldquo;Modules &amp; Libraries&rdquo; or &ldquo;Clean-Room Code&rdquo; to inspect its structure.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {inspectorTab === 'modules' && (
                <div className="space-y-4">
                  {activeTarget.linkedLibraries && (
                    <div className="rounded-xl bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-3">
                      <h4 className="font-serif font-bold text-base text-[#410217]">
                        Linked System Libraries
                      </h4>
                      <div className="space-y-2 text-xs">
                        {activeTarget.linkedLibraries.map((lib, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-[#FBF3E2] border border-[#F2D69D] space-y-1">
                            <div className="flex items-center justify-between font-bold">
                              <span className="font-mono text-[#410217]">{lib.name}</span>
                              <span className="text-[#00A878] text-[11px]">{lib.status}</span>
                            </div>
                            <div className="text-[11px] text-[#575F62] font-mono">
                              Symbols: {lib.symbols.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTarget.modules && (
                    <div className="rounded-xl bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-3">
                      <h4 className="font-serif font-bold text-base text-[#410217]">
                        Detected Packages &amp; Dependencies
                      </h4>
                      <div className="space-y-2 text-xs">
                        {activeTarget.modules.map((mod, idx) => (
                          <div key={idx} className="p-3 rounded-lg bg-[#FBF3E2] border border-[#F2D69D] space-y-1">
                            <div className="flex items-center justify-between font-bold">
                              <span className="font-mono text-[#410217]">{mod.name}</span>
                              <span className="text-[#D5991C] text-[11px]">Verified</span>
                            </div>
                            <div className="text-xs text-[#410217]/80">{mod.role}</div>
                            <div className="text-[11px] text-[#575F62] font-mono">
                              Imports: {mod.imports.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {inspectorTab === 'decompiled' && (
                <div className="rounded-2xl bg-[#410217] border border-[#F2D69D] p-5 space-y-3 text-[#FBF3E2]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]/30 text-xs">
                    <span className="text-[#D5991C] font-semibold">Clean-Room Reconstruction</span>
                    <button
                      onClick={() => {
                        if (activeTarget.decompiledLogic) {
                          navigator.clipboard.writeText(activeTarget.decompiledLogic);
                          triggerToast('Code copied to clipboard');
                        }
                      }}
                      className="flex items-center space-x-1.5 px-3 py-1 rounded-md bg-[#310111] hover:bg-[#5C0A24] border border-[#F2D69D]/40 text-[#FBF3E2] text-[11px] cursor-pointer"
                    >
                      <Copy className="w-3 h-3 text-[#D5991C]" />
                      <span>Copy Code</span>
                    </button>
                  </div>

                  <pre className="p-4 rounded-xl bg-[#28010E] border border-[#F2D69D]/20 font-mono text-xs overflow-x-auto text-[#FBF3E2]/90 leading-relaxed max-h-[480px]">
                    <code>{activeTarget.decompiledLogic || '// No code available'}</code>
                  </pre>
                </div>
              )}

              {inspectorTab === 'evidence' && (
                <div className="rounded-2xl bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                    <span className="font-bold text-[#410217]">Structured Evidence JSON</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(activeTarget, null, 2));
                        triggerToast('Evidence JSON copied');
                      }}
                      className="px-3 py-1 rounded-md bg-[#410217] text-[#FBF3E2] text-[11px] cursor-pointer"
                    >
                      Copy JSON
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-[#FBF3E2] border border-[#F2D69D] max-h-[480px] overflow-auto text-[#410217]">
                    {JSON.stringify(activeTarget, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 3: AGENT PROMPT STUDIO */}
        {activeView === 'promptStudio' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-[#FAF2E1] border border-[#F2D69D] p-6 space-y-5">
              <div>
                <h3 className="font-serif font-bold text-2xl text-[#410217]">
                  Agent Prompt Builder
                </h3>
                <p className="text-xs sm:text-sm text-[#410217]/75 font-sans mt-1">
                  Pick a workflow below and customize the target app and feature. Copy the generated prompt into your coding agent so it inspects real files first before writing code.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {REA_PROMPT_TEMPLATES.map((tmpl) => {
                  const isSelected = selectedPromptPattern === tmpl.id;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => setSelectedPromptPattern(tmpl.id)}
                      className={`p-4 rounded-xl border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-[#410217] text-[#FBF3E2] border-[#410217] shadow-sm'
                          : 'bg-[#FBF3E2] hover:bg-[#FAF2E1] border-[#F2D69D] text-[#410217]'
                      }`}
                    >
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isSelected ? 'bg-[#D5991C] text-[#410217]' : 'bg-[#410217]/10 text-[#410217]'
                        }`}
                      >
                        {tmpl.tag}
                      </span>
                      <h4 className="font-serif font-bold text-base leading-tight">{tmpl.title}</h4>
                      <p className={`text-xs leading-relaxed line-clamp-2 ${isSelected ? 'text-[#FBF3E2]/80' : 'text-[#410217]/75'}`}>
                        {tmpl.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[#410217] font-semibold">
                    Target Application or File Path
                  </label>
                  <input
                    type="text"
                    value={promptTargetInput}
                    onChange={(e) => setPromptTargetInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBF3E2] border border-[#F2D69D] text-[#410217] focus:outline-hidden focus:border-[#410217]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#410217] font-semibold">
                    Feature you want to understand or rebuild
                  </label>
                  <input
                    type="text"
                    value={promptFeatureInput}
                    onChange={(e) => setPromptFeatureInput(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBF3E2] border border-[#F2D69D] text-[#410217] focus:outline-hidden focus:border-[#410217]"
                  />
                </div>
              </div>

              <div className="rounded-xl bg-[#FBF3E2] border border-[#F2D69D] p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#F2D69D] text-xs">
                  <span className="font-bold text-[#410217]">Ready-to-Use Agent Prompt</span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(renderedPrompt);
                      triggerToast('Prompt copied to clipboard');
                    }}
                    className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg bg-[#410217] text-[#FBF3E2] text-xs font-semibold cursor-pointer hover:bg-[#5C0A24] transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#D5991C]" />
                    <span>Copy Prompt</span>
                  </button>
                </div>

                <div className="p-4 rounded-lg bg-[#FAF2E1] border border-[#F2D69D] font-mono text-xs leading-relaxed text-[#410217] select-all">
                  &ldquo;{renderedPrompt}&rdquo;
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 4: TERMINAL */}
        {activeView === 'terminal' && (
          <div className="space-y-4">
            <div className="rounded-2xl bg-[#28010E] border border-[#F2D69D] shadow-2xl overflow-hidden font-mono text-xs">
              <div className="bg-[#410217] px-4 py-3 flex flex-wrap items-center justify-between gap-2 border-b border-[#F2D69D]/30">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#E63946] inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#D5991C] inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#00A878] inline-block" />
                  <span className="text-xs text-[#FBF3E2]/85 ml-2 font-bold">
                    REA Interactive CLI Bridge
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-[11px]">
                  <button
                    onClick={() => executeTerminalCmd('rea doctor --format json')}
                    className="px-2.5 py-1 rounded-md bg-[#310111] hover:bg-[#5C0A24] text-[#FBF3E2] border border-[#F2D69D]/30 cursor-pointer"
                  >
                    rea doctor
                  </button>
                  <button
                    onClick={() => executeTerminalCmd('rea providers')}
                    className="px-2.5 py-1 rounded-md bg-[#310111] hover:bg-[#5C0A24] text-[#FBF3E2] border border-[#F2D69D]/30 cursor-pointer"
                  >
                    rea providers
                  </button>
                  <button
                    onClick={() => executeTerminalCmd('rea setup --dry-run')}
                    className="px-2.5 py-1 rounded-md bg-[#310111] hover:bg-[#5C0A24] text-[#FBF3E2] border border-[#F2D69D]/30 cursor-pointer"
                  >
                    rea setup
                  </button>
                  <button
                    onClick={() => executeTerminalCmd('clear')}
                    className="px-2.5 py-1 rounded-md bg-[#310111] hover:bg-[#5C0A24] text-[#FBF3E2] border border-[#F2D69D]/30 cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="p-5 space-y-1.5 min-h-[340px] max-h-[480px] overflow-y-auto text-xs leading-relaxed">
                {terminalHistory.map((item, idx) => {
                  let color = 'text-[#FBF3E2]/85';
                  if (item.type === 'cmd') color = 'text-[#D5991C] font-bold';
                  else if (item.type === 'success') color = 'text-[#00A878] font-semibold';
                  else if (item.type === 'warn') color = 'text-[#F2D69D] font-bold';
                  else if (item.type === 'info') color = 'text-[#FBF3E2]/75';

                  return (
                    <div key={idx} className={color}>
                      {item.text}
                    </div>
                  );
                })}
                <div ref={terminalEndRef} />
              </div>

              <div className="bg-[#1C030D] px-4 py-3 border-t border-[#F2D69D]/20 flex items-center space-x-2">
                <span className="text-[#D5991C] font-bold">rea &gt;</span>
                <input
                  type="text"
                  value={terminalInput}
                  onChange={(e) => setTerminalInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      executeTerminalCmd(terminalInput);
                    }
                  }}
                  placeholder="Type a command (doctor, providers, setup --dry-run, inspect /path)..."
                  className="w-full bg-transparent text-[#FBF3E2] focus:outline-hidden font-mono text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 5: SETUP MANAGER */}
        {activeView === 'setupManager' && (
          <div className="space-y-6">
            <div className="rounded-2xl bg-[#FAF2E1] border border-[#F2D69D] p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2D69D] pb-3">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#410217]">
                    Connect REA to Your AI Coding Agent
                  </h3>
                  <p className="text-xs sm:text-sm text-[#410217]/75 font-sans mt-0.5">
                    How REA registers its 133 local inspection tools with Antigravity, Claude Code, and Gemini CLI.
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#FBF3E2] border border-[#F2D69D] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-base text-[#410217]">Antigravity MCP Server Registration</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#00A878]/15 text-[#00A878] text-[11px] font-bold">
                      Supported
                    </span>
                  </div>
                  <p className="text-xs text-[#410217]/80 font-sans leading-relaxed">
                    Registers the REA MCP server so your agent can inspect native binaries, Electron apps, and web bundles directly inside your workspace.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FBF3E2] border border-[#F2D69D] space-y-1.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-base text-[#410217]">Reverse-Engineer-Anything Skill Guide</span>
                    <span className="px-2.5 py-0.5 rounded-full bg-[#00A878]/15 text-[#00A878] text-[11px] font-bold">
                      Included
                    </span>
                  </div>
                  <p className="text-xs text-[#410217]/80 font-sans leading-relaxed">
                    Provides step-by-step instructions so the agent gathers concrete evidence from binaries before proposing clean-room code.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Setup Modal */}
      {isSetupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#410217]/60 backdrop-blur-xs p-4">
          <div className="rounded-2xl bg-[#FAF2E1] border-2 border-[#F2D69D] shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2D69D] pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#D5991C]" />
                <h3 className="font-serif font-bold text-xl text-[#410217]">
                  Connect REA MCP Tools
                </h3>
              </div>
              <button
                onClick={() => setIsSetupModalOpen(false)}
                className="text-xs font-semibold text-[#410217]/60 hover:text-[#410217] cursor-pointer"
              >
                ✕ Close
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#410217]/80 leading-relaxed font-sans">
              Connects REA&apos;s 133 local reverse-engineering tools to your coding agent environment so it can inspect apps and binaries without guesswork.
            </p>

            <div className="p-3.5 rounded-xl bg-[#FBF3E2] border border-[#F2D69D] font-mono text-xs space-y-1">
              <div className="font-bold text-[#410217]">Configuration Summary:</div>
              <div className="text-[11px] text-[#575F62]">
                • Server Command: <code>npx -y rea-agents@6.3.0 mcp</code>
              </div>
              <div className="text-[11px] text-[#575F62]">
                • Skill Guide: <code>.agents/skills/reverse-engineer-anything/SKILL.md</code>
              </div>
            </div>

            {setupApplied && (
              <div className="p-3 rounded-xl bg-[#00A878]/15 border border-[#00A878]/40 text-[#00A878] text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>REA MCP tools connected and ready in your session.</span>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsSetupModalOpen(false)}
                className="px-4 py-2 rounded-lg border border-[#410217]/25 text-[#410217] text-xs font-semibold cursor-pointer hover:bg-[#F2D69D]/40"
              >
                Cancel
              </button>

              <button
                onClick={() => {
                  setSetupApplied(true);
                  triggerToast('REA MCP integration confirmed!');
                  setTimeout(() => {
                    setIsSetupModalOpen(false);
                    setSetupApplied(false);
                  }, 1500);
                }}
                className="px-5 py-2 rounded-lg bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] text-xs font-semibold cursor-pointer"
              >
                Confirm &amp; Activate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
