import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  ArrowLeft,
  Share2,
  Check,
  Maximize2,
  Minimize2,
  Bookmark,
  Shield
} from 'lucide-react';
import { NavigationPage } from '../types';
import { WhitepaperReader } from './WhitepaperReader';
import { CounterGeoFindingsAndLab } from './CounterGeoFindingsAndLab';
import { MASTER_DOC_METADATA } from '../data/counterGeoPaperContent';

interface CounterGeoPageProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenAudit?: () => void;
  onOpenIncident?: () => void;
  initialSubPage?: 'paper' | 'lab';
}

export const CounterGeoPage: React.FC<CounterGeoPageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenIncident,
  initialSubPage
}) => {
  // Determine subpage: Page 1 (Full Whitepaper) vs Page 2 (Findings, Live Algorithms & Visualizers)
  const getInitialSubPage = (): 'paper' | 'lab' => {
    if (initialSubPage) return initialSubPage;
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('lab') || hash.includes('visualizer') || hash.includes('engine')) {
      return 'lab';
    }
    return 'paper';
  };

  const [subPage, setSubPage] = useState<'paper' | 'lab'>(getInitialSubPage);
  const [copiedLink, setCopiedLink] = useState(false);

  // Sync hash changes
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('lab') || hash.includes('visualizer')) {
        setSubPage('lab');
      } else if (hash.includes('paper') || hash.includes('whitepaper')) {
        setSubPage('paper');
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleSwitchSubPage = (page: 'paper' | 'lab') => {
    setSubPage(page);
    window.location.hash = page === 'paper' ? '#/counter-geo/paper' : '#/counter-geo/lab';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#FBF3E2] text-[#410217]">
      
      {/* Top Banner & Dual-Page Navigation Switcher */}
      <div className="bg-[#363636] text-[#FBF3E2] border-b border-[#F2D69D]/30 py-3 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          
          {/* Back & Breadcrumb */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('overview')}
              className="flex items-center space-x-1.5 px-3 py-1 bg-[#2a2a2a] hover:bg-[#5C0A24] border border-[#F2D69D]/40 text-[#FBF3E2] font-bold uppercase transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D5991C]" />
              <span>Back to Overview</span>
            </button>

            <div className="hidden md:flex items-center space-x-2 text-[#FBF3E2]/60">
              <span>RESEARCH ADVISORY</span>
              <span>/</span>
              <span className="text-[#D5991C] font-bold">{MASTER_DOC_METADATA.id}</span>
              <span>/</span>
              <span className="text-[#FBF3E2]/90">{MASTER_DOC_METADATA.volume}</span>
            </div>
          </div>

          {/* DUAL PAGE SWITCHER (Page 1 vs Page 2) */}
          <div className="flex items-center p-1 bg-[#2a2a2a] border border-[#F2D69D]/40 rounded-none shadow-inner">
            <button
              onClick={() => handleSwitchSubPage('paper')}
              className={`flex items-center space-x-2 px-4 py-1.5 font-bold uppercase tracking-wider transition-all cursor-pointer ${
                subPage === 'paper'
                  ? 'bg-[#D5991C] text-[#130108] shadow-sm'
                  : 'text-[#FBF3E2]/70 hover:text-[#FBF3E2]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Page 1: Full Whitepaper (Word-for-Word)</span>
            </button>

            <button
              onClick={() => handleSwitchSubPage('lab')}
              className={`flex items-center space-x-2 px-4 py-1.5 font-bold uppercase tracking-wider transition-all cursor-pointer ${
                subPage === 'lab'
                  ? 'bg-[#D5991C] text-[#130108] shadow-sm'
                  : 'text-[#FBF3E2]/70 hover:text-[#FBF3E2]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Page 2: Findings, Algorithms & Visualizers</span>
            </button>
          </div>

          {/* Share Action */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShareLink}
              className="flex items-center space-x-1.5 px-3 py-1 bg-[#310111] hover:bg-[#5C0A24] border border-[#F2D69D]/30 text-[#FBF3E2] transition-colors cursor-pointer"
              title="Share research paper link"
            >
              {copiedLink ? <Check className="w-3 h-3 text-[#00A878]" /> : <Share2 className="w-3 h-3 text-[#D5991C]" />}
              <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Render Page 1 or Page 2 */}
      {subPage === 'paper' ? (
        <WhitepaperReader
          onSwitchToLab={() => handleSwitchSubPage('lab')}
          onNavigateToOverview={() => onNavigate('overview')}
        />
      ) : (
        <CounterGeoFindingsAndLab
          onSwitchToPaper={() => handleSwitchSubPage('paper')}
          onNavigateToOverview={() => onNavigate('overview')}
        />
      )}

    </div>
  );
};
