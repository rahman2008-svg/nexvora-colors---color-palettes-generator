import React from 'react';
import { X, Check } from 'lucide-react';
import { generateShadesAndTints, getReadableTextColor, cleanHex } from '../utils/colorUtils';

interface ShadesPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  currentColor: string;
  onSelectColor: (newHex: string) => void;
}

export const ShadesPopover: React.FC<ShadesPopoverProps> = ({
  isOpen,
  onClose,
  currentColor,
  onSelectColor,
}) => {
  if (!isOpen) return null;

  const cleanCurrent = cleanHex(currentColor);
  const shades = generateShadesAndTints(cleanCurrent);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 bg-slate-50">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Shades & Tints</h4>
            <p className="text-xs text-slate-500 font-mono">Base: #{cleanCurrent}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-lg transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3 space-y-1.5 max-h-80 overflow-y-auto">
          {shades.map((shadeHex, idx) => {
            const isSelected = cleanHex(shadeHex) === cleanCurrent;
            const textColor = getReadableTextColor(shadeHex);

            return (
              <button
                key={idx}
                onClick={() => {
                  onSelectColor(shadeHex);
                  onClose();
                }}
                className="w-full h-11 rounded-xl flex items-center justify-between px-4 text-xs font-mono font-semibold transition-all hover:scale-[1.02] shadow-xs active:scale-[0.99]"
                style={{ backgroundColor: `#${shadeHex}`, color: textColor }}
              >
                <span>#{shadeHex}</span>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] opacity-75">{idx < 5 ? `Tint ${5 - idx}` : `Shade ${idx - 4}`}</span>
                  {isSelected && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
