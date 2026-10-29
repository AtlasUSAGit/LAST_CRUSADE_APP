import React from 'react';
import { ArrowLeft, ExternalLink, Presentation, Sparkles, Shield } from 'lucide-react';
import { NavigationPage } from '../types';

interface PitchDeckPageProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenAudit?: () => void;
  onOpenIncident?: () => void;
}

export const PitchDeckPage: React.FC<PitchDeckPageProps> = ({
  onNavigate,
  onOpenAudit
}) => {
  return (
    <div className="w-full min-h-[calc(100vh-80px)] bg-[#FAF5EB] flex flex-col">
      {/* Top Control Bar */}
      <div className="bg-[#FAF2E1] border-b border-[#F2D69D] px-4 sm:px-8 py-3 flex flex-wrap items-center justify-between gap-3 font-mono text-xs z-20">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => onNavigate('overview')}
            className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] transition-colors cursor-pointer font-bold uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Overview</span>
          </button>

          <div className="hidden sm:flex items-center space-x-2 text-[#410217]/70">
            <span className="text-[#D5991C] font-bold">/</span>
            <span className="uppercase tracking-widest text-[11px] font-bold text-[#410217]">
              PETRA LABS // LAST CRUSADE PITCH DECK
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="./last_crusade_pitch_deck.html"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-1.5 px-3 py-1.5 border border-[#410217]/30 hover:border-[#410217] text-[#410217] hover:bg-[#410217]/5 transition-colors cursor-pointer font-bold uppercase tracking-wider"
            title="Open pitch deck in a new browser tab"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#D5991C]" />
            <span>Open Standalone ↗</span>
          </a>

          {onOpenAudit && (
            <button
              onClick={onOpenAudit}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-[#D5991C] hover:bg-[#E5A932] text-[#130108] transition-colors cursor-pointer font-bold uppercase tracking-wider shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Request AEO Audit</span>
            </button>
          )}
        </div>
      </div>

      {/* Embedded Presentation Frame */}
      <div className="w-full flex-1 relative bg-[#FAF5EB] min-h-[calc(100vh-130px)]">
        <iframe
          src="./last_crusade_pitch_deck.html"
          title="Last Crusade // Petra Labs Pitch Deck"
          className="w-full h-full min-h-[calc(100vh-130px)] border-0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        />
      </div>
    </div>
  );
};
