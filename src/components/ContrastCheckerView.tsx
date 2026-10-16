import React, { useState } from 'react';
import { ArrowLeftRight, Check, X, Sparkles, AlertCircle, Copy } from 'lucide-react';
import {
  getContrastRatio,
  cleanHex,
  isValidHex,
  rgbToHsl,
  hslToHex,
  hexToRgb,
  getColorName,
} from '../utils/colorUtils';

interface ContrastCheckerViewProps {
  initialTextColor?: string;
  initialBgColor?: string;
}

export const ContrastCheckerView: React.FC<ContrastCheckerViewProps> = ({
  initialTextColor = '1E293B',
  initialBgColor = 'FFFFFF',
}) => {
  const [textColor, setTextColor] = useState(cleanHex(initialTextColor));
  const [bgColor, setBgColor] = useState(cleanHex(initialBgColor));
  const [copied, setCopied] = useState(false);

  const ratio = getContrastRatio(textColor, bgColor);

  // WCAG 2.1 Criteria checks
  const aaSmall = ratio >= 4.5;
  const aaLarge = ratio >= 3.0;
  const aaaSmall = ratio >= 7.0;
  const aaaLarge = ratio >= 4.5;
  const graphical = ratio >= 3.0;

  const getScoreRating = (r: number) => {
    if (r >= 7.0) return { label: 'Superb (AAA)', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' };
    if (r >= 4.5) return { label: 'Good (AA)', color: 'text-blue-700 bg-blue-50 border-blue-200' };
    if (r >= 3.0) return { label: 'Poor (Large only)', color: 'text-amber-700 bg-amber-50 border-amber-200' };
    return { label: 'Fail (Very Poor)', color: 'text-rose-700 bg-rose-50 border-rose-200' };
  };

  const rating = getScoreRating(ratio);

  const swapColors = () => {
    const temp = textColor;
    setTextColor(bgColor);
    setBgColor(temp);
  };

  // Auto-optimize: adjust text lightness to satisfy 7.0 ratio
  const autoOptimize = () => {
    const bgRgb = hexToRgb(bgColor);
    const bgHsl = rgbToHsl(bgRgb.r, bgRgb.g, bgRgb.b);

    const textRgb = hexToRgb(textColor);
    const textHsl = rgbToHsl(textRgb.r, textRgb.g, textRgb.b);

    // If background is light, make text darker. If background is dark, make text lighter.
    const targetL = bgHsl.l > 50 ? 10 : 95;
    const optimizedHex = hslToHex(textHsl.h, textHsl.s, targetL);
    setTextColor(optimizedHex);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Contrast Checker</h1>
          <p className="text-sm text-slate-600 mt-1">
            Calculate the contrast ratio of text and background colors according to Web Content Accessibility Guidelines (WCAG 2.1).
          </p>
        </div>

        <button
          onClick={autoOptimize}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
        >
          <Sparkles className="w-4 h-4" />
          <span>Auto-Optimize for AAA</span>
        </button>
      </div>

      {/* Main Dual Color Controller */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Text Color Box */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Text / Foreground</span>
            <span className="text-xs font-mono text-slate-400">{getColorName(textColor)}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="color"
                value={`#${textColor}`}
                onChange={(e) => setTextColor(cleanHex(e.target.value))}
                className="w-14 h-14 rounded-xl cursor-pointer border border-slate-200 p-0.5 bg-white shadow-xs"
              />
            </div>
            <div className="flex-1">
              <div className="text-xs text-slate-400 font-medium mb-1">HEX CODE</div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">#</span>
                <input
                  type="text"
                  maxLength={6}
                  value={textColor}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    if (/^[0-9A-F]*$/.test(val)) setTextColor(val);
                  }}
                  className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Background Color Box */}
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4 relative">
          {/* Swap button between cards */}
          <button
            onClick={swapColors}
            title="Swap Colors"
            className="absolute -top-3.5 right-6 md:-left-4 md:right-auto md:top-1/2 md:-translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white border border-slate-300 shadow-md flex items-center justify-center text-slate-600 hover:text-blue-600 hover:scale-105 transition-all"
          >
            <ArrowLeftRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Background Color</span>
            <span className="text-xs font-mono text-slate-400">{getColorName(bgColor)}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <input
                type="color"
                value={`#${bgColor}`}
                onChange={(e) => setBgColor(cleanHex(e.target.value))}
                className="w-14 h-14 rounded-xl cursor-pointer border border-slate-200 p-0.5 bg-white shadow-xs"
              />
            </div>
            <div className="flex-1">
              <div className="text-xs text-slate-400 font-medium mb-1">HEX CODE</div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-mono text-sm">#</span>
                <input
                  type="text"
                  maxLength={6}
                  value={bgColor}
                  onChange={(e) => {
                    const val = e.target.value.toUpperCase();
                    if (/^[0-9A-F]*$/.test(val)) setBgColor(val);
                  }}
                  className="w-full pl-7 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg font-mono text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Big Ratio Display & Rating Banner */}
      <div className="p-6 md:p-8 bg-white rounded-2xl border border-slate-200 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="text-center md:text-left">
          <div className="text-xs font-bold tracking-wider uppercase text-slate-400">Contrast Ratio</div>
          <div className="text-5xl md:text-6xl font-black font-mono tracking-tight text-slate-900 mt-1">
            {ratio} <span className="text-3xl text-slate-400 font-light">: 1</span>
          </div>
        </div>

        <div className="flex flex-col items-center md:items-end gap-2">
          <div className={`px-4 py-2 rounded-xl text-sm font-bold border ${rating.color}`}>
            {rating.label}
          </div>
          <p className="text-xs text-slate-500 text-center md:text-right max-w-xs">
            WCAG 2.1 recommends at least 4.5:1 for body copy and 3.0:1 for bold or large text (18pt+).
          </p>
        </div>
      </div>

      {/* WCAG Compliance Matrix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Normal Text */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Normal Body Text</div>
          <div className="text-2xl font-bold text-slate-900">16px Regular</div>
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">WCAG AA (4.5:1)</span>
              {aaSmall ? (
                <span className="flex items-center gap-1 font-bold text-emerald-700">
                  <Check className="w-4 h-4 stroke-[3]" /> Pass
                </span>
              ) : (
                <span className="flex items-center gap-1 font-bold text-rose-600">
                  <X className="w-4 h-4 stroke-[3]" /> Fail
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">WCAG AAA (7.0:1)</span>
              {aaaSmall ? (
                <span className="flex items-center gap-1 font-bold text-emerald-700">
                  <Check className="w-4 h-4 stroke-[3]" /> Pass
                </span>
              ) : (
                <span className="flex items-center gap-1 font-bold text-rose-600">
                  <X className="w-4 h-4 stroke-[3]" /> Fail
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Large Text */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Large Headlines</div>
          <div className="text-2xl font-bold text-slate-900">18pt+ / 24px Bold</div>
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">WCAG AA (3.0:1)</span>
              {aaLarge ? (
                <span className="flex items-center gap-1 font-bold text-emerald-700">
                  <Check className="w-4 h-4 stroke-[3]" /> Pass
                </span>
              ) : (
                <span className="flex items-center gap-1 font-bold text-rose-600">
                  <X className="w-4 h-4 stroke-[3]" /> Fail
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">WCAG AAA (4.5:1)</span>
              {aaaLarge ? (
                <span className="flex items-center gap-1 font-bold text-emerald-700">
                  <Check className="w-4 h-4 stroke-[3]" /> Pass
                </span>
              ) : (
                <span className="flex items-center gap-1 font-bold text-rose-600">
                  <X className="w-4 h-4 stroke-[3]" /> Fail
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Graphical Objects */}
        <div className="p-5 bg-white rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500">UI & Icons</div>
          <div className="text-2xl font-bold text-slate-900">Borders & Buttons</div>
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600">WCAG AA (3.0:1)</span>
              {graphical ? (
                <span className="flex items-center gap-1 font-bold text-emerald-700">
                  <Check className="w-4 h-4 stroke-[3]" /> Pass
                </span>
              ) : (
                <span className="flex items-center gap-1 font-bold text-rose-600">
                  <X className="w-4 h-4 stroke-[3]" /> Fail
                </span>
              )}
            </div>
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>Standard</span>
              <span className="font-mono">Essential UI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Live Interactive UI Simulation */}
      <div className="space-y-3">
        <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Live Typography & UI Preview</div>
        <div
          className="p-8 md:p-12 rounded-2xl shadow-lg border border-slate-200 space-y-6 transition-colors"
          style={{ backgroundColor: `#${bgColor}`, color: `#${textColor}` }}
        >
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest opacity-80">
              Interactive Preview · Ratio {ratio}:1
            </div>
            <h2 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              Design accessible interfaces with confidence.
            </h2>
            <p className="text-base md:text-lg opacity-90 leading-relaxed max-w-2xl">
              Good contrast guarantees readability in direct sunlight, on dimmed mobile screens, and for billions of users with visual impairments or color perception differences.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              className="px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-transform hover:scale-105"
              style={{ backgroundColor: `#${textColor}`, color: `#${bgColor}` }}
            >
              Primary Action
            </button>
            <button
              className="px-6 py-3 rounded-xl font-bold text-sm border-2 transition-opacity hover:opacity-80"
              style={{ borderColor: `#${textColor}` }}
            >
              Secondary Outline
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
