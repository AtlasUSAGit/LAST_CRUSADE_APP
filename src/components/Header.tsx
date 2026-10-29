import React, { useState } from 'react';
import { ShieldAlert, Menu, X, ArrowUpRight, FileCode, Boxes, Home, Terminal, Briefcase, Presentation, BookOpen } from 'lucide-react';
import { NavigationPage } from '../types';

interface HeaderProps {
  currentPage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onOpenAudit: () => void;
  onOpenIncident?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenAudit,
  onOpenIncident
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#FBF3E2]/95 backdrop-blur-md border-b border-[#F2D69D] transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Status */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onNavigate('overview')}
              className="flex items-center space-x-3.5 group cursor-pointer text-left"
            >
              <div className="w-8 h-8 bg-[#410217] flex items-center justify-center rotate-45 border border-[#F2D69D] shadow-xs group-hover:scale-105 transition-transform">
                <div className="w-3 h-3 bg-[#D5991C] -rotate-45"></div>
              </div>
              <div className="flex flex-col">
                <span className="font-serif font-bold text-2xl tracking-tight text-[#410217] flex items-center gap-1 leading-none">
                  LAST CRUSADE
                </span>
                <span className="font-mono text-[9px] text-[#410217]/60 tracking-[0.22em] uppercase mt-1">
                  AEO CYBER OPERATIONS
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Primary Page Navigation Switcher */}
          <div className="hidden md:flex items-center bg-[#FAF2E1] border border-[#F2D69D] p-1 font-mono text-xs">
            <button
              onClick={() => onNavigate('overview')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 transition-all cursor-pointer font-bold uppercase tracking-wider ${
                currentPage === 'overview'
                  ? 'bg-[#410217] text-[#FBF3E2] shadow-xs'
                  : 'text-[#410217]/70 hover:text-[#410217]'
              }`}
            >
              <Home className="w-3.5 h-3.5 text-[#D5991C]" />
              <span>Home</span>
            </button>

            <button
              onClick={() => onNavigate('services')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 transition-all cursor-pointer font-bold uppercase tracking-wider ${
                currentPage === 'services'
                  ? 'bg-[#410217] text-[#FBF3E2] shadow-xs'
                  : 'text-[#410217]/70 hover:text-[#410217]'
              }`}
            >
              <Briefcase className="w-3.5 h-3.5 text-[#D5991C]" />
              <span>Services</span>
            </button>

            <button
              onClick={() => onNavigate('rea')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 transition-all cursor-pointer font-bold uppercase tracking-wider ${
                currentPage === 'rea'
                  ? 'bg-[#410217] text-[#FBF3E2] shadow-xs'
                  : 'text-[#410217]/70 hover:text-[#410217]'
              }`}
            >
              <FileCode className="w-3.5 h-3.5 text-[#D5991C]" />
              <span>REA Studio</span>
            </button>

            <button
              onClick={() => onNavigate('research')}
              className={`flex items-center space-x-1.5 px-3.5 py-1.5 transition-all cursor-pointer font-bold uppercase tracking-wider ${
                currentPage === 'research' || currentPage === 'counter-geo' || currentPage === 'counter-geo-vol2' || currentPage === 'counter-geo-vol3'
                  ? 'bg-[#410217] text-[#FBF3E2] shadow-xs'
                  : 'text-[#410217]/70 hover:text-[#410217]'
              }`}
              title="Counter-AEO Research Corpus: Whitepaper Volumes 1, 2, 3 & Algorithmic Labs"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#D5991C]" />
              <span>Research</span>
            </button>

            <button
              onClick={() => onNavigate('counter-geo-ops')}
              className={`flex items-center space-x-1.5 px-3 py-1.5 transition-all cursor-pointer font-bold uppercase tracking-wider ${
                currentPage === 'counter-geo-ops'
                  ? 'bg-[#D5991C] text-[#130108] shadow-xs font-black'
                  : 'text-[#410217] hover:text-[#D5991C]'
              }`}
              title="Library of Offensive AEO Strategies & Counter-AEO Defenses (WebGL 2.0)"
            >
              <Terminal className="w-3.5 h-3.5 text-[#D5991C]" />
              <span>Strategy Library</span>
            </button>
          </div>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-3">
            <a
              href="./last_crusade_pitch_deck.html"
              className="flex items-center space-x-1.5 px-3.5 py-2 border border-[#D5991C] bg-[#FAF2E1] hover:bg-[#D5991C] text-[#410217] hover:text-[#130108] text-xs font-bold uppercase tracking-wider transition-all shadow-xs cursor-pointer group"
              title="View Last Crusade Cover Deck"
            >
              <Presentation className="w-3.5 h-3.5 text-[#D5991C] group-hover:text-[#130108] transition-colors" />
              <span>Cover Deck</span>
            </a>

            <button
              onClick={onOpenAudit}
              className="flex items-center space-x-1.5 px-5 py-2.5 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] font-semibold text-xs tracking-wider uppercase border border-[#410217] shadow-xs transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <span>Request AEO Audit</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center space-x-2">
            <a
              href="./last_crusade_pitch_deck.html"
              className="p-2 border border-[#D5991C] bg-[#FAF2E1] text-[#410217] hover:bg-[#D5991C] hover:text-[#130108] transition-colors"
              title="Cover Deck"
            >
              <Presentation className="w-5 h-5 text-[#D5991C]" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-[#410217] border border-[#F2D69D] bg-[#FAF2E1]"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF2E1] border-b border-[#F2D69D] px-4 pt-3 pb-6 space-y-4 font-mono text-sm">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2D69D] text-xs text-[#410217]/70">
            <span>AEO THREAT LEVEL: <strong className="text-[#D5991C]">ELEVATED</strong></span>
            <span>1,482 MONITORS</span>
          </div>

          {/* Mobile Page Switcher */}
          <div className="space-y-2 border-b border-[#F2D69D] pb-3">
            <span className="text-[10px] text-[#410217]/60 uppercase tracking-widest block font-bold">
              Core Modules:
            </span>
            <button
              onClick={() => {
                onNavigate('overview');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left p-2.5 font-bold flex items-center justify-between border ${
                currentPage === 'overview'
                  ? 'bg-[#410217] text-[#FBF3E2] border-[#410217]'
                  : 'bg-[#FBF3E2] text-[#410217] border-[#F2D69D]'
              }`}
            >
              <span>01 // Home (Overview)</span>
              <Home className="w-4 h-4 text-[#D5991C]" />
            </button>

            <button
              onClick={() => {
                onNavigate('services');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left p-2.5 font-bold flex items-center justify-between border ${
                currentPage === 'services'
                  ? 'bg-[#410217] text-[#FBF3E2] border-[#410217]'
                  : 'bg-[#FBF3E2] text-[#410217] border-[#F2D69D]'
              }`}
            >
              <span>02 // Services (Volume IV Sovereign Defense)</span>
              <Briefcase className="w-4 h-4 text-[#D5991C]" />
            </button>

            <button
              onClick={() => {
                onNavigate('rea');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left p-2.5 font-bold flex items-center justify-between border ${
                currentPage === 'rea'
                  ? 'bg-[#410217] text-[#FBF3E2] border-[#410217]'
                  : 'bg-[#FBF3E2] text-[#410217] border-[#F2D69D]'
              }`}
            >
              <span>03 // REA Studio (Reverse Engineering)</span>
              <FileCode className="w-4 h-4 text-[#D5991C]" />
            </button>

            <button
              onClick={() => {
                onNavigate('research');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left p-2.5 font-bold flex items-center justify-between border ${
                currentPage === 'research' || currentPage === 'counter-geo' || currentPage === 'counter-geo-vol2' || currentPage === 'counter-geo-vol3'
                  ? 'bg-[#410217] text-[#FBF3E2] border-[#410217]'
                  : 'bg-[#FBF3E2] text-[#410217] border-[#F2D69D]'
              }`}
            >
              <span>04 // Research (Volumes 1, 2, 3 Whitepapers & Labs)</span>
              <BookOpen className="w-4 h-4 text-[#D5991C]" />
            </button>

            <button
              onClick={() => {
                onNavigate('counter-geo-ops');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left p-2.5 font-bold flex items-center justify-between border ${
                currentPage === 'counter-geo-ops'
                  ? 'bg-[#D5991C] text-[#130108] border-[#D5991C]'
                  : 'bg-[#FBF3E2] text-[#410217] border-[#F2D69D]'
              }`}
            >
              <span>05 // Strategy Library: Offensive AEO & Defenses (WebGL 2.0)</span>
              <Terminal className="w-4 h-4 text-[#D5991C]" />
            </button>

            <a
              href="./last_crusade_pitch_deck.html"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-left p-2.5 font-bold flex items-center justify-between border bg-[#FAF5EB] text-[#410217] border-[#D5991C] hover:bg-[#D5991C] hover:text-[#130108] transition-colors"
            >
              <span>06 // Cover Deck (Proposal for Petra Labs)</span>
              <Presentation className="w-4 h-4 text-[#D5991C]" />
            </a>
          </div>

          <div className="pt-2 space-y-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAudit();
              }}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-[#410217] text-[#FBF3E2] font-semibold text-xs tracking-wider uppercase border border-[#410217]"
            >
              <span>Request AEO Audit</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
