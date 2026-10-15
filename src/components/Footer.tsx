import React from 'react';
import { ShieldAlert, ArrowUpRight, FileCode, Boxes, Briefcase, Presentation } from 'lucide-react';
import { NavigationPage } from '../types';

interface FooterProps {
  onOpenAudit: () => void;
  onOpenIncident?: () => void;
  onNavigate?: (page: NavigationPage) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAudit, onOpenIncident, onNavigate }) => {
  return (
    <footer className="bg-[#410217] border-t border-[#F2D69D] text-[#FBF3E2] font-sans pt-16 pb-12 relative z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Main Footer Top Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-[#F2D69D]/20">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center space-x-3.5">
              <div className="w-8 h-8 bg-[#310111] border border-[#F2D69D] flex items-center justify-center rotate-45 shadow-sm">
                <div className="w-3 h-3 bg-[#D5991C] -rotate-45"></div>
              </div>
              <span className="font-serif font-bold text-2xl text-[#FBF3E2] tracking-tight">
                LAST CRUSADE <span className="font-sans font-light text-sm text-[#D5991C] tracking-widest pl-1">DEFENSE</span>
              </span>
            </div>

            <p className="text-xs text-[#FBF3E2]/75 leading-relaxed max-w-sm font-sans">
              The leading enterprise cybersecurity platform dedicated to Generative Engine Optimization (GEO) security, prompt injection containment, REA reverse engineering, and active counter-GEO operations.
            </p>

            {/* Compliance Badges Row */}
            <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] pt-2">
              <span className="px-2.5 py-1 bg-[#310111] border border-[#F2D69D]/30 text-[#F2D69D] uppercase">SOC2 TYPE II</span>
              <span className="px-2.5 py-1 bg-[#310111] border border-[#F2D69D]/30 text-[#F2D69D] uppercase">ISO 27001</span>
              <span className="px-2.5 py-1 bg-[#310111] border border-[#F2D69D]/30 text-[#F2D69D] uppercase">SEC RULE 15c3-8</span>
              <span className="px-2.5 py-1 bg-[#310111] border border-[#F2D69D]/30 text-[#F2D69D] uppercase">FEDRAMP READY</span>
            </div>
          </div>

          {/* Nav Col 1 */}
          <div className="space-y-3 font-mono text-xs">
            <div className="text-[#D5991C] font-bold uppercase tracking-widest">OPERATIONS & SERVICES</div>
            <ul className="space-y-2 text-[#FBF3E2]/70 font-sans text-xs">
              <li><a href="#services" className="hover:text-[#FBF3E2] transition-colors">Defensive Cybersecurity</a></li>
              <li><a href="#services" className="hover:text-[#FBF3E2] transition-colors">Offensive Cyber Operations</a></li>
              <li><a href="#services" className="hover:text-[#FBF3E2] transition-colors">Liquidity Extraction Arbitrage</a></li>
              <li><a href="#capabilities" className="hover:text-[#FBF3E2] transition-colors">Open-Web RAG Immunization</a></li>
              <li><a href="#capabilities" className="hover:text-[#FBF3E2] transition-colors">Swarm & A2A Interdiction</a></li>
            </ul>
          </div>

          {/* Nav Col 2 */}
          <div className="space-y-3 font-mono text-xs">
            <div className="text-[#D5991C] font-bold uppercase tracking-widest">PLATFORM APPS</div>
            <ul className="space-y-2 text-[#FBF3E2]/70 font-sans text-xs">
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('services')}
                  className="hover:text-[#D5991C] transition-colors text-left flex items-center gap-1 cursor-pointer font-bold text-[#FBF3E2]"
                >
                  <Briefcase className="w-3 h-3 text-[#D5991C]" />
                  <span>Services (Volume IV Defense)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('rea')}
                  className="hover:text-[#D5991C] transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <FileCode className="w-3 h-3 text-[#D5991C]" />
                  <span>REA Studio (Workbench)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('counter-geo')}
                  className="hover:text-[#D5991C] transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <Boxes className="w-3 h-3 text-[#D5991C]" />
                  <span>Counter-GEO Vol. 1 Visualizer</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('counter-geo-vol2')}
                  className="hover:text-[#00A878] transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <Boxes className="w-3 h-3 text-[#00A878]" />
                  <span>Counter-GEO Vol. 2 (Memory Swarm)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('counter-geo-vol3')}
                  className="hover:text-[#A78BFA] transition-colors text-left flex items-center gap-1 cursor-pointer"
                >
                  <Boxes className="w-3 h-3 text-[#A78BFA]" />
                  <span>Counter-GEO Vol. 3 (Benchmark Suite)</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate && onNavigate('counter-geo-ops')}
                  className="hover:text-[#D5991C] transition-colors text-left flex items-center gap-1 cursor-pointer font-bold"
                >
                  <Boxes className="w-3 h-3 text-[#D5991C]" />
                  <span>Attack Library: Offensive GEO & Defenses (WebGL)</span>
                </button>
              </li>
              <li>
                <a
                  href="./last_crusade_pitch_deck.html"
                  className="hover:text-[#D5991C] transition-colors text-left flex items-center gap-1 cursor-pointer font-bold"
                >
                  <Presentation className="w-3 h-3 text-[#D5991C]" />
                  <span>Last Crusade Pitch Deck (HTML)</span>
                </a>
              </li>
              <li><a href="#problem" className="hover:text-[#FBF3E2] transition-colors">Attack Surface</a></li>
              <li><a href="#research" className="hover:text-[#FBF3E2] transition-colors">Counter-GEO Research</a></li>
            </ul>
          </div>

          {/* Nav Col 3: CTAs */}
          <div className="space-y-3 font-mono text-xs">
            <div className="text-[#D5991C] font-bold uppercase tracking-widest">ACTIONS</div>
            <div className="space-y-2">
              <button
                onClick={onOpenAudit}
                className="w-full text-left py-2.5 px-3 bg-[#D5991C] hover:bg-[#E5A932] text-[#410217] font-bold transition-all flex items-center justify-between cursor-pointer"
              >
                <span>REQUEST AUDIT</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <a
                href="./last_crusade_pitch_deck.html"
                className="w-full text-left py-2.5 px-3 bg-[#310111] text-[#F2D69D] border border-[#D5991C]/50 font-bold hover:bg-[#D5991C] hover:text-[#130108] transition-all flex items-center justify-between cursor-pointer group"
              >
                <span>PITCH DECK</span>
                <Presentation className="w-3.5 h-3.5 text-[#D5991C] group-hover:text-[#130108]" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Telemetry & Status Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-xs text-[#FBF3E2]/60">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#D5991C] animate-pulse" />
            <span>SYSTEM STATUS: <strong className="text-[#F2D69D]">ALL ENGINES OPERATIONAL</strong></span>
          </div>

          <div className="flex gap-8 text-[10px] tracking-widest text-[#FBF3E2]/40">
            <span>EST. 2024</span>
            <span>MODELS_MONITORED: 142</span>
            <span>INCIDENTS_RESOLVED: 4.8K</span>
          </div>

          <div className="flex items-center space-x-4 text-[11px] text-[#FBF3E2]/60">
            <a href="#" className="hover:text-[#FBF3E2]">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-[#FBF3E2]">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-[#FBF3E2]">Security Advisories</a>
          </div>
        </div>

      </div>
    </footer>
  );
};
