import React from 'react';
import { ArrowUpRight, BookOpen, Sparkles, Compass } from 'lucide-react';
import { NavigationPage } from '../types';

interface FooterProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenAudit: () => void;
  onOpenIncident: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenIncident,
}) => {
  return (
    <footer className="bg-[#2B010F] border-t border-[#F2D69D]/30 text-[#FBF3E2]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-[#F2D69D]/20">
          {/* Col 1: Brand & Mission (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-lg bg-[#410217] flex items-center justify-center border border-[#D5991C]/50">
                <span className="w-2.5 h-2.5 rounded-full bg-[#D5991C]" />
              </div>
              <span className="font-serif font-bold text-xl tracking-tight text-[#FBF3E2]">
                Last Crusade <span className="text-[#D5991C] font-normal">AEO Defense</span>
              </span>
            </div>
            <p className="text-sm text-[#FBF3E2]/75 leading-relaxed font-sans max-w-sm">
              Researching and building dual-use Answer Engine Optimization (AEO) and Counter-AEO systems—helping organizations earn accurate citations in AI answers while protecting search pipelines, financial markets, and autonomous software agents from manipulation.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <button
                onClick={() => onNavigate('pitch-deck')}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#D5991C] hover:bg-[#E5A932] text-[#130108] text-xs font-semibold transition-colors cursor-pointer"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>View Cover Deck</span>
              </button>
              <button
                onClick={() => onNavigate('counter-geo-ops')}
                className="inline-flex items-center space-x-1.5 px-3.5 py-2 rounded-lg bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] border border-[#D5991C]/40 text-xs font-medium transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D5991C]" />
                <span>3D Threat Lab</span>
              </button>
            </div>
          </div>

          {/* Col 2: Site Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif text-base font-bold text-[#D5991C]">
              Explore
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FBF3E2]/80 font-sans">
              <li>
                <button onClick={() => onNavigate('overview')} className="hover:text-[#D5991C] transition-colors cursor-pointer">
                  Overview
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('pitch-deck')} className="hover:text-[#D5991C] transition-colors cursor-pointer font-semibold text-[#F2D69D]">
                  Cover Deck
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-[#D5991C] transition-colors cursor-pointer">
                  Defense Architecture
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('counter-geo-ops')} className="hover:text-[#D5991C] transition-colors cursor-pointer">
                  3D Threat &amp; Strategy Lab
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('rea-studio')} className="hover:text-[#D5991C] transition-colors cursor-pointer">
                  REA Reverse-Engineering Studio
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Research Volumes (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif text-base font-bold text-[#D5991C]">
              Research Whitepapers
            </h4>
            <ul className="space-y-2.5 text-xs text-[#FBF3E2]/80 font-sans">
              <li>
                <button onClick={() => onNavigate('research')} className="hover:text-[#D5991C] transition-colors cursor-pointer font-semibold text-[#FBF3E2] flex items-center space-x-1">
                  <BookOpen className="w-3.5 h-3.5 text-[#D5991C]" />
                  <span>All 5 Research Volumes (232 Pages)</span>
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('counter-geo')} className="hover:text-[#D5991C] transition-colors cursor-pointer">
                  Volume I: Foundations of AEO &amp; Counter-AEO
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('counter-geo-vol2')} className="hover:text-[#D5991C] transition-colors cursor-pointer">
                  Volume II: Memory, PDFs, Swarms &amp; Privacy
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('counter-geo-vol3')} className="hover:text-[#D5991C] transition-colors cursor-pointer">
                  Volume III: 250k Document Benchmark Study
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('counter-geo-vol4')} className="hover:text-[#D5991C] transition-colors cursor-pointer">
                  Volume IV: 142ns Hardware &amp; Enterprise ROI
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('counter-geo-vol5')} className="hover:text-[#D5991C] transition-colors cursor-pointer">
                  Volume V: Agent-to-Agent Discovery (A2A-EO)
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Connect (3 cols) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-serif text-base font-bold text-[#D5991C]">
              Connect &amp; Discuss
            </h4>
            <p className="text-xs text-[#FBF3E2]/75 leading-relaxed">
              Interested in discussing offensive AEO strategies, defensive Counter-AEO architectures, or our five-volume research series?
            </p>
            <div className="space-y-2.5 pt-1">
              <button
                onClick={onOpenAudit}
                className="w-full py-2.5 px-4 rounded-lg bg-[#D5991C] hover:bg-[#E5A932] text-[#130108] text-xs font-semibold transition-all flex items-center justify-between cursor-pointer"
              >
                <span>Get in Touch / Request Audit</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenIncident}
                className="w-full py-2.5 px-4 rounded-lg bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] border border-[#F2D69D]/30 text-xs font-medium transition-all flex items-center justify-between cursor-pointer"
              >
                <span>Share an AI Search Issue</span>
                <ArrowUpRight className="w-4 h-4 text-[#D5991C]" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-[#FBF3E2]/65 gap-4">
          <div>
            &copy; {new Date().getFullYear()} Last Crusade. Original Research &amp; Interactive Architecture Portfolio.
          </div>
          <div className="flex items-center space-x-4">
            <span>5 Research Volumes</span>
            <span>·</span>
            <span>8 Interactive 3D Threat Simulations</span>
            <span>·</span>
            <span>REA Workbench</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
