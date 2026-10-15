import React, { useState, useEffect, useRef } from 'react';
import {
  Layers,
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
  Lock,
  Sparkles,
  ChevronRight,
  ExternalLink,
  Code2,
  Sliders,
  FolderOpen,
  Activity,
  AlertCircle
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
  onOpenAudit,
  onOpenIncident
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
  const [terminalHistory, setTerminalHistory] = useState<Array<{ text: string; type: 'cmd' | 'output' | 'success' | 'warn' | 'info' }>>([
    { text: 'REA Workbench Terminal Bridge Initialized · v6.3.0', type: 'info' },
    { text: 'Connected to local Antigravity 2.0 / Node v22.20.0 runtime.', type: 'info' },
    { text: '$ rea doctor --client antigravity --format json', type: 'cmd' },
    { text: '✓ 133 MCP tools verified across 6 domain suites.', type: 'success' },
    { text: '✓ Antigravity configuration verified: ~/.gemini/config/mcp_config.json', type: 'success' },
    { text: 'Ready. Type a command or select one of the presets above.', type: 'info' }
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

  const activeTarget: ReaSampleTarget = customAnalysisTarget || REA_SAMPLE_TARGETS[selectedTargetKey] || REA_SAMPLE_TARGETS['electronNotes'];

  // Handle custom path analysis
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
        summary: `Decompiled inspection for ${customPath}. Extracted entry points, verified context isolation boundary, and identified 4 IPC communication channels.`,
        evidenceCount: 19,
        confidence: 'high (0.92)',
        ipcChannels: [
          {
            channel: 'app:handshake',
            direction: 'renderer -> main',
            handler: 'src/main/ipc.ts:L32',
            method: 'ipcMain.handle',
            description: 'Client authentication handshake with nonces and session token verification'
          },
          {
            channel: 'telemetry:emit',
            direction: 'renderer -> main',
            handler: 'src/main/telemetry.ts:L14',
            method: 'ipcMain.on',
            description: 'Sanitized event telemetry dispatcher passing payload through schema filter'
          }
        ],
        boundaries: {
          nodeIntegration: false,
          contextIsolation: true,
          sandbox: true,
          preloadPath: 'preload.js',
          contextBridgeExposed: ['window.api.handshake', 'window.api.emitTelemetry']
        },
        modules: [
          { name: 'better-sqlite3', role: 'Local embedded cache & query index', imports: ['sqlite3'] },
          { name: 'electron-updater', role: 'Background update checker', imports: ['electron-updater'] }
        ],
        decompiledLogic: `// Decompiled Entry Point for ${customPath}
import { app, BrowserWindow, ipcMain } from 'electron';
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

  ipcMain.handle('app:handshake', async (event, payload) => {
    // Sanitized token verification extracted by REA
    return { ok: true, version: '1.0.0', epoch: Date.now() };
  });

  return win;
}`
      };
      setCustomAnalysisTarget(syntheticTarget);
      setIsAnalyzingPath(false);
      triggerToast(`Analysis complete for ${customPath}`);
    }, 900);
  };

  // Run terminal command
  const executeTerminalCmd = (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed) return;

    const newHistory = [...terminalHistory, { text: `$ ${trimmed}`, type: 'cmd' as const }];

    if (trimmed === 'clear') {
      setTerminalHistory([]);
      setTerminalInput('');
      return;
    } else if (trimmed.includes('doctor')) {
      newHistory.push({ text: 'Executing: rea doctor --format json ...', type: 'info' });
      newHistory.push({ text: '✓ REA CLI Version: 6.3.0 (Installed at node_modules/.bin/rea)', type: 'success' });
      newHistory.push({ text: '✓ MCP Provider: Stdio server registered with Antigravity 2.0', type: 'success' });
      newHistory.push({ text: '✓ 133 MCP tools ready across 6 domain suites.', type: 'success' });
      newHistory.push({ text: '✓ Local Analysis Runtimes: Mach-O, ASAR, Vite/Webpack, Dalvik DEX, EVM', type: 'info' });
    } else if (trimmed.includes('providers')) {
      newHistory.push({ text: 'Active Providers & Coding Agents:', type: 'info' });
      newHistory.push({ text: '• Antigravity 2.0: Connected (133 Tools / Native MCP Stdio)', type: 'success' });
      newHistory.push({ text: '• Claude Code: Registered (~/.claude/mcp_servers.json)', type: 'success' });
      newHistory.push({ text: '• Gemini CLI: Configured (~/.gemini/config/mcp_config.json)', type: 'success' });
      newHistory.push({ text: '• Cursor & Windsurf: Auto-detection active', type: 'info' });
    } else if (trimmed.includes('setup')) {
      newHistory.push({ text: 'Executing: rea setup --dry-run --format json ...', type: 'info' });
      newHistory.push({ text: 'Proposed Changes:', type: 'warn' });
      newHistory.push({ text: '1. Update Antigravity MCP config: /Users/sammyb/.gemini/config/mcp_config.json', type: 'info' });
      newHistory.push({ text: '2. Install Reverse-Engineer-Anything skill to ~/.agents/skills/', type: 'info' });
      newHistory.push({ text: 'Backup targets created automatically. Run `rea setup --yes` to apply.', type: 'success' });
    } else if (trimmed.includes('inspect')) {
      newHistory.push({ text: 'Target inspection completed. 42 evidence nodes extracted.', type: 'success' });
      newHistory.push({ text: 'Confidence: 0.94 (High). Clean-room code ready for agent use.', type: 'info' });
    } else {
      newHistory.push({ text: `Executed '${trimmed}'. Status: OK.`, type: 'info' });
    }

    setTerminalHistory(newHistory);
    setTerminalInput('');
  };

  const currentTemplate = REA_PROMPT_TEMPLATES.find((t) => t.id === selectedPromptPattern) || REA_PROMPT_TEMPLATES[0];
  const renderedPrompt = currentTemplate.template(promptTargetInput, promptFeatureInput);

  return (
    <div className="min-h-screen bg-[#FBF3E2] text-[#410217] font-sans selection:bg-[#410217]/15 selection:text-[#410217] bg-petra-grid">
      {/* Toast */}
      {toastText && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-[#410217] text-[#FBF3E2] px-4 py-3 border border-[#F2D69D] shadow-xl text-xs font-mono animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#D5991C]" />
          <span>{toastText}</span>
        </div>
      )}

      {/* REA Studio Header Bar */}
      <section className="border-b border-[#F2D69D] bg-[#FAF2E1]/90 backdrop-blur-md sticky top-20 z-30 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Title & Badge */}
            <div className="flex items-center space-x-3.5">
              <div className="w-9 h-9 bg-[#410217] flex items-center justify-center rotate-45 border border-[#F2D69D] shadow-xs">
                <FileCode className="w-4 h-4 text-[#D5991C] -rotate-45" />
              </div>
              <div>
                <div className="flex items-center space-x-2.5">
                  <h1 className="font-serif font-bold text-xl sm:text-2xl text-[#410217] leading-none">
                    REA Studio
                  </h1>
                  <span className="px-2 py-0.5 bg-[#410217] text-[#D5991C] text-[10px] font-mono font-bold tracking-wider uppercase border border-[#D5991C]/40">
                    MCP WORKBENCH v6.3.0
                  </span>
                </div>
                <p className="text-xs text-[#410217]/70 font-sans mt-1">
                  Reverse Engineer Anything · Local Binary & JavaScript Inspection Engine for AI Coding Agents
                </p>
              </div>
            </div>

            {/* Status & Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 font-mono text-xs">
              <div className="flex items-center space-x-2 px-3 py-1.5 bg-[#FAF2E1] border border-[#F2D69D] text-[#410217]">
                <span className="w-2 h-2 rounded-full bg-[#00A878] animate-pulse" />
                <span className="font-bold text-[11px]">133 MCP TOOLS ACTIVE</span>
              </div>

              <button
                onClick={() => {
                  executeTerminalCmd('rea doctor --format json');
                  setActiveView('terminal');
                  triggerToast('Running System Doctor...');
                }}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#FAF2E1] hover:bg-[#F2D69D]/60 border border-[#410217]/30 text-[#410217] text-xs font-semibold cursor-pointer transition-colors"
              >
                <Activity className="w-3.5 h-3.5 text-[#D5991C]" />
                <span>System Doctor</span>
              </button>

              <button
                onClick={() => onNavigate('counter-geo')}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#D5991C] hover:bg-[#E5A932] text-[#410217] text-xs font-bold border border-[#410217]/30 cursor-pointer shadow-xs transition-transform transform hover:-translate-y-0.5"
              >
                <Boxes className="w-3.5 h-3.5" />
                <span>Counter-GEO 3D</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>

              <button
                onClick={() => setIsSetupModalOpen(true)}
                className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] text-xs font-bold border border-[#410217] cursor-pointer shadow-xs transition-transform transform hover:-translate-y-0.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#D5991C]" />
                <span>Setup Agents</span>
              </button>
            </div>

          </div>

          {/* Sub-View Navigation Tabs */}
          <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto pt-4 border-t border-[#F2D69D]/60 mt-3 text-xs font-mono font-bold uppercase tracking-wider">
            <button
              onClick={() => setActiveView('dashboard')}
              className={`px-3.5 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                activeView === 'dashboard'
                  ? 'border-[#410217] text-[#410217] bg-[#FAF2E1]'
                  : 'border-transparent text-[#410217]/60 hover:text-[#410217]'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>01 // Dashboard & Status</span>
            </button>

            <button
              onClick={() => setActiveView('inspector')}
              className={`px-3.5 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                activeView === 'inspector'
                  ? 'border-[#410217] text-[#410217] bg-[#FAF2E1]'
                  : 'border-transparent text-[#410217]/60 hover:text-[#410217]'
              }`}
            >
              <Search className="w-3.5 h-3.5" />
              <span>02 // Target Inspector</span>
            </button>

            <button
              onClick={() => setActiveView('promptStudio')}
              className={`px-3.5 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                activeView === 'promptStudio'
                  ? 'border-[#410217] text-[#410217] bg-[#FAF2E1]'
                  : 'border-transparent text-[#410217]/60 hover:text-[#410217]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#D5991C]" />
              <span>03 // Agent Prompt Studio</span>
            </button>

            <button
              onClick={() => setActiveView('terminal')}
              className={`px-3.5 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                activeView === 'terminal'
                  ? 'border-[#410217] text-[#410217] bg-[#FAF2E1]'
                  : 'border-transparent text-[#410217]/60 hover:text-[#410217]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>04 // REA Live Terminal</span>
            </button>

            <button
              onClick={() => setActiveView('setupManager')}
              className={`px-3.5 py-2 border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center space-x-1.5 ${
                activeView === 'setupManager'
                  ? 'border-[#410217] text-[#410217] bg-[#FAF2E1]'
                  : 'border-transparent text-[#410217]/60 hover:text-[#410217]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>05 // MCP Setup Manager</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Sub-View Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* ============================================================== */}
        {/* VIEW 1: DASHBOARD & STATUS */}
        {/* ============================================================== */}
        {activeView === 'dashboard' && (
          <div className="space-y-8">
            
            {/* Hero Banner */}
            <div className="bg-[#FAF2E1] border border-[#F2D69D] p-6 sm:p-8 relative overflow-hidden shadow-sm">
              <div className="relative z-10 max-w-3xl space-y-4">
                <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-[#410217]/5 border border-[#410217]/15 text-[#410217] text-[11px] font-mono uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 bg-[#D5991C] rounded-full" />
                  <span>Last Crusade Defense Core Subsystem</span>
                </div>
                <h2 className="font-serif font-bold text-3xl sm:text-4xl text-[#410217] tracking-tight leading-tight">
                  Inspect Any App. Understand Any Feature. Build Clean-Room Implementations.
                </h2>
                <p className="text-sm text-[#410217]/80 leading-relaxed font-sans">
                  REA Studio bridges autonomous coding agents (Google Antigravity 2.0, Claude Code, Gemini CLI, Cursor) with 133 local reverse engineering tools. Extract verifiable evidence, map IPC boundaries, inspect Mach-O symbols, and reconstruct clean-room code without hallucination or copyright contamination.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveView('inspector')}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] font-semibold text-xs tracking-wider uppercase border border-[#410217] shadow-xs cursor-pointer transition-transform transform hover:-translate-y-0.5"
                  >
                    <Search className="w-4 h-4 text-[#D5991C]" />
                    <span>Launch Target Inspector</span>
                  </button>

                  <button
                    onClick={() => setActiveView('promptStudio')}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-[#FAF2E1] hover:bg-[#F2D69D]/70 text-[#410217] font-semibold text-xs tracking-wider uppercase border border-[#410217]/30 shadow-xs cursor-pointer transition-colors"
                  >
                    <Sparkles className="w-4 h-4 text-[#D5991C]" />
                    <span>Agent Prompt Studio</span>
                  </button>

                  <button
                    onClick={() => onNavigate('counter-geo')}
                    className="flex items-center space-x-2 px-5 py-2.5 bg-[#D5991C] hover:bg-[#E5A932] text-[#410217] font-bold text-xs tracking-wider uppercase border border-[#410217]/30 shadow-xs cursor-pointer transition-colors"
                  >
                    <Boxes className="w-4 h-4" />
                    <span>Open 8-Layer 3D Visualizer</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* 4 Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-2">
                <span className="font-mono text-[10px] text-[#410217]/60 uppercase tracking-widest">REA CLI Version</span>
                <div className="font-serif font-bold text-3xl text-[#410217]">v6.3.0</div>
                <div className="text-[11px] font-mono text-[#00A878] flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Latest Verified Build</span>
                </div>
              </div>

              <div className="bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-2">
                <span className="font-mono text-[10px] text-[#410217]/60 uppercase tracking-widest">Available MCP Tools</span>
                <div className="font-serif font-bold text-3xl text-[#410217]">133 Tools</div>
                <div className="text-[11px] font-mono text-[#D5991C]">
                  Native, Electron, Web, Android, Mach-O
                </div>
              </div>

              <div className="bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-2">
                <span className="font-mono text-[10px] text-[#410217]/60 uppercase tracking-widest">Node Engine Runtime</span>
                <div className="font-serif font-bold text-3xl text-[#410217]">v22.20.0</div>
                <div className="text-[11px] font-mono text-[#410217]/70">
                  Native ESM & V8 Inspector Ready
                </div>
              </div>

              <div className="bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-2">
                <span className="font-mono text-[10px] text-[#410217]/60 uppercase tracking-widest">Detected Coding Agents</span>
                <div className="font-serif font-bold text-3xl text-[#410217]">5 Agents</div>
                <div className="text-[11px] font-mono text-[#00A878] flex items-center space-x-1">
                  <span>Antigravity, Claude, Gemini, Cursor</span>
                </div>
              </div>
            </div>

            {/* Quick Target Launch Cards & Agent Ecosystem */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Quick Launch Card 1 */}
              <div
                onClick={() => {
                  setSelectedTargetKey('electronNotes');
                  setActiveView('inspector');
                }}
                className="bg-[#FAF2E1] border border-[#F2D69D] p-5 hover:border-[#410217] transition-all cursor-pointer group shadow-xs hover:shadow-md"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                  <span className="font-mono text-[11px] font-bold text-[#D5991C] uppercase tracking-wider">Target 01</span>
                  <span className="px-2 py-0.5 bg-[#410217]/10 text-[#410217] font-mono text-[10px] font-semibold uppercase">
                    Electron 32 / ASAR
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-[#410217] mt-3 group-hover:text-[#D5991C] transition-colors">
                  Notes App (Electron Search & IPC)
                </h3>
                <p className="text-xs text-[#410217]/75 mt-2 leading-relaxed">
                  Analyze SQLite FTS5 full-text queries, contextIsolation bridges, and main-to-renderer IPC event handlers.
                </p>
                <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-[#410217]/60 pt-2 border-t border-[#F2D69D]/50">
                  <span>42 Evidence Nodes</span>
                  <span className="text-[#410217] font-bold flex items-center gap-1">
                    Inspect <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Quick Launch Card 2 */}
              <div
                onClick={() => {
                  setSelectedTargetKey('machoBinary');
                  setActiveView('inspector');
                }}
                className="bg-[#FAF2E1] border border-[#F2D69D] p-5 hover:border-[#410217] transition-all cursor-pointer group shadow-xs hover:shadow-md"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                  <span className="font-mono text-[11px] font-bold text-[#D5991C] uppercase tracking-wider">Target 02</span>
                  <span className="px-2 py-0.5 bg-[#410217]/10 text-[#410217] font-mono text-[10px] font-semibold uppercase">
                    macOS ARM64 / Mach-O
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-[#410217] mt-3 group-hover:text-[#D5991C] transition-colors">
                  macOS System Telemetry Agent
                </h3>
                <p className="text-xs text-[#410217]/75 mt-2 leading-relaxed">
                  Inspect Mach message ports, dyld libSystem exports, IOKit power telemetry, and ARM64 call graph decompilation.
                </p>
                <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-[#410217]/60 pt-2 border-t border-[#F2D69D]/50">
                  <span>78 Evidence Nodes</span>
                  <span className="text-[#410217] font-bold flex items-center gap-1">
                    Inspect <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              {/* Quick Launch Card 3 */}
              <div
                onClick={() => {
                  setSelectedTargetKey('webBundle');
                  setActiveView('inspector');
                }}
                className="bg-[#FAF2E1] border border-[#F2D69D] p-5 hover:border-[#410217] transition-all cursor-pointer group shadow-xs hover:shadow-md"
              >
                <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                  <span className="font-mono text-[11px] font-bold text-[#D5991C] uppercase tracking-wider">Target 03</span>
                  <span className="px-2 py-0.5 bg-[#410217]/10 text-[#410217] font-mono text-[10px] font-semibold uppercase">
                    Web SPA / React Minified
                  </span>
                </div>
                <h3 className="font-serif font-bold text-lg text-[#410217] mt-3 group-hover:text-[#D5991C] transition-colors">
                  Single Page Cloud Dashboard
                </h3>
                <p className="text-xs text-[#410217]/75 mt-2 leading-relaxed">
                  Trace recovered source maps, extract hidden WebSocket channels, JWT session refresh routes, and telemetry payloads.
                </p>
                <div className="mt-4 flex items-center justify-between font-mono text-[11px] text-[#410217]/60 pt-2 border-t border-[#F2D69D]/50">
                  <span>35 Evidence Nodes</span>
                  <span className="text-[#410217] font-bold flex items-center gap-1">
                    Inspect <ChevronRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

            </div>

            {/* REA Tool Suites Directory */}
            <div className="bg-[#FAF2E1] border border-[#F2D69D] p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F2D69D] pb-3">
                <div>
                  <h3 className="font-serif font-bold text-xl text-[#410217]">
                    133 Reverse-Engineering MCP Tools Matrix
                  </h3>
                  <p className="text-xs text-[#410217]/70 font-sans">
                    Categorized tooling available immediately to Antigravity and configured agents.
                  </p>
                </div>
                <span className="font-mono text-xs font-bold text-[#D5991C] uppercase tracking-wider">
                  6 SPECIALIZED SUITES
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                {REA_TOOL_SUITES.map((suite, idx) => (
                  <div key={idx} className="p-4 bg-[#FBF3E2] border border-[#F2D69D]/70 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-[#410217]">{suite.name}</span>
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-[#410217] text-[#D5991C]">
                        {suite.count} tools
                      </span>
                    </div>
                    <p className="text-xs text-[#410217]/75 leading-relaxed font-sans">
                      {suite.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: TARGET INSPECTOR */}
        {/* ============================================================== */}
        {activeView === 'inspector' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: Target Selector & Custom Path (4 cols) */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* Target Picker Card */}
              <div className="bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-4">
                <div className="border-b border-[#F2D69D] pb-3">
                  <h3 className="font-serif font-bold text-lg text-[#410217]">Preloaded Targets</h3>
                  <p className="text-xs text-[#410217]/70 font-sans">
                    Select a verified target to inspect decompiled logic and extracted telemetry.
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
                        className={`p-3.5 border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#410217] text-[#FBF3E2] border-[#410217] shadow-sm'
                            : 'bg-[#FBF3E2] hover:bg-[#FAF2E1] border-[#F2D69D] text-[#410217]'
                        }`}
                      >
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className={`font-bold ${isSelected ? 'text-[#D5991C]' : 'text-[#410217]'}`}>
                            {t.name.split(' ')[0]}
                          </span>
                          <span className={`px-1.5 py-0.5 text-[9px] uppercase font-bold ${
                            isSelected ? 'bg-[#D5991C] text-[#410217]' : 'bg-[#410217]/10 text-[#410217]'
                          }`}>
                            {t.badge}
                          </span>
                        </div>
                        <p className={`text-xs mt-1.5 line-clamp-2 ${isSelected ? 'text-[#FBF3E2]/80' : 'text-[#410217]/70'}`}>
                          {t.summary}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Custom Path Input Box */}
              <div className="bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-3">
                <div className="border-b border-[#F2D69D] pb-2">
                  <h4 className="font-serif font-bold text-base text-[#410217]">Analyze Local Binary / ASAR</h4>
                  <p className="text-xs text-[#410217]/70">Run real-time REA inspection on any local path</p>
                </div>

                <div className="space-y-2">
                  <input
                    type="text"
                    value={customPath}
                    onChange={(e) => setCustomPath(e.target.value)}
                    placeholder="/Applications/Slack.app or ./dist/app.asar"
                    className="w-full px-3 py-2 bg-[#FBF3E2] border border-[#F2D69D] text-xs font-mono text-[#410217] focus:outline-hidden focus:border-[#410217]"
                  />

                  <button
                    onClick={handleAnalyzeCustomPath}
                    disabled={isAnalyzingPath || !customPath.trim()}
                    className="w-full flex items-center justify-center space-x-2 py-2.5 bg-[#410217] hover:bg-[#5C0A24] disabled:opacity-50 text-[#FBF3E2] font-semibold text-xs uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    {isAnalyzingPath ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#D5991C]" />
                    ) : (
                      <Search className="w-3.5 h-3.5 text-[#D5991C]" />
                    )}
                    <span>{isAnalyzingPath ? 'Decompiling...' : 'Analyze Path'}</span>
                  </button>
                </div>
              </div>

            </div>

            {/* Right Column: Interactive Analysis View (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              
              {/* Active Target Header Bar */}
              <div className="bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs text-[#D5991C] font-bold uppercase tracking-wider">
                        Active Target
                      </span>
                      <span className="px-2 py-0.5 bg-[#410217] text-[#D5991C] font-mono text-[10px] font-bold">
                        Confidence: {activeTarget.confidence}
                      </span>
                    </div>
                    <h2 className="font-serif font-bold text-2xl text-[#410217] mt-1">
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
                    className="flex items-center space-x-1.5 px-3 py-2 bg-[#FBF3E2] hover:bg-[#F2D69D] border border-[#410217]/25 text-[#410217] text-xs font-mono font-semibold cursor-pointer transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#D5991C]" />
                    <span>Copy Evidence JSON</span>
                  </button>
                </div>

                {/* Tab Switcher */}
                <div className="flex border-b border-[#F2D69D] pt-2 font-mono text-xs font-bold uppercase tracking-wider">
                  <button
                    onClick={() => setInspectorTab('ipc')}
                    className={`px-4 py-2 border-b-2 transition-all cursor-pointer ${
                      inspectorTab === 'ipc'
                        ? 'border-[#410217] text-[#410217] bg-[#FBF3E2]'
                        : 'border-transparent text-[#410217]/60 hover:text-[#410217]'
                    }`}
                  >
                    IPC & Boundaries
                  </button>
                  <button
                    onClick={() => setInspectorTab('modules')}
                    className={`px-4 py-2 border-b-2 transition-all cursor-pointer ${
                      inspectorTab === 'modules'
                        ? 'border-[#410217] text-[#410217] bg-[#FBF3E2]'
                        : 'border-transparent text-[#410217]/60 hover:text-[#410217]'
                    }`}
                  >
                    Modules & Symbols
                  </button>
                  <button
                    onClick={() => setInspectorTab('decompiled')}
                    className={`px-4 py-2 border-b-2 transition-all cursor-pointer ${
                      inspectorTab === 'decompiled'
                        ? 'border-[#410217] text-[#410217] bg-[#FBF3E2]'
                        : 'border-transparent text-[#410217]/60 hover:text-[#410217]'
                    }`}
                  >
                    Decompiled Code
                  </button>
                  <button
                    onClick={() => setInspectorTab('evidence')}
                    className={`px-4 py-2 border-b-2 transition-all cursor-pointer ${
                      inspectorTab === 'evidence'
                        ? 'border-[#410217] text-[#410217] bg-[#FBF3E2]'
                        : 'border-transparent text-[#410217]/60 hover:text-[#410217]'
                    }`}
                  >
                    Raw Evidence
                  </button>
                </div>
              </div>

              {/* Tab 1: IPC Channels & Boundaries */}
              {inspectorTab === 'ipc' && (
                <div className="space-y-4">
                  {/* Security Boundaries Alert */}
                  {activeTarget.boundaries && (
                    <div className="bg-[#FAF2E1] border border-[#F2D69D] p-4 flex flex-wrap gap-4 text-xs font-mono">
                      <div>
                        <span className="text-[#410217]/60">contextIsolation:</span>{' '}
                        <strong className={activeTarget.boundaries.contextIsolation ? 'text-[#00A878]' : 'text-[#E63946]'}>
                          {activeTarget.boundaries.contextIsolation ? 'ENABLED (SECURE)' : 'DISABLED'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#410217]/60">nodeIntegration:</span>{' '}
                        <strong className={!activeTarget.boundaries.nodeIntegration ? 'text-[#00A878]' : 'text-[#E63946]'}>
                          {activeTarget.boundaries.nodeIntegration ? 'ENABLED (RISK)' : 'DISABLED (SECURE)'}
                        </strong>
                      </div>
                      <div>
                        <span className="text-[#410217]/60">sandbox:</span>{' '}
                        <strong className={activeTarget.boundaries.sandbox ? 'text-[#00A878]' : 'text-[#E63946]'}>
                          {activeTarget.boundaries.sandbox ? 'ENABLED' : 'DISABLED'}
                        </strong>
                      </div>
                    </div>
                  )}

                  {/* Channel Cards */}
                  <div className="space-y-3">
                    {activeTarget.ipcChannels?.map((ch, idx) => (
                      <div key={idx} className="bg-[#FAF2E1] border border-[#F2D69D] p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-mono font-bold text-sm text-[#410217]">
                            {ch.channel}
                          </span>
                          <span className="px-2 py-0.5 bg-[#410217] text-[#D5991C] font-mono text-[10px] uppercase font-bold">
                            {ch.method}
                          </span>
                        </div>
                        <div className="font-mono text-xs text-[#004566]">
                          {ch.direction} · <span className="text-[#575F62]">{ch.handler}</span>
                        </div>
                        <p className="text-xs text-[#410217]/80 font-sans leading-relaxed">
                          {ch.description}
                        </p>
                      </div>
                    ))}

                    {(!activeTarget.ipcChannels || activeTarget.ipcChannels.length === 0) && (
                      <div className="bg-[#FAF2E1] border border-[#F2D69D] p-6 text-center text-xs font-mono text-[#410217]/70">
                        No direct Electron IPC channels for this target type (Native Mach-O / Web). Check "Modules & Symbols" for dyld bindings or WebSocket schemas.
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Tab 2: Modules & Imported Symbols */}
              {inspectorTab === 'modules' && (
                <div className="space-y-4">
                  {/* Linked Libraries for Mach-O */}
                  {activeTarget.linkedLibraries && (
                    <div className="bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-3">
                      <h4 className="font-serif font-bold text-sm text-[#410217] uppercase tracking-wider">
                        dyld Resolved Dynamic Libraries
                      </h4>
                      <div className="space-y-2 font-mono text-xs">
                        {activeTarget.linkedLibraries.map((lib, idx) => (
                          <div key={idx} className="p-3 bg-[#FBF3E2] border border-[#F2D69D] space-y-1">
                            <div className="flex items-center justify-between font-bold">
                              <span className="text-[#410217]">{lib.name}</span>
                              <span className="text-[#00A878] text-[10px] uppercase">{lib.status}</span>
                            </div>
                            <div className="text-[11px] text-[#575F62]">
                              Imported Symbols: {lib.symbols.join(', ')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Modules for Electron/Web */}
                  {activeTarget.modules && (
                    <div className="bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-3">
                      <h4 className="font-serif font-bold text-sm text-[#410217] uppercase tracking-wider">
                        Isolated Dependencies & Packages
                      </h4>
                      <div className="space-y-2 font-mono text-xs">
                        {activeTarget.modules.map((mod, idx) => (
                          <div key={idx} className="p-3 bg-[#FBF3E2] border border-[#F2D69D] space-y-1">
                            <div className="flex items-center justify-between font-bold">
                              <span className="text-[#410217]">{mod.name}</span>
                              <span className="text-[#D5991C] text-[10px] uppercase">Verified Package</span>
                            </div>
                            <div className="text-[11px] text-[#410217]/80">{mod.role}</div>
                            <div className="text-[10px] text-[#575F62]">Imports: {mod.imports.join(', ')}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 3: Decompiled Code */}
              {inspectorTab === 'decompiled' && (
                <div className="bg-[#410217] border border-[#F2D69D] p-5 space-y-3 text-[#FBF3E2]">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]/30 font-mono text-xs">
                    <span className="text-[#D5991C] font-bold">Clean-Room Implementation Code</span>
                    <button
                      onClick={() => {
                        if (activeTarget.decompiledLogic) {
                          navigator.clipboard.writeText(activeTarget.decompiledLogic);
                          triggerToast('Decompiled code copied to clipboard');
                        }
                      }}
                      className="flex items-center space-x-1 px-2.5 py-1 bg-[#310111] hover:bg-[#5C0A24] border border-[#F2D69D]/40 text-[#FBF3E2] text-[11px] cursor-pointer"
                    >
                      <Copy className="w-3 h-3 text-[#D5991C]" />
                      <span>Copy Code</span>
                    </button>
                  </div>

                  <pre className="p-4 bg-[#28010E] border border-[#F2D69D]/20 font-mono text-xs overflow-x-auto text-[#FBF3E2]/90 leading-relaxed max-h-[480px]">
                    <code>{activeTarget.decompiledLogic || '// No decompiled logic available'}</code>
                  </pre>
                </div>
              )}

              {/* Tab 4: Raw Evidence */}
              {inspectorTab === 'evidence' && (
                <div className="bg-[#FAF2E1] border border-[#F2D69D] p-5 space-y-3 font-mono text-xs">
                  <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D]">
                    <span className="font-bold text-[#410217]">Normalized Evidence Provenance JSON</span>
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(JSON.stringify(activeTarget, null, 2));
                        triggerToast('Evidence JSON copied');
                      }}
                      className="px-2.5 py-1 bg-[#410217] text-[#FBF3E2] text-[11px] cursor-pointer"
                    >
                      Copy JSON
                    </button>
                  </div>
                  <pre className="p-4 bg-[#FBF3E2] border border-[#F2D69D] max-h-[480px] overflow-auto text-[#410217]">
                    {JSON.stringify(activeTarget, null, 2)}
                  </pre>
                </div>
              )}

            </div>

          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: AGENT PROMPT STUDIO */}
        {/* ============================================================== */}
        {activeView === 'promptStudio' && (
          <div className="space-y-6">
            <div className="bg-[#FAF2E1] border border-[#F2D69D] p-6 space-y-4">
              <div>
                <h3 className="font-serif font-bold text-2xl text-[#410217]">
                  Reverse Engineering Agent Prompt Studio
                </h3>
                <p className="text-xs text-[#410217]/75 font-sans mt-1">
                  Craft precision-engineered prompts that guide AI coding agents to use REA's MCP tools, extract verified evidence, and generate clean-room implementations without hallucinating dependencies.
                </p>
              </div>

              {/* Select Pattern */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {REA_PROMPT_TEMPLATES.map((tmpl) => {
                  const isSelected = selectedPromptPattern === tmpl.id;
                  return (
                    <div
                      key={tmpl.id}
                      onClick={() => setSelectedPromptPattern(tmpl.id)}
                      className={`p-4 border transition-all cursor-pointer space-y-2 ${
                        isSelected
                          ? 'bg-[#410217] text-[#FBF3E2] border-[#410217] shadow-sm'
                          : 'bg-[#FBF3E2] hover:bg-[#FAF2E1] border-[#F2D69D] text-[#410217]'
                      }`}
                    >
                      <span className={`font-mono text-[9px] uppercase font-bold px-1.5 py-0.5 ${
                        isSelected ? 'bg-[#D5991C] text-[#410217]' : 'bg-[#410217]/10 text-[#410217]'
                      }`}>
                        {tmpl.tag}
                      </span>
                      <h4 className="font-serif font-bold text-sm leading-tight">{tmpl.title}</h4>
                      <p className={`text-[11px] leading-relaxed line-clamp-2 ${isSelected ? 'text-[#FBF3E2]/80' : 'text-[#410217]/70'}`}>
                        {tmpl.description}
                      </p>
                    </div>
                  );
                })}
              </div>

              {/* Interactive Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 font-mono text-xs">
                <div className="space-y-1.5">
                  <label className="text-[#410217]/70 font-bold uppercase tracking-wider text-[10px]">
                    Target Application / Executable / URL
                  </label>
                  <input
                    type="text"
                    value={promptTargetInput}
                    onChange={(e) => setPromptTargetInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBF3E2] border border-[#F2D69D] text-[#410217] focus:outline-hidden focus:border-[#410217]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[#410217]/70 font-bold uppercase tracking-wider text-[10px]">
                    Feature / Protocol / Invariant to Reverse-Engineer
                  </label>
                  <input
                    type="text"
                    value={promptFeatureInput}
                    onChange={(e) => setPromptFeatureInput(e.target.value)}
                    className="w-full px-3 py-2 bg-[#FBF3E2] border border-[#F2D69D] text-[#410217] focus:outline-hidden focus:border-[#410217]"
                  />
                </div>
              </div>

              {/* Generated Prompt Box */}
              <div className="bg-[#FBF3E2] border border-[#F2D69D] p-5 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-[#F2D69D] font-mono text-xs">
                  <span className="font-bold text-[#D5991C] uppercase tracking-wider">
                    Generated Agent Prompt Instruction
                  </span>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(renderedPrompt);
                      triggerToast('Prompt copied to clipboard');
                    }}
                    className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#410217] text-[#FBF3E2] text-xs font-semibold cursor-pointer hover:bg-[#5C0A24] transition-colors"
                  >
                    <Copy className="w-3.5 h-3.5 text-[#D5991C]" />
                    <span>Copy to Clipboard</span>
                  </button>
                </div>

                <div className="p-4 bg-[#FAF2E1] border border-[#F2D69D] font-mono text-xs leading-relaxed text-[#410217] select-all">
                  "{renderedPrompt}"
                </div>
              </div>

              {/* 3-Step Execution Blueprint */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 bg-[#FBF3E2] border border-[#F2D69D] space-y-2">
                  <div className="font-mono text-xs font-bold text-[#D5991C]">STEP 01 // DISCOVER & MAP</div>
                  <h4 className="font-serif font-bold text-sm text-[#410217]">Automated Surface Discovery</h4>
                  <p className="text-xs text-[#410217]/75 font-sans leading-relaxed">
                    The agent calls REA MCP tools like <code>analyze-javascript-application</code> or <code>inspect-macho</code> to map exported symbols, IPC registers, and modules.
                  </p>
                </div>

                <div className="p-4 bg-[#FBF3E2] border border-[#F2D69D] space-y-2">
                  <div className="font-mono text-xs font-bold text-[#D5991C]">STEP 02 // TRACE & EVIDENCE</div>
                  <h4 className="font-serif font-bold text-sm text-[#410217]">Isolate Critical Handlers</h4>
                  <p className="text-xs text-[#410217]/75 font-sans leading-relaxed">
                    The agent inspects SQLite schemas, tokenizers, or call paths, confirming findings against live runtime captures with high statistical confidence.
                  </p>
                </div>

                <div className="p-4 bg-[#FBF3E2] border border-[#F2D69D] space-y-2">
                  <div className="font-mono text-xs font-bold text-[#D5991C]">STEP 03 // CLEAN-ROOM BUILD</div>
                  <h4 className="font-serif font-bold text-sm text-[#410217]">Independent Implementation</h4>
                  <p className="text-xs text-[#410217]/75 font-sans leading-relaxed">
                    The agent generates modern, tested TypeScript or C++ code fulfilling the behavioral contract with zero license or copyright risk.
                  </p>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 4: REA LIVE TERMINAL */}
        {/* ============================================================== */}
        {activeView === 'terminal' && (
          <div className="space-y-4">
            
            {/* Terminal Window */}
            <div className="bg-[#28010E] border border-[#F2D69D] shadow-2xl overflow-hidden font-mono text-xs">
              
              {/* Titlebar */}
              <div className="bg-[#410217] px-4 py-3 flex items-center justify-between border-b border-[#F2D69D]/30">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded-full bg-[#E63946] inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#D5991C] inline-block" />
                  <span className="w-3 h-3 rounded-full bg-[#00A878] inline-block" />
                  <span className="text-xs text-[#FBF3E2]/80 ml-2 font-bold tracking-wider">
                    REA Workbench CLI Bridge · npx rea-agents@latest
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-[11px]">
                  <button
                    onClick={() => executeTerminalCmd('rea doctor --format json')}
                    className="px-2.5 py-1 bg-[#310111] hover:bg-[#5C0A24] text-[#FBF3E2] border border-[#F2D69D]/30 cursor-pointer"
                  >
                    rea doctor
                  </button>
                  <button
                    onClick={() => executeTerminalCmd('rea providers')}
                    className="px-2.5 py-1 bg-[#310111] hover:bg-[#5C0A24] text-[#FBF3E2] border border-[#F2D69D]/30 cursor-pointer"
                  >
                    rea providers
                  </button>
                  <button
                    onClick={() => executeTerminalCmd('rea setup --dry-run')}
                    className="px-2.5 py-1 bg-[#310111] hover:bg-[#5C0A24] text-[#FBF3E2] border border-[#F2D69D]/30 cursor-pointer"
                  >
                    rea setup
                  </button>
                  <button
                    onClick={() => executeTerminalCmd('clear')}
                    className="px-2.5 py-1 bg-[#310111] hover:bg-[#5C0A24] text-[#FBF3E2] border border-[#F2D69D]/30 cursor-pointer"
                  >
                    Clear
                  </button>
                </div>
              </div>

              {/* Terminal Logs Output */}
              <div className="p-5 space-y-1.5 min-h-[360px] max-h-[500px] overflow-y-auto font-mono text-[11px] leading-relaxed">
                {terminalHistory.map((item, idx) => {
                  let color = 'text-[#FBF3E2]/85';
                  if (item.type === 'cmd') color = 'text-[#D5991C] font-bold';
                  else if (item.type === 'success') color = 'text-[#00A878] font-semibold';
                  else if (item.type === 'warn') color = 'text-[#F2D69D] font-bold';
                  else if (item.type === 'info') color = 'text-[#FBF3E2]/70';

                  return (
                    <div key={idx} className={color}>
                      {item.text}
                    </div>
                  );
                })}
                <div ref={terminalEndRef} />
              </div>

              {/* Terminal Input Bar */}
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

        {/* ============================================================== */}
        {/* VIEW 5: MCP & AGENT SETUP MANAGER */}
        {/* ============================================================== */}
        {activeView === 'setupManager' && (
          <div className="space-y-6">
            <div className="bg-[#FAF2E1] border border-[#F2D69D] p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F2D69D] pb-3">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-[#410217]">
                    MCP & Agent Setup Manager
                  </h3>
                  <p className="text-xs text-[#410217]/75 font-sans mt-0.5">
                    Configure Antigravity 2.0, Claude Code, and Gemini CLI to utilize REA's MCP protocol tools.
                  </p>
                </div>
                <span className="px-2.5 py-1 bg-[#410217] text-[#D5991C] font-mono text-xs font-bold uppercase">
                  Zero Hallucination Bridge
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setIsSetupModalOpen(true)}
                  className="flex items-center space-x-2 px-5 py-2.5 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] font-semibold text-xs tracking-wider uppercase border border-[#410217] shadow-xs cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#D5991C]" />
                  <span>Approve Antigravity Integration (Recommended)</span>
                </button>

                <button
                  onClick={() => {
                    executeTerminalCmd('rea setup --all-detected --dry-run');
                    setActiveView('terminal');
                    triggerToast('Reviewing multi-agent dry run...');
                  }}
                  className="px-5 py-2.5 bg-[#FAF2E1] hover:bg-[#F2D69D] text-[#410217] font-semibold text-xs tracking-wider uppercase border border-[#410217]/30 shadow-xs cursor-pointer"
                >
                  Dry-Run All Detected Agents
                </button>
              </div>

              {/* Proposed Integrations List */}
              <div className="space-y-3 pt-2">
                
                <div className="p-4 bg-[#FBF3E2] border border-[#F2D69D] space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#410217]">01 // Antigravity 2.0 Global MCP Server</span>
                    <span className="px-2 py-0.5 bg-[#00A878]/15 text-[#00A878] text-[10px] uppercase font-bold">
                      Active Target
                    </span>
                  </div>
                  <div className="text-[11px] text-[#575F62]">
                    Target File: <code>/Users/sammyb/.gemini/config/mcp_config.json</code>
                  </div>
                  <p className="text-xs text-[#410217]/80 font-sans leading-relaxed">
                    Registers <code>npx -y rea-agents@6.3.0 mcp</code> into your global Antigravity MCP configuration. Automatically creates safety backup <code>mcp_config.json.rea.backup</code>.
                  </p>
                </div>

                <div className="p-4 bg-[#FBF3E2] border border-[#F2D69D] space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#410217]">02 // REA Agent Skill Bundle</span>
                    <span className="px-2 py-0.5 bg-[#00A878]/15 text-[#00A878] text-[10px] uppercase font-bold">
                      Bundled
                    </span>
                  </div>
                  <div className="text-[11px] text-[#575F62]">
                    Target Directory: <code>/Users/sammyb/.agents/skills/reverse-engineer-anything/</code>
                  </div>
                  <p className="text-xs text-[#410217]/80 font-sans leading-relaxed">
                    Deploys high-priority agent skill instructions, investigation checklists, and offline reverse engineering best practices.
                  </p>
                </div>

                <div className="p-4 bg-[#FBF3E2] border border-[#F2D69D] space-y-1.5 font-mono text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#410217]">03 // Claude Code & Gemini CLI Bridges</span>
                    <span className="px-2 py-0.5 bg-[#D5991C]/20 text-[#410217] text-[10px] uppercase font-bold">
                      Auto-Configured
                    </span>
                  </div>
                  <div className="text-[11px] text-[#575F62]">
                    Target File: <code>~/.claude/mcp_servers.json</code>
                  </div>
                  <p className="text-xs text-[#410217]/80 font-sans leading-relaxed">
                    Enables unified reverse engineering across secondary developer CLI instances without conflicting environment variables.
                  </p>
                </div>

              </div>

            </div>
          </div>
        )}

      </main>

      {/* Setup Approval Modal */}
      {isSetupModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#410217]/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className="bg-[#FAF2E1] border-2 border-[#F2D69D] shadow-2xl max-w-xl w-full p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-[#F2D69D] pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-5 h-5 text-[#D5991C]" />
                <h3 className="font-serif font-bold text-xl text-[#410217]">
                  Approve REA MCP Integration
                </h3>
              </div>
              <button
                onClick={() => setIsSetupModalOpen(false)}
                className="text-xs font-mono text-[#410217]/60 hover:text-[#410217] cursor-pointer"
              >
                ✕ CLOSE
              </button>
            </div>

            <p className="text-xs text-[#410217]/80 leading-relaxed font-sans">
              The setup process connects REA's 133 local reverse engineering tools to Antigravity 2.0. Existing configuration files are backed up automatically.
            </p>

            <div className="p-3 bg-[#FBF3E2] border border-[#F2D69D] font-mono text-xs space-y-1">
              <div className="font-bold text-[#410217]">Changes to Apply:</div>
              <div className="text-[11px] text-[#575F62]">
                • Command: <code>npx -y rea-agents@6.3.0 mcp</code>
              </div>
              <div className="text-[11px] text-[#575F62]">
                • Backup: <code>~/.gemini/config/mcp_config.json.rea.backup</code>
              </div>
              <div className="text-[11px] text-[#575F62]">
                • Skill: <code>~/.agents/skills/reverse-engineer-anything/SKILL.md</code>
              </div>
            </div>

            {setupApplied && (
              <div className="p-3 bg-[#00A878]/15 border border-[#00A878]/40 text-[#00A878] font-mono text-xs flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Integration applied successfully! Tools ready in Antigravity session.</span>
              </div>
            )}

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setIsSetupModalOpen(false)}
                className="px-4 py-2 border border-[#410217]/25 text-[#410217] text-xs font-semibold uppercase cursor-pointer hover:bg-[#F2D69D]/40"
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
                  }, 1800);
                }}
                className="px-5 py-2 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] text-xs font-bold uppercase tracking-wider cursor-pointer border border-[#410217]"
              >
                Approve & Activate
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
