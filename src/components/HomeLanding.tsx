import React, { useState } from 'react';
import {
  Sparkles,
  ArrowRight,
  Palette,
  Image as ImageIcon,
  CheckCircle2,
  Sliders,
  Eye,
  Smartphone,
  ExternalLink,
  MessageCircle,
  Shield,
  Zap,
  Heart,
  Shuffle,
} from 'lucide-react';
import { ActiveTab } from '../types';
import { CURATED_PALETTES } from '../data/curatedPalettes';
import { generatePaletteByHarmony, getColorName, getReadableTextColor } from '../utils/colorUtils';

interface HomeLandingProps {
  onNavigate: (tab: ActiveTab) => void;
  onOpenInGenerator: (colors: string[]) => void;
  onOpenAboutModal: () => void;
}

export const HomeLanding: React.FC<HomeLandingProps> = ({
  onNavigate,
  onOpenInGenerator,
  onOpenAboutModal,
}) => {
  // Interactive mini-palette on the hero
  const [heroColors, setHeroColors] = useState<string[]>([
    '264653',
    '2A9D8F',
    'E9C46A',
    'F4A261',
    'E76F51',
  ]);

  const randomizeHeroPalette = () => {
    const next = generatePaletteByHarmony(5, 'auto', []);
    setHeroColors(next);
  };

  return (
    <div className="space-y-20 pb-20 animate-in fade-in duration-200">
      {/* Hero Section */}
      <section className="pt-12 md:pt-20 px-4 max-w-6xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold shadow-xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>The Next Generation Color Suite · Version 1.0.0</span>
        </div>

        <div className="space-y-4 max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 leading-[1.08] text-balance">
            The super fast <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-pink-500">
              color palettes generator!
            </span>
          </h1>
          <p className="text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Create the perfect palette or get inspired by thousands of beautiful color schemes. Built for Android designers, web creators, and UI engineers.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onNavigate('generator')}
            className="w-full sm:w-auto px-8 py-4 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-2xl text-base font-bold transition-all shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 group"
          >
            <span>Start the generator!</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={() => onNavigate('explore')}
            className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 rounded-2xl text-base font-bold transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <Palette className="w-4 h-4 text-slate-500" />
            <span>Explore trending palettes</span>
          </button>
        </div>

        {/* Interactive Hero Palette Card */}
        <div className="pt-8 max-w-4xl mx-auto">
          <div className="p-3 bg-white rounded-3xl shadow-2xl border border-slate-200/80 space-y-3">
            {/* Interactive Color Stripes */}
            <div className="h-44 sm:h-56 w-full rounded-2xl overflow-hidden flex shadow-inner">
              {heroColors.map((c, i) => (
                <div
                  key={i}
                  onClick={() => onOpenInGenerator(heroColors)}
                  className="flex-1 flex flex-col justify-between p-3 sm:p-4 text-center cursor-pointer transition-all hover:flex-[1.2] group"
                  style={{ backgroundColor: `#${c}`, color: getReadableTextColor(c) }}
                >
                  <div className="text-[10px] sm:text-xs font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                    Click to Open
                  </div>
                  <div>
                    <div className="text-sm sm:text-xl font-mono font-black tracking-tight">#{c}</div>
                    <div className="text-[11px] sm:text-xs font-medium opacity-85 truncate max-w-full">
                      {getColorName(c)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Sub-bar below hero preview */}
            <div className="flex flex-col sm:flex-row items-center justify-between px-3 py-2 text-xs text-slate-500 gap-3">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">Live Preview:</span>
                <span>Click any stripe or randomize to explore endless combinations</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={randomizeHeroPalette}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl transition-colors"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span>Randomize</span>
                </button>
                <button
                  onClick={() => onOpenInGenerator(heroColors)}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors shadow-xs"
                >
                  <span>Open in Generator</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Every tool you need to work with color
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            From lightning-fast generation to accessibility compliance and real-world UI testing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Generator */}
          <div
            onClick={() => onNavigate('generator')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                Spacebar Generator
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate thousands of harmonious color palettes in milliseconds with the spacebar. Lock favorite colors, adjust shades, and fine-tune hex values.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-blue-600 gap-1 pt-2">
              <span>Launch Generator</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Explore */}
          <div
            onClick={() => onNavigate('explore')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Palette className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors">
                Explore Trending Palettes
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Search hundreds of curated palettes filtered by style: Pastel, Neon, Vintage, Warm, Cool, and Dark. One click to copy or export.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-purple-600 gap-1 pt-2">
              <span>Browse Palettes</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Image Picker */}
          <div
            onClick={() => onNavigate('image-picker')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors">
                Extract from Photos
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Upload any photograph or select a preset to extract beautiful palettes automatically. Drag interactive color loupes to capture subtle tones.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-emerald-600 gap-1 pt-2">
              <span>Extract Colors</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Contrast Checker */}
          <div
            onClick={() => onNavigate('contrast-checker')}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Sliders className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-amber-600 transition-colors">
                WCAG Contrast Checker
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Ensure your color pairs meet WCAG AA & AAA accessibility guidelines. Includes auto-correction to instantly fix unreadable text pairs.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-amber-600 gap-1 pt-2">
              <span>Check Contrast</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 5: Visualizer */}
          <div
            onClick={() => onOpenInGenerator(['264653', '2A9D8F', 'E9C46A', 'F4A261', 'E76F51'])}
            className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-lg transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-pink-50 text-pink-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Eye className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-pink-600 transition-colors">
                Real-World Visualizer
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                See your colors applied live onto realistic web dashboards, mobile app cards, brand posters, and CSS gradient meshes.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-pink-600 gap-1 pt-2">
              <span>Preview in Visualizer</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 6: Developer & Company Spotlight */}
          <div
            onClick={onOpenAboutModal}
            className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-md hover:shadow-xl transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white/10 text-indigo-300 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors">
                About Developer & Company
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Crafted by <span className="text-white font-semibold">Prince AR Abdur Rahman</span> for <span className="text-white font-semibold">NexVora Lab's Ofc</span>. Explore our mission, vision, and Android app ecosystem.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-indigo-300 gap-1 pt-2">
              <span>View Profile & Contact</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </section>

      {/* Trending Palettes Showcase Section */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Trending Right Now</h2>
            <p className="text-xs text-slate-500">Popular color combinations handpicked by designers</p>
          </div>
          <button
            onClick={() => onNavigate('explore')}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <span>View All ({CURATED_PALETTES.length})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {CURATED_PALETTES.slice(0, 6).map((palette) => (
            <div
              key={palette.id}
              onClick={() => onOpenInGenerator(palette.colors)}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="h-28 flex">
                {palette.colors.map((c, i) => (
                  <div key={i} className="flex-1 h-full" style={{ backgroundColor: `#${c}` }} />
                ))}
              </div>
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                    {palette.name}
                  </h4>
                  <span className="text-[11px] text-slate-400 capitalize">{palette.category}</span>
                </div>
                <div className="flex items-center gap-1 text-xs text-slate-500 font-mono">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  <span>{palette.likes}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Developer & Company Full Banner */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-indigo-300">
                <Smartphone className="w-3.5 h-3.5" />
                <span>NexVora Lab's Ofc Innovation Hub</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                Designed & Engineered by <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">
                  Prince AR Abdur Rahman
                </span>
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                Independent App Developer passionate about building modern Android applications, productivity tools, AI-powered experiences, media players, educational apps, and next-generation digital products.
              </p>
              <div className="pt-2 text-xs text-slate-400 italic">
                Mission: "Build fast, beautiful, privacy-friendly, and user-focused applications accessible to everyone."
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-slate-800">
                <a
                  href="https://wa.me/8801707424006"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-xl bg-white/90 hover:bg-white transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <div className="text-left">
                      <div className="text-[10px] text-slate-500">WhatsApp</div>
                      <div className="text-xs font-bold font-mono">01707424006</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href="https://wa.me/8801796951709"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-xl bg-white/90 hover:bg-white transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <MessageCircle className="w-4 h-4 text-emerald-600" />
                    <div className="text-left">
                      <div className="text-[10px] text-slate-500">WhatsApp</div>
                      <div className="text-xs font-bold font-mono">01796951709</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href="https://www.facebook.com/share/1BNn32qoJo/"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-xl bg-white/90 hover:bg-white transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">f</span>
                    <div className="text-left">
                      <div className="text-[10px] text-slate-500">Facebook</div>
                      <div className="text-xs font-bold">Prince AR Abdur Rahman</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>

                <a
                  href="https://www.instagram.com/ur___abdur____rahman__2008"
                  target="_blank"
                  rel="noreferrer"
                  className="p-3.5 rounded-xl bg-white/90 hover:bg-white transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-4 h-4 rounded bg-pink-600 text-white flex items-center justify-center font-bold text-[10px]">IG</span>
                    <div className="text-left">
                      <div className="text-[10px] text-slate-500">Instagram</div>
                      <div className="text-xs font-bold truncate max-w-[100px]">@ur___abdur...</div>
                    </div>
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={onOpenAboutModal}
                  className="px-5 py-2.5 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors shadow-sm"
                >
                  View Full Technical & Company Info
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 pt-12 text-slate-600">
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-xs">
                N
              </div>
              <span className="text-base font-bold text-slate-900">NexVora Colors</span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
              The super fast color palettes generator. Created with passion for designers and developers worldwide.
            </p>
            <div className="text-xs text-slate-400 font-mono">Version 1.0.0</div>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900">Tools</div>
            <ul className="text-xs space-y-1.5 text-slate-500">
              <li><button onClick={() => onNavigate('generator')} className="hover:text-blue-600">Palette Generator</button></li>
              <li><button onClick={() => onNavigate('explore')} className="hover:text-blue-600">Explore Palettes</button></li>
              <li><button onClick={() => onNavigate('image-picker')} className="hover:text-blue-600">Image Color Extractor</button></li>
              <li><button onClick={() => onNavigate('contrast-checker')} className="hover:text-blue-600">WCAG Contrast Checker</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900">Company & Vision</div>
            <ul className="text-xs space-y-1.5 text-slate-500">
              <li><span className="text-slate-800 font-medium">NexVora Lab's Ofc</span></li>
              <li><span>Innovative Android Apps</span></li>
              <li><span>Privacy-Friendly Design</span></li>
              <li><button onClick={onOpenAboutModal} className="text-blue-600 hover:underline">About Company</button></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-900">Credits & Developer</div>
            <div className="text-xs text-slate-500 space-y-1">
              <p>Developed by <span className="text-slate-900 font-semibold">Prince AR Abdur Rahman</span></p>
              <p>Published by <span className="text-slate-900 font-semibold">NexVora Lab's Ofc</span></p>
              <p className="pt-2">© 2026 NexVora Lab's Ofc. All Rights Reserved.</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
