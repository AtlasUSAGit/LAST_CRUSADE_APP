import { ReaSampleTarget } from '../types';

export const REA_SAMPLE_TARGETS: Record<string, ReaSampleTarget> = {
  electronNotes: {
    id: 'electronNotes',
    name: 'Notes Desktop App (Electron Search & IPC)',
    target: '/Applications/NotesApp.app (Electron 32 / ASAR)',
    type: 'electron',
    badge: 'Electron 32 / ASAR',
    summary: 'Reverse-engineered architecture of an Electron-based note taking application featuring SQLite FTS5 search indexing and contextIsolation IPC bridges.',
    evidenceCount: 42,
    confidence: 'high (0.94)',
    ipcChannels: [
      {
        channel: 'notes:search',
        direction: 'renderer -> main',
        handler: 'src/main/search-service.js:L48',
        method: 'ipcMain.handle',
        description: 'Performs full-text tokenized query against local SQLite FTS5 index with sanitized input'
      },
      {
        channel: 'notes:create',
        direction: 'renderer -> main',
        handler: 'src/main/notes-manager.js:L112',
        method: 'ipcMain.handle',
        description: 'Persists new markdown document with SHA-256 integrity hash & timestamp'
      },
      {
        channel: 'notes:sync-status',
        direction: 'main -> renderer',
        handler: 'src/main/sync-engine.js:L89',
        method: 'webContents.send',
        description: 'Broadcasts background WebSocket sync status and conflict alerts to renderer'
      },
      {
        channel: 'notes:export-pdf',
        direction: 'renderer -> main',
        handler: 'src/main/exporter.js:L24',
        method: 'ipcMain.handle',
        description: 'Renders note DOM into headless PDF via printToPDF with sandboxed chromium'
      }
    ],
    boundaries: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preloadPath: 'dist/preload/index.js',
      contextBridgeExposed: ['api.search', 'api.notes', 'api.export', 'api.onSyncUpdate']
    },
    modules: [
      { name: 'sqlite3 / better-sqlite3', role: 'Local persistence & FTS5 full text search table', imports: ['sqlite3', 'path', 'fs'] },
      { name: 'fuse.js', role: 'Fuzzy matching fallback for note tags and titles', imports: ['fuse.js'] },
      { name: 'marked + DOMPurify', role: 'Markdown compilation and HTML sanitization', imports: ['marked', 'dompurify'] },
      { name: 'chokidar', role: 'File-system watcher for external note folder changes', imports: ['chokidar'] }
    ],
    decompiledLogic: `// Reconstructed Clean-Room Implementation of notes:search
// Evidence: src/main/search-service.js (Decompiled from app.asar)
import { ipcMain } from 'electron';
import Database from 'better-sqlite3';

export function setupSearchService(dbPath: string) {
  const db = new Database(dbPath);
  
  // SQLite FTS5 virtual table definition identified in evidence
  db.exec(\`
    CREATE VIRTUAL TABLE IF NOT EXISTS notes_fts USING fts5(
      id UNINDEXED,
      title,
      content,
      tags,
      tokenize = 'porter unicode61'
    );
  \`);

  ipcMain.handle('notes:search', async (event, { query, limit = 20 }) => {
    // Escaped search tokens matching app tokenizer behavior
    const sanitizedQuery = query.replace(/[^\\w\\s]/g, '').trim();
    if (!sanitizedQuery) return [];

    const stmt = db.prepare(\`
      SELECT id, title, snippet(notes_fts, 2, '<mark>', '</mark>', '...', 15) AS preview,
             bm25(notes_fts) AS rank
      FROM notes_fts
      WHERE notes_fts MATCH ?
      ORDER BY rank
      LIMIT ?
    \`);
    
    return stmt.all(sanitizedQuery + '*', limit);
  });
}`
  },
  machoBinary: {
    id: 'machoBinary',
    name: 'macOS System Telemetry Agent',
    target: '/usr/local/bin/sysmon-daemon (Mach-O 64-bit arm64)',
    type: 'native',
    badge: 'macOS ARM64 / Mach-O',
    summary: 'Native ARM64 Mach-O executable with Mach message port dispatch, IOKit power telemetry, and SystemConfiguration network listeners.',
    evidenceCount: 78,
    confidence: 'verified (0.98)',
    architectures: ['arm64 (Apple Silicon M-series)', 'x86_64 (Universal Binary)'],
    linkedLibraries: [
      { name: '/usr/lib/libSystem.B.dylib', status: 'dyld resolved', symbols: ['mach_task_self', 'host_processor_info', 'bootstrap_look_up'] },
      { name: '/System/Library/Frameworks/IOKit.framework/Versions/A/IOKit', status: 'dyld resolved', symbols: ['IOServiceGetMatchingService', 'IORegistryEntryCreateCFProperty'] },
      { name: '/System/Library/Frameworks/SystemConfiguration.framework', status: 'dyld resolved', symbols: ['SCDynamicStoreCreate', 'SCDynamicStoreSetNotificationKeys'] }
    ],
    entitlements: [
      'com.apple.security.app-sandbox: false',
      'com.apple.security.network.client: true',
      'com.apple.security.iokit-user-client-class: IOPMrootDomain'
    ],
    entryPoint: '0x0000000100003b40 (_start -> main)',
    symbols: [
      { address: '0x0000000100004120', name: '_gather_cpu_telemetry', type: 'function', size: '312 bytes' },
      { address: '0x0000000100004580', name: '_poll_battery_thermals', type: 'function', size: '448 bytes' },
      { address: '0x0000000100004bc0', name: '_dispatch_mach_message', type: 'function', size: '184 bytes' }
    ],
    decompiledLogic: `// Reconstructed Native Logic for host telemetry gathering
// Evidence: _gather_cpu_telemetry @ 0x100004120 in libSystem call graph
#include <mach/mach.h>
#include <mach/processor_info.h>

typedef struct {
    float user_percent;
    float system_percent;
    float idle_percent;
} CpuMetrics;

CpuMetrics sample_host_cpu(void) {
    natural_t cpu_count;
    processor_info_array_t cpu_info;
    mach_msg_type_number_t cpu_info_count;
    
    kern_return_t kr = host_processor_info(
        mach_host_self(),
        PROCESSOR_CPU_LOAD_INFO,
        &cpu_count,
        &cpu_info,
        &cpu_info_count
    );
    // Verified Mach port deallocation in destructor
    mach_port_deallocate(mach_task_self(), mach_host_self());
    return (CpuMetrics){ .user_percent = 14.2f, .system_percent = 5.1f, .idle_percent = 80.7f };
}`
  },
  webBundle: {
    id: 'webBundle',
    name: 'Single Page Cloud Dashboard (React/Vite)',
    target: 'https://cloud-app.example/assets/app.8f9b2c.js (Minified Web Bundle)',
    type: 'web',
    badge: 'Minified Web Bundle / SPA',
    summary: 'Webpack/Vite bundled React SPA with recovered source mappings, hidden WebSocket command channels, and JWT session handling.',
    evidenceCount: 35,
    confidence: 'high (0.91)',
    originalSourcesRecovered: [
      'src/auth/AuthProvider.tsx',
      'src/realtime/WebSocketClient.ts',
      'src/api/graphqlClient.ts',
      'src/state/useWorkflowStore.ts'
    ],
    apiEndpoints: [
      { method: 'POST', endpoint: '/api/v2/auth/refresh', headers: ['Authorization', 'X-Device-Fingerprint'] },
      { method: 'WSS', endpoint: 'wss://realtime.cloud-app.example/v1/stream', protocol: 'graphql-transport-ws' },
      { method: 'POST', endpoint: '/api/v2/telemetry/event', batching: '5000ms debounce' }
    ],
    decompiledLogic: `// Recovered WebSocket Client Implementation
// Source Provenance: src/realtime/WebSocketClient.ts from app.8f9b2c.js.map
export class RealtimeClient {
  private ws: WebSocket | null = null;
  private reconnectInterval = 2000;
  private pingTimer: number | null = null;

  connect(authToken: string) {
    this.ws = new WebSocket(\`wss://realtime.cloud-app.example/v1/stream?token=\${authToken}\`);
    this.ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      if (msg.type === 'PONG') return;
      this.dispatchEvent(msg);
    };
    this.ws.onopen = () => {
      this.pingTimer = window.setInterval(() => {
        this.ws?.send(JSON.stringify({ type: 'PING' }));
      }, 15000);
    };
  }
}`
  }
};

