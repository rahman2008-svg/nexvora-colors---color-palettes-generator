import React, { useState, useRef, useEffect } from 'react';
import { Upload, RefreshCw, ArrowRight, Copy, Check, Sparkles, Image as ImageIcon } from 'lucide-react';
import { rgbToHex, getColorName, getReadableTextColor, cleanHex } from '../utils/colorUtils';

interface ImagePickerViewProps {
  onOpenInGenerator: (colors: string[]) => void;
}

interface Pin {
  x: number; // percentage 0-100
  y: number; // percentage 0-100
  hex: string;
}

const PRESET_IMAGES = [
  {
    name: 'Sunset Coast',
    url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80',
    fallbackGrad: 'linear-gradient(135deg, #FF5E7E, #FFA600, #FFC75F)',
  },
  {
    name: 'Nordic Architecture',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    fallbackGrad: 'linear-gradient(135deg, #1E293B, #475569, #94A3B8)',
  },
  {
    name: 'Emerald Rainforest',
    url: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=1000&q=80',
    fallbackGrad: 'linear-gradient(135deg, #064E3B, #059669, #34D399)',
  },
  {
    name: 'Neon Cyber City',
    url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=1000&q=80',
    fallbackGrad: 'linear-gradient(135deg, #4C1D95, #7C3AED, #EC4899)',
  },
];

