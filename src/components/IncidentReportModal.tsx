import React, { useState } from 'react';
import { X, MessageSquareWarning, CheckCircle2, ArrowRight } from 'lucide-react';

interface IncidentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [modelAffected, setModelAffected] = useState('ChatGPT / OpenAI Search');
  const [contactEmail, setContactEmail] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setContactEmail('');
    setDescription('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A0009]/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#FAF2E1] border-2 border-[#D5991C] shadow-2xl overflow-hidden text-[#410217]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F2D69D] bg-[#FBF3E2]">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-[#410217] flex items-center justify-center text-[#D5991C]">
              <MessageSquareWarning className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-serif font-bold text-[#410217]">
                Share an AI Search Issue or Example
              </h3>
              <p className="text-xs text-[#410217]/70 mt-0.5">
                Flag inaccurate AI answers, poisoned citations, or prompt manipulation
              </p>
            </div>
          </div>
          <button
            onClick={resetAndClose}
            className="text-[#410217]/60 hover:text-[#410217] p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-[#410217]/80 leading-relaxed">
                Seeing an AI chatbot repeat false claims about your company, cite a suspicious website, or misrepresent public facts? Share the details below so we can review the source trail.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#410217] mb-1">
                    AI Engine Where You Saw It
                  </label>
                  <select
                    value={modelAffected}
                    onChange={(e) => setModelAffected(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBF3E2] border border-[#D5991C]/50 text-[#410217] text-sm focus:outline-hidden focus:border-[#410217]"
                  >
                    <option>ChatGPT / OpenAI Search</option>
                    <option>Perplexity AI</option>
                    <option>Google AI Overviews / Gemini</option>
                    <option>Anthropic Claude</option>
                    <option>Multiple AI Engines</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#410217] mb-1">
                    Your Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBF3E2] border border-[#D5991C]/50 text-[#410217] placeholder-[#410217]/40 text-sm focus:outline-hidden focus:border-[#410217]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#410217] mb-1">
                  What question was asked, and what did the AI say? *
                </label>
                <textarea
                  rows={4}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Paste the prompt you used, the inaccurate claim or citation the AI returned, and any links it referenced..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBF3E2] border border-[#D5991C]/50 text-[#410217] placeholder-[#410217]/40 text-sm focus:outline-hidden focus:border-[#410217]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 px-5 rounded-lg bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
              >
                <span>Submit Example for Review</span>
                <ArrowRight className="w-4 h-4 text-[#D5991C]" />
              </button>
            </form>
          ) : (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#00A878]/15 border border-[#00A878] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-[#00A878]" />
              </div>
              <h4 className="text-2xl font-serif font-bold text-[#410217]">
                Example Received
              </h4>
              <p className="text-sm text-[#410217]/80 max-w-md mx-auto leading-relaxed">
                Thank you for sharing this example on <strong>{modelAffected}</strong>. We&apos;ll look into the citation chain and follow up at <span className="font-semibold">{contactEmail}</span>.
              </p>
              <button
                onClick={resetAndClose}
                className="mt-2 px-6 py-2.5 rounded-lg bg-[#410217] text-[#FBF3E2] text-xs font-semibold hover:bg-[#5C0A24] transition-colors cursor-pointer"
              >
                Close Window
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
