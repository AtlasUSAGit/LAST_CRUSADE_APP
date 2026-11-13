import React, { useState } from 'react';
import {
  Menu,
  X,
  ArrowUpRight,
  Sparkles,
  Compass,
  Shield,
  Home,
  BookOpen,
  Layers,
  Terminal,
} from 'lucide-react';
import { NavigationPage } from '../types';

interface HeaderProps {
  activePage: NavigationPage;
  onNavigate: (page: NavigationPage) => void;
  onOpenAudit: () => void;
  onOpenIncident: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  onNavigate,
  onOpenAudit,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems: {
    id: NavigationPage;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    { id: 'overview', label: 'Overview', icon: Home },
    { id: 'pitch-deck', label: 'Cover Deck', icon: Compass },
    { id: 'research', label: 'Research Whitepapers', icon: BookOpen },
    { id: 'services', label: 'Defense Architecture', icon: Layers },
    { id: 'counter-geo-ops', label: '3D Threat Lab', icon: Sparkles },
    { id: 'rea', label: 'REA Workbench', icon: Terminal },
  ];

  const handleNavClick = (page: NavigationPage) => {
    onNavigate(page);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#410217]/95 backdrop-blur-md border-b border-[#F2D69D]/25 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo */}
          <div
            onClick={() => handleNavClick('overview')}
            className="flex items-center space-x-3.5 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-[#5C0A24] to-[#2B010F] border border-[#D5991C]/50 group-hover:border-[#D5991C] transition-all duration-300 shadow-sm group-hover:shadow-[0_0_16px_rgba(213,153,28,0.25)]">
              <svg viewBox="0 0 28 28" className="w-5 h-5 text-[#D5991C] transition-transform duration-300 group-hover:scale-110" fill="none">
                <circle cx="14" cy="14" r="10" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 2" />
                <path d="M14 5L21 14L14 23L7 14L14 5Z" stroke="#FBF3E2" strokeWidth="1.4" fill="rgba(213,153,28,0.18)" />
                <circle cx="14" cy="14" r="2.5" fill="#D5991C" />
              </svg>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-2">
                <span className="font-serif font-bold text-xl tracking-tight text-[#FBF3E2] leading-none group-hover:text-[#D5991C] transition-colors">
                  Last Crusade
                </span>
              </div>
              <span className="text-[11px] text-[#FBF3E2]/65 font-sans mt-0.5">
                AI Search &amp; Agent Security
              </span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive =
                activePage === item.id ||
                (item.id === 'research' &&
                  (activePage === 'counter-geo' ||
                    activePage === 'counter-geo-vol2' ||
                    activePage === 'counter-geo-vol3' ||
                    activePage === 'counter-geo-vol4' ||
                    activePage === 'counter-geo-vol5'));
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative px-3.5 py-2 text-xs font-medium tracking-wide rounded-md transition-all cursor-pointer flex items-center space-x-1.5 ${
                    isActive
                      ? 'text-[#130108] bg-[#D5991C] font-semibold shadow-xs'
                      : 'text-[#F2D69D] hover:text-[#FBF3E2] hover:bg-[#5C0A24]/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#130108]' : 'text-[#D5991C]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Action CTA Button */}
          <div className="hidden md:flex items-center space-x-3">
            <button
              onClick={onOpenAudit}
              className="group flex items-center space-x-1.5 px-4 py-2.5 text-xs font-semibold rounded-md text-[#130108] bg-gradient-to-r from-[#D5991C] to-[#E5A932] hover:from-[#E5A932] hover:to-[#F2D69D] transition-all shadow-sm cursor-pointer"
            >
              <Shield className="w-3.5 h-3.5 text-[#130108]" />
              <span>Get in Touch</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#130108] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-[#FBF3E2]/80 hover:text-[#FBF3E2] focus:outline-hidden"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#350213] border-b border-[#F2D69D]/30 px-4 pt-3 pb-6 space-y-3 animate-fade-in">
          <div className="flex flex-col space-y-1">
            {navItems.map((item) => {
              const isActive = activePage === item.id;
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`text-left px-3.5 py-2.5 rounded-md text-sm font-medium transition-colors flex items-center justify-between ${
                    isActive
                      ? 'bg-[#D5991C] text-[#130108] font-semibold'
                      : 'text-[#F2D69D] hover:bg-[#5C0A24]/50 hover:text-[#FBF3E2]'
                  }`}
                >
                  <span className="flex items-center space-x-2">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#130108]' : 'text-[#D5991C]'}`} />
                    <span>{item.label}</span>
                  </span>
                  <ArrowUpRight className="w-4 h-4 opacity-60" />
                </button>
              );
            })}
          </div>
          <div className="pt-3 border-t border-[#F2D69D]/20">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenAudit();
              }}
              className="w-full py-2.5 text-center text-xs font-semibold rounded-md text-[#130108] bg-[#D5991C] hover:bg-[#E5A932] transition-colors"
            >
              Get in Touch
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
