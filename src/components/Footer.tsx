import React from 'react';
import { AppMode } from '../types';
import { Sparkles, BookOpen, GraduationCap, ArrowLeftRight, Play, Terminal } from 'lucide-react';

interface FooterProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  isDark: boolean;
  onOpenCheatSheet: () => void;
  completedCount: number;
}

export const Footer: React.FC<FooterProps> = ({
  currentMode,
  onSelectMode,
  isDark,
  onOpenCheatSheet,
  completedCount
}) => {
  return (
    <footer
      id="main-app-footer"
      className={`border-t transition-colors ${
        isDark
          ? 'bg-neutral-950 border-neutral-850 text-neutral-400'
          : 'bg-neutral-50 border-neutral-200 text-neutral-600'
      }`}
    >
      {/* Mobile Sticky Tab Bar (shown on small screens) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-neutral-950/95 backdrop-blur-lg border-t border-neutral-800 px-2 py-2 flex items-center justify-around">
        <button
          id="mobile-nav-intro"
          onClick={() => onSelectMode('intro')}
          className={`flex flex-col items-center gap-1 p-1 text-[11px] ${
            currentMode === 'intro' ? 'text-emerald-400 font-semibold' : 'text-neutral-400'
          }`}
        >
          <Terminal className="w-4 h-4" />
          <span>Philosophy</span>
        </button>
        <button
          id="mobile-nav-learn"
          onClick={() => onSelectMode('learn')}
          className={`flex flex-col items-center gap-1 p-1 text-[11px] relative ${
            currentMode === 'learn' ? 'text-emerald-400 font-semibold' : 'text-neutral-400'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Learn ({completedCount})</span>
        </button>
        <button
          id="mobile-nav-translate"
          onClick={() => onSelectMode('translate')}
          className={`flex flex-col items-center gap-1 p-1 text-[11px] ${
            currentMode === 'translate' ? 'text-emerald-400 font-semibold' : 'text-neutral-400'
          }`}
        >
          <ArrowLeftRight className="w-4 h-4" />
          <span>Translate</span>
        </button>
        <button
          id="mobile-nav-playground"
          onClick={() => onSelectMode('playground')}
          className={`flex flex-col items-center gap-1 p-1 text-[11px] ${
            currentMode === 'playground' ? 'text-emerald-400 font-semibold' : 'text-neutral-400'
          }`}
        >
          <Play className="w-4 h-4" />
          <span>Playground</span>
        </button>
        <button
          id="mobile-nav-cheatsheet"
          onClick={onOpenCheatSheet}
          className="flex flex-col items-center gap-1 p-1 text-[11px] text-neutral-400"
        >
          <BookOpen className="w-4 h-4" />
          <span>Cheat Sheet</span>
        </button>
      </div>

      {/* Desktop footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 hidden md:flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 font-mono text-neutral-300">
            <span className="font-bold text-emerald-400">RegexDojo</span>
            <span>&bull;</span>
            <span className={isDark ? 'text-neutral-400' : 'text-neutral-500'}>
              &quot;Some people, when confronted with a problem, think &apos;I know, I&apos;ll use regex.&apos; Now they have two problems.&quot;
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button
            id="footer-cheat-sheet-btn"
            onClick={onOpenCheatSheet}
            className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Reference Cheat Sheet</span>
          </button>
          <span className="text-neutral-700">&bull;</span>
          <span className="text-neutral-500">
            Runs entirely in your browser with zero telemetry.
          </span>
        </div>
      </div>
    </footer>
  );
};
