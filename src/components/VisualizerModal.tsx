import React, { useState } from 'react';
import { X, Layout, Smartphone, CreditCard, Sparkles, ArrowRight, Star } from 'lucide-react';
import { getReadableTextColor } from '../utils/colorUtils';

interface VisualizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors: string[];
}

type ViewContext = 'saas' | 'mobile' | 'card' | 'gradient';

export const VisualizerModal: React.FC<VisualizerModalProps> = ({ isOpen, onClose, colors }) => {
  const [activeContext, setActiveContext] = useState<ViewContext>('saas');

  if (!isOpen) return null;

  const c0 = `#${colors[0] || '264653'}`;
  const c1 = `#${colors[1] || '2A9D8F'}`;
  const c2 = `#${colors[2] || 'E9C46A'}`;
  const c3 = `#${colors[3] || 'F4A261'}`;
  const c4 = `#${colors[4] || 'E76F51'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Palette Visualizer</h2>
            <p className="text-xs text-slate-500">Preview your palette applied to real-world user interfaces</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Switcher */}
        <div className="px-6 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'saas', label: 'Web Application', icon: Layout },
            { id: 'mobile', label: 'Mobile App Card', icon: Smartphone },
            { id: 'card', label: 'Brand & Posters', icon: CreditCard },
            { id: 'gradient', label: 'Gradient Mesh', icon: Sparkles },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeContext === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveContext(item.id as ViewContext)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-200/70'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Preview Area */}
        <div className="p-6 md:p-8 flex items-center justify-center min-h-[460px] bg-slate-100/70">
          {activeContext === 'saas' && (
            <div 
              className="w-full max-w-2xl rounded-2xl overflow-hidden shadow-xl border border-slate-200 transition-all"
              style={{ backgroundColor: c0, color: getReadableTextColor(colors[0]) }}
            >
              {/* Fake Browser Top */}
              <div className="px-4 py-3 bg-black/15 flex items-center justify-between border-b border-black/10">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-red-400/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-amber-400/80 inline-block" />
                  <span className="w-3 h-3 rounded-full bg-emerald-400/80 inline-block" />
                </div>
                <div className="text-xs font-mono opacity-60">nexvora.app/dashboard</div>
                <div className="w-12" />
              </div>

              {/* Fake Web App Header */}
              <div className="p-6 md:p-8 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="text-lg font-black tracking-tight flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full" style={{ backgroundColor: c1 }} />
                    <span>NexVora Suite</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium">
                    <span className="opacity-80">Features</span>
                    <span className="opacity-80">Docs</span>
                    <span 
                      className="px-3 py-1.5 rounded-lg font-bold shadow-sm"
                      style={{ backgroundColor: c2, color: getReadableTextColor(colors[2] || 'E9C46A') }}
                    >
                      Sign In
                    </span>
                  </div>
                </div>

                {/* Hero Box inside Web App */}
                <div 
                  className="p-6 rounded-xl space-y-4 shadow-sm"
                  style={{ backgroundColor: c1, color: getReadableTextColor(colors[1] || '2A9D8F') }}
                >
                  <div className="text-xs font-mono uppercase tracking-wider opacity-80">Version 1.0.0 · Production Ready</div>
                  <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight leading-tight">
                    Build extraordinary digital experiences faster.
                  </h3>
                  <p className="text-sm opacity-90 leading-relaxed max-w-lg">
                    Unleash your design workflow with high-contrast color harmonies, fluid gradients, and precision tools.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-2">
                    <button 
                      className="px-4 py-2 rounded-lg text-xs font-bold shadow-md transition-transform hover:scale-105 flex items-center gap-1.5"
                      style={{ backgroundColor: c3, color: getReadableTextColor(colors[3] || 'F4A261') }}
                    >
                      <span>Explore Ecosystem</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      className="px-4 py-2 rounded-lg text-xs font-bold border border-current opacity-85 hover:opacity-100 transition-opacity"
                    >
                      Documentation
                    </button>
                  </div>
                </div>

                {/* Bottom 3 metrics cards */}
                <div className="grid grid-cols-3 gap-3">
                  <div 
                    className="p-3 rounded-xl space-y-1"
                    style={{ backgroundColor: c2, color: getReadableTextColor(colors[2] || 'E9C46A') }}
                  >
                    <div className="text-xs font-medium opacity-80">Active Projects</div>
                    <div className="text-xl font-bold font-mono">1,420+</div>
                  </div>
                  <div 
                    className="p-3 rounded-xl space-y-1"
                    style={{ backgroundColor: c3, color: getReadableTextColor(colors[3] || 'F4A261') }}
                  >
                    <div className="text-xs font-medium opacity-80">Palettes Created</div>
                    <div className="text-xl font-bold font-mono">2.8M</div>
                  </div>
                  <div 
                    className="p-3 rounded-xl space-y-1"
                    style={{ backgroundColor: c4, color: getReadableTextColor(colors[4] || 'E76F51') }}
                  >
                    <div className="text-xs font-medium opacity-80">Contrast Grade</div>
                    <div className="text-xl font-bold font-mono">AAA 100%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeContext === 'mobile' && (
            <div className="w-full max-w-xs rounded-3xl p-4 shadow-2xl border-4 border-slate-900 bg-slate-900 text-white">
              {/* Mobile Notch */}
              <div className="flex justify-between items-center px-4 py-1 text-[10px] text-slate-400 font-mono">
                <span>9:41</span>
                <div className="w-16 h-3 bg-slate-800 rounded-full" />
                <span>5G 100%</span>
              </div>

              {/* Mobile Content Screen */}
              <div 
                className="mt-3 rounded-2xl p-5 space-y-4"
                style={{ backgroundColor: c0, color: getReadableTextColor(colors[0]) }}
              >
                <div className="flex justify-between items-center">
                  <div className="text-xs font-bold uppercase tracking-wider opacity-75">NexVora Mobile</div>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs" style={{ backgroundColor: c2, color: getReadableTextColor(colors[2]) }}>
                    P
                  </div>
                </div>

                <div 
                  className="p-4 rounded-xl space-y-2 shadow-sm"
                  style={{ backgroundColor: c1, color: getReadableTextColor(colors[1]) }}
                >
                  <div className="text-xs font-medium opacity-80">Daily Focus</div>
                  <div className="text-lg font-bold leading-tight">Android App Sprint</div>
                  <div className="w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full w-3/4" style={{ backgroundColor: c3 }} />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-xs font-bold opacity-80">Quick Actions</div>
                  <div className="grid grid-cols-2 gap-2">
                    <div 
                      className="p-3 rounded-xl text-center space-y-1"
                      style={{ backgroundColor: c2, color: getReadableTextColor(colors[2]) }}
                    >
                      <div className="text-sm font-bold">Inspect</div>
                      <div className="text-[10px] opacity-80">Live WCAG</div>
                    </div>
                    <div 
                      className="p-3 rounded-xl text-center space-y-1"
                      style={{ backgroundColor: c4, color: getReadableTextColor(colors[4]) }}
                    >
                      <div className="text-sm font-bold">Export</div>
                      <div className="text-[10px] opacity-80">Code Ready</div>
                    </div>
                  </div>
                </div>

                <button 
                  className="w-full py-2.5 rounded-xl font-bold text-xs shadow-md"
                  style={{ backgroundColor: c3, color: getReadableTextColor(colors[3]) }}
                >
                  Generate New Variations
                </button>
              </div>
            </div>
          )}

          {activeContext === 'card' && (
            <div className="w-full max-w-md grid grid-cols-1 gap-4">
              {/* Brand Card */}
              <div 
                className="p-6 rounded-2xl shadow-xl flex flex-col justify-between h-56 relative overflow-hidden"
                style={{ backgroundColor: c0, color: getReadableTextColor(colors[0]) }}
              >
                <div className="flex justify-between items-start z-10">
                  <div>
                    <div className="text-xs font-mono uppercase tracking-widest opacity-70">Design System Spec</div>
                    <div className="text-2xl font-black mt-1">NexVora Colors</div>
                  </div>
                  <div className="flex gap-1.5">
                    {colors.map((c, i) => (
                      <span key={i} className="w-3.5 h-3.5 rounded-full shadow-sm" style={{ backgroundColor: `#${c}` }} />
                    ))}
                  </div>
                </div>

                <div className="z-10 space-y-1">
                  <div className="text-sm font-bold font-mono">Prince AR Abdur Rahman</div>
                  <div className="text-xs opacity-80">NexVora Lab's Ofc · Version 1.0.0</div>
                </div>

                {/* Decorative background shape */}
                <div 
                  className="absolute -right-12 -bottom-12 w-48 h-48 rounded-full opacity-30 blur-xl"
                  style={{ backgroundColor: c2 }}
                />
              </div>

              {/* Poster card */}
              <div 
                className="p-5 rounded-2xl shadow-md flex items-center justify-between"
                style={{ backgroundColor: c1, color: getReadableTextColor(colors[1]) }}
              >
                <div className="space-y-1">
                  <div className="text-xs font-semibold opacity-85">COLOR HARMONY ACCENT</div>
                  <div className="text-lg font-black tracking-tight">Elegance meets Engineering</div>
                </div>
                <div 
                  className="px-4 py-2 rounded-xl text-xs font-black shadow-sm"
                  style={{ backgroundColor: c2, color: getReadableTextColor(colors[2]) }}
                >
                  ACTIVE
                </div>
              </div>
            </div>
          )}

          {activeContext === 'gradient' && (
            <div className="w-full max-w-2xl h-80 rounded-2xl shadow-2xl relative overflow-hidden flex flex-col items-center justify-center p-8 text-white text-center">
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(135deg, ${c0} 0%, ${c1} 25%, ${c2} 50%, ${c3} 75%, ${c4} 100%)`,
                }}
              />
              <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" />

              <div className="relative z-10 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Fluid 5-Stop Gradient</span>
                </div>
                <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight drop-shadow-md">
                  Seamless Harmony
                </h3>
                <p className="text-sm text-white/90 max-w-md drop-shadow">
                  Exportable as a CSS linear gradient for landing hero backdrops, mobile headers, and cards.
                </p>
                <div className="pt-2 font-mono text-xs bg-black/40 px-4 py-2 rounded-lg text-white/90 max-w-lg truncate select-all">
                  background: linear-gradient(135deg, {c0}, {c1}, {c2}, {c3}, {c4});
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
