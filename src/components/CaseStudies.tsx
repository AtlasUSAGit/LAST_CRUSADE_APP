import React, { useState } from 'react';
import { Award, Calculator } from 'lucide-react';
import { CASE_STUDIES } from '../data/geoData';

export const CaseStudies: React.FC = () => {
  const [activeCase, setActiveCase] = useState(0);

  // ROI Calculator State
  const [brandSearchVolume, setBrandSearchVolume] = useState<number>(250000);
  const [avgCustomerValue, setAvgCustomerValue] = useState<number>(1500);

  // Calculated estimated exposure risk
  const estimatedAiQueries = Math.round(brandSearchVolume * 0.42); // ~42% of search volume going to AI search/chat
  const estimatedHallucinatedQueries = Math.round(estimatedAiQueries * 0.08); // ~8% hallucination/distortion rate
  const potentialRevenueAtRisk = Math.round(estimatedHallucinatedQueries * (avgCustomerValue * 0.15));

  return (
    <section id="case-studies" className="py-20 md:py-28 relative bg-[#FBF3E2] border-t border-[#F2D69D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-[#FAF2E1] border border-[#F2D69D] text-[#D5991C] font-mono text-[11px] font-bold uppercase tracking-[0.2em]">
            <Award className="w-3.5 h-3.5" />
            <span>PROVEN CASE INTELLIGENCE</span>
          </div>
          <h2 className="font-serif font-normal text-3xl sm:text-5xl text-[#410217] tracking-tight leading-[1.05]">
            Defending Brand Truth at Enterprise Scale
          </h2>
          <p className="text-[#410217]/75 text-base sm:text-lg font-sans">
            Quantified security outcomes across Fortune 500 financial institutions, biopharma leaders, and SaaS unicorns.
          </p>
        </div>

        {/* Case Studies Selector Tabs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {CASE_STUDIES.map((cs, idx) => (
            <button
              key={cs.id}
              onClick={() => setActiveCase(idx)}
              className={`p-5 text-left transition-all border font-mono ${
                activeCase === idx
                  ? 'bg-[#410217] text-[#FBF3E2] border-[#410217] shadow-sm'
                  : 'bg-[#FAF2E1] border-[#F2D69D] text-[#410217]/75 hover:bg-[#F3E9D2]'
              }`}
            >
              <div className={`text-xs font-bold mb-1 uppercase tracking-wider ${activeCase === idx ? 'text-[#D5991C]' : 'text-[#410217]/60'}`}>{cs.clientCategory}</div>
              <div className={`font-serif text-base line-clamp-2 ${activeCase === idx ? 'text-[#FBF3E2]' : 'text-[#410217]'}`}>{cs.headline}</div>
            </button>
          ))}
        </div>

        {/* Active Case Study Detail Card */}
        <div className="bg-[#FAF2E1] border border-[#F2D69D] p-8 shadow-xs mb-16">
          <div className="flex flex-col lg:flex-row justify-between gap-8 pb-8 mb-8 border-b border-[#F2D69D]">
            <div className="space-y-4 lg:max-w-2xl">
              <span className="font-mono text-xs text-[#D5991C] uppercase tracking-[0.2em] font-bold">
                CLIENT CASE STUDY // {CASE_STUDIES[activeCase].clientCategory}
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#410217] tracking-tight">
                {CASE_STUDIES[activeCase].headline}
              </h3>
              <div>
                <strong className="text-[#8B1E1E] font-mono text-xs block mb-1 uppercase tracking-wider">THE ATTACK / CHALLENGE:</strong>
                <p className="text-[#410217]/80 text-sm leading-relaxed font-sans">{CASE_STUDIES[activeCase].challenge}</p>
              </div>
              <div>
                <strong className="text-[#410217] font-mono text-xs block mb-1 uppercase tracking-wider">LAST CRUSADE DEFENSE COUNTERMEASURE SOLUTION:</strong>
                <p className="text-[#410217]/80 text-sm leading-relaxed font-sans">{CASE_STUDIES[activeCase].solution}</p>
              </div>
            </div>

            {/* Metrics Breakdown */}
            <div className="grid grid-cols-1 gap-4 lg:w-80 shrink-0">
              {CASE_STUDIES[activeCase].metrics.map((metric, i) => (
                <div key={i} className="bg-[#FFFDF8] p-4 border border-[#F2D69D] space-y-1">
                  <div className="font-serif font-bold text-3xl text-[#410217]">{metric.value}</div>
                  <div className="font-sans font-bold text-xs text-[#D5991C] uppercase tracking-wider">{metric.label}</div>
                  <div className="font-mono text-[11px] text-[#410217]/60">{metric.detail}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between font-mono text-xs text-[#410217]/70 uppercase tracking-wider font-semibold">
            <span>TIMEFRAME: <strong className="text-[#410217]">{CASE_STUDIES[activeCase].timeframe}</strong></span>
            <span>VERIFIED BY: <strong className="text-[#410217]">{CASE_STUDIES[activeCase].verifiedBy}</strong></span>
          </div>
        </div>

        {/* Interactive Brand AI Risk Exposure Calculator Widget */}
        <div className="bg-[#FAF2E1] border border-[#F2D69D] p-8 shadow-xs">
          <div className="flex items-center space-x-3.5 mb-6">
            <div className="w-10 h-10 bg-[#FFFDF8] border border-[#410217]/30 flex items-center justify-center text-[#410217]">
              <Calculator className="w-5 h-5 text-[#D5991C]" />
            </div>
            <div>
              <span className="font-mono text-[11px] text-[#D5991C] uppercase tracking-[0.2em] font-bold block">
                INTERACTIVE ASSESSMENT TOOL
              </span>
              <h3 className="font-serif text-2xl text-[#410217] tracking-tight">
                Estimate Your Generative AI Brand Exposure Risk
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Sliders */}
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-[#410217]/80 font-semibold">ESTIMATED MONTHLY BRAND SEARCH VOLUME:</span>
                  <span className="text-[#410217] font-bold">{brandSearchVolume.toLocaleString()} / mo</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="2000000"
                  step="25000"
                  value={brandSearchVolume}
                  onChange={(e) => setBrandSearchVolume(Number(e.target.value))}
                  className="w-full accent-[#410217] cursor-pointer"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between font-mono text-xs">
                  <span className="text-[#410217]/80 font-semibold">AVERAGE CUSTOMER / DEAL VALUE ($):</span>
                  <span className="text-[#410217] font-bold">${avgCustomerValue.toLocaleString()}</span>
                </div>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={avgCustomerValue}
                  onChange={(e) => setAvgCustomerValue(Number(e.target.value))}
                  className="w-full accent-[#410217] cursor-pointer"
                />
              </div>
            </div>

            {/* Calculated Risk Output Card */}
            <div className="bg-[#FFFDF8] p-6 border border-[#410217]/30 space-y-4 font-mono shadow-xs">
              <div className="text-xs text-[#410217]/60 font-bold uppercase tracking-wider">ESTIMATED MONTHLY AI REVENUE AT RISK:</div>
              <div className="font-serif font-bold text-3xl sm:text-4xl text-[#410217]">
                ${potentialRevenueAtRisk.toLocaleString()} <span className="text-xs font-normal text-[#410217]/60 font-sans">/ mo</span>
              </div>
              <div className="space-y-1.5 text-xs text-[#410217]/80 border-t border-[#F2D69D] pt-3 font-sans">
                <div>• Estimated AI Answer Engine Queries: <strong className="text-[#410217]">{estimatedAiQueries.toLocaleString()}</strong></div>
                <div>• High-Risk Hallucinated / Poisoned Queries: <strong className="text-[#8B1E1E]">{estimatedHallucinatedQueries.toLocaleString()}</strong></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
