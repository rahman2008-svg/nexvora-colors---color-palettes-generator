import React, { useState } from 'react';
import { X, Copy, Check, Download, FileCode, Palette, Share2, Code2 } from 'lucide-react';
import { getColorName, generateSvgPalette, getReadableTextColor } from '../utils/colorUtils';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  colors: string[];
}

type ExportTab = 'css' | 'tailwind' | 'json' | 'hex' | 'svg' | 'png' | 'url';

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, colors }) => {
  const [activeTab, setActiveTab] = useState<ExportTab>('css');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const hexList = colors.map((c) => `#${c}`);

  const getCssCode = () => {
    return `:root {\n${colors
      .map((c, i) => `  --color-${i + 1}: #${c}; /* ${getColorName(c)} */`)
      .join('\n')}\n}`;
  };

  const getTailwindCode = () => {
    return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n${colors
      .map(
        (c, i) =>
          `        'nexvora-${i + 1}': '#${c}', // ${getColorName(c)}`
      )
      .join('\n')}\n      }\n    }\n  }\n};`;
  };

  const getJsonCode = () => {
    const data = {
      generator: 'NexVora Colors',
      version: '1.0.0',
      palette: colors.map((c) => ({
        hex: `#${c}`,
        name: getColorName(c),
      })),
    };
    return JSON.stringify(data, null, 2);
  };

  const getHexText = () => {
    return hexList.join(', ');
  };

  const getShareUrl = () => {
    const url = new URL(window.location.href);
    url.searchParams.set('palette', colors.join('-'));
    return url.toString();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSvg = () => {
    const svgString = generateSvgPalette(colors);
    const blob = new Blob([svgString], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexvora-palette-${colors.join('-').toLowerCase()}.svg`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadPng = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 630;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw stripes
    const colWidth = canvas.width / colors.length;
    colors.forEach((c, i) => {
      ctx.fillStyle = `#${c}`;
      ctx.fillRect(i * colWidth, 0, colWidth, canvas.height);

      // Draw text
      const textColor = getReadableTextColor(c);
      ctx.fillStyle = textColor;
      ctx.textAlign = 'center';

      // Hex code
      ctx.font = 'bold 30px "JetBrains Mono", monospace';
      ctx.fillText(`#${c}`, i * colWidth + colWidth / 2, canvas.height - 75);

      // Color Name
      ctx.font = '500 20px "Outfit", sans-serif';
      ctx.fillText(getColorName(c), i * colWidth + colWidth / 2, canvas.height - 40);
    });

    // Branding banner at top
    ctx.fillStyle = 'rgba(15, 23, 42, 0.4)';
    ctx.fillRect(0, 0, canvas.width, 48);
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'left';
    ctx.font = 'bold 16px "Outfit", sans-serif';
    ctx.fillText('NexVora Colors — Super Fast Palettes', 24, 30);

    const url = canvas.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = url;
    a.download = `nexvora-palette-${colors.join('-').toLowerCase()}.png`;
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Export Palette</h2>
            <p className="text-xs text-slate-500 mt-0.5">Export your colors in multiple developer & design formats</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Palette Ribbon Preview */}
        <div className="h-14 flex w-full border-b border-slate-100">
          {colors.map((c, i) => (
            <div
              key={i}
              className="flex-1 flex flex-col items-center justify-center text-xs font-mono font-medium transition-transform"
              style={{ backgroundColor: `#${c}`, color: getReadableTextColor(c) }}
            >
              <span>#{c}</span>
            </div>
          ))}
        </div>

        {/* Format Selector Tabs */}
        <div className="px-6 pt-4 border-b border-slate-100 flex items-center gap-2 overflow-x-auto pb-3">
          {(
            [
              { id: 'css', label: 'CSS Variables', icon: FileCode },
              { id: 'tailwind', label: 'Tailwind CSS', icon: Code2 },
              { id: 'json', label: 'JSON Data', icon: Code2 },
              { id: 'hex', label: 'HEX Codes', icon: Palette },
              { id: 'svg', label: 'SVG Vector', icon: Download },
              { id: 'png', label: 'PNG Image', icon: Download },
              { id: 'url', label: 'Share Link', icon: Share2 },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setCopied(false);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700 border border-blue-200'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Body */}
        <div className="p-6">
          {activeTab === 'css' && (
            <div className="space-y-4">
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto max-h-56 leading-relaxed">
                <code>{getCssCode()}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(getCssCode())}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy CSS Variables'}</span>
              </button>
            </div>
          )}

          {activeTab === 'tailwind' && (
            <div className="space-y-4">
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto max-h-56 leading-relaxed">
                <code>{getTailwindCode()}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(getTailwindCode())}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Tailwind Config'}</span>
              </button>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-4">
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs font-mono overflow-x-auto max-h-56 leading-relaxed">
                <code>{getJsonCode()}</code>
              </pre>
              <button
                onClick={() => copyToClipboard(getJsonCode())}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy JSON'}</span>
              </button>
            </div>
          )}

          {activeTab === 'hex' && (
            <div className="space-y-4">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono text-slate-800 break-all select-all">
                {getHexText()}
              </div>
              <button
                onClick={() => copyToClipboard(getHexText())}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Hex Array'}</span>
              </button>
            </div>
          )}

          {activeTab === 'svg' && (
            <div className="space-y-4 text-center py-4">
              <p className="text-sm text-slate-600">
                Download a vector SVG format suitable for Figma, Sketch, Illustrator, or web graphics.
              </p>
              <button
                onClick={downloadSvg}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download Vector SVG</span>
              </button>
            </div>
          )}

          {activeTab === 'png' && (
            <div className="space-y-4 text-center py-4">
              <p className="text-sm text-slate-600">
                Download high-resolution 1200x630 PNG card with color swatches, hex codes, and color names.
              </p>
              <button
                onClick={downloadPng}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                <Download className="w-4 h-4" />
                <span>Download High-Res PNG (1200x630)</span>
              </button>
            </div>
          )}

          {activeTab === 'url' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Share this unique URL with your teammates or bookmark it to restore your exact palette:
              </p>
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs font-mono text-slate-700 break-all select-all">
                {getShareUrl()}
              </div>
              <button
                onClick={() => copyToClipboard(getShareUrl())}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
              >
                {copied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
