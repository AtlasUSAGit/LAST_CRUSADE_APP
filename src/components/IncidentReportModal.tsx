import React, { useState } from 'react';
import { X, ShieldAlert, ArrowRight, CheckCircle2, PhoneCall } from 'lucide-react';

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [incidentData, setIncidentData] = useState({
    name: '',
    email: '',
    company: '',
    phone: '',
    engineAffected: 'ChatGPT (GPT-4o)',
    incidentType: 'Prompt Injection Attack',
    description: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#410217]/65 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-[#FBF3E2] border-2 border-[#8B1E1E] p-6 md:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#410217]/60 hover:text-[#410217] transition-colors font-bold cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6 font-sans">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#FFF5F5] border border-[#8B1E1E]/50 text-[#8B1E1E] font-mono text-[11px] font-bold uppercase tracking-[0.2em]">
                <ShieldAlert className="w-3.5 h-3.5 text-[#8B1E1E] animate-pulse" />
                <span>24/7 EMERGENCY INCIDENT RESPONSE</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#410217] tracking-tight">
                Report an Active GEO Incident
              </h3>
              <p className="text-[#410217]/75 text-sm">
                If your organization is currently experiencing an active AI search defamation, prompt injection, or fake rumor event, submit this priority dispatch form.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-[#410217] font-semibold">FULL NAME *</label>
                <input
                  required
                  type="text"
                  value={incidentData.name}
                  onChange={(e) => setIncidentData({ ...incidentData, name: e.target.value })}
                  placeholder="John Smith"
                  className="w-full bg-[#FFFDF8] border border-[#F2D69D] px-4 py-2.5 text-[#410217] placeholder-[#410217]/40 focus:outline-none focus:border-[#8B1E1E]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#410217] font-semibold">URGENT CONTACT EMAIL *</label>
                <input
                  required
                  type="email"
                  value={incidentData.email}
                  onChange={(e) => setIncidentData({ ...incidentData, email: e.target.value })}
                  placeholder="john@company.com"
                  className="w-full bg-[#FFFDF8] border border-[#F2D69D] px-4 py-2.5 text-[#410217] placeholder-[#410217]/40 focus:outline-none focus:border-[#8B1E1E]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#410217] font-semibold">COMPANY / ORGANIZATION *</label>
                <input
                  required
                  type="text"
                  value={incidentData.company}
                  onChange={(e) => setIncidentData({ ...incidentData, company: e.target.value })}
                  placeholder="Global FinTech Corp"
                  className="w-full bg-[#FFFDF8] border border-[#F2D69D] px-4 py-2.5 text-[#410217] placeholder-[#410217]/40 focus:outline-none focus:border-[#8B1E1E]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[#410217] font-semibold">DIRECT PHONE / SIGNAL *</label>
                <input
                  required
                  type="tel"
                  value={incidentData.phone}
                  onChange={(e) => setIncidentData({ ...incidentData, phone: e.target.value })}
                  placeholder="+1 (555) 019-2831"
                  className="w-full bg-[#FFFDF8] border border-[#F2D69D] px-4 py-2.5 text-[#410217] placeholder-[#410217]/40 focus:outline-none focus:border-[#8B1E1E]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 font-mono text-xs">
              <div className="space-y-1.5">
                <label className="text-[#410217] font-semibold">AFFECTED GENERATIVE ENGINE:</label>
                <select
                  value={incidentData.engineAffected}
                  onChange={(e) => setIncidentData({ ...incidentData, engineAffected: e.target.value })}
                  className="w-full bg-[#FFFDF8] border border-[#F2D69D] px-4 py-2.5 text-[#410217] focus:outline-none focus:border-[#8B1E1E]"
                >
                  <option>ChatGPT (GPT-4o)</option>
                  <option>Perplexity AI</option>
                  <option>Google AI Overviews</option>
                  <option>Claude 3.5 Sonnet</option>
                  <option>Microsoft Copilot</option>
                  <option>DeepSeek-V3 / R1</option>
                  <option>Multiple Engines</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[#410217] font-semibold">INCIDENT CLASSIFICATION:</label>
                <select
                  value={incidentData.incidentType}
                  onChange={(e) => setIncidentData({ ...incidentData, incidentType: e.target.value })}
                  className="w-full bg-[#FFFDF8] border border-[#F2D69D] px-4 py-2.5 text-[#410217] focus:outline-none focus:border-[#8B1E1E]"
                >
                  <option>Prompt Injection Attack</option>
                  <option>Hallucinated Financial / Insolvency Rumor</option>
                  <option>Synthetic Executive Defamation</option>
                  <option>RAG Data Poisoning / Corrupt Search Snippet</option>
                  <option>Fake Product Safety / Recall Alert</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-[#410217] font-semibold">INCIDENT DETAILS & PROMPT QUERIES *</label>
              <textarea
                required
                rows={3}
                value={incidentData.description}
                onChange={(e) => setIncidentData({ ...incidentData, description: e.target.value })}
                placeholder="Include exact prompt text, LLM output URL, or screenshots..."
                className="w-full bg-[#FFFDF8] border border-[#F2D69D] px-4 py-2.5 text-[#410217] placeholder-[#410217]/40 focus:outline-none focus:border-[#8B1E1E]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#8B1E1E] hover:bg-[#6D1515] text-[#FBF3E2] font-mono font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 shadow-sm cursor-pointer"
            >
              <span>DISPATCH EMERGENCY RESPONSE TEAM</span>
              <ArrowRight className="w-4 h-4 text-[#F2D69D]" />
            </button>

            <div className="text-center font-mono text-[11px] text-[#410217]/60 flex items-center justify-center gap-2">
              <PhoneCall className="w-3.5 h-3.5 text-[#8B1E1E]" />
              <span>Priority Hotline SLA: Immediate &lt; 15 Minute Callback</span>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 space-y-6 animate-fadeIn font-mono">
            <div className="w-16 h-16 bg-[#FFFDF8] border border-[#8B1E1E] flex items-center justify-center text-[#8B1E1E] mx-auto">
              <ShieldAlert className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-[#410217] font-bold">EMERGENCY TICKET DISPATCHED</h3>
              <p className="text-[#410217]/80 text-sm font-sans max-w-md mx-auto">
                Priority alert dispatched to the Counter-GEO Operations Command Room. A lead threat analyst is calling <strong>{incidentData.phone}</strong> immediately.
              </p>
            </div>

            <div className="p-4 bg-[#FFF5F5] border border-[#8B1E1E]/40 text-xs text-left space-y-1 max-w-md mx-auto">
              <div className="text-[#8B1E1E] font-bold">INCIDENT TICKET: <strong className="text-[#410217]">SEC-GEO-INC-2026-9182</strong></div>
              <div className="text-[#410217]/80">AFFECTED ENGINE: <strong>{incidentData.engineAffected}</strong></div>
              <div className="text-[#410217]/80">CLASSIFICATION: <strong>{incidentData.incidentType}</strong></div>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-[#410217] text-[#FBF3E2] hover:bg-[#5C0A24] transition-all text-xs uppercase tracking-wider font-bold"
            >
              Close Window
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
