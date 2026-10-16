import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Lock,
  Unlock,
  Copy,
  Check,
  X,
  ChevronLeft,
  ChevronRight,
  Plus,
  Sliders,
  RotateCcw,
  RotateCw,
  Eye,
  Share2,
  Sparkles,
  Heart,
  Pipette,
  CheckCircle2,
} from 'lucide-react';
import { ColorItem, HarmonyMode, ColorBlindnessType } from '../types';
import {
  cleanHex,
  isValidHex,
  getColorName,
  getReadableTextColor,
  generatePaletteByHarmony,
  simulateColorBlindness,
} from '../utils/colorUtils';
import { ShadesPopover } from './ShadesPopover';

interface GeneratorViewProps {
  initialColors?: string[];
  onOpenExport: (colors: string[]) => void;
  onOpenVisualizer: (colors: string[]) => void;
  onOpenContrast: (colors: string[]) => void;
}

export const GeneratorView: React.FC<GeneratorViewProps> = ({
  initialColors,
  onOpenExport,
  onOpenVisualizer,
  onOpenContrast,
}) => {
  // Initial 5 colors
  const [colors, setColors] = useState<ColorItem[]>(() => {
    const base = initialColors && initialColors.length >= 2
      ? initialColors
      : ['264653', '2A9D8F', 'E9C46A', 'F4A261', 'E76F51'];
    return base.map((hex, index) => ({
      id: `col-${index}-${Date.now()}`,
      hex: cleanHex(hex),
      name: getColorName(hex),
      locked: false,
    }));
  });

  const [harmony, setHarmony] = useState<HarmonyMode>('auto');
  const [colorBlindness, setColorBlindness] = useState<ColorBlindnessType>('normal');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [savedFavorite, setSavedFavorite] = useState(false);

  // Shades Popover State
  const [activeShadeIndex, setActiveShadeIndex] = useState<number | null>(null);

  // Undo / Redo history
  const [history, setHistory] = useState<ColorItem[][]>([]);
  const [redoStack, setRedoStack] = useState<ColorItem[][]>([]);

  // Push state to undo stack
  const pushHistory = useCallback((current: ColorItem[]) => {
    setHistory((prev) => [...prev.slice(-20), current]);
    setRedoStack([]);
  }, []);

  // Generate new palette
  const generateNewColors = useCallback(() => {
    pushHistory(colors);

    const generatedHexes = generatePaletteByHarmony(
      colors.length,
      harmony,
      colors.map((c) => ({ hex: c.hex, locked: c.locked }))
    );

    setColors((prev) =>
      prev.map((item, idx) => {
        if (item.locked) return item;
        const newHex = cleanHex(generatedHexes[idx]);
        return {
          ...item,
          hex: newHex,
          name: getColorName(newHex),
        };
      })
    );
  }, [colors, harmony, pushHistory]);

  // Keyboard shortcut listener (Spacebar for generate, Ctrl+Z for undo, Ctrl+Y for redo)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        generateNewColors();
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        if (e.shiftKey) {
          handleRedo();
        } else {
          handleUndo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') {
        handleRedo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [generateNewColors]);

  const handleUndo = () => {
    if (history.length === 0) return;
    const last = history[history.length - 1];
    setRedoStack((prev) => [colors, ...prev]);
    setColors(last);
    setHistory((prev) => prev.slice(0, prev.length - 1));
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setHistory((prev) => [...prev, colors]);
    setColors(next);
    setRedoStack((prev) => prev.slice(1));
  };

  // Toggle lock state
  const toggleLock = (index: number) => {
    setColors((prev) =>
      prev.map((c, i) => (i === index ? { ...c, locked: !c.locked } : c))
    );
  };

  // Copy hex
  const copyHex = (hex: string, id: string) => {
    navigator.clipboard.writeText(`#${hex}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  // Move column left
  const moveLeft = (index: number) => {
    if (index === 0) return;
    pushHistory(colors);
    setColors((prev) => {
      const next = [...prev];
      const temp = next[index - 1];
      next[index - 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  // Move column right
  const moveRight = (index: number) => {
    if (index === colors.length - 1) return;
    pushHistory(colors);
    setColors((prev) => {
      const next = [...prev];
      const temp = next[index + 1];
      next[index + 1] = next[index];
      next[index] = temp;
      return next;
    });
  };

  // Remove column
  const removeColor = (index: number) => {
    if (colors.length <= 2) return;
    pushHistory(colors);
    setColors((prev) => prev.filter((_, i) => i !== index));
  };

  // Add intermediate column between index and index+1
  const addColorAt = (index: number) => {
    if (colors.length >= 10) return;
    pushHistory(colors);
    const newHex = generatePaletteByHarmony(1, harmony, [])[0] || '888888';
    const newItem: ColorItem = {
      id: `col-${Date.now()}`,
      hex: cleanHex(newHex),
      name: getColorName(newHex),
      locked: false,
    };

    setColors((prev) => {
      const copy = [...prev];
      copy.splice(index + 1, 0, newItem);
      return copy;
    });
  };

  // Change specific color hex
  const updateColorHex = (index: number, newHex: string) => {
    const clean = cleanHex(newHex);
    if (!isValidHex(clean)) return;
    setColors((prev) =>
      prev.map((c, i) =>
        i === index ? { ...c, hex: clean, name: getColorName(clean) } : c
      )
    );
  };

  const currentHexArray = colors.map((c) => c.hex);

  // Save to browser favorites
  const saveToFavorites = () => {
    const existing = JSON.parse(localStorage.getItem('nexvora_favorites') || '[]');
    const newEntry = {
      id: `fav-${Date.now()}`,
      colors: currentHexArray,
      date: new Date().toLocaleDateString(),
    };
    localStorage.setItem('nexvora_favorites', JSON.stringify([newEntry, ...existing]));
    setSavedFavorite(true);
    setTimeout(() => setSavedFavorite(false), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-65px)] min-h-[620px] bg-slate-900 overflow-hidden select-none">
      {/* Generator Sub-Toolbar */}
      <div className="h-13 bg-white border-b border-slate-200 px-4 md:px-6 flex items-center justify-between gap-4 shrink-0 shadow-xs z-20">
        {/* Left Side: Hints & Generate */}
        <div className="flex items-center gap-3">
          <button
            onClick={generateNewColors}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-sm shadow-blue-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Generate</span>
            <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 bg-blue-800/60 rounded text-[10px] font-mono font-normal">
              Space
            </kbd>
          </button>

          <span className="hidden lg:inline-block text-xs text-slate-500 font-medium">
            Press <kbd className="px-1.5 py-0.5 bg-slate-100 border border-slate-200 rounded text-slate-700 font-mono text-[11px]">Spacebar</kbd> to randomize unlocked colors
          </span>
        </div>

        {/* Center: Harmony & Colorblind Simulator */}
        <div className="flex items-center gap-2">
          {/* Harmony Mode */}
          <div className="flex items-center gap-1.5">
            <span className="hidden sm:inline text-xs font-semibold text-slate-500">Method:</span>
            <select
              value={harmony}
              onChange={(e) => setHarmony(e.target.value as HarmonyMode)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="auto">Auto Balanced</option>
              <option value="analogous">Analogous</option>
              <option value="monochromatic">Monochromatic</option>
              <option value="triad">Triadic</option>
              <option value="complementary">Complementary</option>
              <option value="split">Split Comp</option>
              <option value="pastel">Pastel</option>
              <option value="warm">Warm Palette</option>
              <option value="cool">Cool Palette</option>
              <option value="neon">Neon Vibrant</option>
              <option value="vintage">Vintage Retro</option>
              <option value="deep">Deep Obsidian</option>
            </select>
          </div>

          {/* Colorblindness Simulator */}
          <div className="hidden md:flex items-center gap-1.5">
            <span className="text-xs font-semibold text-slate-500">Vision:</span>
            <select
              value={colorBlindness}
              onChange={(e) => setColorBlindness(e.target.value as ColorBlindnessType)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
            >
              <option value="normal">Normal Vision</option>
              <option value="protanopia">Protanopia (No Red)</option>
              <option value="deuteranopia">Deuteranopia (No Green)</option>
              <option value="tritanopia">Tritanopia (No Blue)</option>
              <option value="achromatopsia">Achromatopsia (Monochrome)</option>
            </select>
          </div>
        </div>

        {/* Right Side: Undo/Redo, Visualizer, Contrast, Export, Save */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handleUndo}
            disabled={history.length === 0}
            title="Undo (Ctrl+Z)"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={handleRedo}
            disabled={redoStack.length === 0}
            title="Redo (Ctrl+Y)"
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none rounded-lg transition-colors"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

          {/* Contrast Mode */}
          <button
            onClick={() => onOpenContrast(currentHexArray)}
            title="Check Contrast"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Contrast</span>
          </button>

          {/* Visualizer Mode */}
          <button
            onClick={() => onOpenVisualizer(currentHexArray)}
            title="Preview in Real UI Mockups"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span className="hidden md:inline">Visualizer</span>
          </button>

          {/* Save to Favorites */}
          <button
            onClick={saveToFavorites}
            title="Save to favorites"
            className={`p-2 rounded-lg transition-colors ${
              savedFavorite ? 'text-rose-600 bg-rose-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Heart className={`w-4 h-4 ${savedFavorite ? 'fill-rose-600' : ''}`} />
          </button>

          {/* Export Button */}
          <button
            onClick={() => onOpenExport(currentHexArray)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-colors shadow-xs ml-1"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Export</span>
          </button>
        </div>
      </div>

      {/* Main Full-Height Columns Canvas */}
      <div className="flex-1 flex flex-col md:flex-row w-full h-full relative overflow-y-auto md:overflow-hidden">
        {colors.map((color, index) => {
          const displayHex = simulateColorBlindness(color.hex, colorBlindness);
          const textColor = getReadableTextColor(displayHex);
          const isCopied = copiedId === color.id;

          return (
            <React.Fragment key={color.id}>
              {/* Color Column */}
              <div
                className="flex-1 min-h-[140px] md:min-h-0 flex flex-col justify-between p-4 md:p-6 relative group transition-colors duration-150"
                style={{ backgroundColor: `#${displayHex}`, color: textColor }}
              >
                {/* Top Action Toolbar inside column */}
                <div className="flex md:flex-col items-center justify-between md:justify-start gap-2 md:gap-3 opacity-90 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-150">
                  {/* Remove Column */}
                  {colors.length > 2 && (
                    <button
                      onClick={() => removeColor(index)}
                      title="Remove Color"
                      className="p-2 rounded-xl bg-black/15 hover:bg-black/30 backdrop-blur-xs transition-colors hover:scale-105"
                      style={{ color: textColor }}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {/* Move Left */}
                  {index > 0 && (
                    <button
                      onClick={() => moveLeft(index)}
                      title="Move Left"
                      className="p-2 rounded-xl bg-black/15 hover:bg-black/30 backdrop-blur-xs transition-colors hover:scale-105 hidden md:block"
                      style={{ color: textColor }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                  )}

                  {/* Move Right */}
                  {index < colors.length - 1 && (
                    <button
                      onClick={() => moveRight(index)}
                      title="Move Right"
                      className="p-2 rounded-xl bg-black/15 hover:bg-black/30 backdrop-blur-xs transition-colors hover:scale-105 hidden md:block"
                      style={{ color: textColor }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}

                  {/* Shades ladder */}
                  <button
                    onClick={() => setActiveShadeIndex(index)}
                    title="View Shades and Tints"
                    className="p-2 rounded-xl bg-black/15 hover:bg-black/30 backdrop-blur-xs transition-colors hover:scale-105"
                    style={{ color: textColor }}
                  >
                    <Sliders className="w-4 h-4" />
                  </button>

                  {/* Color Picker Native trigger */}
                  <label
                    title="Select Exact Color"
                    className="p-2 rounded-xl bg-black/15 hover:bg-black/30 backdrop-blur-xs transition-colors hover:scale-105 cursor-pointer relative"
                    style={{ color: textColor }}
                  >
                    <Pipette className="w-4 h-4" />
                    <input
                      type="color"
                      value={`#${color.hex}`}
                      onChange={(e) => updateColorHex(index, e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                  </label>

                  {/* Copy button */}
                  <button
                    onClick={() => copyHex(color.hex, color.id)}
                    title="Copy HEX code"
                    className="p-2 rounded-xl bg-black/15 hover:bg-black/30 backdrop-blur-xs transition-colors hover:scale-105"
                    style={{ color: textColor }}
                  >
                    {isCopied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </button>

                  {/* Lock button */}
                  <button
                    onClick={() => toggleLock(index)}
                    title={color.locked ? 'Unlock Color' : 'Lock Color'}
                    className={`p-2 rounded-xl transition-all hover:scale-105 ${
                      color.locked
                        ? 'bg-black/40 shadow-inner'
                        : 'bg-black/15 hover:bg-black/30 backdrop-blur-xs'
                    }`}
                    style={{ color: textColor }}
                  >
                    {color.locked ? (
                      <Lock className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <Unlock className="w-4 h-4 opacity-75" />
                    )}
                  </button>
                </div>

                {/* Bottom Information (Hex Code & Color Name) */}
                <div className="flex flex-row md:flex-col items-center justify-between md:justify-center text-center gap-1 py-2">
                  <div className="text-left md:text-center">
                    {/* Big HEX label with editable inline input on hover/click */}
                    <div
                      onClick={() => copyHex(color.hex, color.id)}
                      className="group/hex cursor-pointer inline-flex items-center gap-1"
                    >
                      <span className="text-2xl md:text-3xl lg:text-4xl font-extrabold font-mono tracking-tight group-hover/hex:scale-105 transition-transform">
                        {color.hex}
                      </span>
                    </div>

                    {/* Color Name */}
                    <div className="text-xs md:text-sm font-semibold opacity-85 truncate max-w-[140px] md:max-w-[180px] mt-0.5">
                      {color.name}
                    </div>
                  </div>

                  {/* Lock indicator tag */}
                  {color.locked && (
                    <div className="px-2 py-1 rounded-md bg-black/20 text-[10px] font-bold uppercase tracking-wider backdrop-blur-xs flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      <span>Locked</span>
                    </div>
                  )}

                  {/* Copied banner */}
                  {isCopied && (
                    <div className="text-xs font-bold bg-white text-slate-900 px-3 py-1 rounded-full shadow-lg animate-bounce">
                      Copied #{color.hex}!
                    </div>
                  )}
                </div>
              </div>

              {/* In-Between Insert '+' button on desktop */}
              {index < colors.length - 1 && colors.length < 10 && (
                <div className="hidden md:flex relative w-0 z-30 items-center justify-center">
                  <button
                    onClick={() => addColorAt(index)}
                    title="Insert Color"
                    className="w-7 h-7 -ml-3.5 rounded-full bg-white text-slate-700 hover:bg-blue-600 hover:text-white shadow-lg border border-slate-200 flex items-center justify-center opacity-0 hover:opacity-100 transition-all hover:scale-125"
                  >
                    <Plus className="w-4 h-4 stroke-[3]" />
                  </button>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>

      {/* Shades Popover */}
      {activeShadeIndex !== null && (
        <ShadesPopover
          isOpen={true}
          onClose={() => setActiveShadeIndex(null)}
          currentColor={colors[activeShadeIndex].hex}
          onSelectColor={(newHex) => updateColorHex(activeShadeIndex, newHex)}
        />
      )}
    </div>
  );
};
