import React, { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ProblemSection } from './components/ProblemSection';
import { ServicesSection } from './components/ServicesSection';
import { ProcessSection } from './components/ProcessSection';
import { CapabilitiesGrid } from './components/CapabilitiesGrid';
import { TrustAndTeam } from './components/TrustAndTeam';
import { Footer } from './components/Footer';
import { AuditModal } from './components/AuditModal';
import { IncidentReportModal } from './components/IncidentReportModal';
import { ReaStudioPage } from './components/ReaStudioPage';
import { ServicesPage } from './components/ServicesPage';
import { CounterGeoPage } from './components/CounterGeoPage';
import { CounterGeoVol2Page } from './components/CounterGeoVol2Page';
import { CounterGeoVol3Page } from './components/CounterGeoVol3Page';
import { CounterGeoVol4Page } from './components/CounterGeoVol4Page';
import { CounterGeoCommandCenterPage } from './components/CounterGeoCommandCenterPage';
import { PitchDeckPage } from './components/PitchDeckPage';
import { ResearchPage } from './components/ResearchPage';
import { ParticleDrift } from './components/ParticleDrift';
import { NavigationPage } from './types';

gsap.registerPlugin(ScrollTrigger);

export default function App() {
  const [auditModalOpen, setAuditModalOpen] = useState(false);
  const [incidentModalOpen, setIncidentModalOpen] = useState(false);

  // Determine initial page from URL hash
  const getInitialPage = (): NavigationPage => {
    const hash = window.location.hash.toLowerCase();
    if (hash.includes('services')) return 'services';
    if (hash.includes('attack-library') || hash.includes('counter-geo-ops') || hash.includes('command-center') || hash.includes('counter-geo-html') || hash.includes('8-layer') || hash.includes('ops')) return 'counter-geo-ops';
    if (hash.includes('counter-geo-vol4') || hash.includes('volume-4') || hash.includes('vol4')) return 'counter-geo-vol4';
    if (hash.includes('counter-geo-vol3') || hash.includes('volume-3') || hash.includes('vol3')) return 'counter-geo-vol3';
    if (hash.includes('counter-geo-vol2') || hash.includes('volume-2') || hash.includes('vol2')) return 'counter-geo-vol2';
    if (hash.includes('counter-geo') || hash.includes('visualizer')) return 'counter-geo';
    if (hash.includes('research') || hash.includes('whitepaper') || hash.includes('papers')) return 'research';
    if (hash.includes('rea') || hash.includes('studio') || hash.includes('workbench')) return 'rea';
    if (hash.includes('pitch-deck') || hash.includes('pitch') || hash.includes('deck')) return 'pitch-deck';
    return 'overview';
  };

  const [currentPage, setCurrentPage] = useState<NavigationPage>(getInitialPage);

  // Sync hash changes with page state
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.toLowerCase();
      if (hash.includes('services')) {
        setCurrentPage('services');
      } else if (hash.includes('attack-library') || hash.includes('counter-geo-ops') || hash.includes('command-center') || hash.includes('counter-geo-html') || hash.includes('8-layer') || hash.includes('ops')) {
        setCurrentPage('counter-geo-ops');
      } else if (hash.includes('counter-geo-vol4') || hash.includes('volume-4') || hash.includes('vol4')) {
        setCurrentPage('counter-geo-vol4');
      } else if (hash.includes('counter-geo-vol3') || hash.includes('volume-3') || hash.includes('vol3')) {
        setCurrentPage('counter-geo-vol3');
      } else if (hash.includes('counter-geo-vol2') || hash.includes('volume-2') || hash.includes('vol2')) {
        setCurrentPage('counter-geo-vol2');
      } else if (hash.includes('counter-geo') || hash.includes('visualizer')) {
        setCurrentPage('counter-geo');
      } else if (hash.includes('research') || hash.includes('whitepaper') || hash.includes('papers')) {
        setCurrentPage('research');
      } else if (hash.includes('rea') || hash.includes('studio') || hash.includes('workbench')) {
        setCurrentPage('rea');
      } else if (hash.includes('pitch-deck') || hash.includes('pitch') || hash.includes('deck')) {
        setCurrentPage('pitch-deck');
      } else if (hash === '' || hash === '#' || hash === '#/') {
        setCurrentPage('overview');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Navigation handler
  const handleNavigate = (page: NavigationPage, subPage?: 'paper' | 'lab') => {
    setCurrentPage(page);
    if (page === 'overview') {
      window.location.hash = '#/';
    } else if (page === 'services') {
      window.location.hash = '#/services';
    } else if (page === 'rea') {
      window.location.hash = '#/rea';
    } else if (page === 'research') {
      window.location.hash = '#/research';
    } else if (page === 'counter-geo') {
      window.location.hash = subPage ? `#/counter-geo/${subPage}` : '#/counter-geo';
    } else if (page === 'counter-geo-vol2') {
      window.location.hash = subPage ? `#/counter-geo-vol2/${subPage}` : '#/counter-geo-vol2';
    } else if (page === 'counter-geo-vol3') {
      window.location.hash = subPage ? `#/counter-geo-vol3/${subPage}` : '#/counter-geo-vol3';
    } else if (page === 'counter-geo-vol4') {
      window.location.hash = subPage ? `#/counter-geo-vol4/${subPage}` : '#/counter-geo-vol4';
    } else if (page === 'counter-geo-ops') {
      window.location.hash = '#/attack-library';
    } else if (page === 'pitch-deck') {
      window.location.hash = '#/pitch-deck';
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Responsive detection for mobile density optimization
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#FAF5EB] text-[#410217] font-sans selection:bg-[#410217]/15 selection:text-[#410217] overflow-x-hidden">
      {/* Particle Drift WebGL Living Background for the whole Home Page */}
      {currentPage === 'overview' && (
        <div className="fixed inset-0 pointer-events-none z-0" aria-hidden="true">
          <ParticleDrift
            background="#FAF5EB"
            baseColor="#320813"
            accentColor="#DDA743"
            density={isMobile ? 40 : 95}
            mobileDensity={40}
            dotSize={6}
            speed={50}
            direction={0}
            hover={200}
            linkDistance={230}
            linkThickness={1}
            style={{ width: '100%', height: '100%' }}
          />
        </div>
      )}

      {/* Subtle archival film grain overlay */}
      <div className="grain-overlay pointer-events-none" aria-hidden="true" />
      
      {/* Navigation Header */}
      <Header
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenAudit={() => setAuditModalOpen(true)}
        onOpenIncident={() => setIncidentModalOpen(true)}
      />

      {/* Page Routing */}
      {currentPage === 'overview' && (
        <main className="relative z-10">
          {/* 1. Hero with direct links to REA Studio & Counter-GEO */}
          <Hero
            onOpenAudit={() => setAuditModalOpen(true)}
            onOpenIncident={() => setIncidentModalOpen(true)}
            onNavigate={handleNavigate}
          />

          {/* 2. The Problem / Traditional SEO & Brand Protection Are Blind to AI Answers */}
          <ProblemSection />

          {/* 3. Counter-GEO Research (Advisories & Whitepapers) */}
          <TrustAndTeam onNavigate={handleNavigate} />

          {/* 4. Core Services */}
          <ServicesSection />

          {/* 5. Process Timeline */}
          <ProcessSection />

          {/* 6. Detection Capabilities Tech Grid */}
          <CapabilitiesGrid />
        </main>
      )}

      {currentPage === 'services' && (
        <ServicesPage
          onNavigate={handleNavigate}
          onOpenAudit={() => setAuditModalOpen(true)}
          onOpenIncident={() => setIncidentModalOpen(true)}
        />
      )}

      {currentPage === 'rea' && (
        <ReaStudioPage
          onNavigate={handleNavigate}
          onOpenAudit={() => setAuditModalOpen(true)}
          onOpenIncident={() => setIncidentModalOpen(true)}
        />
      )}

      {currentPage === 'research' && (
        <ResearchPage
          onNavigate={handleNavigate}
          onOpenAudit={() => setAuditModalOpen(true)}
          onOpenIncident={() => setIncidentModalOpen(true)}
        />
      )}

      {currentPage === 'counter-geo' && (
        <CounterGeoPage
          onNavigate={handleNavigate}
          onOpenAudit={() => setAuditModalOpen(true)}
          onOpenIncident={() => setIncidentModalOpen(true)}
          initialSubPage={
            window.location.hash.toLowerCase().includes('lab') || window.location.hash.toLowerCase().includes('visualizer')
              ? 'lab'
              : window.location.hash.toLowerCase().includes('paper')
              ? 'paper'
              : undefined
          }
        />
      )}

      {currentPage === 'counter-geo-vol2' && (
        <CounterGeoVol2Page
          onNavigate={handleNavigate}
          onOpenAudit={() => setAuditModalOpen(true)}
          onOpenIncident={() => setIncidentModalOpen(true)}
          initialSubPage={
            window.location.hash.toLowerCase().includes('lab') || window.location.hash.toLowerCase().includes('visualizer')
              ? 'lab'
              : window.location.hash.toLowerCase().includes('paper')
              ? 'paper'
              : undefined
          }
        />
      )}

      {currentPage === 'counter-geo-vol3' && (
        <CounterGeoVol3Page
          onNavigate={handleNavigate}
          onOpenAudit={() => setAuditModalOpen(true)}
          onOpenIncident={() => setIncidentModalOpen(true)}
          initialSubPage={
            window.location.hash.toLowerCase().includes('lab') || window.location.hash.toLowerCase().includes('visualizer') || window.location.hash.toLowerCase().includes('benchmark') || window.location.hash.toLowerCase().includes('lob')
              ? 'lab'
              : window.location.hash.toLowerCase().includes('paper')
              ? 'paper'
              : undefined
          }
        />
      )}

      {currentPage === 'counter-geo-vol4' && (
        <CounterGeoVol4Page
          onNavigate={handleNavigate}
          onOpenAudit={() => setAuditModalOpen(true)}
          onOpenIncident={() => setIncidentModalOpen(true)}
          initialSubPage={
            window.location.hash.toLowerCase().includes('lab') || window.location.hash.toLowerCase().includes('hardware') || window.location.hash.toLowerCase().includes('fpga') || window.location.hash.toLowerCase().includes('roi') || window.location.hash.toLowerCase().includes('visualizer')
              ? 'lab'
              : window.location.hash.toLowerCase().includes('paper')
              ? 'paper'
              : undefined
          }
        />
      )}

      {currentPage === 'counter-geo-ops' && (
        <CounterGeoCommandCenterPage
          onNavigate={handleNavigate}
          onOpenAudit={() => setAuditModalOpen(true)}
          onOpenIncident={() => setIncidentModalOpen(true)}
        />
      )}

      {currentPage === 'pitch-deck' && (
        <PitchDeckPage
          onNavigate={handleNavigate}
          onOpenAudit={() => setAuditModalOpen(true)}
          onOpenIncident={() => setIncidentModalOpen(true)}
        />
      )}

      {/* Footer */}
      {currentPage !== 'services' && currentPage !== 'pitch-deck' && (
        <Footer
          onOpenAudit={() => setAuditModalOpen(true)}
          onOpenIncident={() => setIncidentModalOpen(true)}
          onNavigate={handleNavigate}
        />
      )}

      {/* Modals */}
      <AuditModal
        isOpen={auditModalOpen}
        onClose={() => setAuditModalOpen(false)}
      />

      <IncidentReportModal
        isOpen={incidentModalOpen}
        onClose={() => setIncidentModalOpen(false)}
      />

    </div>
  );
}
