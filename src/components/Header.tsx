import React, { useState } from 'react';
import { Menu, X, Sparkles, Smartphone, ArrowRight, Share2 } from 'lucide-react';
import { ActiveTab } from '../types';

interface HeaderProps {
  activeTab: ActiveTab;
  onNavigate: (tab: ActiveTab) => void;
  onOpenAboutModal: () => void;
  onExportClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onNavigate,
  onOpenAboutModal,
  onExportClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element wordmark) */}
        <div 
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 cursor-pointer whitespace-nowrap shrink-0 group select-none"
        >
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 flex items-center justify-center text-white font-black text-sm shadow-sm group-hover:scale-105 transition-transform">
            N
          </div>
          <span className="text-xl font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
            NexVora Colors
          </span>
        </div>

        {/* Zone 2: 4-5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-slate-600">
          <button
            onClick={() => onNavigate('generator')}
            className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'generator' ? 'text-blue-600' : ''
            }`}
          >
            Generator
          </button>
          <button
            onClick={() => onNavigate('explore')}
            className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'explore' ? 'text-blue-600' : ''
            }`}
          >
            Explore
          </button>
          <button
            onClick={() => onNavigate('image-picker')}
            className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'image-picker' ? 'text-blue-600' : ''
            }`}
          >
            Image Picker
          </button>
          <button
            onClick={() => onNavigate('contrast-checker')}
            className={`hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 ${
              activeTab === 'contrast-checker' ? 'text-blue-600' : ''
            }`}
          >
            Contrast Checker
          </button>
          <button
            onClick={onOpenAboutModal}
            className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0 flex items-center gap-1 text-slate-500"
          >
            <span>About Dev & Co</span>
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="hidden md:flex items-center gap-3 shrink-0">
          {activeTab === 'generator' ? (
            <button
              onClick={onExportClick}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm shadow-blue-500/20 whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Export Palette</span>
            </button>
          ) : (
            <button
              onClick={() => onNavigate('generator')}
              className="px-4 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl transition-all shadow-sm shadow-blue-500/20 whitespace-nowrap shrink-0 flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Start Generator</span>
            </button>
          )}
        </div>

        {/* Mobile menu trigger */}
        <div className="flex md:hidden items-center gap-2">
          {activeTab !== 'generator' && (
            <button
              onClick={() => onNavigate('generator')}
              className="px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg shadow-xs"
            >
              Generator
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3 shadow-xl">
          <div className="flex flex-col space-y-2 text-sm font-semibold">
            <button
              onClick={() => {
                onNavigate('generator');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 px-3 rounded-lg ${
                activeTab === 'generator' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Spacebar Generator
            </button>
            <button
              onClick={() => {
                onNavigate('explore');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 px-3 rounded-lg ${
                activeTab === 'explore' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Explore Trending Palettes
            </button>
            <button
              onClick={() => {
                onNavigate('image-picker');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 px-3 rounded-lg ${
                activeTab === 'image-picker' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Extract from Image
            </button>
            <button
              onClick={() => {
                onNavigate('contrast-checker');
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2 px-3 rounded-lg ${
                activeTab === 'contrast-checker' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-100'
              }`}
            >
              Contrast Checker
            </button>
            <button
              onClick={() => {
                onOpenAboutModal();
                setMobileMenuOpen(false);
              }}
              className="text-left py-2 px-3 rounded-lg text-slate-700 hover:bg-slate-100 flex items-center justify-between"
            >
              <span>About Developer & Company</span>
              <Smartphone className="w-4 h-4 text-blue-600" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
