import React from 'react';
import { AppMode } from '../types';
import { Terminal, Volume2, VolumeX, Moon, Sun, BookOpen, Award, Sparkles } from 'lucide-react';
import { sounds } from '../utils/sound';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  completedLessonIds: number[];
  totalLessons: number;
  isDark: boolean;
  onToggleTheme: () => void;
  onOpenCheatSheet: () => void;
}

export const getBeltInfo = (completedCount: number, total: number) => {
  if (completedCount >= total && total > 0) {
    return { name: 'Black Belt Sensei', color: 'bg-neutral-900 text-emerald-400 border-emerald-500/50', dotColor: 'bg-emerald-400' };
  }
  if (completedCount >= 11) {
    return { name: 'Brown Belt', color: 'bg-amber-900/40 text-amber-300 border-amber-700/50', dotColor: 'bg-amber-600' };
  }
  if (completedCount >= 9) {
    return { name: 'Blue Belt', color: 'bg-blue-900/40 text-blue-300 border-blue-600/50', dotColor: 'bg-blue-500' };
  }
  if (completedCount >= 6) {
    return { name: 'Green Belt', color: 'bg-emerald-900/40 text-emerald-300 border-emerald-600/50', dotColor: 'bg-emerald-500' };
  }
  if (completedCount >= 3) {
    return { name: 'Yellow Belt', color: 'bg-yellow-900/40 text-yellow-300 border-yellow-600/50', dotColor: 'bg-yellow-400' };
  }
  return { name: 'White Belt', color: 'bg-neutral-800 text-neutral-300 border-neutral-700', dotColor: 'bg-neutral-300' };
};

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  completedLessonIds,
  totalLessons,
  isDark,
  onToggleTheme,
  onOpenCheatSheet
}) => {
  const [soundEnabled, setSoundEnabled] = React.useState(sounds.isEnabled());
  const belt = getBeltInfo(completedLessonIds.length, totalLessons);

  const handleToggleSound = () => {
    const next = sounds.toggle();
    setSoundEnabled(next);
  };

  const navItems: { id: AppMode; label: string; badge?: string }[] = [
    { id: 'intro', label: 'Intro & Lore' },
    { id: 'learn', label: 'Learn (12 Lessons)', badge: `${completedLessonIds.length}/${totalLessons}` },
    { id: 'translate', label: 'Translate' },
    { id: 'playground', label: 'Playground' }
  ];

  return (
    <header
      id="main-app-header"
      className={`sticky top-0 z-40 w-full border-b backdrop-blur-md transition-colors ${
        isDark
          ? 'bg-neutral-950/90 border-neutral-800/80 text-neutral-100'
          : 'bg-white/90 border-neutral-200 text-neutral-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <button
            id="brand-logo-btn"
            onClick={() => onSelectMode('intro')}
            className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-neutral-950 shadow-md shadow-emerald-950/20 group-hover:scale-105 transition-transform">
              <Terminal className="w-5 h-5 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight font-mono">Regex<span className="text-emerald-500">Dojo</span></span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-400 font-mono font-semibold border border-emerald-500/30">
                  v1.0
                </span>
              </div>
              <p className={`text-[10px] tracking-tight leading-none hidden sm:block ${isDark ? 'text-neutral-400' : 'text-neutral-500'}`}>
                Taming black magic since 1951
              </p>
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav id="desktop-nav-links" className="hidden md:flex items-center gap-1 bg-neutral-900/40 p-1 rounded-xl border border-neutral-800/50">
          {navItems.map((item) => {
            const isActive = currentMode === item.id;
            return (
              <button
                key={item.id}
                id={`nav-link-${item.id}`}
                onClick={() => onSelectMode(item.id)}
                className={`relative px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-emerald-500 text-neutral-950 font-semibold shadow-xs'
                    : isDark
                    ? 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                }`}
              >
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                      isActive
                        ? 'bg-neutral-950/20 text-neutral-950'
                        : isDark
                        ? 'bg-neutral-800 text-emerald-400'
                        : 'bg-neutral-200 text-emerald-700'
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
            title="Your current rank in RegexDojo. Complete all 12 lessons to earn the Black Belt!"
            className={`flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-medium border transition-all hover:opacity-90 ${belt.color}`}
          >
            <span className={`w-2 h-2 rounded-full animate-pulse ${belt.dotColor}`} />
            <span className="hidden sm:inline font-semibold">{belt.name}</span>
            <span className="sm:hidden font-mono font-bold">{completedLessonIds.length}/12</span>
            {completedLessonIds.length === totalLessons && (
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            )}
          </button>

          {/* Quick Cheat Sheet button */}
          <button
            id="open-cheatsheet-header-btn"
            onClick={onOpenCheatSheet}
            title="Open Quick Reference Cheat Sheet"
            className={`p-2 rounded-lg border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isDark
                ? 'border-neutral-800 bg-neutral-900/60 hover:bg-neutral-800 text-neutral-300'
                : 'border-neutral-200 bg-neutral-100 hover:bg-neutral-200 text-neutral-700'
            }`}
          >
            <BookOpen className="w-4 h-4 text-emerald-500" />
            <span className="hidden lg:inline">Cheat Sheet</span>
          </button>

          {/* Sound FX toggle */}
          <button
            id="toggle-sound-btn"
            onClick={handleToggleSound}
            title={soundEnabled ? 'Sound Effects Active' : 'Sound Effects Muted'}
            className={`p-2 rounded-lg border transition-colors ${
              soundEnabled
                ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10'
                : isDark
                ? 'border-neutral-800 text-neutral-500 hover:text-neutral-300'
                : 'border-neutral-200 text-neutral-400 hover:text-neutral-600'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Theme toggle */}
          <button
            id="toggle-theme-btn"
            onClick={onToggleTheme}
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            className={`p-2 rounded-lg border transition-colors ${
              isDark
                ? 'border-neutral-800 text-neutral-300 hover:bg-neutral-800'
                : 'border-neutral-200 text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-600" />}
          </button>
        </div>
      </div>
    </header>
  );
};
