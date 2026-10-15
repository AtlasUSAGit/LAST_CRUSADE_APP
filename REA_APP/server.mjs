import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { exec, spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// MIME types map
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
};

// Safe shell command execution helper
function runReaCommand(args, timeout = 30000) {
  return new Promise((resolve) => {
    const localRea = path.join(__dirname, 'node_modules', '.bin', 'rea');
    const isLocal = fs.existsSync(localRea);
    const cmd = isLocal ? localRea : 'npx';
    const fullArgs = isLocal ? args : ['-y', 'rea-agents@latest', ...args];
    const proc = spawn(cmd, fullArgs, {
      cwd: __dirname,
      env: { ...process.env, PATH: `${path.join(__dirname, 'node_modules', '.bin')}:${process.env.PATH}` },
    });

    let stdout = '';
    let stderr = '';

    const timer = setTimeout(() => {
      proc.kill('SIGKILL');
      resolve({
        ok: false,
        exitCode: -1,
        stdout,
        stderr: stderr + '\n[Timeout after ' + timeout / 1000 + 's]',
      });
    }, timeout);

    proc.stdout.on('data', (d) => { stdout += d.toString(); });
    proc.stderr.on('data', (d) => { stderr += d.toString(); });

    proc.on('close', (code) => {
      clearTimeout(timer);
      resolve({
        ok: code === 0,
        exitCode: code,
        stdout,
        stderr,
      });
    });

    proc.on('error', (err) => {
      clearTimeout(timer);
      resolve({
        ok: false,
        exitCode: -1,
        stdout,
        stderr: err.message,
      });
    });
  });
}

