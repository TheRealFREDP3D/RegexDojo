import React, { useState, useEffect } from 'react';
import { X, Palette, Check, ExternalLink, Sparkles, Sliders, Sun, Moon, Monitor } from 'lucide-react';
import { ThemeId } from '../types';
import { THEMES } from '../data/themes';
import { sounds } from '../utils/sound';
import { useFocusTrap } from '../hooks/useFocusTrap';

type ThemePreference = 'system' | 'dark' | 'light';

interface ThemeSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ThemeId;
  themePreference: ThemePreference;
  onSelectTheme: (themeId: ThemeId) => void;
  onSetPreference: (pref: ThemePreference) => void;
}

export const ThemeSettingsModal: React.FC<ThemeSettingsModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  themePreference,
  onSelectTheme,
  onSetPreference
}) => {
  const [filterCategory, setFilterCategory] = useState<'All' | 'Custom Style' | 'VSCode Classic'>('All');
  const cardRef = useFocusTrap<HTMLDivElement>(isOpen, onClose);

  if (!isOpen) return null;

  const filteredThemes = THEMES.filter((t) => {
    if (filterCategory === 'All') return true;
    return t.category === filterCategory;
  });

  const handlePickTheme = (id: ThemeId) => {
    sounds.playClick();
    onSelectTheme(id);
  };

  return (
    <div
      id="theme-settings-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="theme-settings-modal-card"
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="theme-settings-modal-title"
        className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl flex flex-col glazz-panel shadow-2xl overflow-hidden text-neutral-100 border border-white/15"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10 bg-black/40 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white/10 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.15)]">
              <Palette className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 id="theme-settings-modal-title" className="text-lg font-bold tracking-tight heading-bar-h3 text-neutral-100">
                  Theme Settings
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 font-mono font-semibold border border-white/15">
                  6 Aesthetics
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Switch between custom retro glass and iconic developer editor palettes.
              </p>
            </div>
          </div>

          <button
            id="close-theme-modal-btn"
            onClick={onClose}
            className="p-2 rounded-xl transition-colors hover:bg-white/10 text-neutral-400 hover:text-white cursor-pointer"
            aria-label="Close theme settings"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Categories Bar */}
        <div className="px-6 py-3 border-b border-white/10 bg-black/50 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs text-neutral-400 font-semibold flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5" />
              Filter:
            </span>
            {(['All', 'Custom Style', 'VSCode Classic'] as const).map((cat) => (
              <button
                key={cat}
                id={`filter-theme-${cat.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setFilterCategory(cat)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  filterCategory === cat
                    ? 'btn-glazz-cta text-white shadow-xs'
                    : 'bg-black/40 border border-white/10 text-neutral-400 hover:text-neutral-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="text-[11px] text-neutral-400 font-mono">
            Active: <span className="font-bold text-white uppercase">{currentTheme.replace('-', ' ')}</span>
          </div>
        </div>

        {/* Theme Cards Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)] space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredThemes.map((theme) => {
              const isSelected = currentTheme === theme.id;

              return (
                <div
                  key={theme.id}
                  id={`theme-card-${theme.id}`}
                  onClick={() => handlePickTheme(theme.id)}
                  className={`group relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-2 shadow-xl scale-[1.01]'
                      : 'border-white/10 hover:border-white/30 bg-black/40 hover:bg-black/60'
                  }`}
                  style={{
                    borderColor: isSelected ? theme.palette.primary : undefined,
                    boxShadow: isSelected ? `0 0 24px -2px ${theme.palette.glow}` : undefined,
                    backgroundColor: isSelected ? 'rgba(0, 0, 0, 0.65)' : undefined
                  }}
                >
                  <div>
                    {/* Header line: Title, Category badge, Selection check */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span
                            className="w-3.5 h-3.5 rounded-full shadow-sm"
                            style={{
                              backgroundColor: theme.palette.primary,
                              boxShadow: `0 0 8px ${theme.palette.primary}`
                            }}
                          />
                          <h3 className="text-base font-extrabold tracking-tight text-white font-mono">
                            {theme.name}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] px-2 py-0.5 rounded-md font-mono bg-white/10 text-neutral-300 border border-white/10">
                            {theme.category}
                          </span>
                          {theme.sourceUrl ? (
                            <a
                              href={theme.sourceUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              className="text-[10px] text-neutral-400 hover:text-white flex items-center gap-0.5 transition-colors underline decoration-dotted"
                              title={`View repository for ${theme.sourceLabel}`}
                            >
                              <span>{theme.sourceLabel}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ) : (
                            <span className="text-[10px] text-neutral-400 font-mono">
                              {theme.sourceLabel}
                            </span>
                          )}
                        </div>
                      </div>

                      {isSelected && (
                        <span
                          className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full text-black font-mono shadow-md animate-fade-in"
                          style={{ backgroundColor: theme.palette.primary }}
                        >
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Active</span>
                        </span>
                      )}
                    </div>

                    {/* Tagline */}
                    <p className="text-xs text-neutral-300 mt-3 leading-relaxed">
                      {theme.tagline}
                    </p>

                    {/* Color Swatch Bar */}
                    <div className="mt-4 pt-3 border-t border-white/10">
                      <div className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold mb-1.5 flex items-center gap-1">
                        <span>Palette Swatches</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div
                          className="flex-1 h-5 rounded-md border border-white/20 shadow-xs"
                          style={{ backgroundColor: theme.palette.primary }}
                          title={`Primary Accent: ${theme.palette.primary}`}
                        />
                        <div
                          className="flex-1 h-5 rounded-md border border-white/20 shadow-xs"
                          style={{ backgroundColor: theme.palette.secondary }}
                          title={`Secondary Highlight: ${theme.palette.secondary}`}
                        />
                        <div
                          className="flex-1 h-5 rounded-md border border-white/20 shadow-xs"
                          style={{ backgroundColor: theme.palette.background }}
                          title={`Canvas Background: ${theme.palette.background}`}
                        />
                        <div
                          className="flex-1 h-5 rounded-md border border-white/20 shadow-xs"
                          style={{ backgroundColor: theme.palette.panel }}
                          title={`Panel Background: ${theme.palette.panel}`}
                        />
                        <div
                          className="flex-1 h-5 rounded-md border border-white/20 shadow-xs"
                          style={{ backgroundColor: theme.palette.text }}
                          title={`Text: ${theme.palette.text}`}
                        />
                      </div>
                    </div>

                    {/* Mini Code Snippet Preview */}
                    <div className="mt-3">
                      <div
                        className="p-2.5 rounded-xl font-mono text-xs border flex items-center justify-between"
                        style={{
                          backgroundColor: theme.palette.background,
                          borderColor: theme.palette.border,
                          color: theme.palette.text
                        }}
                      >
                        <div className="flex items-center gap-1.5">
                          <span style={{ color: theme.palette.secondary }}>const</span>
                          <span style={{ color: theme.palette.primary }}>re</span>
                          <span>=</span>
                          <span style={{ color: theme.palette.primary, fontWeight: 'bold' }}>
                            {theme.sampleCode}
                          </span>
                        </div>
                        <span
                          className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold"
                          style={{
                            backgroundColor: `${theme.palette.primary}25`,
                            color: theme.palette.primary,
                            border: `1px solid ${theme.palette.primary}40`
                          }}
                        >
                          MATCH
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Apply / Active button */}
                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                    <span className="text-[11px] text-neutral-400 font-mono">
                      {isSelected ? 'Applied to session' : 'Click to apply'}
                    </span>
                    <button
                      id={`apply-theme-btn-${theme.id}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePickTheme(theme.id);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
                        isSelected
                          ? 'bg-white/10 text-white border border-white/20 font-bold'
                          : 'hover:bg-white/10 text-neutral-300 hover:text-white border border-transparent hover:border-white/10'
                      }`}
                    >
                      {isSelected ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Applied</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Select Theme</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/60 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400 font-mono">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Theme persists automatically in local storage.</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-neutral-500">Light/Dark:</span>
            {([
              { key: 'system' as const, label: 'System', icon: Monitor },
              { key: 'dark' as const, label: 'Dark', icon: Moon },
              { key: 'light' as const, label: 'Light', icon: Sun }
            ].map((opt) => {
              const Icon = opt.icon;
              const active = themePreference === opt.key;
              return (
                <button
                  key={opt.key}
                  id={`theme-preference-${opt.key}`}
                  onClick={() => {
                    sounds.playClick();
                    onSetPreference(opt.key);
                  }}
                  title={`Use ${opt.label} mode`}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer ${
                    active
                      ? 'btn-glazz-cta text-white shadow-xs'
                      : 'bg-black/40 border border-white/10 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{opt.label}</span>
                </button>
              );
            }))}
          </div>

          <button
            id="done-theme-modal-btn"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl btn-glazz-cta text-white font-bold cursor-pointer transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
