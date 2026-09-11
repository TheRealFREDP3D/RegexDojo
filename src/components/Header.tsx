import React from 'react';
import { AppMode, ThemeId } from '../types';
import { Terminal, Volume2, VolumeX, Moon, Sun, BookOpen, Award, Sparkles, Palette } from 'lucide-react';
import { sounds } from '../utils/sound';
import { THEMES } from '../data/themes';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  completedLessonIds: number[];
  totalLessons: number;
  isDark: boolean;
  currentTheme?: ThemeId;
  onOpenThemeSettings?: () => void;
  onToggleTheme: () => void;
  onOpenCheatSheet: () => void;
}

export const getBeltInfo = (completedCount: number, total: number) => {
  if (completedCount >= total && total > 0) {
    return { name: 'Ember Sensei', color: 'bg-black/80 text-rose-300 border-rose-500/70 shadow-[0_0_15px_rgba(239,35,60,0.35)]', dotColor: 'bg-rose-500' };
  }
  if (completedCount >= 11) {
    return { name: 'Ruby Belt', color: 'bg-rose-950/60 text-rose-300 border-rose-600/50', dotColor: 'bg-rose-500' };
  }
  if (completedCount >= 9) {
    return { name: 'Amethyst Belt', color: 'bg-purple-950/60 text-purple-300 border-purple-600/50', dotColor: 'bg-purple-400' };
  }
  if (completedCount >= 6) {
    return { name: 'Topaz Belt', color: 'bg-amber-950/60 text-amber-300 border-amber-600/50', dotColor: 'bg-amber-500' };
  }
  if (completedCount >= 3) {
    return { name: 'Flame Belt', color: 'bg-orange-950/60 text-orange-300 border-orange-600/50', dotColor: 'bg-orange-400' };
  }
  return { name: 'White Belt', color: 'bg-neutral-900/60 text-neutral-300 border-neutral-700/60', dotColor: 'bg-neutral-400' };
};

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  completedLessonIds,
  totalLessons,
  isDark,
  currentTheme = 'warm-halo',
  onOpenThemeSettings,
  onToggleTheme,
  onOpenCheatSheet
}) => {
  const [soundEnabled, setSoundEnabled] = React.useState(sounds.isEnabled());
  const belt = getBeltInfo(completedLessonIds.length, totalLessons);
  const activeThemeObj = THEMES.find((t) => t.id === currentTheme) || THEMES[0];

  const handleToggleSound = () => {
    const next = sounds.toggle();
    setSoundEnabled(next);
  };

  const navItems: { id: AppMode; label: string; badge?: string }[] = [
    { id: 'intro', label: 'Philosophy' },
    { id: 'learn', label: 'Learn (12 Lessons)', badge: `${completedLessonIds.length}/${totalLessons}` },
    { id: 'translate', label: 'Translate' },
    { id: 'playground', label: 'Playground' }
  ];

  return (
    <header
      id="main-app-header"
      className="sticky top-0 z-40 w-full ember-glass-panel border-b border-rose-500/20 text-neutral-100 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            id="brand-logo-btn"
            onClick={() => onSelectMode('intro')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-rose-950/60 border border-rose-400/40 group-hover:scale-105 group-hover:shadow-[0_0_20px_rgba(239,35,60,0.5)] transition-all">
              <Terminal className="w-5 h-5 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight font-mono">Regex<span className="text-rose-500 text-glow-crimson">Dojo</span></span>
                <span
                  id="header-active-theme-badge"
                  onClick={(e) => {
                    e.stopPropagation();
                    onOpenThemeSettings?.();
                  }}
                  title="Click to open theme settings"
                  className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono font-semibold border border-rose-500/40 uppercase hover:bg-rose-500/30 transition-all cursor-pointer"
                >
                  {activeThemeObj.name}
                </span>
              </div>
              <p className="text-[10px] tracking-tight leading-none hidden sm:block text-neutral-400">
                Frosted glass &bull; Multi-theme terminal
              </p>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav id="desktop-nav-links" className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 backdrop-blur-md">
          {navItems.map((item) => {
            const isActive = currentMode === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onSelectMode(item.id)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                  isActive
                    ? 'btn-ember-primary font-bold shadow-md'
                    : 'text-neutral-300 hover:text-white hover:bg-white/10'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive
                        ? 'bg-black/30 text-white'
                        : 'bg-rose-950/60 text-rose-300 border border-rose-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Right utility controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Belt status pill */}
          <button
            id="belt-rank-badge"
            onClick={() => onSelectMode('learn')}
            title="Your current rank in RegexDojo. Complete all 12 lessons to earn the Ember Sensei rank!"
            className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border backdrop-blur-md transition-all hover:opacity-95 cursor-pointer ${belt.color}`}
          >
            <span className={`w-2 h-2 rounded-full animate-pulse ${belt.dotColor}`} />
            <span className="hidden sm:inline font-semibold">{belt.name}</span>
            <span className="sm:hidden font-mono font-bold">{completedLessonIds.length}/12</span>
            {completedLessonIds.length === totalLessons && (
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
            )}
          </button>

          {/* Theme Settings Button */}
          {onOpenThemeSettings && (
            <button
              id="theme-settings-header-btn"
              onClick={onOpenThemeSettings}
              title={`Theme: ${activeThemeObj.name}. Click to change theme.`}
              className="px-2.5 py-1.5 rounded-lg border border-rose-500/35 bg-black/40 hover:bg-rose-500/15 text-neutral-200 hover:text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer shadow-xs"
            >
              <Palette className="w-4 h-4 text-rose-400" />
              <span className="hidden sm:inline font-mono text-[11px] uppercase tracking-wide">
                Themes
              </span>
            </button>
          )}

          {/* Quick Cheat Sheet button */}
          <button
            id="open-cheatsheet-header-btn"
            onClick={onOpenCheatSheet}
            title="Open Quick Reference Cheat Sheet"
            className="p-2 rounded-lg border border-white/10 bg-black/40 hover:bg-white/10 text-neutral-300 hover:text-white text-xs font-medium flex items-center gap-1.5 backdrop-blur-md transition-all cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-rose-400" />
            <span className="hidden lg:inline">Cheat Sheet</span>
          </button>

          {/* Sound FX toggle */}
          <button
            id="toggle-sound-btn"
            onClick={handleToggleSound}
            title={soundEnabled ? 'Sound Effects Active' : 'Sound Effects Muted'}
            className={`p-2 rounded-lg border backdrop-blur-md transition-colors cursor-pointer ${
              soundEnabled
                ? 'border-rose-500/40 text-rose-400 bg-rose-500/15 shadow-[0_0_10px_rgba(239,35,60,0.2)]'
                : 'border-white/10 text-neutral-400 hover:text-neutral-200 bg-black/40'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme toggle */}
          <button
            id="toggle-theme-btn"
            onClick={onToggleTheme}
            title={isDark ? 'Dark frosted glass active' : 'Light glass mode'}
            className="p-2 rounded-lg border border-white/10 bg-black/40 text-neutral-300 hover:text-white hover:bg-white/10 transition-colors backdrop-blur-md cursor-pointer"
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-300" />}
          </button>
        </div>
      </div>
    </header>
  );
};
