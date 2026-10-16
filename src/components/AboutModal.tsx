import React from 'react';
import { X, ExternalLink, MessageCircle, Smartphone, Globe, Shield, Sparkles, Heart } from 'lucide-react';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-white/95 backdrop-blur-md border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-pink-500 flex items-center justify-center shadow-md shadow-blue-500/20 text-white font-bold text-lg">
              N
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900 leading-tight">About NexVora Colors</h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                <span>Version 1.0.0</span>
                <span aria-hidden="true">·</span>
                <span>NexVora Lab's Ofc</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 md:p-8 space-y-8 text-slate-700">
          {/* Developer Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold tracking-wider uppercase text-blue-600">Developer Profile</span>
              <span className="text-xs text-slate-400 font-mono">ID: PAR-DEV-2026</span>
            </div>

            <div className="flex flex-col sm:flex-row gap-5 items-start">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-900 flex items-center justify-center text-white text-2xl font-black shadow-lg shrink-0">
                PR
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-slate-900">Prince AR Abdur Rahman</h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Independent App Developer passionate about building modern Android applications, productivity tools, AI-powered experiences, media players, educational apps, and next-generation digital products.
                </p>
              </div>
            </div>

            {/* Contact & Social Links */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <a
                href="https://wa.me/8801707424006"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200/80 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">WhatsApp Primary</div>
                    <div className="text-sm font-semibold text-slate-900 font-mono">01707424006</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </a>

              <a
                href="https://wa.me/8801796951709"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-200 border border-slate-200/80 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-sm">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">WhatsApp Secondary</div>
                    <div className="text-sm font-semibold text-slate-900 font-mono">01796951709</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-colors" />
              </a>

              <a
                href="https://www.facebook.com/share/1BNn32qoJo/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50 hover:border-blue-200 border border-slate-200/80 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-sm font-bold text-lg">
                    f
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Facebook Profile</div>
                    <div className="text-sm font-semibold text-slate-900">Prince AR Abdur Rahman</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
              </a>

              <a
                href="https://www.instagram.com/ur___abdur____rahman__2008"
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-pink-50 hover:border-pink-200 border border-slate-200/80 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-sm font-bold text-xs">
                    IG
                  </div>
                  <div>
                    <div className="text-xs text-slate-500 font-medium">Instagram</div>
                    <div className="text-sm font-semibold text-slate-900 truncate max-w-[140px]">@ur___abdur...</div>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-400 group-hover:text-pink-600 transition-colors" />
              </a>
            </div>
          </div>

          {/* Company Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-xs font-bold tracking-wider uppercase text-indigo-600">About Company</span>
              <span className="text-xs text-slate-400 font-mono">PUBLISHER</span>
            </div>

            <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950 text-white space-y-4 shadow-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-white backdrop-blur-sm">
                  <Smartphone className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">NexVora Lab's Ofc</h4>
                  <p className="text-xs text-indigo-200">Innovating Mobile & Digital Frontiers</p>
                </div>
              </div>

              <p className="text-sm text-slate-300 leading-relaxed">
                NexVora Lab's Ofc focuses on creating innovative Android applications designed to improve productivity, entertainment, learning, and digital experiences.
              </p>

              <div className="pt-3 border-t border-white/10 space-y-1">
                <div className="text-xs font-semibold text-indigo-300 tracking-wide uppercase">Mission Statement</div>
                <p className="text-sm text-slate-200 font-medium italic">
                  "Build fast, beautiful, privacy-friendly, and user-focused applications accessible to everyone."
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2 pt-2 text-center">
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-xs text-slate-400">Target</div>
                  <div className="text-xs font-bold text-white mt-0.5">Android & Web</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-xs text-slate-400">Philosophy</div>
                  <div className="text-xs font-bold text-white mt-0.5">Speed & Beauty</div>
                </div>
                <div className="p-2.5 rounded-lg bg-white/5 border border-white/5">
                  <div className="text-xs text-slate-400">Commitment</div>
                  <div className="text-xs font-bold text-white mt-0.5">Privacy First</div>
                </div>
              </div>
            </div>
          </div>

          {/* Technical Info & Credits */}
          <div className="space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <span className="text-xs font-bold tracking-wider uppercase text-slate-500">Technical Information & Credits</span>
              <span className="text-xs font-mono text-slate-400">Release v1.0.0</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-slate-600">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-semibold text-slate-900 block">Credits</span>
                <p>Developed by <span className="font-medium text-slate-900">Prince AR Abdur Rahman</span></p>
                <p>Published by <span className="font-medium text-slate-900">NexVora Lab's Ofc</span></p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
                <span className="font-semibold text-slate-900 block">Architecture & Capabilities</span>
                <p>Client-side WCAG 2.1 Contrast Engine</p>
                <p>High-precision Color Harmonies & Shade Ladders</p>
                <p>Canvas Palette Loupe & Colorblind Matrix</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div className="flex items-center gap-1.5 font-medium">
            <span>© 2026 NexVora Lab's Ofc. All Rights Reserved</span>
          </div>
          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
