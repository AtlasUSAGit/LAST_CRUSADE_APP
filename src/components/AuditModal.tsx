import React, { useState } from 'react';
import { X, Shield, ArrowRight, CheckCircle2, Lock, Building, User, Mail } from 'lucide-react';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditModal: React.FC<AuditModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    role: '',
    targetEngines: ['ChatGPT', 'Perplexity'],
    message: ''
  });

  if (!isOpen) return null;

  const toggleEngine = (engine: string) => {
    if (formData.targetEngines.includes(engine)) {
      setFormData({
        ...formData,
        targetEngines: formData.targetEngines.filter((e) => e !== engine)
      });
    } else {
      setFormData({
        ...formData,
        targetEngines: [...formData.targetEngines, engine]
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#410217]/60 backdrop-blur-xs p-4 animate-fadeIn">
      <div className="bg-[#FBF3E2] border border-[#410217] p-6 md:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-[#410217]/60 hover:text-[#410217] transition-colors font-bold cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#FAF2E1] border border-[#F2D69D] text-[#D5991C] font-mono text-[11px] font-bold uppercase tracking-[0.2em]">
                <Shield className="w-3.5 h-3.5" />
                <span>CONFIDENTIAL SECURITY AUDIT</span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#410217] tracking-tight">
                Request a GEO Security Audit
              </h3>
              <p className="text-[#410217]/75 text-sm font-sans">
                Receive a forensic evaluation of your brand, executive, and legal citation footprint across frontier LLMs and RAG engines.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5 font-mono text-xs">
                <label className="text-[#410217] font-semibold">FULL NAME *</label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#410217]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jane Doe"
                    className="w-full bg-[#FFFDF8] border border-[#F2D69D] pl-9 pr-4 py-2.5 text-[#410217] placeholder-[#410217]/40 focus:outline-none focus:border-[#410217]"
                  />
                </div>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                <label className="text-[#410217] font-semibold">WORK EMAIL *</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#410217]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="jane@company.com"
                    className="w-full bg-[#FFFDF8] border border-[#F2D69D] pl-9 pr-4 py-2.5 text-[#410217] placeholder-[#410217]/40 focus:outline-none focus:border-[#410217]"
                  />
                </div>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                <label className="text-[#410217] font-semibold">COMPANY / ORGANIZATION *</label>
                <div className="relative">
                  <Building className="w-4 h-4 text-[#410217]/40 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    required
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="Apex Global Enterprises"
                    className="w-full bg-[#FFFDF8] border border-[#F2D69D] pl-9 pr-4 py-2.5 text-[#410217] placeholder-[#410217]/40 focus:outline-none focus:border-[#410217]"
                  />
                </div>
              </div>

              <div className="space-y-1.5 font-mono text-xs">
                <label className="text-[#410217] font-semibold">ROLE / TITLE</label>
                <input
                  type="text"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  placeholder="CISO / VP Brand Protection"
                  className="w-full bg-[#FFFDF8] border border-[#F2D69D] px-4 py-2.5 text-[#410217] placeholder-[#410217]/40 focus:outline-none focus:border-[#410217]"
                />
              </div>
            </div>

            {/* Target Engines Selection */}
            <div className="space-y-2 font-mono text-xs">
              <label className="text-[#410217] font-semibold">TARGET ENGINES TO AUDIT:</label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['ChatGPT', 'Perplexity', 'Google AI', 'Claude', 'Copilot', 'DeepSeek', 'Gemini', 'Grok'].map((eng) => (
                  <button
                    type="button"
                    key={eng}
                    onClick={() => toggleEngine(eng)}
                    className={`p-2 border text-center transition-all uppercase tracking-wider font-semibold ${
                      formData.targetEngines.includes(eng)
                        ? 'bg-[#410217] border-[#410217] text-[#FBF3E2]'
                        : 'bg-[#FFFDF8] border-[#F2D69D] text-[#410217]/70 hover:text-[#410217]'
                    }`}
                  >
                    {eng}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 font-mono text-xs">
              <label className="text-[#410217] font-semibold">PRIMARY CONCERNS OR KNOWN DISTORTIONS (OPTIONAL)</label>
              <textarea
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Mention specific executive names, products, or hallucinated claims you wish to inspect..."
                className="w-full bg-[#FFFDF8] border border-[#F2D69D] px-4 py-2.5 text-[#410217] placeholder-[#410217]/40 focus:outline-none focus:border-[#410217]"
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] font-semibold text-xs uppercase tracking-widest border border-[#410217] shadow-sm transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Submit GEO Audit Request</span>
              <ArrowRight className="w-4 h-4 text-[#D5991C]" />
            </button>

            <div className="flex items-center justify-center space-x-2 font-mono text-[11px] text-[#410217]/60">
              <Lock className="w-3.5 h-3.5 text-[#D5991C]" />
              <span>Strict NDA Protected. Zero-Trust Data Handling.</span>
            </div>
          </form>
        ) : (
          <div className="text-center py-8 space-y-6 animate-fadeIn font-mono">
            <div className="w-16 h-16 bg-[#FFFDF8] border border-[#2E7D32] flex items-center justify-center text-[#2E7D32] mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl text-[#410217] font-bold">GEO Audit Request Confirmed</h3>
              <p className="text-[#410217]/80 text-sm font-sans max-w-md mx-auto">
                Thank you, <strong>{formData.name}</strong>. A Senior Threat Intelligence Specialist will contact you within <strong>2 business hours</strong> to deliver your confidential GEO audit report.
              </p>
            </div>

            <div className="p-4 bg-[#FFFDF8] border border-[#F2D69D] text-xs text-left space-y-1 max-w-md mx-auto">
              <div className="text-[#410217]/60">ASSIGNED AUDIT TICKET: <strong className="text-[#410217]">AUDIT-2026-7729</strong></div>
              <div className="text-[#410217]/60">TARGET ENGINES: <strong className="text-[#410217]">{formData.targetEngines.join(', ')}</strong></div>
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
