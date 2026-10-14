import React from 'react';
import { Outlet } from 'react-router-dom';
import { AssistantProvider } from '@/lib/AssistantContext';
import { LanguageProvider } from '@/lib/LanguageContext';
import Navbar from '@/components/site/Navbar';
import Footer from '@/components/site/Footer';
import AssistantPanel from '@/components/assistant/AssistantPanel';
import MascotCompanion from '@/components/mascot/MascotCompanion';
import ToolsDrawer from '@/components/tools/ToolsDrawer';
import CookieBanner from '@/components/site/CookieBanner';

export default function SiteLayout() {
  return (
    <LanguageProvider>
    <AssistantProvider>
      <div className="min-h-screen overflow-x-hidden">
        <Navbar />
        <main><Outlet /></main>
        <Footer />
      </div>
      <AssistantPanel />
      <MascotCompanion />
      <ToolsDrawer />
      <CookieBanner />
    </AssistantProvider>
    </LanguageProvider>
  );
}