export const REA_PROMPT_TEMPLATES = [
  {
    id: 'clean-room',
    title: 'Clean-Room Implementation Pattern',
    tag: 'Feature Re-engineering',
    description: 'Instruct the agent to inspect a target app, extract verified evidence, and build a matching clean-room feature without copyright leakage.',
    template: (target: string, feature: string) =>
      `Investigate how "${feature}" is implemented in ${target}. Use REA's MCP inspection tools to locate the exact source files, IPC channels, and database schemas. Then provide a clean-room TypeScript/React implementation matching the contract.`
  },
  {
    id: 'vulnerability-audit',
    title: 'Security & Invariant Audit Pattern',
    tag: 'Threat Intelligence',
    description: 'Direct the agent to audit context isolation, unsafe IPC channels, or protocol vulnerabilities in native and Electron binaries.',
    template: (target: string, feature: string) =>
      `Perform a deep security audit of ${target} focusing on "${feature}". Check for contextIsolation bypasses, nodeIntegration leaks, unvalidated IPC handlers in ipcMain.handle, and memory safety invariants. Output findings in STIX / Last Crusade Defense incident format.`
  },
  {
    id: 'protocol-reversing',
    title: 'Protocol & API Reverse Engineering',
    tag: 'Network & Telemetry',
    description: 'Trace undocumented WebSocket channels, token exchange flows, and telemetry payloads from minified web bundles.',
    template: (target: string, feature: string) =>
      `Decompile and trace the network protocol for "${feature}" in ${target}. Extract all endpoints, WebSocket heartbeat schemas, authentication headers, and debounce logic. Output a verified OpenAPI 3.1 specification.`
  },
  {
    id: 'ipc-hardening',
    title: 'IPC Boundary Hardening Pattern',
    tag: 'Electron & Native IPC',
    description: 'Extract preload script contextBridge exposures and generate hardened schema validation wrappers.',
    template: (target: string, feature: string) =>
      `Audit the contextBridge exposures in ${target}'s preload scripts for "${feature}". Identify any raw event emitters passed through window.api and generate Zod schemas to sanitize all IPC payloads across the security boundary.`
  }
];

export const REA_TOOL_SUITES = [
  { name: 'Native & Binary Analysis', count: 24, description: 'Ghidra decompiler bridges, ARM64/x86 disassembly, Mach-O and ELF headers, dyld symbol lookup.' },
  { name: 'Apple & Mach-O Suite', count: 18, description: 'Mach message tracing, IOKit power telemetry, entitlement validation, code signature verification.' },
  { name: 'Web & Electron Studio', count: 22, description: 'ASAR archive unpacking, IPC channel mapping, sourcemap recovery, runtime DOM session tracing.' },
  { name: 'Android & APK Reversing', count: 12, description: 'DEX decompilation, AndroidManifest permission audit, JNI native boundary inspection.' },
  { name: 'Managed Runtime & CLR', count: 16, description: 'IL disassembly, EVM bytecode analysis, member reconstruction, cross-process capture.' },
  { name: 'Core REA Engine', count: 41, description: 'Evidence bundle exporter, version diff engine, unknown resolution ledger, MCP session manager.' }
];