// Sample mock/preloaded datasets for instant offline/rich exploration
const SAMPLES = {
  electronNotes: {
    target: "/Applications/NotesApp.app (Electron 32 / ASAR)",
    name: "Notes Desktop App (Electron Search & IPC)",
    type: "electron",
    summary: "Reverse-engineered architecture of an Electron-based note taking application featuring SQLite FTS5 search indexing and contextIsolation IPC bridges.",
    evidenceCount: 42,
    confidence: "high (0.94)",
    ipcChannels: [
      { channel: "notes:search", direction: "renderer -> main", handler: "src/main/search-service.js:L48", method: "ipcMain.handle", description: "Performs full-text tokenized query against local SQLite FTS5 index" },
      { channel: "notes:create", direction: "renderer -> main", handler: "src/main/notes-manager.js:L112", method: "ipcMain.handle", description: "Persists new markdown document with SHA-256 integrity hash" },
      { channel: "notes:sync-status", direction: "main -> renderer", handler: "src/main/sync-engine.js:L89", method: "webContents.send", description: "Broadcasts background WebSocket sync status and conflict alerts" },
      { channel: "notes:export-pdf", direction: "renderer -> main", handler: "src/main/exporter.js:L24", method: "ipcMain.handle", description: "Renders note DOM into headless PDF via printToPDF" }
    ],
    boundaries: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
      preloadPath: "dist/preload/index.js",
      contextBridgeExposed: ["api.search", "api.notes", "api.export", "api.onSyncUpdate"]
    },
    modules: [
      { name: "sqlite3 / better-sqlite3", role: "Local persistence & FTS5 full text search table", imports: ["sqlite3", "path", "fs"] },
      { name: "fuse.js", role: "Fuzzy matching fallback for note tags and titles", imports: ["fuse.js"] },
      { name: "marked + DOMPurify", role: "Markdown compilation and HTML sanitization", imports: ["marked", "dompurify"] },
      { name: "chokidar", role: "File-system watcher for external note folder changes", imports: ["chokidar"] }
    ],
    decompiledLogic: `// Reconstructed Clean-Room Implementation of notes:search
// Evidence: src/main/search-service.js (Decompiled from app.asar)
import { ipcMain } from 'electron';
import Database from 'better-sqlite3';

export function setupSearchService(dbPath) {
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
    const sanitizedQuery = query.replace(/[^\w\s]/g, '').trim();
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
    target: "/usr/local/bin/sysmon-daemon (Mach-O 64-bit arm64)",
    name: "macOS System Telemetry Agent",
    type: "native",
    summary: "Native ARM64 Mach-O executable with Mach message port dispatch, IOKit power telemetry, and SystemConfiguration network listeners.",
    evidenceCount: 78,
    confidence: "verified (0.98)",
    architectures: ["arm64 (Apple Silicon Apple M-series)", "x86_64 (Universal Binary)"],
    linkedLibraries: [
      { name: "/usr/lib/libSystem.B.dylib", status: "dyld resolved", symbols: ["mach_task_self", "host_processor_info", "bootstrap_look_up"] },
      { name: "/System/Library/Frameworks/IOKit.framework/Versions/A/IOKit", status: "dyld resolved", symbols: ["IOServiceGetMatchingService", "IORegistryEntryCreateCFProperty"] },
      { name: "/System/Library/Frameworks/SystemConfiguration.framework", status: "dyld resolved", symbols: ["SCDynamicStoreCreate", "SCDynamicStoreSetNotificationKeys"] }
    ],
    entitlements: [
      "com.apple.security.app-sandbox: false",
      "com.apple.security.network.client: true",
      "com.apple.security.iokit-user-client-class: IOPMrootDomain"
    ],
    entryPoint: "0x0000000100003b40 (_start -> main)",
    symbols: [
      { address: "0x0000000100004120", name: "_gather_cpu_telemetry", type: "function", size: "312 bytes" },
      { address: "0x0000000100004580", name: "_poll_battery_thermals", type: "function", size: "448 bytes" },
      { address: "0x0000000100004bc0", name: "_dispatch_mach_message", type: "function", size: "184 bytes" }
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
    ...
}`
  },
  webBundle: {
    target: "https://cloud-app.example/assets/app.8f9b2c.js (Minified Web Bundle)",
    name: "Single Page Cloud Dashboard",
    type: "web",
    summary: "Webpack/Vite bundled React SPA with recovered source mappings, hidden WebSocket command channels, and JWT session handling.",
    evidenceCount: 35,
    confidence: "high (0.91)",
    sourceMapsAvailable: true,
    originalSourcesRecovered: [
      "src/auth/AuthProvider.tsx",
      "src/realtime/WebSocketClient.ts",
      "src/api/graphqlClient.ts",
      "src/state/useWorkflowStore.ts"
    ],
    apiEndpoints: [
      { method: "POST", endpoint: "/api/v2/auth/refresh", headers: ["Authorization", "X-Device-Fingerprint"] },
      { method: "WSS", endpoint: "wss://realtime.cloud-app.example/v1/stream", protocol: "graphql-transport-ws" },
      { method: "POST", endpoint: "/api/v2/telemetry/event", batching: "5000ms debounce" }
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
      this.pingTimer = setInterval(() => this.ws?.send(JSON.stringify({ type: 'PING' })), 15000);
    };
  }
}`
  }
};

// HTTP Request Handler
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // API Endpoints
  if (pathname === '/api/status') {
    try {
      const result = await runReaCommand(['doctor', '--client', 'antigravity', '--format', 'json']);
      let parsed = null;
      if (result.stdout) {
        try {
          parsed = JSON.parse(result.stdout);
        } catch {
          // If stdout had formatting or truncation
        }
      }
      const normalizedDoctor = {
        ...parsed,
        registrations: parsed?.identity?.registrations || parsed?.registrations || [],
        skill: parsed?.identity?.skill || parsed?.skill || null,
        catalog: parsed?.identity?.catalog || parsed?.catalog || null,
      };
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        ok: true,
        reaInstalled: result.exitCode === 0 || !!parsed,
        doctorOutput: normalizedDoctor,
        rawStderr: result.stderr,
        exitCode: result.exitCode,
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: err.message }));
    }
    return;
  }

  if (pathname === '/api/plan') {
    const client = parsedUrl.searchParams.get('client') || 'antigravity';
    try {
      const args = client === 'all'
        ? ['setup', '--all-detected', '--dry-run', '--format', 'json']
        : ['setup', '--client', client, '--dry-run', '--format', 'json'];

      const result = await runReaCommand(args);
      let parsed = null;
      try {
        parsed = JSON.parse(result.stdout);
      } catch (e) {
        // Fallback parsing
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        ok: true,
        plan: parsed,
        rawStdout: result.stdout,
        rawStderr: result.stderr,
      }));
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ ok: false, error: err.message }));
    }
    return;
  }

  if (pathname === '/api/setup' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', async () => {
      try {
        const payload = body ? JSON.parse(body) : {};
        const client = payload.client || 'antigravity';
        const args = client === 'all'
          ? ['setup', '--all-detected', '--yes', '--format', 'json']
          : ['setup', '--client', client, '--yes', '--format', 'json'];

        const result = await runReaCommand(args, 60000);
        let parsed = null;
        try {
          parsed = JSON.parse(result.stdout);
        } catch {}

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ok: result.ok,
          exitCode: result.exitCode,
          result: parsed,
          stdout: result.stdout,
          stderr: result.stderr,
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  if (pathname === '/api/samples') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: true, samples: SAMPLES }));
    return;
  }

  if (pathname === '/api/analyze-path' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', async () => {
      try {
        const payload = body ? JSON.parse(body) : {};
        const targetPath = payload.path;
        if (!targetPath) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: 'Path is required' }));
          return;
        }

        const result = await runReaCommand(['analyze-javascript-application', targetPath, '--json'], 45000);
        let parsed = null;
        try {
          parsed = JSON.parse(result.stdout);
        } catch {}

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ok: result.ok,
          exitCode: result.exitCode,
          evidence: parsed,
          stdout: result.stdout,
          stderr: result.stderr,
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  if (pathname === '/api/exec' && req.method === 'POST') {
    let body = '';
    req.on('data', (c) => { body += c; });
    req.on('end', async () => {
      try {
        const payload = body ? JSON.parse(body) : {};
        const subCmd = payload.command || 'doctor';
        const userArgs = Array.isArray(payload.args) ? payload.args : [];

        // Whitelist allowed subcommands for security
        const allowed = [
          'doctor', 'providers', 'inspect-macho', 'inspect-plist',
          'list-architectures', 'search', 'setup', 'update'
        ];
        if (!allowed.includes(subCmd)) {
          res.writeHead(403, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ ok: false, error: `Command ${subCmd} not permitted in web sandbox` }));
          return;
        }

        const result = await runReaCommand([subCmd, ...userArgs]);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          ok: result.ok,
          exitCode: result.exitCode,
          stdout: result.stdout,
          stderr: result.stderr,
        }));
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ ok: false, error: err.message }));
      }
    });
    return;
  }

  // Static File Serving
  let filePath = path.join(PUBLIC_DIR, pathname === '/' ? 'index.html' : pathname);
  
  // Security check: prevent directory traversal
  if (!filePath.startsWith(PUBLIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // If file not found, try index.html for SPA fallback or 404
      const fallbackPath = path.join(PUBLIC_DIR, 'index.html');
      fs.readFile(fallbackPath, (fallbackErr, data) => {
        if (fallbackErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
          res.end(data);
        }
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`REA Workbench running on http://127.0.0.1:${PORT}`);
});
