// REA Workbench Client Controller
document.addEventListener('DOMContentLoaded', () => {
  // State
  let currentSampleKey = 'electronNotes';
  let samplesData = {};
  let doctorData = null;
  let planData = null;

  // DOM Elements - Navigation
  const navItems = document.querySelectorAll('.nav-item');
  const viewPanels = document.querySelectorAll('.view-panel');

  // DOM Elements - Status & Dashboard
  const connectionChip = document.getElementById('connectionChip');
  const connectionText = document.getElementById('connectionText');
  const dashboardAgentGrid = document.getElementById('dashboardAgentGrid');
  const valDetectedAgents = document.getElementById('valDetectedAgents');
  const btnRefreshDoctor = document.getElementById('btnRefreshDoctor');
  const btnQuickDoctor = document.getElementById('btnQuickDoctor');

  // DOM Elements - Inspector
  const sampleTargetCards = document.querySelectorAll('#sampleTargetList .target-card');
  const activeTargetTitle = document.getElementById('activeTargetTitle');
  const activeTargetConfidence = document.getElementById('activeTargetConfidence');
  const ipcChannelsContainer = document.getElementById('ipcChannelsContainer');
  const modulesContainer = document.getElementById('modulesContainer');
  const codeContentView = document.getElementById('codeContentView');
  const codeHeaderFilename = document.getElementById('codeHeaderFilename');
  const tabButtons = document.querySelectorAll('.tab-btn');
  const evidenceSections = document.querySelectorAll('.evidence-section');
  const inputCustomPath = document.getElementById('inputCustomPath');
  const btnRunCustomAnalysis = document.getElementById('btnRunCustomAnalysis');
  const btnCopyEvidenceJson = document.getElementById('btnCopyEvidenceJson');
  const btnCopyCode = document.getElementById('btnCopyCode');

  // DOM Elements - Prompt Studio
  const btnCopyPrompt = document.getElementById('btnCopyPrompt');
  const promptTextDisplay = document.getElementById('promptTextDisplay');

  // DOM Elements - Terminal
  const terminalOutput = document.getElementById('terminalOutput');
  const terminalInput = document.getElementById('terminalInput');
  const btnRunDoctorTerminal = document.getElementById('btnRunDoctorTerminal');
  const btnRunProvidersTerminal = document.getElementById('btnRunProvidersTerminal');
  const btnClearTerminal = document.getElementById('btnClearTerminal');

  // DOM Elements - Setup & Modal
  const setupModalOverlay = document.getElementById('setupModalOverlay');
  const btnOpenSetupModal = document.getElementById('btnOpenSetupModal');
  const btnSidebarSetup = document.getElementById('btnSidebarSetup');
  const btnHeroSetupPlan = document.getElementById('btnHeroSetupPlan');
  const btnCloseSetupModal = document.getElementById('btnCloseSetupModal');
  const btnCancelModal = document.getElementById('btnCancelModal');
  const btnConfirmModalSetup = document.getElementById('btnConfirmModalSetup');
  const btnApplySetupAntigravity = document.getElementById('btnApplySetupAntigravity');
  const btnApplySetupAll = document.getElementById('btnApplySetupAll');
  const setupPlanDetailsList = document.getElementById('setupPlanDetailsList');
  const modalPlanActionsList = document.getElementById('modalPlanActionsList');
  const toastMessage = document.getElementById('toastMessage');
  const toastText = document.getElementById('toastText');

  // Toast Helper
  function showToast(message) {
    toastText.textContent = message;
    toastMessage.classList.add('show');
    setTimeout(() => {
      toastMessage.classList.remove('show');
    }, 3200);
  }

  // View Navigation
  function switchView(viewName) {
    navItems.forEach(item => {
      item.classList.toggle('active', item.dataset.view === viewName);
    });
    viewPanels.forEach(panel => {
      panel.classList.toggle('active', panel.id === `view-${viewName}`);
    });
  }

  navItems.forEach(item => {
    item.addEventListener('click', () => switchView(item.dataset.view));
  });

  // Quick Dashboard Links
  document.getElementById('btnHeroInspect')?.addEventListener('click', () => switchView('inspector'));
  document.getElementById('quickCardElectron')?.addEventListener('click', () => {
    switchView('inspector');
    selectSample('electronNotes');
  });
  document.getElementById('quickCardMacho')?.addEventListener('click', () => {
    switchView('inspector');
    selectSample('machoBinary');
  });
  document.getElementById('quickCardPrompt')?.addEventListener('click', () => switchView('promptStudio'));

  // Load Samples
  async function loadSamples() {
    try {
      const res = await fetch('/api/samples');
      const data = await res.json();
      if (data.ok && data.samples) {
        samplesData = data.samples;
        renderActiveSample();
      }
    } catch (err) {
      console.error('Failed to load samples:', err);
    }
  }

  function selectSample(key) {
    currentSampleKey = key;
    sampleTargetCards.forEach(c => {
      c.classList.toggle('active', c.dataset.sampleKey === key);
    });
    renderActiveSample();
  }

  sampleTargetCards.forEach(card => {
    card.addEventListener('click', () => {
      selectSample(card.dataset.sampleKey);
    });
  });

  function renderActiveSample() {
    const sample = samplesData[currentSampleKey];
    if (!sample) return;

    activeTargetTitle.textContent = sample.name;
    activeTargetConfidence.textContent = `Confidence: ${sample.confidence}`;
    codeContentView.textContent = sample.decompiledLogic || '// No decompiled logic available';

    // Update IPC / Boundaries
    ipcChannelsContainer.innerHTML = '';
    if (sample.ipcChannels) {
      sample.ipcChannels.forEach(ch => {
        const item = document.createElement('div');
        item.className = 'item-box';
        item.innerHTML = `
          <div class="item-box-title">
            <span>${ch.channel}</span>
            <span class="target-badge">${ch.method}</span>
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-cyan);">
            ${ch.direction} · ${ch.handler}
          </div>
          <p class="item-box-detail">${ch.description}</p>
        `;
        ipcChannelsContainer.appendChild(item);
      });
    } else if (sample.linkedLibraries) {
      // Native binary view
      sample.linkedLibraries.forEach(lib => {
        const item = document.createElement('div');
        item.className = 'item-box';
        item.innerHTML = `
          <div class="item-box-title">
            <span>${lib.name.split('/').pop()}</span>
            <span class="target-badge">${lib.status}</span>
          </div>
          <div style="font-family: var(--font-mono); font-size: 0.72rem; color: var(--accent-cyan); word-break: break-all;">
            ${lib.name}
          </div>
          <p class="item-box-detail">Symbols: ${lib.symbols.join(', ')}</p>
        `;
        ipcChannelsContainer.appendChild(item);
      });
    } else if (sample.apiEndpoints) {
      // Web endpoints
      sample.apiEndpoints.forEach(ep => {
        const item = document.createElement('div');
        item.className = 'item-box';
        item.innerHTML = `
          <div class="item-box-title">
            <span>${ep.endpoint}</span>
            <span class="target-badge">${ep.method}</span>
          </div>
          <p class="item-box-detail">${ep.headers ? 'Headers: ' + ep.headers.join(', ') : 'Protocol: ' + ep.protocol}</p>
        `;
        ipcChannelsContainer.appendChild(item);
      });
    }

    // Update Modules
    modulesContainer.innerHTML = '';
    if (sample.modules) {
      sample.modules.forEach(m => {
        const item = document.createElement('div');
        item.className = 'item-box';
        item.innerHTML = `
          <div class="item-box-title">
            <span>${m.name}</span>
            <span class="target-badge">module</span>
          </div>
          <p class="item-box-detail">${m.role}</p>
          <div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--text-muted);">
            Imports: ${m.imports.join(', ')}
          </div>
        `;
        modulesContainer.appendChild(item);
      });
    } else if (sample.symbols) {
      sample.symbols.forEach(s => {
        const item = document.createElement('div');
        item.className = 'item-box';
        item.innerHTML = `
          <div class="item-box-title">
            <span>${s.name}</span>
            <span class="target-badge">${s.size}</span>
          </div>
          <p class="item-box-detail" style="font-family: var(--font-mono);">${s.address}</p>
        `;
        modulesContainer.appendChild(item);
      });
    } else if (sample.originalSourcesRecovered) {
      sample.originalSourcesRecovered.forEach(src => {
        const item = document.createElement('div');
        item.className = 'item-box';
        item.innerHTML = `
          <div class="item-box-title">
            <span>${src}</span>
            <span class="target-badge">recovered</span>
          </div>
          <p class="item-box-detail">Recovered with verified source map</p>
        `;
        modulesContainer.appendChild(item);
      });
    }
  }

  // Tab switching in target inspector
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.dataset.tab;
      evidenceSections.forEach(sec => {
        sec.style.display = sec.id === targetTab ? 'flex' : 'none';
      });
    });
  });

  // Custom Path Analysis
  btnRunCustomAnalysis.addEventListener('click', async () => {
    const customPath = inputCustomPath.value.trim();
    if (!customPath) {
      showToast('Please enter a valid path to inspect');
      return;
    }

    btnRunCustomAnalysis.disabled = true;
    btnRunCustomAnalysis.textContent = 'Analyzing...';
    showToast(`Analyzing ${customPath}...`);

    try {
      const res = await fetch('/api/analyze-path', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ path: customPath })
      });
      const data = await res.json();
      if (data.ok && data.evidence) {
        showToast('Analysis completed successfully!');
        activeTargetTitle.textContent = customPath;
        activeTargetConfidence.textContent = 'Confidence: verified';
        codeContentView.textContent = JSON.stringify(data.evidence, null, 2);
        codeHeaderFilename.textContent = `${customPath} Evidence JSON`;
        switchTab('tab-decompiled');
      } else {
        showToast(data.stderr || 'Analysis returned errors; check terminal');
        appendTerminal(`\n[Custom Analysis Error]:\n${data.stderr || data.error}\n`);
      }
    } catch (err) {
      showToast('Request failed: ' + err.message);
    } finally {
      btnRunCustomAnalysis.disabled = false;
      btnRunCustomAnalysis.textContent = 'Analyze Directory / ASAR';
    }
  });

  function switchTab(tabId) {
    tabButtons.forEach(b => {
      b.classList.toggle('active', b.dataset.tab === tabId);
    });
    evidenceSections.forEach(sec => {
      sec.style.display = sec.id === tabId ? 'flex' : 'none';
    });
  }

  // Copy Buttons
  btnCopyEvidenceJson.addEventListener('click', () => {
    const sample = samplesData[currentSampleKey];
    if (sample) {
      navigator.clipboard.writeText(JSON.stringify(sample, null, 2));
      showToast('Evidence JSON copied to clipboard');
    }
  });

  btnCopyCode.addEventListener('click', () => {
    navigator.clipboard.writeText(codeContentView.textContent);
    showToast('Code copied to clipboard');
  });

  btnCopyPrompt.addEventListener('click', () => {
    navigator.clipboard.writeText(promptTextDisplay.textContent.trim());
    showToast('Agent prompt copied to clipboard');
  });

  // Load Status / Doctor
  async function loadStatus() {
    try {
      const res = await fetch('/api/status');
      const data = await res.json();
      if (data.ok && data.doctorOutput) {
        doctorData = data.doctorOutput;
        renderDoctorStatus();
      }
    } catch (err) {
      console.error('Failed to load status:', err);
    }
  }

  function renderDoctorStatus() {
    if (!doctorData) return;
    const registrations = doctorData.registrations || [];
    valDetectedAgents.textContent = `${registrations.length} Configured`;

    dashboardAgentGrid.innerHTML = '';
    registrations.forEach(reg => {
      const isAligned = reg.state === 'aligned';
      const item = document.createElement('div');
      item.className = 'item-box';
      item.innerHTML = `
        <div class="item-box-title">
          <span>${reg.client.toUpperCase()}</span>
          <span class="target-badge" style="color: ${isAligned ? 'var(--accent-emerald)' : 'var(--accent-amber)'}">
            ${reg.state}
          </span>
        </div>
        <p class="item-box-detail" style="font-family: var(--font-mono); font-size: 0.72rem;">
          ${reg.config_path}
        </p>
      `;
      dashboardAgentGrid.appendChild(item);
    });
  }

  btnRefreshDoctor.addEventListener('click', () => {
    loadStatus();
    showToast('Refreshed REA doctor diagnostics');
  });

  btnQuickDoctor.addEventListener('click', () => {
    switchView('terminal');
    runTerminalCommand('doctor', ['--format', 'json']);
  });

  // Load Setup Plan
  async function loadPlan(client = 'antigravity') {
    try {
      const res = await fetch(`/api/plan?client=${client}`);
      const data = await res.json();
      if (data.ok && data.plan) {
        planData = data.plan;
        renderSetupPlan();
      }
    } catch (err) {
      console.error('Failed to load plan:', err);
    }
  }

  function renderSetupPlan() {
    if (!planData || !planData.plannedActions) return;
    setupPlanDetailsList.innerHTML = '';
    modalPlanActionsList.innerHTML = '';

    planData.plannedActions.forEach(action => {
      const card = document.createElement('div');
      card.className = 'plan-item';
      card.innerHTML = `
        <div class="plan-item-label">
          <span>${action.label}</span>
          <span class="target-badge">${action.operation}</span>
        </div>
        <div class="plan-item-target">${action.target}</div>
        <div class="plan-item-desc">${action.detail}</div>
        ${action.backupPath ? `<div style="font-family: var(--font-mono); font-size: 0.7rem; color: var(--accent-emerald);">Backup: ${action.backupPath}</div>` : ''}
      `;
      setupPlanDetailsList.appendChild(card.cloneNode(true));
      modalPlanActionsList.appendChild(card);
    });
  }

  // Setup Execution
  async function executeSetup(client) {
    showToast(`Executing REA setup for ${client}...`);
    try {
      const res = await fetch('/api/setup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ client })
      });
      const data = await res.json();
      if (data.ok) {
        showToast('Setup applied successfully! Restart agent to use tools.');
        closeModal();
        loadStatus();
        loadPlan();
        appendTerminal(`\n[REA Setup Successful]:\n${data.stdout}\n`);
      } else {
        showToast('Setup completed with warnings; check terminal');
        appendTerminal(`\n[REA Setup Output]:\n${data.stdout}\n${data.stderr}\n`);
      }
    } catch (err) {
      showToast('Setup failed: ' + err.message);
    }
  }

  btnApplySetupAntigravity?.addEventListener('click', () => executeSetup('antigravity'));
  btnApplySetupAll?.addEventListener('click', () => executeSetup('all'));
  btnConfirmModalSetup?.addEventListener('click', () => executeSetup('antigravity'));

  // Modal Handlers
  function openModal() {
    setupModalOverlay.classList.add('active');
    loadPlan('antigravity');
  }

  function closeModal() {
    setupModalOverlay.classList.remove('active');
  }

  btnOpenSetupModal.addEventListener('click', openModal);
  btnSidebarSetup.addEventListener('click', openModal);
  btnHeroSetupPlan.addEventListener('click', openModal);
  btnCloseSetupModal.addEventListener('click', closeModal);
  btnCancelModal.addEventListener('click', closeModal);
  setupModalOverlay.addEventListener('click', (e) => {
    if (e.target === setupModalOverlay) closeModal();
  });

  // Live Terminal
  function appendTerminal(text) {
    terminalOutput.textContent += text;
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  async function runTerminalCommand(command, args = []) {
    appendTerminal(`\n$ rea ${command} ${args.join(' ')}\n... running command ...\n`);
    try {
      const res = await fetch('/api/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command, args })
      });
      const data = await res.json();
      if (data.stdout) appendTerminal(data.stdout);
      if (data.stderr) appendTerminal(data.stderr);
      appendTerminal(`\n[Process exited with code ${data.exitCode}]\n`);
    } catch (err) {
      appendTerminal(`\nError: ${err.message}\n`);
    }
  }

  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value.trim();
      if (!val) return;
      terminalInput.value = '';
      const parts = val.split(' ');
      const cmd = parts[0];
      const args = parts.slice(1);
      runTerminalCommand(cmd, args);
    }
  });

  btnRunDoctorTerminal.addEventListener('click', () => runTerminalCommand('doctor', ['--format', 'json']));
  btnRunProvidersTerminal.addEventListener('click', () => runTerminalCommand('providers', ['--format', 'json']));
  btnClearTerminal.addEventListener('click', () => {
    terminalOutput.textContent = 'Terminal cleared.\n';
  });

  // Initial Boot
  loadSamples();
  loadStatus();
  loadPlan('antigravity');
});