export const ImagePickerView: React.FC<ImagePickerViewProps> = ({ onOpenInGenerator }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [customImageSrc, setCustomImageSrc] = useState<string | null>(null);
  const [pins, setPins] = useState<Pin[]>([
    { x: 20, y: 30, hex: '264653' },
    { x: 35, y: 50, hex: '2A9D8F' },
    { x: 50, y: 40, hex: 'E9C46A' },
    { x: 65, y: 60, hex: 'F4A261' },
    { x: 80, y: 35, hex: 'E76F51' },
  ]);
  const [activePinIndex, setActivePinIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const activeSrc = customImageSrc || PRESET_IMAGES[currentImageIndex].url;

  // Sample color from canvas at percentage (x%, y%)
  const sampleColorAt = (percentX: number, percentY: number): string => {
    const canvas = canvasRef.current;
    if (!canvas) return '000000';
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) return '000000';

    const px = Math.floor((percentX / 100) * canvas.width);
    const py = Math.floor((percentY / 100) * canvas.height);

    try {
      const pixel = ctx.getImageData(
        Math.max(0, Math.min(canvas.width - 1, px)),
        Math.max(0, Math.min(canvas.height - 1, py)),
        1,
        1
      ).data;
      return rgbToHex(pixel[0], pixel[1], pixel[2]);
    } catch {
      return '264653';
    }
  };

  // Draw image to canvas and resample all pins
  useEffect(() => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = activeSrc;
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = img.naturalWidth || 800;
      canvas.height = img.naturalHeight || 500;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Resample pins
      setPins((prevPins) =>
        prevPins.map((pin) => ({
          ...pin,
          hex: sampleColorAt(pin.x, pin.y),
        }))
      );
    };
    img.onerror = () => {
      // Fallback: draw synthetic gradient if external image fails
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = 800;
      canvas.height = 500;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      const grad = ctx.createLinearGradient(0, 0, 800, 500);
      grad.addColorStop(0, '#FF5E7E');
      grad.addColorStop(0.3, '#FFA600');
      grad.addColorStop(0.6, '#00D26A');
      grad.addColorStop(1, '#0066FF');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 800, 500);

      setPins((prevPins) =>
        prevPins.map((pin) => ({
          ...pin,
          hex: sampleColorAt(pin.x, pin.y),
        }))
      );
    };
  }, [activeSrc]);

  // Handle pointer down / drag
  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activePinIndex === null || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));

    const hex = sampleColorAt(x, y);

    setPins((prev) =>
      prev.map((pin, i) => (i === activePinIndex ? { x, y, hex } : pin))
    );
  };

  const handlePointerUp = () => {
    setActivePinIndex(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCustomImageSrc(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Auto-distribute pins across key image sectors
  const autoDetectPalette = () => {
    const defaultCoords = [
      { x: 18, y: 25 },
      { x: 38, y: 65 },
      { x: 50, y: 35 },
      { x: 68, y: 70 },
      { x: 82, y: 40 },
    ];
    setPins(
      defaultCoords.map((pos) => ({
        x: pos.x,
        y: pos.y,
        hex: sampleColorAt(pos.x, pos.y),
      }))
    );
  };

  const currentColors = pins.map((p) => p.hex);

  const copyHexList = () => {
    navigator.clipboard.writeText(currentColors.map((c) => `#${c}`).join(', '));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Title & Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Extract Palette from Image</h1>
          <p className="text-sm text-slate-600 mt-1">
            Pick colors directly from photos. Drag the sampling loupes on the image to pick exact nuances.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <label className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-colors shadow-xs">
            <Upload className="w-4 h-4 text-slate-500" />
            <span>Upload Image</span>
            <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          </label>

          <button
            onClick={autoDetectPalette}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition-colors"
          >
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Auto Detect</span>
          </button>

          <button
            onClick={() => onOpenInGenerator(currentColors)}
            className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20"
          >
            <span>Open in Generator</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Preset selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-slate-500 shrink-0">Sample Images:</span>
        {PRESET_IMAGES.map((preset, idx) => (
          <button
            key={idx}
            onClick={() => {
              setCustomImageSrc(null);
              setCurrentImageIndex(idx);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              !customImageSrc && currentImageIndex === idx
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            {preset.name}
          </button>
        ))}
      </div>

      {/* Interactive Canvas & Loupe Container */}
      <div
        ref={containerRef}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        className="relative w-full aspect-16/10 max-h-[520px] rounded-2xl overflow-hidden shadow-xl bg-slate-900 select-none touch-none border border-slate-200 cursor-crosshair"
      >
        {/* Hidden high-res canvas used for pixel sampling */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Visible Image */}
        <img
          src={activeSrc}
          alt="Color source"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover"
        />

        {/* Draggable Pins */}
        {pins.map((pin, i) => (
          <div
            key={i}
            onPointerDown={(e) => {
              e.stopPropagation();
              setActivePinIndex(i);
            }}
            style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
            className={`absolute -translate-x-1/2 -translate-y-1/2 cursor-grab active:cursor-grabbing transition-transform ${
              activePinIndex === i ? 'scale-125 z-30' : 'hover:scale-110 z-20'
            }`}
          >
            {/* Outer Ring */}
            <div
              className="w-9 h-9 rounded-full border-3 border-white shadow-xl flex items-center justify-center transition-shadow ring-2 ring-black/20"
              style={{ backgroundColor: `#${pin.hex}` }}
            >
              <span className="text-[10px] font-bold" style={{ color: getReadableTextColor(pin.hex) }}>
                {i + 1}
              </span>
            </div>
            {/* Pointer needle */}
            <div className="w-1.5 h-1.5 bg-white rounded-full mx-auto -mt-0.5 shadow-xs" />
          </div>
        ))}
      </div>

      {/* Live Extracted Palette Bar */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Extracted Palette</span>
            <span className="text-xs text-slate-400 font-mono">({pins.length} Colors)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyHexList}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy Hexes'}</span>
            </button>
            <button
              onClick={() => onOpenInGenerator(currentColors)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-xs"
            >
              <span>Edit in Generator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-5 h-28 sm:h-36">
          {pins.map((pin, i) => (
            <div
              key={i}
              className="flex flex-col items-center justify-center p-3 text-center transition-all group"
              style={{ backgroundColor: `#${pin.hex}`, color: getReadableTextColor(pin.hex) }}
            >
              <span className="text-sm sm:text-base font-bold font-mono tracking-tight group-hover:scale-105 transition-transform">
                #{pin.hex}
              </span>
              <span className="text-[11px] sm:text-xs opacity-80 font-medium truncate max-w-full px-1">
                {getColorName(pin.hex)}
              </span>
              <span className="text-[10px] opacity-60 mt-1">Pin {i + 1}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
