import React from 'react';
import { NavigationPage } from '../types';

interface ServicesPageProps {
  onNavigate: (page: NavigationPage) => void;
  onOpenAudit?: () => void;
  onOpenIncident?: () => void;
}

export const ServicesPage: React.FC<ServicesPageProps> = () => {
  return (
    <div className="w-full h-[calc(100vh-80px)] bg-[#07080a] relative overflow-hidden flex flex-col">
      <iframe
        src="/services.html"
        title="Last Crusade Defense // Volume IV: Sovereign & Institutional AI Search Defense"
        className="w-full h-full border-0 absolute inset-0 bg-[#07080a]"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      />
    </div>
  );
};
