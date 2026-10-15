import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  FileText,
  Search,
  Copy,
  Check,
  Download,
  BookOpen,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Shield,
  Layers,
  Sparkles,
  Bookmark,
  Share2
} from 'lucide-react';
import {
  MASTER_DOC_VOLUME_2_MARKDOWN,
  MASTER_DOC_VOL2_SECTIONS,
  MASTER_DOC_VOL2_METADATA,
  PaperSection
} from '../data/counterGeoVol2Content';

interface WhitepaperVol2ReaderProps {
  onSwitchToLab: () => void;
  onNavigateToOverview: () => void;
}

export const WhitepaperVol2Reader: React.FC<WhitepaperVol2ReaderProps> = ({
  onSwitchToLab,
  onNavigateToOverview
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>(MASTER_DOC_VOL2_SECTIONS[0]?.id || 'executive-overview');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [copiedCodeKey, setCopiedCodeKey] = useState<string | null>(null);
  const [copiedPaper, setCopiedPaper] = useState(false);
  const [readProgress, setReadProgress] = useState(0);
  const contentContainerRef = useRef<HTMLDivElement>(null);

  // Track scroll reading progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
        setReadProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Update active section based on scroll intersection
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSectionId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0px -70% 0px' }
    );

    MASTER_DOC_VOL2_SECTIONS.forEach((sec) => {
      const el = document.getElementById(sec.id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const handleScrollToSection = (id: string) => {
    setActiveSectionId(id);
    const element = document.getElementById(id);
    if (element) {
      const yOffset = -90;
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const handleCopyPaper = () => {
    navigator.clipboard.writeText(MASTER_DOC_VOLUME_2_MARKDOWN);
    setCopiedPaper(true);
    setTimeout(() => setCopiedPaper(false), 2500);
  };

  const handleCopySnippet = (codeText: string, key: string) => {
    navigator.clipboard.writeText(codeText);
    setCopiedCodeKey(key);
    setTimeout(() => setCopiedCodeKey(null), 2000);
  };

  // Filter sections when user searches
  const filteredSections = useMemo(() => {
    if (!searchQuery.trim()) return MASTER_DOC_VOL2_SECTIONS;
    const q = searchQuery.toLowerCase();
    return MASTER_DOC_VOL2_SECTIONS.filter(
      (sec) =>
        sec.title.toLowerCase().includes(q) ||
        sec.rawText.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const renderFormattedSection = (section: PaperSection) => {
    const raw = section.rawText;
    const lines = raw.split('\n');

    const isCodeSection = section.id.includes('production-implementation') || raw.includes('```');

    return (
      <div key={section.id} id={section.id} className="scroll-mt-24 mb-16 pb-12 border-b border-[#F2D69D]/50 last:border-b-0">
        
        {/* Section Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-2 text-[11px] font-mono text-[#D5991C] uppercase tracking-widest font-bold mb-1">
            <Bookmark className="w-3.5 h-3.5" />
            <span>SECTION REFERENCE // {section.id.toUpperCase()}</span>
          </div>
          
          {section.level === 1 && (
            <h1 className="font-serif text-3xl sm:text-4xl text-[#410217] font-bold tracking-tight">
              {section.title}
            </h1>
          )}
          {section.level === 2 && (
            <h2 className="font-serif text-2xl sm:text-3xl text-[#410217] font-bold tracking-tight">
              {section.title}
            </h2>
          )}
          {section.level === 3 && (
            <h3 className="font-serif text-xl sm:text-2xl text-[#410217] font-bold">
              {section.title}
            </h3>
          )}

          {/* Jump to Interactive Lab CTA on algorithm sections */}
          {(section.id.includes('layer') || isCodeSection || section.id.includes('martingale') || section.id.includes('zk')) && (
            <div className="mt-3 flex items-center space-x-3">
              <button
                onClick={onSwitchToLab}
                className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] text-xs font-mono font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D5991C]" />
                <span>Run This Algorithm in Interactive Lab (Page 2)</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Section Body */}
        <div className="space-y-4 text-[#410217]/90 leading-relaxed font-sans text-sm sm:text-base selection:bg-[#410217]/15">
          {renderMarkdownBody(lines, section.id)}
        </div>

      </div>
    );
  };

  const renderMarkdownBody = (lines: string[], sectionId: string) => {
    const elements: React.ReactNode[] = [];
    let inCodeBlock = false;
    let codeLanguage = '';
    let codeBuffer: string[] = [];
    let inTable = false;
    let tableBuffer: string[] = [];
    let inAsciiBox = false;
    let asciiBuffer: string[] = [];

    const flushCode = (key: string) => {
      const codeText = codeBuffer.join('\n');
      elements.push(
        <div key={key} className="my-6 rounded-none bg-[#363636] border border-[#F2D69D]/40 text-[#FBF3E2] overflow-hidden shadow-xl">
          <div className="px-4 py-2 bg-[#2a2a2a] border-b border-[#F2D69D]/30 flex items-center justify-between text-xs font-mono">
            <span className="text-[#D5991C] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#00A878]" />
              {codeLanguage || 'PYTHON SOURCE'} // VOLUME II SPECIFICATION
            </span>
            <button
              onClick={() => handleCopySnippet(codeText, key)}
              className="flex items-center space-x-1 text-[#FBF3E2]/80 hover:text-[#FBF3E2] transition-colors cursor-pointer"
            >
              {copiedCodeKey === key ? (
                <>
                  <Check className="w-3.5 h-3.5 text-[#00A878]" />
                  <span className="text-[#00A878]">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-4 text-xs font-mono overflow-x-auto leading-relaxed text-[#FBF3E2]/90 whitespace-pre">
            <code>{codeText}</code>
          </pre>
        </div>
      );
      codeBuffer = [];
      inCodeBlock = false;
    };

    const flushTable = (key: string) => {
      const tableLines = [...tableBuffer];
      tableBuffer = [];
      inTable = false;
      if (tableLines.length < 2) return;

      const headerCells = tableLines[0].split('|').filter(c => c.trim().length > 0).map(c => c.trim().replace(/\*\*/g, ''));
      const rowLines = tableLines.slice(2);

      elements.push(
        <div key={key} className="my-6 overflow-x-auto border border-[#F2D69D] bg-[#FAF2E1] shadow-xs">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-[#410217] text-[#FBF3E2] font-serif font-bold">
                {headerCells.map((h, i) => (
                  <th key={i} className="p-3 border-r border-[#F2D69D]/30 last:border-r-0">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rowLines.map((r, ri) => {
                const cells = r.split('|').filter(c => c.trim().length > 0).map(c => c.trim());
                return (
                  <tr key={ri} className="border-t border-[#F2D69D] hover:bg-[#F5EAD4] transition-colors">
                    {cells.map((cell, ci) => (
                      <td key={ci} className="p-3 border-r border-[#F2D69D]/40 last:border-r-0 font-sans text-xs sm:text-sm text-[#410217]">
                        {formatInlineMarkdown(cell)}
                      </td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      );
    };

    const flushAsciiBox = (key: string) => {
      const boxText = asciiBuffer.join('\n');
      asciiBuffer = [];
      inAsciiBox = false;
      elements.push(
        <div key={key} className="my-6 p-4 bg-[#363636] border border-[#F2D69D]/40 rounded-none overflow-x-auto text-xs font-mono text-[#D5991C] shadow-lg whitespace-pre leading-snug">
          {boxText}
        </div>
      );
    };

    lines.forEach((line, idx) => {
      // Code blocks
      if (line.trim().startsWith('```')) {
        if (!inCodeBlock) {
          inCodeBlock = true;
          codeLanguage = line.trim().replace('```', '') || 'plaintext';
          codeBuffer = [];
        } else {
          flushCode(`${sectionId}-code-${idx}`);
        }
        return;
      }
      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // ASCII architecture diagrams / boxes
      if (line.includes('┌──────') || line.includes('╔══════') || line.includes('======') && lines[idx + 1]?.includes('│')) {
        inAsciiBox = true;
        asciiBuffer.push(line);
        return;
      }
      if (inAsciiBox) {
        asciiBuffer.push(line);
        if (line.includes('└──────') || line.includes('╝══════') || (line.includes('======') && asciiBuffer.length > 5)) {
          flushAsciiBox(`${sectionId}-ascii-${idx}`);
        }
        return;
      }

      // Markdown Tables
      if (line.trim().startsWith('|') && line.trim().endsWith('|')) {
        inTable = true;
        tableBuffer.push(line);
        return;
      }
      if (inTable) {
        flushTable(`${sectionId}-table-${idx}`);
      }

      // Math block equations $$ ... $$
      if (line.trim().startsWith('$$') && line.trim().endsWith('$$') && line.trim().length > 4) {
        const mathContent = line.trim().slice(2, -2).trim();
        elements.push(
          <div key={`math-${idx}`} className="my-5 p-4 bg-[#FAF2E1] border-l-4 border-[#00A878] border-y border-r border-[#F2D69D] text-center overflow-x-auto shadow-xs">
            <div className="font-mono text-sm sm:text-base text-[#410217] font-bold tracking-wide">
              {mathContent}
            </div>
          </div>
        );
        return;
      }

      // Headings inside section body
      if (line.startsWith('#### ')) {
        elements.push(
          <h4 key={`h4-${idx}`} className="font-serif text-lg font-bold text-[#410217] mt-5 mb-2">
            {line.replace('#### ', '')}
          </h4>
        );
        return;
      }

      // Bullet lists
      if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
        const bulletText = line.trim().replace(/^[-*]\s+/, '');
        elements.push(
          <li key={`li-${idx}`} className="ml-5 list-disc my-1 pl-1 text-[#410217]/90 text-sm sm:text-base">
            {formatInlineMarkdown(bulletText)}
          </li>
        );
        return;
      }

      // Numbered lists
      const numMatch = line.trim().match(/^(\d+)\.\s+(.*)$/);
      if (numMatch) {
        elements.push(
          <div key={`num-${idx}`} className="flex items-start space-x-2 my-2 text-sm sm:text-base">
            <span className="font-mono font-bold text-[#D5991C] text-sm shrink-0 mt-0.5">
              {numMatch[1]}.
            </span>
            <div className="text-[#410217]/90">
              {formatInlineMarkdown(numMatch[2])}
            </div>
          </div>
        );
        return;
      }

      // Regular Paragraph
      if (line.trim().length > 0) {
        elements.push(
          <p key={`p-${idx}`} className="text-sm sm:text-base leading-relaxed text-[#410217]/85 my-2.5">
            {formatInlineMarkdown(line)}
          </p>
        );
      }
    });

    if (inCodeBlock) flushCode(`${sectionId}-code-end`);
    if (inTable) flushTable(`${sectionId}-table-end`);
    if (inAsciiBox) flushAsciiBox(`${sectionId}-ascii-end`);

    return elements;
  };

  const formatInlineMarkdown = (text: string): React.ReactNode => {
    const parts = text.split(/(\*\*.*?\*\*|\$.*?\$|`.*?`)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-[#410217]">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('$') && part.endsWith('$')) {
        return (
          <span key={index} className="font-mono text-xs sm:text-sm font-semibold bg-[#FAF2E1] text-[#004566] px-1 py-0.5 border border-[#F2D69D]/60 mx-0.5">
            {part.slice(1, -1)}
          </span>
        );
      }
      if (part.startsWith('`') && part.endsWith('`')) {
        return (
          <code key={index} className="font-mono text-xs bg-[#363636] text-[#FBF3E2] px-1.5 py-0.5 border border-[#F2D69D]/30 mx-0.5">
            {part.slice(1, -1)}
          </code>
        );
      }
      return part;
    });
  };

  return (
    <div className="min-h-screen bg-[#FBF3E2] text-[#410217]">
      
      {/* Top Reading Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-[#F2D69D] z-50">
        <div
          className="h-full bg-linear-to-r from-[#00A878] via-[#D5991C] to-[#410217] transition-all duration-150"
          style={{ width: `${readProgress}%` }}
        />
      </div>

      {/* Hero Header of Academic Whitepaper Vol 2 */}
      <header className="border-b border-[#F2D69D] bg-[#FAF2E1] py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* Breadcrumb & Navigation */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 text-xs font-mono">
            <div className="flex items-center space-x-2 text-[#410217]/70">
              <button
                onClick={onNavigateToOverview}
                className="hover:text-[#410217] hover:underline cursor-pointer"
              >
                LAST CRUSADE DEFENSE
              </button>
              <span>/</span>
              <span>PUBLIC RESEARCH & ZERO-DAY ADVISORIES</span>
              <span>/</span>
              <span className="text-[#00A878] font-bold">{MASTER_DOC_VOL2_METADATA.id}</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyPaper}
                className="flex items-center space-x-1.5 px-3 py-1.5 bg-[#FAF2E1] border border-[#F2D69D] hover:bg-[#F2D69D]/40 text-[#410217] font-bold text-xs cursor-pointer transition-colors"
                title="Copy full markdown text"
              >
                {copiedPaper ? <Check className="w-3.5 h-3.5 text-[#00A878]" /> : <Copy className="w-3.5 h-3.5 text-[#D5991C]" />}
                <span>{copiedPaper ? 'Full Paper Copied' : 'Copy Full Markdown'}</span>
              </button>

              <button
                onClick={onSwitchToLab}
                className="flex items-center space-x-1.5 px-4 py-1.5 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] font-bold text-xs uppercase tracking-wider cursor-pointer transition-colors shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#D5991C]" />
                <span>Launch Volume 2 Interactive Lab (Page 2)</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Academic Paper Metadata Header */}
          <div className="space-y-4 max-w-4xl">
            <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
              <span className="px-2.5 py-1 bg-[#00A878] text-[#130108] font-bold uppercase tracking-wider">
                CLASSIFICATION: {MASTER_DOC_VOL2_METADATA.classification}
              </span>
              <span className="px-2.5 py-1 bg-[#FAF2E1] border border-[#F2D69D] text-[#004566] font-bold uppercase tracking-wider">
                {MASTER_DOC_VOL2_METADATA.volume} (LAYERS 5–8)
              </span>
              <span className="px-2.5 py-1 bg-[#FAF2E1] border border-[#F2D69D] text-[#410217]/80">
                DATE: {MASTER_DOC_VOL2_METADATA.date}
              </span>
              <span className="px-2.5 py-1 bg-[#FAF2E1] border border-[#F2D69D] text-[#D5991C] font-bold">
                EST. READ: {MASTER_DOC_VOL2_METADATA.estimatedReadTimeMinutes} MIN (~{MASTER_DOC_VOL2_METADATA.wordCount.toLocaleString()} WORDS)
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl text-[#410217] font-bold tracking-tight leading-tight">
              {MASTER_DOC_VOL2_METADATA.title}
            </h1>

            <p className="text-[#410217]/75 font-serif italic text-base sm:text-lg">
              Authored by {MASTER_DOC_VOL2_METADATA.authors}
            </p>

            <div className="p-4 bg-[#FFFDF8] border border-[#F2D69D] text-xs font-mono space-y-1.5">
              <div className="text-[#00A878] font-bold uppercase tracking-wider">
                CITATION BIBTEX KEY: [LastCrusadeDefense-CounterGEO-Vol2-2026]
              </div>
              <div className="text-[#410217]/75">
                DOI: {MASTER_DOC_VOL2_METADATA.doi} // Sovereign Defense Specification Vol. II
              </div>
            </div>
          </div>

        </div>
      </header>

      {/* Main Two-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sticky Table of Contents */}
          <aside className="lg:col-span-4 sticky top-24 max-h-[calc(100vh-120px)] overflow-y-auto bg-[#FAF2E1] border border-[#F2D69D] p-5 shadow-xs space-y-5 text-xs font-mono">
            
            {/* Search Input */}
            <div>
              <div className="flex items-center justify-between text-[#00A878] font-bold uppercase tracking-wider mb-2">
                <span className="flex items-center gap-1.5">
                  <Search className="w-3.5 h-3.5" />
                  Search Volume 2
                </span>
                <span className="text-[10px] text-[#410217]/60">FULL TEXT</span>
              </div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Filter sections (e.g. Martingale, SGL-CMI, Saliency, zk-SNARK)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#FFFDF8] border border-[#F2D69D] px-3 py-2 text-xs text-[#410217] placeholder:text-[#410217]/40 focus:outline-hidden focus:border-[#410217]"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-2 text-[#410217]/60 hover:text-[#410217]"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Document Outline */}
            <div>
              <div className="flex items-center justify-between text-[#410217] font-bold uppercase tracking-wider border-b border-[#F2D69D] pb-2 mb-3">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-[#00A878]" />
                  Volume II Outline
                </span>
                <span className="text-[10px] text-[#00A878]">
                  {filteredSections.length} SECTIONS
                </span>
              </div>

              <div className="space-y-1">
                {filteredSections.map((sec) => {
                  const isActive = activeSectionId === sec.id;
                  const isSubsection = sec.level === 3;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => handleScrollToSection(sec.id)}
                      className={`w-full text-left py-1.5 px-2.5 text-xs transition-all cursor-pointer flex items-center justify-between rounded-none ${
                        isSubsection ? 'pl-6 text-[11px]' : 'font-bold'
                      } ${
                        isActive
                          ? 'bg-[#410217] text-[#FBF3E2] font-bold shadow-xs'
                          : 'text-[#410217]/80 hover:bg-[#F2D69D]/40 hover:text-[#410217]'
                      }`}
                    >
                      <span className="truncate pr-2">{sec.title}</span>
                      {isActive && <ChevronRight className="w-3 h-3 text-[#00A878] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="border-t border-[#F2D69D] pt-4 space-y-2">
              <button
                onClick={onSwitchToLab}
                className="w-full py-2 bg-[#410217] hover:bg-[#5C0A24] text-[#FBF3E2] font-bold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center space-x-1.5 shadow-xs"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#00A878]" />
                <span>Open Page 2: Volume 2 Lab</span>
              </button>

              <button
                onClick={handleCopyPaper}
                className="w-full py-2 bg-[#FAF2E1] border border-[#F2D69D] hover:bg-[#F2D69D]/40 text-[#410217] font-bold text-xs cursor-pointer flex items-center justify-center space-x-1.5"
              >
                <Download className="w-3.5 h-3.5 text-[#D5991C]" />
                <span>Export Volume 2 Markdown</span>
              </button>
            </div>

            {/* Layers 5-8 Summary Pill */}
            <div className="p-3 bg-[#FFFDF8] border border-[#F2D69D] text-[10px] space-y-1.5">
              <div className="text-[#00A878] font-bold uppercase">
                VOLUME II LAYERS (GEN-3 DEFENSE):
              </div>
              <div className="text-[#410217]/70 space-y-1">
                <div>• L5: DMEM-WMQ (Martingale & W_2 Rollback)</div>
                <div>• L6: SGL-CMI (Swarm Echo De-Duplication)</div>
                <div>• L7: CM-JSAS (Multimodal Saliency Scrub)</div>
                <div>• L8: ZK-CGEO (Zero-Knowledge SNARK Proofs)</div>
              </div>
            </div>

          </aside>

          {/* Right Document Content: Complete Word-for-Word */}
          <main ref={contentContainerRef} className="lg:col-span-8 bg-[#FFFDF8] border border-[#F2D69D] p-6 sm:p-10 shadow-sm">
            {filteredSections.map((section) => renderFormattedSection(section))}
          </main>

        </div>
      </div>

    </div>
  );
};
