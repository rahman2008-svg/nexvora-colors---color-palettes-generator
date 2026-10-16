import React, { useState, useMemo } from 'react';
import { Search, Heart, ArrowRight, Copy, Check, Eye, Filter } from 'lucide-react';
import { CURATED_PALETTES } from '../data/curatedPalettes';
import { PalettePreset } from '../types';
import { getColorName, getReadableTextColor } from '../utils/colorUtils';

interface ExploreViewProps {
  onOpenInGenerator: (colors: string[]) => void;
  onOpenInVisualizer: (colors: string[]) => void;
}

type CategoryFilter = 'all' | 'trending' | 'pastel' | 'warm' | 'cool' | 'neon' | 'vintage' | 'dark' | 'nature';

export const ExploreView: React.FC<ExploreViewProps> = ({
  onOpenInGenerator,
  onOpenInVisualizer,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [likesMap, setLikesMap] = useState<Record<string, { count: number; liked: boolean }>>(() => {
    const init: Record<string, { count: number; liked: boolean }> = {};
    CURATED_PALETTES.forEach((p) => {
      init[p.id] = { count: p.likes, liked: false };
    });
    return init;
  });

  const categories: { id: CategoryFilter; label: string }[] = [
    { id: 'all', label: 'All Palettes' },
    { id: 'trending', label: 'Trending' },
    { id: 'pastel', label: 'Pastel' },
    { id: 'warm', label: 'Warm' },
    { id: 'cool', label: 'Cool' },
    { id: 'neon', label: 'Neon' },
    { id: 'vintage', label: 'Vintage' },
    { id: 'dark', label: 'Dark' },
    { id: 'nature', label: 'Nature' },
  ];

  const filteredPalettes = useMemo(() => {
    return CURATED_PALETTES.filter((p) => {
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesCat;

      const matchesName = p.name.toLowerCase().includes(q);
      const matchesHex = p.colors.some((c) => c.toLowerCase().includes(q.replace('#', '')));
      const matchesColorName = p.colors.some((c) => getColorName(c).toLowerCase().includes(q));

      return matchesCat && (matchesName || matchesHex || matchesColorName);
    });
  }, [selectedCategory, searchQuery]);

  const toggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikesMap((prev) => {
      const current = prev[id] || { count: 100, liked: false };
      return {
        ...prev,
        [id]: {
          count: current.liked ? current.count - 1 : current.count + 1,
          liked: !current.liked,
        },
      };
    });
  };

  const copyPalette = (palette: PalettePreset, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(palette.colors.map((c) => `#${c}`).join(', '));
    setCopiedId(palette.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Title & Search Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Explore Trending Palettes</h1>
          <p className="text-sm text-slate-600 mt-1">
            Browse {CURATED_PALETTES.length}+ handcrafted color schemes. Copy hex codes, preview in UI, or load directly into the generator.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, color, or hex..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-xs"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Palettes Grid */}
      {filteredPalettes.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 space-y-3">
          <p className="text-base font-semibold text-slate-800">No palettes match your search query.</p>
          <p className="text-xs text-slate-500">Try searching for "Pastel", "Forest", "Sunset", or clear the filter.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPalettes.map((palette) => {
            const isCopied = copiedId === palette.id;
            const likeData = likesMap[palette.id] || { count: palette.likes, liked: false };

            return (
              <div
                key={palette.id}
                onClick={() => onOpenInGenerator(palette.colors)}
                className="group bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-xl hover:border-slate-300 transition-all duration-200 flex flex-col overflow-hidden cursor-pointer"
              >
                {/* 5 Color Stripes */}
                <div className="h-32 w-full flex">
                  {palette.colors.map((c, i) => (
                    <div
                      key={i}
                      className="flex-1 h-full relative group/stripe flex items-end justify-center pb-2 transition-transform"
                      style={{ backgroundColor: `#${c}` }}
                    >
                      <span
                        className="opacity-0 group-hover/stripe:opacity-100 font-mono text-[10px] font-bold px-1 py-0.5 rounded transition-opacity"
                        style={{ color: getReadableTextColor(c) }}
                      >
                        #{c}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Card Meta & Actions */}
                <div className="p-4 flex items-center justify-between gap-2 border-t border-slate-100">
                  <div className="min-w-0">
                    <h3 className="text-sm font-bold text-slate-900 truncate group-hover:text-blue-600 transition-colors">
                      {palette.name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-400 capitalize mt-0.5">
                      <span>{palette.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{palette.colors.length} colors</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    {/* Like button */}
                    <button
                      onClick={(e) => toggleLike(palette.id, e)}
                      title="Favorite palette"
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        likeData.liked
                          ? 'bg-rose-50 text-rose-600 border border-rose-200'
                          : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${likeData.liked ? 'fill-rose-600 text-rose-600' : ''}`} />
                      <span className="font-mono text-[11px]">{likeData.count}</span>
                    </button>

                    {/* Copy Hexes button */}
                    <button
                      onClick={(e) => copyPalette(palette, e)}
                      title="Copy all hex codes"
                      className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      {isCopied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                    </button>

                    {/* Preview in visualizer */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onOpenInVisualizer(palette.colors);
                      }}
                      title="Preview in Visualizer"
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>

                    {/* Open in generator arrow */}
                    <button
                      title="Open in Generator"
                      className="p-1.5 text-slate-400 group-hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
