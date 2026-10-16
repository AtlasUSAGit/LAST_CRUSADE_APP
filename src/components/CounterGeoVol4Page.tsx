import React, { useState, useEffect } from 'react';
import {
  FileText,
  Sparkles,
  ArrowLeft,
  Share2,
  Check
} from 'lucide-react';
import { NavigationPage } from '../types';
import { WhitepaperVol4Reader } from './WhitepaperVol4Reader';
import { CounterGeoVol4FindingsAndLab } from './CounterGeoVol4FindingsAndLab';
import { MASTER_DOC_VOL4_METADATA } from '../data/counterGeoVol4Content';

interface CounterGeoVol4PageProps {
  onNavigate: (page: NavigationPage, subPage?: 'paper' | 'lab') => void;
  onOpenAudit?: () => void;
  onOpenIncident?: () => void;
  initialSubPage?: 'paper' | 'lab';
}

export const CounterGeoVol4Page: React.FC<CounterGeoVol4PageProps> = ({
  onNavigate,
  onOpenAudit,
  onOpenIncident,
  initialSubPage
}) => {
  const getInitialSubPage = (): 'paper' | 'lab' => {
    if (initialSubPage) return initialSubPage;
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('lab') || hash.includes('fpga') || hash.includes('hardware') || hash.includes('visualizer') || hash.includes('roi')) {
      return 'lab';
    }
    return 'paper';
  };

  const [subPage, setSubPage] = useState<'paper' | 'lab'>(getInitialSubPage);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    if (initialSubPage) {
      setSubPage(initialSubPage);
    }
  }, [initialSubPage]);

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('lab') || hash.includes('fpga') || hash.includes('hardware') || hash.includes('visualizer') || hash.includes('roi')) {
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
    window.location.hash = page === 'paper' ? '#/counter-geo-vol4/paper' : '#/counter-geo-vol4/lab';
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
      <div className="bg-[#363636] text-[#FBF3E2] border-b border-[#D5991C]/30 py-3 px-4 sm:px-6 lg:px-8 sticky top-0 z-50 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4 text-xs font-mono">
          
          {/* Back & Breadcrumb */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => onNavigate('research')}
              className="flex items-center space-x-1.5 px-3 py-1 bg-[#2a2a2a] hover:bg-[#410217] border border-[#D5991C]/40 text-[#FBF3E2] font-bold uppercase transition-colors cursor-pointer"
              title="Return to Research Corpus"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-[#D5991C]" />
              <span>Back to Research</span>
            </button>

            <div className="hidden md:flex items-center space-x-2 text-[#FBF3E2]/60">
              <button
                onClick={() => onNavigate('research')}
                className="hover:text-[#D5991C] transition-colors cursor-pointer"
              >
                RESEARCH
              </button>
              <span>/</span>
              <span className="text-[#D5991C] font-bold">{MASTER_DOC_VOL4_METADATA.id}</span>
              <span>/</span>
              <span className="text-[#FBF3E2]/90">{MASTER_DOC_VOL4_METADATA.volume}</span>
            </div>
          </div>

          {/* DUAL PAGE SWITCHER (Page 1 vs Page 2) */}
          <div className="flex items-center p-1 bg-[#2a2a2a] border border-[#D5991C]/40 rounded-none shadow-inner">
            <button
              onClick={() => handleSwitchSubPage('paper')}
              className={`flex items-center space-x-2 px-4 py-1.5 font-bold uppercase tracking-wider transition-all cursor-pointer ${
                subPage === 'paper'
                  ? 'bg-[#410217] text-[#FAF5EB] border border-[#D5991C]/60 shadow-sm'
                  : 'text-[#FBF3E2]/70 hover:text-[#FBF3E2]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Page 1: Full Whitepaper Vol. 4 (Word-for-Word)</span>
            </button>

            <button
              onClick={() => handleSwitchSubPage('lab')}
              className={`flex items-center space-x-2 px-4 py-1.5 font-bold uppercase tracking-wider transition-all cursor-pointer ${
                subPage === 'lab'
                  ? 'bg-[#D5991C] text-[#120826] shadow-sm font-black'
                  : 'text-[#FBF3E2]/70 hover:text-[#FBF3E2]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Page 2: Findings, Hardware Lab & Visualizers</span>
            </button>
          </div>

          {/* Share Action */}
          <div className="flex items-center space-x-2">
            <button
              onClick={handleShareLink}
              className="flex items-center space-x-1.5 px-3 py-1 bg-[#221016] hover:bg-[#410217] border border-[#D5991C]/30 text-[#FBF3E2] transition-colors cursor-pointer"
              title="Share research paper link"
            >
              {copiedLink ? <Check className="w-3 h-3 text-[#D5991C]" /> : <Share2 className="w-3 h-3 text-[#D5991C]" />}
              <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
            </button>
          </div>

        </div>
      </div>

      {/* Render Page 1 or Page 2 */}
      {subPage === 'paper' ? (
        <WhitepaperVol4Reader
          onSwitchToLab={() => handleSwitchSubPage('lab')}
          onNavigateToOverview={() => onNavigate('overview')}
        />
      ) : (
        <CounterGeoVol4FindingsAndLab
          onSwitchToPaper={() => handleSwitchSubPage('paper')}
          onNavigateToOverview={() => onNavigate('overview')}
        />
      )}

    </div>
  );
};
