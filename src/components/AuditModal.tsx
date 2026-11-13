import React, { useState } from 'react';
import { X, CheckCircle, ArrowRight } from 'lucide-react';

interface AuditModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditModal: React.FC<AuditModalProps> = ({ isOpen, onClose }) => {
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [domain, setDomain] = useState('');
  const [focusArea, setFocusArea] = useState('Brand & Search Visibility (Offensive AEO)');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const resetAndClose = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setDomain('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1A0009]/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-2xl bg-[#FAF2E1] border-2 border-[#D5991C] shadow-2xl overflow-hidden text-[#410217]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F2D69D] bg-[#FBF3E2]">
          <div>
            <h3 className="text-xl font-serif font-bold text-[#410217]">
              Get in Touch / Request an AEO Review
            </h3>
            <p className="text-xs text-[#410217]/70 mt-0.5">
              Discuss offensive AEO visibility, defensive security, or our research series
            </p>
          </div>
          <button
            onClick={resetAndClose}
            className="text-[#410217]/60 hover:text-[#410217] p-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-[#410217]/80 leading-relaxed">
                Share a few details below and we&apos;ll follow up to discuss how AI engines currently represent your organization or how our research applies to your team.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#410217] mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Alex Morgan"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBF3E2] border border-[#D5991C]/50 text-[#410217] placeholder-[#410217]/40 text-sm focus:outline-hidden focus:border-[#410217]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#410217] mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="alex@company.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBF3E2] border border-[#D5991C]/50 text-[#410217] placeholder-[#410217]/40 text-sm focus:outline-hidden focus:border-[#410217]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-[#410217] mb-1">
                    Company or Website
                  </label>
                  <input
                    type="text"
                    value={domain}
                    onChange={(e) => setDomain(e.target.value)}
                    placeholder="company.com"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBF3E2] border border-[#D5991C]/50 text-[#410217] placeholder-[#410217]/40 text-sm focus:outline-hidden focus:border-[#410217]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#410217] mb-1">
                    Primary Topic
                  </label>
                  <select
                    value={focusArea}
                    onChange={(e) => setFocusArea(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBF3E2] border border-[#D5991C]/50 text-[#410217] text-sm focus:outline-hidden focus:border-[#410217]"
                  >
                    <option>Brand &amp; Search Visibility (Offensive AEO)</option>
                    <option>Search Poisoning &amp; Rumor Defense</option>
                    <option>Financial Market AI Protection</option>
                    <option>Autonomous Agent &amp; Tool Security</option>
                    <option>Research &amp; Career Conversation</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#410217] mb-1">
                  What would you like to explore? (Optional)
                </label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Tell us about the questions, AI models, or use cases on your mind..."
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#FBF3E2] border border-[#D5991C]/50 text-[#410217] placeholder-[#410217]/40 text-sm focus:outline-hidden focus:border-[#410217]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-5 rounded-lg bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] font-semibold text-sm transition-all flex items-center justify-center space-x-2 shadow-md cursor-pointer"
                >
                  <span>Send Message</span>
                  <ArrowRight className="w-4 h-4 text-[#D5991C]" />
                </button>
              </div>
            </form>
          ) : (
            <div className="py-6 text-center space-y-4">
              <div className="w-12 h-12 rounded-full bg-[#00A878]/15 border border-[#00A878] flex items-center justify-center mx-auto">
                <CheckCircle className="w-6 h-6 text-[#00A878]" />
              </div>
              <h4 className="text-2xl font-serif font-bold text-[#410217]">
                Thanks for Reaching Out, {name || 'Friend'}
              </h4>
              <p className="text-sm text-[#410217]/80 max-w-md mx-auto leading-relaxed">
                We&apos;ve recorded your note regarding <strong>{focusArea}</strong>{domain ? ` for ${domain}` : ''} and will follow up at <span className="font-semibold">{email}</span>.
              </p>
              <button
                onClick={resetAndClose}
                className="mt-2 px-6 py-2.5 rounded-lg bg-[#410217] text-[#FBF3E2] text-xs font-semibold hover:bg-[#5C0A24] transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
